// pages/o_vdou/o_vdou.js

const request_01 = require('../../utils/request/request_01.js');

const app = getApp();//获取应用实例
Page({

  /**
   * 页面的初始数据
   */
  data: {
    IMGSERVICE: app.globalData.IMGSERVICE,
    options:{},
    page:1,
    scrollKey:true,
    scrollPrivateKey:true,
    douInfo:{},
    isMore:false,
    str:'',
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
    const page = this.data.page;
    const scrollKey = this.data.scrollKey;
    const scrollPrivateKey = this.data.scrollPrivateKey;
    const userInfo = wx.getStorageSync('userInfo');

    //上拉加载 不允许操作
    if( !scrollKey || !scrollPrivateKey )return;

    this.setData({
      scrollKey:false,
      str:'加载中...',
      isMore:true,
    })

    request_01.vdouSrouse({
      user_id:userInfo.user_id,
      page:page + 1,
    })
      .then((value)=>{
        //success
        const newDouInfo = value.data.data;
        const douInfo = this.data.douInfo;
        let isMore, scrollPrivateKey;

        if( newDouInfo.list.length ){
          //有数据返回
          scrollPrivateKey = true;
          isMore = false;
        } 
        else{
          //无数据返回
          scrollPrivateKey = false;
          isMore = true;
        }
        douInfo.list = [...douInfo.list, ...newDouInfo.list];

        this.setData({
          douInfo,
          scrollPrivateKey,
          str:'- 我是有底线的 -',
          isMore,
        })

      })
      .catch((reason)=>{
        //fail
        this.setData({
          str:'- 我是有底线的 -',
          isMore:false,
        })
      })
      .then(()=>{
        //complete

        this.setData({
          scrollKey:true,
        })
      })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  //页面初始化
  initData(options){
    const userInfo = wx.getStorageSync("userInfo");
    const page = this.data.page;

    Promise.all([
      request_01.vdouSrouse({
        user_id:userInfo.user_id,
        page,
      })
    ])
      .then((value)=>{
        //success
        const douInfo = value[0].data.data;
        let isMore;

        if( douInfo.list.length ){
          //有数据返回
          isMore = false;
        }
        else{
          //无数据返回
          isMore = true;
        }

        this.setData({
          douInfo,
          str:'- 我是有底线的 -',
          isMore,
        })
      })
      .catch((reason)=>{
        //fail

      })
      .then(()=>{
        //complete
        this.setData({
          options,
        })
      })
  },
})