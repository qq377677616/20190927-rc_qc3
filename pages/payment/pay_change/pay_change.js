// pages/payment/pay_change/pay_change.js
const request_01 = require('../../../utils/request/request_01.js');

const request_05 = require('../../../utils/request/request_05.js');

const router = require('../../../utils/tool/router.js');

const tool = require('../../../utils/tool/tool.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    IMGSERVICE: app.globalData.IMGSERVICE,
    page:1,
  },
  
  //初始化数据
  initData(options){
    let cate_id = options.cate_id
    let page = this.data.page
    request_05.goodsList({ cate_id, page}).then(res=>{
      console.log(res,'res')
      if(res.data.status==1){
        this.setData({
          goodsData:res.data.data
        })
      }else{
        console.log('报错')
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    request_01.login(() => {
      this.initData(options);
    })
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