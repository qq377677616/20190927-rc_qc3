
const request_01 = require('../../../utils/request/request_01.js');

const router = require('../../../utils/tool/router.js');

const alert = require('../../../utils/tool/alert.js');

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
    goodsList:[],
    cate_id:'',
    bannerList:[],
    dotIndex:0,
    page:1,
    searchKey:true,
    scrollKey:true,
    scrollPrivateKey:true,
    isMore:false,
    str:'',
    searchValue:'',
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
    const scrollKey = this.data.scrollKey;
    const searchKey = this.data.searchKey;
    const scrollPrivateKey = this.data.scrollPrivateKey;
    const page = this.data.page;
    const cate_id = this.data.cate_id;

    //滚动加载中、搜索中不允许操作
    if( !scrollKey || !searchKey || !scrollPrivateKey )return;

    this.setData({
      scrollKey:false,
      str:'加载中...',
      isMore:true,
    })
    request_01.goodsList({
      is_hot:'',
      cate_id,
      title:'',
      page:page + 1,
    })
      .then((value)=>{
        //success
        const newGoodsList = value.data.data.list;
        const goodsList = this.data.goodsList;
        let isMore, scrollPrivateKey;
        if( newGoodsList.length ){//有更多商品
          scrollPrivateKey = true,
          isMore = false;
        }
        else{//无更多商品
          scrollPrivateKey = false,
          isMore = true;
        }

        this.setData({
          goodsList:[...goodsList, ...newGoodsList],
          isMore,
          str:'- 我是有底线的 -',
          page:page + 1,//初始化page 
          scrollPrivateKey,
        })
      })
      .catch((reason)=>{
        //fail
        alert.alert({
          str:'电波无法到达~'
        })

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
  //banner轮播切换事件
  dotchange(e){
    this.setData({
      dotIndex: e.detail.current
    })
  },
  //页面初始化
  initData(options){
    const page = this.data.page;

    Promise.all([
      request_01.goodsList({
        is_hot:'',
        cate_id:options.cate_id,
        title:'',
        page,
      })
    ])
      .then((value)=>{
        //success
        const goodsList = value[0].data.data.list;
        const bannerList = value[0].data.data.bannerList;

        let str, isMore;

        if( goodsList.length ){
          str = '- 我是有底线的 -';
          isMore = false;
        }else{
          str = '没有找到相关宝贝~';
          isMore = true;
        }

        this.setData({
          goodsList,
          bannerList,
          str,
          isMore,
          cate_id:options.cate_id,
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
  //banner跳转
  bannerJump(e){
    const index = e.currentTarget.dataset.index;
    const bannerList = this.data.bannerList;
    const page = bannerList[index].page;

    if( page )router.jump_nav({//page存在则进行跳转
      url:`/${page}`,
    });
  },  
  //购物车
  shopCart(){
    router.jump_nav({
      url:'/pages/shop_cart/shop_cart',
    })
  },
  //商品搜索
  searchInput(e){
    const searchValue = e.detail.value;
    this.setData({
      searchValue,
    })
  },
  //商品搜索
  searchBtn(){
    const searchValue = this.data.searchValue;
    const searchKey = this.data.searchKey;
    const scrollKey = this.data.scrollKey;
    const cate_id = this.data.cate_id;

    //搜索中、滚动加载中不允许操作
    if( !searchKey || !scrollKey )return;

    this.setData({//关锁
      searchKey:false,
    })
    
    request_01.goodsList({
      is_hot:'',
      cate_id,
      title:searchValue,
      page:1,
    })
      .then((value)=>{
        //success
        const goodsList = value.data.data.list;
        let isMore, str;

        if( goodsList.length ){//搜索结果有数据
          str = '- 我是有底线的 -';
          isMore = false;//有更多
        }
        else{//搜索结果没数据
          str = '没有搜索结果，没有找到相关宝贝~';
          isMore = true;//无更多
        }

        this.setData({
          goodsList,
          isMore,
          str,
          page:1,//初始化page 
          scrollKey:true,
          scrollPrivateKey:true,
        })

      })
      .catch((reason)=>{
        //fail
        alert.alert({
          str:'电波无法到达~'
        })

      })
      .then(()=>{
        //complete
        this.setData({
          searchKey:true,
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