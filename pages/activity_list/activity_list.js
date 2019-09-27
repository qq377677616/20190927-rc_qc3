// pages/activity_list/activity_list.js
const request_01 = require('../../utils/request/request_01.js');

const router = require('../../utils/tool/router.js');

const alert = require('../../utils/tool/alert.js');

const app = getApp();//获取应用实例
Page({

  /**
   * 页面的初始数据
   */
  data: {
    IMGSERVICE: app.globalData.IMGSERVICE,
    page404:false,
    options:{},
    firstShow:false,
    bannerList:[],
    dotIndex:0,
    activityList:[],
    page:1,
    activityKey:true,
    activityPrivateKey:true,
    isMore:false,
    str:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    request_01.login(()=>{
      this.initData(options)
    })
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
    const page = this.data.page;
    const activityKey = this.data.activityKey;
    const activityPrivateKey = this.data.activityPrivateKey;
    const userInfo = wx.getStorageSync('userInfo');

    if( !activityKey || !activityPrivateKey )return;

    this.setData({
      activityKey:false,
      str:'加载中...',
      isMore:true,
    })

    request_01.activityList({
      page:page + 1,
      user_id:userInfo.user_id,
    })
      .then((value)=>{
        const newActivityList = value.data.data.list;
        const activityList = this.data.activityList;
        let isMore, activityPrivateKey;

        if( newActivityList.length ){//有数据返回
          isMore = false;
          activityPrivateKey = true;
        }
        else{//无数据返回
          isMore = true;
          activityPrivateKey = false;
        }

        this.setData({
          activityList:[...activityList, ...newActivityList],
          str:'- 我是有底线的 -',
          activityPrivateKey,
          page:page + 1,
          isMore,
        })
      })
      .catch((reason)=>{
        //fail
        this.setData({
          str:'- 我是有底线的 -',
          isMore:false,
        })
      })
      .then(()=>{
        //complete
        this.setData({
          activityKey:true,
        })
      })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  //banner轮播切换事件
  dotchange(e){
    this.setData({
      dotIndex: e.detail.current
    })
  },
  //页面初始化
  initData(options){
    const page = this.data.page;
    const userInfo = wx.getStorageSync('userInfo');

    Promise.all([
      request_01.activityList({
        page,
        user_id:userInfo.user_id,
      })
    ])
      .then((value)=>{
        //success
        const activityList = value[0].data.data.list;
        const bannerList = value[0].data.data.banner;

        let isMore, str;

        if( activityList.length ){//有数据
          str = '- 我是有底线的 -';
          isMore = false;
        }
        else{//无数据
          str = '没有找到相关活动~';
          isMore = true;
        }

        this.setData({
          activityList,
          bannerList,
          str,
          isMore,
        })
      })
      .catch((reason)=>{
        //fail

        //开启404页面
        this.setData({
          page404:true,
        })
      })
      .finally(()=>{
        //complete

        this.setData({
          options,
        })
      })
  },
  //重新加载
  reload(){
    const options = this.data.options;

    //关闭404页面
    this.setData({
      page404:false,
    })

    this.onLoad( options );
  },
  //banner跳转
  bannerJump(e){
    const index = e.currentTarget.dataset.index;
    const bannerList = this.data.bannerList;
    const page = bannerList[index].page;

    if( page ){//page页面存在
      router.jump_nav({
        url:`/${page}`,
      })
    }
    else{//page页面不存在
      return false;
    }

  },
  //活动详情
  activityJump(e){
    const index = e.currentTarget.dataset.index;
    const activityList = this.data.activityList;
    const activity_id = activityList[index].activity_id;
    const screen = activityList[index].screen;
    wx.setStorageSync('screen', screen);
    const activity_type = activityList[index].activity_type;
    switch (activity_type){
      case 1:
        //抽奖
        router.jump_nav({
          url: `/pages/prize/prize?activity_id=${activity_id}`,
        })
      break;
      case 2:
        //投票
        if(screen){
          router.jump_nav({
            url: `/pages/ad/ad?activity_id=${activity_id}`,
          })
        }else{
          router.jump_nav({
            url: `/pages/vote/vote?activity_id=${activity_id}`,
          })
        }
      break;
      case 3:
        //点亮
        router.jump_nav({
          url: `/pages/prize/prize?activity_id=${activity_id}`,
        })
      break;
      case 4:
        //集攒
        router.jump_nav({
          url: `/pages/vote/vote?activity_id=${activity_id}`,
        })
      break;
      case 5:
        //团购
        router.jump_nav({
          url: `/pages/assemble/pin/pin?activity_id=${activity_id}`,
        })
      break;
      case 7:
        //报名
        router.jump_nav({
          url: `/pages/sign_up/sign_up?activity_id=${activity_id}`,
        })
      break;
      case 11:
        //看车
        router.jump_nav({
          url: `/pages/vote/vote?activity_id=${activity_id}`,
        })
      break;
      case 12:
        //摇红包
        router.jump_nav({
          url: `/pages/vote/vote?activity_id=${activity_id}`,
        })
      break;
      case 13:
        //13	砍价
        router.jump_nav({
          url: `/pages/bargain_index/bargain_index?activity_id=${activity_id}`,
        })
      break;
    }
  },
})