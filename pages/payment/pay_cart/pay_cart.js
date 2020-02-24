// pages/payment/pay_cart/pay_cart.js
const request_01 = require('../../../utils/request/request_01.js');

const router = require('../../../utils/tool/router.js');

const alert = require('../../../utils/tool/alert.js');

const method = require('../../../utils/tool/method.js');

const app = getApp(); //获取应用实例
Page({

  /**
   * 页面的初始数据
   */
  data: {
    IMGSERVICE: app.globalData.IMGSERVICE,
    goodsDetail: {},
    cartDetail: {},
    type: '',
    currentAddressItem: {},
    storeList: [],
    pickerStoreList: [],
    storeIndex: 0,
    positionKey: true,
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
    const currentAddressItem = app.globalData.currentAddressItem; //收货人信息
    const goodsDetail = this.data.goodsDetail; //立即兑换商品信息
    const cartDetail = this.data.cartDetail; //购物车商品信息
    const type = this.data.type;

    this.setData({
      currentAddressItem,
    })

    //收货人信息必须填写
    if (!currentAddressItem.area) return;

    //立即兑换商品、购物车商品 为快递时，不用获取门店
    if ((cartDetail.type == 2 && type == 'cart') || (goodsDetail.type == 2 && type == 'pay')) return;

    this.getLocation()
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
  //页面初始化
  initData(options) {
    const goodsDetail = app.globalData.goodsDetail;
    const cartDetail = app.globalData.cartDetail;
    const type = options.type;
    const userInfo = wx.getStorageSync('userInfo');

    if (type == 'pay') { //立即支付跳转过来
      this.setData({
        goodsDetail,
      })
    } else { //购物车跳转过来
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

        } else {
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
  getLocation() {
    const currentAddressItem = this.data.currentAddressItem;

    alert.loading({
      str: '获取门店中'
    })

    this.setData({ //定位中关锁
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

        if (status == 1) { //有门店数据返回
          pickerStoreList = storeList.map((item) => {
            return item.name;
          })

          this.setData({
            storeList,
            pickerStoreList,
            storeIndex: 0,
          })
        } else { //门店数据返回出错

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

        this.setData({ //定位完开锁
          positionKey: true,
        })
      })
  },
  //获取收货人信息
  getInfo() {
    const positionKey = this.data.positionKey;

    if (!positionKey) return; //定位中不能操作

    router.jump_nav({ //跳转到我的地址页 选择地址
      url: '/pages/o_address/o_address?pageType=back'
    })
  },
  //选择获取门店
  bindPickerChange(e) {
    const storeIndex = e.detail.value;

    this.setData({
      storeIndex,
    })
  },
  //选择获取门店提示
  getStore() {
    const currentAddressItem = this.data.currentAddressItem; //收货人信息

    if (currentAddressItem.area) { //收货人信息必须填写
      alert.alert({
        str: '该区域没有找到相关门店，或门店相关信息出错'
      })
    } else { //该区域没有门店
      alert.alert({
        str: '请填写收货人信息'
      })
    }
  },
  //结算
  settlement() {
    const goodsDetail = this.data.goodsDetail; //立即支付商品信息
    console.log(goodsDetail, 'goodsDetail')
    let cartDetail = this.data.cartDetail; //购物车商品信息
    const currentAddressItem = this.data.currentAddressItem; //收货人信息
    const type = this.data.type;
    const userInfo = wx.getStorageSync('userInfo');
    const storeList = this.data.storeList; //门店列表
    const storeIndex = this.data.storeIndex; //门店索引
    const goods_id = goodsDetail.goods_id; //商品id
    let promise, url, shopCartList;
    //收货人信息必填
    if (!currentAddressItem.address_id) return alert.alert({
      str: '请填写收货人信息'
    });


    if (type == 'pay') { //立即支付跳转过来
      console.log(1111111111)

      if (!(goodsDetail.type == 2) && !storeList.length) return alert.alert({
        str: '请选择领取的门店'
      });

      url = '/pages/shop_cart_submitted/shop_cart_submitted?type=' + goodsDetail.type;

      promise = request_01.goodsSettlement({
        user_id: userInfo.user_id, //用户ID
        goods_id: goodsDetail.__goods_id, //产品ID
        number: goodsDetail.__number, //购买数量
        address_id: currentAddressItem.address_id, //收货人信息 id
        dealer_code: goodsDetail.type == 2 ? '' : storeList[storeIndex].code, //门店id 为快递时门店id非必选
        remark: '', //备注
        goods_attr_id: goodsDetail.goods_attr.length ? goodsDetail.attr_info[goodsDetail.__index].goods_attr_id : 0, //商品规格ID
        goods_id
      })

    } else { //购物车跳转过来
      console.log(222222222222222222)

      if (!(cartDetail.type == 2) && !storeList.length) return alert.alert({
        str: '请选择领取的门店'
      });
      shopCartList = cartDetail.shopCartList.map((item) => { //筛选ID
        return item.shopping_cart_id;
      })

      url = '/pages/shop_cart_submitted/shop_cart_submitted?type=' + cartDetail.type;

      promise = request_01.settlementShopCart({
        user_id: userInfo.user_id, //用户ID
        address_id: currentAddressItem.address_id, //收货人信息 id
        remark: '', //备注
        dealer_code: cartDetail.type == 2 ? '' : storeList[storeIndex].code, //门店id 为快递时门店id非必选
        shopping_cart_ids: JSON.stringify(shopCartList), //结算购物车id 格式：json数组 例子[1,2,3]
      })

    }

    alert.loading({
      str: '结算中'
    })

    promise
      .then((value) => {
        //success
        const status = value.data.status;
        const msg = value.data.msg;
        const order_id = value.data.data.order_id;

        alert.loading_h()

        if (status == 1) { //成功
          router.jump_red({
              url: `${url}&order_id=${order_id}`,
            })
            .then(() => {
              app.globalData.goodsDetail = {}; //清空立即支付商品信息
              app.globalData.cartDetail = {}; //清空购物车商品信息
            })

        } else { //失败

          alert.alert({
            str: msg
          });

        }

      })
      .catch((reason) => {
        //fail

        alert.loading_h()

        alert.alert({
          str: reason
        })

      })
  },
})