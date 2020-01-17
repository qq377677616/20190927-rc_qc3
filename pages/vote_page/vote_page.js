// pages/vote_page/vote_page.js活动id:42 43有数据
const request_01 = require('../../utils/request/request_01.js');
const request_05 = require('../../utils/request/request_05.js');
const router = require('../../utils/tool/router.js');
const alert = require('../../utils/tool/alert.js');
const tool = require('../../utils/tool/tool.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    IMGSERVICEZ: app.globalData.IMGSERVICE,
    voteList: [],
    page: 1,
    isShow: false,
    firstShow: false, //返回刷新开关
    rulspop: false, // 规则
    isPrize: false //中奖列表
  },

  initData(options) {
    let activity_id = options.activity_id
    let user_id = wx.getStorageSync('userInfo').user_id
    this.myVote(options)
    request_05.voteIndex({
      activity_id,
      user_id
    }).then((res) => {
      // 活动开始状态   1-正常 3-活动未开始 4-活动已结束 只有为1可上传
      if (res.data.data.status == 3) {
        this.setData({
          isVehicleOwnerHidePop: true,
          popType: 1,
          text: "活动预计" + res.data.data.start_date + "号开启 敬请期待"
        })
      } else if (res.data.data.status == 4) {
        // 判断结束后是否参与过   是否需要展示中奖列表   
        if (res.data.data.is_join == 0 && res.data.data.show_rank_list == 0) {
          this.setData({
            isVehicleOwnerHidePop: true,
            popType: 1,
            text: "活动已结束"
          })
        }
      } else if (res.data.data.show_rank_list == 1 && res.data.data.is_join == 1 || res.data.data.show_rank_list == 2 && res.data.data.is_join == 1) {
        this.close_prize()
      }
      this.setData({
        options,
        indexData: res.data.data,
        car_owner: res.data.data.car_owner,
        activity_id
      })
    })
  },

  // 我的投票信息
  myVote(options) {
    let activity_id = options.activity_id
    let user_id = wx.getStorageSync('userInfo').user_id
    request_05.myVote({
      user_id,
      activity_id
    }).then(res => {
      const myInfo = res.data.data.info;
      const is_join = res.data.data.is_join;
      this.setData({
        myInfo,
      })
    })
  },

  // 领取奖品
  getPrize() {
    let obj = this.data.indexData.prize_info
    obj.activity_id = this.data.activity_id;
    let order_goods_id = obj.order_goods_id
    let user_id = wx.getStorageSync('userInfo').user_id
    // 实物或微信卡券    1 卡券  2实物
    if (obj.prize_type == 1) {
      // order_id   0表示未留资   
      if (obj.order_id == 0) {
        router.jump_red({
          url: `/pages/vote_prize/vote_prize?obj=${JSON.stringify(obj)}`
        })
      } else {
        // is_receive   留资  未领取
        if (obj.is_receive == 0) {
          request_05.getWechatCard({
            user_id,
            order_goods_id
          }).then(res => {
            let cardList = res.data.data[0]
            wx.addCard({
              cardList: [cardList],
              success(res) {
                console.log('cardList', res)
                let card_code = res.cardList[0].code;
                request_05.orderCardCode({
                  user_id,
                  order_goods_id,
                  card_code
                }).then(res => {
                  console.log('update_card_code', res)
                  if (res.data.status == 1) {
                    tool.alert('领取成功')
                    setTimeout(() => {
                      _this.initData(options)
                    }, 500)
                  }
                })
              }
            })
          })
        }
      }
    } else {
      if (obj.status == 0) {
        router.jump_red({
          url: `/pages/vote_prize/vote_prize?obj=${JSON.stringify(obj)}`
        })
      } else {
        router.jump_red({
          url: `/pages/order_detail/order_detail?order_id=${obj.order_id}`
        })
      }
    }
  },

  // 弹窗永久弹一次
  setRule() {
    if (!wx.getStorageSync("isRule").vote) {
      this.setData({
        rulspop: true
      });
      let _isRule = wx.getStorageSync("isRule") || {}
      _isRule.vote = true
      wx.setStorageSync("isRule", _isRule)
    }
  },

  // 打开关闭规则
  switchRule() {
    this.setData({
      rulspop: !this.data.rulspop
    })
  },

  // 打开关闭中奖弹窗
  close_prize() {
    this.setData({
      isPrize: !this.data.isPrize
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
      this.getrankList(options);
      this.setRule();
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    tool.loading_h();
    this.setData({
      firstShow: true
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.setData({
      voteList: [],
      page: 1
    });
    let options = this.data.options
    if (this.data.firstShow) {
      this.onLoad(options);
    }
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
    this.setData({
      page: ++this.data.page
    })
    this.getrankList();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  // 排行榜
  getrankList() {
    tool.loading('加载中')
    let arr = [];
    arr = this.data.voteList;
    let activity_id = this.data.options.activity_id
    let dat = {
      activity_id: activity_id,
      user_id: wx.getStorageSync('userInfo').user_id,
      page: this.data.page
    }
    request_01.voteList(dat).then((res) => {
      if (res.data.status == 1 && res.data.data.list.length > 0) {
        for (let i = 0; i < res.data.data.list.length; i++) {
          arr.push(res.data.data.list[i])
        }
        if (arr.length <= 0) {
          this.setData({
            isShow: true
          })
        }
        this.setData({
          voteList: arr
        })
        console.log('排行榜列表', arr);
      }
    }).catch((reason) => {
      console.log(reason);
    })
    tool.loading_h();
  },

  // 投票
  goVote(e) {
    console.log(e)
    let vote_id = e.currentTarget.dataset.vote;
    let arrlist = this.data.voteList;
    let dat = {
      user_id: wx.getStorageSync('userInfo').user_id,
      vote_id: vote_id,
      type: 1
    }
    request_01.voteing(dat).then((res) => {
      console.log(res.data)
      if (res.data.status == 1) {
        for (let i = 0; i < arrlist.length; i++) {

          if (arrlist[i].vote_id == vote_id) {
            console.log('i', i)
            arrlist[i].is_favorite = 1;
            arrlist[i].votes = arrlist[i].votes + 1;
          }
        }
        this.setData({
          voteList: arrlist
        });
        console.log(this.data.voteList)
      } else {
        if (res.data.msg == '活动已结束') {
          alert.alert({
            str: res.data.msg
          })
        } else {
          alert.alert({
            str: '您今天以为TA投过票了~'
          })
        }
      }
    }).catch((reason) => {
      tool.alert(reason);
    })
  },

  //点击参与活动
  toPartake() {
    console.log(1111111)
    if ((wx.getStorageSync("userInfo").user_type == 0 && this.data.car_owner) || !wx.getStorageSync("userInfo").nickName || !wx.getStorageSync("userInfo").unionid) return;
    let activity_id = this.data.activity_id;
    router.jump_nav({
      url: `/pages/lj_partake/lj_partake?activity_id=${activity_id}`,
    })
  },

  //跳转投票轮播页
  goVotedel(e) {
    let index = e.currentTarget.dataset.index;
    let activity_id = this.data.activity_id;
    router.jump_nav({
      url: `/pages/vote/vote?index=${index}&activity_id=${activity_id}`,
    })
  },


  //判断是否授权和是否是车主
  isVehicleOwner(e) {
    console.log('e', e)
    if ((wx.getStorageSync("userInfo").nickName && wx.getStorageSync("userInfo").user_type == 1 && wx.getStorageSync("userInfo").unionid) || (e && e.target.dataset.type != 'ok') || (wx.getStorageSync("userInfo").nickName && !this.data.car_owner && wx.getStorageSync("userInfo").unionid)) return
    if (!wx.getStorageSync("userInfo").nickName || !wx.getStorageSync("userInfo").unionid) {
      this.setData({
        popType: 2
      })
    } else if (wx.getStorageSync("userInfo").user_type == 0 && this.data.car_owner) {
      this.setData({
        popType: 3
      })
    }
    this.isVehicleOwnerHidePop()
  },
  //授完权后处理
  getParme(e) {
    this.isVehicleOwnerHidePop()
    request_01.setUserInfo(e).then(res => {
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