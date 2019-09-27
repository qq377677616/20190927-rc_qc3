//可返回跳转
const jump_nav = ({url}) => {
    return new Promise((resolve, reject)=>{
        wx.navigateTo({
            url,
            success(){
                resolve()
            }
        })
    })
}
//关闭当前页面，跳转到某一页面
const jump_red = ({url}) => {
    return new Promise((resolve, reject)=>{
        wx.redirectTo({
            url,
            success(){
                resolve()
            }
        })
    })
}
//关闭所有页面，跳转到某一页面
const jump_rel = ({url}) => {
    return new Promise((resolve, reject)=>{
        wx.reLaunch({
            url,
            success(){
                resolve()
            }
        })
    })
}
//返回上一页面
const jump_back = () => {
    return new Promise((resolve, reject)=>{
        wx.navigateBack({
            success(){
                resolve()
            }
        })
    })
}

module.exports = {
    jump_nav,
    jump_red,
    jump_rel,
    jump_back,
}