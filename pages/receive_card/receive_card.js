// pages/receive_card/receive_card.js

const method = require('../../utils/tool/method.js');

const alert = require('../../utils/tool/alert.js');

const router = require('../../utils/tool/router.js');

const auth = require('../../utils/tool/authorization.js');

const QQMapWX = require('../../utils/other/qqmap-wx-jssdk.min.js');

const request_02 = require('../../utils/request/request_02.js');

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    IMGSERVICE: app.globalData.IMGSERVICE,
    show: true,
    receiveHidden: false,
    city: '所在城市',
    regionArr: ['请选择地址'],
    region: ['北京市', '北京市', '东城区'],
    storeArr: ['请选择专营店'],
    myAdd: '',
    oName: '',
    oTel: '',
    oCode: '',
    storeList: [{ name: '请重新选择所在城市' }],
    storeList_index: 0,
    showModal: {
      isShow: false,
      title: "获取位置信息",
      test: "智趣启辰将访问您的手机定位，自动定位到您当前所在城市信息。",
      cancelText: "取消",
      confirmText: "授权",
      color_confirm: '#A3271F'
    },
    isShowLoading: false,
    loadingText: '卡券领取中',
    ortherList: ['产品规格'],
    orther_index: 0,
    ortherType: 0,
    curPrizeId: '',
    prevUrl: '',
    isClick: false,
    isGetPhoneNumber: false
  },
  //前往领取
  submitBtn() {
    if (this.data.isClick) {
      return
    } else {
      this.data.isClick = true
      setTimeout(() => {
        this.data.isClick = false
      }, 2000)
    }
    let oName = this.data.oName;
    let oTel = this.data.oTel;
    let oCode = this.data.oCode;
    let city = this.data.city;
    let storeCur = this.data.storeList[0].name;
    let tempArr = [oName != '', (/^1[3456789]\d{9}$/.test(oTel))];
    console.log("this.data.prize_type", this.data.prize_type)
    if (this.data.prize_type == 1) {
      tempArr.push(this.data.myAdd != '')
    }
    const result = tempArr.every((item, index) => { return item })
    if (result) {
      let _userInfo = wx.getStorageSync("userInfo")
      _userInfo.name = oName
      wx.setStorageSync("userInfo", _userInfo)
      let _data = {
        user_id: wx.getStorageSync('_login').user_id,
        name: oName,
        phone: oTel,
        stores_id: this.data.storeList[this.data.storeList_index].d_id,
        city: city,
        other: this.data.other || this.data.ortherList[this.data.orther_index].attr_value
      }
      if (this.data.curPrizeId == 7) {//一年使用权
        this.ticketUpload({ name: oName, phone: oTel, user_prize_id: this.data.user_prize_id })
      } else if (this.data.product_id == 1 || this.data.product_id == 122) {//门票专用
        alert.loading({ 
          str: "提交中"
        })
        _data.user_prize_id = this.data.user_prize_id
        _data.city = this.data.region.join(',')
        _data.stores_id = this.data.myAdd
        this.ticketCardEnd(_data)
      } else {//其它卡券
        this.addCard(_data)
      }
    } else {
      //reject
      alert.alert({
        str:"请完善您的信息"
      })
      return false;
    }
  },
  //loading框
  isShowLoading() {
    this.setData({
      isShowLoading: !this.data.isShowLoading
    })
  },
  //领取卡券
  addCard(datas) {
    this.isShowLoading()
    let _data = {
      cardId: this.data.cardId,
      cardExt: this.data.cardExt
    }
    method.addCard(_data).then(res => {
      console.log("卡券返回", res)
      if (res.errMsg == "addCard:ok") {
        let _data = {
          user_id: wx.getStorageSync('_login').user_id,
          card_id: res.cardList[0].cardId,
          card_code: res.cardList[0].code,
          stores_id: this.data.storeList[this.data.storeList_index].d_id,
          order_id: this.data.order_id,
          user_prize_id: this.data.user_prize_id,
          activity_id: this.data.activity_id
        }
        Object.assign(_data, datas)
        this.cardEnd(_data)
      } else {
        this.isShowLoading()
        alert.alert({
          str:"卡券领取失败"
        })
      }
    }).catch(err => {
      console.log("err", err)
      this.isShowLoading()
      alert.alert({
        str:"卡券领取失败"
      })
    })
  },
  //门票奖品卡券关联最后一步1(卡券版)
  ticketCardEnd(data) {
    request_02.cardRelation(data).then(res => {
      console.log("球票专用接口返回", res)
      if (res.data.status == 1) {
        console.log("卡券关联成功OK")
        setTimeout(() => {
          alert.alert({
            str:"信息提交成功"
          })
          setTimeout(() => {
            router.jump_back()
          }, 1000)
        }, 1000)
      } else {
        alert.alert({
          str:"服务器异常，请稍后再试"
        })
      }
    }).catch(err => {
      alert.alert({
        str:"服务器异常，请稍后再试"
      })
    })
  },
  //一年使用用关联最后一步
  ticketUpload(data) {
    alert.loading({
      str:"提交中"
    })
    request_02.ticketUpload(data).then(res => {
      console.log("球票专用接口返回", res)
      if (res.data.status == 1) {
        setTimeout(() => {
          alert.loading_h()
          alert.alert({
            str:"信息提交成功"
          })
          setTimeout(() => {
            router.jump_back()
          }, 1000)
        }, 1000)
      } else {
        this.isShowLoading()
        alert.alert({
          str:"服务器异常，请稍后再试"
        })
      }
    }).catch(err => {
      this.isShowLoading()
      alert.alert({
        str:"服务器异常，请稍后再试"
      })
    })
  },
  //除了门票的其它奖品卡券关联最后一步
  cardEnd(data) {
    request_02.cardSet(data).then(res => {
      console.log("卡券关联成功", res)
      if (res.data.status == 1) {
        console.log("卡券关联成功OK")
        this.isShowLoading()
        this.setData({
          receiveHidden: true
        })
      }
    }).catch(err => {
      this.isShowLoading()
      alert.alert({
        str:"服务器异常，请稍后再试"
      })
    })
  },
  cardEnd(data) {
    request_02.cardSet(data).then(res => {
      console.log("卡券关联成功", res)
      if (res.data.status == 1) {
        console.log("卡券关联成功OK")
        this.isShowLoading()
        this.setData({
          receiveHidden: true
        })
      }
    }).catch(err => {
      this.isShowLoading()
      alert.alert({
        str:"服务器异常，请稍后再试"
      })
    })
  },
  //确定
  confirmBtn() {
    this.setData({
      receiveHidden: false
    })
    router.jump_back()
  },
  //名字
  oNameInput(e) {
    let text = e.detail.value;
    this.setData({
      oName: text
    })
  },
  //联系电话
  oTelInput(e) {
    let text = e.detail.value;
    this.setData({
      oTel: text
    })
  },
  //详细地址
  myAddInput(e) {
    let text = e.detail.value;
    this.setData({
      myAdd: text
    })
  },
  //验证码
  oCodeInput(e) {
    let text = e.detail.value;
    this.setData({
      oCode: text
    })
  },
  //城市
  oCodeCity(e) {
    let text = e.detail.value;
    this.setData({
      city: text
    })
  },
  //所在城市的picker
  bindRegionChange: function (e) {
    this.setData({
      region: e.detail.value
    })
    if (this.data.ortherType != 2) this.getStoreList()
  },
  //专营店picker
  bindStoreChange(e) {
    this.setData({
      storeList_index: e.detail.value
    })
  },
  bindOtherChange(e) {
    this.setData({
      orther_index: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("跳转到这个页面所带的参数", options)
    this.setData({
      delta: options.delta || 9999,
      cardId: options.cardId,
      cardExt: options.cardExt,
      order_id: options.order_id || '',
      user_prize_id: options.user_prize_id,
      product_id: options.id || '',
      activity_id: options.activity_id || '',
      prize_type: options.prize_type,//
      other: options.other || '',
      prevUrl: decodeURIComponent(options.prevUrl),
      curPrizeId: options.curPrizeId
    })
    this.pageInit()
    setTimeout(() => {
      this.setData({
        show: false
      })
    }, 300)
  },
  pageInit() {
    this.setData({
      oTel: wx.getStorageSync("userInfo").phone || '',
      oName: wx.getStorageSync("userInfo").name || ''
    })
    if (this.data.product_id == 1 || this.data.product_id == 122 ||this.data.curPrizeId == 7) {
      wx.setNavigationBarTitle({ title: '完善信息' })
    }
    if (this.data.product_id == 1 　|| this.data.product_id == 122 || this.data.product_id == 2) {
      this.goodsDetail()
    } else {
      if (this.data.curPrizeId != 7) this.getPosition()
    }
  },
  goodsDetail() {
    request_02.goodsDetail({ user_id: wx.getStorageSync('_login').user_id, id: this.data.product_id }).then(res => {
      console.log("商品详情：", res)
      this.getPosition()
      let _ortherType = res.data.data.attr[0].attr_value.length > 5 ? 2 : 1
      let _ortherList = res.data.data.attr
      _ortherList = _ortherList.filter(item => {
        return item.num > 0
      })
      if (_ortherList.length == 0) _ortherList = [{ attr_value: '暂无可用场次' }]
      this.setData({
        ortherType: _ortherType,
        ortherList: _ortherList
      })
    })
  },
  getPosition() {
    let _this = this
    alert.loading({
      str:"自动定位中"
    })
    // 实例化API核心类
    this.qqmapsdk = new QQMapWX({
      key: 'GW3BZ-NMN6J-JSEFT-FTC6R-F7DA3-Z3FVJ'
    })
    this.qqmapsdk.reverseGeocoder({
      success: res => {//成功后的回调
        console.log("定位后返回", res)
        // this.showHideModal()
        let _address_component = res.result.address_component
        let _city = _address_component.province + _address_component.city
        this.setData({ region: [_address_component.province, _address_component.city, _address_component.district] })
        let _data = {
          // lon: res.result.location.lng,
          // lat: res.result.location.lat
          province: this.data.region[0],
          city: this.data.region[1],
          district: this.data.region[2]
        }
        request_02.getStoreList(_data).then(res => {
          console.log("门店列表", res)
          alert.loading_h()
          this.setData({
            city: _city,
            storeList: res.data.data
          })
          this.setData({ isGetPhoneNumber: true })
        })
        alert.loading_h()
        if (_this.data.ortherType != 2) this.getStoreList()
      },
      fail: function (error) {
        if (_this.data.showModal.isShow) return
        _this.showHideModal()
        console.error("定位失败", error)
        alert.alert({
          str:"定位失败"
        })
      },
      complete: function (res) {
        //console.log(res)
      }
    })
  },
  //查询门店列表
  getStoreList() {
    let _data = {
      // lon: this.data.lon,
      // lat: this.data.lat,
      province: this.data.region[0],
      city: this.data.region[1],
      district: this.data.region[2]
    }
    request_02.getStoreList(_data).then(res => {
      console.log("门店列表", res)
      if (res.data.data.length == 0) {
        this.setData({ storeList: [{ name: '请重新选择所在城市' }] })
        alert.alert({
          str:"该地区暂无专营店，请重新选择"
        })
      } else {
        this.setData({ storeList: res.data.data })
      }
    })
  },
  //打开、关闭自定义Modal弹框
  showHideModal() {
    let _showModal = this.data.showModal
    _showModal.isShow = !_showModal.isShow
    this.setData({ showModal: _showModal })
  },
  //获取手机号组件返回
  getPhoneNumber(e) {
    console.log("获取手机号组件返回", e)
    this.setData({ oTel: e.detail.phone })
  },
  //点击自定义Modal弹框上的确定按钮
  operation(e) {
    if (e.detail.confirm) {
      auth.openSetting().then((res)=>{//用户自行从设置勾选授权后
        if (res.authSetting["scope.userLocation"]) {
          this.getPosition()
        }
      })
      this.showHideModal()
    } else {
      alert.loading({
        str:""
      })
      this.showHideModal()
      setTimeout(() => {
        alert.loading_h()
        this.showHideModal()
      }, 600)
    }
  }
})