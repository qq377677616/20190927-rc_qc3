// pages/o_address/o_address.js

const request_01 = require('../../utils/request/request_01.js');

const router = require('../../utils/tool/router.js');

const alert = require('../../utils/tool/alert.js');

const app = getApp();//获取应用实例

Page({

  /**
   * 页面的初始数据
   */
  data: {
    options:{},
    addressList: [],
    startX: null,
    startY: null,
    str:'- 暂无地址 -',
    isMore:false,
    firstShow:false,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
	console.log(options)
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
      this.initData(options)
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
  //开始触屏事件
  touchstart(e) {
    const startX = e.changedTouches[0].clientX;
    const startY = e.changedTouches[0].clientY;
    this.setData({
      startX: startX,
      startY: startY,
    })
  },
  //触屏移动事件
  touchmove(e) {
    const id = e.currentTarget.dataset.id;
    const startX = this.data.startX;
    const startY = this.data.startY;
    const moveX = e.changedTouches[0].clientX;
    const moveY = e.changedTouches[0].clientY;
    let addressList = this.data.addressList;
    let angle, direction;

    angle = this._angle({
      X: startX,
      Y: startY
    }, {
        X: moveX,
        Y: moveY
      });


    if (30 <= Math.abs(angle) && Math.abs(angle) <= 150) return;//大于30度


    if (moveX <= startX) {//左滑
      direction = 'left'
    } else {//右滑
      direction = 'right';
    }

    addressList = this._dealGoods({
      addressList,
      id,
      direction,
    })

    this.setData({
      addressList: addressList,
    })
  },
  //触屏结束事件
  touchend(e) {

  },
  //处理商品状态
  _dealGoods({ addressList, id, direction }) {
    for (let prop in addressList) {
      if (prop == id) {
        addressList[prop].direction = direction;
      }
    }
    return addressList;
  },
  //获取角度
  _angle(start, end) {
    let _X = end.X - start.X;
    let _Y = end.Y - start.Y;
    //弧度转角度
    return Math.atan2(_Y, _X) * 180 / Math.PI;
  },
  //页面初始化
  initData(options) {
    const userInfo = wx.getStorageSync('userInfo');

    Promise.all([
      request_01.addressList({
        user_id: userInfo.user_id,
        openid: userInfo.openid,
      })
    ])
      .then((value) => {
        //success
        const addressList = value[0].data.data;
        let isMore, checkedIndex;

        if( addressList.length ){//有数据返回
          isMore = false;
        }else{//无数据返回
          isMore = true;
        }

        this.setData({
          addressList,
          isMore,
        })

      })
      .catch((reason) => {
        //fail

      })
      .then(()=>{
        //complete
        this.setData({
          options,
        })

      })
  },
  //删除
  deleteBtn(e) {
    const address_id = e.currentTarget.dataset.id;
    const userInfo = wx.getStorageSync('userInfo');

    alert.loading({
      str:'删除中'
    })
    request_01.deleteAddress({
      address_id,
      user_id: userInfo.user_id,
    })
      .then((res) => {
        
        this.initData()

        alert.loading_h()

        alert.alert({
          str:'删除成功',
        })
      })
      .catch((reason) => {
        alert.loading_h()

        alert.alert({
          str:'删除成功',
        })
      })
  },
  //编辑
  editBtn(e){
    const index = e.currentTarget.dataset.id;
    const addressList = this.data.addressList;

    app.globalData.currentAddressItem = addressList[index];

    router.jump_nav({
      url: '/pages/o_address_add/o_address_add'
    })
    

  },
  //选择
  checkedBtn(e){
    const index = e.currentTarget.dataset.id;
    const addressList = this.data.addressList;

    app.globalData.currentAddressItem = addressList[index];

    this.setData({
      checkedIndex:index,
    })

    router.jump_back()
  },
  //添加
  addBtn() {

    app.globalData.currentAddressItem = {};

    router.jump_nav({
      url: '/pages/o_address_add/o_address_add'
    })

  },
})