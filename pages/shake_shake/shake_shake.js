// pages/shake_shake/shake_shake.js

const request_01 = require('../../utils/request/request_01.js');

const router = require('../../utils/tool/router.js');

const util = require('../../utils/tool/util.js');

const tool = require('../../utils/tool/tool.js') 

const app = getApp();//获取应用实例

Page({

  /**
   * 页面的初始数据
   */
  data: {
    IMGSERVICE: app.globalData.IMGSERVICE,
	  quanPop:true,  //第三次弹窗
    openAj:false,   //前两次弹窗
    rulspop:false,  //规则弹窗
    isSuc:false,    //领取成功弹窗
    iscarActive:1,   //车主活动
    isVehicleOwnerHidePop:false,
    isShowForm: false,  //留资弹窗
    formType: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    request_01.login(() => {
      this.initData();
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

  },

  initData() {
    // 判断活动状态
    let activity_id = this.data.activity_id;
    let activityStatus = 1;     //活动状态
    let is_join = 1;            //是否参与
    let is_finish = 0;          //是否抽奖完成
    if (activityStatus == 2) {
      if (is_join == 0) {
        this.setData({
          isVehicleOwnerHidePop: true,
          popType: 1,
          text: "活动已结束"
        })
      } else {
        if (is_finish == 1) {
          this.setData({
            isVehicleOwnerHidePop: true,
            popType: 1,
            text: "活动已结束"
          })
        } else {
          router.jump_red({
            url: `/pages/friendHelp/friendHelp`,
          })
        }
      }
    } else {
      if (is_join == 1) {
        if (is_finish == 1) {
          router.jump_red({
            url: `/pages/friendHelp/friendHelp`,
          })
        } else {

        }
      }
    }

    if ((wx.getStorageSync("userInfo").user_type == 0 && this.data.iscarActive) || !wx.getStorageSync("userInfo").nickName) return;
    util.shake_one_shake2(true, 100, 2000, false, res => {
      if (res.status == 1) {
        tool.alert("摇一摇成功")
        console.log("摇一摇返回-->", res)
      }
    })
  },

  // 参与摇红包
  joinShake() {
    if ((wx.getStorageSync("userInfo").user_type == 0 && this.data.iscarActive) || !wx.getStorageSync("userInfo").nickName) return; 
  },

  getPrize() {
    this.closeBtn();
    this.setData({
      formType: 1,
      isShowForm: true,
    })
  },

  // 点击再摇一次
  once() {
    console.log('再摇一次')
  },

  // 打开规则弹窗
  openRule() {
    this.isOpenRule();
  },

  sucBtn() {

  },

  // 关闭规则弹窗
  closePop() {
    this.isOpenRule();
  },

  isSuc() {
    this.setData({ isSuc: !this.data.isSuc })
  },

  // 切换规则弹窗
  isOpenRule() {
    this.setData({ rulspop: !this.data.rulspop })
  },

  //关闭留资弹窗
  isShowForm() {
    this.setData({
      isShowForm: false,
    })
  },

  // 关闭前两次中奖弹窗
  isOpen() {
    console.log('x')
    this.setData({ openAj: !this.data.openAj })
  },

  // 关闭第三次中奖弹窗
  closeBtn() {
    this.setData({ quanPop: !this.data.quanPop })
  },

  // 弹窗永久弹一次
  setRule() {
    if (!wx.getStorageSync("isRule").vote) {
      this.setData({ rulspop: true });
      let _isRule = wx.getStorageSync("isRule") || {}
      _isRule.vote = true
      wx.setStorageSync("isRule", _isRule)
    }
  },

  //判断是否授权和是否是车主
  isVehicleOwner(e) {
    console.log('isVehicleOwner')
    if ((wx.getStorageSync("userInfo").nickName && wx.getStorageSync("userInfo").user_type == 1) || (e && e.target.dataset.type != 'ok') || (wx.getStorageSync("userInfo").nickName && !this.data.iscarActive)) return
    if (!wx.getStorageSync("userInfo").nickName) {
      this.setData({ popType: 2 })
    } else if (wx.getStorageSync("userInfo").user_type == 0) {
      this.setData({ popType: 3 })
    }
    this.isVehicleOwnerHidePop()
  },
  //授完权后处理
  getParme(e) {
    this.isVehicleOwnerHidePop()
    request_01.setUserInfo(e).then(res => {
      this.setData({
        userInfo: wx.getStorageSync('userInfo')
      })
      this.isVehicleOwner()
    })
  },
  //是否授权、绑定车主弹窗
  isVehicleOwnerHidePop() {
    this.setData({ isVehicleOwnerHidePop: !this.data.isVehicleOwnerHidePop })
  },
})