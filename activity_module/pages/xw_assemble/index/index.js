// activity_module/pages/xw_assemble/index/index.js
const app = getApp(); //获取应用实例
import { assembleIndex, lunchAssemble } from '../../../../xw_api/index.js'
import { alert } from '../../../../xw_utils/alert.js'
import { timeFormat } from '../../../../xw_utils/tools.js'
import { jump_nav } from '../../../../xw_utils/route.js'

let userInfo = wx.getStorageSync('userInfo');

let timmer = null
Page({

  /**
   * 页面的初始数据
   */
  data: {
    IMGSERVICE: app.globalData.IMGSERVICE,
    isVisible: false,
    indexData: {},
    countDown: 0,
    countDownFormat: {},
    otherTuan: [],
    countDownFormatList: [],
  },
  /**
   * 
   * @param {*} options 
   */
  initData(options) {
    Promise.all([
      assembleIndex({
        data: {
          out_id: '20',//活动ID
          openid: userInfo.openid,//用户openid
        }
      })
    ]).then((res) => {
      const { msg: msg0, status: status0, data: data0 } = {
        "status": 1,
        "msg": "success",
        "data": {
          "activity_info": {
            "title": "test", // 活动名称
            "rule": "https://ttimg.chebaba.com/admin/storage/20200319/135205DfVd4.jpg", // 活动规则图
            "banner": "https://ttimg.chebaba.com/admin/storage/20200319/135209qRc1N.jpg", // 活动banner图
            "car_owner": 0, // 是否车主活动
            "status": 1, // 活动状态 1-进行中 2-未开始 3-已结束
            "start_date": "2020-03-24 00:00:00", // 活动开始时间，未开始状态才有
            "pv": 3, // 围观次数
            "share": 3, // 分享次数
            "joining_people": 0 // 正在参与人数
          },// 活动信息
          "card_info": {
            "coupon_price": 99, // 卡券面值
            "store_name": "东风启辰广州荔湾芳村", // 举办方
            "coupon_title": "团购卡券", // 卡券名称
            "count_down": 54515554 // 倒计时时间戳
          }, // 卡券信息
          "join_info": {
            "tuan_id": 1, // 团购ID，别人参团需要这个ID，未拼团是0
            "tuan_log_id": 1, // 团购记录ID，领取奖品用，未拼团是0
            "status": 0, // 0-拼团中 1-拼团成功 2-拼团失败，未拼团是-1(判断是否参团)
            "is_receive": 0, // 是否领取 1-是 0-否
            "join_list": [
              "https:\/\/wx.qlogo.cn\/mmopen\/vi_32\/b1pkCubljmL0ehY6mzofpZ448tKTBBO50cz18qTgfEM91Kib5XXTKY8Z2mZtMNP1nTn9ZwEM2e4p18txo131Obw\/132", // 参团列表头像，第一个是团长
            ]
          },
          "other_tuan": [{
            "tuan_id": 1, // 拼团ID
            "headimg": "https:\/\/wx.qlogo.cn\/mmopen\/vi_32\/b1pkCubljmL0ehY6mzofpZ448tKTBBO50cz18qTgfEM91Kib5XXTKY8Z2mZtMNP1nhxKzviaWCjOJsf9c83oM4pg\/132",
            "nickname": "易",
            "few_people": 2, // 差几人
            "count_down": 10 // 结束倒计时
          },
          {
            "tuan_id": 1, // 拼团ID
            "headimg": "https:\/\/wx.qlogo.cn\/mmopen\/vi_32\/b1pkCubljmL0ehY6mzofpZ448tKTBBO50cz18qTgfEM91Kib5XXTKY8Z2mZtMNP1nhxKzviaWCjOJsf9c83oM4pg\/132",
            "nickname": "易",
            "few_people": 2, // 差几人
            "count_down": 20 // 结束倒计时
          },
          {
            "tuan_id": 1, // 拼团ID
            "headimg": "https:\/\/wx.qlogo.cn\/mmopen\/vi_32\/b1pkCubljmL0ehY6mzofpZ448tKTBBO50cz18qTgfEM91Kib5XXTKY8Z2mZtMNP1nhxKzviaWCjOJsf9c83oM4pg\/132",
            "nickname": "易",
            "few_people": 2, // 差几人
            "count_down": 15 // 结束倒计时
          }] // 大家正在团
        }
      } || res[0].data

      //当前活动倒计时相关处理
      let countDown = 0
      let countDownFormat = {}
      countDown = data0.card_info.count_down
      countDownFormat = {
        day: '00',
        hours: '00',
        minutes: '00',
        seconds: '00'
      }

      //其它活动倒计时相关处理
      let otherTuan = []
      let countDownFormatList = []
      otherTuan = data0.other_tuan.map((item) => {
        countDownFormatList.push(`00:00:00`)
        return Object.assign({}, item)
      })



      this.setData({
        indexData: data0,
        countDown: data0.card_info.count_down,//报存当前活动倒计时
        countDownFormat,
        otherTuan,
        countDownFormatList,
      })

      //开启活动倒计时
      this.openCountDownHandler()
    }).catch((err) => {
      alert({
        title: err.message
      })
    })
  },
  /**
   * 规则显示隐藏
   */
  isRuleVisibleHandler() {
    let isVisible = this.data.isVisible
    this.setData({
      isVisible: !isVisible
    })
  },
  /**
   * 开启活动倒计时
   */
  openCountDownHandler() {

    this.clearInterval()


    timmer = setInterval(() => {
      let key = true

      //当前活动
      let countDown = this.data.countDown
      let countDownFormat = this.data.countDownFormat
      if (typeof countDown === 'number' && countDown > 0) {
        countDown--
        timeFormat(countDown, function ({ day, hours, minutes, seconds }) {
          countDownFormat = {
            day,
            hours,
            minutes,
            seconds
          }
        })
        this.setData({
          countDownFormat,// 时间格式化
          countDown,//更新当前活动倒计时
        })

        key = false
      } else {
        this.setData({
          countDownFormat: {
            day: '00',
            hours: '00',
            minutes: '00',
            seconds: '00'
          }
        })
      }

      //其它活动
      let otherTuan = this.data.otherTuan
      let countDownFormatList = this.data.countDownFormatList
      otherTuan.forEach((item, index) => {
        if (typeof item.count_down === 'number' && item.count_down > 0) {
          item.count_down = item.count_down - 1
          timeFormat(item.count_down, function ({ day, hours, minutes, seconds }) {
            countDownFormatList[index] = `${hours}:${minutes}:${seconds}`
          })
          key = false
        } else {
          countDownFormatList[index] = `00:00:00`
        }
      })

      this.setData({
        otherTuan,
        countDownFormatList,
      })

      //
      if (key) {
        this.clearInterval()
      }
    }, 1000)
  },
  /**
   * 清除定时器 
   */
  clearInterval() {
    clearInterval(timmer)
    timmer = null
  },
  /**
   * 发起拼团
   */
  lunchAssembleHandler() {

    // lunchAssemble({
    //   data: {
    //     openid: userInfo.openid,//string	用户OPENID
    //     out_id: '20',//int	经销商活动ID
    //     address_id: '',//int	收货地址ID
    //     data_code: '',//string	留资转营店编码
    //   }
    // })
  },
  /**
   * 返回经销商首页
   */
  jumpHome() {
    jump_nav(`/activity_module/pages/xw_dealer/index/index`)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initData(options)
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