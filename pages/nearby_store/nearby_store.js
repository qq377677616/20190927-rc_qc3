// pages/nearby_store/nearby_store.js
const request_01 = require('../../utils/request/request_01.js');

const request_04 = require('../../utils/request/request_04.js');

const router = require('../../utils/tool/router.js');

const alert = require('../../utils/tool/alert.js');

const tool  = require('../../utils/public/tool.js');

const auto = require('../../utils/public/authorization.js');
const app = getApp();//获取应用s实例
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
	  isShowLoading: false
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
  onShareAppMessage: function () {

  },
  //页面初始化
  initData(){
    
  },
	isShowLoading() {
		this.setData({
			isShowLoading: !this.data.isShowLoading
		})
	},
	//所在城市的picker
	bindRegionChange: function (e) {
		this.setData({
			region: e.detail.value
		})
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function () {
		this.getPosition()
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
	//打开、关闭自定义Modal弹框
	showHideModal() {
		let _showModalOption = this.data.showModalOption
		_showModalOption.isShow = !_showModalOption.isShow
		this.setData({ showModalOption: _showModalOption })
	},
	getStorelist(){
		requ
	}
})