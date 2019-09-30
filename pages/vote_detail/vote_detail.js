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
    firstShow:false,
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
    let activity_id = this.data.activity_id;
    let user_id = wx.getStorageSync('userInfo').user_id
    let vote_id = this.data.vote_id;
    let is_favorite = this.data.is_favorite;
    let vote_info = this.data.vote_info
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
            isZan: 4,
            is_favorite:1,
          })
        }
      }, 50)
      is_favorite = 1
      vote_info.votes = vote_info.votes+1
      this.setData({
        vote_info,
      })
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
    let activity_id = this.data.activity_id
    let user_id = wx.getStorageSync('userInfo').user_id
    let vote_id = this.data.vote_id;
    let type = 2;
    request_05.myVote({ activity_id, user_id}).then(res=>{
      console.log('res.data.data.is_join', res.data.data.is_join)
      if(res.data.data.is_join==0){
        tool.alert('您还没有自己的作品哦~')
      }else{
        router.jump_nav({
          url: `/pages/poster/poster?activity_id=${activity_id}&vote_id=${vote_id}`,
        })
        request_05.doVote({ user_id, vote_id, type }).then(res => {
          console.log(res);
        })
      }
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
    console.log(options)
    let activity_id = '';
    let vote_id = '';
    let parent_id = '';
    if(options.scene) {
      let scene = decodeURIComponent(options.scene);
      console.log(scene)
      scene.split('&').forEach((item) => {
        console.log(item.split('='))
        if (item.split('=')[0] == 'p') {//找到channel_id并存储
          parent_id = item.split('=')[1]
        }
        if (item.split('=')[0] == 'a') {//找到channel_id并存储
          activity_id = item.split('=')[1]
        }
        if (item.split('=')[0] == 'v') {//找到user_id并存储
          vote_id = item.split('=')[1]
        }
      })
    }else {
      console.log(options)
      activity_id = options.activity_id;
      vote_id = options.vote_id;
    }
    
    tool.loading('加载中')
    
    console.log("activity_id", activity_id)
    console.log("vote_id", vote_id)
    
    let hav_rank = 1;
    let user_id = wx.getStorageSync('userInfo').user_id;
    this.setData({
      activity_id,
    })

    request_05.voteIndex({ user_id, activity_id }).then(res => {
      this.setData({
        activeStatus: res.data.data.status,
      })
    })

    if(vote_id!=null){
      request_05.voteDetail({ user_id, vote_id, hav_rank }).then(res => {
        console.log("voteDetail",res)
        let vote_info = res.data.data;
        let is_favorite = res.data.data.is_favorite;
        console.log('vote_info.rank',vote_info.rank)
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
          isHid:true,
        })
      })
      tool.loading_h(); 
    }else{
      request_05.myVote({ user_id, activity_id }).then(res => {
        console.log("detail",res);
        console.log("{ user_id, vote_id, hav_rank }", { user_id, activity_id })
        let vote_info = res.data.data.info
        let vote_id = res.data.data.info.vote_id
         this.setData({
           vote_info,
           vote_id,
           isHid:false,
        })
      })
      tool.loading_h(); 
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
    console.log('options', options)
    request_01.login(() => {
      this.initData(options);
    })
    let hav_rank = options.hav_rank
    let vote_id = options.vote_id
    let user_id = options.user_id
    let type = options.type
    let activity_id = options.activity_id
    this.setData({
      options,
      activity_id,
      vote_id,
      user_id
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    tool.loading_h(); 
    this.setData({
      firstShow:true
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let options = this.data.options
    if(this.data.firstShow){
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (options) {
    let user_id = wx.getStorageSync('userInfo').user_id;
    let vote_id = this.data.vote_id;
    let activity_id = this.data.activity_id;
    let type = 1;
    let parent_id = this.data.parent_id;
    console.log(vote_id,user_id);
    let obj = {
      title: '大侠请留步！帮我点个赞，赢京东500元购物卡！',
      path: `/pages/vote_detail/vote_detail?vote_id=${vote_id}&user_id=${user_id}&activity_id=${activity_id}&parent_id=${parent_id}`,
      imageUrl: this.data.IMGSERVICE + "/activity/vote.jpg"
    };
    return obj; 
  },
})
