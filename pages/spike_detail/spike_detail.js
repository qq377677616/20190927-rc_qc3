// pages/spike_detail/spike_detail.js
const request_01 = require('../../utils/request/request_01.js');

const alert = require('../../utils/tool/alert.js');

const router = require('../../utils/tool/router.js');

const WxParse = require('../../utils/wxParse/wxParse.js');

const app = getApp();//获取应用实例

import tool from '../../utils/tool/tool.js';
import api from '../../utils/request/request_03.js'

let timmer = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    IMGSERVICE: app.globalData.IMGSERVICE,
    ready:false,
    options: {},
    spikeGoodsDetail: {},
    countDown: [
      '00',
      '00',
      '00',
      '00',
    ],
    timeStamp: 'over',
    spikeResultVisible:false,
    spikeResultMsg:'',
    isCodeShow: false,
    code: '',
    isShowLoading:false,
    loadingText: '卡券领取中',
    btnText:'领取',
    formsType_04: 4,
    formsType_01: 1,
    vehicle: {},
    KJFormsVisible: false,
    KDFormsVisible: false,
    backfillKJFormsVisible:false,
    backfillKDFormsVisible:false,
    
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
      ready:true,
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    const ready = this.data.ready;
    const options = this.data.options;

    if( ready ){
      this.initData(options)
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.spikeResultVisible()
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    this.spikeResultVisible()
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
  // onShareAppMessage: function () {
  //   const options = this.data.options;
  //   const IMGSERVICE = this.data.IMGSERVICE;
  //   return {
  //     title: '秒杀天天有，今天特别大！',
  //     imageUrl: `${IMGSERVICE}/spike/spike_share.jpg`,
  //     path: `/pages/spike_detail/spike_detail?activity_id=${options.activity_id}&skill_id=${options.skill_id}`,
  //   };
  // },
  //页面数据初始化
  initData(options) {
    const userInfo = wx.getStorageSync('userInfo');

    alert.loading({
      str:'加载中'
    })
    Promise.all([
      request_01.spikeGoodsDetail({
        activity_id: options.activity_id,//活动ID
        openid: userInfo.openid,//用户openid
        skill_id: options.skill_id,//秒杀商品ID
      })
    ])
      .then((value) => {
        const spikeGoodsDetail = value[0].data.data;
        const getTime = new Date().getTime();
        const timeStamp = spikeGoodsDetail.countdown ? (spikeGoodsDetail.countdown * 1000 + getTime) : spikeGoodsDetail.countdown == 0 ? 'over' : 'notStarted';//保存对应时间段给的时间戳到全局
        alert.loading_h()

        WxParse.wxParse('product_explain', 'html', spikeGoodsDetail.intro, this); 

        this.setData({
          spikeGoodsDetail,
          options,
          timeStamp,
        })

        //根据对应时间段给的时间戳进行倒计时
        this.countDown()
      })
      .catch((reason) => {
        alert.loading_h()
      })
  },
  //倒计时
  countDown() {
    const timeStamp = this.data.timeStamp;

    clearTimeout(timmer)
    //timeStamp不为notStarted才能开启倒计时
    timmer = timeStamp >= 0 && setTimeout(() => {

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
      countDown: ['00', '00', '00', '00'],//初始化时间
      timeStamp: 'over',//倒计时结束
    })
   

    //init
    this.initData(options)
    //清除定时器
    clearTimeout(timmer)
  },
  //操作按钮
  opBtn(e) {
    const btnType = e.currentTarget.dataset.btntype;

    switch (btnType) {
      case 'spikeBtn':
        //立即秒杀
        this.spikeBtn()
        break;
      case 'receiveBtn':
        //立即领取
        this.receiveBtn()
        break;
    }
  },
  //立即秒杀
  spikeBtn() {
    const userInfo = wx.getStorageSync('userInfo');
    const options = this.data.options;
    const spikeGoodsDetail = this.data.spikeGoodsDetail;

    alert.loading({
      str: '正在秒杀中'
    })
    request_01.spikeSpike({
      activity_id: options.activity_id,//活动ID
      openid: userInfo.openid,//用户OPEN_ID
      skill_id: spikeGoodsDetail.skill_id,//秒杀商品ID
    })
      .then((value) => {
        const status = value.data.status;
        const msg = value.data.msg;
        const data = value.data.data;
        let spikeResultVisible,spikeResultMsg;
        let vehicle = {};

        alert.loading_h()

        if (status == 1) {//秒杀成功
          spikeResultVisible = 'success';

          vehicle = {
            spikeResultVisible:'success',
          }


        }
        else if(status == 2){//安慰奖
          spikeResultVisible = 'comfort';

          vehicle = {
            log_id:data.log_id,
            car_owner:data.car_owner,
            type:data.type,
            img:data.info.thumb,
            title:data.info.title,
            spikeResultVisible:'comfort',
          }
        }
        else{//秒杀失败
          spikeResultVisible = 'fail';
          spikeResultMsg = msg;
        } 

        

        this.setData({
          spikeResultVisible,
          spikeResultMsg,
          vehicle,
        })

        //init
        this.initData(options)
      })
      .catch((reason) => {
        alert.loading_h()

        alert.alert({
          str:typeof reason == 'object' ? JSON.stringify(reason) : reason
        })
      })
  },
  //立即领取
  receiveBtn() {
    const spikeGoodsDetail = this.data.spikeGoodsDetail;
    let vehicle = this.data.vehicle;


    if( spikeGoodsDetail.order_id > 0 && spikeGoodsDetail.is_receive == 1 ){//已领取
      router.jump_nav({
        url: `/pages/order_detail/order_detail?order_id=${spikeGoodsDetail.order_id}`,
      })
    }
    else{//未领取

      vehicle.spikeResultVisible == 'comfort'  ? '' : vehicle = {
        log_id:spikeGoodsDetail.log_id,
        car_owner:spikeGoodsDetail.car_owner,
        type:spikeGoodsDetail.type,
        img:spikeGoodsDetail.thumb,
        title:spikeGoodsDetail.title,
        price:spikeGoodsDetail.vcoin,//原价
        total_num: spikeGoodsDetail.goods_num,//总数
        surplus_num: spikeGoodsDetail.number,//剩余数
      };

      this.setData({
        vehicle,
      })
      //车主商品需要留资、非车主商品需要请求回填接口回填
      vehicle.car_owner == 1 ? this.spikeCapital(vehicle) : this.spikeBackfill(vehicle)

    }
    
  },
  //留资
  spikeCapital(data){

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
      openid: userInfo.openid,//用户openid
      activity_id: options.activity_id,//活动ID
    })
      .then((value) => {
        const info = value.data.data;
        const msg = value.data.msg;
        const status = value.data.status;
        const vehicle = this.data.vehicle;
        alert.loading_h()

        if (status == 1) {//有留资信息
          Object.assign(vehicle, info)
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
        }
        else {//无留资信息

          alert.alert({
            str:msg
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
  //预约表单显示隐藏
  KJFormsVisible() {
    const KJFormsVisible = this.data.KJFormsVisible;
    this.setData({
      KJFormsVisible: !KJFormsVisible,
    })
  },
  //领取表单显示隐藏
  KDFormsVisible() {
    const KDFormsVisible = this.data.KDFormsVisible;
    this.setData({
      KDFormsVisible: !KDFormsVisible,
    })
  },
  //回填预约表单显示隐藏
  backfillKJFormsVisible() {
    const backfillKJFormsVisible = this.data.backfillKJFormsVisible;
    this.setData({
      backfillKJFormsVisible: !backfillKJFormsVisible,
    })
  },
  //回填领取表单显示隐藏
  backfillKDFormsVisible() {
    const backfillKDFormsVisible = this.data.backfillKDFormsVisible;
    this.setData({
      backfillKDFormsVisible: !backfillKDFormsVisible,
    })
  },
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
      activity_id: options.activity_id,//活动ID
      openid: userInfo.openid,//用户OPENID
      log_id: vehicle.log_id,//秒杀记录ID
      name: detail.name,//留资姓名
      mobile: detail.phone,//留资电话
      v_code: detail.code,//验证码 如果不是微信才传
      area: detail.region.join(' '),//定位地址 省市区
      address: detail.address || '',//快递详细地址 type=2传
      code: detail.storeCode || '',//专营店编码 type=1传和上面的直传一个就可以
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

          this.spikeResultVisible()
          this.setData({
            KJFormsVisible: false,
            KDFormsVisible:false,
            backfillKJFormsVisible: false,
            backfillKDFormsVisible:false,
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
    this.setData({
      spikeResultVisible: false,
    })
  },
  //查看其它商品
  lookOtherGoods(){
    const options = this.data.options;
    router.jump_nav({
      url: `/pages/spike_index/spike_index?activity_id=${options.activity_id}`,
    })
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
})