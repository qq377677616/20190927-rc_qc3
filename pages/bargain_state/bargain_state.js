// pages/bargain_state/bargain_state.js
const app = getApp();
const request_04 = require('../../utils/request/request_04.js');
const request_01 = require('../../utils/request/request_01.js');
const route = require('../../utils/tool/router.js');
const alert = require('../../utils/tool/alert.js');
const daojishi = require('../../utils/public/util.js');
let shopTimes ='';
let selftime = '';
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		IMGSERVICE: app.globalData.IMGSERVICE,
		kjList: [{ name: 12 }, { name: 12 }, { name: 12 }, { name: 12 }, { name: 12 }],
		succPop:false,
		shopInfo:{},
		userName:'',//昵称
		userImg:'',	//头像
		barRecord:[],//砍价记录
		freeData:[],//多少人免费拿到数据
		percent:0,//砍价百分比
		kj_id:0,
		barPrice:0,
		chuan_openid:'',//传进来的openid用来查询数据
		self_openid:'',//本地自己的openid 用来比较是否是同一个人 
		isRight:'',//是否是同一个人
		shareobj:'',//分享对象
		userInfo:'',
		activity_id:47,
		sy_num:1,
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		let shopData = JSON.parse(options.shopobj);
		console.log("40hang",shopData);
		// alert.alert(this.data.activity_id);
		request_01.login(() => {
			console.log("好友openid")
			let isfirst = shopData.price > 0;
			console.log('是否第一次', isfirst, '砍价金额', shopData.price)
			let flag = shopData.openid == wx.getStorageSync('userInfo').openid;
			console.log(shopData.openid == wx.getStorageSync('userInfo').openid, '本地openid', wx.getStorageSync('userInfo').openid, '进来的openid', shopData.openid)
			wx.setStorageSync('activity_id', wx.getStorageSync('activity_id') || shopData.activity_id);
			this.setData({
				activity_id: wx.getStorageSync('activity_id') || shopData.activity_id,
				barPrice: shopData.price, 
				shareobj: shopData,
				succPop: isfirst,
				isRight: flag,
				userName: shopData.nickname,
				userImg: shopData.titleImg,
				kj_id: shopData.id,
				chuan_openid: shopData.openid,
				userInfo: wx.getStorageSync("userInfo")
			})
			console.log(666)
			this.getBarcarod();
			console.log(777)
			
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
		this.getBarcarod();
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
		console.log(this.data.activity_id);
		let image = option.target.dataset.img;
		let shopobj = this.data.shareobj;
		shopobj.activity_id = this.data.activity_id;
		shopobj.price = 0;
		shopobj.self = 1;
		console.log("传出对象",shopobj);
		// wx.updateShareMenu({
		// 	      withShareTicket:  true,
		// 	      isUpdatableMessage:  true,
		// 		  activityId: String(this.data.shopInfo.message_id), // 活动 ID
		// 	      templateInfo:  {
		// 		        parameterList:  [{
		// 			          name:  'member_count',
		// 					  value: String(this.data.shopInfo.kj_num)
		// 		        },  {
		// 			          name:  'room_limit',
		// 						value: String(this.data.shopInfo.kj_all_num)
		// 		        }]
		// 	      }
		// })
		let obj = {
			title: '砍到0元免费送，快来帮我砍一刀！',
			path: '/pages/bargain_state/bargain_state?shopobj=' + JSON.stringify(shopobj),
			imageUrl: image
		};
		return obj;
	},
	//授权
	getUserInfo(e) {
		request_01.setUserInfo(e).then(res => {
			if (res) {
				console.log("授权、上传头像昵称成功")
				this.setData({
					userInfo: wx.getStorageSync("userInfo")
				})
			}
		}).catch(err => { console.log("err", err) })
	},
	getBarcarod(){//获取砍价记录 和多少人免费拿到
		console.log("查询的openid",this.data.chuan_openid);
		console.log("查询的openid", this.data.shareobj.activity_id);
		console.log("kj_id", this.data.kj_id);
	    let dat = {
			openid:this.data.chuan_openid,
			kj_id: this.data.kj_id,
			activity_id:this.data.activity_id,
			user_id:this.data.userInfo.user_id
		} 
		let time ='';
		request_04.freeList(dat).then((res)=>{
			clearInterval(shopTimes);
			// res.data.data.top_arr.buttom_type = 3;//1砍价超市/2砍价完成(未领取)/3砍价完成(已领取)/4正在砍价
			if(res.data.status==0){
				let baifenbi = parseFloat(res.data.data.top_arr.kj_price / res.data.data.top_arr.price_all).toFixed(2);
				this.setData({ sy_num: res.data.data.sy_num, shopInfo: res.data.data.top_arr, barRecord: res.data.data.kj_log_arr, freeData: res.data.data.free, percent: baifenbi*100})
				if (res.data.data.top_arr.end_time>0){
					shopTimes = setInterval(() => {
						if (res.data.data.top_arr.end_time >= 0) {
							time = daojishi.minutesAndSeconds(res.data.data.top_arr.end_time--);
						} else {
							clearInterval(shopTimes);
							this.getBarcarod();
						}
						this.setData({ djs: time.tiems })
					}, 1000)
				}
			}
		}).catch((reason)=>{
			console.log(reason)
		})
	},
	closePop(){
		this.setData({ succPop:false})
	},
	friendHelp(){//好友帮忙砍价
		if (!this.data.userInfo.nickName || !wx.getStorageSync("userInfo").unionid)return;
		let dat = {
			openid: wx.getStorageSync('userInfo').openid,
			kj_id: this.data.kj_id,
			activity_id:this.data.activity_id
		}
		request_04.friendHelp(dat).then((res)=>{
			// console.log(res.data)
			if(res.data.status==0){
				this.setData({ succPop: true, barPrice:res.data.data.kj_money})
				this.getBarcarod();
			}else{
				alert.alert({str:res.data.msg})
			}
		}).catch((reason)=>{
			console.log(reason)
		})
	},
	selfFreeget(){
		route.jump_nav({ url:'/pages/bargain_index/bargain_index'});
	},
	getworld(e) {//领取奖品
		let cid = e.currentTarget.dataset.cid;
		let dat = {
			openid: wx.getStorageSync("userInfo").openid,
			kj_id: cid,
			activity_id: this.data.activity_id
		}
		request_04.getWolrd(dat).then((res) => {
			console.log(res.data)
			if (res.data.status == 0) {
				route.jump_nav({ url: "/pages/order_detail/order_detail?order_id=" + res.data.data.order_id });
				this.getBarcarod();
			}else{
				alert.alert({str:res.data.msg})
			}
		}).catch((reason) => {
			console.log(reason)
		})
	},
	goHome(){
		route.jump_nav({ url:"/pages/activity_list/activity_list"})
	},
	activeHome(){
		// route.jump_nav({url:})
	}
})