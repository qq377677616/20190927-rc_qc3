// pages/bargain_index/bargain_index.js
const request_04 = require('../../utils/request/request_04.js');
const request_01 = require('../../utils/request/request_01.js');
const daojishi = require('../../utils/public/util.js');
const route = require('../../utils/tool/router.js');
const alert = require("../../utils/tool/alert.js");
const app = getApp();

import tool from '../../utils/tool/tool.js';
import api from '../../utils/request/request_03.js'
let shopTimes = '';
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		IMGSERVICE: app.globalData.IMGSERVICE,
		s_list: [
			'1用户格律风诗 正在砍 MIRACLE KILL/死亡奇迹 时尚运',
			'2用户格律风诗 正在砍 MIRACLE KILL/死亡奇迹 时尚运',
			'3用户格律风诗 正在砍 MIRACLE KILL/死亡奇迹 时尚运',
			'4用户格律风诗 正在砍 MIRACLE KILL/死亡奇迹 时尚运'
		],
		shopList: {},//商品列表
		rulspop: false,
		cutpop: false,
		date_list: [],//日期列表
		currTime: '',//当前选择日期
		djs: {},//倒计时数据
		restNum: 0,
		barName: '',
		barPrice: 0,
		barPop: false,
		shopId: 0,//免费砍价商品id
		today: 0,//保存今天
		time_value: 0,//时间差值
		barRecord: [],
		freeImage: '',
		banarImage: '',
		userInfo: '',
		activity_id: "",
		shopData: {},
		ok: 'ok',
		iscarActive: false,
		activeStatus: 1,
		poptxt: "活动未开放",
		isfirst: 1,
		isshare: false,
		kucun: false,
		endStatus: 0,
		praTime: null,
		has_jh: 0,
		isCodeShow: false,
		code: '',
		loadingText: '卡券领取中',
		isShowLoading: false,
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		console.log('参数', options);
		//   alert.alert({ str:options.isshare})
		this.setData({ isshare: options.isshare == "6" })
		wx.setStorageSync("activity_id", options.activity_id || wx.getStorageSync('activity_id'))
		this.setData({
			activity_id: options.activity_id || wx.getStorageSync('activity_id')

		});
		this.allWeek();
		request_01.login(() => {
			this.setData({
				activity_id: options.activity_id || wx.getStorageSync('activity_id'),
				userInfo: wx.getStorageSync("userInfo"),

			});
			this.bar_shopList();
			this.get_barNnm();
			this.getbanar();


		})

	},
	//判断是否授权和是否是车主
	isVehicleOwner(e) {
		console.log('e', e)
		if ((wx.getStorageSync("userInfo").nickName && wx.getStorageSync("userInfo").user_type == 1 && wx.getStorageSync("userInfo").unionid) || (e && e.target.dataset.type != 'ok') || (wx.getStorageSync("userInfo").nickName && !this.data.iscarActive && wx.getStorageSync("userInfo").unionid)) return
		if (!wx.getStorageSync("userInfo").nickName || !wx.getStorageSync("userInfo").unionid) {
			this.setData({ popType: 2 })
		} else if (wx.getStorageSync("userInfo").user_type == 0 && this.data.iscarActive) {
			this.setData({ popType: 3 })
		}
		this.isVehicleOwnerHidePop()
	},
	//授完权后处理
	getParme(e) {
		this.isVehicleOwnerHidePop()
		request_01.setUserInfo(e).then(res => {
			this.isVehicleOwner()
		})
	},
	//是否授权、绑定车主弹窗
	isVehicleOwnerHidePop() {
		this.setData({ isVehicleOwnerHidePop: !this.data.isVehicleOwnerHidePop })
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
		this.bar_shopList();
		this.get_barNnm();
		this.getBargain();
		this.setData({ isfirst: 1 })
	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {
		let obj = {
			title: '砍到0元免费送，快来帮我砍一刀！',
			path: '/pages/bargain_index/bargain_index?activity_id=' + this.data.activity_id + "&isshare=6",
			imageUrl: this.data.IMGSERVICE + "/center/kanjiashare.jpg"
		};
		return obj;
	},
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
	get_barNnm() {//获取剩余砍价的次数
		let dat = {
			openid: wx.getStorageSync('userInfo').openid,
			activity_id: this.data.activity_id
		}
		request_04.restBarnum(dat).then((res) => {
			//  console.log(res.data)
			if (res.data.status == 0) {
				this.setData({ restNum: res.data.data.sy_kj_num })
			}
		}).catch((reason) => {
			console.log(reason)
		})
	},
	bar_shopList() {//砍价商品列表wx.getStorageSync('userInfo').openid

		let dat = {
			openid: wx.getStorageSync('userInfo').openid,
			date: this.data.currTime,
			activity_id: this.data.activity_id,
			user_id: this.data.userInfo.user_id
		}
		request_04.bargain_shop_list(dat).then((res) => {
			console.log("砍价商品列表数据", res.data);
			this.setData({ activeStatus: res.data.status, praTime: res.data.status == 1005 ? res.data.data.start_date.split(" ")[0] : '' })
			if (res.data.status == 0) {
				this.setData({
					shopList: res.data.data,
					iscarActive: res.data.data.car_owner == 1,
					endStatus: res.data.data.end_status,
					has_jh: res.data.data.is_jx_kj,
				})

				if (res.data.data.end_time > 0) {
					// console.log("执行")
					clearInterval(shopTimes);
					shopTimes = setInterval(() => {
						if (res.data.data.end_time >= 0) {
							var time = daojishi.minutesAndSeconds(res.data.data.end_time--);
							// console.log(res.data.data.end_time,time);
						} else {
							clearInterval(shopTimes);
							this.allWeek();
							this.bar_shopList();
						}
						this.setData({ djs: time.tiems })
					}, 1000)
				} else {
					console.log('昨天砍价已结束')
				}
			}
			this.setRule();
		}).catch((reason) => {
			console.log(reason)
		})
	},
	getBargain() {//获取砍价记录
		// wx.getStorageSync('userInfo').openid
		let dat = {
			openid: wx.getStorageSync('userInfo').openid,
			activity_id: this.data.activity_id
		};//测试openid
		request_04.bargainList(dat).then((res) => {
			if (res.data.status == 0) {
				this.setData({ barRecord: res.data.data })
			}
		}).catch((reason) => {
			console.log(reason);
		})
	},
	selectTime(e) {//时间筛选 砍价商品列表
		clearInterval(shopTimes);
		this.setData({ currTime: e.currentTarget.dataset.time });
		this.bar_shopList();
		console.log('当前选择的天', this.data.currTime, '今天', this.data.today);
		let val = parseInt(this.data.currTime.split('-')[2]) - parseInt(this.data.today.split('-')[2]);
		this.setData({ time_value: val })
	},
	freeGet(e) {//点击免费拿

		if ((wx.getStorageSync("userInfo").user_type == 0 && this.data.iscarActive) || !wx.getStorageSync("userInfo").nickName || !wx.getStorageSync("userInfo").unionid) return;
		if (wx.getStorageSync("userInfo").user_type == 0 && e.currentTarget.dataset.obj.car_owner == 1) {
			console.log("hello")
			this.setData({ popType: 4 });
			this.isVehicleOwnerHidePop();
			return;
		}
		if (this.data.has_jh == 0) {
			wx.showToast({
				icon: "none",
				title: '非常抱歉 您已达到该活动礼品领取上限 感谢您的参与'
			})
			return;
		}
		if (this.data.restNum > 0) {
			let shopName = e.currentTarget.dataset.name;
			let shopPrice = e.currentTarget.dataset.price;
			let shopId = e.currentTarget.dataset.sid;
			let image = e.currentTarget.dataset.image;
			this.setData({
				shopData: e.currentTarget.dataset.obj,
				barPop: true,
				barName: shopName,
				barPrice: shopPrice,
				shopId: shopId,
				freeImage: image
			});
		} else {
			alert.alert({ str: "每天只能砍价三次哦!" })
		}

	},
	goshopDel2(e) {
		//正在进行中商品点击整行进入商品详情
		if (e.target.dataset.types == 'no') return;
		console.log(55555)
		// this.setData({ ok: this.data.iscarActive ? "ok" : "false" });
		if ((wx.getStorageSync("userInfo").user_type == 0 && this.data.iscarActive) || !wx.getStorageSync("userInfo").nickName || !wx.getStorageSync("userInfo").unionid) return;
		console.log("是否是车主商品", wx.getStorageSync("userInfo").user_type, e.currentTarget.dataset.car);
		if (wx.getStorageSync("userInfo").user_type == 0 && e.currentTarget.dataset.car == 1) {
			console.log("hello")
			this.setData({ popType: 4 });
			this.isVehicleOwnerHidePop();
			return;
		}
		let ing = e.currentTarget.dataset.ing;
		ing = ing == 2 ? 5 : (ing = ing == 1 ? 6 : ing);
		ing = this.data.endStatus == 1 ? ing : 8;
		console.log(ing)
		let shopid = e.currentTarget.dataset.shopid;
		route.jump_nav({ url: '/pages/cut_product_details/cut_product_details?prize_id=' + shopid + '&b_type=' + ing + "&is_jh=" + this.data.has_jh });
	},
	startBar() {//点击开始砍价
		// wx.getStorageSync("userInfo").openid
		let shopobj = {};
		let dat = {
			openid: wx.getStorageSync("userInfo").openid,
			prize_id: this.data.shopId,
			activity_id: this.data.activity_id
		}
		shopobj.shopName = this.data.shopData.title;
		shopobj.shopImg = this.data.shopData.thumb;
		shopobj.shopPrice = this.data.shopData.price;
		shopobj.type = this.data.shopData.type;
		shopobj.shopid = this.data.shopData.id;
		route.jump_nav({ url: '/pages/cut_cart/cut_cart?shopobj=' + JSON.stringify(shopobj) });
		this.setData({ rulspop: false, cutpop: false, barPop: false });
	},
	goShopdel(e) {//我正在砍的商品点击整行进入商品详情
		//  "status": 1,//砍价状态1:正在砍价  2:砍价完成  3:已领取 （接口返回）
		// b_type:1继续砍价2：砍价完成未领取 点击免费拿 4：已领取 5：抢完了 6 已经抢过了 （自己定义）
		console.log("去详情么")
		// if (!this.data.has_jh) {
		// 	wx.showToast({
		// 		icon: "none",
		// 		title: '非常抱歉 您已达到该活动礼品领取上限 感谢您的参与'
		// 	})
		// 	return;
		// }
		let shopObj = e.currentTarget.dataset.obj;
		// console.log(shopObj);
		// return;
		let obj = {};
		let shopType = 2;
		console.log('状态', e.currentTarget.dataset.obj.status);
		obj.titleImg = wx.getStorageSync('userInfo').headimg;
		obj.nickname = wx.getStorageSync('userInfo').nickname;
		obj.openid = wx.getStorageSync("userInfo").openid;//wx.getStorageSync('userInfo').openid;
		obj.id = shopObj.id;
		if (e.currentTarget.dataset.obj.status == 4) {//是否是待领取状态
			console.log(e.currentTarget.dataset.obj.status)
			route.jump_nav({ url: "/pages/order_detail/order_detail?order_id=" + e.currentTarget.dataset.obj.order_id + "&is_jh=" + this.data.has_jh });
			return;
		}
		shopObj.status = shopObj.status == 3 ? 4 : shopObj.status;
		shopObj.status = shopObj.sy_num > 0 ? shopObj.status : 5;
		if (shopObj.status != 5 && shopObj.status != 4) {
			route.jump_nav({ url: '/pages/cut_product_details/cut_product_details?prize_id=' + shopObj.pid + '&b_type=' + shopObj.status + '&shopobj=' + JSON.stringify(obj) + "&is_jh=" + this.data.has_jh })
		} else if (shopObj.status == 4) { //已领取 微信卡券跳转到卡包  非微信卡券  我的订单
			console.log("是否是卡券", shopObj.type)
			if (shopObj.type == 1) {
				route.jump_nav({ url: '/pages/o_card_bag/o_card_bag' })
			} else {
				route.jump_nav({ url: '/pages/o_duihuan/o_duihuan' })
			}
		} else {
			route.jump_nav({ url: '/pages/bargain_state/bargain_state?shopobj=' + JSON.stringify(obj) });
		}
		this.setData({ rulspop: false, cutpop: false, barPop: false })
	},

	continueBargain(e) {//点击继续砍价
		// console.log(212)
		if (this.data.has_jh == 0) {
			wx.showToast({
				icon: "none",
				title: '非常抱歉 您已达到该活动礼品领取上限 感谢您的参与'
			})
			return;
		}
		let shopObj = e.currentTarget.dataset.obj;
		let obj = {};
		obj.titleImg = wx.getStorageSync('userInfo').headimg;
		obj.nickname = wx.getStorageSync('userInfo').nickname;
		obj.openid = wx.getStorageSync("userInfo").openid;//wx.getStorageSync('userInfo').openid;
		obj.id = shopObj.id;
		route.jump_nav({ url: '/pages/bargain_state/bargain_state?shopobj=' + JSON.stringify(obj) });
	},
	getbanar() {//获取砍价首页banar和跑马灯
		request_04.getBanarlist({ activity_id: this.data.activity_id }).then((res) => {
			// console.log(res.data)
			if (res.data.status == 0) {
				this.setData({ s_list: res.data.data.lb_prize, banarImage: res.data.data.banner })
			}
		}).catch((reason) => {
			console.log(reason)
		})
	},
	getworld(e) {
		let cid = e.currentTarget.dataset.cid;
		let type = e.currentTarget.dataset.type;
		let order_id = e.currentTarget.dataset.orderid;
		if (order_id > 0) {
			route.jump_nav({ url: "/pages/order_detail/order_detail?order_id=" + order_id });
		}
		else {
			alert.loading({
				str: '领取中'
			})
			request_04.getWolrd({
				openid: wx.getStorageSync("userInfo").openid,
				kj_id: cid,
				activity_id: this.data.activity_id
			}).then((value) => {
				const msg = value.data.msg;
				const status = value.data.status;
				const data = value.data.data;
				const type = data.type;// 商品类型 1-微信卡券 2-快递 3-虚拟卡券
				const xuni_code = data.xuni_code;
				const card_info = data.card_info;
				const order_goods_id = data.order_goods_id;
				alert.loading_h()


				if (status == 1) {

					switch (type) {
						case 1://微信卡券
							this.addCard(card_info, order_goods_id)
							break;
						case 2://快递
							alert.alert({
								str: '领取成功',
							})
							break;
						case 3://虚拟卡券
							this.setData({
								isCodeShow: true,
								code: xuni_code,
							})
							break;
					}
				}
				else {//获取失败
					alert.alert({
						str: msg,
					})
				}


				route.jump_nav({ url: "/pages/order_detail/order_detail?order_id=" + value.data.data.order_id });
			}).catch((reason) => {
				//fail
				alert.loading_h()
				alert.alert({
					str: JSON.stringify(reason)
				})
			})
		}

	},
	allWeek() {//获取今天在内之后六天
		var me = this;
		var sevenDays = [];
		var d = new Date();
		var time = d.getTime();
		var dateStrList = [];
		for (var i = 0; i < 7; i++) {
			var date = new Date(time + i * 24 * 3600 * 1000);
			var weekTime = me.formatDate(date);
			var splitArr = weekTime.split(" ");
			var dateStr = splitArr[0];
			var weekStr = splitArr[1];
			var timelist = splitArr[2];
			var dateObj = {};
			dateObj.timelist = timelist;
			dateObj.dateStr = dateStr;
			dateObj.weekStr = weekStr;
			sevenDays.push(dateObj);
		}
		this.setData({ date_list: sevenDays, currTime: sevenDays[0].dateStr, today: sevenDays[0].dateStr })
	},
	formatDate(date) {//获取今天在内之后六天
		var year = date.getFullYear();
		var month = (date.getMonth() + 1);
		month = month <= 9 ? '0' + month : month;
		var day = date.getDate();
		day = day <= 9 ? '0' + day : day;
		var datetime = year + '-' + month + '-' + day;
		var datetime2 = month + '月' + day + '日'
		var week = ['SUN', 'MON', 'TUE', 'WEN', 'THU', 'FRI', 'SAT'][date.getDay()];
		return datetime + ' ' + week + ' ' + datetime2;
	},
	actPop() {//弹出活动规则
		this.setData({ rulspop: true })
	},
	cutPop() {//砍价记录弹窗
		this.getBargain();
		this.setData({ cutpop: true })
	},
	closePop() {//关闭弹窗
		console.log("关闭活动规则");
		let ruleStatus = this.data.activeStatus;
		console.log(ruleStatus);
		if (ruleStatus == "1005") {
			console.log(11)
			this.setData({
				isVehicleOwnerHidePop: true,
				popType: 1,
				poptxt: "活动预计" + this.data.praTime + "号开启 敬请期待"
			})
		} else if (ruleStatus == "1006") {
			this.setData({
				isVehicleOwnerHidePop: true,
				popType: 1,
				poptxt: "活动已结束"
			})
		}
		this.setData({ rulspop: false, cutpop: false, barPop: false })
	},
	//规则弹窗
	setRule() {
		if (this.data.isfirst > 1) return;
		this.setData({ isfirst: ++this.data.isfirst });
		if (!wx.getStorageSync("isRule").bargain) {
			this.setData({ rulspop: true });
			let _isRule = wx.getStorageSync("isRule") || {}
			_isRule.bargain = true
			wx.setStorageSync("isRule", _isRule)
		} else {
			if (this.data.activeStatus == "1005") {
				this.setData({
					isVehicleOwnerHidePop: true,
					popType: 1,
					poptxt: "活动预计" + this.data.praTime + "号开启 敬请期待"
				})
			} else if (this.data.activeStatus == "1006") {
				this.setData({
					isVehicleOwnerHidePop: true,
					popType: 1,
					poptxt: "活动已结束"
				})
			}
		}
	},
	bargainDel(e) {
		console.log(55)
		// console.log(e);
		// "buttom_type": 1,//按钮状态 1:待领取  2:已领取  3:已超时  4:砍价中,
		let shopObj = e.currentTarget.dataset.obj;
		let b_type = shopObj.buttom_type;
		let shopType = 2;
		console.log("领取状态", shopObj.buttom_type)
		b_type = b_type == 1 ? 2 : (b_type = b_type == 2 ? 4 : (b_type = b_type == 3 ? 7 : (b_type = b_type == 4 ? 1 : b_type)));
		b_type = shopObj.sy_num > 0 ? b_type : 5;
		console.log(b_type, '==', b_type, '==', shopObj.sy_num)
		shopObj.titleImg = wx.getStorageSync('userInfo').headimg;
		shopObj.nickname = wx.getStorageSync('userInfo').nickname;
		shopObj.openid = wx.getStorageSync("userInfo").openid;//wx.getStorageSync('userInfo').openid;
		console.log("商品类型", shopObj.type);
		if (shopObj.buttom_type == 5) {
			route.jump_nav({ url: "/pages/order_detail/order_detail?order_id=" + shopObj.order_id });
			return;
		}
		if (shopObj.buttom_type != 3 && shopObj.sy_num > 0 && shopObj.buttom_type != 2) {
			route.jump_nav({ url: '/pages/cut_product_details/cut_product_details?prize_id=' + shopObj.pid + '&b_type=' + b_type + '&shopobj=' + JSON.stringify(shopObj) + "&is_jh=" + this.data.has_jh })
		} else if (shopObj.buttom_type == 2) {//已领取 微信卡券跳转到卡包  非微信卡券  我的订单 
			if (shopObj.type == 1) {
				route.jump_nav({ url: '/pages/o_card_bag/o_card_bag' })
			} else {
				route.jump_nav({ url: '/pages/o_duihuan/o_duihuan' })
			}
			// console.log("已领取")
		} else {
			route.jump_nav({ url: '/pages/bargain_state/bargain_state?shopobj=' + JSON.stringify(shopObj) });
		}
	},
	goHome() {
		route.jump_nav({ url: "/pages/index/index" })
	},
	//领取卡券
	addCard(cardList, order_goods_id) {
		this.isShowLoading()
		tool.addCard(cardList).then(res => {
			console.log("卡券返回", res)
			if (res.errMsg == "addCard:ok") {

				console.log("卡券领取成功", res)
				let _card_code = ''

				for (let i = 0; i < res.cardList.length; i++) {
					_card_code += ((i == 0 ? '' : ',') + res.cardList[i].code)
				}
				this.cardCheck(_card_code, order_goods_id)
			} else {
				this.isShowLoading()
				tool.alert("卡券领取失败")
			}
		}).catch(err => {
			console.log("err", err)
			this.isShowLoading()
			tool.alert("卡券领取失败")
		})
	},
	//卡券核销上报
	cardCheck(card_code, order_goods_id) {
		let _data = {
			user_id: wx.getStorageSync("userInfo").user_id,
			order_goods_id,
			card_code: card_code
		}
		api.orderCheck(_data).then(res => {
			console.log("卡券核销上报返回", res)
			if (res.statusCode == 200) {
				this.isShowLoading()
				tool.alert("卡券领取成功，请到我的卡包查看卡券使用详情")
				// let _orderDetail = this.data.orderDetail
				// _orderDetail.order_goods[this.data.curIndex].is_receive = 1
				// console.log("_orderDetail", _orderDetail)
				// this.setData({ orderDetail: _orderDetail })
			}
		})
	},
	//自定义loading框
	isShowLoading() {
		this.setData({
			isShowLoading: !this.data.isShowLoading
		})
	},
	//关闭虚拟兑换窗口
	closeCode() {
		this.setData({
			isCodeShow: false,
		})
	},
	//复制兑换码
	setClipboar() {
		let code = this.data.code;
		wx.setClipboardData({
			//准备复制的数据
			data: code,
		});
	},
})