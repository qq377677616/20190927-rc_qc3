// pages/ev/ev_form/ev_form.js
// pages/ev/ev_index/ev_index.js
const request_01 = require('../../../utils/request/request_01.js');

const request_05 = require('../../../utils/request/request_05.js');

import api from '../../../utils/request/request_03.js'

import gets from '../../../utils/tool/authorization.js'

import https from '../../../utils/api/my-requests.js';

import QQMapWX from '../../../utils/qqmap-wx-jssdk.min.js'

const router = require('../../../utils/tool/router.js');

const tool = require('../../../utils/tool/tool.js');

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    IMGSERVICE: app.globalData.IMGSERVICE,
    countDown: 60,
    storeList: [],
    storeList_index: 0,
    time_index: 0,
    name:'',
    mobile:'',
    verify_code:'',
    number:'',
    car_index:0,
    isGetCode: 0,
    region: ['北京市', '北京市', '东城区'],
    showModalOption: {//定位 弹窗
		  isShow: false,
		  type: 0,
		  title: "获取位置信息",
		  test: "小程序将访问您的手机定位，自动定位到您当前所在城市信息。",
		  cancelText: "取消",
		  confirmText: "授权",
		  color_confirm: '#A3271F'
	  },
  },

  initData(options){
      // this.getPosition()
      let activity_id = options.activity_id
      let openid = wx.getStorageSync('userInfo').openid
      request_05.evIndex({ activity_id, openid }).then(res => {
        console.log(res, 'res')
        if (res.data.status == 1) {
            this.setData({
              activity_info: res.data.data.activity_info,
              time_arr:res.data.data.activity_info.time_arr,
              car_list:res.data.data.car_list,
              storeList:res.data.data.dealer_info,
              activity_id
            })
        } else {
            tool.alert(res.data.msg)
        }
      })
  },

  submit() {
    let _reg = /^1[3456789]\d{9}$/
    if (!this.data.name) {
      tool.alert("请输入您的真实姓名")
      return
    }
    if (!this.data.mobile) {
      tool.alert("手机号不能为空")
      return
    } else if (!_reg.test(this.data.mobile)) {
      tool.alert("手机号格式有误")
      return
    } else if (!this.data.verify_code) {
      tool.alert("请输入短信验证码")
      return
    }
    if (!this.data.number) {
      tool.alert("请输入您的新能源指标号码")
      return
    }
      let openid = wx.getStorageSync('userInfo').openid
      let user_id = wx.getStorageSync('userInfo').user_id
      let activity_id =this.data.activity_id
      let name = this.data.name
      let mobile = this.data.mobile
      let code = this.data.storeList[this.data.storeList_index].code
      let number = this.data.number
      let drive_time = this.data.time_arr[this.data.time_index]
      let car_id = this.data.car_list[this.data.car_index].car_id
      let verify_code = this.data.verify_code
    request_05.submitData({openid,activity_id,name,mobile,code,number,drive_time,car_id,verify_code}).then(res=>{
      console.log(res,'res')
      if(res.data.status==1){
        tool.alert(res.data.msg)
        let order_goods_id = res.data.data.order_goods_id
        setTimeout(() => {  
          request_05.getWechatCard({order_goods_id,user_id}).then(res=>{
            if(res.data.status==1){
              console.log(res,'res')
              wx.addCard({
                cardList: [res.data.data[0]],
                success(res){
                  tool.loading('领取中')
                  console.log(res.cardList[0].code,'card_code')
                  let card_code = res.cardList[0].code
                  request_05.orderCardCode({
                    order_goods_id,  
                    user_id,
                    card_code
                  }).then(res => {
                    console.log('update_card_code', res)
                    if (res.data.status == 1) {
                      tool.loading_h()
                      tool.alert('领取成功')
                      setTimeout(() => {
                        router.jump_back()
                      }, 500);
                    }
                  })
                },
                fail(){
                  setTimeout(() => {
                    router.jump_back()
                  }, 500);
                }
              })
            }else{
              tool.alert(res.data.msg)
            }
          })
        }, 500);
      }else{
        tool.alert(res.data.msg)
      }
    })
    // let data = {
    //   openid : wx.getStorageSync('userInfo').openid,
    //   user_id : wx.getStorageSync('userInfo').user_id,
    //   activity_id : this.data.activity_id,
    //   name : this.data.name,
    //   mobile : this.data.mobile,
    //   code : this.data.storeList[this.data.storeList_index].code,
    //   number : this.data.number,
    //   drive_time : this.data.time_arr[this.data.time_index],
    //   car_id : this.data.car_list[this.data.car_index].car_id,
    //   verify_code : this.data.verify_code,
    // }
    // this.demoFun(data).then(res=>{
    //   console.log(res)
    // })
  },

  // async demoFun(data){
  //   let order_goods_id = await this.submitData(data)
  //   console.log(order_goods_id,'order_goods_id')
  //   let cardList = await this.getWechatCard(order_goods_id,data[user_id])
  //   wx.addCard({
  //     cardList: [cardList],
  //     success(res){
  //       let card_code = res.cardList[0].code
  //       let result = this.orderCardCode(order_goods_id,data.user_id,card_code)
  //       console.log(result,'result')
  //     }
  //   })
  // },

  // // 留资
  // submitData(data){
  //   return new Promise((resolve,reject)=>{
  //     request_05.submitData(data).then(res=>{
  //       resolve(res.data.data.order_goods_id)
  //     }).catch(err=>{
  //       reject(err)
  //     })
  //   })
  // },

  // // 查卡券
  // getWechatCard(order_goods_id,user_id){
  //   return new Promise((resolve,reject)=>{
  //     request_05.getWechatCard(order_goods_id,user_id).then(res=>{
  //       resolve(res.data.data[0])
  //     }).catch(err=>{
  //       reject(err)
  //     })
  //   })
  // },

  // // 卡券上报
  // orderCardCode(order_goods_id,user_id,card_code){
  //   return new Promise((resolve,reject)=>{
  //     request_05.orderCardCode(order_goods_id,user_id,card_code).then(res=>{
  //       resolve(res)
  //     }).catch(err=>{
  //       reject(err)
  //     })
  //   })
  // },

    getInfo() {//定位
		  tool.loading("自动定位中")
		  https.getPosition().then((res) => {// 获取地理位置
			  // console.log(res.result.ad_info.location);
			  let locat = res.result.ad_info.location;
			  tool.loading_h();
			  this.getPosition();
			  // let dat = {
			  // 	lon: locat.lng,
			  // 	lat: locat.lat,
			  // 	page:0,
			  // 	limit:1
			  // }
			  // https.getInfo(dat).then((res) => {
			  // 	// console.log(res);
			  // 	if(res.data.code==1){
			  // 		tool.loading_h();
			  // 		// console.log(res);
			  // 		this.setData({useData:res.data.data[0]})
			  // 	}
			  // })
		  }).catch(err => {
			  console.log("定位失败", err)
			  //   tool.alert("定位失败")
			  tool.loading_h()
			  this.showHideModal()
		  })

    },
    
    // 自定义弹窗
	  showHideModal() {
		  let _showModalOption = this.data.showModalOption
		  _showModalOption.isShow = !_showModalOption.isShow
		  this.setData({ showModalOption: _showModalOption })
		  console.log(this.data.showModalOption)
	  },

    //查询门店列表
    getStoreList() {
      api.getStoreList({
        city: this.data.region[1],
        lat: this.data.lat||'',
        lon: this.data.lon||'',
      }).then(res => {
        console.log("门店列表", res)
        tool.loading_h()
        if (res.data.data.length == 0) {
          this.setData({ storeList: [{ name: '请重新选择所在城市' }] })
          tool.alert("该地区暂无专营店，请重新选择")
        } else {
          this.setData({ storeList: res.data.data })
        }
      })
    },

    // 切换门店
    bindPickerStore(e){
      this.setData({
        storeList_index:e.detail.value
      })
    },

    //切换日期
    bindPickerTime(e){
      this.setData({
        time_index:e.detail.value
      })
    },

    //切换车辆
    bindPickerCar(e){
      this.setData({
        car_index:e.detail.value
      })
    },
    
    //定位
    getPosition() {
      let _this = this
      tool.loading("自动定位中")
      this.qqmapsdk = new QQMapWX({
        key: 'GW3BZ-NMN6J-JSEFT-FTC6R-F7DA3-Z3FVJ'
      })
      console.log("this.qqmapsdk", this.qqmapsdk)
      this.qqmapsdk.reverseGeocoder({
        success: res => {//成功后的回调
          console.log("定位后返回", res)
          this.data.isSettingLocation = true
          let _address_component = res.result.address_component
          let _city = _address_component.province + _address_component.city
          this.setData({ region: [_address_component.province, _address_component.city, _address_component.district] })

          let _data = {
            // lon: res.result.location.lng,
            // lat: res.result.location.lat,
            // province: this.data.region[0],
            city: this.data.region[1]
            // district: this.data.region[2]
          }
          this.setData({
            lon: res.result.location.lng,
            lat: res.result.location.lat,
          })
          tool.loading_h()
          if (this.data.type != 1) this.getStoreList()
        },
        fail: error => {
          console.error("定位失败", error)
          gets.isSetting("scope.userLocation").then(res => {
            this.data.isSettingLocation = res
			  if (!res) this.getInfo();//tool.showModal("设置授权", "检测到您未打开位置授权开关，请点击[当前城市]右侧定位图标进行设置", "确定,#1351BA", false)
          })
          // tool.alert("定位失败")
          tool.loading_h()
          if (this.data.type != 1) this.getStoreList()
        },
        complete: res => {
          //console.log(res)
        }
      })
    },

  //获取验证码
  getCode() {
    if (this.data.isGetCode != 0) {
      tool.alert("您操作太频繁了，请稍后再试")
      return
    }
    let _reg = /^1[3456789]\d{9}$/
    if (!this.data.mobile) {
      tool.alert("请先输入手机号")
      return
    } else if (!_reg.test(this.data.mobile)) {
      tool.alert("手机号格式有误")
      return
    }
    this.setData({ isGetCode: 2 })
    api.getVerificationCode({ user_id: wx.getStorageSync("userInfo").user_id, phone: this.data.mobile }).then(res => {
      console.log("res", res)
      if (res.data.status == 1) {
        tool.alert("短信发送成功")
        this.setData({ isGetCode: 1, countDowns: this.data.countDown })
        let _auto = setInterval(() => {
          if (this.data.countDown <= 0) {
            clearInterval(_auto)
            this.setData({ isGetCode: false, countDown: this.data.countDowns })
          } else {
            let _countDown = this.data.countDown
            _countDown--
            this.setData({ countDown: _countDown })
          }
        }, 1000)
      } else {
        tool.alert("服务器异常，请稍后再试")
      }
    }).catch(err => {
      console.log("err", err)
      tool.alert("验证码获取失败，请稍后再试~")
      this.setData({ isGetCode: 0 })
    })
  },

  //姓名输入
  inputName(e) {
    this.setData({
      name: e.detail.value
    })
  },
  //手机号输入
  inputPhone(e) {
    this.setData({
      mobile: e.detail.value
    })
  },
  //验证码输入
  inputCode(e) {
    this.setData({
      verify_code: e.detail.value
    })
  },
  //新能源指标号码
  number(e) {
    this.setData({
      number: e.detail.value
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    request_01.login(()=>{
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})