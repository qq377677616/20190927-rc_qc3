// pages/assemble/pin/_pin.js
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
        IMGSERVICE: app.globalData.IMGSERVICE,//图片路径
        page404: false,//页面加载成功失败
        options: {},//参数对象
        firstShow: false,//返回刷新字段
        keyGroup:{},
        pinIndex: {},
        ruleShow: false,
        activityShow:false,
        page: 1,
        scrollKey: true,
        scrollPrivateKey: true,
        editKey: true,
        isMore: false,
        str: '',
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
        //关闭规则提示
        this.ruleHideBtn()
    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {
        //关闭规则提示
        this.ruleHideBtn()
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
        const userInfo = wx.getStorageSync('userInfo');
        const options = this.data.options;
        const editKey = this.data.editKey;
        const scrollKey = this.data.scrollKey;
        const scrollPrivateKey = this.data.scrollPrivateKey;
        const page = this.data.page;

        //编辑中、滚动加载不允许操作
        if (!editKey || !scrollKey || !scrollPrivateKey) return;

        this.setData({
            scrollKey: false,
            str: '加载中...',
            isMore: true,
        })

        request_01.pinGoodsList({
            user_id: userInfo.user_id,
            activity_id:options.activity_id,
            page: page + 1,
        })
            .then((value) => {
                //success
                const newPinIndex = value.data.data;
                const pinIndex = this.data.pinIndex;
                let isMore, scrollPrivateKey;

                if (newPinIndex.goods_list.length) {//有数据返回
                    scrollPrivateKey = true;
                    isMore = false;
                }
                else {//无数据返回
                    scrollPrivateKey = false;
                    isMore = true;
                }

                pinIndex.goods_list = [...pinIndex.goods_list, ...newPinIndex.goods_list];

                this.setData({
                    pinIndex,
                    str: '- 我是有底线的 -',
                    isMore,
                    scrollPrivateKey,
                    page: page + 1,
                })
            })
            .catch((reason) => {
                //fail
                this.setData({
                    str: '- 我是有底线的 -',
                    isMore: false,
                })
            })
            .then(() => {
                //complete
                this.setData({
                    scrollKey: true,
                })
            })

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function (e) {
        const from = e.from;
        const IMGSERVICE = this.data.IMGSERVICE;
        
        if( from == 'button' ){
            //btn分享
            const index = e.target.dataset.index;
            const pinIndex = this.data.pinIndex;
            const groupbuy_id = pinIndex.goods_list[index].groupbuy_info.groupbuy_id;
            const userInfo = wx.getStorageSync('userInfo');
            
            return {
                title:'组团领好礼，有福一起享！',
                imageUrl:`${IMGSERVICE}/pin/pin.jpg`,
                path: `/pages/assemble/o_pin/o_pin?groupbuy_id=${groupbuy_id}&user_id=${userInfo.user_id}`,
            };
        }
        else{
            //右上角分享
            const options = this.data.options;
            return {
                title:'组团领好礼，有福一起享！',
                imageUrl:`${IMGSERVICE}/pin/pin.jpg`,
                path: `/pages/assemble/pin/pin?activity_id=${options.activity_id}&pageType=index`,
            };
        }

        
    },
    //页面初始化
    initData(options) {
        const userInfo = wx.getStorageSync('userInfo');
        const page = this.data.page;

        alert.loading({
            str:'加载中'
        })

        //初始化 分页 锁
        this.setData({
            page: 1,
            scrollKey: true,
            scrollPrivateKey: true,
            editKey: true,
        })

        Promise.all([
            request_01.pinIndex({
                user_id: userInfo.user_id,
                activity_id: options.activity_id,
                page,
            }),
        ])
            .then((value) => {
                //success
                const pinIndex = value[0].data.data;
                const keyGroup = wx.getStorageSync('keyGroup');
                let isMore;

                if (pinIndex.goods_list.length) {//有数据返回
                    isMore = false;
                }
                else {//无数据返回
                    isMore = true;
                }

                this.setData({
                    pinIndex,
                    str: '- 我是有底线的 -',
                    isMore,
                    keyGroup,
                    ruleShow:keyGroup.pinKey,
                    activityShow:keyGroup.pinKey ? false : true,
                })
            })
            .catch((reason) => {
                //fail
                
                //开启404页面
                // this.setData({
                //     page404: true,
                // })
            })
            .then(() => {
                //complete

                alert.loading_h()
                this.setData({
                    options,
                })
            })
    },
    //阻止冒泡
    stopPropagation(){
        return;
    },
    //重新加载
    reload() {
        const options = this.data.options;

        //关闭404页面
        this.setData({
            page404: false,
        })

        this.onLoad(options);
    },
    
    //判断是否授权和是否是车主
    isVehicleOwner(e) {
        
        const index = e.target.dataset.index;
        const type = e.target.dataset.type;
        const pinIndex = this.data.pinIndex;

        //事件源对象不符合条件的按钮。
        if( type != 'ok' )return;
        const goods_car_owner = pinIndex.goods_list[index].goods_car_owner;

        //用户已授权，用户是车主。
        //用户已授权，活动不是车主活动，商品不是车主商品。
        if (
            (wx.getStorageSync("userInfo").nickName && wx.getStorageSync("userInfo").user_type == 1) 
            || (wx.getStorageSync("userInfo").nickName && !pinIndex.activity_info.car_owner && !goods_car_owner)
        ) return;
        
        if (!wx.getStorageSync("userInfo").nickName) {//用户未授权
            this.setData({ popType: 2 })
        } 
        else if (wx.getStorageSync("userInfo").user_type == 0 ) {//用户不是车主
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

    //活动规则
    activityRuleBtn() {
        this.setData({
            ruleShow: true,
        })
    },
    //活动规则图片预览
    previewImage(){
        const pinIndex = this.data.pinIndex;
        
        wx.previewImage({
            current:pinIndex.activity_info.rule, // 当前显示图片的http链接
            urls: [pinIndex.activity_info.rule] // 需要预览的图片http链接列表
        })
    },
    //关闭活动规则
    ruleHideBtn() {
        const keyGroup = this.data.keyGroup;

        if( keyGroup.pinKey ){
            //如果第一次关闭规则弹窗
            this.setData({
                activityShow:true,
            })
        }

        keyGroup.pinKey = false;

        wx.setStorageSync('keyGroup', keyGroup)//存本地
        

        this.setData({
            keyGroup,
            ruleShow: false,
        })
    },
    //回到首页
    goIndex(){
        router.jump_nav({
            url: '/pages/index/index',
        })
    },
    //拼团商品详情
    jumpDetail(e){
        const index = e.currentTarget.dataset.index;
        const pinIndex = this.data.pinIndex;
        const prize_id = pinIndex.goods_list[index].prize_id;
        const userInfo = wx.getStorageSync('userInfo');
        const groupbuy_info = pinIndex.goods_list[index].groupbuy_info || {};
        const groupbuy_id = groupbuy_info.groupbuy_id;

        if( groupbuy_id ){
            //该商品已拼过团
            
            router.jump_nav({
                url: `/pages/assemble/o_pin/o_pin?groupbuy_id=${groupbuy_id}&user_id=${userInfo.user_id}`,
            })
        }
        else{
            //没拼过

            router.jump_nav({
                url: `/pages/assemble/pin_detail/pin_detail?prize_id=${prize_id}`,
            })
        }

        
    },
    //我的拼团
    oPinBtn() {
        const options = this.data.options;

        router.jump_nav({
            url: `/pages/assemble/o_pin_status/o_pin_status?activity_id=${options.activity_id}`,
        })
    },
    //我要拼团
    pinBtn(e) {
        const index = e.currentTarget.dataset.index;
        const pinIndex = this.data.pinIndex;
        const prize_id = pinIndex.goods_list[index].prize_id;
        const goods_car_owner = pinIndex.goods_list[index].goods_car_owner;
        
        //用户不是车主，活动是车主活动。
        //用户不是车主，商品是车主商品。
        //用户未授权。
        if (
            (wx.getStorageSync("userInfo").user_type == 0 && pinIndex.activity_info.car_owner) 
            || (wx.getStorageSync("userInfo").user_type == 0 && goods_car_owner) 
            || !wx.getStorageSync("userInfo").nickName
        ) return;
        
        router.jump_nav({
            url: `/pages/assemble/pin_detail/pin_detail?prize_id=${prize_id}`,
        })
    },
    //领取奖品
    prizeBtn(e) {
        const index = e.currentTarget.dataset.index;
        const pinIndex = this.data.pinIndex;
        const groupbuy_id = pinIndex.goods_list[index].groupbuy_info.groupbuy_id;
        const userInfo = wx.getStorageSync('userInfo');
        const order_id = pinIndex.goods_list[index].groupbuy_info.order_id;
        
        if( order_id ){
            //有order_id

            router.jump_nav({
                url: `/pages/order_detail/order_detail?order_id=${order_id}`,
            })
        }
        else{
            //无order_id

        
            request_01.getOrderId({
                user_id: userInfo.user_id,
                groupbuy_id,
            })
                .then((value) => {
                    //success
                    const msg = value.data.msg;
                    const status = value.data.status;
                    const data = value.data.data;

                    if (status == 1) {//获取order_id
                        router.jump_nav({
                            url: `/pages/order_detail/order_detail?order_id=${data.order_id}`,
                        })
                    }
                    else {//获取失败
                        alert.alert({
                            str: msg,
                        })
                    }
                })
                .catch((reason) => {
                    //fail
                    alert.alert({
                        str: JSON.stringify(reason)
                    })
                })
        }

    },
    
})