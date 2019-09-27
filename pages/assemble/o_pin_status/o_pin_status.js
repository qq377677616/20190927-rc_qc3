// pages/assemble/o_pin_status/o_pin_status.js
const request_01 = require('../../../utils/request/request_01.js');

const util = require('../../../utils/public/util.js');

const method = require('../../../utils/tool/method.js');

const router = require('../../../utils/tool/router.js');

const authorization = require('../../../utils/tool/authorization.js');

const alert = require('../../../utils/tool/alert.js');

const app = getApp(); //获取应用实例
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page404:false,
    options:{},
    firstShow:false,
    str:'',
    isMore:false,
    status:'',
    editKey:true,
    page:1,
    groupList:[],
    timmerGroup:[],
    scrollKey:true,//上拉锁
    scrollPrivateKey:true,
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
    this.setData({
      firstShow:true,
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    const firstShow = this.data.firstShow;
    const options = this.data.options;

    if( firstShow ){
      this.setData({
        page:1,
        scrollKey:true,//上拉锁
        scrollPrivateKey:true,
      })

      this.onLoad(options)
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
    const status = this.data.status;
    const userInfo = wx.getStorageSync('userInfo');
    const options = this.data.options;
    const page = this.data.page;
    const editKey = this.data.editKey;
    const scrollKey = this.data.scrollKey;
    const scrollPrivateKey = this.data.scrollPrivateKey;


    //编辑中、滚动加载中不允许操作
    if( !editKey || !scrollKey || !scrollPrivateKey )return;

    

    this.setData({
      scrollKey:false,
      str:'加载中...',
      isMore:true,
    })

    request_01.groupList({
      user_id:userInfo.user_id,//用户ID
      activity_id:options.activity_id,//活动ID
      status,//null-全部 0-拼团中 1-拼团成功 2-拼团失败
      page:page+1,//分页页码 默认1
    })
      .then((value)=>{
        //success
        const newGroupList = value.data.data;
        const groupList = this.data.groupList;
        let timmerGroup = this.data.timmerGroup;
        let scrollPrivateKey, isMore;



        if( newGroupList.length ){//有数据返回
          scrollPrivateKey = true;
          isMore = false;
        }
        else{//无数据返回
          scrollPrivateKey = false;
          isMore = true;
        }
        
        //清除定时器
        this.clearInterval(timmerGroup)

        this.setData({
          groupList:[...groupList, ...newGroupList],
          str:'- 我是有底线的 -',
          isMore,
          scrollPrivateKey,
          page:page+1,
        })

        timmerGroup = this.data.groupList.map((item)=>{
          return { 
            status:item.status,
            count_down:item.count_down,
          };
        })
        //倒计时
        this.countDown(timmerGroup)

        this.setData({
          timmerGroup,
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
          scrollKey:true,
        })
      })

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (e) {
    const index = e.target.dataset.index;
    const groupList = this.data.groupList;
    const groupbuy_id = groupList[index].groupbuy_id;
    const userInfo = wx.getStorageSync('userInfo');
    
    return {
        path:`/pages/assemble/o_pin/o_pin?groupbuy_id=${groupbuy_id}&user_id=${userInfo.user_id}`,
    };
  },
  //页面初始化
  initData(options){
    const userInfo = wx.getStorageSync('userInfo');
    const status = this.data.status;
    const page = this.data.page;

    alert.loading({
      str:'加载中'
    })
    Promise.all([
      request_01.groupList({
        user_id:userInfo.user_id,//用户ID
        activity_id:options.activity_id,//活动ID
        status,//null-全部 0-拼团中 1-拼团成功 2-拼团失败
        page,//分页页码 默认1
      })
    ])
      .then((value)=>{
        //success
        const groupList = value[0].data.data;
        let timmerGroup = this.data.timmerGroup;
        let isMore;

        //清除定时器
        this.clearInterval(timmerGroup)

        timmerGroup = groupList.map((item)=>{
          return { 
            status:item.status,
            count_down:item.count_down,
          };
        })
        //倒计时
        this.countDown(timmerGroup)

        if( groupList.length ){//有数据返回
          isMore = false;
        }
        else{//无数据返回
          isMore = true;
        }

        this.setData({
          groupList,
          timmerGroup,
          str:'- 我是有底线的 -',
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
      .then(()=>{
        //complete

        alert.loading_h()
        this.setData({
          activity_id:options.activity_id,
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
  //倒计时
  countDown(timmerGroup){
    //倒计时
    timmerGroup.forEach((item, index, arr)=>{

      if( !(item.status == 0) )return '拼团中才显示倒计时';

      item.timmer = setInterval(()=>{

        if( item.count_down <= 0 ){
          item.count_down = 0;
          clearInterval( item.timmer )
        }else{
          item.count_down = item.count_down - 1;
        }

        item.dhms = util.minutesAndSeconds(item.count_down, ':');

        this.setData({
          timmerGroup,
        })
      }, 1000)
      
      item.dhms = util.minutesAndSeconds(item.count_down, ':');
      
    })
  },
  //清除定时器
  clearInterval(timmerGroup){
    timmerGroup.forEach((item)=>{
      clearInterval( item.timmer )
    })
  },
  //领取奖品
  getOrderId(e){
    const index = e.currentTarget.dataset.index;
    const groupList = this.data.groupList;
    const groupbuy_id	= groupList[index].groupbuy_id;
    const userInfo = wx.getStorageSync('userInfo');
    const order_id = groupList[index].order_id;
    if( order_id ){
      //有order_id
      router.jump_nav({
        url:`/pages/order_detail/order_detail?order_id=${order_id}`,
      })
    }
    else{
      //无order_id
      request_01.getOrderId({
        user_id:userInfo.user_id,
        groupbuy_id,
      })
        .then((value)=>{
          //success
          const msg = value.data.msg;
          const status = value.data.status;
          const data = value.data.data;

          if( status == 1 ){//获取order_id
            router.jump_nav({
                url:`/pages/order_detail/order_detail?order_id=${data.order_id}`,
            })
          }
          else{//获取失败
            alert.alert({
              str:msg,
            })
          }
        })
        .catch((reason)=>{
          //fail
          alert.alert({
            str:JSON.stringify(reason)
          })
        })
    }
  },
  //导航列表切换
  navList(e){
    const index = e.currentTarget.dataset.index;
    const status = this.data.status;
    const userInfo = wx.getStorageSync('userInfo');
    const options = this.data.options;
    const editKey = this.data.editKey;
    const scrollKey = this.data.scrollKey;

    //点击当前、编辑中、滚动加载中不允许操作
    if( status == index || !editKey || !scrollKey )return;

    this.setData({
      editKey:false,
    })
    
    request_01.groupList({
      user_id:userInfo.user_id,//用户ID
      activity_id:options.activity_id,//活动ID
      status:index,//null-全部 0-拼团中 1-拼团成功 2-拼团失败
      page:1,//分页页码 默认1
    })
      .then((value)=>{
        //success
        const groupList = value.data.data;
        let timmerGroup = this.data.timmerGroup;
        let isMore;

        //清除定时器
        this.clearInterval(timmerGroup)

        timmerGroup = groupList.map((item)=>{
          return { 
            status:item.status,
            count_down:item.count_down,
          };
        })

        //倒计时
        this.countDown(timmerGroup)

        if( groupList.length ){//有数据返回
          isMore = false;
        }
        else{//无数据返回
          isMore = true;
        }

        this.setData({
          groupList,
          timmerGroup,
          status:index,
          page:1,
          str:'- 我是有底线的 -',
          isMore,
          scrollKey:true,//上拉锁
          scrollPrivateKey:true,
        })
      })
      .catch((reason)=>{
        //fail
        
      })
      .then(()=>{
        //complete
        this.setData({
          editKey:true,
        })
      })
    
  },
})