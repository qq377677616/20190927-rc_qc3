import request from '../xw_utils/request.js'

/**
 * 用户相关信息
 * @param {*} data 
 */
export function getUserInfo(data = {}) {
    return request('/api3/user/user_index', {
        ...data
    })
}

/**
 * 根据code获取session_key授权
 * @param {*} data 
 */
export function getSessionKey(data = {}) {
    return request('/api3/oauth/oauth_get', {
        ...data
    })
}

/**
 * 用户授权
 * @param {*} data 
 */
export function userAuth(data = {}) {
    return request('/api3/oauth/oauth_reg', {
        ...data
    })
}


/**
 * 发送用户信息至后台
 * @param {*} data 
 */
export function postUserInfo(data = {}){
    return request('/api3/oauth/perfect', {
        ...data
    })
}

/**
 * 获取unionid
 * @param {*} data 
 */
export function getUnionid(data = {}){
    return request('/api3/oauth/de_union_id', {
        ...data
    })
}

/**
 * 获取用户信息
 * @param {*} data 
 */
export function getUserDatabaseInfo(data = {}){
    return request('/api3/user/my_info', {
        ...data
    })
}