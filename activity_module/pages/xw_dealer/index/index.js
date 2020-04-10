// pages/dealer-module/index/index.js
const app = getApp(); //获取应用实例
import { COMMONLogin, DEALERActivityList } from '../../../../xw_api/index.js'
import { alert, loading, hideLoading } from '../../../../xw_utils/alert.js'
import { getPosition } from '../../../../xw_utils/tools.js'
import { jump_nav } from '../../../../xw_utils/route.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    IMGSERVICE: app.globalData.IMGSERVICE,
    isOnload: false,
    options: {},
    activityList: [],
    curCity: '',
  },
  /**
   * 初始化
   * @param {*} options 
   */
  initData(options) {
    loading({
      title: '加载中'
    })
    getPosition().then((res) => {
      let { location, ad_info } = res.result
      return DEALERActivityList({
        data: {
          city_name: ad_info.city,//string	城市名字
          dlr_code: options.storeCode || '',//string	专营店编码
        }
      }).then((res) => {
        let { msg, status, data } = res.data
        if (status == 1) {
          this.setData({
            activityList: data,
            curCity: ad_info.city,
          })
        } else {
          throw new Error(msg)
        }

      })
    }).catch((err) => {
      alert({
        title: err.message
      })
    }).then(() => {
      this.setData({
        options
      })
      hideLoading()
    })
  },
  /**
   * 切换经销商
   */
  changeStoreBtn() {
    jump_nav(`/activity_module/pages/xw_dealer/change_dealer/change_dealer`)
  },
  /**
   * 立即参与按钮
   * @param {*} e 
   */
  joinBtn(e) {
    let out_id = e.currentTarget.dataset.outId
    let out_type = e.currentTarget.dataset.outType
    switch (out_type) {
      case 1:
        //砍价 
        jump_nav(`/activity_module/pages/yls_bargain/index/index?activity_id=${out_id}&out_type=${out_type}`)
        break
      case 2:
        //团购
        jump_nav(`/activity_module/pages/xw_assemble/index/index?out_id=${out_id}&out_type=${out_type}`)
        break
      default:
        break
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      isOnload: true
    })
    loading({
      title: '登录中'
    })
    COMMONLogin(() => {
      hideLoading()
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
    let isOnload = this.data.isOnload
    if (isOnload) {
      let options = this.data.options
      this.initData(options)
    }
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
})