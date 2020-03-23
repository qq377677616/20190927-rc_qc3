// pages/ev/ev_help/ev_help.js
const request_01 = require('../../../utils/request/request_01.js');

const request_05 = require('../../../utils/request/request_05.js');

const router = require('../../../utils/tool/router.js');

const tool = require('../../../utils/tool/tool.js');

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    IMGSERVICE: app.globalData.IMGSERVICE,
    mine:'',
    isVehicleOwnerHidePop: false,
    helpList: [],
    helpSuc:false,
    take_status:''
  },

  initData(options){
    let openid = wx.getStorageSync('userInfo').openid
    let activity_id = options.activity_id
    if(!options.openid || options.openid == wx.getStorageSync('userInfo').openid){
        this.setData({
          mine:true
        })
        // 自己的信息
        request_05.evIndex({openid,activity_id}).then(res=>{
          console.log(res,'res')
          if(res.data.status==1){
            this.setData({
              helpList:res.data.data.help_list,
              prize_info:res.data.data.prize_info,
              is_upgrade:res.data.data.help_info.is_upgrade,
              take_status:res.data.data.help_info.take_status,
              card_id:res.data.data.order_goods_info.card_id,
              activity_id,
              options
            })
          }else{
            tool.alert(res.data.msg)
          }
        })
      }else{
        // 好友信息
        this.setData({
          mine:false
        })
        let help_user_id = options.user_id
        request_05.helpList({openid,help_user_id,activity_id}).then(res=>{
          console.log(res,'res')
          if(res.data.status==1){
            this.setData({
              user_info:res.data.data.user_info,
              prize_info:res.data.data.prize_info,
              is_help:res.data.data.is_help,
              helpList:res.data.data.help_list,
              help_user_id,
              activity_id,
              options
            })
          }else{
            tool.alert(res.data.msg)
          }
        })
      }
  },

  // 领取卡券
  getCard(){
    let activity_id = this.data.activity_id
    let openid = wx.getStorageSync('userInfo').openid
    let order_goods_id = this.data.order_goods_id
    let options = this.data.options
    let user_id = wx.getStorageSync('userInfo').user_id
    var _this = this
    request_05.getHelpPrize({activity_id,openid}).then(res=>{
      if(res.data.status==1){
        let order_goods_id = res.data.data.order_goods_id
        request_05.getWechatCard({order_goods_id,user_id}).then(res=>{
          if(res.data.status==1){
              console.log(res,'res')
              wx.addCard({
                cardList: [res.data.data[0]],
                success(res){
                  tool.loading('领取中')
                  let card_code = res.cardList[0].code
                  request_05.orderCardCode({
                    order_goods_id,  
                    user_id,
                    card_code
                  }).then(res => {
                    console.log('update_card_code', res)
                    if (res.data.status == 1) {
                      tool.loading_h()
                      tool.alert('已领取成功，请至微信-我的卡包中查看卡券')
                      setTimeout(() => {
                          _this.initData(options)
                      }, 500);
                    }
                  })
                },
                fail(){
                  setTimeout(() => {
                    tool.alert('领取失败')
                    _this.initData(options)
                  }, 500);
                }
              })
            }else{
              tool.alert(res.data.msg)
            }
        })
      }else{
        tool.alert(res.data.msg)
      }
    })
},

  // 助力
  helpH() {
    console.log(1111111111)
    if ((wx.getStorageSync("userInfo").user_type == 0 && this.data.car_owner) || (!wx.getStorageSync("userInfo").nickName || !wx.getStorageSync("userInfo").unionid)) return;
      let options = this.data.options
      let help_user_id = this.data.help_user_id
      let activity_id = this.data.activity_id
      let openid = wx.getStorageSync('userInfo').openid
      request_05.evHelp({
        help_user_id,
        activity_id,
        openid
      }).then(res => {
        console.log(res)
        if (res.data.status == 1) {
          this.initData(options)
          this.setData({
            helpSuc: true
          })
        } else {
          tool.alert(res.data.msg)
        }
      })
  },

  // 我的卡券
  oCard(){
    let card_id = this.data.card_id
    router.jump_nav({
      url:`/pages/o_card_bag_rule/o_card_bag_rule?card_id=${card_id}`
    })
  },

  // 去首页
  toEvIndex(){
    let activity_id = this.data.activity_id
    router.jump_nav({
      url:`/pages/ev/ev_index/ev_index?activity_id=${activity_id}`
    })
  },

  //关闭助力成功弹窗
  closeSuc(){
    this.setData({
      helpSuc:false
    })
  },

  //判断是否授权和是否是车主
  isVehicleOwner(e) {
    if ((wx.getStorageSync("userInfo").unionid && wx.getStorageSync("userInfo").nickName && wx.getStorageSync("userInfo").user_type == 1) || (e && e.target.dataset.type != 'ok') || (wx.getStorageSync("userInfo").unionid && wx.getStorageSync("userInfo").nickName && !this.data.car_owner)) return;
    if (!wx.getStorageSync("userInfo").nickName || !wx.getStorageSync("userInfo").unionid) {
      this.setData({
        popType: 2
      })
    } else if (wx.getStorageSync("userInfo").user_type == 0) {
      this.setData({
        popType: 3
      })
    }

    this.isVehicleOwnerHidePop()
  },
  //授完权后处理
  getParme(e) {
    this.isVehicleOwnerHidePop()

    request_01.setUserInfo(e)
      .then(res => {
        this.isVehicleOwner()
      })
  },
  //是否授权、绑定车主弹窗
  isVehicleOwnerHidePop() {
    this.setData({
      isVehicleOwnerHidePop: !this.data.isVehicleOwnerHidePop
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    request_01.login(()=>{
      this.initData(options)
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
    let openid = wx.getStorageSync('userInfo').openid
    let user_id = wx.getStorageSync('userInfo').user_id
    let activity_id = this.data.activity_id
    let obj = {
      title: '快来帮我助力领免费试用券！',
      path: `/pages/ev/ev_help/ev_help?user_id=${user_id}&openid=${openid}&activity_id=${activity_id}`,
      imageUrl: this.data.IMGSERVICE + "/ev/ev_index_share.jpg"
    };
    return obj;
  }
})