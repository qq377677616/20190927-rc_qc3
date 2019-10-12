// pages/webview/webview.js
Page({
  //页面的初始数据
  data: {
    //前端的h5链接地址
    h5Url: 'https://platform.easys.co/qc2019/qicheng-h5/index.html'
  },
  // https://gameh5.flyh5.cn/resources/game/hjl_game/2019/07/shotinbasket/index.html
  // https://platform.easys.co/qc2019/qicheng-h5/index.html?openid=xxx&nickname=xxx2&headimgurl=xxx3
  //生命周期函数--监听页面加载
  onLoad: function (options) {

    let _userInfo = wx.getStorageSync('userInfo');
    
    // &phoneNumber=${_userInfo.phone}
    let _h5Url = `${this.data.h5Url}?nickName=${encodeURIComponent(_userInfo.nickName)}&headimgurl=${_userInfo.avatarUrl}&user_id=${_userInfo.user_id}&openid=${_userInfo.openid}`;
    this.setData({ h5Url: _h5Url })
    console.log("【最终跳转到h5的链接】", this.data.h5Url)
  },
  //通信事件
  bindmessage(e) {
    console.log("e.detail", e.detail)
    console.log("【从h5传到小程序的分享内容：】")
    console.log(e.detail.data[0])
    this.setData({ shareContent: e.detail.data[0] })
    let _h5Url = `${this.data.h5Url}#wechat_redirect`;
    this.setData({ h5Url: _h5Url })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage(options) {
    console.log("onShareAppMessage", options)
    return this.data.shareContent
  }
})