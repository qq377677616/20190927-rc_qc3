// pages/payment/pay_index/pay_index.js
const request_01 = require('../../../utils/request/request_01.js');

const request_05 = require('../../../utils/request/request_05.js');

const router = require('../../../utils/tool/router.js');

const tool = require('../../../utils/tool/tool.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    IMGSERVICE: app.globalData.IMGSERVICE,
    isVehicleOwnerHidePop: false, //授权弹窗
    rulspop: false, //规则弹窗,
    openPrize: false, //中奖弹窗,
    openDraw: true, //抽奖开关
    isOnShow: false, //抽奖开关
    isHelp: false, //去助力页开关
    isGou: true, //是否默认选√
  },

  onMyEvent(e) {
    console.log(e.detail)
  },

  // 初始化数据
  initData(options) {
    let activity_id = options.activity_id;
    console.log(activity_id)
    let openid = wx.getStorageSync('userInfo').openid
    request_05.ninepayInfo({
      activity_id,
      openid
    }).then(res => {
      this.setRule()
      this.setData({
        show_page: res.data.data.show_page,
        car_owner: res.data.data.activity_info.car_owner,
        activity_id: options.activity_id,
        order_sn: res.data.data.order_sn,
        acData: res.data.data,
        my_score: res.data.data.my_score,
        is_upgrade: res.data.data.help_info.prize_info.is_upgrade,
        options
      })
      if (res.data.data.show_page == 6 && res.data.data.help_info.prize_info.is_upgrade == 0 || res.data.data.show_page == 7 && res.data.data.help_info.prize_info.is_upgrade == 0) {
        router.jump_red({
          url: `/pages/payment/pay_help/pay_help?activity_id=${activity_id}`
        })
      }
      let keyGroup = wx.getStorageSync('keyGroup')
      console.log(keyGroup, 'keyGroup')
      let payKey = wx.getStorageSync('keyGroup').pinKey
      console.log(payKey, 'payKey')
      if (!payKey) {
        if (!this.beforeCheck()) {
          console.log('没有授权')
          return;
        } else {
          console.log('授权了')
        }
      }
      this.setData({
        keyGroup,
      })
    })
  },

  // 金额刷新
  updateCash() {
    let activity_id = this.data.options.activity_id;
    let openid = wx.getStorageSync('userInfo').openid
    request_05.ninepayInfo({
      activity_id,
      openid
    }).then(res => {
      this.setData({
        my_score: res.data.data.my_score
      })
    })
  },

  //去兑换页
  toChange() {
    let cate_id = this.data.acData.activity_info.cate_id
    let car_owner = this.data.car_owner
    console.log(cate_id, 'cate_id')
    router.jump_nav({
      url: `/pages/payment/pay_change/pay_change?cate_id=${cate_id}&car_owner=${car_owner}`
    })
  },

  //我的奖品
  toPrize() {
    let activity_id = this.data.activity_id
    console.log(111111)
    router.jump_nav({
      url: `/pages/o_prize/o_prize?activity_id=${activity_id}`
    })
  },

  //立即领取
  sucPrize() {
    let options = this.data.options
    let activity_id = options.activity_id
    this.setData({
      openPrize: false,
    })
    wx.showToast({
      title: '领取成功',
      icon: 'success',
      duration: 1000
    })
    if (this.data.isGou) {
      setTimeout(() => {
        router.jump_red({
          url: `/pages/payment/pay_help/pay_help?activity_id=${activity_id}`
        })
      }, 1000)
    }
  },

  // 抽奖
  getPrize() {
    let options = this.data.options
    if ((wx.getStorageSync("userInfo").user_type == 0 && this.data.car_owner) || !wx.getStorageSync("userInfo").unionid || !wx.getStorageSync("userInfo").nickName) return;
    let show_page = this.data.show_page
    switch (show_page) {
      case 2:
        this.setData({
          isVehicleOwnerHidePop: true,
          popType: 7,
          text: "即刻下订，领现金红包",
          acData: this.data.acData
        })
        break;
      case 3:
        this.setData({
          isVehicleOwnerHidePop: true,
          popType: 7,
          text: "即刻下订，领现金红包",
          acData: this.data.acData
        })
        break;
      case 4:
        this.setData({
          isVehicleOwnerHidePop: true,
          popType: 8,
          text: "立即领取,领现金红包",
          acData: this.data.acData
        })
        break;
      case 5:
        let activity_id = this.data.activity_id
        let openid = wx.getStorageSync('userInfo').openid
        if (this.data.openDraw) {
          this.setData({
            openDraw: false
          })
          request_05.payDraw({
            openid,
            activity_id
          }).then(res => {
            console.log(res, 'res')
            if (res.data.status == 1) {
              this.updateCash()
              this.setData({
                openPrize: true,
                openDraw: true,
                isHelp: true,
                prizeData: res.data.data.prize_info
              })
            } else {
              this.setData({
                openDraw: true
              })
              tool.alert(res.data.msg)
            }
          })
        }
        break;
    }
  },


  // 授权手机号
  getPhoneNumber(e) {
    console.log(111111111111)
    let options = this.data.options
    let user_id = wx.getStorageSync('userInfo').user_id
    let session_key = wx.getStorageSync('userInfo').session_key
    let iv = e.detail.iv
    let encrypted_data = e.detail.encryptedData
    request_05.dePhone({
      user_id,
      session_key,
      iv,
      encrypted_data
    }).then(res => {
      if (res.data.status == 1) {
        this.initData(options)
      } else {
        tool.alert(res.data.msg)
      }
    })
  },

  // 授权
  beforeCheck() {
    if (!wx.getStorageSync("userInfo").nickName || !wx.getStorageSync("userInfo").unionid) {
      this.setData({
        popType: 2
      })
      this.isVehicleOwnerHidePop()
      console.log('进来授权')
      return false;
    } else {
      return true
    }
    if (wx.getStorageSync("userInfo").user_type == 0 && this.data.car_owner == 1) {
      this.setData({
        popType: 3
      })
      this.isVehicleOwnerHidePop()
      console.log('进来车主')
      return false;
    }
  },

  // 弹窗永久弹一次
  setRule() {
    if (!wx.getStorageSync("isRule").pay) {
      this.setData({
        rulspop: true
      });
      let _isRule = wx.getStorageSync("isRule") || {}
      _isRule.pay = true
      wx.setStorageSync("isRule", _isRule)
    }
  },

  // 打开关闭规则
  switchRule() {
    this.setData({
      rulspop: !this.data.rulspop
    })
    if (wx.getStorageSync('keyGroup').pinKey) {
      let keyGroup = this.data.keyGroup
      keyGroup.pinKey = false
      wx.setStorageSync('keyGroup', keyGroup)
      if (!this.beforeCheck()) {
        return;
      }
    }
  },

  // 中奖默认勾选切换
  gouSel() {
    this.setData({
      isGou: !this.data.isGou
    })
  },

  //判断是否授权和是否是车主
  isVehicleOwner(e) {
    if ((wx.getStorageSync("userInfo").unionid && wx.getStorageSync("userInfo").nickName && wx.getStorageSync("userInfo").user_type == 1) || (wx.getStorageSync("userInfo").unionid && wx.getStorageSync("userInfo").nickName && !this.data.car_owner)) return;
    if (!wx.getStorageSync("userInfo").nickName || !wx.getStorageSync("userInfo").unionid) {
      this.setData({
        popType: 2
      })
    } else if (wx.getStorageSync("userInfo").user_type == 0) {
      this.setData({
        popType: 3
      })
    }

    this.isVehicleOwnerHidePop()
  },
  //授完权后处理
  getParme(e) {
    this.isVehicleOwnerHidePop()
    request_01.setUserInfo(e)
      .then(res => {
        this.isVehicleOwner()
      })
  },
  //是否授权、绑定车主弹窗
  isVehicleOwnerHidePop() {
    this.setData({
      isVehicleOwnerHidePop: !this.data.isVehicleOwnerHidePop
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    request_01.login(() => {
      this.initData(options);
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.setData({
      isOnShow: true
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    // let options = this.data.options
    // if (this.data.isOnShow) {
    //   this.initData(options);
    // }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})