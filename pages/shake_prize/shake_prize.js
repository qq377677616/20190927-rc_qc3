const request_01 = require('../../utils/request/request_01.js');

const request_04 = require('../../utils/request/request_04.js');
import api from '../../utils/request/request_03.js'

const router = require('../../utils/tool/router.js');

const alert = require('../../utils/tool/alert.js');

const method = require('../../utils/tool/method.js');

const tool = require('../../utils/public/tool.js');

import tool2 from '../../utils/tool/tool.js'

const app = getApp();//获取应用实例
Page({
	/**
	 * 页面的初始数据
	 */
  data: {
    IMGSERVICE: app.globalData.IMGSERVICE,//图片基本路径
    // goodsDetail: {},//商品详情信息
    // cartDetail: {},//
    // type: 'pay',
    currentAddressItem: {},
    storeList: [],
    pickerStoreList: [],
    storeIndex: 0,//
    positionKey: true,//是否定位
    barshopData: {},//砍价商品数据
    picklist: [],//存pick数据
    parmData: null,//接收页面参数
    order_goods_id: null,//订单id
    isShowLoading: false,
  },
	/**
	 * 生命周期函数--监听页面加载
	 */
  onLoad: function (options) {
    // console.log(6666,JSON.parse(options.obj))
    this.setData({ parmData: JSON.parse(options.obj) })
    request_01.login(() => {
      this.initData(options)
    })
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
    const currentAddressItem = app.globalData.currentAddressItem;//收货人信息
    this.setData({
      currentAddressItem,
    })
    console.log(this.data.parmData.prize_type)
    //收货人信息必须填写
    if (!currentAddressItem.area) return;

    //立即兑换商品、购物车商品 为快递时，不用获取门店
    // console.log('是否需要选择门店', this.data.barshopData.type!=2,this.data.barshopData.type);

    if (this.data.parmData.prize_type == 2) return;
    this.getLocation()
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
  //页面初始化
  initData(options) {
    const goodsDetail = app.globalData.goodsDetail;
    const cartDetail = app.globalData.cartDetail;
    const type = options.type;
    const userInfo = wx.getStorageSync('userInfo');
    if (type == 'pay') {//立即支付跳转过来
      this.setData({
        goodsDetail,
      })
    }
    else {//购物车跳转过来
      this.setData({
        cartDetail,
      })
    }

    this.setData({
      type,
    })

    alert.loading({
      str: '加载中'
    })
    Promise.all([
      request_01.defaultAddress({
        user_id: userInfo.user_id
      })
    ])
      .then((value) => {
        //success
        const data = value[0].data.data;
        const toString = {}.toString;
        if (toString.call(data) == '[object Array]') {
          //为空数组 就是没有默认地址

        }
        else {
          //否则有默认地址
          app.globalData.currentAddressItem = Object.assign(data, {
            real_address: data.area.replace(/\s+/g, "") + data.address
          })

          this.onShow()
        }

      })
      .catch((reason) => {
        //fail

      })
      .then(() => {
        //complete
        alert.loading_h()


      })


  },
  //定位
  //定位
  getLocation() {
    const currentAddressItem = this.data.currentAddressItem;
    console.log(currentAddressItem);
    alert.loading({
      str: '获取门店中'
    })

    this.setData({//定位中关锁
      positionKey: false,
    })

    method.getPosition()
      .then((value) => {
        //success
        const location = value.result;

        return request_01.storeList({
          city: currentAddressItem.area.split(' ')[1],
          lon: location.location.lng,
          lat: location.location.lat,
        })

      })
      .catch((reason) => {
        //fail
        return request_01.storeList({
          city: currentAddressItem.area.split(' ')[1],
          lon: '',
          lat: '',
        })

      })
      .then((value) => {
        const storeList = value.data.data;
        const msg = value.data.msg;
        const status = value.data.status;
        let pickerStoreList;
        alert.loading_h()

        if (status == 1) {//有门店数据返回
          pickerStoreList = storeList.map((item) => {
            return item.name;
          })

          this.setData({
            storeList,
            pickerStoreList,
            storeIndex: 0,
          })
        }
        else {//门店数据返回出错

          this.setData({
            storeList: [],
            pickerStoreList: [],
            storeIndex: 0,
          })

          alert.alert({
            str: '门店：' + msg,
          })

        }

      })
      .catch((reason) => {
        //fail

        this.setData({
          storeList: [],
          pickerStoreList: [],
          storeIndex: 0,
        })

        alert.loading_h()
        alert.alert({
          str: '门店：' + JSON.stringify(reason)
        })
      })
      .then(() => {
        //complete

        this.setData({//定位完开锁
          positionKey: true,
        })
      })
  },
  getstroeList(location = 0) {
    const currentAddressItem = this.data.currentAddressItem;
    console.log(currentAddressItem)
    let pickerStoreList;
    let picklist;
    let dat;
    console.log(location);
    if (!location || location == 0) {
      dat = {
        city: currentAddressItem.area.split(' ')[1]
      }
    } else {
      dat = {
        city: currentAddressItem.area.split(' ')[1],
        lon: location.location.lng,
        lat: location.location.lat,
      }
    }
    console.log(currentAddressItem)
    request_01.storeList(dat).then((value) => {
      console.log('获取门店信息');
      const storeList = value.data.data;
      const msg = value.data.msg;
      const status = value.data.status;

      if (status == 1) {//有门店数据返回
        pickerStoreList = storeList.map((item) => {
          return item;
        })
        picklist = storeList.map((item) => {
          return item.name;
        })
        this.setData({
          storeList,
          pickerStoreList,
          storeIndex: 0,
          picklist,
        })
      }
      else {//门店数据返回出错

        this.setData({
          storeList: [],
          pickerStoreList: [],
          picklist,
          storeIndex: 0,
        })
      }
      alert.loading_h()
    })
  },
  //获取收货人信息
  getInfo() {
    const positionKey = this.data.positionKey;
    router.jump_nav({//跳转到我的地址页 选择地址
      url: '/pages/o_address/o_address?pageType=back'
    })
  },
  //选择获取门店
  bindPickerChange(e) {
    const storeIndex = e.detail.value;
    console.log(storeIndex);
    this.setData({
      storeIndex,
    })
  },
  //选择获取门店提示
  getStore() {
    const currentAddressItem = this.data.currentAddressItem;//收货人信息

    if (currentAddressItem.area) {//收货人信息必须填写
      alert.alert({
        str: '该区域没有找到相关门店，或门店相关信息出错'
      })
    }
    else {//该区域没有门店
      alert.alert({
        str: '请填写收货人信息'
      })
    }
  },
  //打开系统设置页
  openSetting() {
    if (this.data.isSettingLocation) return
    gets.openSetting().then(res => {
      if (res.authSetting["scope.userLocation"]) {
        this.data.isSettingLocation = true
        this.getPosition()
      } else {
        console.log("您没有勾选设置")
      }
    })
  },
  formSubmit(e) {
    //领取微信卡券
    console.log(this.data.parmData)
    this.isShowLoading();
    let storeList = this.data.storeList;//门店列表
    let storeIndex = this.data.storeIndex;
    //领取非微信卡券
    if (!this.data.currentAddressItem.address_id || this.data.currentAddressItem.address_id == '') {
      alert.alert({ str: '请选择地址等信息' });
      return;
    }
    let dat = {};
    if (this.data.parmData.prize_type == 2) {
      dat = {
        prize_id: this.data.parmData.prize_id,
        openid: wx.getStorageSync("userInfo").openid,
        address_id: this.data.currentAddressItem.address_id
      }
    } else {
      dat = {
        prize_id: this.data.parmData.prize_id,
        openid: wx.getStorageSync("userInfo").openid,
        address_id: this.data.currentAddressItem.address_id,
        dlr_code: storeList[storeIndex].code || ''
      }
    }
    request_04.getword(dat).then((res) => {
      this.isShowLoading();
      if (res.data.status == '1') {
        if (this.data.parmData.prize_type == 1 && res.data.data.order_goods_id2 == 0) {
          this.isShowLoading();
          this.setData({ order_goods_id: res.data.data.order_goods_id })
          this.addCard([res.data.data.card_info]);
          return;
        }
        tool.jump_red(`/pages/order_detail/order_detail?order_id=${res.data.data.order_id}`)
      } else {
        tool.alert(res.data.msg)
      }
    })
  },
  addCard(cardList) {
    this.isShowLoading()
    console.log('11', cardList)
    tool2.addCard(cardList).then(res => {
      tool.jump_red(`/pages/o_prize/o_prize?activity_id=57`)
      console.log("卡券返回", res)
      if (res.errMsg == "addCard:ok") {
        console.log("卡券领取成功")
        let _card_code = ''
        for (let i = 0; i < res.cardList.length; i++) {
          _card_code += ((i == 0 ? '' : ',') + res.cardList[i].code)
        }
        this.cardCheck(_card_code)
      } else {
        this.isShowLoading()
        tool2.alert("卡券领取失败")
      }
    }).catch(err => {
      console.log("err", err)
      this.isShowLoading()
      tool2.alert("卡券领取失败")
    })
  },
  isShowLoading() {
    this.setData({
      isShowLoading: !this.data.isShowLoading
    })
    if (this.data.isShowLoading) {
      tool.loading();
    } else {
      tool.loading_h();
    }
  },
  cardCheck(card_code) {
    console.log("上报")
    console.log(this.data.parmData)
    let _data = {
      user_id: wx.getStorageSync("userInfo").user_id,
      order_goods_id: this.data.order_goods_id,
      card_code: card_code
    }
    api.orderCheck(_data).then(res => {
      console.log("卡券核销上报返回", res)
      if (res.statusCode == 200) {

        this.isShowLoading()
        tool2.alert("卡券领取成功，请到我的卡包查看卡券使用详情")
        // let _orderDetail = this.data.orderDetail
        // _orderDetail.order_goods[this.data.curIndex].is_receive = 1
        // console.log("_orderDetail", _orderDetail)
        // this.setData({ orderDetail: _orderDetail })
      }
    })
  }
})