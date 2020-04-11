//index.js
let mta = require('../../utils/public/mta_analysis.js')

let request_01 = require('../../utils/request/request_01.js')

let method = require('../../utils/tool/method.js')

let app = getApp() //获取应用实例
import { COMMONLogin, DEALERActivityList, USERGetUserDatabaseInfo } from '../../xw_api/index.js'
import { alert, loading, hideLoading } from '../../xw_utils/alert.js'
import { getPosition } from '../../xw_utils/tools.js'
import { jump_nav } from '../../xw_utils/route.js'

let userInfo = wx.getStorageSync('userInfo')
let shareIds = wx.getStorageSync('shareIds')
Page({
    data: {
        IMGSERVICE: app.globalData.IMGSERVICE,
        page404: false,
        options: {},
        firstShow: false,
        keyGroup: {},
        bindcarIf: false, //绑定车主
        giftIf: false, //见面礼
        signInIf: false, //签到
        listInfo: {}, //banner icon
        dotIndex: 0,
        activityList: [],
        activityPage: 1,
        activityKey: true,
        activityPrivateKey: true,
        str: '',
        isMore: false,
        tag: true,
        isPay: false, //支付弹窗
        tabList: [
            {
                id: 1,
                value: "总部活动"
            },
            {
                id: 2,
                value: "经销商活动"
            }
        ],
        tabIndex: 1,
        curCity: '',
        storeActivityList: [],
    },
    /**
     * 初始化
     * @param {*} options 
     */
    initData(options) {
        let activityPage = this.data.activityPage
        getPosition().then((res) => {
            let { location, ad_info } = res.result
            this.setData({
                curCity: ad_info.city,
            })
        }).catch((err) => {
            alert({
                title: err.message
            })
        }).then(() => {
            let curCity = this.data.curCity
            return Promise.all([
                request_01.indexBanner({
                    user_id: userInfo.user_id,
                }),
                request_01.indexActivity({
                    user_id: userInfo.user_id,
                    page: activityPage,
                }),
                request_01.signInInfo({
                    user_id: userInfo.user_id,
                }),
                DEALERActivityList({
                    data: {
                        city_name: curCity,//string	城市名字
                        dlr_code: '',//string	专营店编码
                    }
                }),
                // USERGetUserDatabaseInfo({
                //     data:{
                //         user_id: userInfo.user_id,
                //         openid: userInfo.openid,
                //     }
                // }),
                // request_01.tag({
                //   version:'3.0',
                // }),
            ])
                .then((value) => {
                    let { msg: msg0, status: status0, data: listInfo } = value[0].data
                    let { msg: msg1, status: status1, data: activityList } = value[1].data
                    let { msg: msg2, status: status2, data: signInInfo } = value[2].data
                    let { msg: msg3, status: status3, data: data3 } = value[3].data
                    // let { msg: msg4, status: status4, data: personalInfo } = value[4].data
                    activityList = activityList.list

                    if (status0 == 1 && status1 == 1 && status2 == 1 && status3 == 1) {
                        // 判断看车类型
                        activityList.forEach((item, index) => {
                            if (item.activity_type == 16) {
                                wx.setStorageSync('activity_id', item.activity_id)
                            }
                        })

                        let keyGroup = wx.getStorageSync('keyGroup');

                        let isMore;

                        if (activityList.length) { //有商品数据
                            isMore = false;
                        } else { //无商品数据
                            isMore = true;
                        }


                        this.setData({
                            listInfo,
                            activityList,
                            signInIf: !Boolean(signInInfo.is_sign == 1),
                            str: '- 我是有底线的 -',
                            isMore,
                            giftIf: !Boolean(userInfo.nickname), //是否是新用户 授权关闭见面礼 
                            keyGroup,
                            // tag:tag == 1 ? true : false,// 1-展示 0-隐藏
                            storeActivityList: data3,//经销商活动列表信息
                        })
                    } else {
                        throw new Error(
                            status0 != 1 && msg0 ||
                            status1 != 1 && msg1 ||
                            status2 != 1 && msg2 ||
                            status3 != 1 && msg3)
                    }
                }).catch((err) => {
                    alert({
                        title: err.message
                    })
                    //开启404页面
                    this.setData({
                        page404: true,
                    })
                })

        }).then(() => {
            this.setData({
                options,
            })
        })
    },
    /**
     * 重新加载
     */
    reload() {
        let options = this.data.options;

        //关闭404页面
        this.setData({
            page404: false,
        })

        this.onLoad(options);
    },
    /**
     * banner轮播切换事件
     * @param {*} e 
     */
    dotchange(e) {
        this.setData({
            dotIndex: e.detail.current
        })
    },

    /**
     * banner图跳转
     * @param {*} e 
     */
    bannerJump(e) {

        let index = e.currentTarget.dataset.index;
        let listInfo = this.data.listInfo;
        let page = listInfo.banner_list[index].page;
        if (page) { //page页面存在
            jump_nav(`/${page}`)
        } else { //page页面不存在
            return false;
        }
    },
    /**
     * 直接跳过见面礼按钮
     */
    jumpGift() {
        let keyGroup = this.data.keyGroup; //锁

        keyGroup.giftKey = false; //见面礼锁关闭

        wx.setStorageSync('keyGroup', keyGroup) //存本地

        this.setData({
            giftIf: false, //是否授权(映射字段)
            keyGroup, //存页面
        })
    },
    /**
     * 立即授权
     * @param {*} e 
     */
    authBtn(e) {
        let detail = e.detail; //btn授权信息
        let errMsg = detail.errMsg; //是否授权信息


        method.userInfoAuth(e)
            .then(() => { //用户接受授权，获取用户信息

                let keyGroup = this.data.keyGroup; //锁

                keyGroup.giftKey = false; //见面礼锁关闭

                wx.setStorageSync('keyGroup', keyGroup) //存本地


                this.setData({
                    errMsg, //存页面
                    giftIf: false, //是否授权(映射字段)
                    keyGroup, //存页面
                })

                return request_01.personalInfo({
                    user_id: userInfo.user_id,
                    openid: userInfo.openid,
                })
            })
            .then((value) => {
                let personalInfo = value.data.data;

                if (!(personalInfo.user_type == 1)) {
                    //不是车主

                    this.setData({
                        bindcarIf: true, //绑定车主打开
                    })
                }
            })
            .catch((err) => {
                alert({
                    title: err.message
                })
            })
    },
    /**
     * 暂不是车主
     */
    unbind() {
        this.setData({
            bindcarIf: false,
        })
    },
    /**
     * 立即绑定
     */
    bind() {
        this.setData({
            bindcarIf: false,
        })
        jump_nav(`/pages/o_love_car/o_love_car?pageType=back`)
    },
    /**
     * nav bar跳转
     * @param {*} e 
     */
    navJump(e) {
        let index = e.currentTarget.dataset.index;
        let listInfo = this.data.listInfo;
        let page = listInfo.icon_list[index].page;

        if (page) { //page页面存在
            jump_nav(`/${page}`)
        } else { //page页面不存在
            return false;
        }
    },
    /**
     * tab 切换
     * @param {*} e 
     */
    tabClickHandler(e) {
        let id = e.currentTarget.dataset.id
        this.setData({
            tabIndex: id
        })
    },
    /**
     * 总部活动跳转
     * @param {*} e 
     */
    activityJump(e) {
        let index = e.currentTarget.dataset.index;
        let activityList = this.data.activityList;
        let activity_id = activityList[index].activity_id;
        let screen = activityList[index].screen;
        wx.setStorageSync('screen', screen);
        let activity_type = activityList[index].activity_type;

        switch (activity_type) {
            case 1:
                //1	抽奖
                jump_nav(`/pages/prize/prize?activity_id=${activity_id}`)
                break;
            case 2:
                //2	投票
                jump_nav(`/pages/vote_page/vote_page?activity_id=${activity_id}`)
                break;
            case 3:
                //3	点亮
                jump_nav(`/pages/prize/prize?activity_id=${activity_id}`)
                break;
            case 4:
                //4	集攒
                jump_nav(`/pages/vote/vote?activity_id=${activity_id}`)
                break;
            case 5:
                //5	团购
                jump_nav(`/pages/assemble/pin/pin?activity_id=${activity_id}`)

                break;
            case 7:
                //7	报名
                jump_nav(`/pages/sign_up/sign_up?activity_id=${activity_id}`)
                break;
            case 11:
                //11	看车
                jump_nav(`/pages/vote/vote?activity_id=${activity_id}`)
                break;
            case 12:
                //12	摇红包
                jump_nav(`/pages/shake_shake/shake_shake?activity_id=${activity_id}`)
                break;
            case 13:
                //13	砍价
                jump_nav(`/pages/bargain_index/bargain_index?activity_id=${activity_id}`)
                break;
            case 14:
                //14	秒杀
                jump_nav(`/pages/spike_index/spike_index?activity_id=${activity_id}`)
                break;
            case 15:
                //15 刮刮乐
                jump_nav(`/pages/binding/owner/owner?activity_id=${activity_id}`)
                break;
            case 16:
                //16 99元支付
                jump_nav(`/pages/payment/pay_index/pay_index?activity_id=${activity_id}`)
                break;
            case 19:
                //19 ev
                jump_nav(`/pages/ev/ev_index/ev_index?activity_id=${activity_id}`)
                break;
        }
    },
    /**
     * 经销商活动跳转
     * @param {*} e 
     */
    storeActivityJump(e) {
        let out_id = e.currentTarget.dataset.outId
        let out_type = e.currentTarget.dataset.outType
        switch (out_type) {
            case 1:
                //砍价 
                jump_nav(`/activity_module/pages/yls_bargain/index/index?activity_id=${out_id}&out_type=${out_type}`)
                break
            case 2:
                //团购
                jump_nav(`/activity_module/pages/xw_assemble/index/index?out_id=${out_id}&out_type=${out_type}`)
                break
            default:
                break
        }
    },
    /**
     * 联系导购人员按钮
     * @param {*} e 
     */
    contactBtn(e) {
        let code = e.currentTarget.dataset.code
        jump_nav(`/pages/take/takeHome/takeHome?code=${code}`)
    },
    /**
     * 红包
     */
    toPay() {
        this.setData({
            isPay: false
        })
        let activity_id = wx.getStorageSync('activity_id')
        jump_nav(`/pages/payment/pay_index/pay_index?activity_id=${activity_id}`)
    },
    openPay() {
        this.setData({
            isPay: true
        })
    },
    /**
     * 签到
     */
    sureBtn() {
        this.setData({
            signInIf: false,
            // isPay:true,
        })
    },
    /**
     * 跳转到疫情页面
     */
    goyqpage() {
        jump_nav(`/pages/yqpage/yqpage`)
    },
    /**
     * 跳转ca详情
     */
    caDel() {
        jump_nav(`/pages/take/takeHome/takeHome`)
        // wx.navigateToMiniProgram({
        // 	appId: 'wx5f4c100ae6bb86d1',
        // 	path: '',
        // 	extraData: {
        // 		name: '小东',
        // 		phone: '13217484172',
        // 		area: '开福区'
        // 	},
        // 	envVersion: 'release',
        // 	success(res) {
        // 	
        // 	}
        // })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        //字体
        // wx.loadFontFace({
        //   family: 'ygyxsziti2',
        //   source: 'url("https://game.flyh5.cn/resources/game/wechat/szq/images/ygyxsziti2.0.ttf")',
        //   success: function (res) {
        //     console.log("字体", res)
        //   },
        //   fail: function (res) {
        //     console.log("字体2", res)
        //   },
        //   complete: function (res) {
        //     console.log("字体3", res)
        //   }
        // })

        //腾讯统计
        mta.Page.init()
        if (Boolean(shareIds.channel_id)) {
            mta.Event.stat("channel_sunode", {
                channel_id: shareIds.channel_id,
                page: 'home'
            })
        }


        
        loading({
            title: '登录中'
        })
        COMMONLogin(() => {
            userInfo = wx.getStorageSync('userInfo')
            shareIds = wx.getStorageSync('shareIds')
            hideLoading()
            this.initData(options)
        })
    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
        let IMGSERVICE = this.data.IMGSERVICE;
        return {
            title: '启辰星亮相发布，快来预约关注！',
            imageUrl: `${IMGSERVICE}/index/index_share.jpg`,
            path: '/pages/index/index'
        };
    },
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        let activityPage = this.data.activityPage;
        let activityKey = this.data.activityKey;
        let activityPrivateKey = this.data.activityPrivateKey;

        //滚动加载中不允许操作
        if (!activityKey || !activityPrivateKey) return;

        this.setData({
            activityKey: false,
            str: '加载中...',
            isMore: true,
        })

        request_01.indexActivity({
            page: activityPage + 1,
            user_id: userInfo.user_id,
        })
            .then((value) => {
                //success
                let data = value.data.data.list;
                let activityList = this.data.activityList;
                let isMore, activityPrivateKey;

                if (data.length) { //有数据返回
                    isMore = false;
                    activityPrivateKey = true;

                } else { //无数据返回

                    isMore = true;
                    activityPrivateKey = false;
                }
                this.setData({
                    activityList: [...activityList, ...data],
                    activityPage: activityPage + 1,
                    str: '- 我是有底线的 -',
                    isMore,
                    activityPrivateKey,
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
                    activityKey: true,
                })
            })
    },
})