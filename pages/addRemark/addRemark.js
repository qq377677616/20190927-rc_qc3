// pages/addRemark/addRemark.js
const app = getApp();//获取应用实例
const require_01 = require('../../utils/request/request_01.js');
const alert = require('../../utils/tool/alert.js');
const route = require('../../utils/tool/router.js');
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		IMGSERVICE: app.globalData.IMGSERVICE,
		remarkContent:'',
		rid:''
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		this.setData({rid:options.rid})	
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
	changeIpt(e) {//输入
		let iptTxt = e.detail.value; 
		this.setData({ remarkContent:iptTxt});
		// console.log(iptTxt);
	},
	formSubmit(e) {// 评论
		if (this.data.remarkContent != '') {
			let form_id = e.detail.formId;
			let dat = {
				user_id: wx.getStorageSync('userInfo').user_id,
				article_id: this.data.rid,
				content: this.data.remarkContent,
				form_id: form_id
			}
			console.log('评论时候请求参数', dat);
			require_01.remarkArt(dat).then((res) => {
				console.log(res.data);
				if (res.data.status == 1) {
					alert.alert({ str: '评论内容已提交后台审核，请耐心等候' });
					this.setData({ remarkContent: '' });
					let time =  setInterval(()=>{
						clearInterval(time);
						route.jump_back();
					},1500)
				}
			}).catch((reason) => {
				console.log(reason);
			})
		} else {
			alert.alert({ str: '请输入有效内容！' })
		}

	}
})