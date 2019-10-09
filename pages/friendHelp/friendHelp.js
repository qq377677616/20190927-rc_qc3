// pages/friendHelp/friendHelp.js

const request_05 = require('../../utils/request/request_05.js')

const request_01 = require('../../utils/request/request_01.js');

const app = getApp();//获取应用实例
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		IMGSERVICE: app.globalData.IMGSERVICE,
    height:60,
    isShow:false,
	},
  initData(options) {
    let activity_id = options.activity_id;
    let openid = wx.getStorageSync('userInfo').openid;
    request_05.shakeDetail({ openid, activity_id }).then(res => {
      console.log(res);
      this.setData({
        helpList: res.data.data.help_list
      })
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