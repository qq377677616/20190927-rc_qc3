// pages/o_address_add/o_address_add.js

const request_01 = require('../../utils/request/request_01.js');

const alert = require('../../utils/tool/alert.js');

const router = require('../../utils/tool/router.js');

const app = getApp();//获取应用实例

Page({

  /**
   * 页面的初始数据
   */
  data: {
    options:{},
    ssqArr: [],
    currentAddressItem: {},
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
  initData() {
    const currentAddressItem = app.globalData.currentAddressItem;//获取地址列表页传过来的当前地址（新增 编辑）
    let ssqArr = this.data.ssqArr;

    ssqArr = currentAddressItem.area ? currentAddressItem.area.split(' ') : [];//获取省市区

    this.setData({
      currentAddressItem,
      ssqArr,
    })

    app.globalData.currentAddressItem = {};//清除数据

  },
  //姓名输入事件
  nameInput(e){
    const currentAddressItem = this.data.currentAddressItem;
    const value = e.detail.value;//获取输入的姓名

    currentAddressItem.name = value;

    this.setData({
      currentAddressItem,
    })
  },
  //sex radio
  sexRadioBtn(e){
    const id = e.currentTarget.dataset.id;//获取sex
    let currentAddressItem = this.data.currentAddressItem;

    Object.assign(currentAddressItem, {
      sex:id
    })

    this.setData({
      currentAddressItem,
    })
    
  },
  //手机号输入事件
  telInput(e){
    const currentAddressItem = this.data.currentAddressItem;
    const value = e.detail.value;//获取手机号

    currentAddressItem.mobile = value;

    this.setData({
      currentAddressItem,
    })
  },
  //picker
  bindRegionChange(e) {
    const ssqArr = e.detail.value;//获取省市区

    this.setData({
      ssqArr,
    })
  },
  //地址输入事件
  addressInput(e){
    const currentAddressItem = this.data.currentAddressItem;
    const value = e.detail.value;//获取地址

    currentAddressItem.address = value;

    this.setData({
      currentAddressItem,
    })
  },
  //default => switch
  switchChange(e){
    const currentAddressItem = this.data.currentAddressItem;
    const value = e.detail.value;//获取是否默认

    currentAddressItem.is_default = Boolean(value);

    this.setData({
      currentAddressItem,
    })
  },
  //提交
  submitBtn(){
    const currentAddressItem = this.data.currentAddressItem;
    const ssqArr = this.data.ssqArr;
    const userInfo = wx.getStorageSync('userInfo');
    let promise;

    //效验表单对象
    const validationArr = [
      {
        value:currentAddressItem.name || '',
        alert:'请填写姓名',
      },
      {
        value:currentAddressItem.sex || '',
        alert:'请选择性别',
      },
      {
        value:/^1[3456789]\d{9}$/.test(currentAddressItem.mobile),
        alert:'请填写正确手机号',
      },
      {
        value:ssqArr.length,
        alert:'请选择地址',
      },
      {
        value:currentAddressItem.address || '',
        alert:'请填写详细地址',
      }
    ];

    //判断是否效验通过
    const validationResult = validationArr.every((item)=>{
      if( item.value ){
        return true;
      }else{
        alert.alert({
          str:item.alert,
        })
        return false;
      }
    })

    //表单效验失败
    if( !validationResult )return '表单效验失败';

    alert.loading({
      str:'提交中'
    })

    if( currentAddressItem.address_id ){//编辑
      promise = request_01.editAddress({
        address_id:currentAddressItem.address_id,//地址ID
        user_id:userInfo.user_id,//用户ID
        name:currentAddressItem.name,//姓名
        sex:currentAddressItem.sex,//1-先生 2-女士
        mobile:currentAddressItem.mobile,//手机号
        area:ssqArr.join(' '),//地区(湖南省 长沙市 开福区)
        address:currentAddressItem.address,//详细地址（泊富管国际广场写字楼20楼）
        is_default:currentAddressItem.is_default,//是否默认地址 1-是 0-否
      })
    }else{//新增
      promise = request_01.addAddress({
        user_id:userInfo.user_id,//用户ID
        name:currentAddressItem.name,//姓名
        sex:currentAddressItem.sex,//1-先生 2-女士
        mobile:currentAddressItem.mobile,//手机号
        area:ssqArr.join(' '),//地区(湖南省 长沙市 开福区)
        address:currentAddressItem.address,//详细地址（泊富管国际广场写字楼20楼）
        is_default:currentAddressItem.is_default,//是否默认地址 1-是 0-否
      })
    }
    
    promise.then((value)=>{
      const status = value.data.status;
      const msg = value.data.msg;

      alert.loading_h()
      
      if( status == 1 ){
        router.jump_back()
      }else{
        alert.alert({
          str:msg,
        })
      }

      
    })
    .catch((reason)=>{
      alert.loading_h()
    })
  },
})