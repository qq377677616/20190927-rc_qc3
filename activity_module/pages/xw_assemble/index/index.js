// activity_module/pages/xw_assemble/index/index.js
const app = getApp(); //获取应用实例
import { assembleIndex } from '../../../../xw_api/index.js'
let userInfo = wx.getStorageSync('userInfo');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    IMGSERVICE: app.globalData.IMGSERVICE,
  },
  initData(options) {
    Promise.all([
      assembleIndex({
        data: {
          out_id: '17',
          openid: userInfo.openid
        }
      })
    ]).then((res) => {
      const { msg: msg0, status: status0, data:data0} = res[0].data

      
      console.warn(msg0,status0,data0)
    }).catch((err)=>{

    })
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