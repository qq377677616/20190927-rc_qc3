

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
    searchValue:'',
    dotIndex:0,
    mallInfo:{},
    goodsList:[],
    page:1,
    searchKey:true,
    moreKey:true,
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
    //第一次展示标识
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
    //刷新
    if( firstShow ){
      
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
  //页面初始化
  initData(options){
    const userInfo = wx.getStorageSync('userInfo');
    const page = this.data.page;

    Promise.all([
      request_01.shopMall({
        user_id:userInfo.user_id,
      }),
      request_01.goodsList({
        is_hot:1,
        cate_id:'',
        title:'',
        page,
      }),
    ])
      .then((value)=>{
        //success
        const mallInfo = value[0].data.data;
        const goodsList = value[1].data.data.list;
        let isMore, str;

        if( goodsList.length ){//有商品数据
          str = '- 我是有底线的 -';
          isMore = true;
        }
        else{//无商品数据
          str = '没有找到相关宝贝~';
          isMore = false;
        }

        this.setData({
          mallInfo,
          goodsList,
          isMore,
          str,
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
  //banner跳转
  bannerJump(e){
    const index = e.currentTarget.dataset.index;
    const mallInfo = this.data.mallInfo;
    const page = mallInfo.banner[index].page;
    
    if( page )router.jump_nav({//page存在则进行跳转
      url:`/${page}`,
    });
  },  
  //商品搜索字段输入
  searchInput(e){
    const searchValue = e.detail.value;

    this.setData({
      searchValue,
    })

    //输入为空时做请求搜索
    if( searchValue == '' )this.searchBtn();
  },
  //商品搜索
  searchBtn(){
    const searchValue = this.data.searchValue;
    const searchKey = this.data.searchKey;
    const moreKey = this.data.moreKey;

    //正在搜索中、更多加载中不允许操作
    if( !searchKey || !moreKey )return;

    this.setData({//关锁
      searchKey:false,
    })
    
    request_01.goodsList({
      is_hot:1,
      cate_id:'',
      title:searchValue,
      page:1,
    })
      .then((value)=>{
        //success
        const goodsList = value.data.data.list;
        let isMore, str;

        if( goodsList.length ){//搜索结果有数据
          str = '- 我是有底线的 -';
          isMore = true;//有更多
        }
        else{//搜索结果没数据
          str = '没有搜索结果，没有找到相关宝贝~';
          isMore = false;//无更多
        }

        this.setData({
          goodsList,
          isMore,
          str,
          page:1,//初始化page
          moreKey:true,
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
  //赚取更多
  goTask(){
    router.jump_nav({
      url:'/pages/task/task',
    })
  },
  //导航
  goPlate(e){
    const index = e.currentTarget.dataset.index;
    const mallInfo = this.data.mallInfo;
    const name = mallInfo.cate_list[index].name;
    const cate_id = mallInfo.cate_list[index].cate_id;
    let url;
    if( name == '更多' ){//点击导航区更多时，跳转到 商城分类
      url = `/mall_module/pages/shop_mall_type/shop_mall_type?cate_id=${ cate_id }&pageTitle=${ name }`;
    }
    else{//否则跳转到 商城板块
      url = `/mall_module/pages/shop_mall_plate/shop_mall_plate?cate_id=${ cate_id }&pageTitle=${ name }`;
    }

    router.jump_nav({
      url,
    })
  },
  //商品详情
  goodsDetail(e){
    const id = e.currentTarget.dataset.id;
    router.jump_nav({
      url:`/mall_module/pages/product_detail/product_detail?goods_id=${id}`,
    })
  },
  //查看更多
  lookMore(){
    const page = this.data.page;
    const searchKey = this.data.searchKey;
    const moreKey = this.data.moreKey;

    //搜索中、加载更多不允许操作
    if( !searchKey || !moreKey )return;

    this.setData({
      str:'加载中...',
      isMore:false,
      moreKey:false,
    })
    request_01.goodsList({
      is_hot:1,
      cate_id:'',
      title:'',
      page:page + 1,
    })
      .then((value)=>{
        const newGoodsList = value.data.data.list;
        const goodsList = this.data.goodsList;
        let isMore;
        if( newGoodsList.length ){//有更多商品
          isMore = true;
        }
        else{//无更多商品
          isMore = false;
        }

        this.setData({
          goodsList:[...goodsList, ...newGoodsList],
          isMore,
          str:'- 我是有底线的 -',
          page:page + 1,//初始化page
        })
      })
      .catch((reason)=>{
        alert.alert({
          str:'电波无法到达~'
        })

        this.setData({
          str:'- 我是有底线的 -',
          isMore:true,
        })

      })
      .then(()=>{
        //complete
        this.setData({
          moreKey:true,
        })
      })
  },
  //购物车
  shopCart(){
    router.jump_nav({
      url:'/mall_module/pages/shop_cart/shop_cart',
    })
  },
})