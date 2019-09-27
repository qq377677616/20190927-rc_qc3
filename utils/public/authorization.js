// const app = getApp()
import mta from './mta_analysis.js'

//腾讯统计代码
const statistics = (appID) => {
  let opation = {
    "appID": appID,
    "eventID": parseInt(appID) + 1,
    "autoReport": true,
    "statParam": true,
    "ignoreParams": [],
    "statPullDownFresh": true,
    "statShareApp": true,
    "statReachBottom": true
  }
  mta.App.init(opation)
}
//登录
const login = () => {
  return new Promise((resolve, reject) => {
    wx.login({
      success: res => {
        resolve(res)
      }
    })
  })
}
/*检查登录态会话密钥session_key是否过期*/
const isCheckSession = callback => {
  wx.checkSession({
    success() {
      callback(true)
    },
    fail() {
      callback(false)
    }
  })
}
/*查询用户是否否授权了 scope*/
const isSettingScope = (scope, callback) => {
  wx.getSetting({
    success(res) {
      if (!res.authSetting[scope]) {
        wx.authorize({
          scope: scope,
          success() {//这里是用户同意授权后的回调
            callback({ status: 1, message: "用户已授权" })
          },
          fail() {//这里是用户拒绝授权后的回调
            callback({ status: 0, message: "用户未授权" })
          }
        })
      } else {//用户已经授权过了
        callback({ status: 2, message: "用户已经授权过了"})
      }
    }
  })
}
/*判断是否授权*/
const isSetting = callBack => {
  wx.getSetting({
    success: res => {
      //授过权
      if (res.authSetting['scope.userInfo']) {
        callBack(true)
        //未授权  
      } else {
        callBack(false)
      }
    }
  })
}
//打开授权设置
const openSetting = (callback) => {
  wx.openSetting({
    success(res) {
      if (callback) callback(res)
      console.log(res)
      console.log("【授权情况】")
      console.log(res.authSetting)
    }
  })
}
module.exports = {
  statistics,
  isCheckSession,
  isSettingScope,
  login,
  isSetting,
  openSetting
}