// pages/dealers/dealers.js
let app = new getApp();
import https from '../../../utils/api/my-requests.js';

import tool from '../../../utils/public/tool.js';

const method = require('../../../utils/tool/method.js');
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		BASEURL: app.globalData.ASSETSURL,//基本路径
		storlist:[],//门店列表
		address:'',//地址
		page:0,//当前页面
		limit:10,//每页限制条数
		isData:true,//是否有下一页
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		this.getInfo();//获取地理位置
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
	onPullDownRefresh: function (){

	},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function () {
		// console.log(11);
		if(this.data.isData){
			tool.alert('没有更多数据了！');
		}else{
			this.setData({page:++this.data.page});
			this.getInfo();
		}
	},

	/**
	 * 用户点击右上角分享
	 */
	// onShareAppMessage: function () {

	// }
	getInfo(){//获取专营店信息
		this.data.page == 1 ? tool.loading("自动定位中") : tool.loading("加载中...");
		method.getPosition().then((value) => {// 获取地理位置
			let locat = value.result.location;
			console.log(value);
			this.setData({ address: value.result.address });
			let dat = {
				lon: 113.179001,//locat.lng,
				lat: 23.378357,//locat.lat,
				page:this.data.page,
				limit:this.data.limit
			}
			https.getInfo(dat).then((res) => {
				if (res.data.code == 1) {
					tool.loading_h();
					this.setData({ storlist: [...this.data.storlist,...res.data.data], isData:res.data.data<10 })
				}
			})
		}).catch(err => {
			tool.alert("定位失败")
			tool.loading_h()
		})
	},
	goback(e){// 带参返回
		console.log(e.currentTarget.dataset.obj);	
		let parm = JSON.stringify(e.currentTarget.dataset.obj);
		tool.jump_red(`/pages/take/takeHome/takeHome?obj=${parm}`);
		// console.log(1111)
	},
	resetpot(){//重新定位
		this.setData({ page: 0, storlist:[]});
		this.getInfo();
	}
})