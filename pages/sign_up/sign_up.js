// pages/sign_up/sign_up.js

const request_01 = require('../../utils/request/request_01.js')

const request_05 = require('../../utils/request/request_05.js')

const tool = require('../../utils/tool/tool.js')

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    IMGSERVICE: app.globalData.IMGSERVICE,  
    isShowForm: false,
    isShowSuc: false,
    isPrize:false,
    isGoPrize:false,
    formsType: 3,//0为门店弹窗、1为详细地址弹窗、2为看车弹窗
    info:{}//信息
    
  },
  
  isShowRule() {
    this.isHidePop();
  },

  // 规则弹窗打开关闭
  isHidePop() {
    this.setData({ isShow: !this.data.isShow });
  },

  //留资弹窗打开关闭
  isShowForm() {
    this.setData({ isShowForm: !this.data.isShowForm })
  },

  // 报名弹窗打开关闭
  close(){
    this.setData({ isShowSuc: !this.data.isShowSuc })
  },

  // 是否中奖弹窗打开关闭
  isPrize(){
    this.setData({ isGoPrize: !this.data.isGoPrize })
  },

  // 获奖名单弹窗打开关闭
  close_prize(){
    this.setData({ isPrize: !this.data.isPrize })
  },

  // 领取留资打开、关闭
  // isPrize(){
  //   this.setData({ isPrize: !this.data.isPrize})
  // },

  // 点击打开中奖名单
  goPrize(){
    this.isPrize();
    this.close_prize();
  },

  // 获取formId
  formSubmit(e) {
    let formId = e.detail.formId;
    this.setData({
      formId,
    })
    this.isShowForm();
  },

  //留资领取
  submit(e) {
    console.log("留资表单", e.detail);
    let activity_id = this.data.activity_id;
    let user_id = wx.getStorageSync('userInfo').user_id;
    let mobile = e.detail.phone;
    let name = e.detail.name;
    let form_id = this.data.formId;
    let verify_code = e.detail.code;
    let is_join = this.data.is_join; //判断是否参与   0活动未开始，1活动中，用户未参与， 2活动中，用户已参与， 3活动结束，用户未参与， 4活动结束，用户已参与
    switch(is_join){
      case 1:
        request_05.participate({ activity_id, user_id, name, mobile, form_id }).then(res => {
          if (res.data.msg == "报名成功") {
            tool.alert('报名成功');
            setTimeout(() => {
              this.isShowForm();
              this.close();
            }, 1000)
          }
        })
        break;
      case 2:
        request_05.getUserMessage({ activity_id, user_id }).then(res => {
          console.log(res);
          if (res.data.status == 1) {
            tool.alert('领取成功');
          }
        })
        break;
    } 
  },

  // 领取奖品
  getPrize(e) {
    this.setData({ formsType: 1 })
    this.isShowForm();
  },

  // 初始化data
  initData(options){
    const activity_id = parseInt(options.activity_id);
    const user_id = wx.getStorageSync('userInfo').user_id;
    request_05.enterApply({ activity_id, user_id }).then(res=>{
      console.log(res);
      let is_join = res.data.data.status;
      let img_list = (res.data.data.img_list).slice(0,4);
      this.setData({ 
        info:res.data.data,
        img_list,
        activity_id,
        is_join
      });
    if(res.data.data.status==2){
      request_05.hasParticipate({activity_id,user_id}).then(res=>{
        console.log(res);
        let user_activity = res.data.data.user_activity;
        let the_winning_list = res.data.data.the_winning_list;
        this.setData({
          user_activity,
          the_winning_list,
        })
        let height;
        switch (user_activity.status){
          case 1 :
            // 控制scollview高度
            height = 335;
            this.setData({
              height
            })
            this.isPrize();
            break;

          case 0:
            height = 450;
            this.setData({
              height
            })
            this.close_prize();
            break;
        }
      })
    }
  })
},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    request_01.login(()=>{
      this.initData(options);
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})