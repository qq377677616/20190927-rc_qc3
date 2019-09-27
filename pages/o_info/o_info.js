// pages/o_info/o_info.js

const request_01 = require('../../utils/request/request_01.js');
const router = require('../../utils/tool/router.js');
const alert = require('../../utils/tool/alert.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    personalInfo:{},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    request_01.login(()=>{
      this.initData(options)
    })
  },
  jump(e){
    let _url
    if (e.currentTarget.dataset.index == 1) {
      _url = '/pages/o_address/o_address'
    } else if (e.currentTarget.dataset.index == 2) {
      _url = '/pages/o_love_car/o_love_car'
    }
    router.jump_nav({ url: _url })
  },
  /**
   * 用户点击右上角分享
   */
//   onShareAppMessage: function () {
    
//   },
  initData(){
    const userInfo = wx.getStorageSync('userInfo');

    alert.loading({
      str:'加载中'
    })

    Promise.all([
      request_01.personalInfo({
        user_id:userInfo.user_id,
        openid:userInfo.openid,
      })
    ])
      .then((value)=>{
        const personalInfo = value[0].data.data;

        this.setData({
          personalInfo,
        })

      })
      .catch((reason)=>{

      })
      .then(()=>{

        alert.loading_h()

      })

  }
})