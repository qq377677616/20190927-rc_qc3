// pages/o_activity/o_activity.js

const request_01 = require('../../utils/request/request_01.js');

const request_05 = require('../../utils/request/request_05.js');

const router = require('../../utils/tool/router.js');

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		firstShow:false,
		options:{},
		page: 1,
		list: [],
	},
	initData(options) {
		const page = this.data.page;
		const userInfo = wx.getStorageSync('userInfo');

		request_05.myActivityList({
			user_id:userInfo.user_id, 
			page,
		})
			.then(res => {
				//success
				let list = res.data.data;


				this.setData({
					list,
				})
			})
			.catch((reason)=>{
				//fail

			})
			.then(()=>{
				//complete
				this.setData({
					options,
				})
			})
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		request_01.login(() => {
			this.initData(options);
		})
	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {
		this.setData({
			firstShow:true,
		})
	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {
		const firstShow = this.data.firstShow;
		const options = this.data.options;
		//返回刷新
		if( firstShow ){
			this.setData({
				page:1,
			})
			this.onLoad(options)
		}
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
		let page = this.data.page;
		const userInfo = wx.getStorageSync('userInfo');
		request_05.myActivityList({ 
			user_id:userInfo.user_id, 
			page: page + 1,
		})
			.then(res => {
				let list1 = this.data.list;
				let list2 = res.data.data;
				this.setData({
					list: [...list1, ...list2],
					page: page + 1,
				})
			})
	},

	/**
	 * 用户点击右上角分享
	 */
	//   onShareAppMessage: function () {

	//   },
	goActive(e) {
		
		const index = e.currentTarget.dataset.index;
		const list = this.data.list;
		const item = list[index];
		const activity_id = item.activity_id;//活动id
		const activity_type = item.activity_type;//活动类型\
		const screen = item.screen;

		switch (activity_type) {
			case 1:
				//抽奖
				router.jump_nav({
					url: `/pages/prize/prize?activity_id=${activity_id}`,
				})
				break;
			case 2:
				//投票
				if (screen) {
					router.jump_nav({
						url: `/pages/ad/ad?activity_id=${activity_id}`,
					})
				} else {
					router.jump_nav({
						url: `/pages/vote/vote?activity_id=${activity_id}`,
					})
				}
				break;
			case 3:
				//点亮
				router.jump_nav({
					url: `/pages/prize/prize?activity_id=${activity_id}`,
				})
				break;
			case 4:
				//集攒
				router.jump_nav({
					url: `/pages/vote/vote?activity_id=${activity_id}`,
				})
				break;
			case 5:
				//团购
				router.jump_nav({
					url: `/pages/assemble/pin/pin?activity_id=${activity_id}`,
				})
				break;
			case 7:
				//报名
				router.jump_nav({
					url: `/pages/sign_up/sign_up?activity_id=${activity_id}`,
				})
				break;
			case 11:
				//看车
				router.jump_nav({
					url: `/pages/vote/vote?activity_id=${activity_id}`,
				})
				break;
			case 12:
				//摇红包
				router.jump_nav({
					url: `/pages/shake_shake/shake_shake?activity_id=${activity_id}`,
				})
				break;
			case 13:
				//13	砍价
				router.jump_nav({
					url: `/pages/bargain_index/bargain_index?activity_id=${activity_id}`,
				})
				break;
		}
	},
	//查看所有活动
	lookActive() {
		router.jump_nav({ 
			url: "/pages/activity_list/activity_list" 
		});
	}
})