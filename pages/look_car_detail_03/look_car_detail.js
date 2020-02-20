// pages/look_car_detail_03/look_car_detail.js
const request_01 = require('../../utils/request/request_01.js');

const request_05 = require('../../utils/request/request_05.js');

const router = require('../../utils/tool/router.js');

const alert = require('../../utils/tool/alert.js');
const tool = require('../../utils/tool/tool.js');

const app = getApp(); //获取应用实例

let dingshi;

let swiper1Timmer = null;
let swiper2Timmer = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    IMGSERVICE: app.globalData.IMGSERVICE,
    options: {},
    lookCarDetail: {},
    dotIndex1: '0',
    dotIndex2: '0',
    swiper1: true,
    swiper2: true,
    isShowForm: false,
    formsType: 2,
    vehicle: {},
    isHaveCard: false, // 是否有卡券信息
    domAnimatedList: [{
        local: 0,
        height: 0,
        amt: true,
      },
      {
        local: 0,
        height: 0,
        amt: true,
      },
      {
        local: 0,
        height: 0,
        amt: true,
      },
      {
        local: 0,
        height: 0,
        amt: false,
      },
      {
        local: 0,
        height: 0,
        amt: false,
      },
    ],
    imgList: [false],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    request_01.login(() => {

      //数据初始化
      options.scene && decodeURIComponent(options.scene).split('&').forEach((item) => {
        const val = item.split('=');

        Object.assign(options, {
          [val[0]]: val[1],
        })
      })

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

  },
  /**
   * 页面滚动事件
   */
  onPageScroll: function(options) {
    const scrollTop = options.scrollTop;
    const domAnimatedList = this.data.domAnimatedList;
    const windowHeight = wx.getSystemInfoSync().windowHeight;

    domAnimatedList.forEach((val, key) => {
      const local = val.local;
      const height = val.height;

      val.amt = (scrollTop + windowHeight) >= local && scrollTop <= (local + height);

    })
    this.setData({
      domAnimatedList,
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    const lookCarDetail = this.data.lookCarDetail;
    const IMGSERVICE = this.data.IMGSERVICE;
    const options = this.data.options;
    return {
      title: `启辰星亮相发布，快来预约关注！`,
      imageUrl: `${IMGSERVICE}/spike/t80_share.jpg`,
      path: `/pages/look_car_detail_03/look_car_detail?id=${options.id}`
    }
  },
  //页面初始化
  initData(options) {
    this.getPayInfo()

    tool.loading({
      str: '加载中'
    })

    Promise.all([
        request_01.lookCarDetail({
          user_id: wx.getStorageSync('userInfo').user_id,
          id: options.id,
        })
      ])
      .then((value) => {
        //success
        const lookCarDetail = value[0].data.data;

        lookCarDetail.t80_show == 2 && alert.loading_h()

        this.setData({
          lookCarDetail,
          userInfo: wx.getStorageSync('userInfo'),
        })

        wx.setNavigationBarTitle({
          title: lookCarDetail.car_name
        })
      })
      .catch((reason) => {
        //fail
        alert.loading_h()
      })
      .then(() => {
        //complete


        this.setData({
          options,
        })
      })
  },
  //图片加载完毕、图片加载失败
  imgLoad(e) {
    const index = e.currentTarget.dataset.index;
    const imgList = this.data.imgList;
    imgList[index] = true;

    const result = imgList.every((val) => {
      return val;
    })

    if (result) {
      alert.loading_h()
      //获取dom的位置
      this.getDomLocal()
    }

  },
  //获取dom位置
  getDomLocal() {
    const domAnimatedList = this.data.domAnimatedList;
    const query = wx.createSelectorQuery();
    query.selectAll('.dom-local').boundingClientRect((rects) => {
      // rect.id      // 节点的ID
      // rect.dataset // 节点的dataset
      // rect.left    // 节点的左边界坐标
      // rect.right   // 节点的右边界坐标
      // rect.top     // 节点的上边界坐标
      // rect.bottom  // 节点的下边界坐标
      // rect.width   // 节点的宽度
      // rect.height  // 节点的高度
      rects.forEach((rect, index) => {
        domAnimatedList[index].local = rect.top;
        domAnimatedList[index].height = rect.height;
      })


      this.setData({
        domAnimatedList,
      })
    }).exec()
  },

  //获取99元下定首页数据的
  getPayInfo() {
    let openid = wx.getStorageSync('userInfo').openid
    let activity_id = wx.getStorageSync('activity_id')
    request_05.ninepayInfo({
      openid,
      activity_id
    }).then(res => {
      if (res.data.status == 1) {
        console.log(res.data.data, 'data')
        this.setData({
          payInfoData: res.data.data
        })
        if (res.data.data.card_info.length > 0) {
          console.log('有')
          this.cardFun()
        }
      } else {
        alert.alert(res.data.msg)
      }
    })
  },

  // 去下定活动首页
  toPayIndex() {
    let activity_id = wx.getStorageSync('activity_id')
    router.jump_red({
      url: `/pages/payment/pay_index/pay_index?activity_id=${activity_id}`
    })
  },

  // 添加卡券核销
  cardFun() {
    clearInterval(dingshi)
    tool.loading({
      str: '加载中'
    })
    let card_info = this.data.payInfoData.card_info;
    let openid = wx.getStorageSync('userInfo').openid
    let activity_id = wx.getStorageSync('activity_id')
    wx.addCard({
      cardList: [{
        cardId: card_info[0].cardId,
        cardExt: card_info[0].cardExt
      }],
      success(res) {
        tool.loading_h()
        console.log(res.cardList) // 卡券添加结果 
        wx.showToast({
          title: '领取成功',
          icon: 'success',
          duration: 2000
        })
        let card_code = res.cardList[0].code
        request_05.payReceiveCard({
          activity_id,
          openid,
          card_code
        }).then(res => {
          if (res.data.status == 1) {
            setTimeout(() => {
              router.jump_red({
                url: `/pages/payment/pay_index/pay_index?activity_id=${activity_id}`
              })
            }, 1000)
          }
        })
      },
      fail() {
        tool.loading_h()
      }
    })
  },

  //赢好礼
  giftBtn() {
    router.jump_nav({
      url: `/pages/qicheng_h5/qicheng_h5`,
    })
  },
  //更多精彩
  moreBtn() {
    router.jump_red({
      url: '/pages/index/index'
    })
  },
  //立即下定
  downPayment() {
    var _this = this
    // order_sn判断订单号是否为空字符串  不为空则为以留资
    let openid = wx.getStorageSync('userInfo').openid
    let show_page = this.data.payInfoData.show_page
    let activity_id = wx.getStorageSync('activity_id')
    console.log(show_page, 'show_page')
    switch (show_page) {
      case 3:
        request_05.getPayParam({
          openid,
          activity_id
        }).then(res => {
          console.log(res, 'res')
          if (res.data.status == 1) {
            wx.requestPayment({
              timeStamp: res.data.data.timeStamp,
              nonceStr: res.data.data.nonceStr,
              package: res.data.data.package,
              signType: 'MD5',
              paySign: res.data.data.paySign,
              success(res) {
                _this.isShowForm()
                wx.showToast({
                  title: '支付成功',
                  icon: 'success',
                  duration: 2000
                })
                setTimeout(() => {
                  _this.getPayInfo()
                }, 2500)
              },
              fail(res) {
                console.log('支付失败')
              }
            })
          }
        })
        break;
      case 2:
        const lookCarDetail = this.data.lookCarDetail;
        this.setData({
          vehicle: {
            img: lookCarDetail.car_img,
            title: lookCarDetail.car_name,
            price: lookCarDetail.car_prize,
          },
          isShowForm: true,
        })
        break;
    }
  },
  //留资弹窗打开、关闭
  isShowForm() {
    this.setData({
      isShowForm: false,
    })
  },
  //提交
  submit(e) {
    var _this = this
    const activity_id = wx.getStorageSync('activity_id')
    const openid = wx.getStorageSync('userInfo').openid
    const detail = e.detail;
    let area = detail.region[0] + ' ' + detail.region[1] + ' ' + detail.region[2];
    const userInfo = wx.getStorageSync('userInfo');
    const lookCarDetail = this.data.lookCarDetail;
    request_05.ninepaySetData({
        openid: userInfo.openid, //openidID
        activity_id: activity_id, //activity_id
        name: detail.name, //留资姓名
        mobile: detail.phone, //留资电话
        // v_code: detail.code || '',//短信验证码
        code: detail.storeCode, //专营店编码
        area: area,
        car_type: '', //车型 可不填
      }).then((res) => {
        //success
        console.log(res.data.status, '留资状态')
        if (res.data.status == 1) {
          console.log('调取支付')
          request_05.getPayParam({
            activity_id,
            openid
          }).then(res => {
            if (res.data.status == 1) {
              wx.requestPayment({
                timeStamp: res.data.data.timeStamp,
                nonceStr: res.data.data.nonceStr,
                package: res.data.data.package,
                signType: 'MD5',
                paySign: res.data.data.paySign,
                success(res) {
                  _this.isShowForm()
                  wx.showToast({
                    title: '支付成功',
                    icon: 'success',
                    duration: 2000
                  })
                  setTimeout(() => {
                    _this.getPayInfo();
                  }, 2500)
                },
                fail(res) {
                  console.log('支付失败')
                }
              })
            } else {
              alert.alert(res.data.msg)
            }
          })
        }

        // const status = value.data.status;
        // const msg = value.data.msg;
        // if (status == 1) {
        //   alert.loading_h()
        //   // mta.Event.stat("booking_car_other", { name: detail.name, phone: detail.phone, city: detail.region.join('--') })
        //   { userinfo: `${detail.name} ${detail.phone} ${detail.region.join('--')}` }
        //   alert.confirm({ title: "预约成功", content: `您已成功预约「${this.data.vehicle.title}」的试驾，稍后将有工作人员联系您，请保持电话畅通。`, confirms: "好的,#0C5AC0", cancels: false }).then(res => {
        //     this.setData({
        //       isShowForm: false,
        //     })
        //   })
        // } else {
        //   alert.alert({
        //     str: msg,
        //   })
        // }
      })
      .catch(() => {
        //fail
        alert.loading_h()

      })
      .then(() => {
        //complete

      })
  },
  //banner轮播切换事件
  dotchange1(e) {
    this.setData({
      dotIndex1: e.detail.current
    })
  },
  dotchange2(e) {
    this.setData({
      dotIndex2: e.detail.current
    })
  },
  //轮播图上下切换
  switchBtn(e) {
    const btn = e.currentTarget.dataset.btn;
    const indexType = e.currentTarget.dataset.indextype;
    let dotIndex = this.data[indexType];
    const swiperType = e.currentTarget.dataset.swipertype;
    let num;

    num = swiperType == 'swiper1' ? 3 : 4;

    // clearTimeout(swiper1Timmer)
    // clearTimeout(swiper2Timmer)

    // swiperType == 'swiper1' ? swiper1Timmer = setTimeout(()=>{
    //   this.setData({
    //     swiper1:true,
    //   })
    //   clearTimeout(swiper1Timmer)
    // }, 1000) : '';

    // swiperType == 'swiper2' ? swiper2Timmer = setTimeout(()=>{
    //   this.setData({
    //     swiper2:true,
    //   })
    //   clearTimeout(swiper2Timmer)
    // }, 1000) : '';


    btn == 'next' ? dotIndex = Math.abs(++dotIndex % num) : '';
    btn == 'prev' ? dotIndex = Math.abs(--dotIndex % num) : '';

    this.setData({
      [indexType]: String(dotIndex),
      // [swiperType]:false,
    })
  },
  //授权
  getUserInfo(e) {
    request_01.setUserInfo(e)
      .then((res) => {

        this.setData({
          userInfo: wx.getStorageSync("userInfo")
        })
        this.giftBtn()

      })
      .catch((err) => {
        alert.alert({
          str: typeof err == 'object' ? JSON.stringify(err) : err
        })
      })
  },
})