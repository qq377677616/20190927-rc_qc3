// pages/car_detail2/car_detail2.js
// pages/look_car_detail/look_car_detail.js
const mta = require('../../utils/public/mta_analysis.js')

const request_01 = require('../../utils/request/request_01.js');

const api = require('../../utils/request/request_03.js');

const tool = require('../../utils/tool/tool.js');

const method = require('../../utils/tool/method.js');

const router = require('../../utils/tool/router.js');

const authorization = require('../../utils/tool/authorization.js');

const alert = require('../../utils/tool/alert.js');

const app = getApp();//获取应用实例

Page({

  /**
   * 页面的初始数据
   */
  data: {
    IMGSERVICE: app.globalData.IMGSERVICE,
    colorNow: 0,
    nowIndex: 0,
    swiperH: '',//swiper高度
    nowIdx: 0,//当前swiper索引
    nowFIdx: 0,
    nowSIdx: 0,
    nowTIdx: 0,
    nowFiIdx: 0,
    navIndex: 0,
    nowSiIdx: 0,
    formsType: 2,
    isPlayVedio:false,
    videoUrl:'',
    colorList: [{
      title: '星云红',
      color: '#901d29'
    }, {
      title: '极光蓝',
      color: '#1662af'
    }, {
      title: '赤兔红',
      color: '#a03124'
    }, {
      title: '珠光白',
      color: '#d7d7da'
    }, {
      title: '曜石黑',
      color: '#2d2d2d'
    }, {
      title: '琥珀金',
      color: '#634b39'
    }],
    imgList: [//图片列表
      { img: "/car_detail/photo3.gif", str: '/car_detail/str_01.png'},
      { img: "/car_detail/photo3.png", str: '/car_detail/str_02.png'}
    ],
    oFoSwiperCurrentIndex:0,
    imgList3: [//图片列表
      "/car_detail/fz1.png",
      "/car_detail/fz2.png",
      "/car_detail/fz3.png",
    ],
    imgFourList:[  //东西南北路线
      "route/1.png",
      "route/2.png",
      "route/3.png",
      "route/4.png",
    ],
    videoList: [//视频列表
      "/car_detail/video_01.mp4",
      "/car_detail/video_02.mp4",
      "/car_detail/video_03.mp4"
    ],
    carList: [
      "/car_detail/car-xyh.png",
      "/car_detail/car-jgl.png",
      "/car_detail/car-cth.png",
      "/car_detail/car-zgb.png",
      "/car_detail/car-ysh.png",
      "/car_detail/car-hpj.png",
    ],
    gznList: [
      { img: "/car_detail/plus_photo.png", str: '/car_detail/str_03.png' },
      { img: "/car_detail/plus_photo2.png", str: '/car_detail/str_05.png' }
    ],
    car_type_list_index: 0,
    iconList: [
      { img: app.globalData.IMGSERVICE + '/car_detail/icon_01.png', url: '/pages/bargain_index/bargain_index?activity_id=47' },
      { img: app.globalData.IMGSERVICE + '/car_detail/icon_02.png', url: '/pages/assemble/pin/pin?activity_id=44' },
      { img: app.globalData.IMGSERVICE + '/car_detail/icon_03s.png', url: '/pages/index/index' }
    ],
    iconLists: [
      { img: app.globalData.IMGSERVICE + '/car_detail/icon_01.png', url: '/pages/bargain_index/bargain_index?activity_id=47' },
      { img: app.globalData.IMGSERVICE + '/car_detail/icon_02.png', url: '/pages/assemble/pin/pin?activity_id=44' }
    ],
    iconList2: [
      { img: app.globalData.IMGSERVICE + '/car_detail/icon_03s.png', url: '/pages/index/index' }
    ],
    scrollTop: 0,
    domIdList: ["#dom1", "#dom2", "#dom3", "#dom4", "#dom5", "#dom6", "#dom7"],
    onSwiperIndex: 0,
    swiper3Current: 0,
    animateInit: null,
    isSwitchIng: false,
    isShowIcon: -1,
    sss: true,
	// 复制t60
	  carcol: [//t60颜色图
		  { img: 't90col1.png', img2:'t90c1.png', txt: '星云红' },
		  { img: 't90col2.png', img2: 't90c2.png',txt: '极光蓝' },
		  { img: 't90col3.png', img2: 't90c3.png', txt: '赤兔红' },
		  { img: 't90col4.png', img2: 't90c4.png',txt: '珠光白' },
		  { img: 't90col5.png', img2: 't90c5.png',txt: '曜石黑' },
		  { img: 't90col6.png', img2: 't90c6.png',txt: '琥珀金' }
	  ],
	  swiper1: 0,//控制第一个swiper
	  swiper2: 0,//控制第二个swiper
	  swiper3: 0,//控制第三个swiper
	  swiper4: 0,//控制t70第1个swiper
	  swiper5: 0,//控制t70第2个swiper
	  swiper6: 0,//控制t70第3个swiper
	  swiper7: 0,//控制t70第4个swiper
	  swiper8: 0,//控制t70第5个swiper
	  swiper9: 0,//控制d60第1个swiper
	  swiper10: 0,//控制d60第2个swiper
	  swiper11: 0,//控制d60第3个swiper
	  rogincol: 0,//初始选择的颜色
	  carid: '',
	  swiper1_txt: ['流水式LED转向灯', '贯穿式光导LED组合尾灯', '矩阵式全LED前大灯', '19英寸星射线铝合金轮辋', '全新家族V-Galaxy星空格栅设计'],//部件名称
	  swiper2_txt: ['超大尺寸4805*1865*1591mm \n 同级领先轴距2765mm', '360° 大视野全景天窗', '628双模式行李厢', '人性化车内储物空间', '触控式科技中控面板'],//部件名称
	  swiper3_txt: ['全新日产XTRONIC CVT智能无级变速器', '专业舒适化底盘调校', 'Multi-Layer人体工学座椅 (带座椅通风/加热)', '出众的NVH品质', '新一代日产明星缸内直喷发动机MR20'],//部件名称
	  swiper4_txt: ['全时在线导航', '全新升级智能语音交互', '手机远程控制', '智能安防系统', '全场景账号服务系统','高品质娱乐体验','智能车联服务','EPB电子手刹+Auto Hold自动驻车','12.3+10.25英寸沉浸式科技联屏','15W高效无线充电','智能交互电动尾门','3D AVM无盲区高清全景监控影像系统','FEB预碰撞智能刹车辅助系统','LDW 车道偏离预警系统','EAPM 油门误踩智能纠正系统','BSW 变道盲区预警系统','车家互联'],//部件名称
	  t90swp1:[
		  { img: 'tb90_1_1.png', type: 1 },
		  { img: 'tb90_1_2.png', type: 1 },
		  { img: 'tb90_1_3.png', type: 1 },
		  { img: 'tb90_1_4.png', type: 1 },
		  { img: 'tb90_1_5.png', type: 1 }
	  ],
	  t90swp2: [
		  { img: 'tb90_2_1.png', type: 1 },
		  { img: 'tb90_2_2.png', type: 1 },
		  { img: 'tb90_2_3.png', type: 1 },
		  { img: 'tb90_2_4.png', type: 1 },
		  { img: 'tb90_2_5.png', type: 1 }
	  ],
	  t90swp3:[
		  {img:'tb90_3_1.png',type:1},
		  { img: 'tb90_3_2.png', type: 1 },
		  { img: 'tb90_3_3.png', type: 1 },
		  { img: 'tb90_3_4.png', type: 2,vUrl:'tb90_3_4.mp4'},
		  { img: 'tb90_3_5.png', type: 1 }
	  ],	 
	  t90swp4: [
		  { img: 'tb90_4_1.png', type: 2 ,vUrl:'tb90_4_1.mp4'},
		  { img: 'tb90_4_2.png', type: 2 ,vUrl:'tb90_4_2.mp4'},
		  { img: 'tb90_4_3.png', type: 2 ,vUrl:'tb90_4_3.mp4'},
		  { img: 'tb90_4_4.png', type: 2 ,vUrl:'tb90_4_4.mp4'},
		  { img: 'tb90_4_5.png', type: 2 ,vUrl:'tb90_4_5.mp4'},
		  { img: 'tb90_4_6.png', type: 2 ,vUrl:'tb90_4_6.mp4'},
		  { img: 'tb90_4_7.png', type: 2 ,vUrl:'tb90_4_7.mp4'},
		  { img: 'tb90_4_8.png', type: 1 },
		  { img: 'tb90_4_9.png', type: 1 },
		  { img: 'tb90_4_10.png', type: 1 },
		  { img: 'tb90_4_11.png', type: 2 ,vUrl:'tb90_4_11.mp4'},
		  { img: 'tb90_4_12.png', type: 2 ,vUrl:'tb90_4_12.mp4'},
		  { img: 'tb90_4_13.png', type: 2 ,vUrl:'tb90_4_13.mp4'},
		  { img: 'tb90_4_14.png', type: 2 ,vUrl:'tb90_4_14.mp4'},
		  { img: 'tb90_4_15.png', type: 2 ,vUrl:'tb90_4_15.mp4'},
		  { img: 'tb90_4_16.png', type: 2 ,vUrl:'tb90_4_16.mp4'},
		  { img: 'tb90_4_17.png', type: 2 ,vUrl:'tb90_4_17.mp4'}
	  ],
	  isplay: false,// 是否在播放视频
	  vbtn: true,// 是否显示 播放按钮
	  popstu: 1,// 留资弹窗状态
	  curvio: null, // 当前创建的video
	  id:null

  },
  onLoad: function (options) {
    mta.Page.init()//腾讯统计
    console.log("options", options)
	this.setData({ id: options.id})
    mta.Event.stat("look_car_t90", {})
    if (wx.getStorageSync("shareIds").channel_id) mta.Event.stat("channel_sunode", { channelid: wx.getStorageSync("shareIds").channel_id})
    if (options.gdt_vid) this.data.gdt_vid = options.gdt_vid
    if (options.channel_id) { this.channelUpload(options.channel_id) }
    request_01.login(() => {
      this.initData(options)
    })
    // this.scrollShowInit()
    this.getSystemInfo().then(res => {
      this.setData({ windowHeight: res.windowHeight })
    })
    //是否显示最新icon
    this.setData({ isShowIcon: 1 })
    api.isShowIcon().then(res => {
      console.log("显示icon返回", res)
      this.setData({ isShowIcon: res.data.data})
      console.log("isShowIcon", this.data.isShowIcon)
    })
  },
  //选择车款
  bindRegionChange(e) {
    if (this.data.car_type_list_index == e.detail.value) return
    this.setData({ isSwitchIng: true})
    tool.loading("")
    setTimeout(() => {
      tool.loading_h()
      this.data.car_type_list_index = e.detail.value
      tool.alert(`当前级别：${this.data.lookCarDetail.car_details[this.data.car_type_list_index].name}`)
      this.car_details(true)
    }, 800)
  },
  //当前车款配置
  car_details(siHideLoading) {
    this.setData({
      car_details: this.data.lookCarDetail.car_details[this.data.car_type_list_index].values,
      isIconShow: true,
      isSwitchIng: false
    })
    if (!siHideLoading) tool.loading_h()
  },
  //页面初始化
  initData(options) {
    // tool.loading("加载")
    Promise.all([
      request_01.lookCarDetail({
        user_id: wx.getStorageSync('userInfo').user_id,
        id: options.id || '9',
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
          title: this.data.lookCarDetail.car_name || '看车详情'
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
//   bindload() {
//     tool.loading_h()
//   },
  //导航列表
  navList(e) {
    const index = e.currentTarget.dataset.index;
    const navIndex = this.data.navIndex;
    if (navIndex == index) return;
    this.setData({
      navIndex: index,
    })
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 300
    })
  },
  // 跳往路线
  toDetailRoute(e){
    let index = e.currentTarget.dataset.index;
    router.jump_nav({
      url: `/pages/look_car_detail_route/look_car_detail_route?index=${index}`,
    })
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
    console.log("vehicle", this.data.vehicle)
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
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
	  return {
		  title: `${txt}`,
		  path: `/pages/look_car_detail_05/look_car_detail_05?id=${this.data.id}`,
		  imageUrl: imageUrl
	  }
  },
  //获取swiper高度
  getHeight: function (e) {
    var winWid = wx.getSystemInfoSync().windowWidth - 2 * 50;//获取当前屏幕的宽度
    var imgh = e.detail.height;//图片高度
    var imgw = e.detail.width;
    var sH = winWid * imgh / imgw + "px"
    this.setData({
      swiperH: sH//设置高度
    })
  },
  //点击联动轮播--风雕美学外观
  selectMySwiper1(e) {
    this.setData({ swiper1Current: e.currentTarget.dataset.index })
  },
  selectMySwiper2(e) {
    this.setData({ swiper2Current: e.currentTarget.dataset.index })
  },
  selectMySwiper3(e) {
    this.setData({ swiper3Current: e.currentTarget.dataset.index })
  },
  //swiper滑动事件
  swiperFirst: function (e) {
    this.setData({
      nowIdx: e.detail.current,
      nowIndex: e.detail.current
    })
  },
  swiperSecond: function (e) {
    this.setData({
      nowSIdx: e.detail.current
    })
  },
  swiperThird: function (e) {
    this.setData({
      nowTIdx: e.detail.current
    })
  },
  swiperFour: function (e) {
    this.setData({
      nowFIdx: e.detail.current
    })
  },
  swiperFive: function (e) {
    this.setData({
      nowFiIdx: e.detail.current
    })
  },
  swiperSix: function (e) {
    console.log(e.detail.current);
    this.setData({
      swiper3Current: e.detail.current
    })
  },
  onSwiperBindchange(e) {
    this.setData({
      onSwiperIndex: e.detail.current
    })
  },
  //滚动监听
  onPageScroll: function (e) {
    this.setData({ scrollTop: e.scrollTop })
  },
  //获取dom信息
  getDom(ele) {
    return new Promise((resolve, reject) => {
      const query = wx.createSelectorQuery()
      query.select(ele).boundingClientRect()
      query.selectViewport().scrollOffset()
      query.exec(function (res) {
        resolve(res)
      })
    })
  },
  //获取设备信息
  getSystemInfo() {
    return new Promise((resolve, reject) => {
      wx.getSystemInfo({
        success(res) {
          resolve(res)
        }
      })
    })
  },
  changeCar(e) {
    let index = e.currentTarget.dataset.index
    console.log(index)
    this.setData({
      colorNow: index
    })
  },
  //页面跳转
  jump(e) {
    tool.jump_nav(e.currentTarget.dataset.url)
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
  onHide(){
    clearInterval(this.data.animateInit)
  },
  onUnload() {
    clearInterval(this.data.animateInit)
  },
  //朋友圈数据上传
  dataReport() {
    api.getAdvertToken().then(res => {
      let _access_token = res.data.data.token
      let _gdt_vid = this.data.gdt_vid
      console.log("【数据上报获取的access_token】", _access_token)
      console.log("【用户的gdt_vid】", _gdt_vid)
      let _data = {
        actions: [
          {
            user_action_set_id: "1109903670",
            url: "http://www.qq.com",
            action_time: parseInt((new Date()).getTime() / 1000),
            action_type: "RESERVATION",
            trace: {
              click_id: _gdt_vid || "1122334455667788"
            },
            action_param: {
              "value": '377677616'
            }
          }
        ]
      }
      return api.returnData(_data, 'https://api.weixin.qq.com/marketing/user_actions/add?version=v1.0&access_token=' +  _access_token)
    }).then(res => {
      console.log("【朋友圈数据上报返回】", res)
    })
  },
  //朋友圈渠道上传
  channelUpload(channel_id) {
    api.channelUpload({ user_id: wx.getStorageSync('userInfo').user_id, channel_id: channel_id}).then(res => {
      console.log("朋友圈渠道上报返回：", res)
    })
  },
	moreBtn(){
		tool.jump_red("/pages/index/index")
	},

	swiperchange(e) { //控制swiper 切换
		// console.log(e);
		let type = e.currentTarget.dataset.type;
		this.setData({
			isplay: false,
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
		})
		console.log(type);
		// console.log(this.data.swiper2);
	},
	changecol(e) {// 切换车色
		let index = e.currentTarget.dataset.index;
		this.setData({ rogincol: index })
		console.log(index)
	},

	// 播放视频
	setplay(e){ 
    console.log('1',this.data.isplay);
    console.log(e.currentTarget.dataset.vurl)
      this.setData({ 
        isplay:true,
        });
    setTimeout(() => {
      this.setData({
        videoUrl:e.currentTarget.dataset.vurl
      })
      this.isOpenVideo()
    }, 1000);
    console.log('2',this.data.isplay);
  },
  // 视频播放弹窗开关
  isOpenVideo(){
    this.setData({
      isPlayVedio:!this.data.isPlayVedio,
      isplay:false,
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
	changetab(e) {// 点击左右切换轮播
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
	},
	closelz() {
		this.setData({ popstu: 2 })
	}
})
