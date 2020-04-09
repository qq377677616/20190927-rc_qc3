const method = require('../../utils/tool/method.js');

const alert = require('../../utils/tool/alert.js');

const request_01 = require('../../utils/request/request_01.js');

const tool = require('../../utils/public/tool.js');

const app = getApp(); //获取应用实例
// pages/webview3/webview3.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    h5Url:'',
	IMGSERVICE: app.globalData.IMGSERVICE,
	islogin:false
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
	  this.setData({ userInfo: wx.getStorageSync('userInfo')})
      if (options.scene){
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
		console.log(openid, '==', '==', nickname, '==', headimgurl, '空哦', code);
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
	  const IMGSERVICE = this.data.IMGSERVICE;
	  console.log(`${IMGSERVICE}/lookcar/carshare.jpg`);
	  return {
		  title: '启辰星 A+级SUV头等舱',
		  imageUrl: `${IMGSERVICE}/lookcar/carshare.jpg?3`,
		  path: '/pages/webview3/webview3'
	  }
  },
	//立即授权
  authBtn(e) {
		const detail = e.detail; //btn授权信息
		const errMsg = detail.errMsg; //是否授权信息
		method.userInfoAuth(e)
			.then(() => { //用户接受授权，获取用户信息
				const userInfo = wx.getStorageSync('userInfo');
				return request_01.personalInfo({
					user_id: userInfo.user_id,
					openid: userInfo.openid,
				})
			})
			.then((value) => {
				const personalInfo = value.data.data;
				tool.jump_red('/pages/webview3/webview3')
			})
			.catch((err) => {
				//fail
				console.log(err)
			})
	},
	jumpGift(){
		tool.jump_red('/pages/index/index');
	}
})