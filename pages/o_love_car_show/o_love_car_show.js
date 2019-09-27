// pages/o_love_car_show/o_love_car_show.js
const request_04 = require('../../utils/request/request_04.js');

const request_01 = require('../../utils/request/request_01.js');

const route = require('../../utils/tool/router.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
	  carObj:{},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
	  request_01.login(() => {
      this.getcarInfo();
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

  },
	getcarInfo(){
		let dat = {
			user_id:wx.getStorageSync('userInfo').user_id,
			openid:wx.getStorageSync('userInfo').openid	
		}
		request_04.getcarInfo(dat).then((res)=>{
			console.log(res.data)
			if(res.data.status==1){
				this.setData({carObj:res.data.data})
			}
		}).catch((reason)=>{
			console.log(reason)
		})	
	},
	removeBind(){//解除绑定
		let obj = wx.getStorageSync('userInfo');
		let dat = {
			user_id:wx.getStorageSync('userInfo').user_id,
			openid:wx.getStorageSync('userInfo').openid	
		}
		request_04.removeCarinfo(dat).then((res)=>{
			console.log(res.data)
			if(res.data.status == 1){
				obj.user_type = 0;
				wx.setStorageSync('userInfo', obj);
				route.jump_back();
			}
		}).catch((reason)=>{
			console.log(reason)
		})
	},
	bindBack(){
		route.jump_nav({url:"/pages/index/index"});
	}
})