// pages/assemble/o_pin/o_pin.js

const request_01 = require('../../../utils/request/request_01.js');

const util = require('../../../utils/public/util.js');

const method = require('../../../utils/tool/method.js');

const router = require('../../../utils/tool/router.js');

const authorization = require('../../../utils/tool/authorization.js');

const alert = require('../../../utils/tool/alert.js');

const app = getApp(); //获取应用实例

Page({

  /**
   * 页面的初始数据
   */
  data: {
    IMGSERVICE: app.globalData.IMGSERVICE,
    options: {},
    firstShow: false,
    show: false,
    pinInfo: {},
    timmerGroup: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
    const userInfo = wx.getStorageSync('userInfo');
    const IMGSERVICE = this.data.IMGSERVICE;

    return {
      title:'组团领好礼，有福一起享！',
      imageUrl:`${IMGSERVICE}/pin/pin.jpg`,
      path: `/pages/assemble/o_pin/o_pin?groupbuy_id=${options.groupbuy_id}&user_id=${userInfo.user_id}`,
    };
  },
  //页面初始化
  initData(options) {
    const userInfo = wx.getStorageSync('userInfo');
    const user_id = options.user_id;
    const timmerGroup = this.data.timmerGroup;

    clearInterval(timmerGroup.timmer)

    alert.loading({
      str: '加载中'
    })
    Promise.all([
      request_01.pinDetail({
        user_id: userInfo.user_id,
        groupbuy_id: options.groupbuy_id,
      }),
    ])
      .then((value) => {
        //success
        const pinInfo = value[0].data.data;
        const timmerGroup = {
          count_down: pinInfo.count_down,
          status: pinInfo.status,
        };

        if (timmerGroup.status == 0) {//'拼团中才显示倒计时';


          timmerGroup.dhms = util.minutesAndSeconds(timmerGroup.count_down, ':');

          timmerGroup.timmer = setInterval(() => {

            if (timmerGroup.count_down <= 0) {
              timmerGroup.count_down = 0;
              clearInterval(timmerGroup.timmer)
            } else {
              timmerGroup.count_down = timmerGroup.count_down - 1;
            }

            timmerGroup.dhms = util.minutesAndSeconds(timmerGroup.count_down, ':');

            this.setData({
              timmerGroup,
            })

          }, 1000)

        }


        if (user_id == userInfo.user_id) {//自己进入
          pinInfo.isMe = true;
        }
        else {//别人进入
          pinInfo.isMe = false;
        }

        this.setData({
          pinInfo,
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
          show: true,
        })
      })
  },
  //判断是否授权和是否是车主
  isVehicleOwner(e) {
    const pinInfo = this.data.pinInfo;
    if ((wx.getStorageSync("userInfo").nickName && wx.getStorageSync("userInfo").user_type == 1) || (e && e.target.dataset.type != 'ok') || (wx.getStorageSync("userInfo").nickName && !pinInfo.car_owner)) return;
    if (!wx.getStorageSync("userInfo").nickName) {
      this.setData({ popType: 2 })
    } else if (wx.getStorageSync("userInfo").user_type == 0) {
      this.setData({ popType: 3 })
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
    this.setData({ isVehicleOwnerHidePop: !this.data.isVehicleOwnerHidePop })
  },
  //拼团商品详情
  jumpDetail(e) {
    const index = e.currentTarget.dataset.index;
    const pinInfo = this.data.pinInfo;
    const prize_id = pinInfo.other_group_buy[index].prize_id;

    router.jump_nav({
      url: `/pages/assemble/pin_detail/pin_detail?prize_id=${prize_id}`,
    })
  },
  //立即参与
  joinBtn(e) {
    const options = this.data.options;
    const pinInfo = this.data.pinInfo;

    let newPinfo = {};

    const userInfo = wx.getStorageSync("userInfo");
    //是否车主
    if ((wx.getStorageSync("userInfo").user_type == 0 && pinInfo.car_owner) || !wx.getStorageSync("userInfo").nickName) return;

    if (pinInfo.is_join == 1) return alert.alert({
      str: '您正在参与拼团中'
    })
    Object.assign(newPinfo, {
      title: pinInfo.title, // 标题
      type: pinInfo.type, // 商品类型 1-微信卡券 2-快递 3-虚拟卡券
      real_vcoin: pinInfo.vcoin, // 拼团价
      thumb: pinInfo.thumb,// 产品图片
      groupbuy_id: options.groupbuy_id,//拼团id
      __number: 1,//拼团商品数量
      vcoin:pinInfo.price//原价
    })

    app.globalData.pinDetail = newPinfo;//将拼团商品详情存于全局

    router.jump_nav({
      url: `/pages/assemble/pin_capital/pin_capital?pageType=lijicantuan`,
    })
  },
  //领取奖品
  getPrize() {
    const options = this.data.options;
    const userInfo = wx.getStorageSync('userInfo');
    const pinInfo = this.data.pinInfo;
    const order_id = pinInfo.my_groupbuy_info.order_id;
    if (order_id) {
      //无order_id
      router.jump_nav({
        url: `/pages/order_detail/order_detail?order_id=${order_id}`,
      })
    }
    else {
      //无order_id
      request_01.getOrderId({
        user_id: userInfo.user_id,
        groupbuy_id: options.groupbuy_id,
      })
        .then((value) => {
          //success
          const msg = value.data.msg;
          const status = value.data.status;
          const data = value.data.data;

          if (status == 1) {//获取order_id
            router.jump_nav({
              url: `/pages/order_detail/order_detail?order_id=${data.order_id}`,
            })
          }
          else {//获取失败
            alert.alert({
              str: msg,
            })
          }
        })
        .catch((reason) => {
          //fail
          alert.alert({
            str: JSON.stringify(reason)
          })
        })
    }
  },
  //查看更多活动
  moreActivity() {
    router.jump_nav({
      url: '/pages/activity_list/activity_list'
    })
  },
  //立即参与他人拼团列表中的拼团
  joinOtherBtn(e) {
    const index = e.currentTarget.dataset.index;
    const pinInfo = this.data.pinInfo;
    const item = pinInfo.other_group_buy[index];
    let newPinfo = {};
    const userInfo = wx.getStorageSync("userInfo");
    //是否车主
    if ((wx.getStorageSync("userInfo").user_type == 0 && pinInfo.car_owner) || !wx.getStorageSync("userInfo").nickName) return;

    Object.assign(newPinfo, {
      title: item.title, // 标题
      type: item.type, // 商品类型 1-微信卡券 2-快递 3-虚拟卡券
      real_vcoin: item.real_vcoin, // 拼团价
      vcoin:item.vcoin,// 原价
      thumb: item.thumb,// 产品图片
      groupbuy_id: item.groupbuy_id,//拼团id
      __number: 1,//拼团商品数量
    })

    app.globalData.pinDetail = newPinfo;//将拼团商品详情存于全局

    router.jump_nav({
      url: `/pages/assemble/pin_capital/pin_capital?pageType=lijicantuan`,
    })
  },
})