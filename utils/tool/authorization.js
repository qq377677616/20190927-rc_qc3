//腾讯统计代码
const statistics = (mta) => {
    mta.App.init({
        "appID": "500687087",
        "eventID": "500687088",
        "autoReport": true,
        "statParam": true,
        "ignoreParams": [],
        "statPullDownFresh": true,
        "statShareApp": true,
        "statReachBottom": true
    })
}

//获取用户个人信息(普通微信)
const getUser = () => {
    return new Promise((resolve, reject)=>{
        wx.getUserInfo({
            success(value){
                resolve(value)
            },
            fail(reason){//失败
                resolve(reason)
            }
        })
    })
}

//检查登录态会话密钥session_key是否过期
const isCheckSession = () => {
    return new Promise((resolve, reject)=>{
        wx.checkSession({
            success() {//未过期，并且在本生命周期一直有效
                resolve()
            },
            fail() {//已经失效，需要重新执行登录流程
                reject()
            }
        })
    })
}

//登录后获取openid和session_key（普通微信）
const login = () => {
    return new Promise((resolve, reject) => {
        wx.login({
            success(res){
                resolve(res)
            },
            fail(reason){//失败
                reject(reason)
            }
        })
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
        callback({ status: 2, message: "用户已经授权过了" })
      }
    }
  })
}
/*判断是否授权*/
const isSetting = scope => {
  return new Promise(resolve => {
    wx.getSetting({
      success: res => {
        //授过权
        if (res.authSetting[scope]) {
          resolve(true)
          //未授权  
        } else {
          resolve(false)
        }
      }
    })
  })
}
//打开授权设置
const openSetting = () => {
  return new Promise(resolve => {
    wx.openSetting({
      success(res) {
        resolve(res)
      }
    })
  })
}


module.exports = {
    statistics,//腾讯统计代码
    getUser,//获取用户个人信息(普通微信)
    isCheckSession,//检查登录态会话密钥session_key是否过期
    login,//登录后获取openid和session_key（普通微信）
    isSettingScope,
    isSetting,//判断用户是否授权
    openSetting//打开授权设置页
}