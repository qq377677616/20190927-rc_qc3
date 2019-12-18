// pages/look_car/look_car.js
const mta = require('../../utils/public/mta_analysis.js')

const request_01 = require('../../utils/request/request_01.js');

const method = require('../../utils/tool/method.js');

const router = require('../../utils/tool/router.js');

const authorization = require('../../utils/tool/authorization.js');

const alert = require('../../utils/tool/alert.js');

const app = getApp();//获取应用实例

Page({

  /**
   * 页面的初始数据
   */
  data: {
    options:{},
    carList:[],
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
      request_01.lookCarList({ user_id: wx.getStorageSync('userInfo').user_id })
    ])
    .then((value)=>{
      const carList = value[0].data.data;
      this.setData({
        carList,
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
  //看车详情
  jumpDetail(e){
    const index = e.currentTarget.dataset.index;
    const carList = this.data.carList;
    const id = carList[index].id;
    console.log(id)
    if( id == 9 ) {
      // 跳转T90页面
      router.jump_nav({
        url:`/pages/look_car_detail/look_car_detail?id=${9}`,
      })
    }
    else if( id == 11 ) {
      // 跳转T90页面
      router.jump_nav({
        url:`/pages/look_car_detail_03/look_car_detail?id=${11}`,
      })
    }
    else {
      // 跳转通用看车页
      router.jump_nav({
        url:`/pages/look_car_detail_02/look_car_detail_02?id=${id}`,
      })
    }

  },
})