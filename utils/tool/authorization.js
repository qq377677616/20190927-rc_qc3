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

//判断用户是否授权
const isSetting = (scope) => {
    return new Promise((resolve, reject)=>{
        wx.getSetting({
            success(res){
                
              if (res.authSetting[scope]) {//已授权过
                    resolve(true)
                } else {//未授权 
                    resolve(false)
                }

            },
            fail(reason){//失败
                reject(reason)
            }
        })
    })
}

//打开授权设置页
const openSetting = () => {
    return new Promise((resolve, reject)=>{
        wx.openSetting({
            success(res) {//打开授权设置页成功
                resolve(res)
            },
            fail(reason){//打开授权设置页失败
                reject(reason)
            }
        })
    })
}



module.exports = {
    statistics,//腾讯统计代码
    getUser,//获取用户个人信息(普通微信)
    isCheckSession,//检查登录态会话密钥session_key是否过期
    login,//登录后获取openid和session_key（普通微信）
    isSetting,//判断用户是否授权
    openSetting,//打开授权设置页
}