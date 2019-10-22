// pages/sign_up/sign_up.js
const request_01 = require('../../utils/request/request_01.js');

const request_05 = require('../../utils/request/request_05.js');

const request_03 = require('../../utils/request/request_03.js');

const router = require('../../utils/tool/router.js');

const alert = require('../../utils/tool/alert.js');

import tool from '../../utils/tool/tool.js';

const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    IMGSERVICE: app.globalData.IMGSERVICE,
    options: {},
    firstShow: false,
    page: 1,
    scrollKey: true,
    scrollPrivateKey: true,
    signInfo: {},
    winInfo: {},
    prize_status:'',
    keyGroup: {},
    activityShow: false,
    ruleShow: false,
    isShowForm: false,
    buttonType:'',
    formType: '',//0为门店弹窗、1为详细地址弹窗、2为看车弹窗、3为报名留资弹窗
    formId: '',
    isWinShow: true,
    isTipsShow: false,
    tipsText: '',
    isWinPromptShow: false,
    isCodeShow:false,
    code:'',
    isEnrolment:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    request_01.login(() => {
      this.initData(options);
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.setData({
      firstShow: true,
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    const firstShow = this.data.firstShow;
    const options = this.data.options;

    //返回刷新
    if (firstShow) {
      this.setData({
        page: 1,
        scrollKey: true,
        scrollPrivateKey: true,
      })

      this.onLoad(options)
    }

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    const signInfo = this.data.signInfo;
    const winInfo = this.data.winInfo;

    //关闭规则提示
    this.closeRule()
    //关闭中奖提示
    if ((signInfo.status == 4) && winInfo.user_activity.status == 1) {
      this.isWinPromptShow()
    }


  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    const signInfo = this.data.signInfo;
    const winInfo = this.data.winInfo;

    //关闭规则提示
    this.closeRule()
    //关闭中奖提示
    if ((signInfo.status == 4) && winInfo.user_activity.status == 1) {
      this.isWinPromptShow()
    }
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
    const options = this.data.options;

    return {
      // title:'',
      // imageUrl:`${IMGSERVICE}/pin/pin.jpg`,
      path: `/pages/sign_up/sign_up?activity_id=${options.activity_id}&pageType=index`,
    }
  },
  //页面初始化
  initData(options) {
    const userInfo = wx.getStorageSync('userInfo');

    //数据初始化
    alert.loading({
      str: '加载中'
    })

    Promise.all([
      request_05.enterApply({
        activity_id: options.activity_id,
        user_id: userInfo.user_id,
      }),
      request_05.hasParticipate({
        activity_id: options.activity_id,
        user_id: userInfo.user_id,
        page: 1,
      }),
    ])
      .then((value) => {
        //success

        const signInfo = value[0].data.data;
        const winInfo = value[1].data.data;
        const keyGroup = wx.getStorageSync('keyGroup');

        this.setData({
          signInfo,//报名信息
          winInfo,//奖品信息
          keyGroup,
          ruleShow: keyGroup.signUpKey,//首次弹规则弹窗
          isWinPromptShow: keyGroup.signUpWin,//只在首次弹中奖提示框
          activityShow: keyGroup.signUpKey ? false : true,//首次弹规则不展示活动 未开始 结束 提示框
          prize_status:winInfo.user_activity ? winInfo.user_activity.prize_status : '',//单独提出奖品领取状态
        })

      })
      .catch((reason) => {
        //fail

      })
      .then(() => {
        //complete
        alert.loading_h()
        this.setData({
          options,
        })
      })
  },
  //关闭rule规格按钮
  closeRule() {
    const ruleShow = this.data.ruleShow;
    const keyGroup = this.data.keyGroup;

    if (keyGroup.signUpKey) {
      //如果第一次关闭规则弹窗
      this.setData({
        activityShow: true,
      })
    }

    keyGroup.signUpKey = false;

    wx.setStorageSync('keyGroup', keyGroup)//存本地

    //切换规则弹窗
    this.setData({
      ruleShow: false,
    })
  },
  //打开rule规则按钮
  openRule() {
    this.setData({
      ruleShow: true,
    })
  },
  //我要报名
  signUp(e) {
    const formId = e.detail.formId;
    const signInfo = this.data.signInfo;

    //是否车主
    if ((wx.getStorageSync("userInfo").user_type == 0 && signInfo.car_owner) || !wx.getStorageSync("userInfo").nickName) return;

    this.setData({
      formType: 3,
      formId,
      isShowForm: true,
      buttonType:'signUp'
    })
  },
  //已报名
  enrolmentBtn(){
    const isEnrolment = this.data.isEnrolment;
    this.setData({
      isEnrolment:!isEnrolment,
    })
  },
  //
  //关闭留资弹窗
  isShowForm() {
    this.setData({
      isShowForm: false,
    })
  },
  //提交表单
  submit(e) {
    const detail = e.detail;
    const formId = this.data.formId;
    const options = this.data.options;
    const userInfo = wx.getStorageSync('userInfo');
    const buttonType = this.data.buttonType;
    const winInfo = this.data.winInfo;
    const user_activity = winInfo.user_activity;

    if( buttonType == 'signUp' ){
      //报名

      alert.loading({
        str:'报名中'
      })

      request_05.participate({
        activity_id: options.activity_id,
        user_id: userInfo.user_id,
        name: detail.name,
        mobile: detail.phone,
        form_id: formId,
        verify_code: detail.code || '',
      })
        .then((value) => {
          //success
          const msg = value.data.msg;
          const status = value.data.status;
          let tipsText;
          alert.loading_h()


          if (status == 1) {
            //报名成功
            tipsText = '已报名成功\n坐等锦鲤附身！';
          }
          else {
            //报名失败
            tipsText = msg;
          }

          this.setData({
            isTipsShow: true,
            tipsText,
            isShowForm: false,
          })


        })
        .catch((reason)=>{
          //fail
          alert.loading_h()
        })
    }
    else{
      //领取奖品

      alert.loading({
        str:'提交中'
      })
      request_03.pushForm({
        user_id: userInfo.user_id,
        openid: userInfo.openid,
        prize_log_id: user_activity.prize_log_id,
        name: detail.name,
        mobile: detail.phone,
        verify_code: detail.code,
        dlr_code: detail.storeCode,
        area: detail.region.join(" "),
        address: detail.address || ''
      })
        .then((res)=>{
          //success
          const status = res.data.status;
          const _data = res.data.data;
          alert.loading_h()

          if (status == 1) {
            //留资成功

            if (user_activity.prize_type == 1) {
              //微信卡卷
              this.addCard([res.data.data.card_info], _data.data_id)
              
            } 
            else if (user_activity.prize_type == 2) {
              //快递

              this.isShowForm()//关闭留资框

              tool.showModal("领取成功", "您的信息已提交成功，近期将会有工作人员电话联系您，敬请留意~", "好的,#124DB8", false)
            
              this.setData({
                prize_status:1,//已领取
              })
            } 
            else if (user_activity.prize_type == 3) {
              //虚拟卡卷

              this.isShowForm()//关闭留资框

              this.setData({
                code: _data.xuni_code,//存取返回的code
                isCodeShow:true,//展示code兑换码弹框
                prize_status:1,//已领取
              })
            }

          } else {

            //留资失败
            tool.alert(res.data.msg)

          }
        })
        .catch((reason)=>{
          //fail
          alert.loading_h()
        })


    }


  },
  //领取奖品
  getBtn(e) {
    const winInfo = this.data.winInfo;
    const user_activity = winInfo.user_activity;

    //虚拟卡卷、微信卡卷、快递
    this.setData({
      formType: user_activity.prize_type == 2 ? '1' : '0',//0为门店弹窗、1为详细地址弹窗
      isShowForm: true,
      buttonType:'receive_prize',
    })
  },
  //领取卡券
  addCard(cardList, data_id) {
    alert.loading({
      str:'卡卷领取中'
    })
    tool.addCard(cardList)
      .then(res => {
        //success
        alert.loading_h()

        console.log("卡券返回", res)
        if (res.errMsg == "addCard:ok") {

          console.log("卡券领取成功")
          this.cardCheck(data_id, res.cardList[0].code)

        } 
        else {

          alert.alert({
            str:"卡券领取失败"
          })

        }
      }).catch(err => {
        //fail
        alert.loading_h()

        console.log("err", err)
        alert.alert({
          str:"卡券领取失败"
        })
      })
  },
  //卡券核销上报
  cardCheck(data_id, card_code) {
    const userInfo = wx.getStorageSync("userInfo");
    const winInfo = this.data.winInfo;
    const user_activity = winInfo.user_activity;

    alert.loading({
      str:'卡卷正在领取'
    })
    api.cardCheck({
      user_id: userInfo.user_id, 	
      prize_log_id: user_activity.prize_log_id, 	
      data_id: data_id,	 
      card_code: card_code
    })
      .then(res => {
        //success
        console.log("卡券核销上报返回", res)
        alert.loading_h()

        if (res.statusCode == 200) {

          alert.alert({
            str:"卡券领取成功"
          })

          this.isShowForm()//关闭留资框

          this.setData({
            prize_status:1,//已领取
          })

        }
      })
      .catch((reason)=>{
        //fail
        alert.loading_h()

        alert.alert({
          str:"卡券领取失败"
        })
      })
  },
  //复制兑换码
  setClipboar(){
	  let code = this.data.code;
	  wx.setClipboardData({
		  //准备复制的数据
		  data: code,
	  });
  },
  //公布弹窗滚动加载
  winListScroll(e) {
    const options = this.data.options;
    const userInfo = wx.getStorageSync('userInfo');
    const scrollKey = this.data.scrollKey;
    const scrollPrivateKey = this.data.scrollPrivateKey;
    const page = this.data.page;

    //滚动加载时、不允许操作
    if (!scrollKey || !scrollPrivateKey) return;

    this.setData({
      scrollKey: false,
    })

    request_05.hasParticipate({
      activity_id: options.activity_id,
      user_id: userInfo.user_id,
      page: page + 1,
    })
      .then((value) => {
        //success
        const the_winning_list = value.data.data.the_winning_list;
        const winInfo = this.data.winInfo;
        let scrollPrivateKey;

        if (the_winning_list.length) {//有数据返回
          scrollPrivateKey = true;
        }
        else {//无数据返回
          scrollPrivateKey = false;
        }

        winInfo.the_winning_list = [...winInfo.the_winning_list, ...the_winning_list];

        this.setData({
          scrollPrivateKey,
          winInfo,
          page: page + 1,
        })

      })
      .catch((reason) => {
        //fail

      })
      .then(() => {
        //complete
        this.setData({
          scrollKey: true,
        })
      })

  },
  //关闭公布弹窗
  isWinShow() {
    this.setData({
      isWinShow: false,
    })
  },
  //关闭报名提示弹窗
  isTipsShow() {
    const options = this.data.options;

    //刷新页面
    this.onLoad(options)

    this.setData({
      isTipsShow: false,
    })
  },
  //关闭中奖提示弹窗
  isWinPromptShow() {
    const keyGroup = this.data.keyGroup;

    keyGroup.signUpWin = false;

    wx.setStorageSync('keyGroup', keyGroup)//存本地

    this.setData({
      isWinPromptShow: false,
    })
  },
  //判断是否授权和是否是车主
  isVehicleOwner(e) {
    const signInfo = this.data.signInfo;
    if ((wx.getStorageSync("userInfo").nickName && wx.getStorageSync("userInfo").user_type == 1) || (e && e.target.dataset.type != 'ok') || (wx.getStorageSync("userInfo").nickName && !signInfo.car_owner)) return;
    if (!wx.getStorageSync("userInfo").nickName) {
      this.setData({ popType: 2 })
    }
    else if (wx.getStorageSync("userInfo").user_type == 0) {
      this.setData({ popType: 3 })
    }

    this.isVehicleOwnerHidePop()
  },
  //授完权后处理
  getParme(e) {
    this.isVehicleOwnerHidePop()

    request_01.setUserInfo(e)
      .then(res => {
        this.isVehicleOwner()
      })
  },
  //是否授权、绑定车主弹窗
  isVehicleOwnerHidePop() {
    this.setData({
      isVehicleOwnerHidePop: !this.data.isVehicleOwnerHidePop
    })
  },
  //关闭兑换码弹窗
  closeCode(){

    this.setData({
      isCodeShow:false,
    })
  },
})