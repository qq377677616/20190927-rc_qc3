// pages/take/takeDel.js
let app = new getApp();
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		BASEURL: app.globalData.ASSETSURL,//资源基本路径
		msg:'',//发送的信息
		socketOpen:false,//是否连接
		socketMsgQueue:[],//
		popshow:false,//
		sendload:[]
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
		let socketOpen = false;
		let socketMsgQueue = [];
		let self = this;
		wx.connectSocket({
			url: 'ws://192.168.1.193:8282'
		})

		wx.onSocketOpen(function (res) {
			socketOpen = true
			console.log('连接成功！');
			self.setData({socketOpen:true})
			self.bindUse(); // 绑定用户
		})

		this.acceptmag();// 接收socekt
	},
	getval(e){//保存消息
	  this.setData({msg:e.detail.value});
	},
	bindUse(){// 绑定 
		let time = null;
		wx.sendSocketMessage({
			data: '{"type":"bind","uid":"1"}'
		})

		clearInterval(time);
		time = setInterval(()=>{ // 发送心跳
			wx.sendSocketMessage({
				data: '{"type":"ping"}'
			})
		},50000)
	},
	sendMsg(){// 发送消息
		let msg = this.data.msg;
		msg = msg.replace(/^\s+|\s+$/g, '');
		if(msg==''){
			console.log("输入不能为空")
		}else{
			let content = `{"type":"send","to_uid":"50A","data":{"msg_type":"1","content":"${msg}"}}`; 
			if (this.data.socketOpen) {
				wx.sendSocketMessage({
					data: content
				})
			} else {
				console.log(2)
				socketMsgQueue.push(content)
			}
		}
	},
	acceptmag(){//接收信息 use: 1 自己 2 别人  type为接收的信息类型
		let self = this;
		let arr = [];
		wx.onSocketMessage(function (msg) {
			let data = JSON.parse(msg.data);
			let code =  data.code;
			let type = data.type;
			if(code!=1)return;
			switch (type){
				case 'send':{ //接收发送的信息
					console.log(data.type)
					arr.push({content:self.data.msg,type:1,use:1})
					self.setData({ sendload:arr,msg:''})
					break;
				}
			}
		})
	},
	amplt(){
		// console.log(11)
		this.setData({ popshow:true});
	},
	hidepop(){
		this.setData({popshow:false})
	}
})