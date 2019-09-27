// pages/webview/webview.js

const method = require('../../utils/tool/method.js');

const alert = require('../../utils/tool/alert.js');

const request_01 = require('../../utils/request/request_01.js');

Page({
  //页面的初始数据
  data: {
    //前端的h5链接地址
    h5Url: 'https://gameh5.flyh5.cn/resources/game/sh_game/NissanDraw/main.html',
    getPhoneIf: true,
  },
  //生命周期函数--监听页面加载
  onLoad: function (options) {

    let _userInfo = wx.getStorageSync('userInfo');
    let _userId = wx.getStorageSync("_login");
    const h5Url = this.data.h5Url;

    method.getPosition()
      .then(res => {//定位
        let _address_component = res.result.address_component;//省市区对象
        const province = _address_component.province;//省
        const city = _address_component.city;//市
        const district = _address_component.district;//区
        const lng = res.result.location.lng;//经度
        const lat = res.result.location.lat;//纬度

        const joinArr = [
          `?nickName=${encodeURIComponent(_userInfo.nickName)}`,
          `&avatarUrl=${_userInfo.avatarUrl}`,
          `&user_id=${_userId.user_id}`,
          `&openid=${_userId.openid}`,
          `&lng=${lng}`,//经度
          `&lat=${lat}`,//纬度
          `&address=${province + city + district}`,//省市区
        ].join('');
        let _h5Url = `${h5Url + joinArr}`;

        this.setData({
          h5Url: _h5Url,
        })

        return _userId.user_id;
      })
      .then(() => {//手机号

        request_01.userPhone({
          user_id: _userId.user_id
        })
          .then((value) => {
            const data = value.data.data;
            let getPhoneIf;

            if (data.phone) {//已存在手机号
              getPhoneIf = false;
            } else {//手机号不存在
              getPhoneIf = true;
            }

            this.setData({
              getPhoneIf,
            })

          })

      })
      .catch(err => {

        console.log("定位失败<<<", err, ">>>定位失败")
        alert.alert({
          str:'定位失败',
        })
        
      })

  },
  //通信事件
  bindmessage(e) {
    let h5Url = `${this.data.h5Url}#wechat_redirect`;
    let shareContent = e.detail.data[0];
    this.setData({
      shareContent,
      h5Url,
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage(options) {
    if (options.from == "menu") {
      let _h5Url = `${this.data.h5Url}#wechat_redirect${new Date().getTime()}`;
      this.setData({ 
        h5Url: _h5Url 
      })
    }
    let shareContent = this.data.shareContent;
    return shareContent;
  }
})