// pages/vote/vote.js

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
    firstShow: false,
    isShow: false,
    isRed: false,
    isShare: false,
    defuImg:"https://game.flyh5.cn/resources/game/wechat/szq/images/img_02.jpg",
    VideoBg:[],
    videoList: [
      { videoUrl: 'https://game.flyh5.cn/resources/game/wechat/szq/images/video_04.mp4', resource: 'https://game.flyh5.cn/resources/game/wechat/szq/images/img_02.jpg', curIndex: 8 },
    ],
    sequenceList: { url: 'https://game.flyh5.cn/resources/game/wechat/szq/images/love/love_', num: 28, speed: 60, loop: false },
    curIndexArr: [],
    sequenceListIndex0: 8,
    prevIndex: 0,
    imgVideoType: 1,
    rulspop: false,
    userIndex: 0,
    activeStatus:0,
    text:"活动暂未开放",
    isjoin:false,
    show_rank_list:0,
    isPrize:false,
  },

  start(e) {//序列动画开始
    console.log(this.data.activeStatus)
    if (this.data.activeStatus == 4){
      tool.alert('活动已结束');
      return;
    }
    const activity_id = this.data.activity_id
    const user_id = wx.getStorageSync('userInfo').user_id
    let userIndex = this.data.userIndex; //当年swiper下标
    let vote_id = this.data.videoList[userIndex].vote_id
    let is_favorite = this.data.videoList[userIndex].is_favorite
    let votes = this.data.videoList[userIndex].votes;
    const type = 1;
    if (is_favorite == 0) {
      let _clickIndex = e.currentTarget.dataset.index
      console.log("_clickIndex", _clickIndex)
      this.sequenceStart("sequenceList", _clickIndex).then(() => {
        let _videoList = this.data.videoList
        _videoList[_clickIndex].curIndex = 6
        this.data.videoList[userIndex].is_favorite = 1
        this.data.videoList[userIndex].votes = this.data.videoList[userIndex].votes + 1
        this.setData({ videoList: _videoList.length > 0 ? _videoList:this.data.videoList})
        request_05.doVote({ user_id, vote_id, type }).then(res => {
          tool.alert(res.data.msg)
        })
      })
    } else {
      request_05.doVote({ user_id, vote_id, type }).then(res => {
        if (res.data.msg =="您今天已为她/他投票"){
          tool.alert('您今天已为TA投过票~');
        }
      })
    }

  },
  sequenceInit(sequence) {
    let _sequence = []
    let _url = this.data[sequence].url
    let _num = this.data[sequence].num
    for (let i = 0; i < _num; i++) {
      _sequence.push({ url: `${_url}${i + 1}.png`, speed: this.data[sequence].speed, num: _num, loop: this.data[sequence].loop })
    }
    this.setData({ [sequence]: _sequence })
  },

  //判断是否授权和是否是车主
  isVehicleOwner(e) {
    // if ((wx.getStorageSync("userInfo").nickName && wx.getStorageSync("userInfo").user_type == 1) || (e && e.target.dataset.type != 'ok' && (this.data.iscarActive == 1 ? true : false) ) || (wx.getStorageSync("userInfo").nickName && !(this.data.iscarActive == 1 ? true : false))) return
    if ((wx.getStorageSync("userInfo").nickName && wx.getStorageSync("userInfo").user_type == 1) || (e && e.target.dataset.type != 'ok') || (wx.getStorageSync("userInfo").nickName && !this.data.iscarActive)) return
    if (!wx.getStorageSync("userInfo").nickName) {
      this.setData({ popType: 2 })
    } else if (wx.getStorageSync("userInfo").user_type == 0) {
      this.setData({ popType: 3 })
    }
    this.isVehicleOwnerHidePop()
  },
  //授完权后处理
  getParme(e) {
    this.isVehicleOwnerHidePop()
    request_01.setUserInfo(e).then(res => {
      this.setData({
        userInfo: wx.getStorageSync('userInfo')
      })
      this.isVehicleOwner()
    })
  },
  //是否授权、绑定车主弹窗
  isVehicleOwnerHidePop() {
    this.setData({ isVehicleOwnerHidePop: !this.data.isVehicleOwnerHidePop })
  },

  //序列动画开始
  sequenceStart(sequence, clickIndex) {
    let _num = 1
    return new Promise(resolve => {
      let autoSequence = setInterval(() => {
        let _videoList = this.data.videoList
        _videoList[clickIndex].curIndex++
        let _curSequenceIndex = this.data[`${sequence}Index`] || 0
        _curSequenceIndex++
        if (_videoList[clickIndex].curIndex <= this.data[sequence][0].num) {
          this.setData({ videoList: _videoList })
        } else {
          if ((typeof (this.data[sequence][0].loop) == 'boolean' && this.data[sequence][0].loop) || (typeof (this.data[sequence][0].loop) == 'number' && _num < this.data[sequence][0].loop)) {
            _num++
          } else {
            clearInterval(autoSequence)
            resolve()
          }
        }
      }, this.data[sequence][0].speed)
    })
  },

  getPrize(){
    router.jump_nav({
      url:`/pages/o_prize/o_prize`
    })
  },

  back_home(){
    router.jump_nav({
      url:`/pages/index/index`
    })
  },

  close_prize(){
    this.setData({ isPrize: !this.data.isPrize })
  },

  // 打开关闭分享弹窗
  isShare() {
    this.setData({ isShare: !this.data.isShare });
  },

  // 规则图片打开关闭
  isHidePop() {
    this.setData({ isShow: !this.data.isShow });
  },

  isRed() {
    this.setData({ isRed: !this.data.isRed });
  },

  openRule() {
    this.setData({ rulspop: true });
  },
  closePop() {
    // 判断活动是否结束   状态 1 - 正常 3 - 活动未开始 4 - 活动已结束 只有为1可上传
    this.setData({ rulspop: false });
    if (!wx.getStorageSync("isRule").vote);
    this.activestatus();
    
  },
  activestatus(){
    let activity_id = this.data.activity_id;
    if (this.data.activeStatus == 3) {
      this.setData({
        isVehicleOwnerHidePop: true,
        popType: 1,
        text: "活动暂未开始"
      })
    } else if (this.data.activeStatus == 4) {
      console.log("活动结束")
      if (this.data.isjoin == 0) {
        tool.alert('活动已结束');
        setTimeout(() => {
          router.jump_nav({
            url: `/pages/index/index`,
          })
        }, 1500)
      } 
      else {
        if (this.data.show_rank_list == 1) {
          this.close_prize();
        }
        else if (this.data.show_rank_list == 2) {
          this.close_prize();
        }
      }
    }
  },
  // 排行榜
  votePageJump() {
    let activity_id = this.data.activity_id;
    router.jump_nav({
      url: `/pages/vote_page/vote_page?activity_id=${activity_id}`,
    })
  },

  //点击参与活动
  toPartake() {
    if ((wx.getStorageSync("userInfo").user_type == 0 && this.data.iscarActive) || !wx.getStorageSync("userInfo").nickName) return;
    let activity_id = this.data.activity_id;
    router.jump_nav({
      url: `/pages/lj_partake/lj_partake?activity_id=${activity_id}`,
    })
  },

  // 分享好友
  shareFriend() {

    const activity_id = this.data.activity_id
    const userIndex = this.data.userIndex; //当年swiper下标
    const user_id = wx.getStorageSync('userInfo').user_id
    const vote_id = this.data.videoList[userIndex].vote_id;
    const type = 2;

    request_05.doVote({ user_id, vote_id, type }).then(res => {
      console.log(res);
    })
  },

  // 获取swiper下标
  swiperChange(e) {
    const userIndex = e.detail.current;
    this.setData({
      userIndex,
    })
  },

  // 点击头像判断是否参与活动
  toVoteDetail() {
    if ((wx.getStorageSync("userInfo").user_type == 0 && this.data.iscarActive) || !wx.getStorageSync("userInfo").nickName) return;
    let num = this.data.is_join;
    console.log(num)
    let activity_id = this.data.activity_id;
    switch (num) {
      case 0:
        router.jump_nav({
          url: `/pages/upload/upload?activity_id=${activity_id}`,
        })
        break;
      case 1:
        router.jump_nav({
          url: `/pages/vote_detail/vote_detail?activity_id=${activity_id}`,
        })
        break;
    }
  },

  // 弹窗永久弹一次
  setRule() {
    if (!wx.getStorageSync("isRule").vote) {
      this.setData({ rulspop: true });
      let _isRule = wx.getStorageSync("isRule") || {}
      _isRule.vote = true
      wx.setStorageSync("isRule", _isRule)
    }
  },


  // 初始化数据
  initData(options) {
    let pages = getCurrentPages();
    let prevPage = pages.length - 1;
    this.setData({
      prevPage,
    })

    tool.loading('加载中')

    const userInfo = wx.getStorageSync('userInfo');
    let headimg = wx.getStorageSync('userInfo').headimg;
    let user_id = wx.getStorageSync('userInfo').user_id;
    console.log(user_id);
    let activity_id = options.activity_id;
    wx.setStorageSync('activity_id', activity_id)
    this.setData({
      userInfo,
      activity_id,
      headimg,
    })


    if (options.user_id) {
      router.jump_nav({
        url: `/pages/vote_detail/vote_detail?activity_id=${activity_id}`,
      })
    }

    // 投票活动首页
    request_05.voteIndex({ user_id, activity_id }).then(res => {
      console.log("voteIndex", res);
      let indexInfo = res.data.data;
      let iscarActive = res.data.data.car_owner;
      let rank_list = res.data.data.rank_list
      console.log("rank_list", rank_list)
      let is_win = res.data.data.is_win
      if(res.data.status==1){
        this.setData({
          indexInfo,
          iscarActive,
          activeStatus:res.data.data.status,
          isjoin: res.data.data.is_join,
          rank_list,
          is_win,
          show_rank_list:res.data.data.show_rank_list
        })
        console.log(wx.getStorageSync("isRule").vote);
        if (wx.getStorageSync("isRule").vote)
        this.activestatus();
        this.setRule();
      }
      // 判断活动是否结束   状态 1 - 正常 3 - 活动未开始 4 - 活动已结束 只有为1可上传
      // if (res.data.data.status == 4) {
      //   // 判断用户是否参与   状态 0未参与 1参与
      //   if (res.data.data.is_join == 0) {
      //     tool.alert('活动已结束');
      //     setTimeout(() => {
      //       router.jump_nav({
      //         url: `/pages/index/index`,
      //       })
      //     })
      //   } else {
      //     if (res.data.data.show_rank_list == 1) {
      //       router.jump_nav({
      //         url: `/pages/activity_publish/activity_publish`,
      //       })
      //     }
      //     if (res.data.data.show_rank_list == 2) {
      //       router.jump_nav({
      //         url: `/pages/activity_publish/activity_publish`,
      //       })
      //     }
      //   }
      // }
    })

    // 投票轮播首页
    let banIndex = request_05.voteRandPlay({ user_id, activity_id }).then(res => {
      const _ban = res.data.data
      const videoList = this.data.videoList;
      console.log("videoList", videoList)
      console.log(_ban)
      for (var i = 0; i < _ban.length; i++) {
        //为0时 未点赞
        console.log(_ban[i].is_favorite)
        if (_ban[i].is_favorite == 0) {
          _ban[i].curIndex = 8;
        }
        else {
          //已经点赞
          _ban[i].curIndex = 6;
        }
      }
      this.setData({
        VideoBg: _ban.length ? _ban : videoList,
      })
    })

    // 我的投票信息
    let myVote = request_05.myVote({ user_id, activity_id }).then(res => {
      const myInfo = res.data.data.info;
      const is_join = res.data.data.is_join;
      this.setData({
        myInfo,
        is_join,
      })
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let activity_id = options.activity_id;
    this.setData({
      activity_id,
    });
    request_01.login(() => {
      this.initData(options);
    })
    if(options.isShare){
      this.setData({
        isHome:true
      })
    }
    this.sequenceInit("sequenceList")//序列帧初始化
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    tool.loading_h();
    this.setData({
      firstShow: true,
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    tool.loading('加载中')
    const firstShow = this.data.firstShow;
    if (firstShow) {
      let activity_id = this.data.activity_id;
      let user_id = wx.getStorageSync('userInfo').user_id
      let banIndex = request_05.voteRandPlay({ user_id, activity_id }).then(res => {
        const _ban = res.data.data
        console.log(_ban)
        for (var i = 0; i < _ban.length; i++) {
          //为0时 未点赞
          console.log(_ban[i].is_favorite)
          if (_ban[i].is_favorite == 0) {
            _ban[i].curIndex = 8;
          }
          else {
            //已经点赞
            _ban[i].curIndex = 6;
          }
        }
        this.setData({
          videoList: _ban.length > 0 ? _ban : this.data.videoList
          })
        })
     }

    let user_id = wx.getStorageSync('userInfo').user_id;
    let activity_id = this.data.activity_id;
    let myVote = request_05.myVote({ user_id, activity_id }).then(res => {
      const myInfo = res.data.data.info;
      const is_join = res.data.data.is_join;
      this.setData({
        myInfo,
        is_join,
      })
    })
    tool.loading_h();
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
    const userIndex = this.data.userIndex;
    let vote_id = this.data.videoList[userIndex].vote_id
    let user_id = wx.getStorageSync('userInfo').user_id;
    let activity_id = this.data.activity_id;
    console.log(`/pages/vote/vote?user_id=${user_id}&activity_id=${activity_id}`)
    let obj = {
      title: '大侠请留步！帮我点个赞，赢京东500元购物卡！',
      path: `/pages/vote/vote?activity_id=${activity_id}&isShare=1`,
      imageUrl: this.data.IMGSERVICE + "/activity/vote.jpg"
    };
    return obj;
  }
})