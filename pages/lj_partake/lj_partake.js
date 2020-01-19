// pages/lj_partake/lj_partake.js

const request_01 = require('../../utils/request/request_01.js');

const request_05 = require('../../utils/request/request_05.js');

const router = require('../../utils/tool/router.js');

const tool = require('../../utils/tool/tool.js');

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    IMGSERVICEZ: app.globalData.IMGSERVICE,
    image: '',
    content: '',
    cursor: 0,
  },

  // 上传图片获取图片地址
  uploadPic() {
    let that = this;

    wx.chooseImage({
      success(res) {
        tool.loading('加载中')
        const tempFilePaths = res.tempFilePaths
        tool.getImageInfo(tempFilePaths[0]).then(res => {
          console.log("res", res)
          if (res.width < 573 || res.height < 760) {
            tool.showModal("图片尺寸", "上传图片尺寸不能小于573*760,请重新选择/拍摄照片进行上传", "好的,#1354BB", false)
            tool.loading_h()
            return
          }
          // console.log(request_01.SERVICE+'/')
          wx.uploadFile({
            url: request_01.SERVICE + '/admin3/upload/upload',
            filePath: tempFilePaths[0],
            name: 'file',
            success(res) {
              console.log(res)
              let data = JSON.parse(res.data);
              let image = data.data;
              that.setData({
                image,
              })
              tool.loading_h();
            },
          })
        })
      }
    })
    tool.loading_h()
  },

  // 获取textarea文本值
  bindinput(e) {
    console.log('e', e)
    let content = e.detail.value;
    let cursor = e.detail.cursor;
    this.setData({
      content,
      cursor
    })
  },

  // 点击提交
  submitInfo() {
    var _this = this
    if (wx.getStorageSync('voteInfo') != 1) { //订阅消息暂时不用
      wx.requestSubscribeMessage({
        tmplIds: ['I_lrsh0UX78QEn1RuXoT8KPwII01ZkB_i_X98CM6aDc'],
        success(res) {
          if (res['I_lrsh0UX78QEn1RuXoT8KPwII01ZkB_i_X98CM6aDc'] == "accept") {
            wx.setStorageSync('voteInfo', 1)
            _this.submit()
          } else {
            wx.setStorageSync('voteInfo', 0)
            _this.submit()
          }
        },
        fail(err) {
          console.log(err.errCode)
          console.log("不接受", err)
        }
      })
    }
  },

  // 提交方法
  submit() {
    const activity_id = this.data.activity_id;
    console.log("activity_id", activity_id)
    const user_id = wx.getStorageSync('userInfo').user_id;
    const openid = wx.getStorageSync('userInfo').openid;
    let content = this.data.content;
    let image = this.data.image;
    let form_id = wx.getStorageSync('voteInfo');
    if (image == "") {
      tool.alert('请上传照片');
    } else if (content == "") {
      tool.alert('请填写内容');
    } else {
      request_05.uploadVote({
        user_id,
        openid,
        activity_id,
        content,
        image,
        form_id
      }).then(res => {
        console.log(res);
        let status = res.data.status;
        console.log(status);
        switch (status) {
          case 0:
            tool.alert(res.data.msg);
            setTimeout(() => {
              router.jump_nav({
                url: `/pages/index/index`,
              })
            }, 1000)
            break;
          case 1:
            tool.alert(res.data.msg);
            setTimeout(() => {
              console.log(`/pages/vote_vetail/vote_detail?activity_id=${activity_id}`);
              router.jump_red({
                url: `/pages/vote_detail/vote_detail?activity_id=${activity_id}`,
              })
            }, 1000)
            break;
        }
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      activity_id: options.activity_id
    })
    console.log(options.activity_id)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})