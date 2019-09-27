// components/SignIn/cmp.js
const request_01 = require('../../utils/request/request_01.js');

const method = require('../../utils/tool/method.js');

const router = require('../../utils/tool/router.js');

const authorization = require('../../utils/tool/authorization.js');

const alert = require('../../utils/tool/alert.js');

const app = getApp();//获取应用实例
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    
  },

  /**
   * 组件的初始数据
   */
  data: {
    IMGSERVICE: app.globalData.IMGSERVICE,
    signInArr: ['一', '二', '三', '四', '五', '六', '七'],
    signInInfo:{},
    show:false,
    sequenceList: { url: `${app.globalData.IMGSERVICE}/sequence/bean/bean_`, num: 30, speed: 100, loop: false }
  },
  lifetimes: {
    attached: function() {
      // 在组件实例进入页面节点树时执行
      
      this.initData();
      this.sequenceInit('sequenceList')
    },
    detached: function() {
      // 在组件实例被从页面节点树移除时执行
      
    },
  },
  /**
   * 组件的方法列表
   */
  methods: {
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
          let _curSequenceIndex = this.data[`${sequence}Index`] || 0
          _curSequenceIndex++
          if (_curSequenceIndex <= 30) {
            this.setData({ [`${sequence}Index`]: _curSequenceIndex })
          } else {
            if ((typeof (this.data[sequence][0].loop) == 'boolean' && this.data[sequence][0].loop) || (typeof (this.data[sequence][0].loop) == 'number' && _num < this.data[sequence][0].loop)) {
              _num++
              this.setData({ [`${sequence}Index`]: 0 })
            } else {
              this.setData({ [`${sequence}Index`]: -1 })
              clearInterval(autoSequence)
              resolve()
            }
          }
        }, this.data[sequence][0].speed)
      })
    },
    //页面初始化
    initData(){
      const userInfo = wx.getStorageSync('userInfo');

      Promise.all([
        request_01.signInInfo({
          user_id:userInfo.user_id,
        })
      ])
        .then((value)=>{
          console.log("value", value)
          //success
          const signInInfo = value[0].data.data;
        
          // signInInfo.sign_in_num = signInInfo.sign_in_num == 0 ? 0 : signInInfo.sign_in_num - 1;//更新连续签到天数
          console.log("signInInfo", signInInfo)
          this.setData({
            signInInfo,
          })
        })
        .catch((reason)=>{
          //fail

          alert.alert({
            str:JSON.stringify( reason )
          })

        })
        .then(()=>{
          this.setData({
            show:true,
          })
        })
    },
    //签到
    signIn(e){
      // const index = e.currentTarget.dataset.index;
      // const signInInfo = this.data.signInInfo;
      // const userInfo = wx.getStorageSync('userInfo');
      // if (this.data.signInInfo.sign_in_num != index && this.data.signInInfo.is_sign == 0) {
      //   alert.alert({ str: "只能签当天哦~" })
      //   return
      // } else if (signInInfo.is_sign == 1) {
      //   alert.alert({ str: "今天您已签到,请明天再来" })
      //   return
      // }
      const signInInfo = this.data.signInInfo;
      const userInfo = wx.getStorageSync('userInfo');
      if (signInInfo.is_sign == 1) {
        // alert.alert({ str: "今天您已签到,请明天再来" })
        this.sureBtn()
        return
      }

        request_01.signIn({
          user_id:userInfo.user_id,
        })
          .then((value)=>{
            //success
            const msg = value.data.msg;
            const status = value.data.status;
            const newSignInInfo = value.data.data;

            if( status == 1 ){//签到成功
              // signInInfo.sign_in_num = newSignInInfo.sign_in_num == 0 ? 0 : newSignInInfo.sign_in_num - 1;//更新连续签到天数
              // signInInfo.is_sign = 1;
              alert.alert({ str: "签到成功" })
              setTimeout(() => {
                this.sureBtn()
              }, 800)
              this.initData()
              // this.sequenceStart('sequenceList').then(() => {
              //   console.log("序列帧播放完毕")
              // })
            }
            else{//您今天已签到
              alert.alert({
                str:msg,
              })
            }

            this.setData({
              signInInfo,
            })

          })
          .catch((reason)=>{
            //fail
            alert.alert({
              str:JSON.stringify( reason )
            })
          })

      // }
      // else{//否则点击不做处理
      //   return false;
      // }
    },
    //确定按钮
    sureBtn(){
      //触发组件上自定义事件
      this.triggerEvent('sureBtn')
    },
  }
})
