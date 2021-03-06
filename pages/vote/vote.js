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
    defuImg: "https://game.flyh5.cn/resources/game/wechat/szq/images/img_02.jpg",
    VideoBg: [],
    videoList: [{
        videoUrl: 'https://game.flyh5.cn/resources/game/wechat/szq/images/video_02.mp4',
        resource: 'https://game.flyh5.cn/resources/game/wechat/szq/images/img_02.jpg',
        curIndex: 8
      }, {
        videoUrl: 'https://game.flyh5.cn/resources/game/wechat/szq/images/video_03.mp4',
        resource: 'https://game.flyh5.cn/resources/game/wechat/szq/images/img_02.jpg',
        curIndex: 8
      },
      {
        videoUrl: 'https://game.flyh5.cn/resources/game/wechat/szq/images/video_04.mp4',
        resource: 'https://game.flyh5.cn/resources/game/wechat/szq/images/img_02.jpg',
        curIndex: 8
      },
    ],
    sequenceList: {
      url: 'https://game.flyh5.cn/resources/game/wechat/szq/images/love/love_',
      num: 33,
      speed: 60,
      loop: false
    },
    curIndexArr: [],
    sequenceListIndex0: 8,
    prevIndex: 0,
    imgVideoType: 1,
    rulspop: false,
    activeStatus: 0,
    text: "活动暂未开放",
    isjoin: false,
    show_rank_list: 0,
    isPrize: false,
  },

  // 获取swiper下标
  swiperChange(e) {
    const userIndex = e.detail.current;
    console.log(userIndex,'userIndex')
    this.setData({
      userIndex,
    })
  },

  start(e) { //序列动画开始
    console.log(this.data.activeStatus)
    if (this.data.activeStatus == 0) {
      tool.alert('活动已结束');
      return;
    }
    const activity_id = this.data.activity_id
    const user_id = wx.getStorageSync('userInfo').user_id
    let userIndex = this.data.userIndex; //当前swiper下标
    let vote_id = this.data.VideoBg[userIndex].vote_id
    console.log('vote_id', vote_id)
    let is_favorite = this.data.VideoBg[userIndex].is_favorite
    let votes = this.data.VideoBg[userIndex].votes;
    const type = 1;
    if (is_favorite == 0) {
      let _clickIndex = e.currentTarget.dataset.index
      console.log("_clickIndex", _clickIndex)
      this.sequenceStart("sequenceList", _clickIndex).then(() => {
        let _VideoBg = this.data.VideoBg
        this.data.VideoBg[userIndex].is_favorite = 1
        this.data.VideoBg[userIndex].votes = this.data.VideoBg[userIndex].votes + 1
        this.setData({
          VideoBg: _VideoBg.length > 0 ? _VideoBg : this.data.VideoBg
        })
        request_05.doVote({
          user_id,
          vote_id,
          type
        }).then(res => {
          if (res.data.status == 1) {
            tool.alert(res.data.msg)
          }
        })
      })
    } else {
      request_05.doVote({
        user_id,
        vote_id,
        type
      }).then(res => {
        if (res.data.msg == "您今天已为她/他投票") {
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
      _sequence.push({
        url: `${_url}${i + 1}.png`,
        speed: this.data[sequence].speed,
        num: _num,
        loop: this.data[sequence].loop
      })
    }
    this.setData({
      [sequence]: _sequence
    })
  },

  //序列动画开始
  sequenceStart(sequence, clickIndex) {
    let _num = 1
    return new Promise(resolve => {
      let autoSequence = setInterval(() => {
        let _VideoBg = this.data.VideoBg
        _VideoBg[clickIndex].curIndex++
          let _curSequenceIndex = this.data[`${sequence}Index`] || 0
        _curSequenceIndex++
        if (_VideoBg[clickIndex].curIndex < this.data[sequence][0].num - 1) {
          this.setData({
            VideoBg: _VideoBg
          })
        } else {
          if ((typeof(this.data[sequence][0].loop) == 'boolean' && this.data[sequence][0].loop) || (typeof(this.data[sequence][0].loop) == 'number' && _num < this.data[sequence][0].loop)) {
            _num++
          } else {
            clearInterval(autoSequence)
            this.setData({
              VideoBg: _VideoBg
            })
            resolve()
          }
        }
      }, this.data[sequence][0].speed)
    })
  },

  //点击参与活动
  toPartake() {
    if ((wx.getStorageSync("userInfo").user_type == 0 && this.data.car_owner) || !wx.getStorageSync("userInfo").nickName || !wx.getStorageSync("userInfo").unionid) return;
    let activity_id = this.data.activity_id;
    router.jump_nav({
      url: `/pages/lj_partake/lj_partake?activity_id=${activity_id}`,
    })
  },

  // 分享好友
  shareFriend() {
    let activity_id = this.data.activity_id
    let userIndex = this.data.userIndex; //当年swiper下标
    let user_id = wx.getStorageSync('userInfo').user_id
    let vote_id = this.data.VideoBg[userIndex].vote_id;
    let options = this.data.options
    let type = 2;
    request_05.doVote({
      user_id,
      vote_id,
      type
    }).then(res => {
      this.initData(options)
    })
  },
  
  toHome() {
    router.jump_red({
      url: `/pages/activity_list/activity_list`,
    })
  },

  // 点击头像判断是否参与活动
  toVoteDetail() {
    if ((wx.getStorageSync("userInfo").user_type == 0 && this.data.iscarActive) || !wx.getStorageSync("userInfo").nickName || !wx.getStorageSync("userInfo").unionid) return;
    let num = this.data.is_join;
    console.log(num)
    let activity_id = this.data.activity_id;
    console.log('activity_id', activity_id)
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

  // 初始化数据
  initData(options) {
    tool.loading('加载中')
    let activity_id = options.activity_id;
    let userIndex = options.index
    console.log(userIndex,'userIndex')
    const userInfo = wx.getStorageSync('userInfo');
    let headimg = wx.getStorageSync('userInfo').headimg;
    let user_id = wx.getStorageSync('userInfo').user_id;
    this.setData({
      userIndex,
      userInfo,
      activity_id,
      headimg,
      options,
    })

    // 投票活动首页
    request_05.voteIndex({
      user_id,
      activity_id
    }).then(res => {
      console.log("voteIndex", res);
        this.setData({
          indexInfo: res.data.data,
          car_owner:res.data.data.car_owner,
          isjoin: res.data.data.is_join,
        })
    })

    // 投票轮播首页
    let banIndex = request_05.voteRandPlay({
      user_id,
      activity_id
    }).then(res => {
      const _ban = res.data.data;
      const videoList = this.data.videoList;
      for (var i = 0; i < _ban.length; i++) {
        //为0时 未点赞
        if (_ban[i].is_favorite == 0) {
          _ban[i].curIndex = 8;
        } else {
          //已经点赞
          _ban[i].curIndex = 6;
        }
      }
      this.setData({
        VideoBg: _ban.length ? _ban : videoList,
      })
    })

    // 我的投票信息
    let myVote = request_05.myVote({
      user_id,
      activity_id
    }).then(res => {
      const myInfo = res.data.data.info;
      const is_join = res.data.data.is_join;
      this.setData({
        myInfo,
        is_join,
      })
    })
    tool.loading_h();
  },

  back_home() {
    router.jump_nav({
      url: `/pages/index/index`
    })
  },

  // 打开关闭分享弹窗
  isShare() {
    this.setData({
      isShare: !this.data.isShare
    });
  },

  isRed() {
    this.setData({
      isRed: !this.data.isRed
    });
  },

  //打开规则
  openRule() {
    this.setData({
      rulspop: true
    });
  },
  closePop() {
    // 判断活动是否结束   状态 1 - 正常 3 - 活动未开始 4 - 活动已结束 只有为1可上传
    this.setData({
      rulspop: false
    });
    if (!wx.getStorageSync("isRule").vote);
    this.activestatus();
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
    let options = this.data.options
    this.isVehicleOwnerHidePop()
    request_01.setUserInfo(e).then(res => {
      this.isVehicleOwner()
      this.initData(options)
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
    request_01.login(() => {
      this.initData(options);
    })
    if (options.isShare) {
      this.setData({
        isHome: true
      })
    }

    this.sequenceInit("sequenceList") //序列帧初始化

    if (options.user_id != null) {
      router.jump_nav({
        url: `/pages/vote_detail/vote_detail?activity_id=${activity_id}`,
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    tool.loading_h();
    this.setData({
      firstShow: true,
    })
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
  onShareAppMessage: function(options) {
    const userIndex = this.data.userIndex;
    let vote_id = this.data.VideoBg[userIndex].vote_id
    console.log(vote_id,'vote_id')
    let user_id = wx.getStorageSync('userInfo').user_id;
    let activity_id = this.data.activity_id;
    let obj = {
		title: '我正在参与话题征集，快来帮我投票，助我赢500元保养券！',
      path: `/pages/vote/vote?activity_id=${activity_id}&isShare=1&user_id=${user_id}&userIndex=${userIndex}`,
		imageUrl: 'https://weixinfslb.venucia.com/uploads/202001/21/15795964655e26bab153fd8.jpg'
    };
    return obj;
  }
})