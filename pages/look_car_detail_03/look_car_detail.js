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

let scrollTimmer = null;
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
    swiper4: 0, //控制第1个swiper
    swiper5: 0, //控制第2个swiper
    isShowForm: false,
    formsType: 2,
    vehicle: {},
    rulspop: false,
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
    ],
    imgList: [false, false],
	id:null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
	  this.setData({ id: options.id });
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

  // 规则
  openRule() {
    this.setData({
      rulspop: !this.data.rulspop
    })
  },

  swiperchange(e) {
    let type = e.currentTarget.dataset.type;
    this.setData({

      swiper4: type == 4 ? e.detail.current : this.data.swiper4,
      swiper5: type == 5 ? e.detail.current : this.data.swiper5

    })
    // console.log(this.data.swiper2);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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
   * 页面滚动事件
   */
  onPageScroll: function (options) {
    clearTimeout(scrollTimmer)

    scrollTimmer = setTimeout(() => {
      const scrollTop = options.scrollTop;
      const domAnimatedList = this.data.domAnimatedList;
      const windowHeight = wx.getSystemInfoSync().windowHeight;


      domAnimatedList.forEach((val, key) => {
        const local = val.local;
        const height = val.height;
        /**
         * 从下往上出现，从上往下出现
         */

        val.amt = (scrollTop + windowHeight) >= local && scrollTop <= (local + height);
        this.setData({
          domAnimatedList,

        })
      })



    }, 1000 / 30)
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    let activity_id = this.data.activity_id;
    let id = this.data.id;
    let txt = '';
	let imageUrl = '';
	  switch (id) {
		  case '11':
			  txt = '启辰星，A+级SUV头等舱，“混元”美学的秘密，等你来探索！';
			  imageUrl = `${this.data.IMGSERVICE}/gaiban/`
			  break;
		  case '6':
			  txt = '启辰T60，高品质智趣SUV，星级品质，焕新登场！';
			  imageUrl = `${this.data.IMGSERVICE}/gaiban/share_T60.png`
			  break;
		  case '3':
			  txt = '启辰D60，高品质智联家轿，智联生活，即刻开启！';
			  imageUrl = `${this.data.IMGSERVICE}/gaiban/share_D60.png`
			  break;
		  case '9':
			  txt = '全新启辰T90，高品质跨界SUV，跨有界，悦无限！';
			  imageUrl = `${this.data.IMGSERVICE}/gaiban/share_T90.png`
			  break;
		  case '7':
			  txt = '启辰T70，高品质智联SUV，品质来袭！';
			  imageUrl = `${this.data.IMGSERVICE}/gaiban/share_T70.png`
			  break;
		  case '5':
			  txt = '启辰D60EV，长续航合资纯电家轿，智无忧，趣更远！';
			  imageUrl = `${this.data.IMGSERVICE}/gaiban/share_D60EV.png`
			  break;
		  case '10':
			  txt = '启辰e30，我的第一台纯电精品车，智在灵活，趣动精彩！';
			  imageUrl = `${this.data.IMGSERVICE}/gaiban/share_E30.png`
			  break;
		  case '13':
			  txt = '启辰T60EV，智领合资纯电SUV，智无忧，趣更远！';
			  imageUrl = `${this.data.IMGSERVICE}/gaiban/share_T60EV.png`
			  break;
	  }
	  return {
		  title: `${txt}`,
		  path: `/pages/look_car_detail_03/look_car_detail?id=${this.data.id}`,
		  imageUrl: imageUrl
	  }
  },
  //页面初始化
  initData(options) {
    console.log(options)
    let id = '';
    if (options.scene) {
      let scene = decodeURIComponent(options.scene);
      console.log(scene)
      scene.split('&').forEach((item) => {
        if (item.split('=')[0] == 'id') { //找到id
          id = item.split('=')[1]
        }
      })
    } else {
      id = options.id;
    }
    console.log(id, 'id')

    this.getPayInfo(options)
    tool.loading({
      str: '加载中'
    })

    Promise.all([
      request_01.lookCarDetail({
        user_id: wx.getStorageSync('userInfo').user_id,
        id: id,
      })
    ])
      .then((value) => {
        //success
        const lookCarDetail = value[0].data.data;

        lookCarDetail.t80_show == 2 && alert.loading_h()

        this.setData({
          lookCarDetail,
          userInfo: wx.getStorageSync('userInfo'),
          id: options.id
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
  getPayInfo(options) {
    let activity_id = '';
    if (options.scene) {
      let scene = decodeURIComponent(options.scene);
      console.log(scene)
      scene.split('&').forEach((item) => {
        if (item.split('=')[0] == 'a') { //找到activity_id
          activity_id = item.split('=')[1]
        }
      })
    } else {
      activity_id = wx.getStorageSync('activity_id');
    }
    let openid = wx.getStorageSync('userInfo').openid
    request_05.ninepayInfo({
      openid,
      activity_id
    }).then(res => {
      if (res.data.status == 1) {
        this.setData({
          payInfoData: res.data.data,
          activity_id,
          options,
        })
        if (res.data.data.card_info.length > 0) {
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
            router.jump_red({
              url: `/pages/payment/pay_index/pay_index?activity_id=${activity_id}`
            })
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
  downPayment(e) {
    let options = this.data.options
    let onlyOne = e.currentTarget.dataset.open
    var _this = this
    // order_sn判断订单号是否为空字符串  不为空则为以留资
    let openid = wx.getStorageSync('userInfo').openid
    let show_page = this.data.payInfoData.show_page
    let activity_id = wx.getStorageSync('activity_id')
    console.log(show_page, 'show_page')
    switch (show_page) {
      case 3:
        if (onlyOne) {
          tool.alert('您已经留过资了哦~')
          return
        } else {
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
                    _this.getPayInfo(options)
                  }, 2500)
                },
                fail(res) {
                  _this.getPayInfo(options);
                  console.log('支付失败')
                }
              })
            } else {
              tool.alert(res.data.msg)
            }
          })
          break;
        }
      case 2:
        const lookCarDetail = this.data.lookCarDetail;
        // 判断是留资icon按钮点击  还是下订点击
        if (onlyOne) {
          this.setData({
            onlyOne,
          })
        } else {
          this.setData({
            onlyOne: false,
          })
        }
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

  // 去首页
  toIndex() {
    router.jump_red({
      url: `/pages/index/index`,
    })
  },

  //提交
  submit(e) {
    let openPay = this.data.onlyOne
    let options = this.data.options
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
        if (!openPay) {
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
                    _this.getPayInfo(options);
                  }, 2500)
                },
                fail(res) {
                  _this.getPayInfo(options);
                  console.log('支付失败')
                }
              })
            } else {
              tool.alert(res.data.msg)
            }
          })
        } else {
          _this.isShowForm()
          tool.alert('留资成功')
          setTimeout(() => {
            _this.initData(options)
          }, 500)
        }
      } else {
        tool.alert(res.data.msg)
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
    let swiper4 = this.data.swiper4
    let swiper5 = this.data.swiper5
    const btn = e.currentTarget.dataset.btn;
    if (btn == 'prev1') {
      if (swiper4 > 0) {
        swiper4--
        this.setData({
          swiper4
        })
      } else {
        this.setData({
          swiper4: 6
        })
      }
    } else if (btn == 'next1') {
      if (swiper4 < 6) {
        ++swiper4
        this.setData({
          swiper4
        })
      } else {
        this.setData({
          swiper4: 0
        })
      }
    } else if (btn == 'prev2') {
      if (swiper5 > 0) {
        swiper5--
        this.setData({
          swiper5
        })
      } else {
        this.setData({
          swiper5: 4
        })
      }
    } else if (btn == 'next2') {
      if (swiper5 < 4) {
        ++swiper5
        this.setData({
          swiper5
        })
      } else {
        this.setData({
          swiper5: 0
        })
      }
    }
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