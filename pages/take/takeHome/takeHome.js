// pages/takeHome/takeHome.js
let app = new getApp();
import https from '../../../utils/api/my-requests.js';

import tool from '../../../utils/public/tool.js';

import auth from '../../../utils/public/authorization.js'

const request_01 = require('../../../utils/request/request_01.js');

const alert = require('../../../utils/tool/alert.js');

const method = require('../../../utils/tool/method.js');

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		BASEURL: app.globalData.ASSETSURL,//基本路径
		useData:{},// 用户数据
		iscope:false,//复制弹窗控制
		carlist: [// 车型图 和 名字
			{ txt: '星', img: '/ca_xing.png', id: 11 },
			{ txt: 'D60', img:'/ca_d60.png',id:3},
			{ txt: 'D60EV', img:'/ca_d60ev.png',id:5},
			{ txt: 'E30', img: '/ca_e30.png',id:10},
			{ txt: 'T60', img: '/ca_t60.png',id:6},
			{ txt: 'T60EV', img: '/ca_t60ev.png',id:13},
			{ txt: 'T70', img: '/ca_t70.png',id:7},
			{ txt: 'T90', img: '/ca_t90.png',id:9}
			],
		showModalOption: {//定位 弹窗
			isShow: false,
			type: 0,
			title: "获取位置信息",
			test: "小程序将访问您的手机定位，自动定位到您当前所在城市信息。",
			cancelText: "取消",
			confirmText: "授权",
			color_confirm: '#A3271F'
		},
		isShowLoading: false,// 是否显示loading
		userInfo:null,
		uid:null,// 自己id
		to_uid:null,// 给别人的id
		linkNum:1, // socket 连接次数
		codeuser:null,//是不是扫码用户
		hasdot:false,//是否有红点  默认没有
		takeNum:'',//聊天数
		servepop:false,//人员服务弹窗
		code:null,// 通过code查询专营店
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options){
		console.log(options,'5555');
		request_01.login(() =>{
			this.setData({ codeuser: options.userid, code:options.code })
			if (options.obj) {
				let obj = JSON.parse(options.obj);
				this.setData({ servepop: true, useData: obj });
			} else {
				this.getInfo();
			}
			this.setData({
				userInfo: wx.getStorageSync("userInfo") || {}
			})
			this.authBtn();
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
		if (this.data.uid && this.data.useData.userid){
			this.acceptmag();
			this.msgList();
		}
	},
	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function () {
		// app.globalData.socketOpen = false;
		// this.closesck();
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
	//loading框
	isShowLoading() {
		this.setData({
			isShowLoading: !this.data.isShowLoading
		})
	},
	//授权
	authBtn(){
		console.log("授权");
		let dat = {
			app_id:'wx1d585c8c2fffe589',
			openid: this.data.userInfo.openid
			// nickname: this.data.userInfo.nickname||'',
			// avatar: this.data.userInfo.headimg||''
		}
		https.clientLogin(dat).then((res)=>{
			console.log(res.data.data);
			if(res.data.code==1)this.setData({uid:res.data.data});
			this.scoketInit(); // 初始化scoket
			this.msgList();
			// console.log(this.data.useData)
		})
	},
	clientUpdate(){
		let dat = {
			app_id: 'wx1d585c8c2fffe589',
			openid: this.data.userInfo.openid,
			nickname: this.data.userInfo.nickname,
			avatar: this.data.userInfo.headimg
		}
		https.clientUpdate(dat).then((res) => {
			console.log(res.data.data);
			// console.log(this.data.useData)
		})
	},
	getUserInfo(e) { // 授权
		request_01.setUserInfo(e)
			.then((res) => {
				console.log("授权、上传头像昵称成功")
				this.setData({
					userInfo: wx.getStorageSync("userInfo")
				})
				this.clientUpdate();			
			})
			.catch((err) => {
				console.log(typeof err);
				err && alert.alert({
					str: JSON.stringify(err)
				})
			})
	},
	getInfo(){//获取专营店信息
		tool.loading("自动定位中")
		method.getPosition().then((value)=>{// 获取地理位置
				let dat =  {};
				console.log(value)
				let locat = value.result.location;
				console.log(locat);
				this.data.codeuser?dat = {
					userid: this.data.codeuser	
				} : this.data.code?dat={code:this.data.code}:dat = {
					lon: locat.lng,
					lat: locat.lat,
					page: 0,
					limit: 1
				}
				console.log("定位坐标",dat.lon,dat.lat);
				https.getInfo(dat).then((res) => {
					// console.log(res);
					if (res.data.code == 1) {
						tool.loading_h();
						console.log(res);
						this.setData({ useData: res.data.data[0], servepop:true})
						this.msgList();// 获取是否有红点 
					} else {
						tool.alert(res.data.msg)
					}
				})
		})
		.catch(err => {
			console.log("定位失败", err)
			tool.alert("定位失败") 
			tool.loading_h()
			this.showHideModal()
		})
		
	},
	copeTxt(){ 
		this.setData({iscope:false});
	},
	addwx(){
		this.setData({iscope:true});
	},
	takeMan(){ //聊一聊userInfo.nickName || !userInfo.unionid
		if (this.data.userInfo.nickName && this.data.userInfo.unionid && this.data.useData.userid){
			this.subMsg().then((rel) => { 
				this.clientUpdate();
				tool.jump_nav(`/pages/take/takeDel/takeDel?uid=${this.data.uid}&&name=${this.data.useData.name}&to_uid=${this.data.useData.userid}&handimg=${this.data.useData.avatar}`);
				this.cleardot();
			});
		}else{
			tool.alert("加载中请稍后！");
		}
	},
	// 跳转到专营店列表
	storlist(){
		if (this.data.userInfo.nickName && this.data.userInfo.unionid && this.data.useData.userid) {
			tool.jump_nav(`/pages/take/dealers/dealers`);
		}else{
			return;
		}
		
	},
	//点击自定义Modal弹框上的按钮
	operation(e){
		if (e.detail.confirm) {
			auth.openSetting(res => {//用户自行从设置勾选授权后
				if (res.authSetting["scope.userLocation"]) {
					this.getInfo()
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
	// 自定义弹窗
	showHideModal(){
		let _showModalOption = this.data.showModalOption
		_showModalOption.isShow = !_showModalOption.isShow
		this.setData({ showModalOption: _showModalOption })
		console.log(this.data.showModalOption)
	},
	//邀请成功 回调
	completemessage(){
		tool.showModal("确认",`已经发送服务通知请注意查收`);
	},
	// 点击打电话
	callPhone(e){
		let phone = e.currentTarget.dataset.phone;
		if(phone){
			wx.makePhoneCall({
				phoneNumber: `${phone}`,
			})
		}else{
			tool.alert("暂无座机");
		}
	},
	navMap(){//第三方地图跳转
		let self = this;
		wx.getLocation({
			type: 'gcj02', //返回可以用于wx.openLocation的经纬度
			success(res) {
				const latitude = parseFloat(self.data.useData.latitude);
				const longitude = parseFloat(self.data.useData.longitude);
				wx.openLocation({
					latitude,
					longitude,
					scale: 16
				})
			}
		})
	},
	carDel(e){
		let id = e.currentTarget.dataset.id;
		if (id == 9) {
			// 跳转T90页面
			tool.jump_nav(`/pages/look_car_detail/look_car_detail?id=${9}`);
		}
		else if (id == 11) {
			// 启辰星
			// tool.jump_nav(`/pages/look_car_detail_03/look_car_detail?id=${11}`)
			wx.navigateToMiniProgram({
				appId: 'wx5c64e733d849c3ef',
				path: '',
				extraData: {},
				envVersion: 'release',
				success(res) {
					console.log('跳转成功');
				}
			})
		}
		else {
			tool.jump_nav(`/pages/look_car_detail_02/look_car_detail_02?id=${id}`)
		}
	},
	creatSocket(){
		let self = this;
		wx.connectSocket({
			url: app.globalData.SOCKETURL,
			timeout: 10000,
			success(res) {
				self.listlenskt();
			},
			fail(res) {
				tool.loading_h(); 
				console.log('=====连接失败====' + res);
			},
			complete(dat){
				console.log('+++', app.globalData.socketOpen);
				tool.loading_h(); 
				self.setData({ linkNum:++self.data.linkNum });
				if (!app.globalData.socketOpen){
					self.scoketInit();
				}
			}
		})
		
	},
	listlenskt(){ // 监听socket
		let self = this;
		wx.onSocketOpen((res) => {
			app.globalData.socketOpen = true;
			console.log('=====socket打开成功！=====');
			self.setData({ linkNum: 1 });
			self.bindUse(); // 绑定用户
			self.scoketClose();// 监听socket关闭
			self.acceptmag();// 接收socekt
			tool.loading_h(); 
		})
	},
	scoketClose(){// 监听socket 关闭事件 重连
		let self = this; 
		wx.onSocketClose((res)=>{
			app.globalData.socketOpen = false;
			console.log("=====socket关闭原因=====",res);
			self.scoketInit();
		})
	},
	scoketErr(){// 监听socket 错误时 重连
		let self = this;
		wx.onSocketError((res)=>{
			app.globalData.socketOpen = false;
			console.log("=====socket错误=====", res);
			self.scoketInit();
		})
	},
	scoketInit(){ // 初始化socket
		let time = null;
		clearInterval(time);
		if (!app.globalData.socketOpen && this.data.linkNum==1){ // 第一次直接连接
			console.log("第一次连接")
			this.creatSocket();
		}else{ //  重连 10秒一次
			time = setInterval(() => {
				if (!app.globalData.socketOpen && this.data.linkNum <= 11) {
					clearInterval(time);
					this.creatSocket();
					tool.loading(`第${this.data.linkNum-2}次重连！`); 
				} else {
					if (!app.globalData.socketOpen)
					tool.alert('服务器开小差了！');
					clearInterval(time);
				}
			}, 50000)

		}
	},
	bindUse(){// 绑定 
		let time = null;
		wx.sendSocketMessage({
			data: '{"type":"bind","uid":"' + this.data.uid + '"}'
		})
		clearInterval(time);
		time = setInterval(() => { // 发送心跳
			wx.sendSocketMessage({
				data: '{"type":"ping"}'
			})
		}, 50000)
	},
	closesck(){// 关闭socket
		if (app.globalData.socketOpen){
			wx.closeSocket({
				success(res){
					console.log(res);
				}, fail(err){
					console.log(err);
				},complete(dat){
					console.log(dat);
				}
			})
		} 
	},
	acceptmag(){//接收信息 is_ob: 1 自己 0 别人  msg_type为接收的信息类型 msg_type:1 为文字 2为图片
		let self = this;
		wx.onSocketMessage(function (msg) {
			// console.log(self.data.useData)
			let data = JSON.parse(msg.data);
			let code = data.code;
			let type = data.type;
			if (code != 1) return;
			switch (type) {
				case 'receive': {
					self.msgList();
					break;
				}
			}
		})
	},
	msgList() {// 获取消息记录 
		// console.log(this.data.useData)
		let dat = {
			client_id: this.data.uid, //239658+'A'//this.data.useData.userid+'A',
			service_id: `${this.data.useData.userid}A`
		}
		https.msgList(dat).then((res) => {
			if (res.data.code == 1) {
				console.log(res.data.data)
				this.setData({ 
					hasdot: res.data.data > 0,
					takeNum: res.data.data
				})
				console.log(this.data.takeNum);
			}
		})
	},
	cleardot() { // 清除红点  //239658+'A'//this.data.useData.userid+'A',
		let dat = {
			uid:this.data.uid,
			to_uid: `${this.data.useData.userid}A`
		}
		https.cleaninfo(dat).then((res)=>{
			console.log(res);
		})
	},
	subMsg() { // 发送订阅消息
		return new Promise((resolve, reject) => {
			wx.requestSubscribeMessage({
				tmplIds: ['adOBVu25IYMu8usw2VbaO1US8B9yB95xbTzlBzEYai0'],
				success(res) {
					resolve(res);
				}
			})
		})
	},
	closePop(){
		this.setData({ servepop:false})
	},
	goqcXing(){
		wx.navigateToMiniProgram({
			appId: 'wx5c64e733d849c3ef',
			path: '',
			extraData: {},
			envVersion: 'release',
			success(res) {
				console.log('跳转成功');
			}
		})
	}
})