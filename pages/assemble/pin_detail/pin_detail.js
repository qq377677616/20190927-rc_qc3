// pages/assemble/pin_detail/pin_detail.js
const request_01 = require('../../../utils/request/request_01.js');

const util = require('../../../utils/public/util.js');

const method = require('../../../utils/tool/method.js');

const router = require('../../../utils/tool/router.js');

const authorization = require('../../../utils/tool/authorization.js');

const alert = require('../../../utils/tool/alert.js');

const WxParse = require('../../../utils/wxParse/wxParse.js');

const app = getApp(); //获取应用实例

Page({

  /**
   * 页面的初始数据
   */
  data: {
    IMGSERVICE: app.globalData.IMGSERVICE,
    options: {},
    firstShow: false,
    dotIndex: 0,
    pinDetail: {},
    timmerGroup: [],
    moreShow: false,
    moreText: '查看更多',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
	  console.log(options);
    request_01.login(() => {
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
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    const firstShow = this.data.firstShow;
    const options = this.data.options;

    if (firstShow) {
      this.onLoad(options)
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    const options = this.data.options;
    const pinDetail = this.data.pinDetail;
    const IMGSERVICE = this.data.IMGSERVICE;
    return {
      title:'组团领好礼，有福一起享！',
      imageUrl:`${IMGSERVICE}/pin/pin.jpg`,
      path: `/pages/assemble/pin_detail/pin_detail?prize_id=${options.prize_id}`,
    }
  },
  //页面初始化
  initData(options) {
    const userInfo = wx.getStorageSync('userInfo');

    alert.loading({
      str: '加载中'
    })

    this.setData({
      dotIndex: 0,
      pinDetail: {},
    })
    Promise.all([
      request_01.pinGoodsDetail({
        user_id: userInfo.user_id,
        prize_id: options.prize_id,
      }),
    ])
      .then((value) => {
        //success
        const pinDetail = value[0].data.data;
        let timmerGroup = this.data.timmerGroup;

        //清除定时器
        this.clearInterval(timmerGroup)

        //正在拼团
        timmerGroup = pinDetail.group_buy_list;

        //倒计时
        timmerGroup.forEach((item, index, arr) => {
          item.timmer = setInterval(() => {

            if (item.count_down <= 0) {
              item.count_down = 0;
              clearInterval(item.timmer)
            } else {
              item.count_down = item.count_down - 1;
            }

            item.dhms = util.minutesAndSeconds(item.count_down, ':');


            this.setData({
              timmerGroup,
            })
          }, 1000)

          item.dhms = util.minutesAndSeconds(item.count_down, ':');

        })

        WxParse.wxParse('product_explain', 'html', pinDetail.intro, this);

        this.setData({
          pinDetail,
          timmerGroup,
        })

      })
      .catch((reason) => {
        //fail
      })
      .then(() => {
        //complete
        alert.loading_h()
        this.setData({
          options,
        })
      })
  },
  //判断是否授权和是否是车主
  isVehicleOwner(e) {
    if (!e) return;
    const type = e.target.dataset.type;
    const btn = e.target.dataset.btn;
    const index = e.target.dataset.index;
    const pinDetail = this.data.pinDetail;
    const goods_car_owner = btn == 'join' ? pinDetail.group_buy_list[index].goods_car_owner : pinDetail.goods_car_owner;
    

    //用户已授权，用户是车主。
    //事件源对象不符合条件的按钮。
    //用户已授权，活动不是车主活动，商品不是车主商品。

    if (
      (wx.getStorageSync("userInfo").unionid && wx.getStorageSync("userInfo").nickName && wx.getStorageSync("userInfo").user_type == 1) 
      || (type != 'ok') 
      || (wx.getStorageSync("userInfo").unionid && wx.getStorageSync("userInfo").nickName && !pinDetail.car_owner && !goods_car_owner)
    ) return;


    if (
      !wx.getStorageSync("userInfo").unionid
      || !wx.getStorageSync("userInfo").nickName
    ) {
      this.setData({ popType: 2 })
    }
    else if (wx.getStorageSync("userInfo").user_type == 0) {
     
      //该活动、该商品仅限于车主
      pinDetail.car_owner == 1 ? this.setData({ popType: 3 }) : this.setData({ popType: 4 });
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
  //清除定时器
  clearInterval(timmerGroup) {
    timmerGroup.forEach((item) => {
      clearInterval(item.timmer)
    })
  },
  //banner轮播切换事件
  dotchange(e) {
    this.setData({
      dotIndex: e.detail.current
    })
  },
  //查看更多
  lookMore() {
    const moreShow = this.data.moreShow;


    if (moreShow) {//收起
      this.setData({
        moreShow: false,
        moreText: '查看更多',
      })
    }
    else {//=>展示
      this.setData({
        moreShow: true,
        moreText: '收起更多',
      })
    }
  },
  //立即参与
  joinBtn(e) {
    const index = e.currentTarget.dataset.index;
    const pinDetail = this.data.pinDetail;
    const groupbuy_id = pinDetail.group_buy_list[index].groupbuy_id;
    const goods_car_owner = pinDetail.group_buy_list[index].goods_car_owner;
    const userInfo = wx.getStorageSync("userInfo");

    //用户不是车主，活动是车主活动。
    //用户不是车主，商品是车主商品。
    //用户未授权。
    if (
      (wx.getStorageSync("userInfo").user_type == 0 && pinDetail.car_owner) 
      || (wx.getStorageSync("userInfo").user_type == 0 && goods_car_owner) 
      || !wx.getStorageSync("userInfo").unionid
      || !wx.getStorageSync("userInfo").nickName
    ) return;

    if (pinDetail.is_join == 1) return alert.alert({
      str: '您已参与'
    })

    Object.assign(pinDetail, {
      groupbuy_id,
      __number: 1,
      vcoin:pinDetail.vcoin,
    })

    app.globalData.pinDetail = pinDetail;//将拼团商品详情存于全局

    router.jump_nav({
      url: `/pages/assemble/pin_capital/pin_capital?pageType=lijicantuan`,
    })



  },
  //发起拼团
  launchPin(e) {
    const pinDetail = this.data.pinDetail;
    const options = this.data.options;
    const userInfo = wx.getStorageSync("userInfo");
    
    //用户不是车主，活动是车主活动。
    //用户不是车主，商品是车主商品。
    //用户未授权。
    if (
      (wx.getStorageSync("userInfo").user_type == 0 && pinDetail.car_owner) 
      || (wx.getStorageSync("userInfo").user_type == 0 && pinDetail.goods_car_owner) 
      || !wx.getStorageSync("userInfo").unionid
      || !wx.getStorageSync("userInfo").nickName
    ) return;


    if (pinDetail.is_join == 1) return alert.alert({
      str: '您已参与'
    })

    Object.assign(pinDetail, {
      prize_id: options.prize_id,
      __number: 1,
    })

    app.globalData.pinDetail = pinDetail;//将拼团商品详情存于全局


    router.jump_nav({
      url: `/pages/assemble/pin_capital/pin_capital?pageType=faqipintuan`,
    })
  },
})