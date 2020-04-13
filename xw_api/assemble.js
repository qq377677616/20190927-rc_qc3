import request from '../xw_utils/request.js'

/**
 * 拼团首页
 * @param {*} data 
 */
export function ASSEMBLEAssembleIndex(data = {}) {
    return request('/api3/dealer_tuan/detail', {
        ...data
    })
}

/**
 * 发起拼团
 * @param {*} data 
 */
export function ASSEMBLELunchAssemble(data = {}) {
    return request('/api3/dealer_tuan/start_tuan', {
        ...data
    })
}

/**
 * 领取奖品
 * @param {*} data 
 */
export function ASSEMBLEReceivePrize(data = {}) {
    return request('/api3/dealer_tuan/receive', {
        ...data
    })
}

/**
 * 参与团购
 * @param {*} data 
 */
export function ASSEMBLEJoinAssemble(data = {}) {
    return request('/api3/dealer_tuan/join_tuan', {
        ...data
    })
}

/**
 * 团购详情【好友进入】
 * @param {*} data 
 */
export function ASSEMBLEAssembleDetail(data = {}) {
    return request('/api3/dealer_tuan/tuan_detail', {
        ...data
    })
}

/**
 * 拼团分享上报
 * @param {*} data 
 */
export function ASSEMBLEAssembleShareLog(data = {}) {
    return request('/api3/dealer_activity/share_log', {
        ...data
    })
}