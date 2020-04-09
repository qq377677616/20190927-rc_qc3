const QQMapWX = require('./qqmap-wx-jssdk.min.js');
/**
 * 字符串填充
 * @param {*} value 
 * @param {*} n 
 * @param {*} padValue 
 */
export function padStart(value = '', n, padValue = 0) {
    return value.toString().padStart(n, padValue)
}
export function padEnd(value = '', n, padValue = 0) {
    return value.toString().padEnd(n, padValue)
}

/**
 * 时间格式化
 * @param {*} seconds 
 */
export function timeFormat(seconds, callback) {

    let day = padStart(parseInt(seconds / (24 * 60 * 60)), 2, '0')
    seconds = parseInt(seconds % (24 * 60 * 60))
    let hours = padStart(parseInt(seconds / (60 * 60)), 2, '0')
    seconds = parseInt(seconds % (60 * 60))
    let minutes = padStart(parseInt(seconds / 60), 2, '0')
    seconds = padStart(parseInt(seconds % 60), 2, '0')

    callback({ day, hours, minutes, seconds })
}

/**
 * 获取用户地理位置信息
 */
export function getLocation() {
    return new Promise((resolve, reject) => {
        wx.getLocation({
            type: 'wgs84',
            success(res) {
                const latitude = (res.latitude).toFixed(6)
                const longitude = (res.longitude).toFixed(6)
                const speed = res.speed
                const accuracy = res.accuracy
                resolve({
                    latitude,
                    longitude,
                    speed,
                    accuracy
                })
            },
            fail(err) {
                reject(err)
            }
        })
    })
}

/**
 * QQMapWX
 */
export let getPosition = () => {
    return new Promise((resolve, reject) => {
        let qqmapsdk = new QQMapWX({ key: 'GW3BZ-NMN6J-JSEFT-FTC6R-F7DA3-Z3FVJ' });
        qqmapsdk.reverseGeocoder({
            success: (res) => {
                console.warn('QQMapWX地理位置信息', res)
                resolve(res)
            },
            fail: function (err) {
                reject(err)
            }
        })
    })
}

/**
 * 检查登录态会话密钥session_key是否过期
 */
export function isCheckSession() {
    return new Promise((resolve, reject) => {
        wx.checkSession({
            success(res) {//未过期，并且在本生命周期一直有效
                resolve(res)
            },
            fail(err) {//已经失效，需要重新执行登录流程
                reject(err)
            }
        })
    })
}

//登录后获取openid和session_key（普通微信）
export function wxLogin() {
    return new Promise((resolve, reject) => {
        wx.login({
            success(res) {
                resolve(res)
            },
            fail(err) {
                reject(err)
            }
        })
    })
}

export function getUserAdmin({isOwnerVip = 0} = {}){
    let userInfo = wx.getStorageSync("userInfo")
    let adminData = {
        isAuthState:false,
        isBindState:false
    }
    Object.assign(adminData, {
        isAuthState:Boolean(userInfo.nickName),
        isBindState:Boolean(isOwnerVip === 0 || isOwnerVip === 1 && userInfo.user_type === 1)
    })
    return adminData
}