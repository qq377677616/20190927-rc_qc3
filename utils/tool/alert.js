//alert提示
const alert = ({ str, icon = "none", duration = 1500, mask = false }) => {
    wx.showToast({
        title: str,
        icon,
        duration,
        mask,
    })
}

// //loading提示框
// const loading = ({ str, mask = false }) => {
//     wx.showLoading({
//         title: str,
//         mask,
//     })
// }

// //关闭loading提示框
// const loading_h = () => {
//     wx.hideLoading()
// }

//loading提示框
const loading = ({ str, icon = "none", duration = 30000, mask = false }) => {
    wx.showToast({
        title: str,
        icon,
        duration,
        mask,
    })
}

//关闭loading提示框
const loading_h = () => {
    wx.showToast({
        title: '',
        icon:'none',
        duration:0,
        mask:false,
    })
}

//确认/取消弹框
const confirm = ({ title = "确认", content = "您确认进行此操作？", confirms = "确认,#333", cancels = "取消,#333" }) => {
    return new Promise((resolve, reject) => {
        wx.showModal({
            title,
            content,
            showCancel: cancels ? true : false,
            cancelText: cancels ? cancels.split(",")[0] : '取消',
            cancelColor: cancels ? cancels.split(",")[1] : '#333',
            confirmText: confirms.split(",")[0],
            confirmColor: confirms.split(",")[1],
            success: (res) => {
                if (res.confirm) {
                    resolve(true)
                } else {
                    resolve(false)
                }
            }
        })
    })
}

module.exports = {
    alert,
    loading,
    loading_h,
    confirm,
}