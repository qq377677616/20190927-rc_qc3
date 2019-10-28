// pages/assemble/pin_capital/pin_capital.js
const request_01 = require('../../../utils/request/request_01.js');

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
    IMGSERVICE:app.globalData.IMGSERVICE,
    currentAddressItem:{},
    storeList:[],
    pickerStoreList:[],
    storeIndex:0,
    positionKey:true,
    pinDetail:{},
    pageType:'',
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
    const currentAddressItem = app.globalData.currentAddressItem;//收货人信息
    const pinDetail = this.data.pinDetail;//拼团商品信息

    this.setData({
      currentAddressItem,
    })

    //收货人信息必须填写
    if( !currentAddressItem.area )return;

    //拼团商品 为快递时，不用获取门店
    if( pinDetail.type == 2 )return;
    
    this.getLocation()
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
    let pinDetail = app.globalData.pinDetail;//获取全局商品信息
    const userInfo = wx.getStorageSync('userInfo');

    this.setData({
      pinDetail,
      pageType:options.pageType,
    })

    app.globalData.pinDetail = {};//清空全局商品信息

    Promise.all([
      request_01.defaultAddress({
        user_id:userInfo.user_id
      })
    ])
      .then((value)=>{
        //success
        const data = value[0].data.data;
        const toString = {}.toString;
        if( toString.call(data) == '[object Array]' ){
          //为空数组 就是没有默认地址

        }
        else{
          //否则有默认地址
          app.globalData.currentAddressItem = Object.assign(data, {
            real_address:data.area.replace(/\s+/g,"") + data.address
          })

          this.onShow()
        }

      })
      .catch((reason)=>{
        //fail
        
      })
      .then(()=>{
        //complete

      })
  },
  //数量增减
  addAndDelete(e){
    const type = e.currentTarget.dataset.type;
    const pinDetail = this.data.pinDetail;

    if( type == 'dec' ){//减
      if( pinDetail.__number <= 1 )return;
      pinDetail.__number = pinDetail.__number - 1;
    }
    else{//加
      return;
      pinDetail.__number = pinDetail.__number + 1;
    }

    this.setData({
      pinDetail,
    })
  },
  //定位
  getLocation(){
    const currentAddressItem = this.data.currentAddressItem;

    alert.loading({
      str:'获取门店中'
    })

    this.setData({//定位中关锁
      positionKey:false,
    })
    method.getPosition()
      .then((value)=>{
        //success
        const location = value.result;

        return request_01.storeList({
          city:currentAddressItem.area.split(' ')[1],
          lon:location.location.lng,
          lat:location.location.lat,
          is_groupbuy: 1,
        })

      })
      .catch((reason)=>{
        //fail
        return request_01.storeList({
          city:currentAddressItem.area.split(' ')[1],
          lon:'',
          lat:'',
          is_groupbuy: 1,
        })
        
      })
      .then((value)=>{
        const storeList = value.data.data;
        const msg = value.data.msg;
        const status = value.data.status;
        let pickerStoreList;
        alert.loading_h()

        if( status == 1 ){//有门店数据返回
          pickerStoreList = storeList.map((item)=>{
            return item.name;
          })

          this.setData({
            storeList,
            pickerStoreList,
            storeIndex:0,
          })
        }
        else{//门店数据返回出错

          this.setData({
            storeList:[],
            pickerStoreList:[],
            storeIndex:0,
          })
          
          alert.alert({
            str:'门店：' + msg,
          })

        }

      })
      .catch((reason)=>{
        //fail

        this.setData({
          storeList:[],
          pickerStoreList:[],
          storeIndex:0,
        })

        alert.loading_h()
        alert.alert({
          str:'门店：' + JSON.stringify(reason)
        })
      })
      .then(()=>{
        //complete

        this.setData({//定位完开锁
          positionKey:true,
        })
      })
  },
  //获取收货人信息
  getInfo(){
    const positionKey = this.data.positionKey;

    if( !positionKey )return;//定位中不能操作

    router.jump_nav({//跳转到我的地址页 选择地址
      url:'/pages/o_address/o_address?pageType=back'
    })
  },
  //选择获取门店
  bindPickerChange(e){
    const storeIndex = e.detail.value;

    this.setData({
      storeIndex,
    })
  },
  //选择获取门店提示
  getStore(){
    const currentAddressItem = this.data.currentAddressItem;//收货人信息

    if( currentAddressItem.area ){//收货人信息必须填写
      alert.alert({
        str:'该区域没有找到相关门店，或门店相关信息出错'
      })
    }
    else{//该区域没有门店
      alert.alert({
        str:'请填写收货人信息'
      })
    }
  },
  //结算
  settlement(e){
    const form_id = e.detail.formId;
    const currentAddressItem = this.data.currentAddressItem;
    const storeList = this.data.storeList;
    const storeIndex = this.data.storeIndex;
    const userInfo = wx.getStorageSync('userInfo');
    const pinDetail = this.data.pinDetail;
    const pageType = this.data.pageType;
    let promise;

    //收货人信息必填
    if( !currentAddressItem.address_id )return alert.alert({
      str:'请填写收货人信息'
    });

    //请选择领取的门店
    if( !(pinDetail.type == 2) && !storeList.length )return alert.alert({
      str:'请选择领取的门店'
    });

    if( pageType == 'faqipintuan' ){//发起拼团

      promise = request_01.launchPin({
        user_id:userInfo.user_id,//用户id
        prize_id:pinDetail.prize_id,//拼团商品ID
        form_id,//form表单id
        address_id:currentAddressItem.address_id,//收货人信息 id
        dealer_code:pinDetail.type == 2 ? '' : storeList[storeIndex].code,//门店id 为快递时门店id非必选
      })

    }
    else if( pageType == 'lijicantuan' ){//立即参团

      promise = request_01.joinPin({
        user_id:userInfo.user_id,//用户id
        groupbuy_id:pinDetail.groupbuy_id,//拼团商品ID
        form_id,//form表单id
        address_id:currentAddressItem.address_id,//收货人信息 id
        dealer_code:pinDetail.type == 2 ? '' : storeList[storeIndex].code,//门店id 为快递时门店id非必选
      })

    }

    alert.loading({
      str:'结算中'
    })

    promise
      .then((value)=>{
       
        //success
        const msg = value.data.msg;
        const status = value.data.status;
        const data = value.data.data;
        
        if( status == 1 ){//拼团成功


          if( pageType == 'faqipintuan' ){//发起拼团

            router.jump_red({
              url:`/pages/assemble/o_pin/o_pin?groupbuy_id=${data.groupbuy_id}&user_id=${userInfo.user_id}`,
            })

          }
          else if( pageType == 'lijicantuan' ){//立即参团

            router.jump_red({
              url:`/pages/assemble/o_pin/o_pin?groupbuy_id=${pinDetail.groupbuy_id}&user_id=${userInfo.user_id}`,
            })

          }

        }
        else{//拼团失败
          
          alert.alert({
            str:msg
          })

        }
      })
      .catch((reason)=>{
        //fail
        alert.alert({
          str:JSON.stringify( reason )
        })
      })
      .then(()=>{
        //complete
        
        alert.loading_h()

      })
  },
})