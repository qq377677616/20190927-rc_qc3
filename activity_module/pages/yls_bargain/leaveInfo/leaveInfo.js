const app = getApp();
import tool from '../../../../utils/public/tool.js';
import request_04 from '../../../../utils/request/request_04.js';
import request_01 from '../../../../utils/request/request_01.js';
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		IMGSERVICE: app.globalData.IMGSERVICE,
		// array: ['美国', '中国', '巴西', '日本'],
		positionKey:true,// 控制地址来源 
		currentAddressItem: {},// 保存地址对象
		pickerStoreList: [],// 保存门店地址
		area: null,
		address: null,
		useName: null,
		mobile: null,
		active_id:22,
		store_index:0
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		request_01.login(() => {
			this.getdefultAddress();
			this.getstorge();
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
		this.setData({
			currentAddressItem: app.globalData.currentAddressItem
		})
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
	//获取收货人信息
	getInfo() {
		const positionKey = this.data.positionKey;

		if (!positionKey) return;//定位中不能操作

		tool.jump_nav('/pages/o_address/o_address?pageType=back')
		
	},
	getdefultAddress(){
		const userInfo = wx.getStorageSync('userInfo');
		let currentAddressItem = null;
		let dat = {
			user_id: userInfo.user_id
		}
		request_04.defaultAddress(dat).then((res)=>{
			 const data = res.data.data;
			  if(res.data.status==1){
				this.setData({
					area: data.area,
					address: data.address,
					useName: data.name,
					mobile: data.mobile
				})
				currentAddressItem = Object.assign(data, {
					real_address: data.area.replace(/\s+/g, "") + data.address
				})
				this.setData({ currentAddressItem: currentAddressItem });
			}
		})
	},
	getstorge(){
		let dat = {
			out_id:this.data.active_id
		}
		request_04.store_list(dat).then((res)=>{
			console.log(res.data)
			if(res.data.status==1){
				this.setData({ pickerStoreList:res.data.data})
			}
		})
	},
	bindPickerChange: function (e) {
		console.log('picker发送选择改变，携带值为', e.detail.value)
		this.setData({
			store_index: e.detail.value
		})
	}
})