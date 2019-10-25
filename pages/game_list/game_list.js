// pages/game_list/game_list.js

const request_01 = require('../../utils/request/request_01.js');

const router = require('../../utils/tool/router.js');

const app = getApp();//获取应用实例

Page({

  /**
   * 页面的初始数据
   */
  data: {
    options:{},
    gameList:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    request_01.login(()=>{
      this.initData(options)
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

  },
  //页面初始化
  initData(options){

    Promise.all([
      request_01.gameList()
    ])
    .then((value)=>{
      const gameList = value[0].data.data;
      console.log(gameList)
      this.setData({
        gameList,
      })
    })
    .catch((reason)=>{

    })
    .then(()=>{
      //complete
      this.setData({
        options,
      })
    })
  },
  //进入游戏
  playGame(e){
    const index = e.currentTarget.dataset.index;
    const gameList = this.data.gameList;
    const appid = gameList[index].game_appid;
    console.log("index", index)
    wx.navigateToMiniProgram({
      appId: appid,
      path: '',
      extraData: {
        foo: 'bar'
      },
      envVersion: 'release',//develop、trial、release
      success(res) {
        // 打开成功
      }
    })
    // router.jump_nav({
    //   url:`/${page}`,
    // })
  },
})