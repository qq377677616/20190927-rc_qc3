// pages/spike_index/spike_index.js
const request_01 = require('../../utils/request/request_01.js');

const request_05 = require('../../utils/request/request_05.js');

const alert = require('../../utils/tool/alert.js');

const router = require('../../utils/tool/router.js');

const app = getApp(); //获取应用实例

import tool from '../../utils/tool/tool.js';
import api from '../../utils/request/request_03.js'

let timmer = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    IMGSERVICE: app.globalData.IMGSERVICE,
    page404: false,
    ready: false,
    options: {},
    btnText: '领取',
    formsType_04: 4,
    formsType_01: 1,
    vehicle: {},
    appoFormsVisible: false,
    KJFormsVisible: false,
    KDFormsVisible: false,
    backfillKJFormsVisible: false,
    backfillKDFormsVisible: false,
    ruleVisible: false,
    spikeResultVisible: false,
    autoDate: true,
    autoTime: true,
    dateIndex: 0,
    timeIndex: 0,
    spikeIndex: {},
    timeList: [],
    spikeGoodsList: [],
    countDown: [
      '00',
      '00',
      '00',
      '00',
    ],
    timeStamp: 'over',
    isCodeShow: false,
    code: '',
    isShowLoading: false,
    loadingText: '卡券领取中',
    is_DY: 0, //是否接受订阅消息
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options);
    request_01.login(() => {
      this.initData(options)
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.setData({
      ready: true,
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    const ready = this.data.ready;
    const options = this.data.options;

    if (ready) {
      this.initData(options)
    }
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
    const options = this.data.options;
    const IMGSERVICE = this.data.IMGSERVICE;
    return {
      title: 'iphone11、小米家电……好礼等你来抢！',
      imageUrl: `${IMGSERVICE}/spike/spike_share_s1.jpg?100`,
      path: `/pages/spike_index/spike_index?activity_id=${options.activity_id}`,
    };
  },
  //重新加载
  reload() {
    const options = this.data.options;

    //关闭404页面
    this.setData({
      autoDate: true,
      autoTime: true,
      page404: false,
    })

    this.initData(options);
  },
  //页面数据初始化
  initData(options) {

    alert.loading({
      str: '加载中'
    })
    const userInfo = wx.getStorageSync('userInfo');
    Promise.all([
        request_01.spikeIndex({
          openid: userInfo.openid,
          activity_id: options.activity_id,
        })
      ])
      .then((value) => {
        if (value[0].data.data.mobile == "") {
          this.setData({
            isGetPhone: true
          })
        }else{
          this.setData({
            isGetPhone: false
          })
        }
        this.setData({
          goods2_buy: value[0].data.data.goods2_buy
        })
        const spikeIndex = value[0].data.data;
        let autoDate = this.data.autoDate;
        let dateIndex;
        const spikeResultVisible = (spikeIndex.activity_info.status == 2 || spikeIndex.activity_info.status == 3) ? 'notOpen' : this.data.spikeResultVisible;

        if (autoDate) {
          const date = new Date;
          const fullYear = date.getFullYear();
          const month = date.getMonth() + 1;
          const ri = date.getDate();
          spikeIndex.date_list.some((val, index) => {
            if (val.date_id == `${fullYear}-${month}-${ri}`) {
              dateIndex = index;
              return true;
            } else {
              return false;
            }
          }) ? '' : dateIndex = 0;
        } else {
          dateIndex = this.data.dateIndex;
        }

        //保存options参数、活动未开始、已结束状态、秒杀首页数据
        this.setData({
          dateIndex,
          options,
          spikeResultVisible,
          spikeIndex,
        })


        //请求时间段列表
        return request_01.spikeTimeList({
          date: spikeIndex.date_list[dateIndex] ? spikeIndex.date_list[dateIndex].date_id : '',
          activity_id: options.activity_id,
        })

      })
      .then((value) => {
        const userInfo = wx.getStorageSync('userInfo');
        const options = this.data.options;
        const spikeIndex = this.data.spikeIndex;

        const dateIndex = this.data.dateIndex;
        const date_list_item = spikeIndex.date_list[dateIndex] || {};

        const timeList = value.data.data;
        let timeIndex = this.data.timeIndex;
        let autoTime = this.data.autoTime;
        if (autoTime) {

          timeList.some((val, index) => {
            if (val.status == 1) {
              timeIndex = index;
              return true;
            } else {
              return false;
            }
          }) ? '' : timeIndex = 0;
        } else {
          timeIndex = this.data.timeIndex;
        }

        const time_list_item = timeList[timeIndex] || {};

        const time_id = time_list_item.time_id;
        const getTime = new Date().getTime();
        const timeStamp = time_list_item.countdown ? (time_list_item.countdown * 1000 + getTime) : time_list_item.countdown == 0 ? 'over' : 'notStarted'; //保存对应时间段给的时间戳到全局




        //保存倒计时时间戳、时间列表
        this.setData({
          timeIndex,
          timeStamp,
          timeList,
        })


        //请求商品列表
        return request_01.spikeGoodsList({
          openid: userInfo.openid,
          time_id, //时间段ID
          activity_id: options.activity_id,
          date: date_list_item.date_id, //日期id
        })
      })
      .then((value) => {
        const spikeGoodsList = value.data.data;


        //保存商品列表
        this.setData({
          spikeGoodsList,
        })

        //根据对应时间段给的时间戳进行倒计时
        this.countDown()
      })
      .catch((reason) => {
        //开启404页面
        console.warn(`spike：${reason}`)
        this.setData({
          page404: true,
          options,
        })
      })
      .then(() => {
        alert.loading_h()
      })
  },
  //倒计时
  countDown() {
    const timeStamp = this.data.timeStamp;

    clearTimeout(timmer)
    //timeStamp不为notStarted才能开启倒计时
    timmer = timeStamp > 0 && setTimeout(() => {

      this.computedTime()

    }, 500)

  },
  //计算时间
  computedTime() {
    //现在的时间戳
    let date = +new Date();

    const timeStamp = this.data.timeStamp;

    //总秒数
    const totalSeconds = (timeStamp - date) / 1000;

    //清除
    if (totalSeconds <= 0) return this.clearTimeout()

    //天数
    const days = Math.floor(totalSeconds / (24 * 60 * 60))

    //取余
    let modulo = totalSeconds % (24 * 60 * 60)

    //小时
    const hours = Math.floor(modulo / (60 * 60))

    //取余
    modulo = modulo % (60 * 60)

    //分钟
    const minutes = Math.floor(modulo / 60)

    //秒数
    const seconds = Math.floor(modulo % 60)

    this.setData({
      countDown: [
        days < 10 ? '0' + days : days,
        hours < 10 ? '0' + hours : hours,
        minutes < 10 ? '0' + minutes : minutes,
        seconds < 10 ? '0' + seconds : seconds,
      ]
    })

    //继续倒计时
    this.countDown()
  },
  //清除定时器
  clearTimeout() {
    const options = this.data.options;
    //初始化时间
    this.setData({
      countDown: ['00', '00', '00', '00'], //初始化时间
      timeStamp: 'over', //倒计时结束
    })
    //init
    this.initData(options)
    //清除定时器
    clearTimeout(timmer)
  },
  //切换日期
  dateBtn(e) {
    const index = e.currentTarget.dataset.index;
    const dateIndex = this.data.dateIndex;

    if (dateIndex == index) return;

    this.setData({
      autoDate: false,
      autoTime: true,
      dateIndex: index,
    })

    //init
    this.clearTimeout()
  },
  //切换时刻
  timeBtn(e) {
    const index = e.currentTarget.dataset.index;
    const timeIndex = this.data.timeIndex;

    if (timeIndex == index) return;

    this.setData({
      autoTime: false,
      timeIndex: index,
    })

    //init
    this.clearTimeout()
  },
  //时间段列表
  // spikeTimeList(){
  //   const spikeIndex = this.data.spikeIndex;
  //   const dateIndex = this.data.dateIndex;
  //   request_01.spikeGoodsList({
  //     date:spikeIndex.date_list[dateIndex].date_id,
  //   })
  //   .then((value)=>{
  //     const data = value.data.data;

  //     Object.assign(spikeIndex, data)

  //     this.setData({
  //       spikeIndex
  //     })
  //   })
  //   .catch((reason)=>{

  //   })
  // },
  //秒杀商品列表
  // spikeGoodsList() {
  //   const userInfo = wx.getStorageSync('userInfo');
  //   const options = this.data.options;
  //   const spikeIndex = this.data.spikeIndex;
  //   const dateIndex = this.data.dateIndex;
  //   const timeIndex = this.data.timeIndex;

  //   request_01.spikeGoodsList({
  //     openid: userInfo.openid,
  //     time_id: spikeIndex.time_list[timeIndex].time_id,//时间段ID
  //     activity_id: options.activity_id,
  //     date:spikeIndex.date_list[dateIndex].date_id,//日期id
  //   })
  //     .then((value) => {
  //       const spikeGoodsList = value.data.data;

  //       this.setData({
  //         spikeGoodsList,
  //       })
  //     })
  // },
  //活动规则
  ruleVisibleHandler() {
    const ruleVisible = this.data.ruleVisible;

    this.setData({
      ruleVisible: !ruleVisible
    })
  },
  //我的秒杀记录
  spikeLogBtn() {
    const options = this.data.options;

    router.jump_nav({
      url: `/pages/spike_log/spike_log?activity_id=${options.activity_id}`
    })
  },
  //预约-表单显示隐藏
  appoFormsVisible() {
    const appoFormsVisible = this.data.appoFormsVisible;
    this.setData({
      appoFormsVisible: !appoFormsVisible,
    })
  },
  //卡卷领取-表单显示隐藏
  KJFormsVisible() {
    const KJFormsVisible = this.data.KJFormsVisible;
    this.setData({
      KJFormsVisible: !KJFormsVisible,
    })
  },
  //快递领取-表单显示隐藏
  KDFormsVisible() {
    const KDFormsVisible = this.data.KDFormsVisible;
    this.setData({
      KDFormsVisible: !KDFormsVisible,
    })
  },
  //卡卷领取-回填表单显示隐藏
  backfillKJFormsVisible() {
    const backfillKJFormsVisible = this.data.backfillKJFormsVisible;
    this.setData({
      backfillKJFormsVisible: !backfillKJFormsVisible,
    })
  },
  //快递领取-回填表单显示隐藏
  backfillKDFormsVisible() {
    const backfillKDFormsVisible = this.data.backfillKDFormsVisible;
    this.setData({
      backfillKDFormsVisible: !backfillKDFormsVisible,
    })
  },
  //操作按钮
  opBtn(e) {
    if (!wx.getStorageSync('userInfo').mobile) {
      return
    }
    const ctDataset = e.currentTarget.dataset;
    const len = Object.keys(ctDataset).length;
    let btnType, spikeIndex, spikeGoodsList, index, item;
    if (len) {
      btnType = ctDataset.btntype;
      spikeIndex = this.data.spikeIndex;
      spikeGoodsList = this.data.spikeGoodsList;
      index = ctDataset.index;
      item = spikeGoodsList[index];
    } else {
      const tDataset = e.detail.target.dataset;
      btnType = tDataset.btntype;
      spikeIndex = this.data.spikeIndex;
      spikeGoodsList = this.data.spikeGoodsList;
      index = tDataset.index;
      item = spikeGoodsList[index];
    }
    switch (btnType) {
      case 'appoBtn':
        //立即预约
        //用户不是车主，活动是车主活动。
        //用户未授权。
        if (
          (wx.getStorageSync("userInfo").user_type == 0 && spikeIndex.activity_info.car_owner) ||
          !wx.getStorageSync("userInfo").unionid ||
          !wx.getStorageSync("userInfo").nickName
        ) return;
        if (this.data.goods2_buy == 0) {
          tool.alert('您未参与启辰官网1元下订活动，暂无秒杀资格!')
          return
        }
        tool.requestSubscribeMessage()
          .then((value) => {
            item.formId = value == 'reject' ? 0 : 1;
            this.setData({
              is_DY: item.formId,
              is_order: item.is_order
            });
            //order_status--预约状态 0-未预约过不可发起秒杀 1-预约过车主商品，只能砍车主商品 2-预约过普通商品，只能秒杀普通商品 3-预约过车主商品和普通商品 所有商品可以砍价
            if (item.car_owner == 0) {
              //预约 非车主商品、已留资过、没留资过
              spikeIndex.order_status == 2 || spikeIndex.order_status == 3 ? this.VipAppoBtn(item) : this.appoBtn(item)
            } else if (spikeIndex.user_type == 1 && item.car_owner == 1) {
              //车主 预约 车主商品
              this.VipAppoBtn(item)
            } else if (spikeIndex.user_type == 0 && item.car_owner == 1) {
              //非车主 预约 车主商品
              const vehicle = {
                goods_id: item.goods_id, //商品ID
                formId: item.formId,
              }
              this.setData({
                spikeResultVisible: 'bindCar',
                vehicle,
              })
            }

          })


        break;
      case 'spikeBtn':
        //立即秒杀
        this.spikeBtn(item)
        break;
      case 'receiveBtn':
        //立即领取
        this.receiveBtn(item)
        break;
      case 'tipsBtn':
        //提醒我

        tool.requestSubscribeMessage()
          .then((value) => {

            item.formId = value == 'reject' ? 0 : 1;

            this.tipsBtn(item)
          })

        break;
      default:
        this.jumpDetail(item)
        break;
    }
  },
  //立即预约(用户 预约 非车主商品)
  appoBtn(data) {
    console.log(data);
    let obj = {};
    obj.thumb = data.thumb; //商品图片
    obj.title = data.title; //商品名字
    obj.type = data.type; //商品类型
    obj.goods_id = data.goods_id; //商品id
    obj.is_order = data.is_order; // 是否预约
    obj.real_vcoin = data.real_vcoin; //需要v豆数
    obj.is_yy = 1; //是否是预约 0是领取 1预约
    obj.log_id = ''; //秒杀记录id
    obj.activity_id = this.data.options.activity_id; //活动id
    obj.is_DY = this.data.is_DY; //是否接受订阅消息 0拒绝 1接受
    tool.jump_nav(`/pages/spike_ receive/spike_ receive?obj=${JSON.stringify(obj)}`);
    // const vehicle = {
    //   img: data.thumb,
    //   title: data.title,
    //   price: data.vcoin,
    //   total_num: data.goods_num,//总数
    //   surplus_num: data.number,//剩余数
    //   goods_id: data.goods_id,//商品ID
    //   formId: data.formId,
    // }
    // this.setData({
    //   vehicle,
    // })

    // this.appoFormsVisible()
  },
  //立即预约(车主 预约 车主商品)
  VipAppoBtn(data) {
    const options = this.data.options;
    const userInfo = wx.getStorageSync('userInfo');

    alert.loading({
      str: '预约中'
    })

    request_01.spikeAppo({

        activity_id: options.activity_id, //活动ID
        openid: userInfo.openid, //用户openid
        goods_id: data.goods_id, //商品ID
        form_id: data.formId,

      })
      .then((value) => {
        const data = value.data.data;
        const status = value.data.status;
        const msg = value.data.msg;
        alert.loading_h()

        if (status == 1) { //预约成功

          //init
          this.initData(options)

          //提示框
          this.setData({
            spikeResultVisible: 'successAppo',
          })

        } else {
          alert.alert({
            str: msg,
          })
        }


      })
      .catch((reason) => {
        alert.loading_h()

        alert.alert({
          str: typeof reason == 'object' ? JSON.stringify(reason) : reason
        })
      })

  },
  //预约提交（用户 预约 非车主商品）
  appoSubmit(e) {
    const detail = e.detail;
    const userInfo = wx.getStorageSync('userInfo');
    const options = this.data.options;
    const vehicle = this.data.vehicle;

    alert.loading({
      str: '预约中'
    })
    request_01.spikeAppo({

        activity_id: options.activity_id, //活动ID
        openid: userInfo.openid, //用户openid
        goods_id: vehicle.goods_id, //商品ID
        form_id: vehicle.formId,
        mobile: detail.phone, //手机号码
        v_code: detail.code, //验证码 微信手机号无需传参
        name: detail.name, //姓名
        area: detail.region.join(' '), //定位地区
        code: detail.storeCode, //专营店编码

      }).then((value) => {
        //success
        const status = value.data.status;
        const msg = value.data.msg;
        alert.loading_h()

        if (status == 1) { //预约成功

          //init
          this.initData(options)

          //提示框
          this.setData({
            spikeResultVisible: 'successAppo',
          })
          //表单关闭
          this.appoFormsVisible()
        } else {
          alert.alert({
            str: msg,
          })
        }

      })
      .catch((reason) => {
        //fail
        alert.loading_h()

        alert.alert({
          str: typeof reason == 'object' ? JSON.stringify(reason) : reason
        })
      })
  },
  //立即秒杀
  spikeBtn(data) {
    const options = this.data.options;
    router.jump_nav({
      url: `/pages/spike_detail/spike_detail?activity_id=${options.activity_id}&skill_id=${data.skill_id}&is_order=${this.data.is_order}`
    })
  },
  //立即领取
  receiveBtn(data) {
    if (data.order_id > 0 && data.is_receive == 1) { //已领取
      router.jump_nav({
        url: `/pages/order_detail/order_detail?order_id=${data.order_id}`,
      })

    } else { //未领取
      let obj = {};
      obj.thumb = data.thumb; //商品图片
      obj.title = data.title; //商品名字
      obj.type = data.type; //商品类型
      obj.goods_id = data.goods_id; //商品id
      obj.is_order = data.is_order; // 是否预约
      obj.real_vcoin = data.real_vcoin; //需要v豆数
      obj.is_yy = 0; //是否是预约 0是领取
      obj.log_id = data.log_id; //秒杀记录id
      obj.activity_id = this.data.options.activity_id; //活动id
      // obj.
      tool.jump_nav(`/pages/spike_ receive/spike_ receive?obj=${JSON.stringify(obj)}`);
      return;
      //   const vehicle = {
      //     img: data.thumb,
      //     title: data.title,
      //     price: data.vcoin,
      //     total_num: data.goods_num,//总数
      //     surplus_num: data.number,//剩余数
      //     log_id: data.log_id,
      //   }
      //   this.setData({
      //     vehicle,
      //   })


      //车主商品需要留资、非车主商品需要请求回填接口回填
      //   data.car_owner == 1 ? this.spikeCapital(data) : this.spikeBackfill(data)

    }

  },
  //留资
  spikeCapital(data) {
    const vehicle = this.data.vehicle;

    Object.assign(vehicle, {
      backfill: false
    })

    this.setData({
      vehicle,
    })

    //1-微信卡券 2-快递到家 3-虚拟卡券
    switch (data.type) {
      case 2:
        //快递到家
        this.KDFormsVisible()
        break;
      default:
        //1-微信卡券 3-虚拟卡券
        this.KJFormsVisible()
        break;
    }
  },
  //留资回填
  spikeBackfill(data) {
    const userInfo = wx.getStorageSync('userInfo');
    const options = this.data.options;

    alert.loading({
      str: '领取中'
    })
    request_01.spikeBackfill({
        openid: userInfo.openid, //用户openid
        activity_id: options.activity_id, //活动ID
      })
      .then((value) => {
        const info = value.data.data;
        const msg = value.data.msg;
        const status = value.data.status;
        const vehicle = this.data.vehicle;
        alert.loading_h()

        if (status == 1) { //有留资信息

          Object.assign(vehicle, info, {
            backfill: true
          })
          this.setData({
            vehicle,
          })

          //1-微信卡券 2-快递到家 3-虚拟卡券
          switch (data.type) {
            case 2:
              //快递到家
              this.backfillKDFormsVisible()
              break;
            default:
              //1-微信卡券 3-虚拟卡券
              this.backfillKJFormsVisible()
              break;
          }
        } else { //无留资信息

          alert.alert({
            str: msg
          })

        }



      })
      .catch((reason) => {
        alert.loading_h()
        alert.alert({
          str: typeof reason == 'object' ? JSON.stringify(reason) : reason
        })
      })



  },
  //领取提交1-微信卡券 3-虚拟卡券
  // appoSubmit(e) {
  //   const detail = e.detail;
  //   const options = this.data.options;
  //   const userInfo = wx.getStorageSync('userInfo');
  //   const vehicle = this.data.vehicle;

  //   alert.loading({
  //     str: '领取中'
  //   })
  //   request_01.spikeReceive({
  //     activity_id: options.activity_id,//活动ID
  //     openid: userInfo.openid,//用户OPENID
  //     log_id: vehicle.log_id,//秒杀记录ID
  //     name: detail.name,//留资姓名
  //     mobile: detail.phone,//留资电话
  //     v_code: detail.code,//验证码 如果不是微信才传
  //     area: detail.region.join(' '),//定位地址 省市区
  //     address: detail.address||'',//快递详细地址 type=2传
  //     code: detail.storeCode,//专营店编码 type=1传和上面的直传一个就可以
  //   })
  //     .then((value) => {
  //       const data = value.data.data;
  //       const msg = value.data.msg;
  //       const status = value.data.status;
  //       alert.loading_h()

  //       if (status == 1) {

  //         switch (data.goods_type) {
  //           case 1:
  //             //微信卡券
  //             this.addCard(data.card_info, data.order_goods_id)
  //             break;
  //           case 2:
  //             //快递商品
  //             alert.alert({
  //               str: '领取成功',
  //             })
  //             break;
  //           case 3:
  //             //虚拟卡券
  //             this.setData({
  //               code: data.xuni_code,
  //             })
  //             this.closeCode()
  //             break;
  //         }

  //         this.appoFormsVisible()

  //         //init
  //         this.initData(options)

  //       } else {

  //         alert.alert({
  //           str: msg,
  //         })

  //       }


  //     })
  //     .catch((reason) => {
  //       alert.loading_h()

  //       alert.alert({
  //         str: typeof reason == 'object' ? JSON.stringify(reason) : reason
  //       })
  //     })
  // },
  //领取提交1-微信卡券 2-快递到家 3-虚拟卡券
  receiveSubmit(e) {
    const detail = e.detail;
    const options = this.data.options;
    const userInfo = wx.getStorageSync('userInfo');
    const vehicle = this.data.vehicle;

    alert.loading({
      str: '领取中'
    })
    request_01.spikeReceive({
        activity_id: options.activity_id, //活动ID
        openid: userInfo.openid, //用户OPENID
        log_id: vehicle.log_id, //秒杀记录ID
        name: detail.name, //留资姓名
        mobile: detail.phone, //留资电话
        v_code: detail.code, //验证码 如果不是微信才传
        area: detail.region.join(' '), //定位地址 省市区
        address: detail.address || '', //快递详细地址 type=2传
        code: detail.storeCode || '', //专营店编码 type=1传和上面的直传一个就可以
      })
      .then((value) => {
        const data = value.data.data;
        const msg = value.data.msg;
        const status = value.data.status;
        alert.loading_h()

        if (status == 1) {

          switch (data.goods_type) {
            case 1:
              //微信卡券
              this.addCard(data.card_info, data.order_goods_id)
              break;
            case 2:
              //快递商品
              alert.alert({
                str: '领取成功',
              })
              break;
            case 3:
              //虚拟卡券
              this.setData({
                code: data.xuni_code,
              })
              this.closeCode()
              break;
          }

          this.setData({
            KJFormsVisible: false,
            KDFormsVisible: false,
            backfillKJFormsVisible: false,
            backfillKDFormsVisible: false,
          })

          //init
          this.initData(options)

        } else {

          alert.alert({
            str: msg,
          })

        }


      })
      .catch((reason) => {
        alert.loading_h()

        alert.alert({
          str: typeof reason == 'object' ? JSON.stringify(reason) : reason
        })
      })
  },
  //秒杀结果弹窗
  spikeResultVisible() {
    const spikeIndex = this.data.spikeIndex;
    if (spikeIndex.activity_info.status == 2 || spikeIndex.activity_info.status == 3) {
      //活动已结束、未开始
      this.lookOtherActivity()
    } else {
      this.setData({
        spikeResultVisible: false,
      })
    }

  },
  //提醒我
  tipsBtn(data) {

    const userInfo = wx.getStorageSync('userInfo');
    const options = this.data.options;
    const dateIndex = this.data.dateIndex;
    const timeIndex = this.data.timeIndex;
    const spikeIndex = this.data.spikeIndex;
    const timeList = this.data.timeList;
    alert.loading({
      str: '请稍等'
    })
    request_01.spikeTips({

        activity_id: options.activity_id, //活动ID
        openid: userInfo.openid, //用户OPEN_ID
        form_id: data.formId, //form_id
        date: spikeIndex.date_list[dateIndex].date_id, //当前选择的日期 格式：xxxx-xx-xx
        time: timeList[timeIndex].time, //当前选中的时间段 格式：xx:xx
        skill_id: data.skill_id,
      })
      .then((value) => {
        const msg = value.data.msg;
        alert.loading_h()

        alert.alert({
          str: msg
        })

        //init
        this.initData(options)
      })
      .catch((reason) => {
        alert.loading_h()

        alert.alert({
          str: typeof reason == 'object' ? JSON.stringify(reason) : reason
        })
      })
  },

  // 授权手机号
  getPhoneNumber(e) {
    console.log(e, 'eeee')
    let options = this.data.options
    let user_id = wx.getStorageSync('userInfo').user_id
    let session_key = wx.getStorageSync('userInfo').session_key
    let iv = e.detail.iv
    let encrypted_data = e.detail.encryptedData
    if (e.detail.errMsg == "getPhoneNumber:ok") {
      request_05.dePhone({
        user_id,
        session_key,
        iv,
        encrypted_data
      }).then(res => {
        if (res.data.status == 1) {
          let _userInfo = wx.getStorageSync("userInfo")
          _userInfo.mobile = res.data.data.mobile
          wx.setStorageSync("userInfo", _userInfo)
          this.initData(options)
        } else {
          console.log(11111111)
          tool.alert(res.data.msg)
        }
      })
    }
  },

  //跳转详情页
  jumpDetail(data) {
    const options = this.data.options;
    const spikeIndex = this.data.spikeIndex;
    if (spikeIndex.activity_info.status == 1) {
      router.jump_nav({
        url: `/pages/spike_detail/spike_detail?activity_id=${options.activity_id}&skill_id=${data.skill_id}`
      })
    }


  },
  //查看其它活动
  lookOtherActivity() {

    router.jump_nav({
      url: `/pages/activity_list/activity_list`
    })
  },

  //去绑定车主
  goBindCar() {
    const vehicle = this.data.vehicle;
    this.spikeResultVisible()
    router.jump_nav({
      url: `/pages/o_love_car/o_love_car?pageType=spike&goods_id=${vehicle.goods_id}&formId=${vehicle.formId}`
    });
  },
  //关闭虚拟兑换窗口
  closeCode() {
    const isCodeShow = this.data.isCodeShow;
    this.setData({
      isCodeShow: !isCodeShow,
    })
  },
  //复制兑换码
  setClipboar() {
    let code = this.data.code;
    wx.setClipboardData({
      //准备复制的数据
      data: code,
    });
  },
  //领取卡券
  addCard(cardList, order_goods_id) {
    this.isShowLoading()
    tool.addCard(cardList).then(res => {
      console.log("卡券返回", res)
      if (res.errMsg == "addCard:ok") {

        console.log("卡券领取成功", res)
        let _card_code = ''

        for (let i = 0; i < res.cardList.length; i++) {
          _card_code += ((i == 0 ? '' : ',') + res.cardList[i].code)
        }
        this.cardCheck(_card_code, order_goods_id)
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
  cardCheck(card_code, order_goods_id) {
    let _data = {
      user_id: wx.getStorageSync("userInfo").user_id,
      order_goods_id,
      card_code: card_code
    }
    api.orderCheck(_data).then(res => {
      console.log("卡券核销上报返回", res)
      if (res.statusCode == 200) {
        this.isShowLoading()
        tool.alert("卡券领取成功，请到我的卡包查看卡券使用详情")
        // let _orderDetail = this.data.orderDetail
        // _orderDetail.order_goods[this.data.curIndex].is_receive = 1
        // console.log("_orderDetail", _orderDetail)
        // this.setData({ orderDetail: _orderDetail })
      }
    })
  },
  //自定义loading框
  isShowLoading() {
    this.setData({
      isShowLoading: !this.data.isShowLoading
    })
  },
  //判断是否授权和是否是车主
  isVehicleOwner(e) {

    if (!e) return;
    const index = e.target.dataset.index;
    const type = e.target.dataset.type;
    const spikeIndex = this.data.spikeIndex;
    const spikeGoodsList = this.data.spikeGoodsList;
    //事件源对象不符合条件的按钮。
    if (type != 'ok') return;
    //用户已授权，用户是车主。
    //用户已授权，活动不是车主活动，商品不是车主商品。
    if (
      (wx.getStorageSync("userInfo").unionid && wx.getStorageSync("userInfo").nickName && wx.getStorageSync("userInfo").user_type == 1) ||
      (wx.getStorageSync("userInfo").unionid && wx.getStorageSync("userInfo").nickName && !spikeIndex.activity_info.car_owner)
    ) return;

    //用户未授权
    if (!wx.getStorageSync("userInfo").unionid ||
      !wx.getStorageSync("userInfo").nickName
    ) {
      this.setData({
        popType: 2
      })
    } else if (wx.getStorageSync("userInfo").user_type == 0) { //用户不是车主
      //该活动仅限于车主
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
})