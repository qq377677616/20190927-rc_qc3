// pages/take/takeDel.js
import tool from "../../../utils/public/tool.js"
import https from "../../../utils/api/my-requests.js"
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
		this.setData({uid:options.uid,to_uid:options.to_uid})
		this.creatSocket();
		this.msgLog();
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
		console.log("用户下拉");
		setTimeout(()=>{
			wx.stopPullDownRefresh();
		},2000)
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
	acceptmag() {//接收信息 use: 1 自己 2 别人  type为接收的信息类型 c_type:1 为文字 2为图片
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
					arr.push({content:self.data.msg,type:1,use:1,c_type:1})
					self.setData({ sendload:arr,msg:''})
					break;
				}
			}
		})
	},
	msgLog(){//查询消息记录
		let dat = {
			page:0,
			uid:this.data.uid,
			to_uid: `${this.data.to_uid}A`,
			limit:10
		}
		https.msgLog(dat).then((res)=>{
			console.log(res.data)
		}).catch((err)=>{
			console.log(err)
		})
	},
	upimg(){
		wx.chooseImage({
			success(res) {
				const tempFilePaths = res.tempFilePaths
				wx.uploadFile({
					url: 'http://uavx3q.natappfree.cc/index.php/index/index/upload', //仅为示例，非真实的接口地址
					filePath: tempFilePaths[0],
					name: 'file',
					formData: {
						
					},
					success(res) {
						const data = res.data
						//do something
						console.log(data);
					}
				})
			}
		})

	}
})