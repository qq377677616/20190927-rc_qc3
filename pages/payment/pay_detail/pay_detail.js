// pages/payment/pay_detail/pay_detail.js
const request_01 = require('../../../utils/request/request_01.js');

const request_05 = require('../../../utils/request/request_05.js');

const router = require('../../../utils/tool/router.js');

const tool = require('../../../utils/tool/tool.js');

const WxParse = require('../../../utils/wxParse/wxParse.js');

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    attr: {
      __number: 1,
      __type: '立即兑换',
    },
  },

  // 初始化数据
  initData(options) {
    let goods_id = options.goods_id
    let user_id = wx.getStorageSync('userInfo').user_id
    request_05.goodsDetail({
      goods_id,
      user_id
    }).then(res => {
      console.log(res, 'res')
      const goodsDetail = res.data.data;
      WxParse.wxParse('product_explain', 'html', goodsDetail.intro, this);
      this.setData({
        proData: res.data.data,
        goodsDetail,
        goods_id,
        options
      })
    })
  },

  // 留资
  toPay() {
    const goodsDetail = this.data.goodsDetail;
    goodsDetail.goods_id = this.data.goods_id
    let activity_id = this.options.activity_id
    let attr = this.data.attr;
    Object.assign(goodsDetail, attr)
    app.globalData.goodsDetail = goodsDetail; //将该商品信息存于全局

    router.jump_nav({
      url: `/pages/payment/pay_cart/pay_cart?type=pay&activity_id=${activity_id}`
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.initData(options)
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

  }
})