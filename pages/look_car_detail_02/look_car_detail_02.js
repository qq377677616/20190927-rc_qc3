// pages/look_car_detail_02/look_car_detail_02.js
const mta = require('../../utils/public/mta_analysis.js')

const tool =  require('../../utils/tool/tool.js')

const request_01 = require('../../utils/request/request_01.js');

const method = require('../../utils/tool/method.js');

const router = require('../../utils/tool/router.js');

const authorization = require('../../utils/tool/authorization.js');

const alert = require('../../utils/tool/alert.js');

const api = require('../../utils/request/request_03.js');

const app = getApp();//获取应用实例
Page({

  /**
   * 页面的初始数据
   */
  data: {
	IMGSERVICE: app.globalData.IMGSERVICE,
    options: {},
    navIndex: 0,
    lookCarDetail: {},
    isShowForm: false, 
    formsType: 2,
    vehicle: {},
    car_type_list_index: 0,
    car_details: [],
    scrollTop: 0,
    isSwitchIng: false,
    iconList: [
      { img: app.globalData.IMGSERVICE + '/car_detail/icon_01.png', url: '/pages/bargain_index/bargain_index?activity_id=47' },
      { img: app.globalData.IMGSERVICE + '/car_detail/icon_02.png', url: '/pages/assemble/pin/pin?activity_id=44' },
      { img: app.globalData.IMGSERVICE + '/car_detail/icon_03s.png', url: '/pages/index/index' }
    ],
	id:null,
	  swiper1_txt: ['领跑行业的电动车市场经验', '领跑行业的电动车市场经验', '领跑行业的电动车市场经验', '领跑行业的电动车市场经验', '领跑行业的电动车市场经验', '领跑行业的电动车市场经验'], //部件名称
	  swiper2_txt: ['雷诺-日产-三菱联盟底盘技术', '高品质三重滤震设计', '雷诺-日产-三菱联盟底盘技术', '高品质三重滤震设计', '雷诺-日产-三菱联盟底盘技术', '高品质三重滤震设计'], //部件名称
	  swiper3_txt: ['国际ASIL-D电池安全级别', '980MPa高强钢车身', '慢充4小时极速满电', '百公里仅需6元', '国际ASIL-D电池安全级别', '980MPa高强钢车身', '慢充4小时极速满电', '百公里仅需6元'], //部件名称
	  swiper4_txt: ['五门四座舒适大空间', '灵活储物空间', '五门四座舒适大空间', '灵活储物空间', '五门四座舒适大空间', '灵活储物空间'],
	  swiper5_txt: ['高级智能安防', '多功能远程控制', '人性化语音交互', '智能高德导航', '高级智能安防', '多功能远程控制', '人性化语音交互', '智能高德导航'],
	  swiper6_txt: ['V-galaxy全新家族前脸', '跨界动感车顶行李架', '蓝色缝线简约座椅设计', '8寸高清触控大屏', '全新旋钮式电子换挡','“翼”式远近光一体式投射大灯'],	
	  d60ev_txt4: ['Multi-Layer 人体工学座椅 PM2.5 自动空气净化系统','525L大容积后备厢+15处灵活储物空'],
	  carcol: [ //t60颜色图
		  { img: 'e30_col1.png', txt: '晨风蓝' },
		  { img: 'e30_col2.png', txt: '典雅白' },
		  { img: 'e30_col3.png', txt: '钻石银' },
		  { img: 'e30_col4.png', txt: '赤兔红' }
	  ],
	  swp1_img: [ //t60第一个swiper资源
		  { img: 'e30_sw1_1.jpg', type: 1 },
		  { img: 'e30_sw1_2.jpg', type: 2, vUrl: "Tb60_sw2.mp4" },
		  { img: 'e30_sw1_1.jpg', type: 1 },
		  { img: 'e30_sw1_2.jpg', type: 2,vUrl: "Tb60_sw2.mp4" },
		  { img: 'e30_sw1_1.jpg', type: 1},
		  { img: 'e30_sw1_2.jpg', type: 2,vUrl: "Tb60_sw2.mp4" }
	  ],
	  swp2_img:[
		  { img: 'e30_sw2_1.png', type: 1 },
		  { img: 'e30_sw2_2.png', type: 2, vUrl: "Tb60_sw2.mp4" },
		  { img: 'e30_sw2_1.png', type: 1 },
		  { img: 'e30_sw2_2.png', type: 2, vUrl: "Tb60_sw2.mp4" },
		  { img: 'e30_sw2_1.png', type: 1 },
		  { img: 'e30_sw2_2.png', type: 2, vUrl: "Tb60_sw2.mp4" }
	  ],
	  swp3_img:[ //t60第三个swiper资源
		  { img: 'e30_sw3_1.png', type: 2, vUrl: "Tb60_sw3_1.mp4" },
		  { img: 'e30_sw3_2.png', type: 2, vUrl: "Tb60_sw3_2.mp4" },
		  { img: 'e30_sw3_3.png', type: 2, vUrl: "Tb60_sw3_3.mp4" },
		  { img: 'e30_sw3_4.png', type: 2, vUrl: "Tb60_sw3_5.mp4" },
		  { img: 'e30_sw3_5.png', type: 2, vUrl: "Tb60_sw3_6.mp4" },
		  { img: 'e30_sw3_6.png', type: 2, vUrl: "Tb60_sw3_7.mp4" },
		  { img: 'e30_sw3_7.png', type: 2, vUrl: "Tb60_sw3_8.mp4" },
		  { img: 'e30_sw3_8.png', type: 2, vUrl: "Tb60_sw3_9.mp4" }
	  ],
	  swp4_img:[
		  { img: 'e30_sw4_1.png', type: 2, vUrl: "Tb60_sw3_1.mp4" },
		  { img: 'e30_sw4_2.png', type: 2, vUrl: "Tb60_sw3_2.mp4" },
		  { img: 'e30_sw4_1.png', type: 2, vUrl: "Tb60_sw3_1.mp4" },
		  { img: 'e30_sw4_2.png', type: 2, vUrl: "Tb60_sw3_2.mp4" },
		  { img: 'e30_sw4_1.png', type: 2, vUrl: "Tb60_sw3_1.mp4" },
		  { img: 'e30_sw4_2.png', type: 2, vUrl: "Tb60_sw3_2.mp4" }
	  ],
	  swp5_img: [
		  { img: 'e30_sw5_1.png', type: 2, vUrl: "Tb60_sw3_1.mp4" },
		  { img: 'e30_sw5_2.png', type: 2, vUrl: "Tb60_sw3_2.mp4" },
		  { img: 'e30_sw5_3.png', type: 2, vUrl: "Tb60_sw3_1.mp4" },
		  { img: 'e30_sw5_4.png', type: 2, vUrl: "Tb60_sw3_2.mp4" },
		  { img: 'e30_sw5_1.png', type: 2, vUrl: "Tb60_sw3_1.mp4" },
		  { img: 'e30_sw5_2.png', type: 2, vUrl: "Tb60_sw3_2.mp4" },
		  { img: 'e30_sw5_3.png', type: 2, vUrl: "Tb60_sw3_1.mp4" },
		  { img: 'e30_sw5_4.png', type: 2, vUrl: "Tb60_sw3_2.mp4" }
	  ],
	  swp6_img: [
		  { img: 'e30_sw6_1.png', type: 2, vUrl: "Tb60_sw3_1.mp4" },
		  { img: 'e30_sw6_2.png', type: 2, vUrl: "Tb60_sw3_2.mp4" },
		  { img: 'e30_sw6_3.png', type: 2, vUrl: "Tb60_sw3_1.mp4" },
		  { img: 'e30_sw6_4.png', type: 2, vUrl: "Tb60_sw3_2.mp4" },
		  { img: 'e30_sw6_5.png', type: 2, vUrl: "Tb60_sw3_1.mp4" },
		  { img: 'e30_sw6_6.png', type: 2, vUrl: "Tb60_sw3_2.mp4" }
	  ],
	  swiper1: 0, //控制第一个swiper
	  swiper2: 0, //控制第二个swiper
	  swiper3: 0, //控制第三个swiper
	  swiper4: 0,
	  swiper5:0,
	  swiper6:0,
	  rogincol: 0, //初始选择的颜色
	  isplay: false, // 是否在播放视频
	  vbtn: true, // 是否显示 播放按钮
	  popstu: 1, // 留资弹窗状态
	  curvio: null, // 当前创建的vi
  },


  /** 
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
	console.log(options);
    mta.Page.init()//腾讯统计
    mta.Event.stat("look_car_other", {})
	  this.setData({ id: options.id })
    if (wx.getStorageSync("shareIds").channel_id) mta.Event.stat("channel_sunode", { channelid: wx.getStorageSync("shareIds").channel_id})
    request_01.login(() => {
      this.initData(options)
    })
    //是否显示最新icon
    this.setData({ isShowIcon: 1 })
    api.isShowIcon().then(res => {
      console.log("显示icon返回", res)
      this.setData({ isShowIcon: res.data.data })
      console.log("isShowIcon", this.data.isShowIcon)
    })
  },
  //两个icon动画
  aimateInit() {
    if (this.data.isAnimate) return
    clearInterval(this.data.animateInit)
    this.data.animateInit = setInterval(() => {
      this.setData({ isAnimate: true })
      setTimeout(res => {
        this.setData({ isAnimate: false });
      }, 800)
    }, 3000)
  },
  onShow() {
    this.aimateInit()
  },
  onHide() {
    clearInterval(this.data.animateInit)
  },
  onUnload() {
    clearInterval(this.data.animateInit)
  },
  //选择车款
  bindRegionChange(e) {
    if (this.data.car_type_list_index == e.detail.value) return
    this.setData({ isSwitchIng: true })
    tool.loading("")
    setTimeout(() => {
      tool.loading_h()
      this.data.car_type_list_index = e.detail.value
      tool.alert(`当前级别：${this.data.lookCarDetail.car_details[this.data.car_type_list_index].name}`)
      this.car_details()
    }, 800)
  },
  //当前车款配置
  car_details() {
    this.setData({
      car_details: this.data.lookCarDetail.car_details[this.data.car_type_list_index].values,
      isIconShow: true,
      isSwitchIng: false
    })
    // tool.loading_h()
  },
  //页面初始化
  initData(options) {
    // tool.loading("加载中")
    Promise.all([
      request_01.lookCarDetail({
        user_id: wx.getStorageSync('userInfo').user_id,
        id: options.id,
      })
    ])
      .then((value) => {
        //success
        const lookCarDetail = value[0].data.data;

        this.setData({
          lookCarDetail,
          car_type_list: lookCarDetail.car_type_list
        })
        wx.setNavigationBarTitle({
          title: this.data.lookCarDetail.car_name
        })
        this.car_details()
      })
      .catch((reason) => {
        //fail

      })
      .then(() => {
        //complete
        this.setData({
          options,
        })
      })
  },
  //详情图片加载完成
  bindload() {
    // tool.loading_h()
  },
  //导航列表
  navList(e) {
    const index = e.currentTarget.dataset.index;
    const navIndex = this.data.navIndex;

    if (navIndex == index) return;

    this.setData({
      navIndex: index,
    })
    this.setData({ scrollTop: 0})
  },
  //立即下定
  downPayment() {
    const lookCarDetail = this.data.lookCarDetail;
    console.log("lookCarDetail", lookCarDetail)
    this.setData({
      vehicle: {
        img: lookCarDetail.car_img,
        title: lookCarDetail.car_name,
        price: lookCarDetail.car_prize,
      },
      isShowForm: true,
    })
  },
  //留资弹窗打开、关闭
  isShowForm() {
    this.setData({
      isShowForm: false,
    })
  },
	//提交
	submit(e) {
		const detail = e.detail;
		const userInfo = wx.getStorageSync('userInfo');
		const lookCarDetail = this.data.lookCarDetail;

		alert.loading({
			str: '提交中'
		})
		request_01.lookCarSubmit({
			user_id: userInfo.user_id,//用户ID
			look_car_id: lookCarDetail.look_car_id,//看车ID
			name: detail.name,//留资姓名
			mobile: detail.phone,//留资电话
			v_code: detail.code || '',//短信验证码
			dl_code: detail.storeCode,//专营店编码
			car_type: '',//车型 可不填
		}).then((value) => {
			//success
			const status = value.data.status;
			if (status == 1) {
				alert.loading_h()
				// mta.Event.stat("booking_car_other", { name: detail.name, phone: detail.phone, city: detail.region.join('--') })
				{ userinfo: `${detail.name} ${detail.phone} ${detail.region.join('--')}` }
				alert.confirm({ title: "预约成功", content: `您已成功预约的试驾，稍后将有工作人员联系您，请保持电话畅通。`, confirms: "好的,#0C5AC0", cancels: false }).then(res => {
					this.setData({
						isShowForm: false,
					})
				})
			} else {
				alert.alert({
					str: value.data.msg,
				})
			}
		})
			.catch(() => {
				//fail
				alert.loading_h()

			})
			.then(() => {
				//complete

			})
	},
  //页面跳转
  jump(e) {
    tool.jump_nav(e.currentTarget.dataset.url)
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
	  let activity_id = this.data.activity_id;
	  let id = this.data.id;
	  let txt = '';
	  let imageUrl = '';
	  switch (id) {
		  case '11':
			  txt = '启辰星，A+级SUV头等舱，“混元”美学的秘密，等你来探索！';
			  imageUrl = `${this.data.IMGSERVICE}/gaiban/`
			  break;
		  case '6':
			  txt = '启辰T60，高品质智趣SUV，星级品质，焕新登场！';
			  imageUrl = `${this.data.IMGSERVICE}/gaiban/share_T60.png`
			  break;
		  case '3':
			  txt = '启辰D60，高品质智联家轿，智联生活，即刻开启！';
			  imageUrl = `${this.data.IMGSERVICE}/gaiban/share_D60.png`
			  break;
		  case '9':
			  txt = '全新启辰T90，高品质跨界SUV，跨有界，悦无限！';
			  imageUrl = `${this.data.IMGSERVICE}/gaiban/share_T90.png`
			  break;
		  case '7':
			  txt = '启辰T70，高品质智联SUV，品质来袭！';
			  imageUrl = `${this.data.IMGSERVICE}/gaiban/share_T70.png`
			  break;
		  case '5':
			  txt = '启辰D60EV，长续航合资纯电家轿，智无忧，趣更远！';
			  imageUrl = `${this.data.IMGSERVICE}/gaiban/share_D60EV.png`
			  break;
		  case '10':
			  txt = '启辰e30，我的第一台纯电精品车，智在灵活，趣动精彩！';
			  imageUrl = `${this.data.IMGSERVICE}/gaiban/share_E30.png`
			  break;
		  case '13':
			  txt = '启辰T60EV，智领合资纯电SUV，智无忧，趣更远！';
			  imageUrl = `${this.data.IMGSERVICE}/gaiban/share_T60EV.png`
			  break;
	  }
	  console.log(imageUrl);
	  return {
		  title: `${txt}`,
		  path: `/pages/look_car_detail_02/look_car_detail_02?id=${this.data.id}`,
		  imageUrl: imageUrl
	  }
	},
	closelz() {
		this.setData({ popstu: 2 })
	},
	moreBtn() {
		tool.jump_red("/pages/index/index")
	},
	swiperchange(e) { // 滑动切换 swiper
		// console.log(e);
		let type = e.currentTarget.dataset.type;
		this.setData({
			vbtn: true,
			swiper1: type == 1 ? e.detail.current : this.data.swiper1,
			swiper2: type == 2 ? e.detail.current : this.data.swiper2,
			swiper3: type == 3 ? e.detail.current : this.data.swiper3,
			swiper4: type == 4 ? e.detail.current : this.data.swiper4,
			swiper5: type == 5 ? e.detail.current : this.data.swiper5,
			swiper6: type == 6 ? e.detail.current : this.data.swiper6,
			swiper7: type == 7 ? e.detail.current : this.data.swiper7,
			swiper8: type == 8 ? e.detail.current : this.data.swiper8,
			swiper9: type == 9 ? e.detail.current : this.data.swiper9,
			swiper10: type == 10 ? e.detail.current : this.data.swiper10,
			swiper11: type == 11 ? e.detail.current : this.data.swiper11,
			swiper12: type == 12 ? e.detail.current : this.data.swiper12,
		})
		console.log(this.data.swiper7);
		console.log(this.data.swiper1, this.data.swiper2);
	},
	changecol(e) { // 选择车子颜色
		let index = e.currentTarget.dataset.index;
		this.setData({ rogincol: index })
		console.log(index)
	},
	// 播放视频
	setplay(e) {
		console.log(e.currentTarget.dataset.vurl)
		if (e.currentTarget.dataset.vurl.indexOf("mp4") == -1) return;
		this.setData({
			isplay: true,
		});
		setTimeout(() => {
			this.setData({
				videoUrl: e.currentTarget.dataset.vurl
			})
			this.isOpenVideo()
		}, 1000);
		console.log('2', this.data.isplay);
	},
	// 视频播放弹窗开关
	isOpenVideo() {
		this.setData({
			isPlayVedio: !this.data.isPlayVedio,
			isplay: false,
		})
	},
	//播放
	videoPlay() {
		console.log('开始播放')
		// var videoplay = wx.createVideoContext()
		this.data.curvio.play()
	},
	// 暂停播放
	videoPause() {
		console.log('暂停播放')
		// var videoplay = wx.createVideoContext()
		this.data.curvio.pause()
	},
	// 显示播放按钮
	showplay() {
		if (this.data.vbtn) return;
		this.setData({ vbtn: true })
		setTimeout(() => {
			this.setData({ vbtn: false })
		}, 3000)
	},
	changetab(e) { // 点击左右切换轮播
		let id = e.currentTarget.dataset.id;
		let type = e.currentTarget.dataset.type;
		let len = e.currentTarget.dataset.length;
		console.log(id, type);
		this.setData({
			swiper1: id == 1 && type == 1 ? this.data.swiper1 == 0 ? len : --this.data.swiper1 : id == 1 && type == 2 ? this.data.swiper1 == len ? 0 : ++this.data.swiper1 : this.data.swiper1,
			swiper2: id == 2 && type == 1 ? this.data.swiper2 == 0 ? len : --this.data.swiper2 : id == 2 && type == 2 ? this.data.swiper2 == len ? 0 : ++this.data.swiper2 : this.data.swiper2,
			swiper3: id == 3 && type == 1 ? this.data.swiper3 == 0 ? len : --this.data.swiper3 : id == 3 && type == 2 ? this.data.swiper3 == len ? 0 : ++this.data.swiper3 : this.data.swiper3,
			swiper4: id == 4 && type == 1 ? this.data.swiper4 == 0 ? len : --this.data.swiper4 : id == 4 && type == 2 ? this.data.swiper4 == len ? 0 : ++this.data.swiper4 : this.data.swiper4,
			swiper5: id == 5 && type == 1 ? this.data.swiper5 == 0 ? len : --this.data.swiper5 : id == 5 && type == 2 ? this.data.swiper5 == len ? 0 : ++this.data.swiper5 : this.data.swiper5,
			swiper6: id == 6 && type == 1 ? this.data.swiper6 == 0 ? len : --this.data.swiper6 : id == 6 && type == 2 ? this.data.swiper6 == len ? 0 : ++this.data.swiper6 : this.data.swiper6,
			swiper7: id == 7 && type == 1 ? this.data.swiper7 == 0 ? len : --this.data.swiper7 : id == 7 && type == 2 ? this.data.swiper7 == len ? 0 : ++this.data.swiper7 : this.data.swiper7,
			swiper8: id == 8 && type == 1 ? this.data.swiper8 == 0 ? len : --this.data.swiper8 : id == 8 && type == 2 ? this.data.swiper8 == len ? 0 : ++this.data.swiper8 : this.data.swiper8,
			swiper9: id == 9 && type == 1 ? this.data.swiper9 == 0 ? len : --this.data.swiper9 : id == 9 && type == 2 ? this.data.swiper9 == len ? 0 : ++this.data.swiper9 : this.data.swiper9,
			swiper10: id == 10 && type == 1 ? this.data.swiper10 == 0 ? len : --this.data.swiper10 : id == 10 && type == 2 ? this.data.swiper10 == len ? 0 : ++this.data.swiper10 : this.data.swiper10,
			swiper11: id == 11 && type == 1 ? this.data.swiper11 == 0 ? len : --this.data.swiper11 : id == 11 && type == 2 ? this.data.swiper11 == len ? 0 : ++this.data.swiper11 : this.data.swiper11,
			swiper12: id == 12 && type == 1 ? this.data.swiper12 == 0 ? len : --this.data.swiper12 : id == 12 && type == 2 ? this.data.swiper12 == len ? 0 : ++this.data.swiper12 : this.data.swiper12,
		})
	},
	closelz() {// 关闭填写
		this.setData({ popstu: 2 })
	},
	tabSwiper(e) {// 点击精准切换
		let type = e.currentTarget.dataset.type;
		let tab = e.currentTarget.dataset.tab;
		let len = e.currentTarget.dataset.len - 1;
		console.log(type, tab, len);
		this.setData({
			swiper1: type == 1 ? (tab == -1 ? len : tab) : this.data.swiper1,
			swiper2: type == 2 ? (tab == -1 ? len : tab) : this.data.swiper2,
			swiper3: type == 3 ? (tab == -1 ? len : tab) : this.data.swiper3,
			swiper4: type == 4 ? (tab == -1 ? len : tab) : this.data.swiper4,
			swiper5: type == 5 ? (tab == -1 ? len : tab) : this.data.swiper5,
			swiper6: type == 6 ? (tab == -1 ? len : tab) : this.data.swiper6,
			swiper7: type == 7 ? (tab == -1 ? len : tab) : this.data.swiper7,
			swiper8: type == 8 ? (tab == -1 ? len : tab) : this.data.swiper8,
			swiper9: type == 9 ? (tab == -1 ? len : tab) : this.data.swiper9,
			swiper10: type == 10 ? (tab == -1 ? len : tab) : this.data.swiper10,
			swiper11: type == 11 ? (tab == -1 ? len : tab) : this.data.swiper11,
			swiper12: type == 12 ? (tab == -1 ? len : tab) : this.data.swiper12,
		})
	}
})