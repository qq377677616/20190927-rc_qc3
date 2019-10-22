// pages/pages-list/poster/poster.js
const request_01 = require('../../utils/request/request_01.js');

const request_05 = require('../../utils/request/request_05.js');

import tool from '../../utils/tool/tool.js'

import auth from '../../utils/public/authorization.js'

import util from '../../utils/public/util.js'

const router = require('../../utils/tool/router.js');

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    IMGSERVICE: app.globalData.IMGSERVICE,
    showModalOption: {
      isShow: false,
      type: 0,
      title: "访问手机相册",
      test: "小程序将访问您的手机相册，将生成的海报保存到您的手机相册。",
      cancelText: "取消",
      confirmText: "确定",
      color_confirm: "#0BB20C"
    },
    qr_code: '',
    is_open: 1,
    isIos: 0,
    posterImgUrl: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    request_01.login(() => {
      this.initData(options);
      this.setData({
        userInfo: wx.getStorageSync("userInfo")
      })
    })
    tool.getSystemInfo().then(res => {
      this.setData({
        isIos: res.model.includes("iPhone") ? 1 : 2
      })
    })
  },

  initData(options) {
    this.setData({options})
    if (options.vote_id) {
      var _this = this;
      let activity_id = options.activity_id;
      let vote_id = options.vote_id;
      let user_id = wx.getStorageSync('userInfo').user_id;
      wx.request({
        url: 'https://game.flyh5.cn/game/wx7c3ed56f7f792d84/yyt_dfqcfslb/public/api3/vote/poster',
        data: {
          activity_id: activity_id,
          page: 'pages/vote_detail/vote_detail',
          param: `p=${user_id}&v=${vote_id}&a=${activity_id}`
        },
        success(res) {
          console.log('res', res)
          _this.setData({
            qr_code: res.data.data.qr_code,
          })
          _this.getSharePoster()
        }
      })
      request_05.myVote({
        activity_id,
        user_id
      }).then(res => {
        let resource = res.data.data.info.resource;
        this.setData({
          resource,
        })
      })
    } else {
      var _this = this;
      let activity_id = options.activity_id;
      let openid = options.openid;
      let shake_id = options.shake_id;
      let user_id = wx.getStorageSync('userInfo').user_id;
      wx.request({
        url: 'https://game.flyh5.cn/game/wx7c3ed56f7f792d84/yyt_dfqcfslb/public/api3/vote/poster',
        data: {
          activity_id: activity_id,
          page: 'pages/friendHelp/friendHelp',
          param: `p=${user_id}&a=${activity_id}&s=${shake_id}`
        },
        success(res) {
          console.log('res', res)
          _this.setData({
            qr_code: res.data.data.qr_code,
          })
          _this.getSharePoster()
        }
      })
      request_05.shakeDetail({
        activity_id,
        openid
      }).then(res => {
        let resource = res.data.data.activity_info.banner;
        this.setData({
          resource,
        })
      })
    }
  },

  //获取分享海报
  getSharePoster() {
    let resource = this.data.resource;
    var _this = this
    tool.loading("海报生成中", "loading")
    this.data.canvasLoading = setTimeout(() => {
      if (!this.data.posterImgUrl) {
        tool.loading_h()
        tool.jump_back()
        tool.alert("海报生成失败，请稍后再试")
      }
    }, 15000)
    Promise.all([
      util.getImgLocalPath(resource),
      util.getImgLocalPath(_this.data.userInfo.headimg || _this.data.userInfo.avatarUrl),
      util.getImgLocalPath(_this.data.qr_code),
      tool.getImageInfo(resource),
      tool.getImageInfo(_this.data.userInfo.headimg || _this.data.userInfo.avatarUrl),
      tool.getImageInfo(_this.data.qr_code)
    ]).then(res => {
      console.log("res", res)
      if(this.data.options.vote_id){
        tool.canvasImg({
          canvasId: 'myCanvas',
          canvasSize: '573*1019',
          imgList: [
            // { url: res[0], imgW: 573, imgH: 760, imgX: 0, imgY: 0 },
            {
              url: res[0],
              imgW: res[3].width,
              imgH: res[3].height,
              drawW: 573,
              drawH: 760,
              imgX: 0,
              imgY: 0
            },
            {
              url: res[1],
              imgW: res[4].width,
              imgH: res[4].height,
              drawW: 90,
              drawH: 90,
              imgX: 21,
              imgY: 808,
              isRadius: true
            },
            {
              url: res[2],
              imgW: res[5].width,
              imgH: res[5].height,
              drawW: 210,
              drawH: 210,
              imgX: 339,
              imgY: 790
            }

          ],
          textList: [{
            string: _this.data.userInfo.nickname,
            color: '#333',
            fontSize: '30',
            fontFamily: 'Arial',
            bold: false,
            textX: 131,
            textY: 821
          },
          {
            string: '#我为T90品质代言#',
            color: 'red',
            fontSize: '20',
            fontFamily: 'Arial',
            bold: false,
            textX: 120,
            textY: 878,
            wrap: 11,
            lineHeight: 30
          },
            // { string: '长按识别二维码，马上进入体验', color: '#9fa0a0', fontSize: '13', fontFamily: 'Arial', bold: false, textX: 364, textY: 977 }
          ]
        }, res => {
          tool.loading_h();
          _this.setData({
            isPosterOk: true,
            isState: true,
            posterImgUrl: res,
            canvasHidden: true,
            is_open: 0
          })
          //_this.savePhoto()
        })
      }else{
        tool.canvasImg({
          canvasId: 'myCanvas',
          canvasSize: '573*1019',
          imgList: [
            // { url: res[0], imgW: 573, imgH: 760, imgX: 0, imgY: 0 },
            {
              url: res[0],
              imgW: res[3].width,
              imgH: res[3].height,
              drawW: 573,
              drawH: 760,
              imgX: 0,
              imgY: 0
            },
            {
              url: res[1],
              imgW: res[4].width,
              imgH: res[4].height,
              drawW: 90,
              drawH: 90,
              imgX: 21,
              imgY: 808,
              isRadius: true
            },
            {
              url: res[2],
              imgW: res[5].width,
              imgH: res[5].height,
              drawW: 210,
              drawH: 210,
              imgX: 339,
              imgY: 790
            }

          ],
          textList: [{
            string: _this.data.userInfo.nickname,
            color: '#333',
            fontSize: '30',
            fontFamily: 'Arial',
            bold: false,
            textX: 131,
            textY: 821
          },
            // { string: '长按识别二维码，马上进入体验', color: '#9fa0a0', fontSize: '13', fontFamily: 'Arial', bold: false, textX: 364, textY: 977 }
          ]
        }, res => {
          tool.loading_h();
          _this.setData({
            isPosterOk: true,
            isState: true,
            posterImgUrl: res,
            canvasHidden: true,
            is_open: 0
          })
          //_this.savePhoto()
        })
      }
      
    })

  },

  noSavePhoto() {
    router.jump_back();
  },

  //保存到相册
  savePhoto() {
    tool.loading("海报保存中", "loading")
    this.isSettingScope()
  },
  //判断是否授权访问手机相册
  isSettingScope() {
    let _self = this
    auth.isSettingScope("scope.writePhotosAlbum", res => {
      console.log("res", res)
      if (res.status == 0) {
        tool.loading_h()
        _self.showHideModal()
      } else if (res.status == 1 || res.status == 2) {
        _self.saveImageToPhotosAlbum(this.data.posterImgUrl)
      }
    })
  },
  //将canvas生成的临时海报图片保存到手机相册
  saveImageToPhotosAlbum(imgUrl) {
    let _this = this;
    wx.saveImageToPhotosAlbum({
      filePath: imgUrl,
      success(res) {
        setTimeout(() => {
          tool.alert("已保存到手机相册")
          _this.setData({
            canvasHidden: false,
            isShare: true
          })
        }, 600)
      },
      fail() {
        tool.alert("保存失败")
      },
      complete() {
        tool.loading_h()
      }
    })
  },
  //点击自定义Modal弹框上的确定按钮
  operation(e) {
    if (e.detail.confirm) {
      auth.openSetting(res => { //用户自行从设置勾选授权后
        if (res.authSetting["scope.writePhotosAlbum"] && this.data.posterImgUrl) {
          this.saveImageToPhotosAlbum(this.data.posterImgUrl)
        }
      })
    }
    this.showHideModal()
  },
  //打开、关闭自定义Modal弹框
  showHideModal() {
    let _showModalOption = this.data.showModalOption
    _showModalOption.isShow = !_showModalOption.isShow
    this.setData({
      showModalOption: _showModalOption
    })
  },
})