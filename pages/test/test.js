// pages/test/test.js
const mta = require('../../utils/public/mta_analysis.js')

const request_01 = require('../../utils/request/request_01.js');

const method = require('../../utils/tool/method.js');

const router = require('../../utils/tool/router.js');

const authorization = require('../../utils/tool/authorization.js');

const alert = require('../../utils/tool/alert.js');

const tool = require("../../utils/public/tool.js");

const app = getApp();//获取应用实例

let time = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    IMGSERVICE: app.globalData.IMGSERVICE,
	colarr: ['旭日橙', '朝霞红', '珠光白', '翡丽灰','曜石黑'],
	videoarr: ['全时在线导航', '数字化车联&互联网信息娱乐', '车辆智能安防系统', '智慧贴心语音助手'],
	currdot:0,// 控制swiper的点
	swiper:{// 控制swiper的当前页
		currfoot:0
	},
	scrollTop: 0,//初始化scroll 
	num1:0,// 变化数字1
	num2: 0,// 变化数字2
	isreset:true,//是否 执行 数字变化
	vidBtn:-1,//点击视频按钮index
	isplay:false,//显示视频弹窗
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    request_01.login(()=>{
		tool.getSystem().then(res => {
			this.setData({ windowHeight: res.windowHeight })
			this.scrollShowInit()
		})
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
	//滚动监听
	onPageScroll(e) {
		this.setData({ scrollTop: e.scrollTop })
		if (this.data.scrollTop + this.data.windowHeight >= this.data.scrollTopList[0]) {
			this.setData({ num1: 0, num2: 0})
			this.setTime();
		} 
	},
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
	//效果初始化
	scrollShowInit() {
		// , tool.getDom("#con-three"), tool.getDom("#con-four"), tool.getDom("#con-five")
		Promise.all([tool.getDom("#con-two")]).then(res => {
			let _scrollTopList = []
			for (let i = 0; i < res.length; i++) {
				_scrollTopList.push(res[i][0].top - 100)
			}
			this.setData({ scrollTopList: _scrollTopList })
			
		})
	},
  changedot(e){
	  // 监听轮播页面 
	  let type = e.currentTarget.dataset.type;
	  let swp = this.data.swiper;
	//   console.log(typeof type);
	  switch (type){
		  case '1':
		  this.setData({ currdot: e.detail.current });
		  break;
		  case '2':
			  swp.currfoot = e.detail.current;
			  this.setData({ swiper: swp });
		  break;
		  case '3':
		  console.log(88);
		  break;
	  }
  },
  showmun(e){
	  console.log(e);
  },
  changeSwriper(e){
	 //点击切换 Swriper
	  let min = 0,max = 9;
	  let type = e.currentTarget.dataset.type;
	  let swp = this.data.swiper;
	  if (swp.currfoot <= max && swp.currfoot >= min){
		  swp.currfoot = type == 2 && swp.currfoot < max ? ++swp.currfoot : swp.currfoot > min && type == 1 ? --swp.currfoot : swp.currfoot; 
	   }
	  this.setData({swiper:swp});
	  console.log(this.data.swiper);
  },
  setTime(){
	 // 随机数设置  
	   if (!this.data.isreset)return;//执行中
	   let num1, num2,times=0;
	   clearInterval(time);
	   time = setInterval(()=>{
		    num1= Math.floor(Math.random() * 534);
		    num2 = (Math.random() * 7.1).toFixed(1);
		   if(times==80){
			   clearInterval(time);
			   this.setData({ num1: 534, num2: 7.1,isreset: true})
		   }else{
			   this.setData({
				   num1: num1,
				   num2: num2,
				   isreset:false
			   })
		   }
		//    console.log(num1,this.data.num1);
			++times;
	   },10)
  },
  goAnimat(e){
	  // 点击播放视频   
	  let index = e.currentTarget.dataset.index;
	  this.setData({ vidBtn:index});
	  setTimeout(()=>{
		  this.setData({ vidBtn: -1, isplay:true});
	  },1200)
  },
	closePop(){
		this.setData({isplay:false});
	}	
})