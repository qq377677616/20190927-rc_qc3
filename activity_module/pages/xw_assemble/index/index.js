// activity_module/pages/xw_assemble/index/index.js
const app = getApp(); //获取应用实例
import { ASSEMBLEAssembleIndex, ASSEMBLELunchAssemble, ASSEMBLEJoinAssemble, ASSEMBLEReceivePrize, COMMONLogin, USERPostUserInfo, USERGetUnionid, USERGetUserDatabaseInfo, ASSEMBLEAssembleShareLog } from '../../../../xw_api/index.js'
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
    isVisibleRule: false,
    isVisibleLunchForm: false,//发起拼团留资
    isVisibleJoinForm: false,//参加拼团留资
    indexData: {},
    countDown: 0,
    countDownFormat: {},
    otherTuan: [],
    countDownFormatList: [],
    isVisibleActivityStateConfirm: false,
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
      let indexData = this.data.indexData
      //获取用户admin信息
      let userAdmin = getUserAdmin({
        isOwnerVip: indexData.activity_info.car_owner
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
   * 
   * @param {*} options 
   */
  initData(options) {
    loading({
      title: '加载中'
    })
    Promise.all([
      ASSEMBLEAssembleIndex({
        data: {
          out_id: options.out_id,//活动ID
          openid: userInfo.openid,//用户openid
        }
      })
    ]).then((res) => {
      const { msg: msg0, status: status0, data: data0 } = res[0].data

      if (status0 == 1) {
        //当前活动倒计时相关处理
        let countDown = 0
        let countDownFormat = {}
        countDown = data0.card_info.count_down
        countDownFormat = {
          day: '00',
          hours: '00',
          minutes: '00',
          seconds: '00'
        }

        //其它活动倒计时相关处理
        let otherTuan = []
        let countDownFormatList = []
        otherTuan = data0.other_tuan.map((item) => {
          countDownFormatList.push(`00:00:00`)
          return Object.assign({}, item)
        })

        //活动进行状态
        let isVisibleActivityStateConfirm = false
        isVisibleActivityStateConfirm = data0.activity_info.status === 2

        //
        let params = this.data.params
        params.out_id = options.out_id
        params.out_type = options.out_type


        this.setData({
          params,
          indexData: data0,
          countDown,//保存当前活动倒计时
          countDownFormat,
          otherTuan,
          countDownFormatList,
          isVisibleActivityStateConfirm,
        })

        //开启活动倒计时
        this.openCountDownHandler()
      } else {
        throw new Error(msg0)
      }
    }).catch((err) => {
      alert({
        title: err.message
      })
    }).then(() => {
      hideLoading()
      this.setData({
        options
      })
    })
  },
  /**
   * 规则显示隐藏
   */
  isRuleVisibleHandler() {
    let isVisibleRule = this.data.isVisibleRule
    this.setData({
      isVisibleRule: !isVisibleRule
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

      //其它团购商品
      let otherTuan = this.data.otherTuan
      let countDownFormatList = this.data.countDownFormatList
      otherTuan.forEach((item, index) => {
        if (typeof item.count_down === 'number' && item.count_down > 0) {
          item.count_down = item.count_down - 1
          timeFormat(item.count_down, function ({ day, hours, minutes, seconds }) {
            countDownFormatList[index] = `${hours}:${minutes}:${seconds}`
          })
          key = false
        } else {
          countDownFormatList[index] = `00:00:00`
        }
      })

      this.setData({
        otherTuan,
        countDownFormatList,
      })

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
   * 发起拼团
   */
  lunchAssembleHandler() {
    //该按钮需要验证授权、绑定车主
    let indexData = this.data.indexData
    //获取用户admin信息
    let userAdmin = getUserAdmin({
      isOwnerVip: indexData.activity_info.car_owner
    })
    let isPass = Object.values(userAdmin).every((item) => { return item })
    if (!Boolean(isPass)) return

    this.setData({
      isVisibleLunchForm: true
    })
  },
  /**
   * 参加拼团
   */
  joinAssembleHandler(e) {
    //该按钮需要验证授权、绑定车主
    let indexData = this.data.indexData
    //获取用户admin信息
    let userAdmin = getUserAdmin({
      isOwnerVip: indexData.activity_info.car_owner
    })
    let isPass = Object.values(userAdmin).every((item) => { return item })
    if (!Boolean(isPass)) return

    let tuanid = e.currentTarget.dataset.tuanid
    this.setData({
      isVisibleJoinForm: tuanid
    })
  },
  /**
   * 发起拼团留资提交
   * @param {*} e 
   */
  lunchFormSubmitHandler(e) {
    loading({
      title: '提交中'
    })
    let { personalInfoValue, storeInfoValue } = e.detail
    let options = this.data.options
    ASSEMBLELunchAssemble({
      data: {
        openid: userInfo.openid,//string	用户OPENID
        out_id: options.out_id,//int	经销商活动ID
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
        isVisibleLunchForm: false
      })
    }).catch((err) => {
      hideLoading()
      alert({
        title: err.message
      })
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
    let isVisibleJoinForm = this.data.isVisibleJoinForm
    let options = this.data.options
    ASSEMBLEJoinAssemble({
      data: {
        openid: userInfo.openid,//string	用户OPENID
        out_id: options.out_id,//int	经销商活动ID
        tuan_id: isVisibleJoinForm,//int	团购ID
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
  lunckFormCancelHandler() {
    this.setData({
      isVisibleLunchForm: false
    })
  },
  /** */
  joinFormCancelHandler() {
    this.setData({
      isVisibleJoinForm: false
    })
  },
  /**
   * 发起拼团个人信息程序
   * @param {*} e 
   */
  lunchFormPersonalInfoHandler(e) {
    let personalInfo = this.data.personalInfo
    Object.assign(personalInfo, {
      value: e.detail
    })
    this.setData({
      personalInfo
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
   * 发起拼团专营店程序
   * @param {*} e 
   */
  lunckChangeStoreInfoHandler(e) {
    let storeInfo = this.data.storeInfo
    Object.assign(storeInfo, {
      value: e.detail.store
    })
    this.setData({
      storeInfo
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
   * 领取程序
   */
  receiveHandler() {
    let indexData = this.data.indexData
    let order_id = indexData.join_info.order_id
    if (Boolean(order_id)) {
      jump_nav(`/pages/order_detail/order_detail?order_id=${order_id}`);
    } else {
      loading({
        title: '领取中'
      })
      let indexData = this.data.indexData
      ASSEMBLEReceivePrize({
        data: {
          openid: userInfo.openid,//string	用户openid
          tuan_log_id: indexData.join_info.tuan_log_id,//int	团购记录ID
        }
      }).then((res) => {
        let options = this.data.options
        let { msg, status, data } = res.data
        hideLoading()

        if (status == 1) {
          this.initData(options)
          jump_nav(`/pages/order_detail/order_detail?order_id=${data.order_id}`);
        } else {
          throw new Error(msg)
        }
      }).catch((err) => {
        hideLoading()
        alert({
          title: err.message
        })
      })
    }
  },
  /**
   * 返回经销商首页
   */
  jumpHome() {
    jump_nav(`/activity_module/pages/xw_dealer/index/index`)
  },
  /**
   * 更多活动
   */
  moreActivityBtn() {
    jump_nav(`/activity_module/pages/xw_dealer/index/index`)
  },
  /**
   * 立即授权
   */
  authHandler(e) {
    let { errMsg, userInfo: newUserInfo = {}, iv, encryptedData } = e.detail
    if (errMsg === 'getUserInfo:ok') {
      //推送用户信息
      USERPostUserInfo({
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
        if (status == 1) {
          wx.setStorageSync("userInfo", Object.assign(userInfo, newUserInfo))
        } else {
          throw new Error(msg)
        }
        //获取unionid
        return USERGetUnionid({
          data: {
            user_id: userInfo.user_id, //用户ID
            openid: userInfo.openid,
            encrypted_data: encryptedData, //加密数据
            session_key: userInfo.session_key, //上一个接口获得的session_key
            iv: iv, //加密数据匹配的iv                
          }
        }).then((res) => {
          let { status, msg } = res.data
          if (status != 1) {
            throw new Error(msg)
          }

          //获取用户数据库信息
          return USERGetUserDatabaseInfo({
            data: {
              user_id: userInfo.user_id,
              openid: userInfo.openid,
            }
          }).then((res) => {
            let { status, msg, data } = res.data
            if (status == 1) {
              wx.setStorageSync("userInfo", Object.assign(userInfo, {
                user_type: data.user_type,
              }))
              this.closeAuthConfirmBtn()

            } else {
              throw new Error(msg)
            }
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
  bindHandler() {
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
    if (Boolean(options.scene)) {
      let scene = decodeURIComponent(options.scene)
      scene.split('&').forEach((item) => {
        if (item.split('=')[0] == 'o_i') {
          Object.assign(options, {
            out_id: item.split('=')[1]
          })
        }
      })
    }
    
    Object.assign(options, {
      out_type: 2
    })
    loading({
      title: '登录中'
    })
    COMMONLogin(() => {
      userInfo = wx.getStorageSync('userInfo');
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
    let indexData = this.data.indexData
    let options = this.data.options
    ASSEMBLEAssembleShareLog({
      data:{
        openid:userInfo.openid,//string	用户openID
        out_id:options.out_id,//int	经销商活动ID
        out_type:options.out_type,//int	活动类型 砍价-1 团购-2
        page_id:'28',//int	1-100的数字 不要重复
        page_name:'经销商团购首页',//string	页面名称 比如经销商团购首页
      }
    })
    /**
     * 活动1-进行中  3-已结束
     * 0-拼团中 1-拼团成功
     */
    if (e.from === 'button' &&
      (indexData.activity_info.status === 1 ||
        indexData.activity_info.status === 3) &&
      (indexData.join_info.status === 0 ||
        indexData.join_info.status === 1)) {

      return {
        // title: '',
        // imageUrl: ``,
        path: `/activity_module/pages/xw_assemble/o_assemble/o_assemble?tuan_id=${indexData.join_info.tuan_id}&openid=${userInfo.openid}&out_id=${options.out_id}&out_type=${options.out_type}&tuan_log_id=${indexData.join_info.tuan_log_id}`,
      };
    } else {

      return {
        // title: '',
        // imageUrl: ``,
        path: `/activity_module/pages/xw_assemble/index/index?out_id=${options.out_id}&out_type=${options.out_type}`,
      };

    }
  }
})