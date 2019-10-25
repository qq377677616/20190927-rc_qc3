// pages/o_prize_detail/o_prize_detail.js

const mta = require('../../utils/public/mta_analysis.js')

const request_01 = require('../../utils/request/request_01.js');

const request_03 = require('../../utils/request/request_03.js');

const method = require('../../utils/tool/method.js');

const router = require('../../utils/tool/router.js');

const authorization = require('../../utils/tool/authorization.js');

const alert = require('../../utils/tool/alert.js');

const app = getApp();//获取应用实例
Page({

  /**
   * 页面的初始数据
   */
  data: {
    IMGSERVICE: app.globalData.IMGSERVICE,
    prizeInfo:{},
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

  //页面初始化
  initData(options){
    const userInfo = wx.getStorageSync('userInfo');
    

    Promise.all([
      request_03.prizeDetail({
        user_id:userInfo.user_id,
        prize_id:options.prize_id,
      })
    ])
      .then((value)=>{
        //success
        const prizeInfo = value[0].data.data; 

        this.setData({
          prizeInfo,
        })
      })
      .catch((reason)=>{
        //fail

      })
      .then(()=>{
        //complete

      })
  },
  //查看快递物流
  lookWuLiu() {
    const prizeInfo = this.data.prizeInfo;
    const prize_id = prizeInfo.prize_id;
    router.jump_nav({
      url: `/pages/order_wuliu/order_wuliu?pageType=o_prize_detail&prize_id=${prize_id}`,
    })
  },
  //去领取
  getBtn(){
    const prizeInfo = this.data.prizeInfo;
    const card_code = prizeInfo.card_code;
    wx.navigateToMiniProgram({
      appId:'wx8f4ba17d7b77a1df',
      path: 'pages/busicard/busicard?card_code=' + card_code,
      extraData: {
        card_code,
      },
      envVersion: 'release',//develop、trial、release
      success(res) {
        // 打开成功
      }
    })
  },

  //复制
  copyBtn(){
    const prizeInfo = this.data.prizeInfo;
    const card_code = prizeInfo.card_code;
    wx.setClipboardData({
		  //准备复制的数据
		  data: card_code,
	  });
  },
})