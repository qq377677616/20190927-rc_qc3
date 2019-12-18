// pages/o_love_car/o_love_car.js
const mta = require('../../utils/public/mta_analysis.js')

const request_01 = require('../../utils/request/request_01.js');

const method = require('../../utils/tool/method.js');

const router = require('../../utils/tool/router.js');

const authorization = require('../../utils/tool/authorization.js');

const alert = require('../../utils/tool/alert.js');

const mcaptcha = require('../../utils/other/mcaptcha.js');

const app = getApp();//获取应用实例
Page({

  /**
   * 页面的初始数据
   */
  data: {
    IMGSERVICE: app.globalData.IMGSERVICE,
    options: {},
    isNextShow: false,
    vinCode: '',
    code: '',
    tel: '',
    tipsIf: false,
    failText: '',
    isChecked: true,
    userInfo:{},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    request_01.login(() => {
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  //页面初始化
  initData(options) {
    const userInfo = wx.getStorageSync('userInfo');
    //初始化Mcaptcha
    this.mcaptcha = new mcaptcha({
      el: 'canvas',
      width: 80,
      height: 35,
      createCodeImg: ""
    })
    this.setData({
      options,
      userInfo:userInfo,
    })
  },
  //刷新
  refreshCode() {
    this.mcaptcha.refresh()
    this.setData({
      code: '',
    })
  },
  //vin码
  vinInput(e) {
    const value = e.detail.value;
    this.setData({
      vinCode: value,
    })
  },
  //验证码
  codeInput(e) {
    const value = e.detail.value;
    this.setData({
      code: value,
    })
  },
  //手机号码
  telInput(e) {
    const value = e.detail.value;
    this.setData({
      tel: value,
    })
  },
  //授权
  getUserInfo(e) {

    request_01.setUserInfo(e)
      .then((res) => {
        this.setData({
          userInfo: wx.getStorageSync("userInfo")
        })
        this.nextBtn()
      })
      .catch((err) => {
        alert.alert({
          str: typeof err == 'object' ? JSON.stringify(err) : err
        })
      })
  },
  //我同意
  isChecked() {
    this.setData({
      isChecked: !this.data.isChecked
    })
  },
  //下一步
  nextBtn() {
    const vinCode = this.data.vinCode;
    const code = this.data.code;
    const isChecked = this.data.isChecked;

    const userInfo = wx.getStorageSync('userInfo');
    let result;
    const validationArr = [
      {
        value: vinCode,
        text: '请输入vin码',
      },
      {
        value: code,
        text: '请输入验证码',
      },
    ];

    //效验
    result = validationArr.every((item) => {
      if (item.value) {
        return true;
      }
      else {
        return alert.alert({
          str: item.text,
        });
      }
    })

    //效验失败
    if (!result) return;

    if (this.mcaptcha.validate(code)) {
      //code码验证成功


      if (this.isLicenseNo(vinCode)) {
        //车牌号效验成功

        this.setData({
          isNextShow: true,
        })


      }
      else {
        //车牌号效验失败、识别为vin码

        //车主认证
        this.carAuth({
          user_id: userInfo.user_id,//用户ID
          openid: userInfo.openid,//openid
          check_type: 2,//绑定类型 2-VIN码 3-车牌号
          check_info: vinCode,//VIN码或车牌号
          mobile: '',//当check_type=2时，必填 手机号/客户姓名
          is_send: Number(isChecked)
        })

      }


    }
    else {
      //code码验证失败
      alert.alert({
        str: '验证码错误',
      });
    }

  },
  //效验车牌号
  isLicenseNo(str) {
    return /(^[\u4E00-\u9FA5]{1}[A-Z0-9]{6}$)|(^[A-Z]{2}[A-Z0-9]{2}[A-Z0-9\u4E00-\u9FA5]{1}[A-Z0-9]{4}$)|(^[\u4E00-\u9FA5]{1}[A-Z0-9]{5}[挂学警军港澳]{1}$)|(^[A-Z]{2}[0-9]{5}$)|(^(08|38){1}[A-Z0-9]{4}[A-Z0-9挂学警军港澳]{1}$)/.test(str);
  },
  //保存
  saveBtn() {
    const tel = this.data.tel;
    const userInfo = wx.getStorageSync('userInfo');
    const vinCode = this.data.vinCode
    const isChecked = this.data.isChecked;

    if (/^1[3456789]\d{9}$/.test(tel)) {
      //手机号效验成功
      this.carAuth({
        user_id: userInfo.user_id,//用户ID
        openid: userInfo.openid,//openid
        check_type: 3,//绑定类型 2-VIN码 3-车牌号
        check_info: vinCode,//VIN码或车牌号
        mobile: tel,//当check_type=2时，必填 手机号/客户姓名
        is_send: Number(isChecked)
      })
    }
    else {
      //手机号效验失败
      alert.alert({
        str: '请输入正确手机号',
      });
    }

  },
  //车主认证
  carAuth(data = {}) {


    alert.loading({
      str: '认证中'
    })
    request_01.carAuth(data)
      .then((value) => {
        //success
        const status = value.data.status;
        const msg = value.data.msg;
        const options = this.data.options;
        const userInfo = wx.getStorageSync('userInfo');

        alert.loading_h()

        if (status == 1) 
        {
          //验证成功 返回进入页
          alert.alert({
            str: '恭喜您完成车主认证~',
          })

          //绑定车主成功 存本地
          userInfo.user_type = 1;
          wx.setStorageSync("userInfo", userInfo)

          if (options.pageType == 'back') 
          {
            router.jump_back()
          }else if (options.pageType == 'spike') 
          {
            //秒杀活动非车主预约车主商品
            let pages = getCurrentPages();
            let prevPage = pages[pages.length - 2]; //上一个页面
            if (prevPage) {
              prevPage.VipAppoBtn({
                goods_id: options.goods_id,
                formId: options.formId,
              })
            }

            router.jump_back()
          }else 
          {
            router.jump_nav({
              url: '/pages/o_love_car_show/o_love_car_show'
            })
          }


        }
        else 
        {
          //验证失败
          this.setData({
            failText: msg,
            tipsIf: true,
          })
        }



      })
      .catch((reason) => {
        //fail
        alert.loading_h()
        alert.alert({
          str: reason,
        })
      })
      .then(() => {
        //complete


      })
  },
  //验证失败提示
  knowBtn() {
    //关闭提示
    this.setData({
      tipsIf: false,
    })
  },
  //图片预览
  previewImage() {
    const IMGSERVICE = this.data.IMGSERVICE;
    wx.previewImage({
      current: `${IMGSERVICE}/center/vincode.jpg`, // 当前显示图片的http链接  
      urls: [`${IMGSERVICE}/center/vincode.jpg`] // 需要预览的图片http链接列表  
    })
  },
})