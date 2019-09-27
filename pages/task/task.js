// pages/task/task.js
const mta = require('../../utils/public/mta_analysis.js')

const request_01 = require('../../utils/request/request_01.js');

const method = require('../../utils/tool/method.js');

const router = require('../../utils/tool/router.js');

const authorization = require('../../utils/tool/authorization.js');

const alert = require('../../utils/tool/alert.js');

const app = getApp();//获取应用实例
Page({

  /**
   * 页面的初始数据
   */
  data: {
    IMGSERVICE: app.globalData.IMGSERVICE,
    options: {},
    firstShow:false,
    taskInfo: {},
    signInIf: false,
    authIf: false,
    sequenceList: {
      url: `${app.globalData.IMGSERVICE}/sequence/bean/bean_`,
      num: 30,
      speed: 100,
      loop: false,
    },
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    request_01.login(() => {
      this.initData(options)
      this.sequenceInit('sequenceList')
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
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
        title:'做任务领V豆，好礼兑不停！',
        path: '/pages/task/task'
    };
  },
  //序列帧初始化
  sequenceInit(sequence) {
    let _sequence = []
    let _url = this.data[sequence].url
    let _num = this.data[sequence].num
    for (let i = 0; i < _num; i++) {
      _sequence.push({ url: `${_url}${i + 1}.png`, speed: this.data[sequence].speed, loop: this.data[sequence].loop })
    }
    this.setData({ [sequence]: _sequence })
    console.log("sequenceList", this.data.sequenceList)
  },
  //序列动画开始
  sequenceStart(sequence) {
    let _num = 1
    return new Promise(resolve => {

      let autoSequence = setInterval(() => {

        let _curSequenceIndex = this.data[`${sequence}Index`] || 0;
        _curSequenceIndex++;

        if (_curSequenceIndex <= 30) {
          this.setData({ 
            [`${sequence}Index`]: _curSequenceIndex,
          })
        } 
        else {
          if (
            (typeof (this.data[sequence][0].loop) == 'boolean' 
            && this.data[sequence][0].loop) || (typeof (this.data[sequence][0].loop) == 'number' 
            && _num < this.data[sequence][0].loop)
          ) {
            _num++;
            this.setData({ 
              [`${sequence}Index`]: 0,
            })
          } 
          else {
            this.setData({ 
              [`${sequence}Index`]: -1,
            })
            clearInterval(autoSequence)
            resolve()
          }
        }

      }, this.data[sequence][0].speed)

    })
  },
  //页面初始化
  initData(options) {
    const userInfo = wx.getStorageSync('userInfo');

    Promise.all([
      request_01.taskIndex({
        user_id: userInfo.user_id,
      })
    ])
      .then((value) => {
        //success
        const taskInfo = value[0].data.data;

        this.setData({
          taskInfo,
        })
      })
      .catch((reason) => {
        //fail

      })
      .then(() => {
        //complete

        this.setData({
          options,
        })
      })
  },
  //banner跳转
  bannerJump() {
    const taskInfo = this.data.taskInfo;
    const page = taskInfo.banner.page;

    if (page) {
      router.jump_nav({
        url: `/${page}`,
      })
    }
  },
  //任务btn
  taskBtn(e) {
    const index = e.currentTarget.dataset.index;
    const taskInfo = this.data.taskInfo;
    const type = taskInfo.list[index].type;
    const value = taskInfo.list[index].value;

    switch (type) {
      case 1:
        //1-弹窗

        if (value == 'do_sign_in') {
          //签到事件
          this.setData({
            signInIf: true,
          })
        }
        else if (value == 'oauth') {
          //授权
          // this.setData({
          //   authIf: true,
          // })
        }

        break;
      case 2:
        //2-跳转页面
        router.jump_nav({
          url: `/${value}`,
        })
        break;
    }
  },
  //签到
  sureBtn() {
    const options = this.data.options;

    //刷新
    this.onLoad(options)

    this.setData({
      signInIf: false,
    })
  },
  //直接跳过
  notAuth() {
    this.setData({
      authIf: false,
    })
  },
  //立即授权
  getUserInfo(e) {
    const options = this.data.options;
    request_01.setUserInfo(e)
      .then(res => {
        if (res) {
          //授权、上传头像昵称成功
          this.onLoad(options)
          this.setData({
            authIf: false,
          })

          // this.sequenceStart('sequenceList')
          //   .then(() => {
          //     //序列帧播放完毕
          //     //刷新
          //     this.onLoad(options)

          //     this.setData({
          //       authIf: false,
          //     })
          //   })
        }
      })
      .catch(err => {
        console.log("err", err)
      })
  },
})