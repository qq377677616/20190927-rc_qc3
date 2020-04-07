//alert
const alert = (options = { title : '', icon : "none", duration : 1500, mask : false }) => {
    wx.showToast({
        ...options
    })
}

//开启loading
const loading = (options = { title : '', icon : "none", duration : 1500, mask : false }) => {
    wx.showToast({
        ...options
    })
}

//关闭loading
const hideLoading = () => {
    wx.hideToast()
}