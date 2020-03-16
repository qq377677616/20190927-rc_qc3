// pages/ev/ev_index/ev_index.js
const request_01 = require('../../../utils/request/request_01.js');

const request_05 = require('../../../utils/request/request_05.js');

const router = require('../../../utils/tool/router.js');

const tool = require('../../../utils/tool/tool.js');

const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        IMGSERVICE: app.globalData.IMGSERVICE,
        rulspop: false,
        policypop:false,
        isOnshow:false
    },

    // 初始化
    initData(options) {
        let activity_id = '';
        let openid = wx.getStorageSync('userInfo').openid
        if (options.scene) {
            let scene = decodeURIComponent(options.scene);
            console.log(scene)
            scene.split('&').forEach((item) => {
                console.log(item.split('='))
                if (item.split('=')[0] == 'a') { //找到activity_id
                    activity_id = item.split('=')[1]
                }
            })
        } else {
            activity_id = options.activity_id;
        }
        request_05.evIndex({ activity_id, openid }).then(res => {
            console.log(res, 'res')
            this.setRule()
            if (res.data.status == 1) {
                this.setData({
                    rule: res.data.data.activity_info.rule, //规则
                    take_status: res.data.data.activity_info.take_status, //预约状态   
                    car_owner: res.data.data.activity_info.car_owner,
                    order_goods_info:res.data.data.order_goods_info,
                    help_info:res.data.data.help_info,
                    activity_id,
                    options
                })
                if(res.data.data.status==2){
                    this.setData({
                        isVehicleOwnerHidePop: true,
                        popType: 1,
                        text: "活动预计" + res.data.data.activity_info.start_date + "号开启 敬请期待"
                    })
                    return;
                }
                if(res.data.data.status==3){
                    this.setData({
                        isVehicleOwnerHidePop: true,
                        popType: 1,
                        text: "活动已结束"
                      })
                    return;
                }
            } else {
                tool.alert(res.data.msg)
            }
        })
    },

    // 领取卡券
    getCard(){
        var _this = this
        let order_goods_id = this.data.order_goods_info.order_goods_id
        let activity_id = this.data.activity_id
        let options = this.data.options
        let user_id = wx.getStorageSync('userInfo').user_id
        request_05.getWechatCard({order_goods_id,user_id}).then(res=>{
            if(res.data.status==1){
                console.log(res,'res')
                wx.addCard({
                  cardList: [res.data.data[0]],
                  success(res){
                    tool.loading('领取中')
                    let card_code = res.cardList[0].code
                    request_05.orderCardCode({
                      order_goods_id,  
                      user_id,
                      card_code
                    }).then(res => {
                      console.log('update_card_code', res)
                      if (res.data.status == 1) {
                        tool.loading_h()
                        tool.alert('领取成功')
                        setTimeout(() => {
                            _this.initData(options)
                        }, 500);
                      }
                    })
                  },
                  fail(){
                    setTimeout(() => {
                      tool.alert('领取失败')
                      _this.initData(options)
                    }, 500);
                  }
                })
              }else{
                tool.alert(res.data.msg)
              }
        })
    },

    // 去留资
    toForm() {
        if ((wx.getStorageSync("userInfo").user_type == 0 && this.data.car_owner) || !wx.getStorageSync("userInfo").nickName || !wx.getStorageSync("userInfo").unionid) return;
        let activity_id = this.data.activity_id
        router.jump_nav({
            url: `/pages/ev/ev_form/ev_form?activity_id=${activity_id}`
        })
    },

    // 去助力
    toHelp(){
        if ((wx.getStorageSync("userInfo").user_type == 0 && this.data.car_owner) || !wx.getStorageSync("userInfo").nickName || !wx.getStorageSync("userInfo").unionid) return;
        let activity_id = this.data.activity_id
        router.jump_nav({
            url: `/pages/ev/ev_help/ev_help?activity_id=${activity_id}`
        })
    },

    // 我的卡包
    toCardBag(){
        router.jump_nav({
            url: `/pages/o_card_bag/o_card_bag`
        })
    },

    // 规则开关
    switchRule() {
        this.setData({
            rulspop: !this.data.rulspop
        })
    },
    
    // 置换政策开关
    switchPolicy(){
        this.setData({
            policypop: !this.data.policypop
        })
    },

    // 弹窗永久弹一次
    setRule() {
        if (!wx.getStorageSync("isRule").ev) {
            this.setData({
                rulspop: true
            });
            let _isRule = wx.getStorageSync("isRule") || {}
            _isRule.ev = true
            wx.setStorageSync("isRule", _isRule)
        }
    },

    //判断是否授权和是否是车主
    isVehicleOwner(e) {
        console.log('e', e)
        if ((wx.getStorageSync("userInfo").nickName && wx.getStorageSync("userInfo").user_type == 1 && wx.getStorageSync("userInfo").unionid) || (e && e.target.dataset.type != 'ok') || (wx.getStorageSync("userInfo").nickName && !this.data.car_owner && wx.getStorageSync("userInfo").unionid)) return
        if (!wx.getStorageSync("userInfo").nickName || !wx.getStorageSync("userInfo").unionid) {
            this.setData({
                popType: 2
            })
        } else if (wx.getStorageSync("userInfo").user_type == 0 && this.data.car_owner) {
            this.setData({
                popType: 3
            })
        }
        this.isVehicleOwnerHidePop()
    },
    //授完权后处理
    getParme(e) {
        this.isVehicleOwnerHidePop()
        request_01.setUserInfo(e).then(res => {
            this.isVehicleOwner()
        })
    },
    //是否授权、绑定车主弹窗
    isVehicleOwnerHidePop() {
        this.setData({
            isVehicleOwnerHidePop: !this.data.isVehicleOwnerHidePop
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        request_01.login(() => {
            this.initData(options)
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {
        this.setData({
            isOnshow:true
        })
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
        let options = this.data.options
        if(this.data.isOnshow){
            this.initData(options)
        }
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {
        let activity_id = this.data.activity_id
        let obj = {
        title: '北京新能源指标用户到店拿500元红包！速来参与！',
            path: `/pages/ev/ev_index/ev_index?activity_id=${activity_id}`,
            imageUrl: this.data.IMGSERVICE + "/ev/ev_index_share.jpg"
            };
        return obj;
    }
})