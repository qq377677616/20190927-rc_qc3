
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
    type:2,// 1-到店 2-快递 3-在线
    shopCartList:[],
    is_empty:1,
    vcoin:0,
    type_tips:{},
    page:1,
    scrollKey:true,
    scrollPrivateKey:true,
    isMore:false,
    str:'',
    editKey:true,
    selectAll:true,
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
    const userInfo = wx.getStorageSync('userInfo');
    const type = this.data.type;
    const page = this.data.page;

    Promise.all([
      request_01.shopCartList({
        user_id:userInfo.user_id,
        type,// 1-到店 2-快递 3-在线
        page,
      })
    ])
      .then((value)=>{
        //success
        const shopCartList = value[0].data.data.list;//购物车列表
        const is_empty = value[0].data.data.is_empty;//购物车是否为空
        const vcoin = value[0].data.data.vcoin;//我的V豆
        const type_tips = value[0].data.data.type_tips;//徽章
        let isMore;

        if( shopCartList.length ){//有商品数据
          isMore = false;
        }
        else{//无商品数据
          isMore = true;
        }

        this.setData({
          shopCartList,//购物车列表
          is_empty,//购物车是否为空
          vcoin,//我的V豆
          str:'- 我是有底线的 -',
          isMore,
          type_tips,//徽章
        })
      })
      .catch((reason)=>{
        //fail

      })
      .then(()=>{
        //complete
        this.setData({
          options,
        })
      })
  },
  //购物车列表导航
  listNav(e){
    const index = e.currentTarget.dataset.index;
    const userInfo = wx.getStorageSync('userInfo');
    const type = this.data.type;
    const editKey = this.data.editKey;
    const scrollKey = this.data.scrollKey;

    //点击当前、列表加载、滚动加载不允许操作
    if( index == type || !editKey || !scrollKey )return;

    this.setData({
      editKey:false,//编辑锁
    })

    request_01.shopCartList({
      user_id:userInfo.user_id,
      type:index,// 1-到店 2-快递 3-在线
      page:1,
    })
      .then((value)=>{
        //success
        const shopCartList = value.data.data.list;
        let isMore;

        if( shopCartList.length ){//有商品数据
          isMore = false;
        }
        else{//无商品数据
          isMore = true;
        }
        
        this.setData({
          shopCartList,
          str:'- 我是有底线的 -',
          isMore,
          page:1,
          type:index,
          selectAll:true,
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
          editKey:true,//编辑锁
        })
      })

  },
  //滚动到底加载
  scrollBottom(){
    
    const page = this.data.page;
    const type = this.data.type;
    const userInfo = wx.getStorageSync('userInfo');
    const editKey = this.data.editKey;
    const scrollKey = this.data.scrollKey;
    const scrollPrivateKey = this.data.scrollPrivateKey;

    //列表加载、滚动加载不允许操作
    if( !scrollKey || !editKey || !scrollPrivateKey )return;

    this.setData({
      scrollKey:false,
      str:'加载中...',
      isMore:true,
    })

    request_01.shopCartList({
      user_id:userInfo.user_id,
      type,// 1-到店 2-快递 3-在线
      page:page+1,
    })
      .then((value)=>{
        //success
        const newShopCartList = value.data.data.list;
        const shopCartList = this.data.shopCartList;
        let scrollPrivateKey, isMore;
        
        if( newShopCartList.length ){//有数据返回
          scrollPrivateKey = true;
          isMore = false;
        }
        else{//无数据返回
          scrollPrivateKey = false;
          isMore = true;
        }

        this.setData({
          str:'- 我是有底线的 -',
          isMore,
          scrollPrivateKey,
          shopCartList:[...shopCartList, ...newShopCartList],
          page:page+1,
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
  //商品选择切换
  checked(e){ 
    const index = e.currentTarget.dataset.index;
    const shopCartList = this.data.shopCartList;
    const editKey = this.data.editKey;
    const scrollKey = this.data.scrollKey;

    //列表加载、滚动加载不允许操作
    if( !scrollKey || !editKey )return;


    shopCartList[index].exclude = !shopCartList[index].exclude;

    this.setData({
      shopCartList,
    })
  },
  //删除商品
  deleteBtn(e){
    const id = e.currentTarget.dataset.id;
    const userInfo = wx.getStorageSync('userInfo');
    const editKey = this.data.editKey;
    const scrollKey = this.data.scrollKey;

    //列表加载、滚动加载不允许操作
    if( !scrollKey || !editKey )return;


    this.setData({
      editKey:false,//编辑锁
    })
    
    request_01.deleteShopCart({
      user_id:userInfo.user_id,
      shopping_cart_id:id,
    })
      .then((value)=>{
        const msg = value.data.msg;
        const status = value.data.status;

        if( status == 1 ){//删除成功

          this.setData({
            page:1,
            selectAll:true,//全选
            scrollKey:true,//滚动锁
            scrollPrivateKey:true,
          })
  
          this.initData();

        }
        else{//删除失败

          alert.alert({
            str:msg
          })
          
        }
      })
      .catch((reason)=>{
        //fail

      })
      .then(()=>{
        //complete
        this.setData({
          editKey:true,//编辑锁
        })
      })
  },
  //增减编辑
  addAndDelete(e){
    const type = e.currentTarget.dataset.type;
    const index = e.currentTarget.dataset.index;
    const userInfo = wx.getStorageSync('userInfo');
    const shopCartList = this.data.shopCartList;
    const shopping_cart_id = shopCartList[index].shopping_cart_id;
    const editKey = this.data.editKey;
    const scrollKey = this.data.scrollKey;

    if( type == 'dec' && shopCartList[index].number <= 1 )return '商品数量已为1';

    //列表加载、滚动加载不允许操作
    if( !scrollKey || !editKey )return;

    this.setData({
      editKey:false,
    })

    request_01.editShopCart({
      user_id:userInfo.user_id,
      shopping_cart_id,
      action:type,
    })
      .then((value)=>{
        //success
        const msg = value.data.msg;
        const status = value.data.status;

        if( status == 1 ){//编辑成功

            if( type == 'add' ){//增
              shopCartList[index].number++;
            }
            else{//减
              shopCartList[index].number--;
            }
    
            this.setData({
              shopCartList,
            })

        }
        else{//编辑失败

            alert.alert({
              str:msg
            })

        }

      })
      .catch((reason)=>{
        //fail

      })
      .then(()=>{
        //complete
        this.setData({
          editKey:true,//编辑锁
        })
      })
  },
  //全选
  selectAll(){
    const shopCartList = this.data.shopCartList;
    let selectAll = this.data.selectAll;
    const editKey = this.data.editKey;
    const scrollKey = this.data.scrollKey;
    let exclude;

    //列表加载、滚动加载不允许操作
    if( !scrollKey || !editKey )return;

    if( selectAll ){//取消全选
      exclude = true;
    }
    else{//全选
      exclude = false;
    }

    shopCartList.forEach((item)=>{
      item.exclude = exclude;
    })
    this.setData({
      selectAll:!selectAll,
      shopCartList,
    })


  },
  //去逛逛
  goGo(){
    router.jump_nav({
      url:'/mall_module/pages/shop_mall/shop_mall'
    })
  },
  //结算
  settlement(){
    let shopCartList = this.data.shopCartList;//购物车列表
    const cartDetail = app.globalData.cartDetail;//购物车信息
    const type = this.data.type;//购物车类型
    const editKey = this.data.editKey;
    const scrollKey = this.data.scrollKey;

    //列表加载、滚动加载不允许操作
    if( !scrollKey || !editKey )return;

    shopCartList = shopCartList.filter((item)=>{
      return !item.exclude;
    })

    //未选择购物车中商品
    if( !shopCartList.length )return alert.alert({
      str:'请选择商品'
    });

    app.globalData.cartDetail = Object.assign(cartDetail, {
      shopCartList,
      type,
    });//将该购物车列表、购物车类型（快递、卡卷）存于全局

    router.jump_red({
      url:'/mall_module/pages/shop_cart_next/shop_cart_next?type=cart'
    })
  },
})