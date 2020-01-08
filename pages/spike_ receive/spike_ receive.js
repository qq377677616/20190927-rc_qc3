// pages/shop_cart_next/shop_cart_next.js
const request_01 = require('../../utils/request/request_01.js');

const router = require('../../utils/tool/router.js');

const alert = require('../../utils/tool/alert.js');

const method = require('../../utils/tool/method.js');

const request_04 = require("../../utils/request/request_04.js");

import tool2 from '../../utils/tool/tool.js'

const tool = require('../../utils/public/tool.js');

import api from '../../utils/request/request_03.js'

const app = getApp();//获取应用实例
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		IMGSERVICE: app.globalData.IMGSERVICE,
		goodsDetail: {},
		cartDetail: {},
		type: '',
		currentAddressItem: {},
		storeList: [],
		pickerStoreList: [],
		storeIndex: 0,
		positionKey: true,
		parmData: {},//接收页面参数
		area: '',//省市区
		address: '',//详细地址
		dealer_code: '',//专营店编码
		mobile: '',//手机号
		useName: '',//留资用户姓名
		ht_code: '',//回填专营店码
		order_goods_id: null,//订单id
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		console.log(options);
		this.setData({ parmData: JSON.parse(options.obj) })
		request_01.login(() => {
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
		const currentAddressItem = app.globalData.currentAddressItem;//收货人信息
		const goodsDetail = this.data.goodsDetail;//立即兑换商品信息
		const cartDetail = this.data.cartDetail;//购物车商品信息
		const type = this.data.type;
		console.log("收获地址信息", currentAddressItem);
		this.setData({
			currentAddressItem,
		})

		//收货人信息必须填写
		if (!currentAddressItem.area) return;

		//实物领取不需要获取门店
		if (this.data.parmData.type == 2 && this.data.is_yy == 0) return;

		this.getLocation()
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
	//页面初始化
	initData(options) {
		const goodsDetail = app.globalData.goodsDetail;
		const cartDetail = app.globalData.cartDetail;
		const type = options.type;
		const userInfo = wx.getStorageSync('userInfo');
		let parme = JSON.parse(options.obj);
		if (parme.is_order > 0 && parme.is_yy == 0) {// 回填  不获取默认地址
			this.order_info();
			console.log('回填  不获取默认地址');
			return;
		}
		// if (type == 'pay') {//立即支付跳转过来
		// 	this.setData({
		// 		goodsDetail,
		// 	})
		// }
		// else {//购物车跳转过来
		// 	this.setData({
		// 		cartDetail,
		// 	})
		// }

		// this.setData({
		// 	type,
		// })
		alert.loading({
			str: '加载中'
		})
		Promise.all([
			request_01.defaultAddress({
				user_id: userInfo.user_id
			})
		])
			.then((value) => {
				//success
				const data = value[0].data.data;
				const toString = {}.toString;
				if (toString.call(data) == '[object Array]') {
					//为空数组 就是没有默认地址
				}
				else {
					//否则有默认地址
					console.log("data", data);
					this.setData({
						area: data.area,
						address: data.address,
						useName: data.name,
						mobile: data.mobile
					})
					app.globalData.currentAddressItem = Object.assign(data, {
						real_address: data.area.replace(/\s+/g, "") + data.address
					})
					this.onShow()
				}
			})
			.catch((reason) => {
				//fail
			})
			.then(() => {
				//complete
				alert.loading_h()
			})
	},
	//定位
	getLocation() {
		const currentAddressItem = this.data.currentAddressItem;
		// console.log(currentAddressItem)
		this.setData({
			area: currentAddressItem.area,
			address: currentAddressItem.address,
			useName: currentAddressItem.name,
			mobile: currentAddressItem.mobile
		})
		alert.loading({
			str: '获取门店中'
		})

		this.setData({//定位中关锁
			positionKey: false,
		})
		method.getPosition()
			.then((value) => {
				//success
				const location = value.result;

				return request_01.storeList({
					city: currentAddressItem.area.split(' ')[1],
					lon: location.location.lng,
					lat: location.location.lat,
				})

			})
			.catch((reason) => {
				//fail
				return request_01.storeList({
					city: currentAddressItem.area.split(' ')[1],
					lon: '',
					lat: '',
				})

			})
			.then((value) => {
				const storeList = value.data.data;
				const msg = value.data.msg;
				const status = value.data.status;
				let pickerStoreList;
				alert.loading_h()

				if (status == 1) {//有门店数据返回
					pickerStoreList = storeList.map((item) => {
						return item.name;
					})
					let falg = -1;
					if (this.data.ht_code && this.data.ht_code != '') {
						falg = storeList.findIndex((item, index) => {
							return item.code == this.data.ht_code
						})
					}
					this.setData({
						storeList,
						pickerStoreList,
						storeIndex: falg == -1 ? 0 : falg,
					})
				}
				else {//门店数据返回出错

					this.setData({
						storeList: [],
						pickerStoreList: [],
						storeIndex: 0,
					})

					alert.alert({
						str: '门店：' + msg,
					})
				}
			})
			.catch((reason) => {
				//fail

				this.setData({
					storeList: [],
					pickerStoreList: [],
					storeIndex: 0,
				})

				alert.loading_h()
				alert.alert({
					str: '门店：' + JSON.stringify(reason)
				})
			})
			.then(() => {
				//complete

				this.setData({//定位完开锁
					positionKey: true,
				})
			})
	},
	//获取收货人信息
	getInfo() {
		const positionKey = this.data.positionKey;

		if (!positionKey) return;//定位中不能操作

		router.jump_nav({//跳转到我的地址页 选择地址
			url: '/pages/o_address/o_address?pageType=back'
		})
	},
	//选择获取门店
	bindPickerChange(e) {
		const storeIndex = e.detail.value;

		this.setData({
			storeIndex,
		})
	},
	//选择获取门店提示
	getStore() {
		const currentAddressItem = this.data.currentAddressItem;//收货人信息
		if (currentAddressItem.area) {//收货人信息必须填写
			alert.alert({
				str: '该区域没有找到相关门店，或门店相关信息出错'
			})
		}
		else {//该区域没有门店
			alert.alert({
				str: '请填写收货人信息'
			})
		}
	},
	settlement() {
		//领取
		const currentAddressItem = this.data.currentAddressItem;//收货人信息
		const type = this.data.type;
		const userInfo = wx.getStorageSync('userInfo');
		const storeList = this.data.storeList;//门店列表
		const storeIndex = this.data.storeIndex;//门店索引
		let dealer_code = '';//门店编码
		console.log(storeIndex)
		//收货人信息必填
		console.log(currentAddressItem.address_id)
		if (!currentAddressItem.address_id) return alert.alert({
			str: '请填写收货人信息'
		});
		if (this.data.parmData.is_yy == 0 || this.data.parmData.type != 2) {//立即支付跳转过来
			if (!(this.data.parmData.type == 2) && !storeList.length) return alert.alert({
				str: '请选择领取的门店'
			});
			let dealer_code = storeList[storeIndex].code;//门店id 为快递时门店id非必选
			this.setData({ dealer_code: dealer_code })
		}
		this.data.parmData.is_yy == 0 ? this.lq_receive() : this.yy_receive();
	},
	lq_receive() {
		// 领取奖品 结算留资
		this.isShowLoading();
		let dat = {};
		if (this.data.parmData.type == 2) {
			dat = {
				activity_id: this.data.parmData.activity_id,
				openid: wx.getStorageSync('userInfo').openid,
				log_id: this.data.parmData.log_id,
				name: this.data.useName,
				mobile: this.data.mobile,
				area: this.data.area,
				address: this.data.address
			}
		} else {
			dat = {
				activity_id: this.data.parmData.activity_id,
				openid: wx.getStorageSync('userInfo').openid,
				log_id: this.data.parmData.log_id,
				name: this.data.useName,
				mobile: this.data.mobile,
				area: this.data.area,
				address: this.data.address,
				code: this.data.dealer_code
			}
		}
		// console.log(dat);
		// return;
		request_04.lq_receive(dat).then((res) => {
			console.log(res.data)
			this.isShowLoading();
			if (res.data.status == 1) {
				res.data.goods_type == 1 ? this.addCard([res.data.data.card_info]) : tool.jump_red(`/pages/order_detail/order_detail?order_id=${res.data.data.order_id}`);
				this.setData({ order_goods_id: res.data.data.order_id })
			} else {
				tool.alert(res.data.msg);
			}
		}).catch((err) => {
			console.log(err)
		})
	},
	yy_receive() {
		// 预约留资
		console.log("预约留资");
		this.isShowLoading();
		let dat = {
			address_id: this.data.currentAddressItem.address_id,
			activity_id: this.data.parmData.activity_id,
			openid: wx.getStorageSync('userInfo').openid,
			name: this.data.useName,
			mobile: this.data.mobile,
			area: this.data.area,
			address: this.data.address,
			code: this.data.dealer_code,
			goods_id: this.data.parmData.goods_id,
			form_id: this.data.parmData.is_DY == 0 ? '0' : '-1'
		}
		// console.log(dat);
		// return;
		request_04.yy_receive(dat).then((res) => {
			this.isShowLoading();
			if (res.data.status == 1) {
				tool.jump_back();
				tool.alert(res.data.msg);
			} else {
				tool.alert(res.data.msg);
			}
		})
	},
	order_info() {
		// 已经留资的回填
		this.isShowLoading();
		let dat = {
			activity_id: this.data.parmData.activity_id,
			openid: wx.getStorageSync('userInfo').openid
		}
		request_04.order_info(dat).then((res) => {
			console.log(res.data)
			this.isShowLoading();
			if (res.data.status == 1) {
				let real_address = res.data.data.area.replace(/\s+/g, "") + res.data.data.address;
				res.data.data.real_address = real_address;
				this.setData({
					currentAddressItem: res.data.data,
					ht_code: res.data.data.code
				})
				if (this.data.parmData.type != 2) {//不是实物  获取门店
					this.getLocation();
				}
			}
		})
	},
	addCard(cardList) {
		// 添加卡券
		console.log(11, cardList);
		tool2.addCard(cardList).then(res => {
			tool.jump_red(`/pages/order_detail/order_detail?order_id=${this.data.order_goods_id}`)
			if (res.errMsg == "addCard:ok") {
				console.log("卡券领取成功")
				let _card_code = ''
				for (let i = 0; i < res.cardList.length; i++) {
					_card_code += ((i == 0 ? '' : ',') + res.cardList[i].code)
				}
				this.cardCheck(_card_code)
			} else {
				this.isShowLoading()
				tool2.alert("卡券领取失败1")
			}
		}).catch(err => {
			console.log("err", err)
			this.isShowLoading()
			tool2.alert("卡券领取失败2")
		})
	},

	cardCheck(card_code) {
		// 上报
		console.log("上报")
		console.log(this.data.parmData)
		this.isShowLoading();
		let _data = {
			user_id: wx.getStorageSync("userInfo").user_id,
			order_goods_id: this.data.order_goods_id,
			card_code: card_code
		}
		api.orderCheck(_data).then(res => {
			this.isShowLoading();
			console.log("卡券核销上报返回", res)
			if (res.statusCode == 200) {
				this.isShowLoading()
				tool2.alert("卡券领取成功，请到我的卡包查看卡券使用详情")
				let _orderDetail = this.data.orderDetail
				_orderDetail.order_goods[this.data.curIndex].is_receive = 1
				console.log("_orderDetail", _orderDetail)
				this.setData({ orderDetail: _orderDetail })
			}
		})
	},
	isShowLoading() {
		// 控制loading
		this.setData({
			isShowLoading: !this.data.isShowLoading
		})
		if (this.data.isShowLoading) {
			tool.loading();
		} else {
			tool.loading_h();
		}
	}
})