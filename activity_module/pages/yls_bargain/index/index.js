// activity_module/pages/xw_assemble/index/index.js
import tool from '../../../../utils/public/tool.js';
import request_04 from '../../../../utils/request/request_04.js';
import request_01 from '../../../../utils/request/request_01.js';
import daojishi  from '../../../../utils/public/util.js';
const app = getApp(); //获取应用实例
let shopTimes = '';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    IMGSERVICE: app.globalData.IMGSERVICE, // 图片基础路径
	activity_id:null,// 经销商活动id
	bargainDat:{},// 砍价信息 存储
	rulspop:false,// 规则弹窗
	djs: {},//倒计时数据
	restTime:null, // 倒计时剩余时间戳
	bargain_id:null,// 砍价id 
	iscarActive:false,// 是否是车主活动
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
	  request_01.login(() => {
		  this.setData({ activity_id: options.activity_id});
		  this.getbargainInfo();
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
	  if (this.data.bargainDat&&this.data.activity_id){
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
  onShareAppMessage: function () {
	  this.shareUp();
	  return {
		  title: '砍价好礼任你选 ！',
		//   imageUrl: `${IMGSERVICE}/lookcar/carshare.jpg`,
		  path: '/activity_module/pages/yls_bargain/index/index'
	  }
  },
	//判断是否授权和是否是车主
	isVehicleOwner(e) {
		console.log('e', e)
		if ((wx.getStorageSync("userInfo").nickName && wx.getStorageSync("userInfo").user_type == 1 && wx.getStorageSync("userInfo").unionid) || (e && e.target.dataset.type != 'ok') || (wx.getStorageSync("userInfo").nickName && !this.data.iscarActive && wx.getStorageSync("userInfo").unionid)) return
		if (!wx.getStorageSync("userInfo").nickName || !wx.getStorageSync("userInfo").unionid) {
			this.setData({ popType: 2 })
		} else if (wx.getStorageSync("userInfo").user_type == 0 && this.data.iscarActive) {
			this.setData({ popType: 3 })
		}
		this.isVehicleOwnerHidePop()
	},
	//授完权后处理
	getParme(e) {
		this.isVehicleOwnerHidePop()
		request_01.setUserInfo(e).then(res => {
			this.isVehicleOwner()
		})
	},
	//是否授权、绑定车主弹窗
	isVehicleOwnerHidePop(){
		this.setData({ isVehicleOwnerHidePop: !this.data.isVehicleOwnerHidePop })
	},
  	getbargainInfo(){// 获取砍价首页信息
	  const userInfo = wx.getStorageSync('userInfo');
  	  let dat = {
			  openid:userInfo.openid,
			  out_id: this.data.activity_id
		} 
	  request_04.bargainDel(dat).then((res)=>{
		  console.log(res.data);
		  if(res.data.status==1){
			  this.setData({ 
				  bargainDat: res.data.data,
				  restTime: res.data.data.card_info.count_down,
				  bargain_id: res.data.data.bargain_info.bargain_id,
				  iscarActive: res.data.data.activity_info.car_owner == 1
				  });
			  this.getdjsTime();
			  this.setRule();
		  }else{
			  tool.alert(res.data.msg)
		  }
	  })
  },
actPop() {//弹出活动规则
	this.setData({ rulspop: true })
},
closePop(){ // 关闭规则弹窗
	this.setData({ rulspop: false });
	this.setRule();
},
getdjsTime(){// 获取倒计时
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
goHome(){// 回首页
	tool.jump_red('/pages/index/index');
},
setRule() {//判断活动状态
	if (!wx.getStorageSync("isRule").deabargain) {
		this.setData({ rulspop: true });
		let _isRule = wx.getStorageSync("isRule") || {}
		_isRule.deabargain = true
		wx.setStorageSync("isRule", _isRule)
	} else {
		if (this.data.bargainDat.activity_info.status == 2) {
			this.setData({
				isVehicleOwnerHidePop: true,
				popType: 1,
				poptxt: "活动预计" + 2020 + "号开启 敬请期待"
			})
		} else if (this.data.bargainDat.activity_info.status == 3) {
			this.setData({
				isVehicleOwnerHidePop: true,
				popType: 1,
				poptxt: "活动已结束"
			})
		}
	}
},
immdEnter(e){//立即参与
	if ((wx.getStorageSync("userInfo").user_type == 0 && this.data.iscarActive) || !wx.getStorageSync("userInfo").nickName || !wx.getStorageSync("userInfo").unionid) return;
	if (wx.getStorageSync("userInfo").user_type == 0 && this.data.iscarActive) {
		this.setData({ popType: 4 });
		this.isVehicleOwnerHidePop();
		return;
	}
	let dat = {
		activity_id: this.data.activity_id,
		shopName: this.data.bargainDat.activity_info.title,
		shopPrice: this.data.bargainDat.card_info.coupon_price
	}	
	if (dat.shopPrice){
		tool.jump_nav(`/activity_module/pages/yls_bargain/leaveInfo/leaveInfo?obj=${JSON.stringify(dat)}`);
	}else{
		tool.alert("加载中请稍后！");
	}
	}, 
	continuebargain(){ // 继续砍价
		if (this.data.bargainDat.bargain_info.bargain_id){
			tool.jump_nav(`/activity_module/pages/yls_bargain/bargain_index/bargain_index?bargain_id=${this.data.bargainDat.bargain_info.bargain_id}&activity_id=${this.data.activity_id}`);
		}else{
			tool.alert("请稍候！")
		}
	},
	shareUp(){ // 分享上报
		let userInfo = wx.getStorageSync("userInfo");
		let dat = {
			openid:userInfo.openid,
			out_id:this.data.activity_id,
			out_type:1,
			page_id:1,
			page_name:'经销商砍价首页'
		} 
		request_04.share_log(dat).then((res)=>{
			console.log(res.data);
		})	
	},
	getworld() {//领取奖品
		tool.loading();
		let useobj = wx.getStorageSync("userInfo");
		let dat = {
			bargain_id: this.data.bargain_id,
			openid: useobj.openid
		}
		request_04.bargainreceive(dat).then((res) => {
			// console.log(res.data);
			tool.loading_h();
			if (res.data.status != 1) {
				tool.alert(res.data.msg);
			} else {
				tool.jump_nav("/pages/order_detail/order_detail?order_id=" + res.data.data.order_id);
			}
		})
	}
})