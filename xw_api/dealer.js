import request from '../xw_utils/request.js'

/**
 * 经销商专营店列表
 * @param {*} data 
 */
export function DEALERActivityList(data = {}) {
    return request('/api3/dealer_activity/activity_list', {
        ...data
    })
}