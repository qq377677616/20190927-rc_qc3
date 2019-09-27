
const request = ({url, data = {}, method = 'POST', header = { 'content-type': 'application/json'}}) => {
    return new Promise((resolve, reject) => {
      wx.request({
        url,
        data,
        method,
        header,
        success(res) {
          resolve(res)
        },
        fail(err) {
          reject(err)
        }
      })
    })
}

module.exports = {
    request,
}