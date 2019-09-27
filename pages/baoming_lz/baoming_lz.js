// pages/yuyue_lz/yuyue_lz.js
const tool =require('../../utils/tool/tool.js')
const auth = require('../../utils/tool/authorization.js')  
const app = getApp();
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		region: ['北京市', '北京市', '东城区'],
		showModalOption: {
			isShow: false,
			type: 0,
			title: "获取位置信息",
			test: "小程序将访问您的手机定位，自动定位到您当前所在城市信息。",
			cancelText: "取消",
			confirmText: "授权",
			color_confirm: '#A3271F'
		},
		isShowLoading: false,
		IMGSERVICEZ: app.globalData.IMGSERVICE,
		array: ['美国', '中国', '巴西', '日本'],
		index:1
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		
		this.getPosition();
		// this.setData({ myPhone: wx.getStorageSync("userInfo").phone || '1**********' })
		// if (!wx.getStorageSync("userInfo")) {
		// 	tool.showModal("请先去授权", "你还未授权登录，请先去授权登录吧", "好的,#333", false).then(() => {
		// 		tool.jump_back()
		// 	})
		// } else {
		// 	this.setData({ isGetPhoneNumber: true })
		// }
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
	getPhoneNumber(e) {
		tool.alert("获取手机号成功")
		this.setData({ myPhone: e.detail.phone })
	},
	bindPickerChange: function (e) {
		console.log('picker发送选择改变，携带值为', e.detail.value)
		this.setData({
			index: e.detail.value
		})
	},
	getPosition() {
		tool.loading("自动定位中")
		tool.getPosition().then(res => {
			console.log("定位详细信息", res)
			let _address_component = res.result.address_component
			console.log("经度---->", res.result.location.lng)
			console.log("纬度---->", res.result.location.lat)
			console.log("省---->", _address_component.province)
			console.log("市---->", _address_component.city)
			console.log("区---->", _address_component.district)
			this.setData({ region: [_address_component.province, _address_component.city, _address_component.district] })
			tool.loading_h()
		}).catch(err => {
			console.log("定位失败", err)
			tool.alert("定位失败")
			tool.loading_h()
			this.showHideModal()
		})
	},
	//点击自定义Modal弹框上的按钮
	operation(e) {
		if (e.detail.confirm) {
			auth.openSetting(res => {//用户自行从设置勾选授权后
				if (res.authSetting["scope.userLocation"]) {
					this.getPosition()
				}
			})
			this.showHideModal()
		} else {
			tool.loading("")
			this.showHideModal()
			setTimeout(() => {
				tool.loading_h()
				this.showHideModal()
			}, 600)
		}
	},
	bindRegionChange: function (e) {//手动选择地址
		this.setData({
			region: e.detail.value
		})
	},
	//打开、关闭自定义Modal弹框
	showHideModal() {
		let _showModalOption = this.data.showModalOption
		_showModalOption.isShow = !_showModalOption.isShow
		this.setData({ showModalOption: _showModalOption })
	}
})