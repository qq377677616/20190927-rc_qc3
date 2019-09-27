// pages/activity_publish/activity_publish.js

const app = getApp();

const request_01 = require('../../utils/request/request_01.js');

const request_05 = require('../../utils/request/request_05.js');

const router = require('../../utils/tool/router.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    IMGSERVICEZ:app.globalData.IMGSERVICE,
    
  },
  headerBack: function (e) {
    let activity_id = this.data.activity_id;
    router.jump_nav({
      url: `/pages/vote/vote?activity_id=${activity_id}`,
    })
  },

  toVote(){
    let activity_id = this.data.activity_id;
    router.jump_nav({
      url: `/pages/vote/vote?activity_id=${activity_id}`,
    })
  },

  initData(options){
    let activity_id = options.activity_id;
    let user_id = wx.getStorageSync('userInfo').user_id;
    request_05.voteIndex({ activity_id, user_id}).then(res=>{
      let rank_list = res.data.data.rank_list;
      let is_win = res.data.data.is_win;
      let rating_time = res.data.data.rating_time;
      this.setData({
        rank_list,
        is_win,
        rating_time,
        activity_id,
      })
    })

    request_05.myVote({ activity_id, user_id}).then(res=>{
      console.log(res);
      let userInfo = res.data.data.info;
      this.setData({
        userInfo,
      })
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