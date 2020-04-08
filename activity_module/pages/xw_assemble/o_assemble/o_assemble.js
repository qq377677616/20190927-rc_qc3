// activity_module/pages/xw_assemble/o_assemle/o_assemle.js
const app = getApp(); //获取应用实例
import { assembleDetail, receivePrize, joinAssemble, login, postUserInfo, getUnionid, getUserDatabaseInfo } from '../../../../xw_api/index.js'
import { alert, loading, hideLoading } from '../../../../xw_utils/alert.js'
import { timeFormat, getUserAdmin } from '../../../../xw_utils/tools.js'
import { jump_nav } from '../../../../xw_utils/route.js'

let userInfo = wx.getStorageSync('userInfo');

let timmer = null
Page({

  /**
   * 页面的初始数据
   */
  data: {
    IMGSERVICE: app.globalData.IMGSERVICE,
    personalInfo: {
      isVisible: true,
      value: {}
    },
    storeInfo: {
      isVisible: true,
      value: {}
    },
    params: {
      btnText: '提交'
    },
    options: {},
    oAssembleData:{},
    isVisibleJoinForm: false,//参加拼团留资
    countDown:0,
    countDownFormat:{},
    isVisibleAuthConfirm: false,
    isVisibleBindConfirm: false,
  },
  /**
   * 全局按钮效验器
   * @param {*} e 
   */
  globalValidationHandler(e) {
    let isValidation = e.target.dataset.isValidation === 'yes'
    if (Boolean(isValidation)) {
      let oAssembleData = this.data.oAssembleData
      //获取用户admin信息
      let userAdmin = getUserAdmin({
        isOwnerVip: oAssembleData.tuan_info.car_owner
      })

      for (let prop in userAdmin) {
        let item = userAdmin[prop]
        if (Boolean(item)) {
          //该项权限为true，直接跳过该轮循环
          continue
        }
        if (prop === 'isAuthState') {
          //需要收取按
          this.setData({
            isVisibleAuthConfirm: true
          })
          break
        } else if (prop === 'isBindState') {
          //需要绑定车主
          this.setData({
            isVisibleBindConfirm: true
          })
          break
        }
      }
    }
  },
  /**
   * 初始化
   * @param {*} options 
   */
  initData(options) {
    loading({
      title: '加载中'
    })
    Promise.all([
      assembleDetail({
        data: {
          openid: options.openid || userInfo.openid,//string	用户OPENID
          tuan_id: options.tuan_id,//int	团购ID
        }
      }),
    ]).then((res) => {
      let { data: data0, msg: msg0, status: status0 } = res[0].data

      //当前活动倒计时相关处理
      let countDown = 0
      let countDownFormat = {}
      countDown = data0.tuan_info.count_down
      countDownFormat = {
        day: '00',
        hours: '00',
        minutes: '00',
        seconds: '00'
      }

      this.setData({
        oAssembleData:data0,
        countDown,//报存当前活动倒计时
        countDownFormat,
      })
      //开启活动倒计时
      this.openCountDownHandler()
    }).catch((err) => {
      alert({
        title: err.message
      })
    }).then(() => {
      hideLoading()
      Object.assign(options,{
        isSelf:options.openid === userInfo.openid
      })
      this.setData({
        options
      })
    })
  },
  /**
   * 开启活动倒计时
   */
  openCountDownHandler() {

    this.clearInterval()


    timmer = setInterval(() => {
      let key = true

      //当前团购商品
      let countDown = this.data.countDown
      let countDownFormat = this.data.countDownFormat
      if (typeof countDown === 'number' && countDown > 0) {
        countDown--
        timeFormat(countDown, function ({ day, hours, minutes, seconds }) {
          countDownFormat = {
            day,
            hours,
            minutes,
            seconds
          }
        })
        this.setData({
          countDownFormat,// 时间格式化
          countDown,//更新当前活动倒计时
        })

        key = false
      } else {
        this.setData({
          countDownFormat: {
            day: '00',
            hours: '00',
            minutes: '00',
            seconds: '00'
          }
        })
      }

      //
      if (key) {
        this.clearInterval()
      }
    }, 1000)
  },
  /**
   * 清除定时器 
   */
  clearInterval() {
    clearInterval(timmer)
    timmer = null
  },
  /**
   * 领取程序
   */
  receiveHandler() {
    loading({
      title: '领取中'
    })
    let options = this.data.options
    receivePrize({
      data: {
        openid: userInfo.openid,//string	用户openid
        tuan_log_id: options.tuan_log_id,//int	团购记录ID
      }
    }).then((res) => {
      let { msg, status } = res.data
      hideLoading()

      if (status == 1) {
        this.initData(options)
      } else {
        throw new Error(msg)
      }
    }).catch((err) => {
      hideLoading()
      alert({
        title: err.message
      })
    })
  },
  /**
   * 参加拼团
   */
  joinAssembleHandler() {
    //该按钮需要验证授权、绑定车主
    let oAssembleData = this.data.oAssembleData
    //获取用户admin信息
    let userAdmin = getUserAdmin({
      isOwnerVip: oAssembleData.tuan_info.car_owner
    })
    let isPass = Object.values(userAdmin).every((item) => { return item })
    if (!Boolean(isPass)) return
    this.setData({
      isVisibleJoinForm: true
    })
  },
  /**
   * 参加拼团留资提交
   * @param {*} e 
   */
  joinFormSubmitHandler(e) {
    loading({
      title: '提交中'
    })
    let { personalInfoValue, storeInfoValue } = e.detail
    let options = this.data.options
    joinAssemble({
      data: {
        openid: userInfo.openid,//string	用户OPENID
        out_id: options.out_id,//int	经销商活动ID
        tuan_id: options.tuan_id,//int	团购ID
        address_id: personalInfoValue.address_id,//int	收货地址ID
        data_code: storeInfoValue.code,//string	留资转营店编码
      }
    }).then((res) => {
      let { msg, status } = res.data
      hideLoading()

      if (status == 1) {
        this.initData(options)
      } else {
        throw new Error(msg)
      }
      this.setData({
        isVisibleJoinForm: false
      })
    }).catch((err) => {
      hideLoading()
      alert({
        title: err.message
      })
    })
  },
  /** */
  joinFormCancelHandler() {
    this.setData({
      isVisibleJoinForm: false
    })
  },
  /**
   * 参加拼团个人信息程序
   * @param {*} e 
   */
  joinFormPersonalInfoHandler(e) {
    let personalInfo = this.data.personalInfo
    Object.assign(personalInfo, {
      value: e.detail
    })
    this.setData({
      personalInfo
    })
  },
  /**
   * 参加拼团专营店程序
   * @param {*} e 
   */
  joinChangeStoreInfoHandler(e) {
    let storeInfo = this.data.storeInfo
    Object.assign(storeInfo, {
      value: e.detail.store
    })
    this.setData({
      storeInfo
    })
  },
  /**
   * 查看更多活动
   */
  moreActivityBtn(){
    jump_nav(`/activity_module/pages/xw_dealer/index/index`)
  },
  /**
   * 立即授权
   */
  authHandler(e) {
    let { errMsg, userInfo: newUserInfo = {}, iv, encryptedData } = e.detail
    console.warn(e)
    if (errMsg === 'getUserInfo:ok') {
      //推送用户信息
      postUserInfo({
        data: {
          user_id: userInfo.user_id,
          openid: userInfo.openid,
          nickname: newUserInfo.nickName,
          headimg: newUserInfo.avatarUrl,
          gender: newUserInfo.gender
        }
      }).then((res) => {
        //更新用户信息至本地
        let { status, msg } = res.data
        if( status == 1 ){
          wx.setStorageSync("userInfo", Object.assign(userInfo, newUserInfo))
        }else{
          throw new Error(msg)
        }
        //获取unionid
        return getUnionid({
          data:{
            user_id: userInfo.user_id, //用户ID
            openid: userInfo.openid,
            encrypted_data: encryptedData, //加密数据
            session_key: userInfo.session_key, //上一个接口获得的session_key
            iv: iv, //加密数据匹配的iv                
          }
        }).then((res)=>{
          let { status, msg } = res.data
          if( status != 1 ){
            throw new Error(msg)
          }

          //获取用户数据库信息
          return getUserDatabaseInfo({
            data:{
              user_id: userInfo.user_id,
              openid: userInfo.openid,
            }
          }).then((res)=>{
            let { status, msg, data } = res.data
            if( status == 1 ){
              wx.setStorageSync("userInfo", Object.assign(userInfo, {
                user_type: data.user_type,
              }))
              this.closeAuthConfirmBtn()

            }else{
              throw new Error(msg)
            }
          }).catch((err)=>{
            alert({
              title: err.message
            })
          })
        }).catch((err) => {
          alert({
            title: err.message
          })
        })
      }).catch((err) => {
        alert({
          title: err.message
        })
      })
    }
  },
  /**
   * 绑定车主程序
   */
  bindHandler(){
    this.closeBindConfirmBtn()
    jump_nav(`/pages/o_love_car/o_love_car?pageType=back`)
  },
  /**
   * 关闭授权confirm
   */
  closeAuthConfirmBtn() {
    this.setData({
      isVisibleAuthConfirm: false,
    })
  },
  /**
   * 关闭绑定车主confirm
   */
  closeBindConfirmBtn() {
    this.setData({
      isVisibleBindConfirm: false,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    options = {
      tuan_id:'1',
      openid:userInfo.openid,
      tuan_log_id:'1',
      out_id:'20'
    }
    loading({
      title: '登录中'
    })
    login(() => {
      hideLoading()
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
    let curSelectedAddress = app.globalData.currentAddressItem//当前选择收货人信息
    let personalInfo = this.data.personalInfo
    if (Boolean(curSelectedAddress.area)) {
      Object.assign(personalInfo, {
        value: curSelectedAddress
      })
      this.setData({
        personalInfo
      })
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (e) {
    let options = this.data.options
    let oAssembleData = this.data.oAssembleData

    if( oAssembleData.tuan_info.status === 0 ){
      //拼团中
      return {
        // title: '',
        // imageUrl: ``,
        path: `/activity_module/pages/xw_assemble/o_assemble/o_assemble?tuan_id=${options.tuan_id}&openid=${options.openid}&out_id=${options.out_id}&tuan_log_id=${options.tuan_log_id}`,
      };
    }else{
      //拼团成功、拼团失败
      return {
        // title: '',
        // imageUrl: ``,
        path: `/activity_module/pages/xw_assemble/index/index?out_id=${options.out_id}`,
      };
    }
  }
})