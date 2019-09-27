// pages/order_detail/order_detail.js
const request_01 = require('../../utils/request/request_01.js');
const method = require('../../utils/tool/method.js');
const router = require('../../utils/tool/router.js');
const authorization = require('../../utils/tool/authorization.js');
const alert = require('../../utils/tool/alert.js');
import tool from '../../utils/tool/tool.js'
import api from '../../utils/request/request_03.js'

const app = getApp();//获取应用实例
Page({

  /**
   * 页面的初始数据
   */
  data: {
    IMGSERVICE: app.globalData.IMGSERVICE,
    orderDetail: {},
    loadingText: '卡券领取中',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    request_01.login(() => {
      this.initData(options)
    })
  },
  receive(e) {
    let _item = this.data.orderDetail.order_goods[e.currentTarget.dataset.index]
    this.setData({ curGoods: _item, curIndex: e.currentTarget.dataset.index, order_goods_id:_item.order_goods_id })
    console.log("this.data.curGoods", this.data.curGoods)
    if (_item.is_receive == 1) return
    this.submit()
  },
  //留资领取
  submit() {
    console.log("this.data.curGoods", this.data.curGoods)
    let _data = {
      user_id: wx.getStorageSync("userInfo").user_id,
      order_goods_id: this.data.curGoods.order_goods_id
    }
    console.log("_data", _data)
    api.couponPushForm(_data).then(res => {
      console.log("留资接口返回", res)
      // let _data = res.data.data
      // let _cardExt = '{"nonce_str": "' + _data.nonceStr + '",  "timestamp": "' + _data.timestamp + '", "signature":"' + _data.signature + '"}'
      this.addCard(res.data.data, _data.data_id)
    })
  },
  //领取卡券
  addCard(cardList, data_id) {
    this.isShowLoading()
    tool.addCard(cardList).then(res => {
      console.log("卡券返回", res)
      if (res.errMsg == "addCard:ok") {
        console.log("卡券领取成功")
        let _card_code = ''
        for (let i = 0; i < res.cardList.length; i++) {
          _card_code += ((i == 0 ? '' : ',') + res.cardList[i].code)
        }
        this.cardCheck(data_id, _card_code)
      } else {
        this.isShowLoading()
        tool.alert("卡券领取失败")
      }
    }).catch(err => {
      console.log("err", err)
      this.isShowLoading()
      tool.alert("卡券领取失败")
    })
  },
  //卡券核销上报
  cardCheck(data_id, card_code) {
    let _data = {
      user_id: wx.getStorageSync("userInfo").user_id,
      order_goods_id: this.data.order_goods_id,
      // data_id: data_id,
      card_code: card_code
    }
    api.orderCheck(_data).then(res => {
      console.log("卡券核销上报返回", res)
      if (res.statusCode == 200) {
        this.isShowLoading()
        tool.alert("卡券领取成功，请到我的卡包查看卡券使用详情")
        let _orderDetail = this.data.orderDetail
        _orderDetail.order_goods[this.data.curIndex].is_receive = 1
        console.log("_orderDetail", _orderDetail)
        this.setData({ orderDetail: _orderDetail })
      }
    })
  },
  //自定义loading框
  isShowLoading() {
    this.setData({
      isShowLoading: !this.data.isShowLoading
    })
  },
  //留资弹窗打开、关闭
  isShowForm() {
    this.setData({ isShowForm: !this.data.isShowForm })
  },
  //页面初始化
  initData(options) {
    const userInfo = wx.getStorageSync('userInfo');
    // this.data.order_goods_id = options.order_id
    Promise.all([
      request_01.orderDetail({
        user_id: userInfo.user_id,
        order_id: options.order_id,
      })
    ])
      .then((value) => {
        //success
        const orderDetail = value[0].data.data;

        this.setData({
          orderDetail,
        })
      })
      .catch((reason) => {
        //fail

      })
  },
  //查看快递物流
  lookWuLiu() {
    const orderDetail = this.data.orderDetail;
    router.jump_nav({
      url: `/pages/order_wuliu/order_wuliu?order_id=${orderDetail.order_id}`,
    })
  },
  //虚拟卡卷复制兑换码
  copyBtn(e) {
    const index = e.currentTarget.dataset.index;
    const orderDetail = this.data.orderDetail;
    const card_code = orderDetail.order_goods[index].card_code;

    wx.setClipboardData({
      data: card_code,
      success: function (res) {

      }
    })


  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
})