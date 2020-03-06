// components/forms/form.js
import tool from '../../utils/tool/tool.js'
import gets from '../../utils/tool/authorization.js'
import api from '../../utils/request/request_03.js'
import QQMapWX from '../../utils/qqmap-wx-jssdk.min.js'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    type: {
      type: String,
      value: '0'//0为门店弹窗、1为详细地址弹窗、2为看车弹窗、3为报名留资弹窗
    },
    vehicle: {
      type: Object,
      value: {}
    },
    btnText: {
      type: String,
      value: ''
    },
	popstu:{
		type: String,
		value:1
	}
  },

  /**
   * 组件的初始数据
   */
  data: {
    region: ['北京市', '北京市', '东城区'],
    storeList: [],
    storeList_index: 0,
    wxPhone: '',
    phone: '',
    code: '',
    name: '',
    isGetPhone: false,
    isSettingLocation: false,
    address: '',
    isChecked: true,
    isGetCode: 0,
    countDown: 60,
	isright:false
  },
  ready() {
    
  },
  /**
   * 组件的方法列表
   */
  methods: {
    //领取
    submit() {
      let _reg = /^1[3456789]\d{9}$/
      if (!this.data.phone) {
        tool.alert("手机号不能为空")
        return
      } else if (!_reg.test(this.data.phone)) {
        tool.alert("手机号格式有误")
        return
      } 
	  if (!this.data.name) {
        tool.alert("请输入您的真实姓名")
        return
      } if (this.data.type == 1 && !this.data.address) {
        tool.alert("请输入您的详细收货地址")
        return
      }
	 
      let _data = {
        phone: this.data.phone,
        name: this.data.name,
        storeCode: (this.data.type != 1 && this.data.type != 3) ? this.data.storeList[this.data.storeList_index].code : '',
        region: this.data.region,
        address: this.data.address,
        code: this.data.code
      }
		console.log(_data);
		// return;
	  this.setData({ isright: false,name:'',phone:'' })
      this.triggerEvent("submit", _data)
    },
    //登录获取session_key，解密手机号用
    myLogin() {
      tool.loading("")
      gets.login().then((value) => {
        return api.getSessionKey({
          code: value.code
          // parent_id: this.data.parent_id,
          // channel_id: this.data.channel_id
        })
      }).then((res) => {
        console.log("res", res)
        if (res.data.status == 1) {
          this.data.session_key = res.data.data.session_key
          console.log("【拿到session_key】", this.data.session_key)
          tool.loading_h()
          if (this.data.type != 3) this.getPosition()
        } else {
          tool.loading_h()
          console.log("【服务器异常，请稍后再试】")
          this.myLogin()
        }
      })
    },
    //获取手机号
    getPhoneNumber(e) {
      if (!e.detail.encryptedData) return
      let _data = {
        user_id: wx.getStorageSync("userInfo").user_id,
        encrypted_data: e.detail.encryptedData,
        session_key: this.data.session_key,
        iv: e.detail.iv
      }
      api.getPhoneNumber(_data).then(res => {
        console.log("res", res)
        if (res.data.status == 1) {
          this.setData({ phone: res.data.data.mobile, wxPhone: res.data.data.mobile, isGetPhone: true })
          let _userInfo = wx.getStorageSync("userInfo")
          _userInfo.mobile = res.data.data.mobile
          wx.setStorageSync("userInfo", _userInfo)
        }
      })
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
            if (!res) tool.showModal("设置授权", "检测到您未打开位置授权开关，请点击[当前城市]右侧定位图标进行设置", "确定,#1351BA", false)
          })
          tool.alert("定位失败")
          tool.loading_h()
          if (this.data.type != 1) this.getStoreList()
        },
        complete: res => {
          //console.log(res)
        }
      })
    },
    //所在城市的picker
    bindRegionChange: function (e) {
      this.setData({
        region: e.detail.value
      })
      if (this.data.type != 1) this.getStoreList()
    },
    //专营店picker
    bindStoreChange(e) {
      this.setData({
        storeList_index: e.detail.value
      })
    },
    //手机号输入
    inputPhone(e) {
	  let _reg = /^1[3456789]\d{9}$/;
      this.setData({ phone: e.detail.value })
      if (this.data.wxPhone && this.data.wxPhone == e.detail.value) {
        this.setData({ isGetPhone: true })
      } else {
        this.setData({ isGetPhone: false })
      }
	  if (_reg.test(this.data.phone)){
		  this.setData({ isright: true, popstu:1})
		  console.log('输入正确！')
		  this.getpot();
	  }
    },
    //获取验证码
    getCode() {
      if (this.data.isGetCode != 0) {
        tool.alert("您操作太频繁了，请稍后再试")
        return
      }
      let _reg = /^1[3456789]\d{9}$/
      if (!this.data.phone) {
        tool.alert("请先输入手机号")
        return
      } else if (!_reg.test(this.data.phone)) {
        tool.alert("手机号格式有误")
        return
      }
      this.setData({ isGetCode: 2 })
      api.getVerificationCode({ user_id: wx.getStorageSync("userInfo").user_id, phone: this.data.phone }).then(res => {
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
    //验证码输入
    inputCode(e) {
      this.setData({ code: e.detail.value })
    },
    //姓名输入
    inputName(e) {
	  let _reg = /^1[3456789]\d{9}$/;
      this.setData({ name: e.detail.value })
	//  if (_reg.test(this.data.phone)) {
	// 	this.setData({ isright: true })
	// 	console.log('输入正确！')
	// 	this.getpot();
	// }
    },
    //详细地址输入
    inputAddress(e) {
      this.setData({ address: e.detail.value })
    },
    //使用微信手机号
    wxPhone() {
      if (!wx.getStorageSync('userInfo').mobile) return
      this.setData({ isGetPhone: true, phone: this.data.wxPhone })
    },
    //使用其它手机号
    other() {
      this.setData({ isGetPhone: false, phone: '' })
    },
    //我同意
    isChecked() {
      this.setData({ isChecked: !this.data.isChecked })
    },
    //关闭当前
    close() {
      this.triggerEvent("close")
    },
    //打开系统设置页
    openSetting() {
      if (this.data.isSettingLocation) return
      gets.openSetting().then(res => {
        console.log("res", res)
        if (res.authSetting["scope.userLocation"]) {
          this.data.isSettingLocation = true
          this.getPosition()
        } else {
          console.log("您没有勾选设置")
        }
      })
    },
	getpot(){
		if (!wx.getStorageSync('userInfo').mobile) {
			this.myLogin()
		} else {
			this.setData({ wxPhone: wx.getStorageSync('userInfo').mobile })
			if (this.data.type != 3) this.getPosition()
		}
	}
  }
})
