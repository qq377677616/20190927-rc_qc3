//index.js
import tool from '../../utils/tool/tool.js'
import request_01 from '../../utils/request/request_01.js'
import api from '../../utils/request/request_03.js'
import utils from '../../utils/public/util.js'

Page({
  data: {
    IMGSERVICE: getApp().globalData.IMGSERVICE,
    type: 0,
    isHidePrize: true,
    isHidePop: true,
    step: 8 * 5,
    curIndex: 0,
    speed: 260,
    start_num: 6,
    isPrize: true,
    myPrize: '',
    isShowForm: false,
    formsType: 1,//0为门店弹窗、1为详细地址弹窗、2为看车弹窗、3为报名留资弹窗
    isShowLoading: false,
    loadingText: '卡券领取中',
    vehicle: { img: 'http://img2.imgtn.bdimg.com/it/u=3630752995,1992942569&fm=26&gp=0.jpg', title: 'T90MC 2.0L时尚版T90MC 2.0L时尚版T90MC 2.0L时尚版', price: '55.88'},
    isShowPop: true,
    isShowCode: false,
    code: '8888-8888-8888-8888',
    popData: {
      name: '这是一个奖品这是这是一个奖品这是',
      img: getApp().globalData.IMGSERVICE + '/center/car_bg.png'
    },
    iscarActive: false,
    activityIsStartEnd: 1,//活动状态1为进行中，2为未开始，3为已结束
    prize_info: {}
  },
  onLoad(opation) {
    console.log("opation", opation)
    this.setData({
      isShareEnter: opation.isShare,
      activity_id: opation.activity_id || '',
      userInfo: wx.getStorageSync("userInfo") || {}
    })
    request_01.login(() => { 
      this.getPrizeDetails() 
    })
  },
  //获取抽奖详情
  getPrizeDetails(){
    api.getPrizeDetails({ user_id: wx.getStorageSync("userInfo").user_id, activity_id: this.data.activity_id }).then(res => {
      console.log("res", res)
      if (res.data.status == 1) {
        this.setData({ 
          iscarActive: res.data.data.car_owner,
          activityIsStartEnd: res.data.data.status,    
          prizeDetails: res.data.data,
          ortherList: this.addArr(res.data.data.draw_log_list, 6)
        })
        if (!this.data.prizeDetails.transit) {
          this.setData({ type: 1 })
          this.startPrize()
        }
        this.setRule()
      }  
    })
  },
  //规则弹窗
  setRule(){
    if (!wx.getStorageSync("isRule").prize) {
      this.isHidePop()//弹出规则
      let _isRule = wx.getStorageSync("isRule") || {}
      _isRule.prize = true
      wx.setStorageSync("isRule", _isRule)
    } else {
      this.isActivityOpen()
    }
  },
  //获取奖品列表
  getPrizeList() {
    api.getPrizeList({ activity_id: this.data.activity_id }).then(res => {
      console.log("res", res)
      if (res.statusCode == 200) {
        this.setData({ prizeList: res.data.data})
        setTimeout(() => { this.setData({ isPrizeList: true }) }, 500)
      }
    })
  },
  //抽奖
  start() {
    if ((wx.getStorageSync("userInfo").user_type == 0 && this.data.iscarActive) || !wx.getStorageSync("userInfo").nickName) return
    let _self = this
    if (this.data.isPrize && wx.getStorageSync("userInfo").nickName) {
      if (this.data.prizeDetails.my_draw_num >= this.data.prizeDetails.draw_num) {
        tool.alert("您的抽奖机会用完啦~")
        return
      }
      api.getPrize({ user_id: wx.getStorageSync("userInfo").user_id, activity_id: this.data.activity_id }).then(res => {
        console.log(res)
        if (res.data.status == 1) {
          let _num = this.data.prizeList.findIndex(item => item.id == res.data.data.prize_info.prize_id)
          var _curIndex = this.data.curIndex
          var _speed = this.data.speed
          console.log("【" + this.data.prizeList[_num].prize_name + "】")
          var prize_num = _num + this.data.step - _curIndex - 1
          var _prize_num = 0
          var _auto = setTimeout(auto_prize, _speed)
          let _popData = {
            name: res.data.data.prize_info.prize_name,
            img: res.data.data.prize_info.prize_img,
            prize_log_id: res.data.data.prize_log_id
          }
          let _prizeDetails = this.data.prizeDetails
          _prizeDetails.my_draw_num++
          this.setData({
            prizeDetails: _prizeDetails,
            prize_info: res.data.data.prize_info,
            formsType: res.data.data.prize_info.prize_type == 2 ? '1' : '0', 
            popData: _popData,
            isPrize: false,
            myPrize: res.data.data.prize_info
          })
          function auto_prize() {
            clearInterval(_auto)
            if (_prize_num <= prize_num) {
              _prize_num++
              _curIndex++
              _curIndex = (_curIndex) % 10
              if (_prize_num < _self.data.start_num) {
                _speed -= 40
              } else if (_prize_num == _self.data.start_num) {
                _speed = 25
              } else if (_prize_num >= _self.data.start_num && _prize_num < _self.data.start_num * 4) {
                _speed += 6
              } else {
                _speed += 16
              }
              _auto = setInterval(auto_prize, _speed)
              _self.setData({ curIndex: _curIndex })
            } else {
              setTimeout(function () {
                // alert.confirm({ title: "抽奖结果", content: _self.data.prize[_self.data.curIndex].name, confirms: "好的,#00B26A", cancels: false })
                _self.isHidePrize()
                _self.getPrizeDetails()
                _self.setData({ isPrize: true })
              }, 300)
            }
          }
        } else {
          tool.alert("抽奖失败，请稍后再试")
          _self.setData({ isPrize: true })
        }
      })
    } 
  },
  //判断是否授权和是否是车主
  isVehicleOwner(e) {
    if ((wx.getStorageSync("userInfo").nickName && wx.getStorageSync("userInfo").user_type == 1) || (e && e.target.dataset.type != 'ok') || (wx.getStorageSync("userInfo").nickName && !this.data.iscarActive)) return
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
  //从过渡页立即参与抽奖
  startPrize() {
    this.setData({ type: 1 })
    request_01.login(() => { 
      this.getPrizeList() 
      // this.getPrizeDetails()
    })
    setTimeout(() => { this.setData({ isBtnOn: true }) }, 500)
  },
  //留资领取
  submit(e) {
    console.log("留资表单", e.detail)
    console.log("this.data._popData", this.data.popData)
    let _res = e.detail
    let _data = {
      user_id: wx.getStorageSync("userInfo").user_id,
      openid: wx.getStorageSync("userInfo").openid,
      prize_log_id: this.data.popData.prize_log_id,
      name: _res.name,
      mobile: _res.phone,
      v_code: _res.code ,
      dlr_code: _res.storeCode,
      area: _res.region.join(" "),
      address: _res.address || ''
    }
    api.pushForm(_data).then(res => {
      console.log("留资接口返回", res)
      if (res.data.status == 1) {
        let _data = res.data.data
        if (this.data.prize_info.prize_type == 1) {
          // let _cardExt = '{"nonce_str": "' + _data.card_info.nonceStr + '",  "timestamp": "' + _data.card_info.timestamp + '", "signature":"' + _data.card_info.signature + '"}'
          // console.log("_cardExt", _cardExt)
          // this.addCard(_data.card_info.card_id, _cardExt, _data.data_id)
          this.addCard([res.data.data.card_info], _data.data_id)
        } else if (this.data.prize_info.prize_type == 2) {
          tool.loading("信息提交中")
          setTimeout(() => {
            tool.loading_h()
            this.isShowForm()
            tool.showModal("领取成功", "您的信息已提交成功，近期将会有工作人员电话联系您，敬请留意~", "好的,#124DB8", false)
          }, 800)
        } else if (this.data.prize_info.prize_type == 3) {
          tool.loading("信息提交中")
          setTimeout(() => {
            tool.loading_h()
            this.setData({ code: _data.xuni_code })
            this.isShowForm()
            this.isShowCode()
          })  
        }
      } else {
        tool.alert(res.data.msg)
      }
    })
  },
  //领取卡券
  addCard(cardList, data_id) {
    this.isShowLoading()
    tool.addCard(cardList).then(res => {
      console.log("卡券返回", res)
      if (res.errMsg == "addCard:ok") {
        console.log("卡券领取成功")
        this.cardCheck(data_id, res.cardList[0].code)
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
  cardCheck(data_id, card_code) {
    let _data = {
      user_id: wx.getStorageSync("userInfo").user_id, 	
      prize_log_id: this.data.popData.prize_log_id, 	
      data_id: data_id,	 
      card_code: card_code
    }
    api.cardCheck(_data).then(res => {
      console.log("卡券核销上报返回", res)
      if (res.statusCode == 200) {
        this.isShowLoading()
        tool.alert("卡券领取成功")
        this.isShowForm()
        // if (this.data.prize_info.prize_type == 3) {
        //   this.isShowCode()
        // }
      }
    })
  },
  //自定义loading框
  isShowLoading() {
    this.setData({
      isShowLoading: !this.data.isShowLoading
    })
  },
  //留资弹窗打开、关闭
  isShowForm() {
    this.setData({ isShowForm: !this.data.isShowForm })
  },
  //抽奖规则弹窗
  isHidePop() {
    this.setData({ isHidePop: !this.data.isHidePop })
    console.log("this.data.activityIsStartEnd", this.data.activityIsStartEnd)
    if (this.data.isHidePop) this.isActivityOpen()
  },
  //活动是否正常开启
  isActivityOpen() {
    if (this.data.activityIsStartEnd != 1) {
      if (this.data.activityIsStartEnd == 2) {
        this.setData({ popType: 1, activePopText: '很抱歉，活动还没未开始，敬请期待~' })
      } else if (this.data.activityIsStartEnd == 3) {
        this.setData({ popType: 1, activePopText: '很抱歉，活动已结束' })
      }
      this.isVehicleOwnerHidePop()
    }
  },
  //中奖弹窗
  isHidePrize() {
    this.setData({ isHidePrize: !this.data.isHidePrize })
  },
  //点击中奖弹窗
  bindconfirm(e) {
    this.isHidePrize()
    if (e.detail.type == 1) {
      if (this.data.prize_info.prize_type != 4) {
        this.isShowForm()
      } else {
        tool.alert("v豆领取成功")
        this.getPrizeDetails()
      }
    } else {
      console.log("点击关闭")
    }
  },
  //兑换码弹窗
  isShowCode() {
    this.setData({ isShowCode: !this.data.isShowCode })
  },
  //当获取列表数量不足6条时补全6条
  addArr(arr, n) {
    let _length = arr.length
    if (_length >= n) return arr
    for (let i = 0; i < n - _length; i++) {
      arr.push({ nickname: '-', prize_name: '-', create_time: '-'})
    }
    return arr
  },
  //授权
  getUserInfo(e) {
    request_01.setUserInfo(e).then(res => {
      if (res) { 
        console.log("授权、上传头像昵称成功")
        this.setData({
          userInfo: wx.getStorageSync("userInfo")
        })
        this.start()
      }
    }).catch(err => { console.log("err", err) })
  },
  //复制
  setClipboar() {
    wx.setClipboardData({ data: this.data.code })
  },
  //跳转
  router(e) {
    if (!this.data.isPrize) {
      tool.alert('正在抽奖中,请稍后')
      return
    }
    tool.jump_nav(e.currentTarget.dataset.url)
  },
  jump() {
    if (!this.data.isPrize) {
      tool.alert('正在抽奖中,请稍后')
      return
    }
    tool.jump_red('/pages/index/index')
  },
   /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return{
      title: '玩转男篮世界杯，球票、手机、AJ球鞋天天送',
      path: '/pages/index/index?isShare=1&user_id=' + wx.getStorageSync('_login').user_id,
      imageUrl: this.data.IMGSERVICE + '/prize/share_prize.png'
    }
  }
})
