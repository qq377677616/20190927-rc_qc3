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
		baseurl: imageUrl,
		line: 4,
		//全局变量--分类
		classId: '',
		// lunImg: [], //轮播图数据
		oneList: [], //tab栏分类 一级分类数据
		th_List: [],
		options: {},
		carList: [],
		infoLunbo: {
			autoplay: true, //是否自动轮播
			interval: 4000, //间隔时间
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
			"bgUrl": [imageUrl + "/lookcar/img_d60.png", imageUrl + "/lookcar/img_d60_X.png"],
			"titleImg": imageUrl + "/lookcar/title_d60.png?2",
			icon:'icon-D',
			 cid: 3,
			pritxt:'官方指导价'
		}, {
			"name": 'T60',
			"info": ['高品质智趣SUV 星级品质 焕新登场'],
			"lowprice": "8.68",
			"highprice": "11.88",
			"bgUrl": [imageUrl + "/lookcar/img_t60.png?4", imageUrl + "/lookcar/img_t60_X.png?4"],
			"titleImg": imageUrl + "/lookcar/title_t60.png?4",
			icon:'icon-T',
			cid: 6,
			pritxt: '官方指导价'
		}, {
			"name": 'T70',
			"info": ['高品质智联SUV 品质来袭'],
			"lowprice": "8.98",
			"highprice": "12.78",
			"bgUrl": [imageUrl + "/lookcar/img_t70.png", imageUrl + "/lookcar/img_t70_X.png"],
			"titleImg": imageUrl + "/lookcar/title_t70.png?2",
			icon:'icon-T1',
			cid: 7,
			pritxt: '官方指导价'
			}, {
				"name": 'T90',
				"info": ['高品质跨界SUV 跨有界 悦无限'],
				"lowprice": "11.88",
				"highprice": "15.48",
				"bgUrl": [imageUrl + "/lookcar/img_t90.png?2", imageUrl + "/lookcar/img_t90_X.png?2"],
				"titleImg": imageUrl + "/lookcar/title_t90.png?2",
				icon:'icon-T2',
				cid: 9,
				pritxt: '官方指导价'
			},
			 {
				"name": '星',
				"info": [''],
				"lowprice": "",
				"highprice": "",
				"bgUrl": [imageUrl + "/lookcar/img_xing.png?2", imageUrl + "/lookcar/img_xing_X.png?2"],
				"titleImg": imageUrl + "/lookcar/title_xing_1.png?2",
				 icon:'icon-biaoti1',
				 cid: 11,
				pritxt: '官方指导价'
			},
			{
			"name": 'T60EV',
			"info": ['智无忧 趣更远 智领合资纯电SUV'],
			"lowprice": "13.88",
			"highprice": "15.68",
			"bgUrl": [imageUrl + "/lookcar/img_t60ev.png", imageUrl + "/lookcar/img_t60ev_X.png"],
			"titleImg": imageUrl + "/lookcar/title_t60ev.png?4",
			icon:'icon-TEV',
			cid: 13,
			pritxt: '补贴后官方指导价'
		},  {
			"name": 'D60EV',
			"info": ['智无忧 趣更远 长续航合资纯电家轿'],
			"lowprice": "13.78",
			"highprice": "15.38",
			"bgUrl": [imageUrl + "/lookcar/img_d60ev.png", imageUrl + "/lookcar/img_d60ev_X.png"],
			"titleImg": imageUrl + "/lookcar/title_d60ev.png?2",
			icon:'icon-DEV',
			cid:5,
			pritxt: '补贴后官方指导价'
		},  {
			"name": 'e30',
			"info": ['我的第一台纯电精品车 智在灵活 趣动精彩'],
			"lowprice": "6.18",
			"highprice": "7.48",
			"bgUrl": [imageUrl + "/lookcar/img_e30.png", imageUrl + "/lookcar/img_e30_X.png"],
			"titleImg": imageUrl + "/lookcar/title_e30.png?2",
			icon:'icon-e',
			cid: 10,
			pritxt: '补贴后官方指导价'
		}],
		toView: 'info1',
		currpage:4,
		currid:0,
		isX:false,//是否是iphoneX
		curr:7,//序列当前 帧
		isplay:true,//是否可以播放序列
		isright: false,//判断轮播放向
		isH:false,//默认不是长屏
	},
	onLoad: function (options) {
		this.setData({
			isX: wx.getStorageSync("isX") == 1?true:false,
			isH: wx.getStorageSync("isH") == 1?true:false
		});
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
		let _infoLunbo = this.data.infoLunbo;
		let img_current = this.data.infoLunbo.current;
		_infoLunbo.current = num;
		console.log(_infoLunbo)
		this.setData({
			infoLunbo: _infoLunbo,
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
		this.setData({
			isright: this.data.line > e.detail.current,
			infoLunbo: _infoLunbo,
			line: e.detail.current,
			toView: 'info' + (e.detail.current + 1),
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
				
			})
	},
	//看车详情
	jumpDetail(e) {
		// const index = e.currentTarget.dataset.index;
		// const carList = this.data.carList;
		const id = e.currentTarget.dataset.cid;
		console.log(id)
		this.setData({ currid:id})
		this.jump_page();
	},
	jump_page(){
		let id = this.data.currid;
		console.log(id);
		// return;
		if (id == 9) {
			// 跳转T90页面
			router.jump_nav({
				// `/pages/look_car_detail/look_car_detail?id=${9}`,
				// url: `/pages/look_car_detail/look_car_detail?id=${9}`
				url: `/pages/look_car_detail_05/look_car_detail_05?id=${9}`,
			})
		}
		else if (id == 11){
			// 启程星 wx5c64e733d849c3ef
			// router.jump_nav({
			// 	url: `/pages/look_car_detail_03/look_car_detail?id=${11}`,
			// })
			wx.navigateToMiniProgram({
				appId: 'wx5c64e733d849c3ef',
				path: '',
				extraData: {},
				envVersion: 'release',
				success(res) {
					console.log('跳转成功');
				}
			})
			return;
		}
		// else
		// {
		// 	router.jump_nav({
		// 		url: `/pages/look_car_detail_02/look_car_detail_02?id=${id}`,
		// 	})
		// } 
		
		if (id == 6 || id == 7 || id == 3){
			// 跳转通用看车页
			router.jump_nav({
				url: `/pages/look_car_detail_04/look_car_detail_04?id=${id}`,
			})
		}else{
			router.jump_nav({
				url: `/pages/look_car_detail_02/look_car_detail_02?id=${id}`,
			})
		}
	},
	dyjump(e){
		// 点击文字跳转
		const id = e.currentTarget.dataset.cid;
		console.log(id)
		this.setData({ currid: id })
		this.setData({currpage: e.currentTarget.dataset.num});
		// this.jump_page();
	},
	playxlz() {
		//播放序列
		console.log(this.data.isright);
		if(!this.data.isplay){
			console.log("暂时不能播放")
			return;
		}
		let time = null;
		let flag = -1;
		this.setData({isplay:false});
		clearInterval(time);
		time = setInterval(() => {
			if (flag > 7) {
				clearInterval(time);
				this.setData({ isplay: true, curr: flag});
				console.log('flag', flag)
			}
			this.setData({ curr: flag })
			flag++;
		}, 50)
	},
	onShareAppMessage: function () {
		const IMGSERVICE = imageUrl;
		console.log(`${IMGSERVICE}/lookcar/carshare.jpg`);
		return {
			title: '东风启辰线上展厅，在家选好车！',
			imageUrl: `${IMGSERVICE}/lookcar/carshare.jpg?3`,
			path: '/pages/index/index'
		};
	}
})