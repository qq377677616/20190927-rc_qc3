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
		  { img: 't60_col1.png', txt: '旭日橙/珠光白双色' },
		  { img: 't60_col2.png', txt: '烈焰红/曜石黑双色' },
		  { img: 't60_col3.png', txt: '珠光白/曜石黑双色' },
		  { img: 't60_col4.png', txt: '烈焰红' },
		  { img: 't60_col5.png', txt: '曜石黑' },
		  { img: 't60_col6.png', txt: '乌刚灰' },
		  { img: 't60_col7.png', txt: '旭日橙' },
		  { img: 't60_col8.png', txt: '晴空蓝' },
		  { img: 't60_col9.png', txt: '珠光白' }
	  ],
	  t70carcol: [//t70颜色图
		  { img: 't70bg6.png', txt: '旭日橙' },
		  { img: 't70bg7.png', txt: '朝霞红' },
		  { img: 't70bg8.png', txt: '珠光白' },
		  { img: 't70bg9.png', txt: '翡丽灰' },
		  { img: 't70bg10.png', txt: '曜石黑' }
	  ],
	  d60carcol: [//t70颜色图
		  { img: 'd60col1.png', txt: '晴空蓝' },
		  { img: 'd60col2.png', txt: '映日棕' },
		  { img: 'd60col3.png', txt: '辰辉银' },
		  { img: 'd60col4.png', txt: '赤兔红' },
		  { img: 'd60col5.png', txt: '珠光白' },
		  { img: 'd60col6.png', txt: '曜石黑' }
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
	  swiper2_txt: ['宽适乘坐空间', '360 大视野全景天窗', '丰富储物空间', '人性化车内储物空间', '科技简约内饰'],//部件名称
	  swiper3_txt: ['全新日产XTRONIC CVT智能无极变速器', '专业舒适化底盘调校', 'Multi-Layer人体工学座椅 (带座椅通风/加热)', '出众的NVH品质', '新一代日产明星缸内直喷发动机MR20'],//部件名称
	  swiper4_txt: ['全时在线导航', '全新升级智能语音交互', '手机远程控制', '智能安防系统', '全场景账号服务系统','高品质娱乐体验','智能车联服务','EPB电子手刹+Auto Hold自动驻车','12.3+10.25英寸沉浸式科技联屏','15W高效无线充电','智能交互电动尾门','3D AVM无盲区高清全景监控影像系统','FEB预碰撞智能刹车辅助系统','LDW 车道偏离预警系统','EAMP 油门误踩智能纠正系统','BSW 变道盲区预警系统','车家互联'],//部件名称
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
		  { img: 'tb90_3_4.mp4', type: 2 },
		  { img: 'tb90_3_5.png', type: 1 }
	  ],	 
	  t90swp4: [
		  { img: 'tb90_4_1.mp4', type: 2 },
		  { img: 'tb90_4_2.mp4', type: 2 },
		  { img: 'tb90_4_3.mp4', type: 2 },
		  { img: 'tb90_4_4.mp4', type: 2 },
		  { img: 'tb90_4_5.mp4', type: 2 },
		  { img: 'tb90_4_6.mp4', type: 2 },
		  { img: 'tb90_4_7.mp4', type: 2 },
		  { img: 'tb90_4_8.png', type: 1 },
		  { img: 'tb90_4_9.png', type: 1 },
		  { img: 'tb90_4_10.png', type: 1 },
		  { img: 'tb90_4_11.mp4', type: 2 },
		  { img: 'tb90_4_12.mp4', type: 2 },
		  { img: 'tb90_4_13.mp4', type: 2 },
		  { img: 'tb90_4_14.mp4', type: 2 },
		  { img: 'tb90_4_15.mp4', type: 2 },
		  { img: 'tb90_4_16.mp4', type: 2 },
		  { img: 'tb90_4_17.mp4', type: 2 }
	  ],
	  swp1_img: [ //t60第一个swiper资源
		  { img: 'Tb60_sw1.png', type: 1 },
		  { img: 'Tb60_sw2.mp4', type: 2 },
		  { img: 'Tb60_sw3.mp4', type: 2 },
		  { img: 'Tb60_sw4.png', type: 1 },
		  { img: 'Tb60_sw5.mp4', type: 2 },
		  { img: 'Tb60_sw6.png', type: 1 },
		  { img: 'Tb60_sw7.mp4', type: 2 },
		  { img: 'Tb60_sw8.mp4', type: 2 },
		  { img: 'Tb60_sw9.png', type: 1 }
	  ],
	  swp3_img: [//t60第三个swiper资源
		  { img: 'Tb60_sw3_1.mp4', type: 2 },
		  { img: 'Tb60_sw3_2.mp4', type: 2 },
		  { img: 'Tb60_sw3_3.mp4', type: 2 },
		  { img: 'Tb60_sw3_4.mp4', type: 2 },
		  { img: 'Tb60_sw3_5.mp4', type: 2 },
		  { img: 'Tb60_sw3_6.mp4', type: 2 },
		  { img: 'Tb60_sw3_7.mp4', type: 2 },
		  { img: 'Tb60_sw3_8.mp4', type: 2 },
		  { img: 'Tb60_sw3_9.mp4', type: 2 },
		  { img: 'Tb60_sw3_10.mp4', type: 2 }
	  ],
	  t70_swiper2_img: [// t70第二个swiper
		  { img: 'tb70_2_1.mp4', type: 2 },
		  { img: 'tb70_2_2.mp4', type: 2 },
		  { img: 'tb70_2_3.mp4', type: 2 },
		  { img: 'tb70_2_4.mp4', type: 2 },
		  { img: 'tb70_2_5.mp4', type: 2 },
		  { img: 'tb70_2_6.mp4', type: 2 }
	  ]

  },

  onLoad: function (options) {
    mta.Page.init()//腾讯统计
    console.log("options", options)
    this.data.id = options.id
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
    console.log("e.detail", e.detail)
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
    })
      .then((value) => {
        //success
        const msg = value.data.msg;
        const status = value.data.status;
        if (status == 1) {
          alert.loading_h()
          // mta.Event.stat("booking_car_t90", { name: detail.name, phone: detail.phone, city: detail.region.join('--')})
          mta.Event.stat("booking_car_t90", { userinfo: `${detail.name} ${detail.phone} ${detail.region.join('--')}`})
          if (this.data.gdt_vid) this.dataReport()
          alert.confirm({ title: "预约成功", content: `您已成功预约「${this.data.vehicle.title}」的试驾，稍后将有工作人员联系您，请保持电话畅通。`, confirms: "好的,#0C5AC0", cancels: false }).then(res => {
          this.setData({
            isShowForm: false,
          })
        })
        } else {
          alert.alert({
            str: '预约失败，请稍后再试~',
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
    return {
      title: '全新启辰T90 跨悦上市',
      path: `/pages/look_car_detail/look_car_detail?id=${this.data.id}`,
      imageUrl: `${this.data.IMGSERVICE}/car_detail/share.jpg`
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
	}
})
