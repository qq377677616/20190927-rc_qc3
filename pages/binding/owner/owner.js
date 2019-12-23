// pages/binding/owner/owner.js
const app = getApp()
import request4 from "../../../utils/request/request_04.js"
import request1 from '../../../utils/request/request_01.js'
import tool from '../../../utils/public/tool.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    IMGSERVICE: app.globalData.IMGSERVICE,
	rulePop:false,//刮刮乐弹窗默认关闭
	isfirst:1,// 是否是第一次
	parms:null,//页面参数
	activeData:null,//活动数据
	activeStatus:null,//活动状态
	praTime:null,//活动预计开启时间
	ruleimg:null,//活动非正常时候的规则图
	iscarActive:false,//是否是车主活动
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
	  this.setData({parms:options})
	  request1.login(() => {
		  this.setData({
			  activity_id: options.activity_id || wx.getStorageSync('activity_id'),
			  userInfo: wx.getStorageSync("userInfo"),
		  });
		  this.activeStus();
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
  activeStus(){
	//查询活动状态
	let dat= {
		activity_id: this.data.parms.activity_id,
		openid: this.data.userInfo.openid	
	}
	  request4.shaveDel(dat).then((res)=>{
		//   if(res.data.status=='1'){
			  this.setData({ 
				  activeData: res.data.data.activity_info,
				  activeStatus:res.data.status,
				  praTime: res.data.data.start_date,
				  ruleimg: res.data.data.rule,
				  iscarActive: res.data.data.activity_info.car_owner==1?true:false,
			  })
			this.setRule();
		//   }
	  })
  },
  closePop(){//关闭活动弹窗
	  this.setData({ rulePop:false});
	  this.isActivityOpen();
  },
  actPop() {//弹出活动规则
	  this.setData({ rulePop: true });
  },
  setRule() {
	    // 第一次进活动自动弹窗
	    if (!wx.getStorageSync("isRule").guagua) {
			this.setData({ rulePop: true });
			let _isRule = wx.getStorageSync("isRule") || {}
			_isRule.guagua = true
			wx.setStorageSync("isRule", _isRule)
		}else{
			this.isActivityOpen();
		} 
	},
	isActivityOpen() {
		// 判断活动状态
		 if(this.data.activeStatus == "-2") {
				this.setData({
					isVehicleOwnerHidePop: true,
					popType: 1,
					poptxt: "活动预计" + this.data.praTime + "号开启 敬请期待"
				})
			} else if (this.data.activeStatus == "-3") {
				this.setData({
					isVehicleOwnerHidePop: true,
					popType: 1,
					poptxt: "活动已结束"
				})
			}
	},
	startReword(){
		//点击立即抽奖
		if ((wx.getStorageSync("userInfo").user_type == 0 && this.data.iscarActive) || !wx.getStorageSync("userInfo").nickName || !wx.getStorageSync("userInfo").unionid) return;
		tool.jump_nav(`/pages/binding/scratch/Scratch?activity_id=${this.data.parms.activity_id}`)
	},
	//判断是否授权和是否是车主
	isVehicleOwner(e) {
		if ((wx.getStorageSync("userInfo").nickName && wx.getStorageSync("userInfo").unionid && wx.getStorageSync("userInfo").user_type == 1) || (e && e.target.dataset.type != 'ok') || (wx.getStorageSync("userInfo").nickName && wx.getStorageSync("userInfo").unionid && !this.data.iscarActive)) return
		if (
			!wx.getStorageSync("userInfo").nickName
			|| !wx.getStorageSync("userInfo").unionid
		) {
			this.setData({ popType: 2 })
		} else if (wx.getStorageSync("userInfo").user_type == 0) {
			this.setData({ popType: 3 })
		}
		this.isVehicleOwnerHidePop()
	},
	 //是否授权、绑定车主弹窗
	isVehicleOwnerHidePop() {
		this.setData({ isVehicleOwnerHidePop: !this.data.isVehicleOwnerHidePop })
	},
	 //授完权后处理
	getParme(e) {
		this.isVehicleOwnerHidePop()
		request1.setUserInfo(e).then(res => {
			this.isVehicleOwner()
		})
	},
	my_words(){
		//领取奖品操作
		tool.jump_nav(`/pages/o_prize/o_prize?activity_id=${this.data.parms.activity_id}`)
	}
})