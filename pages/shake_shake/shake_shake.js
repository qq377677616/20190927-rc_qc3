// pages/shake_shake/shake_shake.js

const request_01 = require('../../utils/request/request_01.js');

const router = require('../../utils/tool/router.js');

const util = require('../../utils/tool/util.js');

const tool = require('../../utils/tool/tool.js') 

const request_05 = require('../../utils/request/request_05.js')

import api from '../../utils/request/request_03.js'

const app = getApp();//获取应用实例

Page({

  /**
   * 页面的初始数据
   */
  data: {
    IMGSERVICE: app.globalData.IMGSERVICE,
	  quanPop:false,  //第三次弹窗
    openAj:false,   //前两次弹窗
    rulspop:false,  //规则弹窗
    isSuc:false,    //领取成功弹窗
    isVehicleOwnerHidePop:false,
    isShowForm: false,  //留资弹窗
    formType: '',
    startShake:false,
    isOpen:true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    request_01.login(() => {
      this.initData(options);
    })
    this.setData({
      options,
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

  },

  initData(options) {
    let openid = wx.getStorageSync('userInfo').openid;
    let activity_id = options.activity_id;
    console.log('activity_id', activity_id)
    request_05.shakeDetail({openid,activity_id}).then(res=>{
      console.log(res)
      this.setRule()      //规则永久弹一次
      this.setData({
        activity_id,
        activity_info:res.data.data.activity_info,
        car_owner: res.data.data.activity_info.car_owner,  //车主
        shake_num: res.data.data.shake_info.shake_num,     //抽奖次数
      })
      // 用户抽奖完，是否领奖
      if(res.data.data.shake_info.shake_num==0){
        if (res.data.data.shake_info.is_receive==0){
          this.setData({
            quanPop: true,
            other_prize: res.data.data.other_prize,
            prize_log_id: res.data.data.prize_log_id,
            prize_info: res.data.data.prize_info
          })
        }else{
          router.jump_red({
            url: `/pages/friendHelp/friendHelp?activity_id=${activity_id}`,
          })
        }
      }
      // 判断活动状态  1-正常  2-活动未开始 3-活动已结束
      let activityStatus = res.data.data.activity_info.status;     //活动状态
      let shake_num = res.data.data.shake_info.shake_num;         //是否参与    
      if (activityStatus == 3) {
        if (shake_num == 3) {
          this.setData({
            isVehicleOwnerHidePop: true,
            popType: 1,
            text: "活动已结束"
          })
        } else {
          if (shake_num == 0) {
            this.setData({
              isVehicleOwnerHidePop: true,
              popType: 1,
              text: "活动已结束"
            })
          } else {
            router.jump_red({
              url: `/pages/friendHelp/friendHelp?activity_id=${activity_id}`,
            })
          }
        }
      }
    })

    if ((wx.getStorageSync("userInfo").user_type == 0 && this.data.car_owner) || !wx.getStorageSync("userInfo").nickName) return;

  },

  /*摇一摇2*/
  shake_one_shake2(callBack){
    var _this = this
    //首先定义一下，全局变量
    let lastTime = 0; //此变量用来记录上次摇动的时间
    let x = 0,
      y = 0,
      z = 0,
      lastX = 0,
      lastY = 0,
      lastZ = 0; //此组变量分别记录对应x、y、z三轴的数值和上次的数值
    let stsw = true // 开关，保证在一定的时间内只能是一次摇成功
    // if (!isOpen) {
    //   wx.stopAccelerometer()
    //   callBack({ status: 0 })
    //   return;
    // }

    wx.onAccelerometerChange(shake)
    //wx.startAccelerometer()
    //编写摇一摇方法
    function shake(acceleration) {
      let nowTime = new Date().getTime(); //记录当前时间
      //如果这次摇的时间距离上次摇的时间有一定间隔 才执行
      if (nowTime - lastTime > 100) {
        let diffTime = nowTime - lastTime; //记录时间段
        lastTime = nowTime; //记录本次摇动时间，为下次计算摇动时间做准备
        x = acceleration.x; //获取x轴数值，x轴为垂直于北轴，向东为正
        y = acceleration.y; //获取y轴数值，y轴向正北为正
        z = acceleration.z; //获取z轴数值，z轴垂直于地面，向上为正
        //计算 公式的意思是 单位时间内运动的路程，即为我们想要的速度
        let speed = Math.abs(x + y + z - lastX - lastY - lastZ) / diffTime * 10000;
        //console.log(speed)
        lastX = x; //赋值，为下一次计算做准备
        lastY = y; //赋值，为下一次计算做准备
        lastZ = z; //赋值，为下一次计算做准备
        if (speed > 100 && stsw) { //如果计算出来的速度超过了阈值，那么就算作用户成功摇一摇
          stsw = false
          // if (audio) {
          //   let audioCtx = wx.createAudioContext(audio.split(",")[0])
          //   audioCtx.setSrc(audio.split(",")[1]) //音频文件，第三方的可自行选择
          //   audioCtx.play() //播发音频
          // }
          // if (_this.data.isOpen) callBack({ status: 1 })
          if (_this.data.isOpen) _this.shakeOk()
          setTimeout(() => {
            stsw = true
          }, 2000)
        }
      }
    }
  },
  shakeOk() {
    let options = this.data.options;
    let openid = wx.getStorageSync('userInfo').openid;
    let activity_id = options.activity_id;
    this.setData({ isOpen : false })
    tool.alert("摇一摇成功")
    setTimeout(()=>{
      request_05.shake({ openid, activity_id }).then(res => {
        console.log(res);
        this.setData({
          prize_info: res.data.data.prize_info,
        })
        if (res.data.data.shake_num > 0) {
          this.setData({
            openAj: true,
          })
        } else {
          if (res.data.data.is_send_prize == 1) {
            this.setData({
              quanPop: true,
              other_prize: res.data.data.other_prize,
            })
          }
        }
      })
    },1000)
  },
  // 参与摇红包
  joinShake() {
    if ((wx.getStorageSync("userInfo").user_type == 0 && this.data.car_owner) || !wx.getStorageSync("userInfo").nickName) return;
    let options = this.data.options;
    let openid = wx.getStorageSync('userInfo').openid;
    let activity_id = options.activity_id;
    let isShake = true;
    if(this.data.shake_num==0){
      tool.alert('您的抽奖次数已经用完了哦~')
    }else{
      this.setData({ startShake : true })
      if (this.data.startShake) {
        this.shake_one_shake2()
      }
  }
},

  getPrize() {
    this.closeBtn();
    this.setData({ quanPop: !this.data.quanPop })
    this.setData({
      formType: 4,
      isShowForm: true,
    })
  },

  toFriendHelp(){
    let activity_id = this.data.activity_id;
    router.jump_red({
      url: `/pages/friendHelp/friendHelp?activity_id=${activity_id}`,
    })
  },

  // 点击再摇一次
  once() {
    this.isOpen();
    let options = this.data.options;
    this.initData(options); 
    this.joinShake();
    this.setData({ isOpen: true })
  },

  // 打开规则弹窗
  openRule() {
    this.isOpenRule();
  },

  //留资领取
  submit(e) {
    console.log("留资表单", e.detail)
    console.log('prize_log_id', this.data.prize_log_id)
    let _res = e.detail
    let _data = {
      user_id: wx.getStorageSync("userInfo").user_id,
      openid: wx.getStorageSync("userInfo").openid,
      prize_log_id: this.data.prize_log_id,
      name: _res.name,
      mobile: _res.phone,
      v_code: _res.code,
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
      prize_log_id: this.data.prize_log_id,
      data_id: data_id,
      card_code: card_code
    }
    api.cardCheck(_data).then(res => {
      console.log("卡券核销上报返回", res)
      if (res.statusCode == 200) {
        this.isShowLoading()
        // tool.alert("卡券领取成功")
        this.isShowForm()
        this.setData({ quanPop: false })
        this.isSuc()
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
    if (this.data.isHidePop && this.data.activityIsStartEnd != 1) {
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

  // 关闭规则弹窗
  closePop() {
    this.isOpenRule();
  },

  isSuc() {
    this.setData({ isSuc: !this.data.isSuc })
    let options = this.data.options
  },

  // 切换规则弹窗
  isOpenRule() {
    this.setData({ rulspop: !this.data.rulspop })
  },

  //关闭留资弹窗
  isShowForm() {
    this.setData({
      isShowForm: false,
    })
  },

  // 关闭前两次中奖弹窗
  isOpen() {
    this.setData({ openAj: !this.data.openAj })
    let options = this.data.options;
    this.initData(options)
    this.setData({ isOpen : true})
  },

  // 关闭第三次中奖弹窗
  closeBtn() {
    this.setData({ quanPop: !this.data.quanPop })
    let options = this.data.options;
    this.initData(options)
  },

  // 弹窗永久弹一次
  setRule() {
    if (!wx.getStorageSync("isRule").vote) {
      this.setData({ rulspop: true });
      let _isRule = wx.getStorageSync("isRule") || {}
      _isRule.vote = true
      wx.setStorageSync("isRule", _isRule)
    }
  },

  //判断是否授权和是否是车主
  isVehicleOwner(e) {
    if ((wx.getStorageSync("userInfo").nickName && wx.getStorageSync("userInfo").user_type == 1) || (e && e.target.dataset.type != 'ok') || (wx.getStorageSync("userInfo").nickName && !this.data.car_owner)) return;
    if (!wx.getStorageSync("userInfo").nickName) {
      this.setData({ popType: 2 })
    }
    else if (wx.getStorageSync("userInfo").user_type == 0) {
      this.setData({ popType: 3 })
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