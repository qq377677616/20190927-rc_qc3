// pages/payment/pay_help/pay_help.js
// pages/friendHelp/friendHelp.js

const request_05 = require('../../../utils/request/request_05.js')

const request_01 = require('../../../utils/request/request_01.js');

const tool = require('../../../utils/tool/tool.js');

const router = require('../../../utils/tool/router.js')

const app = getApp(); //获取应用实例
Page({

  /**
   * 页面的初始数据
   */
  data: {
    IMGSERVICE: app.globalData.IMGSERVICE,
    height: 0,
    isShow: false,
    isShowMe: true,
    isShowFriend: false,
    helpSuc: false, //是否助力成功弹窗
    isTen: false, //是否可以升级卡券
    isSuc: false,
    mTop: 29,
    isHelpH: true, //是否可以助力
    isShare: false,
  },
  initData(options) {
    // tool.loading('加载中')
    console.log(options)
    let openid = wx.getStorageSync('userInfo').openid;;
    let activity_id = '';
    let parent_id = '';
    let user_id = '';
    if (options.scene) {
      let scene = decodeURIComponent(options.scene);
      console.log(scene)
      scene.split('&').forEach((item) => {
        console.log(item.split('='))
        if (item.split('=')[0] == 'p') { //找到channel_id并存储
          parent_id = item.split('=')[1]
        }
        if (item.split('=')[0] == 's') { //找到channel_id并存储
          user_id = item.split('=')[1]
        }
        if (item.split('=')[0] == 'a') { //找到user_id并存储
          activity_id = item.split('=')[1]
        }
      })
    } else {
      console.log(options)
      user_id = options.user_id;
      activity_id = options.activity_id;
    }

    // let activity_id = options.activity_id;
    // let openid = wx.getStorageSync('userInfo').openid;
    if ((!options.openid && parent_id == '') || options.openid == wx.getStorageSync('userInfo').openid) {
      request_05.ninepayInfo({
        openid,
        activity_id
      }).then(res => {
        // tool.loading_h();
        console.log('shakeDetail', res)
        this.setData({
          activity_id,
          prizeInfo: res.data.data.help_info.prize_info,
          help_num: res.data.data.help_info.help_num,
          helpList: res.data.data.help_info.help_list,
          options
        })
        if (res.data.data.show_page == 7) {
          console.log('领奖')
          this.setData({
            isShowMe: false,
            isShow: true,
            isTen: true,
            height: 480
          })
        }
      })
    } else {
      console.log(user_id)
      let help_user_id = user_id
      if (user_id) {
        console.log('user_id', user_id)
        console.log('openid', openid)
        request_05.helpIndex({
          help_user_id,
          activity_id,
          openid,

        }).then(res => {
          console.log('11111111111111111111', res);
          this.setData({
            isShowMe: false,
            isShowFriend: true,
            isShow: true,
            isTen: false,
            height: 580,
            user_id,
            user_info: res.data.data.user_info,
            helpList: res.data.data.help_list,
            is_help: res.data.data.is_help,
            prize_info: res.data.data.prize_info,
            activity_id,
            options
          })
          // tool.loading_h();
          if (res.data.data.can_help == 0) {
            this.setData({
              isHelpH: false,
            })
          }
          if (res.data.status == 0) {
            tool.alert(res.data.msg);
            this.setData({
              isHelpH: false,
            })
          }
        })
      }
    }
  },

  // 助力
  helpH() {
    if ((wx.getStorageSync("userInfo").user_type == 0 && this.data.car_owner) || (!wx.getStorageSync("userInfo").nickName || !wx.getStorageSync("userInfo").unionid)) return;
    if (this.data.isHelpH) {
      let options = this.data.options
      let help_user_id = this.data.user_id
      let activity_id = this.data.activity_id
      let openid = wx.getStorageSync('userInfo').openid
      request_05.doHelp({
        help_user_id,
        openid,
        activity_id
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
    } else {
      tool.alert('用户已助力完成,不可助力')
    }
  },

  //分享获取更多好礼
  shareFriend() {
    let headimgList = this.data.helpList.slice(0, this.data.max_help_num_upgrade);
    let help_num2 = this.data.max_help_num_upgrade;
    this.setData({
      isShowMe: true,
      isShow: false,
      isTen: false,
      headimgList,
      help_num2
    })
  },

  //查看订单
  toOrder() {
    let order_id = this.data.order_id
    router.jump_red({
      url: `/pages/order_detail/order_detail?order_id=${order_id}`
    })
  },

  // 打开关闭分享
  isShare() {
    this.setData({
      isShare: !this.data.isShare
    });
  },

  // 分享朋友圈
  bindShare() {
    let activity_id = this.data.options.activity_id
    let user_id = this.data.user_id
    let openid = wx.getStorageSync('userInfo').openid
    router.jump_nav({
      url: `/pages/poster/poster?activity_id=${activity_id}&openid=${openid}&user_id=${user_id}`,
    })
  },

  // 领取奖品
  lqPrize() {
    let openid = wx.getStorageSync('userInfo').openid
    let activity_id = this.data.activity_id
    let options = this.data.options
    request_05.payPrize({
      activity_id,
      openid
    }).then(res => {
      if (res.data.status == 1) {
        tool.alert(res.data.msg)
        this.initData(options)
      } else {
        tool.alert(res.data.msg)
      }
    })
  },
  //   let help_num = this.data.help_num;
  //   let help_num2 = this.data.help_num2;
  //   var _this = this;
  //   let options = this.data.options;
  //   let activity_id = this.data.activity_id;
  //   let openid = wx.getStorageSync('userInfo').openid;
  //   if (this.data.max_help_num_upgrade > help_num) {
  //     wx.showModal({
  //       title: '提示',
  //       content: '领取后将不能升级礼品/卡券,您确定要领取吗？',
  //       success(res) {
  //         if (res.confirm) {
  //           request_05.upgradePrize({
  //             activity_id,
  //             openid
  //           }).then(res => {
  //             if (res.data.status == 1) {
  //               let card_list = [res.data.data.card_info];
  //               wx.addCard({
  //                 cardList: card_list,
  //                 success(res) {
  //                   console.log('cardList', res)
  //                   let card_code = res.cardList[0].code;
  //                   request_05.updateCardCode({
  //                     activity_id,
  //                     openid,
  //                     card_code
  //                   }).then(res => {
  //                     console.log('update_card_code', res)
  //                     if (res.data.status == 1) {
  //                       tool.alert('领取成功')
  //                       _this.initData(options)
  //                     }
  //                   })
  //                 }
  //               })
  //             } else {
  //               tool.alert(res.data.msg)
  //             }
  //           })
  //         } else if (res.cancel) {
  //           console.log('用户点击取消')
  //         }
  //       }
  //     })
  //   } else {
  //     request_05.upgradePrize({
  //       activity_id,
  //       openid
  //     }).then(res => {
  //       console.log(res)
  //       let card_list = [res.data.data.card_info];
  //       wx.addCard({
  //         cardList: card_list,
  //         success(res) {
  //           console.log('cardList', res)
  //           let card_code = res.cardList[0].code;
  //           request_05.updateCardCode({
  //             activity_id,
  //             openid,
  //             card_code
  //           }).then(res => {
  //             console.log('update_card_code', res)
  //             if (res.data.status == 1) {
  //               tool.alert('领取成功')
  //               _this.initData(options)
  //             }
  //           })
  //         }
  //       })
  //     })
  //   }
  // },

  toCard_bag_page() {
    router.jump_nav({
      url: `/pages/o_card_bag/o_card_bag`
    })
  },


  // 查看其他活动
  toActivityList() {
    router.jump_red({
      url: `/pages/activity_list/activity_list`,
    })
  },

  // 去摇一摇
  toShake() {
    let activity_id = this.data.activity_id;
    console.log(activity_id)
    router.jump_red({
      url: `/pages/shake_shake/shake_shake?activity_id=${activity_id}`,
    })
  },

  // 关闭助力成功弹窗
  closeSuc() {
    this.setData({
      helpSuc: false
    })
  },

  // 关闭升级成功弹窗
  once() {
    this.setData({
      isSuc: false
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    this.setData({
      options,
    })
    request_01.login(() => {
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
    let openid = wx.getStorageSync('userInfo').openid;
    let activity_id = this.data.activity_id;
    let user_id = wx.getStorageSync('userInfo').user_id;
    let obj = {
      title: '下订',
      path: `/pages/payment/pay_help/pay_help?user_id=${user_id}&openid=${openid}&activity_id=${activity_id}`,
      imageUrl: this.data.IMGSERVICE + "/activity/share_shake.png?123"
    };
    return obj;
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
})