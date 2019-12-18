// pages/product_detail/product_detail.js
const request_01 = require('../../utils/request/request_01.js');

const router = require('../../utils/tool/router.js');

const alert = require('../../utils/tool/alert.js');

const WxParse = require('../../utils/wxParse/wxParse.js');

const app = getApp();//获取应用实例
Page({

  /**
   * 页面的初始数据
   */
  data: {
    IMGSERVICE: app.globalData.IMGSERVICE,
    pageKey:false,
    page404:false,
    options:{},
    firstShow:false,
    bindCarIf:false,
    dotIndex:0,
    goodsDetail:{},
    specHidden:true,
    attr:{
      __number:1,
      __type:'立即兑换',
    },
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

    if(firstShow){
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

  },
  //组织冒泡
  stopPropagation(){
    return;
  },
  //页面初始化
  initData(options){
    const userInfo = wx.getStorageSync('userInfo');

    //初始化
    this.setData({
      dotIndex:0,
      goodsDetail:{},
    })
    
    Promise.all([
      request_01.goodsDetail({
        goods_id:options.goods_id,
        user_id:userInfo.user_id,
      })
    ])  
      .then((value)=>{
        //success
        const goodsDetail = value[0].data.data;
        const attr = this.data.attr;

        Object.assign(attr, {
          __goods_id:options.goods_id,
        })

        WxParse.wxParse('product_explain', 'html', goodsDetail.intro, this); 

        this.setData({
          goodsDetail,
          attr,
          pageKey:true,
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
            title: '商品详情'
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
  //我的购物车
  shopCart(){
    router.jump_nav({
      url:'/pages/shop_cart/shop_cart',
    })
  },
  //弹出选择规格
  chooseSpec(e){
    const goodsDetail = this.data.goodsDetail;
    const __type = e.currentTarget.dataset.type;
    let attr = this.data.attr;
    let __index, __indexArr;
    const pageKey = this.data.pageKey;

    if( !pageKey )return;

    //车主专享、用户不是车主
    if( goodsDetail.car_owner == 1 && goodsDetail.user_type == 0 ){
      this.setData({
        bindCarIf:true,
      })
      return;
    }

    for(let prop in goodsDetail.attr_info){//默认选择规格第一项
      
      __index = prop;
      break;
    }

    if( goodsDetail.goods_attr.length ){//该商品有规格，根据默认项属性名切割获取每组属性索引值

      __indexArr = __index.split('_');

    }

    Object.assign(attr, {
      __index,
      __indexArr,
      __type,
    })

    this.setData({
      specHidden:false,
      attr,
    })

  },
  //关闭选择规格 弹窗
  closeBtn(){
    const attr = this.data.attr;
    attr.__number = 1;
    this.setData({
      attr,
      specHidden:true,
    })
  },
  //属性切换
  chooseAttr(e){
    const goodsDetail = this.data.goodsDetail;
    const pindex = e.currentTarget.dataset.pindex;
    const sindex = e.currentTarget.dataset.sindex;
    let attr = this.data.attr;
    
    let currentId = attr.__indexArr[pindex];
    let newId = goodsDetail.goods_attr[pindex].list[sindex].id;

    if( currentId == newId ){//取消选择，属性索引值做改变
      attr.__indexArr[pindex] = 0;
    }else{//选择属性，属性索引值做改变
      attr.__indexArr[pindex] = newId;
    }

    attr.__index = attr.__indexArr.join('_');//规格索引做改变

    this.setData({
      attr,
    })

  },
  //商品个数选择
  addAndDelete(e){
    const type = e.currentTarget.dataset.type;
    const attr = this.data.attr;


    if( type == 'add' ){//增
      attr.__number = attr.__number + 1;
    }
    else{//减
      attr.__number = attr.__number <= 1 ? 1 : attr.__number - 1;
    }
    
    this.setData({
      attr,
    })
  },
  //暂不是车主
  unbind(){
    this.setData({
      bindCarIf:false,
    })
  },
  //立即绑定
  bind(){
    this.setData({
      bindCarIf:false,
    })
    
    router.jump_nav({
      url:'/pages/o_love_car/o_love_car?pageType=back'
    })
  },
  //商品已下架确定按钮
  shelveBtn(){
    router.jump_back()
  },
  //提交
  submitBtn(){
    const goodsDetail = this.data.goodsDetail;
    const userInfo = wx.getStorageSync('userInfo');
    let attr = this.data.attr;

    //无规格的商品  或  有规格的商品，并且选了属性 则可以提交
    if( goodsDetail.goods_attr.length && attr.__indexArr.some((item)=>{return item == 0;}) ){
      return alert.alert({
        str:'请选择规格',
      })
    }

    //有属性 无属性 选择数量不能大于库存
    // if( 
    //   ( (goodsDetail.goods_attr.length) && (attr.__number > goodsDetail.attr_info[attr.__index].number) ) 
    //   || ( !goodsDetail.goods_attr.length && (attr.__number > goodsDetail.number) )
    // ){
    //   return alert.alert({
    //     str:'选择的商品数不能大于库存'
    //   })
    // }

    if( 
      ( (goodsDetail.goods_attr.length) && (0 == goodsDetail.attr_info[attr.__index].number) ) 
      || ( !goodsDetail.goods_attr.length && (0 == goodsDetail.number) )
    ){
      return alert.alert({
        str:'库存不足'
      })
    }
    

    // //(有属性 无属性) 已购数量 加 选择数量 不能大于限购数量
    // if( 
    //   ( (goodsDetail.max_buy > 0) && ( (attr.__number + goodsDetail.buy_num) > goodsDetail.max_buy ) )
    // ){
    //   return alert.alert({
    //     str:'您购买商品数已大于限购数'
    //   })
    // }

    
    
    if( attr.__type == 'cart' ){//添加购物车

      alert.loading({
        str:'添加中'
      })

      request_01.addShopCart({
        user_id:userInfo.user_id,//用户ID
        goods_id:attr.__goods_id,//产品ID
        number:attr.__number,//数量
        goods_attr_id:goodsDetail.goods_attr.length ? goodsDetail.attr_info[attr.__index].goods_attr_id : '',//规格ID
      })
        .then((value)=>{
          //success
          const msg = value.data.msg;
          alert.loading_h()
          alert.alert({
            str:msg
          })

          //关闭规格选框
          this.closeBtn()

        })
        .catch((reason)=>{
          //fail
          
          alert.loading_h()
          //关闭规格选框
          this.closeBtn()
        })


    }
    else{//立即购买

      Object.assign(goodsDetail, attr)
      app.globalData.goodsDetail = goodsDetail;//将该商品信息存于全局

      //关闭规格选框
      this.closeBtn()
      
      router.jump_nav({
        url:'/pages/shop_cart_next/shop_cart_next?type=pay'
      })
    }

    
  },
})