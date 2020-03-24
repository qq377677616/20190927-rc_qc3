//app.js
const auth = require('./utils/public/authorization.js')
const request_01 = require('./utils/request/request_01.js');
const api = require('./utils/request/request_03.js');
const alert = require('./utils/tool/alert.js');
const mta = require('./utils/public/mta_analysis.js')

App({
    onLaunch: function(options) {
        console.log("app.js的options", options)
            //获取parent_id和channel_id存储到本地
        let scene = decodeURIComponent(options.query.scene)
        let _shareIds = { channel_id: 0, parent_id: 0 }
        scene.split('&').forEach((item) => {
            if (item.split('=')[0] == 'channel_id') { //找到channel_id并存储
                _shareIds.channel_id = item.split('=')[1]
            }
            if (item.split('=')[0] == 'user_id') { //找到user_id并存储
                _shareIds.parent_id = item.split('=')[1]
            }
        })
        if (_shareIds.channel_id != 0) {}
        wx.setStorageSync("shareIds", _shareIds)
            //腾讯统计
        auth.statistics(500695944)

        //锁
        const keyGroup = wx.getStorageSync('keyGroup');
        wx.setStorageSync('keyGroup', {
            giftKey: true, //见面礼开关
            pinKey: keyGroup.pinKey == false ? false : true, //拼团开关
            signUpKey: keyGroup.signUpKey == false ? false : true, //报名开关
            signUpWin: keyGroup.signUpWin == false ? false : true, //报名开关
            spikeKey: keyGroup.spikeKey == false ? false : true, //秒杀开关
            shakeKey: keyGroup.shakeKey == false ? false : true, //摇一摇开关
            pinKey: keyGroup.pinKey == false ? false : true, //99元下定开关
        })
    },
    globalData: {
        userInfo: null,
        //https://game.flyh5.cn/resources/game/wechat/xw/rc_qc/assets_3.0自己oss域名
        //'https://weixinfslb.venucia.com/uploads/assets_3.0',启辰服务器域名
		IMGSERVICE: 'https://weixinfslb.venucia.com/uploads/assets_3.0', //日产小程序的 图片路径

        ASSETSURL: 'https://game.flyh5.cn/resources/game/wechat/xw/rc_qc/assets_3.0/ca', //ca 资源地址
		REQUESTURL: 'http://qqjzwx.natappfree.cc/index.php', //ca接口请求路径
		SOCKETURL:'wss://wss.vrupup.com/ca:443',// ca socket地址
		socketOpen:false,// 是否连接socket
        currentAddressItem:{},
        goodsDetail: {},
        cartDetail: {},
        Barid: '',
    }
})