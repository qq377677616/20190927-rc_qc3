// pages/payment/pay_change/pay_change.js
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
    page: 1,
  },

  //初始化数据
  initData(options) {
    console.log(options.car_owner, '111111111111')
    let cate_id = options.cate_id
    let page = this.data.page
    let is_activity = 1
    request_05.goodsList({
      cate_id,
      page,
      is_activity
    }).then(res => {
      console.log(res, 'res')
      if (res.data.status == 1) {
        this.setData({
          goodsData: res.data.data,
          car_owner: options.car_owner == 1,
          goods2_buy: options.goods2_buy,
          options,
        })
      } else {
        console.log('报错')
      }
    })
  },

  // 商品详情页
  toDetail(e) {
    let activity_id = this.data.options.activity_id
    let goods_id = e.currentTarget.dataset.id
    let stype = e.currentTarget.dataset.stype
    let open_buy = this.data.options.open_buy
    if(open_buy!=1){
      tool.alert('暂未开放')
      return
    }
    if (stype == 2 && this.data.goods2_buy == 0) {
      tool.alert('线下提车后次日即可兑换实物礼品')
    } else {
      if ((wx.getStorageSync("userInfo").user_type == 0 && this.data.car_owner) || !wx.getStorageSync("userInfo").nickName || !wx.getStorageSync("userInfo").unionid) return;
      if (wx.getStorageSync("userInfo").user_type == 0 && e.currentTarget.dataset.owner == 1) {
        this.setData({
          popType: 4
        });
        this.isVehicleOwnerHidePop();
        return;
      }
      router.jump_nav({
        url: `/pages/payment/pay_detail/pay_detail?goods_id=${goods_id}&activity_id=${activity_id}`
      })
    }
  },

  //判断是否授权和是否是车主
  isVehicleOwner(e) {
    console.log('e', e)
    if ((wx.getStorageSync("userInfo").nickName && wx.getStorageSync("userInfo").user_type == 1 && wx.getStorageSync("userInfo").unionid) || (e && e.target.dataset.type != 'ok') || (wx.getStorageSync("userInfo").nickName && !this.data.car_owner && wx.getStorageSync("userInfo").unionid)) return
    if (!wx.getStorageSync("userInfo").nickName || !wx.getStorageSync("userInfo").unionid) {
      this.setData({
        popType: 2
      })
    } else if (wx.getStorageSync("userInfo").user_type == 0 && this.data.car_owner) {
      this.setData({
        popType: 3
      })
    }
    this.isVehicleOwnerHidePop()
  },
  //授完权后处理
  getParme(e) {
    this.isVehicleOwnerHidePop()
    request_01.setUserInfo(e).then(res => {
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

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

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
    let cate_id = this.data.options.cate_id;
    let obj = {
      title: '启辰星预售开启，快来兑换精美礼品！',
      path: `/pages/payment/pay_change/pay_change?cate_id=${cate_id}`,
      imageUrl: this.data.IMGSERVICE + "/pay/share_pay.jpg"
    };
    return obj;
  }
})