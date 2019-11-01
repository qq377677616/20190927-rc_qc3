// pages/home/home.js
const request_01 = require('../../utils/request/request_01.js');

const alert = require('../../utils/tool/alert.js');

const router = require('../../utils/tool/router.js');

const app = getApp();//获取应用实例
Page({

  /**
   * 页面的初始数据
   */
  data: {
    IMGSERVICE: app.globalData.IMGSERVICE,
    pageKey: false,
    page404: false,
    options: {},
    firstShow: false,
    personalInfo: {},
    signInIf: false,
    user_type: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    request_01.login(() => {

      this.setData({
        userInfo: wx.getStorageSync("userInfo") || {}
      })

      this.initData(options)

    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.setData({
      firstShow: true,
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShow() {
    const options = this.data.options;
    const firstShow = this.data.firstShow;

    if (firstShow) {
      this.onLoad(options)
    }
  },
  //页面初始化
  initData(options) {

    const locationUersInfo = wx.getStorageSync('userInfo');

    alert.loading({
      str: '加载中'
    })

    Promise.all([
      request_01.homeInfo({
        user_id: locationUersInfo.user_id,
        openid: locationUersInfo.openid,
      }),
    ])
      .then((value) => {
        //success
        const personalInfo = value[0].data.data;

        this.setData({
          personalInfo,
          pageKey: true,
        })

      })
      .catch((reason) => {
        //fail

        //开启404页面
        this.setData({
          page404: true,
        })
      })
      .then(() => {
        //complete
        alert.loading_h()
        this.setData({
          options,
        })
      })
  },
  //重新加载
  reload() {
    const options = this.data.options;

    //关闭404页面
    this.setData({
      page404: false,
    })

    this.onLoad(options);
  },
  //显示签到
  signInIf() {
    this.setData({
      signInIf: !this.data.signInIf
    })
  },
  //授权
  getUserInfo(e) {
    request_01.setUserInfo(e)
      .then((res) => {
        console.log("授权、上传头像昵称成功")
        this.setData({
          userInfo: wx.getStorageSync("userInfo")
        })
      })
      .catch((err) => {
        err && alert.alert({
          str: JSON.stringify(err)
        })
      })
  },
  //v豆详情
  vdouDetail() {
    router.jump_nav({
      url: '/pages/o_vdou/o_vdou',
    })
  },
  //绑定车主
  bindCarUser(e) {
    const type = e.currentTarget.dataset.type;
    let url;
    if (type == 'bind') {
      url = '/pages/o_love_car/o_love_car';
    } else {
      url = '/pages/o_love_car_show/o_love_car_show';
    }
    router.jump_nav({
      url,
    })
  },
  //导航跳转
  navJump(e) {
    const index = e.currentTarget.dataset.index;
    switch (index) {
      case '1':
        //每日签到

        break;
      case '2':
        //积分任务
        router.jump_nav({
          url: '/pages/task/task',
        })
        break;
      case '3':
        //积分商城
        router.jump_nav({
          url: '/pages/shop_mall/shop_mall',
        })
        break;
      case '4':
        //个人中心
        router.jump_nav({
          url: '/pages/o_info/o_info',
        })
        break;
      default:
        alert.alert({
          str: '敬请期待!'
        })
        break;
    }
  },
  goInfo() {
    router.jump_nav({
      url: '/pages/o_info/o_info',
    })
  },
  //列表跳转
  listJump(e) {
    const index = e.currentTarget.dataset.index;
    switch (index) {
      case '1':
        //我的奖品
        router.jump_nav({
          url: '/pages/o_prize/o_prize',
        })
        break;
      case '2':
        //我的订单
        router.jump_nav({
          url: '/pages/o_duihuan/o_duihuan',
        })
        break;
      case '3':
        //我的卡包
        router.jump_nav({
          url: '/pages/o_card_bag/o_card_bag',
        })
        break;
      case '4':
        //我的活动
        router.jump_nav({
          url: '/pages/o_activity/o_activity',
        })
        break;
      case '5':
        //我的预约试驾
        router.jump_nav({
          url: '/pages/o_yuyueshijia/o_yuyueshijia',
        })
        break;
      case '6':
        //我的网点
        router.jump_nav({
          url: '/pages/o_dot/o_dot',
        })
        break;
      default:
        alert.alert({
          str: '敬请期待!'
        })
        break;
    }
  }
})