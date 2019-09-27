// pages/shop_cart_submitted/shop_cart_submitted.js
const request_01 = require('../../utils/request/request_01.js');

const router = require('../../utils/tool/router.js');

const alert = require('../../utils/tool/alert.js');

const method = require('../../utils/tool/method.js');

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
    type:'',
    goodsList:[],
    moreKey:true,
    morePrivateKey:true,
    page:1,
    isMore:true,
    str:'',
    order_id:'',
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
    const page = this.data.page;

    Promise.all([
      request_01.goodsList({
        is_hot:'',//首页推荐 1-是 不传-否
        cate_id:'',//分类ID
        title:'',//按商品名搜索
        page,//分页页码 默认1
      })
    ])
      .then((value)=>{
        //success
        const goodsList = value[0].data.data.list;
        let isMore;

        if( goodsList.length ){//有商品数据返回
          isMore = true;
        }
        else{//无商品数据返回
          isMore = false;
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
          type:options.type,
          order_id:options.order_id,
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
  //查看订单
  lookOrder(){
    const order_id = this.data.order_id;
    router.jump_nav({
      url:`/pages/order_detail/order_detail?order_id=${order_id}`,
    })
  },
  //返回商城
  shopMall(){
    router.jump_rel({
      url:'/pages/shop_mall/shop_mall'
    })
  },
  //商品详情
  goodsDetail(e){
    const id = e.currentTarget.dataset.id;
    router.jump_red({
      url:`/pages/product_detail/product_detail?goods_id=${id}`,
    })
  },
  //查看更多
  lookMore(){
    const moreKey = this.data.moreKey;
    const morePrivateKey = this.data.morePrivateKey;
    const page = this.data.page;

    //加载更多时不允许操作
    if( !moreKey || !morePrivateKey )return;

    this.setData({
      moreKey:false,
      str:'加载中...',
      isMore:false,
    })
    request_01.goodsList({
      is_hot:'',
      cate_id:'',
      title:'',
      page:page + 1,
    })
      .then((value)=>{
        const newGoodsList = value.data.data.list;
        const goodsList = this.data.goodsList;
        let isMore, morePrivateKey;
        if( newGoodsList.length ){//有更多商品
          isMore = true;
          morePrivateKey = true;
        }
        else{//无更多商品
          isMore = false;
          morePrivateKey = false;
        }

        this.setData({
          goodsList:[...goodsList, ...newGoodsList],
          isMore,
          str:'- 我是有底线的 -',
          morePrivateKey,
          page:page + 1,
        })
      })
      .catch((reason)=>{
        //fail
        alert.alert({
          str:'电波无法到达~'
        })

        this.setData({//初始化page 并且 关锁
          str:'- 我是有底线的 -',
          isMore:false,
        })
      })
      .then(()=>{

        //complete
        this.setData({
          moreKey:true,
        })
      })
  },
})