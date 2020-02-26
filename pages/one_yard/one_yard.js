// pages/one_yard/one_yard.js
const request_01 = require('../../utils/request/request_01.js');

const request_05 = require('../../utils/request/request_05.js');

const router = require('../../utils/tool/router.js');

const tool = require('../../utils/tool/tool.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    IMGSERVICE: app.globalData.IMGSERVICE,
  },

  //专营店列表
  storeList() {
    request_05.carList().then(res => {
      let storeList = res.data.data
      var selStoreList = carList.map(function (item, index, array) {
        return item.car_series_alias;
      });
      this.setData({
        storeList,
        selStoreList,
      })
    })
  },

  //车型列表
  carList() {
    request_05.carList().then(res => {
      let carList = res.data.data
      var selCarList = carList.map(function (item, index, array) {
        return item.car_series_alias;
      });
      this.setData({
        carList,
        selCarList,
      })
    })
  },

  // 选择专营店
  bindPickerStore(e) {
    const storeIndex = e.detail.value;
    console.log(storeIndex);
    this.setData({
      storeIndex,
    })
  },

  // 选择车型
  bindPickerCar(e) {
    const carIndex = e.detail.value;
    console.log(carIndex);
    this.setData({
      carIndex,
    })
  },

  // 初始化数据
  initData(){
    this.carList()
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.initData();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})