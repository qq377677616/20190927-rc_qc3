// activity_module/pages/xw_dealer/change_dealer/change_dealer.js
const app = getApp(); //获取应用实例
import { COMMONLogin, COMMONPositionStoreList } from '../../../../xw_api/index.js'
import { alert, loading, hideLoading } from '../../../../xw_utils/alert.js'
import { getPosition } from '../../../../xw_utils/tools.js'
import { jump_back } from '../../../../xw_utils/route.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    IMGSERVICE: app.globalData.IMGSERVICE,
    storeList: [],
    curCity: '',
    seekFail: false,
  },
  initData(options) {
    loading({
      title: '定位中'
    })
    getPosition().then((res) => {
      let { location, ad_info } = res.result
      this.setData({
        seekFail: false
      })
      //获取专营店
      return COMMONPositionStoreList({
        data: {
          city: ad_info.city,
          lon: location.lng,
          lat: location.lat,
        }
      }).then((res) => {
        let { msg, data, status } = res.data
        if (status == 1) {
          this.setData({
            curCity: ad_info.city,
            storeList: data,
          })
        } else {
          throw new Error(msg)
        }

      }).catch((err) => {

        return COMMONPositionStoreList({
          data: {
            city: ad_info.city,
            lon: '',
            lat: '',
          }
        }).then((res) => {
          let { msg, data, status } = res.data
          if (status == 1) {
            this.setData({
              curCity: ad_info.city,
              storeList: data,
            })
          } else {
            throw new Error(msg)
          }
        })

      })
    }).catch((err) => {

      alert({
        title: err.message
      })
      this.setData({
        seekFail: true
      })
    }).then(() => {
      this.setData({
        options,
      })
      hideLoading()
    })
  },
  /**
   * 重新定位
   */
  relocationBtn() {
    let options = this.data.options
    this.initData(options)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    loading({
      title: '登录中'
    })
    COMMONLogin(() => {
      hideLoading()
      this.initData(options)
    })
  },
  /**
   * 选择经销商
   */
  selectStoreBtn(e) {
    let code = e.currentTarget.dataset.code
    let pages = getCurrentPages()
    let prevPage = pages[pages.length - 2] //上一个页面
    let options = prevPage.data.options
    prevPage.setData({
      options: Object.assign(options,{
        storeCode:code
      })
    });
    //返回上一页
    jump_back()
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
})