import developmentBase from './development.base.js'

import productionBase from './production.base.js'

// 为了统一老版本request_01
let all = require('../utils/request/request_01.js')

/**
 * 
 * @param {*} url 
 * @param {*} param1 
 */

let request = (url = '',
    {
        method = "POST",
        /**
         * application/x-www-form-urlencoded
         * application/json
         * application/xml
         * text/xml
         * multipart/form-data
         */
        headers = {
            "Content-Type": "application/json",
        },
        data = {},
    } = {}) => {
    return new Promise((resolve, reject) => {
        wx.request({
            // url: `${productionBase.baseApi}${url}`,
            url:`${all.SERVICE}${url}`,
            method,
            headers,
            data,
            success(res) {
                resolve(res)
            },
            fail(err) {
                reject(err)
            }
        })
    })
}

export default request