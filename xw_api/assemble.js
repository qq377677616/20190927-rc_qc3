import request from '../xw_utils/request.js'


export function assembleIndex(data = {}) {
    return request('/api3/dealer_tuan/detail', {
        ...data
    })
}