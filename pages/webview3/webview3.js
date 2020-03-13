const method = require('../../utils/tool/method.js');

const alert = require('../../utils/tool/alert.js');

const request_01 = require('../../utils/request/request_01.js');
// pages/webview3/webview3.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    h5Url:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    request_01.login(()=>{
      let h5Url = ''
      let openid = wx.getStorageSync('userInfo').openid
      let nickname = ''
      let headimgurl = ''
      let code = '';
      if (options.scene) {
        let scene = decodeURIComponent(options.scene);
        console.log(scene)
        scene.split('&').forEach((item) => {
          console.log(item.split('='))
          if (item.split('=')[0] == 'd') { //code
            code = item.split('=')[1]
          }
        })
      }
      if(wx.getStorageSync('userInfo').nickname || wx.getStorageSync('userInfo').nickName){
        nickname = wx.getStorageSync('userInfo').nickName || wx.getStorageSync('userInfo').nickname 
      }
      if(wx.getStorageSync('userInfo').headimg || wx.getStorageSync('userInfo').avatarUrl){
        headimgurl = wx.getStorageSync('userInfo').headimg || wx.getStorageSync('userInfo').avatarUrl 
      }
      h5Url = `https://platform.easys.co/2020/index.html?openid=${openid}&nickname=${nickname}&headimgurl=${headimgurl}&code=${code}`   
      this.setData({
        h5Url
      })
      console.log(this.data.h5Url)
    })
  },
  
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})