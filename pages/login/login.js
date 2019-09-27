// pages/login/login.js
const app = getApp();

const auth = require('../../utils/tool/authorization.js');

const alert = require('../../utils/tool/alert.js');

const router = require('../../utils/tool/router.js');

const request_02 = require('../../utils/request/request_02.js');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    IMGSERVICE: app.globalData.IMGSERVICE,
    isShowLogo: true,
    isShowButton: true,
    isLogin: false,
    loginNum: 0
  },
  getUserInfo(e) {
    if (this.data.isLogin) return;
    this.setData({ isLogin: true})
    const detail = e.detail;
    const userInfo = e.detail.userInfo;
    console.log('【btn授权按钮获取用户信息】', userInfo)
    if (userInfo) {
      //loading
      alert.loading({
        str:"登录中"
      })
      this.data.userInfo = userInfo;
      this.myLogin({
        detail
      })
    } else {
      alert.confirm({
        title:'授权', 
        content:'为了更好的体验，请先授权',
      })
      this.setData({ isLogin: false })
    }
  },
  //登录
  myLogin({ detail }) {
    //wx.login 获取 code
    auth.login().then((value) => {
      console.log('【wx.login】', value)
      //getOpenid
      return request_02.getOpenid({
        code: value.code,
        parent_id: wx.getStorageSync('parent_id') || '',
        channel_id: wx.getStorageSync('channel_id') || ''
      })
    }).then((value) => {
      this.data.login = value.data.data;
      console.log('【getOpenid】', value)
      if (value.data.status == 1) {
        request_02.uploadUserInfo({
          user_id: this.data.login.id,
          nickname: this.data.userInfo.nickName,
          headimg: this.data.userInfo.avatarUrl
        }).then(res => {
          console.log('【上传头像昵称成功】')
          alert.loading_h()
          //userInfo保存至本地
          wx.setStorageSync("userInfo", this.data.userInfo)
          //user_id保存至本地
          wx.setStorageSync("_login", { openid: this.data.login.openid, user_id: this.data.login.id, session_key: this.data.login.session_key })
          if (wx.getStorageSync("shareUrl")) {
            router.jump_red({
              url:`/${wx.getStorageSync("shareUrl")}`
            })
            wx.removeStorageSync("shareUrl")
          } else {
            router.jump_red({
              url:"/pages/index/index"
            })
          }
        })
      } else {
        console.log("【服务器异常，请稍后再试】")
        if (this.data.loginNum < 5) {
          this.myLogin({ detail })
          this.data.loginNum++
        } else {
          alert.loading_h()
          this.data.loginNum = 0
          this.setData({ isLogin: false })
        }
      }
    })
  },
  onLoad: function () {

  },
  onShow() {
    setTimeout(() => {
      this.setData({ isShowLogo: false })
      setTimeout(() => {
        this.setData({ isShowButton: false })
      }, 600)
    }, 600)
  }
})