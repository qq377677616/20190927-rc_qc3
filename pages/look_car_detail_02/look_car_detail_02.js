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
    ]
  },

  /** 
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    mta.Page.init()//腾讯统计
    mta.Event.stat("look_car_other", {})
    this.data.id = options.id
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
  //页面跳转
  jump(e) {
    tool.jump_nav(e.currentTarget.dataset.url)
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: `赶快来预约 ${this.data.lookCarDetail.car_name} 吧~`,
      path: `/pages/look_car_detail_02/look_car_detail_02?id=${this.data.id}`
    }
  }
})