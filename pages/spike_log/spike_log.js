// pages/spike_log/spike_log.js
const request_01 = require('../../utils/request/request_01.js');

const alert = require('../../utils/tool/alert.js');

const router = require('../../utils/tool/router.js');

const WxParse = require('../../utils/wxParse/wxParse.js');

const app = getApp();//获取应用实例

import tool from '../../utils/tool/tool.js';
import api from '../../utils/request/request_03.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ready:false,
    options: {},
    vehicle: {},
    page: 1,
    scrollKey: true,
    scrollPrivateKey: true,
    spikeLog: [],
    str: '',
    isMore: false,
    isCodeShow: false,
    code: '',
    isShowLoading: false,
    loadingText: '卡券领取中',
    btnText:'领取',
    formsType_04: 5,//卡卷
    formsType_01: 1,//快递
    vehicle: {},
    KJFormsVisible: false,
    KDFormsVisible: false,
    backfillKJFormsVisible: false,
    backfillKDFormsVisible: false,
	  is_order:null,//预约次数
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
	console.log(options);
	this.setData({ is_order: options.is_order})
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
      this.setData({
        page: 1,
        scrollKey: true,
        scrollPrivateKey: true,
      })
      this.initData(options)
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
  //页面数据初始化
  initData(options) {
    const userInfo = wx.getStorageSync('userInfo');
    const page = this.data.page;

    Promise.all([
      request_01.spikeLog({
        activity_id: options.activity_id,///活动ID
        openid: userInfo.openid,//用户OPEN_ID
        page,//分页页码 默认1
      })
    ])
      .then((value) => {
        const spikeLog = value[0].data.data.list;
        let isMore, str;

        if (spikeLog.length) {//有数据
          isMore = false;
        }
        else {//无数据
          str = '-我是有底线的-';
          isMore = true;
        }

        this.setData({
          str,
          isMore,
          spikeLog,
          options,
        })
      })
      .catch((reason) => {

      })
  },

  //滚动加载
  scrollLoad() {
    const options = this.data.options;
    const userInfo = wx.getStorageSync('userInfo');
    let page = this.data.page;
    let scrollPrivateKey = this.data.scrollPrivateKey;
    let scrollKey = this.data.scrollKey;

    if (!scrollPrivateKey) return;

    this.setData({
      scrollPrivateKey: false,
      scrollKey: false,
      str: '-加载中-',
      isMore: true,
    })

    request_01.spikeLog({
      activity_id: options.activity_id,///活动ID
      openid: userInfo.openid,//用户OPEN_ID
      page: page + 1,//分页页码 默认1
    })
      .then((value) => {
        let data = value.data.data.list;
        let spikeLog = this.data.spikeLog;
        let isMore, str;

        if (data.length) {//有数据返回
          spikeLog = [...spikeLog, ...data];
          scrollKey = true;
          scrollPrivateKey = true;
          page = page + 1;
          isMore = false;
        }
        else {//无数据返回
          scrollKey = true;
          scrollPrivateKey = false;
          str = '-我是有底线的-'
          isMore = true;
        }

        this.setData({
          str,
          isMore,
          spikeLog,
          scrollKey,
          scrollPrivateKey,
          page,
        })
      })
      .catch((reason) => {

      })
  },
  //操作按钮
  opBtn(e) {
	let obj = e.currentTarget.dataset.obj; 
    const btnType = e.currentTarget.dataset.btntype;
    const index = e.currentTarget.dataset.index;
    const spikeLog = this.data.spikeLog;
    const item = spikeLog[index];


    switch (btnType) {
      case 'look':
        //查看订单详情
        router.jump_nav({
          url: `/pages/order_detail/order_detail?order_id=${item.order_id}`,
        })
        break;
      case 'receive':
        //立即领取
        // const vehicle = {
        //   log_id: item.log_id,
        // }
        // this.setData({
        //   vehicle,
        // })
		this.receiveBtn(obj);
        //车主商品需要留资、非车主商品需要请求回填接口回填
        // item.car_owner == 1 ? this.spikeCapital(item) : this.spikeBackfill(item)
        break;
    }
  },
  receiveBtn(data) {
	  //领取留资
	  console.log(data);
	//   return;
	  let obj = {};
	  obj.thumb = data.thumb;//商品图片
	  obj.title = data.title;//商品名字
	  obj.type = data.type;//商品类型
	  obj.goods_id = '';//商品id
	  obj.is_order = 1;// 是否预约
	  obj.real_vcoin = data.real_vcoin;//需要v豆数
	  obj.is_yy = 0;//是否是预约 0是领取
	  obj.log_id = data.log_id;//秒杀记录id
	  obj.activity_id = this.data.options.activity_id;//活动id
	  console.log(obj)
	//   return;
	  tool.jump_nav(`/pages/spike_ receive/spike_ receive?obj=${JSON.stringify(obj)}`);
	  return;
  },
  //留资
  spikeCapital(data){
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
      openid: userInfo.openid,//用户openid
      activity_id: options.activity_id,//活动ID
    })
      .then((value) => {
        const info = value.data.data;
        const msg = value.data.msg;
        let status = value.data.status;
        let vehicle = this.data.vehicle;
        alert.loading_h()

        if (status == 1) {//有留资信息

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
        }
        else {//无留资信息
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
        const spikeLog = this.data.spikeLog;
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
            KDFormsVisible:false,
            backfillKJFormsVisible: false,
            backfillKDFormsVisible:false,
          })

          //init
          spikeLog.some((val) => {
            if (val.log_id == vehicle.log_id) {
              val.is_receive = 1;
              return true;
            }
            return false;
          })
          this.setData({
            spikeLog,
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