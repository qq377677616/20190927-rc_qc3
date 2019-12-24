// pages/shop_cart_next/shop_cart_next.js
const request_01 = require('../../../utils/request/request_01.js');

const request_04 = require('../../../utils/request/request_04.js');

const router = require('../../../utils/tool/router.js');

const alert = require('../../../utils/tool/alert.js');

const method = require('../../../utils/tool/method.js');

const tool = require('../../../utils/public/tool.js');

const app = getApp();//获取应用实例
Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		IMGSERVICE: app.globalData.IMGSERVICE,//图片基本路径
		// goodsDetail: {},//商品详情信息
		// cartDetail: {},//
		// type: 'pay',
		currentAddressItem: {},
		storeList: [],
		pickerStoreList: [],
		storeIndex: 0,//
		positionKey: true,//是否定位
		barshopData: {},//砍价商品数据
		picklist: [],//存pick数据
		parmData:null,//接收页面参数
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		console.log(JSON.parse(options.obj))
		this.setData({ parmData: JSON.parse(options.obj)})
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
		this.setData({
			currentAddressItem,
		})

		//收货人信息必须填写
		if (!currentAddressItem.area) return;

		//立即兑换商品、购物车商品 为快递时，不用获取门店
		// console.log('是否需要选择门店', this.data.barshopData.type!=2,this.data.barshopData.type);
		if (this.data.barshopData.type == 2) return;
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

	/**
	 * 用户点击右上角分享
	 */
	//页面初始化
	initData(options) {
		const goodsDetail = app.globalData.goodsDetail;
		// const cartDetail = app.globalData.cartDetail;
		let userInfo = wx.getStorageSync('userInfo');
		const type = options.type;
		alert.loading({
			str: '加载中'
		})
		Promise.all([
			request_04.getdefault({
				user_id: userInfo.user_id
			})
		])
			.then((value) => {
				//success
				const data = value[0].data.data;
				const toString = {}.toString;
				if ( toString.call(data) == '[object Array]' ) {
					//为空数组 就是没有默认地址
				}
				else {
					//否则有默认地址
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

		alert.loading({
			str: '获取门店中'
		})
		this.setData({//定位中关锁
			positionKey: false,
		})

		method.getPosition()
			.then((value) => {
				//success
				console.log(value);
				const location = value.result;
				return this.getstroeList();
			})
			.catch((reason) => {
				//fail
				alert.loading_h();
				this.getstroeList();
			})
			.then(() => {
				this.setData({//定位完开锁
					positionKey: true,
				})
			})
	},
	getstroeList(location = 0) {
		const currentAddressItem = this.data.currentAddressItem;
		console.log(currentAddressItem)
		let pickerStoreList;
		let picklist;
		let dat;
		console.log(location);
		if (!location || location == 0) {
			dat = {
				city: currentAddressItem.area.split(' ')[1]
			}
		} else {
			dat = {
				city: currentAddressItem.area.split(' ')[1],
				lon: location.location.lng,
				lat: location.location.lat,
			}
		}
		console.log(currentAddressItem)
		request_01.storeList(dat).then((value) => {
			console.log('获取门店信息');
			const storeList = value.data.data;
			const msg = value.data.msg;
			const status = value.data.status;

			if (status == 1) {//有门店数据返回
				pickerStoreList = storeList.map((item) => {
					return item;
				})
				picklist = storeList.map((item) => {
					return item.name;
				})
				this.setData({
					storeList,
					pickerStoreList,
					storeIndex: 0,
					picklist,
				})
			}
			else {//门店数据返回出错

				this.setData({
					storeList: [],
					pickerStoreList: [],
					picklist,
					storeIndex: 0,
				})
			}
			alert.loading_h()
		})
	},
	//获取收货人信息
	getInfo() {
		const positionKey = this.data.positionKey;
		router.jump_nav({//跳转到我的地址页 选择地址
			url: '/pages/o_address/o_address?pageType=back'
		})
	},
	//选择获取门店
	bindPickerChange(e) {
		const storeIndex = e.detail.value;
		console.log(storeIndex);
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
	//打开系统设置页
	openSetting() {
		if (this.data.isSettingLocation) return
		gets.openSetting().then(res => {
			if (res.authSetting["scope.userLocation"]) {
				this.data.isSettingLocation = true
				this.getPosition()
			} else {
				console.log("您没有勾选设置")
			}
		})
	},
	formSubmit(e) {
		// //领取微信卡券
		// if (this.data.parmData.prize_type==1){
		// 	this.getwxcard();
		// 	return;
		// }
		//领取非微信卡券
		if (!this.data.currentAddressItem.address_id || this.data.currentAddressItem.address_id == '') {
			alert.alert({ str: '请选择地址等信息' });
			return;
		}
		let dat = {
			prize_id: this.data.parmData.prize_id,
			openid: wx.getStorageSync("userInfo").openid,
			address_id: this.data.currentAddressItem.address_id,
			dlr_code: this.data.pickerStoreList[this.data.storeIndex].code
		}
		request_04.getword(dat).then((res)=>{
			if(res.data.status=='1'){
				tool.jump_red(`/pages/order_detail/order_detail?order_id=${res.data.data.order_id}`)
			}
		})
	},
	// getwxcard(){
	// 	let dat = {
	// 		user_id: wx.getStorageSync("userInfo").user_id,
	// 		order_goods_id: this.data.parmData.order_goods_id
	// 	}
	// 	console.log(dat);
	// 	return;
	// 	request_04.getwxcard(dat).then((res)=>{
	// 		if(res.data.status=='1'){
	// 			console.log(res.data);
	// 		}
	// 	})
	// }
})