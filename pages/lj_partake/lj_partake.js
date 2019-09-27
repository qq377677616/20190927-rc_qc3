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
    image:'',
    content:'',
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
            wx.uploadFile({
              url: 'https://game.flyh5.cn/game/wx7c3ed56f7f792d84/yyt_dfqcfslb/public/api3/upload/upload_image', 
              filePath: tempFilePaths[0],
              name: 'file',
              success(res) {
                let data = JSON.parse(res.data);
                let image = data.data.src;
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
    let content = e.detail.value;
    this.setData({
      content,
    })
  },

  // 点击提交
  formSubmit(e) {
    const activity_id = wx.getStorageSync('activity_id');
    const user_id = wx.getStorageSync('userInfo').user_id;
    const openid = wx.getStorageSync('userInfo').openid;
    let content = this.data.content;
    let image = this.data.image; 
    console.log(image);
    console.log(content);
    let form_id = e.detail.formId;
    if(image==""){
      tool.alert('请上传照片');
    } else if (content==""){
      tool.alert('请填写内容');
    }else{
      request_05.uploadVote({ user_id, openid, activity_id, content, image, form_id }).then(res => {
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
  onLoad: function (options) {
    request_01.login(()=>{
      
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