import request from '../xw_utils/request.js'
import { isCheckSession, wxLogin } from '../xw_utils/tools.js'
import { alert } from '../xw_utils/alert.js'
import { getUserInfo, getSessionKey, userAuth } from './user.js'
/**
 * 默认地址信息
 * @param {*} data 
 */
export function defaultAddress(data = {}) {
    return request('/api3/address/default_address', {
        ...data
    })
}

/**
 * 专营店信息
 * @param {*} data 
 */
export function storeList(data = {}) {
    return request('/api3/dealer/dealer_list', {
        ...data
    })
}



/**
 * 登录
 * @param {*} callback 
 */
export function login(callback) {
    let userInfo = wx.getStorageSync('userInfo');
    //本地已存放了用户信息
    if (Boolean(userInfo.openid)) {
        //检测会话密钥session_key是否过期 以及 更新用户车主相关信息
        isCheckSession().then((res) => {
            //密钥session_key未过期
            let userInfo = wx.getStorageSync('userInfo');
            return getUserInfo({
                data: {
                    openid: userInfo.openid,
                    user_id: userInfo.user_id,
                }
            }).then((res) => {
                //更新用户车主相关信息
                let { user_type } = res.data.data || {};
                wx.setStorageSync('userInfo', Object.assign(userInfo, {
                    user_type,
                }))
                callback()
            }).catch((err) => {
                alert({
                    title: err.message
                })
            })
        }).catch((err) => {
            //密钥session_key已经过期
            return wxLogin().then((res) => {
                let code = res.code
                let shareIds = wx.getStorageSync("shareIds");

                return getSessionKey({
                    data: {
                        code,
                        parent_id: shareIds.parent_id,
                        channel_id: shareIds.channel_id
                    }
                })
            }).then((res) => {
                let userInfo = wx.getStorageSync('userInfo');
                let data = res.data.data;

                if (data.errcode && data.errmsg) {


                } else {

                    //合并 存储用户信息到本地（sessionKey）
                    wx.setStorageSync('userInfo', Object.assign(userInfo, data))

                }
                login(callback)
            }).catch((err) => {
                alert({
                    title: err.message
                })
            })

        })
    } else {
        //本地未存放用户信息

        wxLogin().then((res) => {
            let code = res.code
            let shareIds = wx.getStorageSync("shareIds");
            return userAuth({
                data: {
                    code,
                    parent_id: shareIds.parent_id,
                    channel_id: shareIds.channel_id
                }
            })
        }).then((res) => {
            let data = res.data.data;

            if (data.errcode && data.errmsg) {
                login(callback)
            } else {
                wx.setStorageSync('userInfo', data)
                callback()
            }
        }).catch((err) => {
            alert({
                title: err.message
            })
        })
    }
}