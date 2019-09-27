// pages/o_yuyueshijia/o_yuyueshijia.js

const request_01 = require('../../utils/request/request_01.js');
const route =  require('../../utils/tool/router.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shijiaList:[],
	noshijia:false
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
//   onShareAppMessage: function () {

//   },
  //页面初始化
  initData(){
    const userInfo = wx.getStorageSync('userInfo');
    Promise.all([
      request_01.myReservationDriving({
        user_id:userInfo.user_id
      })
    ])
      .then((value)=>{
        //success
        const shijiaList = value[0].data.data.list;
        this.setData({
          shijiaList,
		  noshijia:shijiaList.length>0
        })
      })
      .catch((reason)=>{
        //fail

      })
      .finally(()=>{
        //complete

      })
  },
  goLookcar(){
	  route.jump_nav({ url:"/pages/look_car/look_car"});
	}
})