// pages/bargain_state/bargain_state.js
const app = getApp();
const route = require('../../../../utils/tool/router.js');
const alert = require('../../../../utils/tool/alert.js');
const daojishi = require('../../../../utils/public/util.js');
import tool from '../../../../utils/tool/tool.js';
let shopTimes = '';
let selftime = '';
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		IMGSERVICE: app.globalData.IMGSERVICE,
		firstShow: false,
		page404: false,
		options: {},
		kjList: [{ name: 12 }, { name: 12 }, { name: 12 }, { name: 12 }, { name: 12 }],
		userName: '',//昵称
		userImg: '',	//头像
		freeData: [],//多少人免费拿到数据
		percent: 0,//砍价百分比
		shopInfo: { //buttom_type:1 还没砍价
			buttom_type:3
		},
		barRecord: { kj_friend_log:[
			{
			headimgurl: `${app.globalData.IMGSERVICE}/center/coin_01.png`,
			kj_price:55,
			nickname:'Tuem'
			},
			{
				headimgurl: `${app.globalData.IMGSERVICE}/center/coin_01.png`,
				kj_price: 55,
				nickname: 'Remuan'
			},
			{
				headimgurl: `${app.globalData.IMGSERVICE}/center/coin_01.png`,
				kj_price: 55,
				nickname: 'Jemes'
			},
			{
				headimgurl: `${app.globalData.IMGSERVICE}/center/coin_01.png`,
				kj_price: 55,
				nickname: '晚霞'
			},
			{
				headimgurl: `${app.globalData.IMGSERVICE}/center/coin_01.png`,
				kj_price: 55,
				nickname: '落日'
			}
		]}
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		
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
	onShareAppMessage: function (option) {
		
	}
	
})