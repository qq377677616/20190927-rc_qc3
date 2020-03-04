// pages/take/takeDel.js
let app = new getApp();
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		BASEURL: app.globalData.ASSETSURL,
		msg:'',
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		this.creatSocket();
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
	// onShareAppMessage: function () {

	// }
	creatSocket(){
		let socketOpen = false
		let socketMsgQueue = []
		wx.connectSocket({
			url: 'ws://192.168.1.193:8282'
		})

		wx.onSocketOpen(function (res) {
			socketOpen = true
			for (let i = 0; i < socketMsgQueue.length; i++) {
				sendSocketMessage(socketMsgQueue[i])
			}
			socketMsgQueue = []
		})

		function sendSocketMessage(msg) {
			if (socketOpen) {
				wx.sendSocketMessage({
					data: msg
				})
			} else {
				socketMsgQueue.push(msg)
			}
		}
	},
	getval(e){//保存消息
	  this.setData({msg:e.detail.value});
	},
	sendMsg(){// 发送消息
		let msg = this.data.msg;
		msg = msg.replace(/^\s+|\s+$/g, '');
		if(msg==''){
			console.log("输入不能为空")
		}else{
			console.log(msg)
		}
	}
})