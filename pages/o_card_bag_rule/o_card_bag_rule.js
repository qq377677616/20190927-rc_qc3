// pages/o_card_bag_rule/o_card_bag_rule.js

const request_01 = require('../../utils/request/request_01.js')

const request_05 = require('../../utils/request/request_05.js')

const router = require('../../utils/tool/router.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
	  card_rule:[],
	  list:[]
  },
  initData(options){
    const user_id  = wx.getStorageSync('userInfo').user_id;
    const card_id = options.card_id;
    request_05.voucherInfo({user_id,card_id}).then(res=>{
      let info = res.data.data;
      console.log(info)
      if (info.card_explain!=null){
        let list = info.card_explain.split('\r\n');
        this.setData({
          list,
        })
      }
      if (info.card_rule!=null){
        let card_rule = info.card_rule;
		  let list2 = card_rule.split('\r\n');
		console.log()
        this.setData({
			card_rule: list2
        })
      }
      this.setData({
        info,
      })
      
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    request_01.login((res)=>{
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