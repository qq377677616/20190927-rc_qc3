// pages/bargain_state/bargain_state.js
import tool from '../../../../utils/public/tool.js';
import daojishi from '../../../../utils/public/util.js';
import request_04 from '../../../../utils/request/request_04.js';
import request_01 from '../../../../utils/request/request_01.js';
let shopTimes = '';
const app = getApp(); //获取应用实例
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
		]},
		bargain_id:null,// 砍价id
		bargainDat:{},//砍价信息对象
		restPrice:0,//剩余金额 
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		request_01.login(() => {
			this.setData({ bargain_id: options.bargain_id})
			this.getbargainInfo();
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
	onShareAppMessage: function (option) {
		
	},
	getbargainInfo(){// 获取砍价信息
		const userInfo = wx.getStorageSync('userInfo');
		let dat = {
			bargain_id:this.data.bargain_id,
				openid:userInfo.openid
		}
		request_04.bargain_info(dat).then((res)=>{
			if(res.data.status==1){
				console.log(res.data);
				this.setData({ 
				bargainDat: res.data.data, 
				restPrice: parseFloat((res.data.data.bargain_info.total_price) - parseFloat(res.data.data.bargain_info.bargain_price)).toFixed(2),
				})
			}else{
				tool.alert(res.data.msg)
			}
		})
	}
})