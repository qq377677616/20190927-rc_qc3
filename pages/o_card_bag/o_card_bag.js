// pages/o_card_bag/o_card_bag.js

const request_01 = require('../../utils/request/request_01.js')

const request_05 = require('../../utils/request/request_05.js')

const router = require('../../utils/tool/router.js')

const app = getApp();//获取应用实例

Page({

  /**
   * 页面的初始数据
   */
  data: {
    IMGSERVICE: app.globalData.IMGSERVICE,
	card_status:1,
	cardList:[]
  },

  // 初始化数据
  initData(){
    const user_id = wx.getStorageSync('userInfo').user_id;
    let card_status = this.data.card_status;
    request_05.voucherList({ user_id, card_status}).then(res=>{
      let cardList = res.data.data;
      if(res.data.status==1){
		  this.setData({
			  cardList,
			  card_status,
		  })
	  }
    })
  },

  // 点击切换
  update_status(e){
    let card_status = e.target.dataset.status;
	this.setData({card_status:card_status});
	this.initData();
  },

  // 卡券详情
  toCardDetail(e){
    console.log(e);
    const card_id = e.currentTarget.dataset.cardid;
    console.log(card_id)
    router.jump_nav({
      url: `/pages/o_card_bag_rule/o_card_bag_rule?card_id=${card_id}`,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    request_01.login(()=>{
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
//   onShareAppMessage: function () {

//   }
})