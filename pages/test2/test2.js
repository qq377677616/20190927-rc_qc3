//index.js
//获取应用实例
const app = getApp();
const mta = require('../../utils/public/mta_analysis.js')

const request_01 = require('../../utils/request/request_01.js');

const method = require('../../utils/tool/method.js');

const router = require('../../utils/tool/router.js');

const authorization = require('../../utils/tool/authorization.js');

const alert = require('../../utils/tool/alert.js');
let imageUrl = app.globalData.IMGSERVICE
Page({
	data: {
		line: 6,
		//全局变量--分类
		classId: '',
		// lunImg: [], //轮播图数据
		oneList: [], //tab栏分类 一级分类数据
		th_List: [],
		options: {},
		carList: [],
		infoLunbo: {
			autoplay: true, //是否自动轮播
			interval: 8000, //间隔时间
			duration: 1000, //滑动时间
			current: 0,
			circular: true
		},
		imgheights: [],
		lunImg: [{
			"name": 'D60',
			"info": ['高品质智联家轿 智联生活 即刻开启'],
			"lowprice": "6.98",
			"highprice": "9.88",
			"bgUrl": imageUrl + "/lookcar/img_d60.png",
			"titleImg": imageUrl + "/lookcar/title_d60.png"
		}, {
			"name": 'T60',
			"info": ['高品质智趣SUV 星级品质 焕新登场'],
			"lowprice": "8.68",
			"highprice": "11.88",
			"bgUrl": imageUrl + "/lookcar/img_t60.png",
			"titleImg": imageUrl + "/lookcar/title_t60.png"
		}, {
			"name": 'T70',
			"info": ['高品质智联SUV 品质来袭'],
			"lowprice": "8.98",
			"highprice": "12.78",
			"bgUrl": imageUrl + "/lookcar/img_t70.png",
			"titleImg": imageUrl + "/lookcar/title_t70.png"
		}, {
			"name": 'T60EV',
			"info": ['智无忧 趣更远 智领合资纯电SUV'],
			"lowprice": "13.88",
			"highprice": "15.68",
			"bgUrl": imageUrl + "/lookcar/img_t60ev.png",
			"titleImg": imageUrl + "/lookcar/title_t60ev.png"
		}, {
			"name": 'T90',
			"info": ['高品质跨界SUV 跨有界 悦无限'],
			"lowprice": "11.88",
			"highprice": "15.48",
			"bgUrl": imageUrl + "/lookcar/img_t90.png",
			"titleImg": imageUrl + "/lookcar/title_t90.png"
		}, {
			"name": 'D60EV',
			"info": ['高品质智联家轿 智联生活 即刻开启'],
			"lowprice": "13.78",
			"highprice": "15.38",
			"bgUrl": imageUrl + "/lookcar/img_d60ev.png",
			"titleImg": imageUrl + "/lookcar/title_d60ev.png"
		}, {
			"name": '星',
			"info": [''],
			"lowprice": "",
			"highprice": "",
			"bgUrl": imageUrl + "/lookcar/img_xing.png",
			"titleImg": imageUrl + "/lookcar/title_xing.png"
		}, {
			"name": 'e30',
			"info": ['高品质智联家轿 智联生活 即刻开启'],
			"lowprice": "6.18",
			"highprice": "7.48",
			"bgUrl": imageUrl + "/lookcar/img_e30.png",
			"titleImg": imageUrl + "/lookcar/title_e30.png"
		}],
		toView: 'info1',
		currpage:6,
	},
	onLoad: function (options) {
		this.data.lunImg.forEach((item, index) => {
			item.name = 'info' + (parseInt(index) + 1)
		})
		request_01.login(() => {
			this.initData(options)
		})
	},
	toSearch(e) {
		wx.showToast({
			title: '暂未开发！',
			icon: 'none'
		})
	},
	clickLine(e) {
		let num = e.currentTarget.dataset.num;
		this.setData({
			line: num
		})
		let _infoLunbo = this.data.infoLunbo
		let img_current = this.data.infoLunbo.current;
		_infoLunbo.current = num;
		console.log(_infoLunbo)
		this.setData({
			infoLunbo: _infoLunbo,
			line: num,
			toView: 'info' + (num + 1)
		})
		if (num > 3) {
			this.setData({ scrollLeft: (num - 3) * 60 })
		}
		if (this.data.scrollLeft > 0) {
			if (num < 4) {
				this.setData({ scrollLeft: 0 })
			}
		}
	},
	bindchange(e) {
		let _infoLunbo = this.data.infoLunbo
		let img_current = this.data.infoLunbo.current;
		_infoLunbo.current = e.detail.current;
		console.log(_infoLunbo)
		this.setData({
			infoLunbo: _infoLunbo,
			line: e.detail.current,
			toView: 'info' + (e.detail.current + 1)
		})
		if (e.detail.current > 3) {
			this.setData({ scrollLeft: (e.detail.current - 3) * 60 })
		}
		if (this.data.scrollLeft > 0) {
			if (e.detail.current < 4) {
				this.setData({ scrollLeft: 0 })
			}
		}
	},
	imgload: function (e) {

		console.log(wx.getSystemInfoSync().windowWidth)

		var imgheight = e.detail.height;

		var imgwidth = e.detail.width;

		var bl = imgheight / imgwidth;

		var sjgd = bl * (wx.getSystemInfoSync().windowWidth);

		var hs = this.data.imgheights;

		console.log(e);

		console.log(sjgd);

		hs[e.target.dataset.id] = sjgd;

		this.setData({
			imgheights: hs
		});
	},
	// 新添加交互
	initData(options) {
		Promise.all([
			request_01.lookCarList({ user_id: wx.getStorageSync('userInfo').user_id })
		])
			.then((value) => {
				const carList = value[0].data.data;
				this.setData({
					carList,
				})
			})
			.catch((reason) => {

			})
			.then(() => {
				//complete
				// this.setData({
					
					
					
				// 	\
					
					
					
				// 	 ,
				// })
			})
	},
	//看车详情
	jumpDetail(e) {
		const index = e.currentTarget.dataset.index;
		const carList = this.data.carList;
		const id = carList[index].id;
		console.log(id)
		if (id == 9) {
			// 跳转T90页面
			router.jump_nav({
				url: `/pages/look_car_detail/look_car_detail?id=${9}`,
			})
		}
		else if (id == 11) {
			// 跳转T90页面
			router.jump_nav({
				url: `/pages/look_car_detail_03/look_car_detail?id=${11}`,
			})
		}
		else {
			// 跳转通用看车页
			router.jump_nav({
				url: `/pages/look_car_detail_02/look_car_detail_02?id=${id}`,
			})
		}

	},
	dyjump(e){
		this.setData({currpage: e.currentTarget.dataset.num})
	}
})