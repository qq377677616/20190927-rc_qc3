// pages/binding/scratch/Scratch.js
import tool from '../../../utils/public/tool.js'
import Scrape from '../../../utils/scrape.js'

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    IMGSERVICE: app.globalData.IMGSERVICE,
    canvasWidth: 230, //刮刮乐宽
    canvasHeight: 140, //刮刮乐高
    prize_img: '', //奖品图片
    img: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // 创建临时canvas绘制图片填充
    var _this = this
    let ctx2 = wx.createCanvasContext('myCanvas')
    wx.getImageInfo({
      src: 'https://game.flyh5.cn/resources/game/wechat/xw/rc_qc/assets_3.0/center/guajiang.png',
      success(res) {
        _this.setData({
          img: res.path
        })
        _this.scrapeInit() 
      }
    })
  },
  scrapeInit() {
    //刮刮乐初始化
    this.scrape = new Scrape(this, {
      width: this.data.canvasWidth,
      height: this.data.canvasHeight,
      maskColor: '',
      bgPic: this.data.img,
      range: "50%",
      ininOk: "scrapeIninOk",
      callback: "scrapeOk"
    })
  },
  //刮刮乐初始化OK
  scrapeIninOk() {
    tool.loading("刮刮乐初始化")
    setTimeout(() => {
      this.setData({
        prize_img: 'https://game.flyh5.cn/resources/game/wechat/szq/images/img_12.jpg'
      })
      tool.loading_h()
    }, 800)
  },
  //刮完奖回调
  scrapeOk() {
    let _this = this
    tool.showModal("刮刮乐", "恭喜您刮中100元现金", "放进口袋,#CF5673", false).then(() => {
      tool.loading("刮刮乐重置中")
      setTimeout(() => {
        _this.scrape.init()
        tool.alert("刮刮乐重置成功")
      }, 800)
    })
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