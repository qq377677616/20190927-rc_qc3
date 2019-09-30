//index.js
const mta = require('../../utils/public/mta_analysis.js')

const request_01 = require('../../utils/request/request_01.js');

const method = require('../../utils/tool/method.js');

const router = require('../../utils/tool/router.js');

const authorization = require('../../utils/tool/authorization.js');

const alert = require('../../utils/tool/alert.js');

const app = getApp();//获取应用实例

Page({
  data: {
    IMGSERVICE: app.globalData.IMGSERVICE,
    page404:false,
    options:{},
    firstShow:false,
    keyGroup:{},
    bindcarIf:false,//绑定车主
    giftIf:false,//见面礼
    signInIf:false,//签到
    listInfo:{},//banner icon
    dotIndex:0,
    activityList:[],
    activityPage:1,
    activityKey:true,
    activityPrivateKey:true,
    str:'',
    isMore:false,
    tag:true,
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let activityPage = this.data.activityPage;
    let activityKey = this.data.activityKey;
    let activityPrivateKey = this.data.activityPrivateKey;
    const userInfo = wx.getStorageSync('userInfo');

    //滚动加载中不允许操作
    if( !activityKey || !activityPrivateKey )return;

    this.setData({
      activityKey:false,
      str:'加载中...',
      isMore:true,
    })

    request_01.indexActivity({
      page:activityPage + 1,
      user_id:userInfo.user_id,
    })
      .then((value)=>{
        //success
        const data = value.data.data.list;
        let activityList = this.data.activityList;
        let isMore, activityPrivateKey;

        if( data.length ){//有数据返回
          isMore = false;
          activityPrivateKey = true;

        }
        else{//无数据返回

          isMore = true;
          activityPrivateKey = false;
        }
        this.setData({
          activityList:[...activityList, ...data],
          activityPage:activityPage + 1,
          str:'- 我是有底线的 -',
          isMore,
          activityPrivateKey,
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
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    mta.Page.init()//腾讯统计
    if (wx.getStorageSync("shareIds").channel_id) mta.Event.stat("channel_sunode", { channel_id: wx.getStorageSync("shareIds").channel_id, page: 'home' })
    request_01.login(()=>{
      this.initData(options)
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    const IMGSERVICE = this.data.IMGSERVICE;
    return {
        title:'全新启辰T90跨悦上市，点击赢好礼！',
        imageUrl:`${IMGSERVICE}/index/index.jpg`,
        path: '/pages/index/index'
    };
  },
  //页面初始化
  initData(options){
    const activityPage = this.data.activityPage;
    const userInfo = wx.getStorageSync('userInfo');
    Promise.all([
      request_01.indexBanner({
        user_id:userInfo.user_id,
      }),
      request_01.indexActivity({
        user_id:userInfo.user_id,
        page:activityPage,
      }),
      request_01.signInInfo({
        user_id:userInfo.user_id,
      }),
      request_01.personalInfo({
        user_id:userInfo.user_id,
        openid:userInfo.openid,
      }),
      // request_01.tag({
      //   version:'3.0',
      // }),
    ])
      .then((value)=>{
        const listInfo = value[0].data.data;
        const activityList = value[1].data.data.list;
        const signInInfo = value[2].data.data;
        const personalInfo = value[3].data.data;
        // const tag = value[4].data.status;
        const keyGroup = wx.getStorageSync('keyGroup');

        let isMore;

        if( activityList.length ){//有商品数据
          isMore = false;
        }
        else{//无商品数据
          isMore = true;
        }
        this.setData({
          listInfo,    
          activityList,
          signInIf:signInInfo.is_sign == 1 ? false : true,
          str:'- 我是有底线的 -',
          isMore,
          giftIf:personalInfo.nickname ? false : true,//是否授权 授权关闭见面礼 
          keyGroup,
          // tag:tag == 1 ? true : false,// 1-展示 0-隐藏
        })

      })
      .catch((reason)=>{
        //fail

        //开启404页面
        this.setData({
          page404:true,
        })
      })
      .then(()=>{
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
  //banner轮播切换事件
  dotchange(e){
    this.setData({
      dotIndex: e.detail.current
    })
  },
  //banner图跳转
  bannerJump(e){
    const index = e.currentTarget.dataset.index;
    const listInfo = this.data.listInfo;
    const page = listInfo.banner_list[index].page;

    if( page ){//page页面存在
      router.jump_nav({
        url:`/${page}`,
      })
    }
    else{//page页面不存在
      return false;
    }
  },
  //直接跳过
  jumpGift(){
    const keyGroup = this.data.keyGroup;//锁

    keyGroup.giftKey = false;//见面礼锁关闭

    wx.setStorageSync('keyGroup', keyGroup)//存本地

    this.setData({
      giftIf:false,//是否授权(映射字段)
      keyGroup,//存页面
    })
  },
  //立即授权
  authBtn(e){
    const detail = e.detail;//btn授权信息
    const errMsg = detail.errMsg;//是否授权信息
    
    
    method.userInfoAuth(e)
      .then(()=>{//用户接受授权，获取用户信息

        const keyGroup = this.data.keyGroup;//锁
        const userInfo = wx.getStorageSync('userInfo');

        keyGroup.giftKey = false;//见面礼锁关闭

        wx.setStorageSync('keyGroup', keyGroup)//存本地

        
        this.setData({
          errMsg,//存页面
          giftIf:false,//是否授权(映射字段)
          keyGroup,//存页面
        })

        return request_01.personalInfo({
          user_id:userInfo.user_id,
          openid:userInfo.openid,
        })
      })
      .then((value)=>{
        const personalInfo = value.data.data;

        if( !(personalInfo.user_type == 1) ){
          //不是车主

          this.setData({
            bindcarIf:true,//绑定车主打开
          })
        }
      })
      .catch(()=>{
        //fail
        
      })
  },
  //暂不是车主
  unbind(){
    this.setData({
      bindcarIf:false,
    })
  },
  //立即绑定
  bind(){
    this.setData({
      bindcarIf:false,
    })
    
    router.jump_nav({
      url:'/pages/o_love_car/o_love_car?pageType=back'
    })
  },
  //nav导航区跳转
  // navJump(e){
  //   const id = e.currentTarget.dataset.id;

  //   switch(id){
  //     case 1:
  //       //体验、活动
  //       router.jump_nav({
  //         url:'/pages/activity_list/activity_list',
  //       })
  //       break;
  //     case 2:
  //       //咨询、社区
  //       router.jump_nav({
  //         url:'/pages/community/community',
  //       })
  //       break;
  //     case 3:
  //       //游戏列表
  //       router.jump_nav({
  //         url:'/pages/game_list/game_list',
  //       })
  //       break;
  //     case 4:
  //       //任务
  //       router.jump_nav({
  //         url:'/pages/task/task',
  //       })
  //       break;
  //   }
  // },
  navJump(e){
    const index = e.currentTarget.dataset.index;
    const listInfo = this.data.listInfo;
    const page = listInfo.icon_list[index].page;

    if( page ){//page页面存在
      router.jump_nav({
        url:`/${page}`,
      })
    }
    else{//page页面不存在
      return false;
    }
  },
  //活动区跳转
  activityJump(e){
    const index = e.currentTarget.dataset.index;
    const activityList = this.data.activityList;
    const activity_id = activityList[index].activity_id;
    const screen = activityList[index].screen;
    wx.setStorageSync('screen', screen);
    const activity_type = activityList[index].activity_type;
    
    switch( activity_type ){
      case 1:
        //1	抽奖
        router.jump_nav({
          url:`/pages/prize/prize?activity_id=${activity_id}`,
        })
      break;
      case 2:
        //2	投票
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
      //3	点亮
        router.jump_nav({
          url: `/pages/prize/prize?activity_id=${activity_id}`,
        })
      break;
      case 4:
      //4	集攒
        router.jump_nav({
          url: `/pages/vote/vote?activity_id=${activity_id}`,
        })
      break;
      case 5:
        //5	团购
        router.jump_nav({
          url:`/pages/assemble/pin/pin?activity_id=${activity_id}`,
        })
        
      break;
      case 7:
      //7	报名
        router.jump_nav({
          url: `/pages/sign_up/sign_up?activity_id=${activity_id}`,
        })
      break;
      case 11:
      //11	看车
        router.jump_nav({
          url: `/pages/vote/vote?activity_id=${activity_id}`,
        })
      break;
      case 12:
      //12	摇红包
      router.jump_nav({
        url: `/pages/vote/vote?activity_id=${activity_id}`,
      })
      break;
      case 13:
        //13	砍价
        router.jump_nav({
          url:`/pages/bargain_index/bargain_index?activity_id=${activity_id}`,
        })
      break;
    }
  },
  //签到
  sureBtn(){
    this.setData({
      signInIf:false,
    })
  },
})
