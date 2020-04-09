// pages/bargain_state/bargain_state.js
import tool from '../../../../utils/public/tool.js';
import daojishi from '../../../../utils/public/util.js';
import request_04 from '../../../../utils/request/request_04.js';
import request_01 from '../../../../utils/request/request_01.js';
let shopTimes = '';
const app = getApp(); //获取应用实例
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		IMGSERVICE: app.globalData.IMGSERVICE, // 页面基础路径
		firstShow: false,
		page404: false,
		options: {},
		kjList: [{ name: 12 }, { name: 12 }, { name: 12 }, { name: 12 }, { name: 12 }],
		userName: '',//昵称
		userImg: '',	//头像
		freeData: [],//多少人免费拿到数据
		percent: 0,//砍价百分比
		shopInfo: { //buttom_type:1 砍价超时  3 正在砍价 2 用户领取
			buttom_type:2
		},
		barRecord:[],
		bargain_id:null,// 砍价id
		bargainDat:{},//砍价信息对象
		restPrice:0,//剩余金额 
		restTime:null,// 剩余时间
		currStatus:1,// 进入当前页面的状态
		barpop:false,//砍价弹窗
		barprice:null,// 砍价金额
		activity_id:23,// 活动id
		is_bargain:null,//是否能帮忙砍价
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		request_01.login(() => {
			let useobj = wx.getStorageSync('userInfo');
			this.setData({ 
				 barprice: options.barprice,
			     barpop: options.barprice, 
				 bargain_id: options.bargain_id, 
				 userInfo: useobj, 
				 activity_id: options.activity_id||this.data.activity_id
				 });
			this.getbargainInfo();
			if (options.openid && options.openid == useobj.openid || !options.openid){
				 console.log("通过分享进来并且是自己人！");
				this.setData({ currStatus:1})
			} else if (options.openid && options.openid != useobj.openid){
				 console.log("通过分享进来并且不是自己人！");
				this.setData({ currStatus:2})
			}
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
		const userInfo = wx.getStorageSync('userInfo');
		if (userInfo.openid&&this.data.bargain_id){
			this.getbargainInfo();
		}	
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
	onShareAppMessage: function (option) {
		let useobj = wx.getStorageSync('userInfo');
		return {
			title: '砍价好礼任你选 ！',
			//   imageUrl: `${IMGSERVICE}/lookcar/carshare.jpg`,
			path: `/activity_module/pages/yls_bargain/bargain_index/bargain_index?openid=${useobj.openid}&bargain_id=${this.data.bargain_id}&activity_id=${this.data.activity_id}`
		}		
	},
	getbargainInfo(){// 获取砍价信息
		tool.loading();
		const userInfo = wx.getStorageSync('userInfo');
		let dat = {
			bargain_id:this.data.bargain_id,
			openid:userInfo.openid
		}
		request_04.bargain_info(dat).then((res)=>{
			if(res.data.status==1){
				console.log(res.data);
				this.setData({ 
				bargainDat: res.data.data, 
				barRecord: res.data.data.bargain_list,
				restPrice: parseFloat((res.data.data.bargain_info.total_price) - parseFloat(res.data.data.bargain_info.bargain_price)).toFixed(2),
				percent: parseInt(parseInt(res.data.data.bargain_info.bargain_price) / parseInt(res.data.data.bargain_info.total_price) * 100),
				restTime: res.data.data.card_info.count_down,
				})
				this.getdjsTime();
				tool.loading_h();
			}else{
				tool.alert(res.data.msg);
				tool.loading_h();
			}
		})
	},
	getdjsTime() {// 获取倒计时
		let restTime = this.data.restTime;
		if (restTime > 0) {
			clearInterval(shopTimes);
			shopTimes = setInterval(() => {
				if (restTime >= 0) {
					var time = daojishi.minutesAndSeconds(restTime--);
				} else {
					clearInterval(shopTimes);
					this.getbargainInfo();
				}
				this.setData({ djs: time.tiems });
			}, 1000)
		} else {
			console.log('昨天砍价已结束')
		}
	},
	helpBargain(){ //帮好友砍价
		if(!this.data.userInfo.nickName || !this.data.userInfo.unionid) return;
		if (!this.data.is_bargain){
			tool.alert("请稍候！");
		} else if (this.data.is_bargain==1){
			tool.alert("您已经帮他砍过价了！");
		}
		const userInfo = wx.getStorageSync('userInfo');
		let dat = {
			openid:userInfo.openid,
			bargain_id:this.data.bargain_id
		}
		request_04.helpbargain(dat).then((res)=>{
			// console.log(res.data);
			if(res.data.status==1){
				this.setData({ barpop: true, barprice: res.data.data.bargain_price});
				this.getbargainInfo();
			}else{
				tool.alert(res.data.msg);
			}
		})
	},
	closePop(){// 关闭砍价弹窗
		this.setData({ barpop:false});
	},
	getUserInfo(e){// 没授权 去授权
		request_01.setUserInfo(e).then(res => {
			if (res) {
				this.setData({
					userInfo: wx.getStorageSync("userInfo")
				})
			}
		}).catch(err => { console.log("err", err) })
	},
	selfFreeget(){ // 自己也要免费拿
		tool.jump_nav(`/activity_module/pages/yls_bargain/index/index?activity_id=${this.data.activity_id}`);
	},
	goHome(){// 跳转至首页
		tool.jump_red('/pages/index/index');
	},
	getworld(){//领取奖品
		tool.loading();
		let useobj = wx.getStorageSync("userInfo");
		let dat = {
			bargain_id:this.data.bargain_id,
			openid:useobj.openid
		}
		request_04.bargainreceive(dat).then((res)=>{
			// console.log(res.data);
			tool.loading_h();
			if(res.data.status!=1){
				tool.alert(res.data.msg);
			}else{
				tool.jump_nav("/pages/order_detail/order_detail?order_id=" +res.data.data.order_id);
			}
		})
	}
})