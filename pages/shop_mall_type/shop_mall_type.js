// pages/shop_mall_type/shop_mall_type.js

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
    classList:[],
    goodsList:[],
    isMore:false,
    str:'',
    page:1,
    scrollKey:true,
    scrollPrivateKey:true,
    listKey:true,
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

  },
  //页面初始化
  initData(options){
    Promise.all([
      request_01.classList(),
    ])
      .then((value)=>{
        //success
        const classList = value[0].data.data;
        const page = this.data.page;
        let classListId;

        if( classList.length ){//默认显示第一项
          classListId = classList[0].cate_id;
        }else{
          classListId = '';
        }
        
        this.setData({
          classList,
          classListId,
        })

        return request_01.goodsList({
          is_hot:'',
          cate_id:classListId,
          title:'',
          page,
        })
      })
      .then((value)=>{
        const goodsList = value.data.data.list;
        let isMore;

        if( goodsList.length ){//有数据返回
          isMore = false;
        }else{//无数据返回
          isMore = true;
        }

        this.setData({
          goodsList,
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
        this.setData({
          options,
        })

        //页面标题
        wx.setNavigationBarTitle({
          title: options.pageTitle,
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
  //分类列表切换
  classListSwitch(e){
    const id = e.currentTarget.dataset.id;
    const scrollKey = this.data.scrollKey;
    const listKey = this.data.listKey;

    //滚动加载中、列表加载中不允许操作
    if( !scrollKey || !listKey )return;

    this.setData({
      listKey:false,
    })
    request_01.goodsList({
      is_hot:'',
      cate_id:id,
      title:'',
      page:1,
    })
      .then((value)=>{
        //success
        const goodsList = value.data.data.list;
        let isMore;

        if( goodsList.length ){//有数据返回
          isMore = false;
        }else{//无数据返回
          isMore = true;
        }

        this.setData({
          goodsList,
          str:'- 我是有底线的 -',
          isMore,
          classListId:id,
          page:1,
          scrollKey:true,
          scrollPrivateKey:true,
        })
      })
      .catch((reason)=>{
        //fail
        
      })
      .then(()=>{
        //camplete
        this.setData({
          listKey:true,
        })
      })
    
  },
  //滚动到底加载
  scrollBottom(){
    const scrollKey = this.data.scrollKey;
    const listKey = this.data.listKey;
    const scrollPrivateKey = this.data.scrollPrivateKey;
    const page = this.data.page;
    const classListId = this.data.classListId;

    //滚动加载中、列表加载中不允许操作
    if( !scrollKey || !listKey || !scrollPrivateKey )return;

    this.setData({
      scrollKey:false,
      str:'加载中...',
      isMore:true,
    })

    request_01.goodsList({
      is_hot:'',
      cate_id:classListId,
      title:'',
      page:page + 1,
    })
      .then((value)=>{
        //success 
        const newGoodsList = value.data.data.list;
        const goodsList = this.data.goodsList;
        let isMore, scrollPrivateKey;

        if( newGoodsList.length ){//有数据返回
          scrollPrivateKey = true,
          isMore = false;
        }else{//无数据返回
          scrollPrivateKey = false,
          isMore = true;
        }

        this.setData({
          goodsList:[...goodsList, ...newGoodsList],
          str:'- 我是有底线的 -',
          isMore,
          page:page + 1,
          scrollPrivateKey,
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
  //商品详情
  goodsDetail(e){
    const id = e.currentTarget.dataset.id;
    router.jump_nav({
      url:`/pages/product_detail/product_detail?goods_id=${id}`,
    })
  },
})