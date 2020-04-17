// pages/one_yard/one_yard.js
const request_01 = require('../../utils/request/request_01.js');

const request_05 = require('../../utils/request/request_05.js');

const router = require('../../utils/tool/router.js');

const tool = require('../../utils/tool/tool.js');

import api from '../../utils/request/request_03.js'

import QQMapWX from '../../utils/other/qqmap-wx-jssdk.min.js'
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        IMGSERVICE: app.globalData.IMGSERVICE,
        storeList: [], //专营店列表
        storeList_index: 0,
        car_index: 0,
        isGetPhone: false,
        wxPhone: '',
        code: '',
        name: '',
        isGetCode: 0,
        countDown: 60,
        firstShow: false,
		ways:0,//参与方式  1 预约  2 现场互动
		popshow:false,
		tool_id:-1,//展具类型id
		is_data:-1,//是否留资
		addinfo:null,//地址信息
		isfirst:1,
		out_id:null,
		dlr_code:null,// 专营店编码
    },

    //获取手机号
    getPhoneNumber(e) {
        if (!e.detail.encryptedData) return
        let _data = {
            user_id: wx.getStorageSync("userInfo").user_id,
            encrypted_data: e.detail.encryptedData,
            session_key: wx.getStorageSync("userInfo").session_key,
            iv: e.detail.iv
        }
        api.getPhoneNumber(_data).then(res => {
            console.log("res", res)
            if (res.data.status == 1) {
                this.setData({
                    phone: res.data.data.mobile,
                    wxPhone: res.data.data.mobile,
                    isGetPhone: true
                })
                let _userInfo = wx.getStorageSync("userInfo")
                _userInfo.mobile = res.data.data.mobile
                wx.setStorageSync("userInfo", _userInfo)
            }
        })
    },

    //使用微信手机号
    wxPhone() {
        if (!wx.getStorageSync('userInfo').mobile) return
        this.setData({
            isGetPhone: true,
            phone: this.data.wxPhone
        })
    },

    // 初始化数据
    initData(options) {
        let openid = wx.getStorageSync('userInfo').openid;
        let mobile = wx.getStorageSync('userInfo').mobile;
        if (mobile) {
            this.setData({
                wxPhone: mobile
            })
        }
		this.setData({options:options})
        let small_activity_id = '';
        if (options.scene) {
            let scene = decodeURIComponent(options.scene);
            console.log(scene)
            scene.split('&').forEach((item) => {
                console.log(item.split('='))
                if (item.split('=')[0] == 's_i') { //找到车展id
                    small_activity_id = item.split('=')[1]
                }
            })
        } else {
            small_activity_id = options.s_i;
        }
        request_05.autoshowIndex({
            small_activity_id,
            openid
        }).then(res => {
            console.log(res, 'res')
            if (res.data.status == 1) {
                this.setData({
                    selCarList: res.data.data.car_list,
                    storeList: res.data.data.dlr_code,
                    banner: res.data.data.banner,
                    small_activity_id,
					out_id: res.data.data.out_id,
					tool_id: res.data.data.tool_id,
					is_data: res.data.data.is_data,
                    options,
					addinfo: res.data.data.data_info ? res.data.data.data_info:this.data.data_info,
					dlr_code: res.data.data._dlr_code
                })
                if (res.data.data.status == 2) {
                    this.setData({
                        isVehicleOwnerHidePop: true,
                        popType: 1,
                        text: "活动预计" + res.data.data.start_date + "号开启 敬请期待"
                    })
                } else if (res.data.data.status == 3) {
                    this.setData({
                        isVehicleOwnerHidePop: true,
                        popType: 1,
                        text: "活动已结束"
                    })
                }
				this.data.isfirst == 1 ? this.setData({ isfirst: ++this.data.isfirst}):this.goback();
				console.log(this.data.isfirst);
            } else {
                tool.alert(res.data.msg)
            }
        })
    },

    // 提交
    submit() {
        let _reg = /^1[3456789]\d{9}$/
        if (!this.data.phone) {
            tool.alert("手机号不能为空")
            return
        } else if (!_reg.test(this.data.phone)) {
            tool.alert("手机号格式有误")
            return
        } else if (!this.data.isGetPhone && !this.data.code) {
            tool.alert("请输入短信验证码")
            return
        }
        if (!this.data.name) {
            tool.alert("请输入您的真实姓名")
            return
        }
        let openid = wx.getStorageSync('userInfo').openid;
        let small_activity_id = this.data.small_activity_id
        let name = this.data.name
        let mobile = this.data.phone
        let v_code = this.data.code
        let code = this.data.storeList[this.data.storeList_index].code
            // let car_id = this.data.selCarList[this.data.car_index].car_id
        request_05.autoshowData({
            openid,
            small_activity_id,
            name,
            mobile,
            code,
            // car_id,
            v_code
        }).then(res => {
            console.log(res, 'res')
            if (res.data.status == 1) {
                tool.alert(res.data.msg)
				this.initData(this.data.options);
            } else {
                tool.alert(res.data.msg)
            }
        })
    },

    //验证码输入
    inputCode(e) {
        this.setData({
            code: e.detail.value
        })
    },
    //姓名输入
    inputName(e) {
        this.setData({
            name: e.detail.value
        })
    },

    // 手机号
    inputPhone(e) {
        this.setData({
            phone: e.detail.value
        })
        if (this.data.wxPhone && this.data.wxPhone == e.detail.value) {
            this.setData({
                isGetPhone: true
            })
        } else {
            this.setData({
                isGetPhone: false
            })
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
        this.setData({
            isGetCode: 2
        })
        api.getVerificationCode({
            user_id: wx.getStorageSync("userInfo").user_id,
            phone: this.data.phone
        }).then(res => {
            console.log("res", res)
            if (res.data.status == 1) {
                tool.alert("短信发送成功")
                this.setData({
                    isGetCode: 1,
                    countDowns: this.data.countDown
                })
                let _auto = setInterval(() => {
                    if (this.data.countDown <= 0) {
                        clearInterval(_auto)
                        this.setData({
                            isGetCode: false,
                            countDown: this.data.countDowns
                        })
                    } else {
                        let _countDown = this.data.countDown
                        _countDown--
                        this.setData({
                            countDown: _countDown
                        })
                    }
                }, 1000)
            } else {
                tool.alert("服务器异常，请稍后再试")
            }
        }).catch(err => {
            console.log("err", err)
            tool.alert("验证码获取失败，请稍后再试~")
            this.setData({
                isGetCode: 0
            })
        })
    },

    // 选择专营店
    bindPickerStore(e) {
        const storeList_index = e.detail.value;
        console.log(storeList_index);
        this.setData({
            storeList_index,
        })
    },

    // 选择车型
    bindPickerCar(e) {
        const car_index = e.detail.value;
        console.log(car_index);
        this.setData({
            car_index,
        })
    },

    //判断是否授权和是否是车主
    isVehicleOwner(e) {
        console.log('e', e)
        if ((wx.getStorageSync("userInfo").nickName && wx.getStorageSync("userInfo").user_type == 1 && wx.getStorageSync("userInfo").unionid) || (e && e.target.dataset.type != 'ok') || (wx.getStorageSync("userInfo").nickName && !this.data.car_owner && wx.getStorageSync("userInfo").unionid)) return
        if (!wx.getStorageSync("userInfo").nickName || !wx.getStorageSync("userInfo").unionid) {
            this.setData({
                popType: 2
            })
        } else if (wx.getStorageSync("userInfo").user_type == 0 && this.data.car_owner) {
            this.setData({
                popType: 3
            })
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
        this.setData({
            isVehicleOwnerHidePop: !this.data.isVehicleOwnerHidePop
        })
    },

    //专营店列表
    // storeList() {
    //   request_05.carList().then(res => {
    //     let storeList = res.data.data
    //     var selStoreList = carList.map(function(item, index, array) {
    //       return item.car_series_alias;
    //     });
    //     this.setData({
    //       storeList,
    //       selStoreList,
    //     })
    //   })
    // },

    //查询门店列表
    // getStoreList() {
    //   api.getStoreList({
    //     city: this.data.region[1],
    //     lat: this.data.lat || '',
    //     lon: this.data.lon || '',
    //   }).then(res => {
    //     console.log("门店列表", res)
    //     tool.loading_h()
    //     if (res.data.data.length == 0) {
    //       this.setData({
    //         storeList: [{
    //           name: '请重新选择所在城市'
    //         }]
    //       })
    //       tool.alert("该地区暂无专营店，请重新选择")
    //     } else {
    //       this.setData({
    //         storeList: res.data.data
    //       })
    //     }
    //   })
    // },

    //手机号输入

    //定位
    // getPosition() {
    //   let _this = this
    //   tool.loading("自动定位中")
    //   this.qqmapsdk = new QQMapWX({
    //     key: 'GW3BZ-NMN6J-JSEFT-FTC6R-F7DA3-Z3FVJ'
    //   })
    //   console.log("this.qqmapsdk", this.qqmapsdk)
    //   this.qqmapsdk.reverseGeocoder({
    //     success: res => { //成功后的回调
    //       console.log("定位后返回", res)
    //       this.data.isSettingLocation = true
    //       let _address_component = res.result.address_component
    //       let _city = _address_component.province + _address_component.city
    //       this.setData({
    //         region: [_address_component.province, _address_component.city, _address_component.district]
    //       })

    //       let _data = {
    //         // lon: res.result.location.lng,
    //         // lat: res.result.location.lat,
    //         // province: this.data.region[0],
    //         city: this.data.region[1]
    //         // district: this.data.region[2]
    //       }
    //       this.setData({
    //         lon: res.result.location.lng,
    //         lat: res.result.location.lat,
    //       })
    //       tool.loading_h()
    //       if (this.data.type != 1) this.getStoreList()
    //     },
    //     fail: error => {
    //       console.error("定位失败", error)
    //       gets.isSetting("scope.userLocation").then(res => {
    //         this.data.isSettingLocation = res
    //         if (!res) tool.showModal("设置授权", "检测到您未打开位置授权开关，请点击[当前城市]右侧定位图标进行设置", "确定,#1351BA", false)
    //       })
    //       tool.alert("定位失败")
    //       tool.loading_h()
    //       if (this.data.type != 1) this.getStoreList()
    //     },
    //     complete: res => {
    //       //console.log(res)
    //     }
    //   })
    // },

    //车型列表
    // carList() {
    //   request_05.carList().then(res => {
    //     let carList = res.data.data
    //     var selCarList = carList.map(function(item, index, array) {
    //       return item.car_series_alias;
    //     });
    //     this.setData({
    //       carList,
    //       selCarList,
    //     })
    //   })
    // },

    //登录获取session_key，解密手机号用
    // myLogin() {
    //   tool.loading("")
    //   gets.login().then((value) => {
    //     return api.getSessionKey({
    //       code: value.code
    //       // parent_id: this.data.parent_id,
    //       // channel_id: this.data.channel_id
    //     })
    //   }).then((res) => {
    //     console.log("res", res)
    //     if (res.data.status == 1) {
    //       this.data.session_key = res.data.data.session_key
    //       console.log("【拿到session_key】", this.data.session_key)
    //       tool.loading_h()
    //       if (this.data.type != 3) this.getPosition()
    //     } else {
    //       tool.loading_h()
    //       console.log("【服务器异常，请稍后再试】")
    //       this.myLogin()
    //     }
    //   })
    // },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
		console.log(options);
        request_01.login(() => {
            this.initData(options);
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {
        this.setData({
            firstShow: true
        })
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function(){
		this.setData({ isfirst:1})
        let options = this.data.options
        if (this.data.firstShow) {
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
    onReachBottom: function(){

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function(){

    },
	checkway(e){
		let type = e.currentTarget.dataset.type;
		this.setData({ ways: type == this.data.ways ? 0 : type});
		// this.setData({ popshow: this.data.ways == 2});
		// console.log(type);	
	},
	closePop(){
		this.setData({popshow:false})
	},
	goback(){ // 根据展具id跳转
		// console.log(this.data.small_activity_id);return;
		let t_id = this.data.tool_id;
		let d_id = this.data.is_data;
		let addinfo = this.data.addinfo;
		let type = t_id == 1||t_id == 8? 1 : (t_id == 6 || t_id == 7) ? 6 : t_id;
		if (d_id == -1 || t_id==-1)return;
		console.log(type,"跳转类型");
		let dat = {
			success: d_id,
			activityid: this.data.out_id,
			appid: 'wx1d585c8c2fffe589',
			s_i: this.data.small_activity_id,
			name: addinfo ? addinfo.name : '',
			phone: addinfo ? addinfo.mobile : '',
			area: addinfo ? addinfo.dlr_name : ''
		};
		console.log(dat);
		switch(type){
			case 0:
				tool.jump_back();
				break;
			case 1:
				wx.navigateToMiniProgram({
					appId: 'wx8c6a68776ad26eeb',
					path: 'pages/index/index',
					extraData: {
						success: d_id,
						activityid: this.data.out_id,
						appid:'wx1d585c8c2fffe589',
						s_i: this.data.small_activity_id,
						name: addinfo ? addinfo.name : '',
						phone: addinfo ? addinfo.mobile : '',
						area: addinfo ? addinfo.dlr_name : '',
						dlr_code: this.data.dlr_code
					},
					envVersion: 'trial',//release
					success(res) {
						console.log('跳转成功');
					}
				})
				break;
			case 2:
			//其他操作
				wx.navigateToMiniProgram({
					appId: 'wx1520e6685337ea01',
					path: 'pages/index/index',
					extraData: {
						success: d_id,
						activityid: this.data.out_id,
						appid: 'wx1d585c8c2fffe589',
						s_i: this.data.small_activity_id,
						name: addinfo ? addinfo.name : '',
						phone: addinfo ? addinfo.mobile : '',
						area: addinfo ? addinfo.dlr_name : '',
						dlr_code: this.data.dlr_code
					},
					envVersion: 'trial',
					success(res) {
						console.log('跳转成功');
					}
				})
				break;
			case 3:
				wx.navigateToMiniProgram({
					appId: 'wx2ba9cb51465eee0f',
					path: 'pages/index/index',
					extraData: {
						success: d_id,
						activityid: this.data.out_id,
						appid: 'wx1d585c8c2fffe589',
						s_i: this.data.small_activity_id,
						name: addinfo ? addinfo.name:'',
						phone: addinfo ? addinfo.mobile : '',
						area: addinfo ? addinfo.dlr_name : '',
						dlr_code: this.data.dlr_code
					},
					envVersion: 'trial',
					success(res) {
						console.log('跳转成功');
					}
				})
				break;
			case 4:
				// tool.jump_back();
				// tool.alert("跳转h5");
				tool.jump_nav(`/activity_module/pages/webviews/webviews?url=https://2020qc.0v6.net/gameStatistics?aid=${addinfo.code}&dlr_code=${this.data.dlr_code}`)
				break;
			case 5:
				wx.navigateToMiniProgram({
					appId: 'wx5f4c100ae6bb86d1',
					path: 'pages/index/index',
					extraData: {
						success: d_id,
						activityid: this.data.out_id,
						appid: 'wx1d585c8c2fffe589',
						s_i: this.data.small_activity_id,
						name: addinfo ? addinfo.name : '',
						phone: addinfo ? addinfo.mobile : '',
						area: addinfo ? addinfo.dlr_name : '',
						dlr_code: this.data.dlr_code
					},
					envVersion: 'trial',
					success(res) {
						console.log('跳转成功');
					}
				})
				break;
			case 6:
				tool.jump_back();
				break;
		}
	},
	openPop(){ // 确认打开弹窗
		this.setData({ popshow:true});
	}
})