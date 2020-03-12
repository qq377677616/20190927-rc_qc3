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
		socketMsgQueue:[],//消息队列
		sendload:[],// 消息数据
		msg_type:1,// 发送消息类型
		page:0,// 当前页
		havpage:true,//是否还有下一页
		uid:null,// 自己的id
		to_uid:null, // 客服id
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		console.log(options)
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
		if (this.data.havpage){
			this.setData({page:++this.data.page});
			this.msgLog();
		}else{
			tool.alert("无更多信息！");
		}
		setTimeout(()=>{
			wx.stopPullDownRefresh();
		},800)
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
			data: '{"type":"bind","uid":"'+this.data.uid+'"}'
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
		console.log(msg,this.data.msg_type);
		// return;
		if(msg==''){
			console.log("输入不能为空");
			tool.alert("输入不能为空");
		} else {//${this.data.to_uid}
			let content = `{"type":"send","to_uid":"YangLiSongA","data":{"msg_type":"${this.data.msg_type}","content":"${msg}"}}`; 
			if (this.data.socketOpen) {
				this.setData({msg_type:1})
				wx.sendSocketMessage({
					data: content,
					success:(res)=>{
						console.log("成功",res);
					},
					fail(err){
						console.log('失败',err);
					}
				})
			} else {
				socketMsgQueue.push(content)
			}
		}
	},
	acceptmag() {//接收信息 is_ob: 1 自己 0 别人  msg_type为接收的信息类型 msg_type:1 为文字 2为图片
		let self = this;
		let arr = [];
		wx.onSocketMessage(function (msg) {
			let data = JSON.parse(msg.data);
			let code =  data.code;
			let type = data.type;
			if(code!=1)return;
			switch (type){
				case 'send':{ //接收发送的信息
					console.log(self.data.msg_type);
					arr.push({ content: self.data.msg, type: 1, is_ob: 1, msg_type:self.data.msg_type});
					self.setData({ sendload: [...self.data.sendload, ...arr],msg:''});
					console.log(self.data.sendload);
					self.conutHeg();
					break;
				}
				case 'recieve':{
					self.conutHeg();
					break;
				}
			}
		})
	},
	msgLog(){//查询消息记录
		let dat = {
			page:this.data.page,
			uid:this.data.uid,
			to_uid: `${this.data.to_uid}A`,
			limit:10
		}
		https.msgLog(dat).then((res)=>{
			if (res.data.code == 1){
				this.setData({ sendload: [...res.data.data, ...this.data.sendload], havpage: res.data.data.length >= 10 });
			}
		}).catch((err)=>{
			console.log(err)
		})
	},
	upimg(){ // 发送图片
		https.uploadFiles().then((res)=>{
			console.log(res.data);
			if(res.code==1){
				this.setData({ msg: res.data, msg_type:2});
				this.sendMsg(2)	
			}
		})
	},
	setscret(){
		this.conutHeg();
	},
	preview(e){ // 图片预览
		let arr = [];
		let currentUrl = e.currentTarget.dataset.src;
		for (let i = 0; i < this.data.sendload.length;i++){
			let dat = this.data.sendload;
			if (dat[i].msg_type==2){
				arr.push(dat[i].content);
			}
		}	
		wx.previewImage({
			current: currentUrl, // 当前显示图片的http链接
			urls:arr // 需要预览的图片http链接列表
		})	
	},
	conutHeg(){// 计算滚动高度
	    console.log(8888)
		setTimeout(()=>{
			tool.getDom('.infobox').then((res) => {
				if (res[0].height > wx.getSystemInfoSync().windowHeight) {
					wx.pageScrollTo({
						scrollTop: (res[0].height - wx.getSystemInfoSync().windowHeight + 50),
						duration: 100
					})
				}
			})
		},1000)
	}
})