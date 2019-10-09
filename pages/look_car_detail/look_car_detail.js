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
    sss: true
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
    this.scrollShowInit()
    this.getSystemInfo().then(res => {
      this.setData({ windowHeight: res.windowHeight })
    })
    //是否显示最新icon
    api.isShowIcon().then(res => {
      this.setData({ isShowIcon: 1})
    })
  },
  //初始化dom信息
  scrollShowInit() {
    let _domIdList = this.data.domIdList
    Promise.all([this.getDom(_domIdList[0]), this.getDom(_domIdList[1]), this.getDom(_domIdList[2]), this.getDom(_domIdList[3]), this.getDom(_domIdList[4]), this.getDom(_domIdList[5]), this.getDom(_domIdList[6])]).then(res => {
      let _scrollTopList = []
      for (let i = 0; i < res.length; i++) {
        _scrollTopList.push(res[i][0].top + 120)
      }
      this.setData({ scrollTopList: _scrollTopList })
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
    tool.loading("加载")
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
  bindload() {
    tool.loading_h()
  },
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
  }
})
