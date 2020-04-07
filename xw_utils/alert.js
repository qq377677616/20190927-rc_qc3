//alert
export const alert = ({ title = '', icon = "none", duration = 1500, mask = false } = {}) => {
    wx.showToast({
        title,
        icon,
        duration,
        mask
    })
}

//开启loading
export const loading = ({ title = '', icon = "none", duration = 1500, mask = false } = {}) => {
    wx.showToast({
        title,
        icon,
        duration,
        mask
    })
}

//关闭loading
export const hideLoading = () => {
    wx.hideToast()
}

