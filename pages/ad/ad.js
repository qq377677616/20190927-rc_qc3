// pages/ad/ad.js

const request_01 = require('../../utils/request/request_01.js');

const request_05 = require('../../utils/request/request_05.js');

const router = require('../../utils/tool/router.js');

const tool = require('../../utils/tool/tool.js');

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    IMGSERVICEZ: app.globalData.IMGSERVICE,
    min:3,
    isStart:false,
  },

  tiao() {
    console.log(1111)
    const activity_id = this.data.activity_id;
    router.jump_red({
      url: `/pages/vote/vote?activity_id=${activity_id}`,
    })
  },

  initData(options){
    tool.loading('加载中')
    let _this = this;
    const user_id = wx.getStorageSync('userInfo').user_id;
    const activity_id = options.activity_id;
    const screen = wx.getStorageSync('screen');
    this.setData({
      screen,
      activity_id,
    })
    tool.loading_h();
      let ding = setInterval(function () {
        let min = _this.data.min;
        min--;
        _this.setData({
          min,
        })
        if (min == 0) {
          clearInterval(ding);
          router.jump_red({
            url: `/pages/vote/vote?activity_id=${activity_id}`,
          })
        }
      }, 1000);
      this.setData({
        ding,
      })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    request_01.login(()=>{
      this.initData(options)
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.videoContext = wx.createVideoContext('myvideo', this);
    this.videoContext.requestFullScreen({ direction: 0 });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide:  function  ()  {
      const ding  =  this.data.ding;
      clearInterval(ding);
  },

    /**
     * 生命周期函数--监听页面卸载
     */
  onUnload:  function  ()  {
      const ding  =  this.data.ding;
      clearInterval(ding);
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