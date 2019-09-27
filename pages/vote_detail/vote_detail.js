// pages/vote_detail/vote_detail.js

const request_01 = require('../../utils/request/request_01.js');

const request_05 = require('../../utils/request/request_05.js');

const router = require('../../utils/tool/router.js');

const tool = require('../../utils/tool/tool.js');

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    IMGSERVICE: app.globalData.IMGSERVICE, 
    imgVideoType: 1,
    isRed:false,
    isZan:0,
    isShare:false,
    isXin:false,
    num:[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26],
  },

  isShare() {
    if (this.data.vote_info.status == 1 || this.data.vote_info.status == null || this.data.vote_info.status == 3){
      this.setData({ isShare: !this.data.isShare });
    }else{
      tool.alert('审核未通过,不能分享')
    }
  },

  isZan() {
      const user_id = wx.getStorageSync('userInfo').user_id;
      const vote_id = this.data.vote_id;
      const type = 1;
      request_05.doVote({ user_id, vote_id, type}).then(res=>{
        const status = res.data.data.status
        this.setData({
          status,
        })
      }) 
  },

  isRed() {
    this.setData({ isRed: !this.data.isRed });
  },

  dianz() {
    console.log(this.data.activeStatus);
    if (this.data.activeStatus == 4) {
      tool.alert('活动已结束');
      return;
    }
    const activity_id = this.data.activity_id;
    const user_id = wx.getStorageSync('userInfo').user_id
    const vote_id = this.data.vote_id;
    let is_favorite = this.data.is_favorite;
    let type = 1;
    if (is_favorite == 0) {
      let isZan = this.data.isZan;
      let ding = setInterval(() => {
        isZan++;
        this.setData({
          isZan,
        })
        if (isZan == 27) {
          clearInterval(ding)
          this.setData({
            isZan: 4
          })
        }
      }, 50)  
        request_05.doVote({ user_id, vote_id, type }).then(res => {
          tool.alert(res.data.msg)
        })
    } else {
        request_05.doVote({ user_id, vote_id, type }).then(res => {
          tool.alert('您今天已为TA投过票~');
      })
    }


  },
    
  // 分享
  bindShare() {
    const activity_id = this.data.activity_id
    console.log("activity_id", activity_id)
    const user_id = wx.getStorageSync('userInfo').user_id
    const vote_id = this.data.vote_id;
    const type = 2;
    router.jump_nav({
      url: `/pages/poster/poster?activity_id=${activity_id}`,
    })
    request_05.doVote({ user_id, vote_id, type }).then(res => {
      console.log(res);
    })
  },

  // 分享好友
  shareFriend() {
    const activity_id = this.data.activity_id
    const user_id = wx.getStorageSync('userInfo').user_id
    const vote_id = this.data.vote_id;
    const type = 2;
    request_05.doVote({ user_id, vote_id, type }).then(res => {
      console.log(res);
    })
  },

  // 初始化数据
  initData(options){
    tool.loading('加载中')
    const activity_id = options.activity_id;
    console.log("activity_id", activity_id)
    const vote_id = options.vote_id;
    const hav_rank = 1;
    const user_id = wx.getStorageSync('userInfo').user_id;
    this.setData({
      activity_id,
    })

    request_05.voteIndex({ user_id, activity_id }).then(res => {
      this.setData({
        activeStatus: res.data.data.status,
      })
    })

    if(vote_id!=null){
      console.log("{ user_id, vote_id, hav_rank }",{ user_id, vote_id, hav_rank })
      request_05.voteDetail({ user_id, vote_id, hav_rank }).then(res => {
        console.log("voteDetail",res)
        const vote_info = res.data.data;
        const is_favorite = res.data.data.is_favorite;
        if (vote_info.is_favorite==0){
          this.setData({//未点赞
            isZan:3
          })
        }else{
          this.setData({
            isZan: 4
          })
        }
        this.setData({
          vote_info,
          vote_id,
          is_favorite,
          isXin:true,
        })
      })
    }else{
      request_05.myVote({ user_id, activity_id }).then(res => {
        console.log("detail",res);
        console.log("{ user_id, vote_id, hav_rank }", { user_id, activity_id })
        let vote_info = res.data.data.info
        let vote_id = res.data.data.info.vote_id
         this.setData({
           vote_info,
           vote_id,
        })
      })
    }
  },

  toPartake() {
    let activity_id = this.data.activity_id;
    router.jump_red({
      url: `/pages/lj_partake/lj_partake?activity_id=${activity_id}`,
    })
  },

  toHome(){
    let activity_id = this.data.activity_id;
    router.jump_nav({
      url: `/pages/index/index?activity_id=${activity_id}`,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    request_01.login(() => {
      this.initData(options);
    })
    let hav_rank = options.hav_rank
    let vote_id = options.vote_id
    let user_id = options.user_id
    let type = options.type
    let activity_id = options.activity_id
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    tool.loading_h(); 
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
  onShareAppMessage: function (options) {
    let user_id = wx.getStorageSync('userInfo').user_id;
    let vote_id = this.data.vote_id;
    let activity_id = this.data.activity_id;
    let type = 1;
    console.log(vote_id,user_id);
    let obj = {
      title: '大侠请留步！帮我点个赞，赢京东500元购物卡！',
      path: `/pages/vote_detail/vote_detail?hav_rank=1&vote_id=${vote_id}&user_id=${user_id}&type=${type}&activity_id=${activity_id}`,
      imageUrl: this.data.IMGSERVICE + "/activity/vote.jpg"
    };
    return obj; 
  },
})
