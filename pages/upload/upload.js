// pages/upload/upload.js

const router = require('../../utils/tool/router.js');

const request_01 = require('../../utils/request/request_01.js');


const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    IMGSERVICEZ: app.globalData.IMGSERVICE, 
  },

  upload(){
    let activity_id = wx.getStorageSync('activity_id');
    router.jump_red({
      url: `/pages/lj_partake/lj_partake`,
      })
    },
    no_upload() {
     router.jump_back();
    },


  initData(options){
    let activity_id = options.activity_id;
    this.setData({
      activity_id,
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