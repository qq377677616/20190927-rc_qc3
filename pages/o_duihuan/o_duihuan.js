// pages/o_duihuan/o_duihuan.js
const request_01 = require('../../utils/request/request_01.js');

const method = require('../../utils/tool/method.js');

const router = require('../../utils/tool/router.js');

const authorization = require('../../utils/tool/authorization.js');

const alert = require('../../utils/tool/alert.js');

const app = getApp(); //获取应用实例
Page({

  /**
   * 页面的初始数据
   */
  data: {
    IMGSERVICE: app.globalData.IMGSERVICE,
    page404: false,
    options: {},
    firstShow: false,
    orderList: [],
    status: 0,
    page: 1,
    scrollPrivateKey: true,
    listKey: true,
    scrollKey: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    request_01.login(() => {
      this.initData(options)
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
    const userInfo = wx.getStorageSync('userInfo');
    const status = this.data.status;
    const page = this.data.page;
    let scrollKey = this.data.scrollKey;
    let listKey = this.data.listKey;
    let scrollPrivateKey = this.data.scrollPrivateKey;

    //列表加载中、滚动加载中都不允许操作
    if (!scrollKey || !listKey || !scrollPrivateKey) return;

    this.setData({
      scrollKey: false,
      str: '加载中...',
      isMore: true,
    })

    if (this.data.options.from_activity_id) {
      request_01.exchangeList({
          openid: userInfo.openid,
          from_activity_id: this.data.options.from_activity_id,
          status,
          page: page + 1,
        })
        .then((value) => {
          //success
          const newOrderList = value.data.data.list;
          const orderList = this.data.orderList;
          let scrollPrivateKey, isMore;

          if (newOrderList.length) { //有数据返回
            scrollPrivateKey = true;
            isMore = false;
          } else { //无数据返回
            scrollPrivateKey = false;
            isMore = true;
          }

          this.setData({
            orderList: [...orderList, ...newOrderList],
            scrollPrivateKey,
            page: page + 1,
            isMore,
            str: '- 我是有底线的 -',
          })
        })
        .catch((reason) => {
          //fail
          this.setData({
            str: '- 我是有底线的 -',
            isMore: false,
          })
        })
        .then(() => {
          //complete
          this.setData({
            scrollKey: true,
          })
        })
    } else {
      request_01.exchangeList({
          user_id: userInfo.user_id,
          status,
          page: page + 1,
        })
        .then((value) => {
          //success
          const newOrderList = value.data.data.list;
          const orderList = this.data.orderList;
          let scrollPrivateKey, isMore;

          if (newOrderList.length) { //有数据返回
            scrollPrivateKey = true;
            isMore = false;
          } else { //无数据返回
            scrollPrivateKey = false;
            isMore = true;
          }

          this.setData({
            orderList: [...orderList, ...newOrderList],
            scrollPrivateKey,
            page: page + 1,
            isMore,
            str: '- 我是有底线的 -',
          })
        })
        .catch((reason) => {
          //fail
          this.setData({
            str: '- 我是有底线的 -',
            isMore: false,
          })
        })
        .then(() => {
          //complete
          this.setData({
            scrollKey: true,
          })
        })
    }
  },

  /**
   * 用户点击右上角分享
   */
  //   onShareAppMessage: function () {

  //   },
  //页面初始化
  initData(options) {
    console.log(options)
    const userInfo = wx.getStorageSync('userInfo');
    const status = this.data.status;
    const page = this.data.page;

    if (options.from_activity_id) {
      console.log(11111111111)
      Promise.all([
          request_01.exchangeList({
            openid: userInfo.openid,
            from_activity_id: options.from_activity_id,
            status,
            page,
          })
        ])
        .then((value) => {
          //success
          const orderList = value[0].data.data.list;
          let isMore;

          if (orderList.length) { //有数据返回
            isMore = false;
          } else { //无数据返回
            isMore = true;
          }
          this.setData({
            orderList,
            str: '- 我是有底线的 -',
            isMore,
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
          this.setData({
            options,
          })
        })
    } else {
      Promise.all([
          request_01.exchangeList({
            user_id: userInfo.user_id,
            status,
            page,
          })
        ])
        .then((value) => {
          //success
          const orderList = value[0].data.data.list;
          let isMore;

          if (orderList.length) { //有数据返回
            isMore = false;
          } else { //无数据返回
            isMore = true;
          }
          this.setData({
            orderList,
            str: '- 我是有底线的 -',
            isMore,
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
          this.setData({
            options,
          })
        })
    }
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
  //列表
  listBtn(e) {
    const status = e.currentTarget.dataset.status;
    const userInfo = wx.getStorageSync('userInfo');
    const curStatus = this.data.status;
    const listKey = this.data.listKey;
    let scrollKey = this.data.scrollKey;

    //点击当前列表项、列表加载中、滚动加载中都不允许操作
    if (curStatus == status || !listKey || !scrollKey) return;
    if (this.data.options.from_activity_id) {
      request_01.exchangeList({
          openid: userInfo.openid,
          from_activity_id: this.data.options.from_activity_id,
          status,
          page: 1,
        })
        .then((value) => {
          //success
          const orderList = value.data.data.list;
          let isMore;


          if (orderList.length) { //有数据返回
            isMore = false;
          } else { //无数据返回
            isMore = true;
          }

          this.setData({
            orderList,
            page: 1,
            status,
            scrollKey: true,
            scrollPrivateKey: true,
            str: '- 我是有底线的 -',
            isMore,
          })
        })
        .catch((reason) => {
          //fail

        })
        .then(() => {
          //complete
          this.setData({
            listKey: true,
          })
        })
    } else {
      request_01.exchangeList({
          user_id: userInfo.user_id,
          status,
          page: 1,
        })
        .then((value) => {
          //success
          const orderList = value.data.data.list;
          let isMore;


          if (orderList.length) { //有数据返回
            isMore = false;
          } else { //无数据返回
            isMore = true;
          }

          this.setData({
            orderList,
            page: 1,
            status,
            scrollKey: true,
            scrollPrivateKey: true,
            str: '- 我是有底线的 -',
            isMore,
          })
        })
        .catch((reason) => {
          //fail

        })
        .then(() => {
          //complete
          this.setData({
            listKey: true,
          })
        })
    }
  },
  //订单详情
  orderDetail(e) {
    const index = e.currentTarget.dataset.index;
    const orderList = this.data.orderList;
    const order_id = orderList[index].order_id;
    router.jump_nav({
      url: `/pages/order_detail/order_detail?order_id=${order_id}`
    })


  },
})