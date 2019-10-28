// pages/look_car_detail_ route/look_car_detail_ route.js

const app = getApp();//获取应用实例

Page({

  /**
   * 页面的初始数据
   */
  data: {
    IMGSERVICE: app.globalData.IMGSERVICE,
    imgList:[],
    bg:'',
    video:'',
    txt:'',
  },

  initData(options){
    let index = options.index;
    switch(index){
      case '0':
        this.setData({
          imgList: ['west_1', 'west_2', 'west_3', 'west_4', 'west_5'],
          bg:'west.png',
          video:'west_video',
          txt:'认知有界 思想无限'
        })
        break;
      case '1':
        this.setData({
          imgList: ['south_1', 'south_2', 'south_3', 'south_4', 'south_5'],
          bg: 'south.png',
          video: 'south_video',
          txt:'生涯有界 未来无限'
        })
        break;
      case '2':
        this.setData({
          imgList: ['north_1', 'north_2', 'north_3', 'north_4', 'north_5'],
          bg: 'north.png',
          video: 'north_video',
          txt:'视觉有限 视野无限'
        })
        break;  
      case '3':
        this.setData({
          imgList: ['east_1', 'east_2', 'east_3', 'east_4', 'east_5'],
          bg: 'east.png',
          video: 'east_video',
          txt:'美食有界 情谊无限'
        })
        break;    
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initData(options)
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