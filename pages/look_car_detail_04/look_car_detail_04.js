// pages/look_car_detail_02/look_car_detail_02.js
const mta = require('../../utils/public/mta_analysis.js')

const tool = require('../../utils/tool/tool.js')

const request_01 = require('../../utils/request/request_01.js');

const method = require('../../utils/tool/method.js');

const router = require('../../utils/tool/router.js');

const authorization = require('../../utils/tool/authorization.js');

const alert = require('../../utils/tool/alert.js');

const api = require('../../utils/request/request_03.js');

const app = getApp(); //获取应用实例
Page({

    /**
     * 页面的初始数据
     */
    data: {
        IMGSERVICE: app.globalData.IMGSERVICE,
        options: {},
        navIndex: 0,
        lookCarDetail: {},
        isShowForm: false,
        formsType: 2,
        vehicle: {},
        car_type_list_index: 0,
        car_details: [],
        scrollTop: 0,
        isSwitchIng: false,
        isPlayVedio: false,
        videoUrl: '',
        iconList: [
            { img: app.globalData.IMGSERVICE + '/car_detail/icon_01.png', url: '/pages/bargain_index/bargain_index?activity_id=47' },
            { img: app.globalData.IMGSERVICE + '/car_detail/icon_02.png', url: '/pages/assemble/pin/pin?activity_id=44' },
            { img: app.globalData.IMGSERVICE + '/car_detail/icon_03s.png', url: '/pages/index/index' }
        ],
        carcol: [ //t60颜色图
            { img: 't60_col1.png', txt: '旭日橙/珠光白双色' },
            { img: 't60_col2.png', txt: '烈焰红/曜石黑双色' },
            { img: 't60_col3.png', txt: '珠光白/曜石黑双色' },
            { img: 't60_col4.png', txt: '烈焰红' },
            { img: 't60_col5.png', txt: '曜石黑' },
            { img: 't60_col6.png', txt: '钨钢灰' },
            { img: 't60_col7.png', txt: '旭日橙' },
            { img: 't60_col8.png', txt: '晴空蓝' },
            { img: 't60_col9.png', txt: '珠光白' }
        ],
        t70carcol: [ //t70颜色图
            { img: 't70bg6.png', txt: '旭日橙' },
            { img: 't70bg7.png', txt: '朝霞红' },
            { img: 't70bg8.png', txt: '珠光白' },
            { img: 't70bg9.png', txt: '翡丽灰' },
            { img: 't70bg10.png', txt: '曜石黑' }
        ],
        d60carcol: [ //t70颜色图
            { img: 'd60col1.png', txt: '晴空蓝' },
            { img: 'd60col2.png', txt: '映日棕' },
            { img: 'd60col3.png', txt: '辰辉银' },
            { img: 'd60col4.png', txt: '赤兔红' },
            { img: 'd60col5.png', txt: '珠光白' },
            { img: 'd60col6.png', txt: '曜石黑' }
        ],
        swiper1: 0, //控制第一个swiper
        swiper2: 0, //控制第二个swiper
        swiper3: 0, //控制第三个swiper
        swiper4: 0, //控制t70第1个swiper
        swiper5: 0, //控制t70第2个swiper
        swiper6: 0, //控制t70第3个swiper
        swiper7: 0, //控制t70第4个swiper
        swiper8: 0, //控制t70第5个swiper
        swiper9: 0, //控制d60第1个swiper
        swiper10: 0, //控制d60第2个swiper
        swiper11: 0, //控制d60第3个swiper
        swiper12: 0,
        rogincol: 0, //初始选择的颜色
        carid: '',
        swiper1_txt: ['共享全球供应商体系', '日产HR16发动机', '日产XTRONIC CVT无级变速器', 'Zone Body区域组合+1200Mpa高强钢车身', '加强版6安全气囊防护系统', 'ASCD定速巡航', 'HSA上坡起步辅助系统', '博世9.1版ESP车身电子稳定系统', '日产同平台开发生产'], //部件名称
		swiper2_txt: ['“星耀式” LED光导尾灯', '“星航” 投射式LED前大灯', '18英寸切削铝合金轮辋', '悬浮式车顶', '全景天窗', '科技范高质感内饰', 'Multi-Layer人体工学座椅', '“星空点阵式” 启辰家族前格栅'], //部件名称
        swiper3_txt: ['AEB自主紧急制动系统', 'BSW变道盲区预警系统', 'LDW车道偏离预警系统', '3D AVM全景式监控影像系统', '多场景远程控制', '远程控制车辆', '智能语音助手', '10+8英寸大尺寸智能双屏交互', '智能全时导航', 'DVR智能行车记录仪'], //部件名称
        t70_swiper1_txt: ['LED光扩散粒子后尾灯', '18英寸铝合金双色切割工艺轮辋', '钻石绗缝皮质座椅', '丰富的收纳空间', '10.1英寸高清多点触控屏', '炮筒式高清晰组合仪表盘', '多功能D型真皮方向盘(带控制键)', '投射式鹰眼前大灯'], //部件名称
        t70_swiper2_txt: ['数字化车联&互联网信息娱乐', '车辆智能安防体系', '智慧语音助手', '手机远程控制', '异常诊断手机提醒', '全时在线导航'], //部件名称
        t70_swiper3_txt: ['流媒体后视镜', '3D全景式监控影像系统', '后视镜自动折叠', 'TPMS胎压监测系统', '智能电动尾门'], //部件名称
		t70_swiper4_txt: ['先进的XTRONIC CVT无级变速器', '多连杆独立后悬挂', 'ESP车身电子稳定系统', '日产全球战略引擎MR20发动机', '先进的XTRONIC CVT无级变速器', '多连杆独立后悬挂', 'ESP车身电子稳定系统', '日产全球战略引擎MR20发动机'], //部件名称
		t70_swiper5_txt: ['专业制造工艺', 'ABS+EBD+BA三位一体智能刹车辅助系统', 'ATC主动循迹控制系统', 'ESS紧急制动提醒系统', '雷诺-日产-三菱联盟品质标准'], //部件名称
        d60_swiper1_txt: ['车辆智能安防系统', '在线娱乐系统', '智能人机语音交互', '手机远程控制', '车载W i f i热点', '人性化贴心全时导航'], //部件名称
        d60_swiper2_txt: ['宽敞大尺寸天窗', 'Multi-Layer人体工学座椅', '663mm后排膝部空间', '宽敞大尺寸天窗', 'Multi-Layer人体工学座椅', '663mm后排膝部空间'], //部件名称
        d60_swiper3_txt: ['锐利的鹰眼LED前大灯', '星空点阵式前格栅', '红镰式光导LED组合尾灯', '驾驶员导向飞航式驾驶舱设计', '人体工学D型多功能方向盘', '高品质透气性菱格皮质座椅', '4756mm优越车身长度'], //部件名称
        d60_swiper4_txt: ['XTRONIC CVT无级变速器', '5.6L/100km低油耗', '带横向稳定杆的扭力梁式悬挂系统', 'Zone Body高性能区域车身结构', 'ABS+EBD+BA三位一体智能刹车辅助系统', '博世9.1版ESP车身电子稳定系统', 'TPMS智能胎压监测系统', 'EPKB电子驻车系统', 'HR16发动机'], //部件名称
        swp1_img: [ //t60第一个swiper资源
            { img: 'Tb60_sw1.png', type: 1 },
            { img: 'Tb60_sw2.png', type: 2, vUrl: "Tb60_sw2.mp4"},
            { img: 'Tb60_sw3.png', type: 2, vUrl: "Tb60_sw3.mp4"},
			{ img: 'Tb60_sw4.png', type: 2, vUrl: "Tb60_sw5.mp4"},
            { img: 'Tb60_sw5.png', type: 1},
            { img: 'Tb60_sw6.png', type: 1 },
            { img: 'Tb60_sw7.png', type: 2, vUrl: "Tb60_sw7.mp4"},
            { img: 'Tb60_sw8.png', type: 2, vUrl: "Tb60_sw8.mp4"},
            { img: 'Tb60_sw9.png', type: 1}
        ],
        swp3_img: [ //t60第三个swiper资源
            { img: 'Tb60_sw3_1.png', type: 2, vUrl: "Tb60_sw3_1.mp4"},
            { img: 'Tb60_sw3_2.png', type: 2, vUrl: "Tb60_sw3_2.mp4"},
            { img: 'Tb60_sw3_3.png', type: 2, vUrl: "Tb60_sw3_3.mp4"},
            { img: 'Tb60_sw3_4.png', type: 2, vUrl: "Tb60_sw3_4.mp4"},
            { img: 'Tb60_sw3_5.png', type: 2, vUrl: "Tb60_sw3_5.mp4"},
            { img: 'Tb60_sw3_6.png', type: 2, vUrl: "Tb60_sw3_6.mp4"},
            { img: 'Tb60_sw3_7.png', type: 2, vUrl: "Tb60_sw3_7.mp4"},
            { img: 'Tb60_sw3_8.png', type: 2, vUrl: "Tb60_sw3_8.mp4"},
            { img: 'Tb60_sw3_9.png', type: 2, vUrl: "Tb60_sw3_9.mp4"},
            { img: 'Tb60_sw3_10.png', type: 2, vUrl: "Tb60_sw3_10.mp4"}
        ],
        t70_swiper2_img: [ // t70第二个swiper
            { img: 'tb70_2_1.png', type: 2, vUrl: "tb70_2_1.mp4" },
            { img: 'tb70_2_2.png', type: 2, vUrl: "tb70_2_2.mp4" },
            { img: 'tb70_2_3.png', type: 2, vUrl: "tb70_2_3.mp4" },
            { img: 'tb70_2_4.png', type: 2, vUrl: "tb70_2_4.mp4" },
            { img: 'tb70_2_5.png', type: 2, vUrl: "tb70_2_5.mp4" },
            { img: 'tb70_2_6.png', type: 2, vUrl: "tb70_2_6.mp4" }
        ],
        isplay: false, // 是否在播放视频
        vbtn: true, // 是否显示 播放按钮
        popstu: 1, // 留资弹窗状态
        curvio: null, // 当前创建的video
    },



    /** 
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        console.log(options);
        this.setData({ carid: options.id })
        mta.Page.init() //腾讯统计
        mta.Event.stat("look_car_other", {})
        this.data.id = options.id
        if (wx.getStorageSync("shareIds").channel_id) mta.Event.stat("channel_sunode", { channelid: wx.getStorageSync("shareIds").channel_id })
        request_01.login(() => {
                this.initData(options)
            })
            //是否显示最新icon
        this.setData({ isShowIcon: 1 })
        api.isShowIcon().then(res => {
            console.log("显示icon返回", res)
            this.setData({ isShowIcon: res.data.data })
            console.log("isShowIcon", this.data.isShowIcon)
        })
    },
    //两个icon动画
    aimateInit() {
        if (this.data.isAnimate) return
        clearInterval(this.data.animateInit)
        this.data.animateInit = setInterval(() => {
            this.setData({ isAnimate: true })
            setTimeout(res => {
                this.setData({ isAnimate: false });
            }, 800)
        }, 3000)
    },
    onShow() {
        this.aimateInit()
    },
    onHide() {
        clearInterval(this.data.animateInit)
    },
    onUnload() {
        clearInterval(this.data.animateInit)
    },
    //选择车款
    bindRegionChange(e) {
        if (this.data.car_type_list_index == e.detail.value) return
        this.setData({ isSwitchIng: true })
        tool.loading("")
        setTimeout(() => {
            tool.loading_h()
            this.data.car_type_list_index = e.detail.value
            tool.alert(`当前级别：${this.data.lookCarDetail.car_details[this.data.car_type_list_index].name}`)
            this.car_details()
        }, 800)
    },
    //当前车款配置
    car_details() {
        this.setData({
                car_details: this.data.lookCarDetail.car_details[this.data.car_type_list_index].values,
                isIconShow: true,
                isSwitchIng: false
            })
            // tool.loading_h()
    },
    //页面初始化
    initData(options) {
        // tool.loading("加载中")
        Promise.all([
                request_01.lookCarDetail({
                    user_id: wx.getStorageSync('userInfo').user_id,
                    id: options.id,
                })
            ])
            .then((value) => {
                //success
                const lookCarDetail = value[0].data.data;

                this.setData({
                    lookCarDetail,
                    car_type_list: lookCarDetail.car_type_list
                })
                wx.setNavigationBarTitle({
                    title: this.data.lookCarDetail.car_name
                })
                this.car_details()
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
    //详情图片加载完成
    bindload() {
        // tool.loading_h()
    },
    //导航列表
    navList(e) {
        const index = e.currentTarget.dataset.index;
        const navIndex = this.data.navIndex;

        if (navIndex == index) return;

        this.setData({
            navIndex: index,
        })
        this.setData({ scrollTop: 0 })
    },
    //立即下定
    downPayment() {
        const lookCarDetail = this.data.lookCarDetail;
        console.log("lookCarDetail", lookCarDetail)
        this.setData({
            vehicle: {
                img: lookCarDetail.car_img,
                title: lookCarDetail.car_name,
                price: lookCarDetail.car_prize,
            },
            isShowForm: true,
        })
    },
    //留资弹窗打开、关闭
    isShowForm() {
        this.setData({
            isShowForm: false,
        })
    },
    //提交
    submit(e) {
        const detail = e.detail;
        const userInfo = wx.getStorageSync('userInfo');
        const lookCarDetail = this.data.lookCarDetail;

        alert.loading({
            str: '提交中'
        })
        request_01.lookCarSubmit({
                user_id: userInfo.user_id, //用户ID
                look_car_id: lookCarDetail.look_car_id, //看车ID
                name: detail.name, //留资姓名
                mobile: detail.phone, //留资电话
                v_code: detail.code || '', //短信验证码
                dl_code: detail.storeCode, //专营店编码
                car_type: '', //车型 可不填
            }).then((value) => {
                //success
                const status = value.data.status;
                if (status == 1) {
                    alert.loading_h()
                        // mta.Event.stat("booking_car_other", { name: detail.name, phone: detail.phone, city: detail.region.join('--') })
                        { userinfo: `${detail.name} ${detail.phone} ${detail.region.join('--')}` }
                    alert.confirm({ title: "预约成功", content: `您已成功预约的试驾，稍后将有工作人员联系您，请保持电话畅通。`, confirms: "好的,#0C5AC0", cancels: false }).then(res => {
                        this.setData({
                            isShowForm: false,
                        })
                    })
                } else {
                    alert.alert({
                        str: value.data.msg,
                    })
                }
            })
            .catch(() => {
                //fail
                alert.loading_h()

            })
            .then(() => {
                //complete

            })
    },
    //页面跳转
    jump(e) {
        tool.jump_nav(e.currentTarget.dataset.url)
    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {
		let id = this.data.id;
		let txt = '';
		switch (id) {
			case '11':
				txt = '启辰星，A+级SUV头等舱，“混元”美学的秘密，等你来探索！';
				break;
			case '6':
				txt = '启辰T60，高品质智趣SUV，星级品质，焕新登场！';
				break;
			case '3':
				txt = '启辰D60，高品质智联家轿，智联生活，即刻开启！';
				break;
			case '9':
				txt = '全新启辰T90，高品质跨界SUV，跨有界，悦无限！';
				break;
			case '7':
				txt = '启辰T70，高品质智联SUV，品质来袭！';
				break;
			case '5':
				txt = '启辰T70，高品质智联SUV，品质来袭！';
				break;
			case '10':
				txt = '启辰e30，我的第一台纯电精品车，智在灵活，趣动精彩！';
				break;
			case '13':
				txt = '启辰T60EV，智领合资纯电SUV，智无忧，趣更远！';
				break;
		}
		return {
            title: `${txt}`,
            path: `/pages/look_car_detail_02/look_car_detail_02?id=${this.data.id}`
        }
    },
    moreBtn() {
        tool.jump_red("/pages/index/index")
    },
    swiperchange(e) { // 滑动切换 swiper
        // console.log(e);
        let type = e.currentTarget.dataset.type;
        this.setData({
            vbtn: true,
            swiper1: type == 1 ? e.detail.current : this.data.swiper1,
            swiper2: type == 2 ? e.detail.current : this.data.swiper2,
            swiper3: type == 3 ? e.detail.current : this.data.swiper3,
            swiper4: type == 4 ? e.detail.current : this.data.swiper4,
            swiper5: type == 5 ? e.detail.current : this.data.swiper5,
            swiper6: type == 6 ? e.detail.current : this.data.swiper6,
            swiper7: type == 7 ? e.detail.current : this.data.swiper7,
            swiper8: type == 8 ? e.detail.current : this.data.swiper8,
            swiper9: type == 9 ? e.detail.current : this.data.swiper9,
            swiper10: type == 10 ? e.detail.current : this.data.swiper10,
            swiper11: type == 11 ? e.detail.current : this.data.swiper11,
            swiper12: type == 12 ? e.detail.current : this.data.swiper12,
        })
		console.log(this.data.swiper7);
        console.log(this.data.swiper1, this.data.swiper2);
    },
    changecol(e) { // 选择车子颜色
        let index = e.currentTarget.dataset.index;
        this.setData({ rogincol: index })
        console.log(index)
    },
    // 播放视频
    setplay(e) {
		console.log(e.currentTarget.dataset.vurl)
		if (e.currentTarget.dataset.vurl.indexOf("mp4")==-1)return;
        this.setData({
            isplay: true,
        });
        setTimeout(() => {
            this.setData({
                videoUrl: e.currentTarget.dataset.vurl
            })
            this.isOpenVideo()
        }, 1000);
        console.log('2', this.data.isplay);
    },
    // 视频播放弹窗开关
    isOpenVideo() {
        this.setData({
            isPlayVedio: !this.data.isPlayVedio,
            isplay: false,
        })
    },
    //播放
    videoPlay() {
        console.log('开始播放')
            // var videoplay = wx.createVideoContext()
        this.data.curvio.play()
    },
    // 暂停播放
    videoPause() {
        console.log('暂停播放')
            // var videoplay = wx.createVideoContext()
        this.data.curvio.pause()
    },
    // 显示播放按钮
    showplay() {
        if (this.data.vbtn) return;
        this.setData({ vbtn: true })
        setTimeout(() => {
            this.setData({ vbtn: false })
        }, 3000)
    },
    changetab(e) { // 点击左右切换轮播
        let id = e.currentTarget.dataset.id;
        let type = e.currentTarget.dataset.type;
        let len = e.currentTarget.dataset.length;
        console.log(id, type);
        this.setData({
            swiper1: id == 1 && type == 1 ? this.data.swiper1 == 0 ? len : --this.data.swiper1 : id == 1 && type == 2 ? this.data.swiper1 == len ? 0 : ++this.data.swiper1 : this.data.swiper1,
            swiper2: id == 2 && type == 1 ? this.data.swiper2 == 0 ? len : --this.data.swiper2 : id == 2 && type == 2 ? this.data.swiper2 == len ? 0 : ++this.data.swiper2 : this.data.swiper2,
            swiper3: id == 3 && type == 1 ? this.data.swiper3 == 0 ? len : --this.data.swiper3 : id == 3 && type == 2 ? this.data.swiper3 == len ? 0 : ++this.data.swiper3 : this.data.swiper3,
            swiper4: id == 4 && type == 1 ? this.data.swiper4 == 0 ? len : --this.data.swiper4 : id == 4 && type == 2 ? this.data.swiper4 == len ? 0 : ++this.data.swiper4 : this.data.swiper4,
            swiper5: id == 5 && type == 1 ? this.data.swiper5 == 0 ? len : --this.data.swiper5 : id == 5 && type == 2 ? this.data.swiper5 == len ? 0 : ++this.data.swiper5 : this.data.swiper5,
            swiper6: id == 6 && type == 1 ? this.data.swiper6 == 0 ? len : --this.data.swiper6 : id == 6 && type == 2 ? this.data.swiper6 == len ? 0 : ++this.data.swiper6 : this.data.swiper6,
            swiper7: id == 7 && type == 1 ? this.data.swiper7 == 0 ? len : --this.data.swiper7 : id == 7 && type == 2 ? this.data.swiper7 == len ? 0 : ++this.data.swiper7 : this.data.swiper7,
            swiper8: id == 8 && type == 1 ? this.data.swiper8 == 0 ? len : --this.data.swiper8 : id == 8 && type == 2 ? this.data.swiper8 == len ? 0 : ++this.data.swiper8 : this.data.swiper8,
            swiper9: id == 9 && type == 1 ? this.data.swiper9 == 0 ? len : --this.data.swiper9 : id == 9 && type == 2 ? this.data.swiper9 == len ? 0 : ++this.data.swiper9 : this.data.swiper9,
            swiper10: id == 10 && type == 1 ? this.data.swiper10 == 0 ? len : --this.data.swiper10 : id == 10 && type == 2 ? this.data.swiper10 == len ? 0 : ++this.data.swiper10 : this.data.swiper10,
            swiper11: id == 11 && type == 1 ? this.data.swiper11 == 0 ? len : --this.data.swiper11 : id == 11 && type == 2 ? this.data.swiper11 == len ? 0 : ++this.data.swiper11 : this.data.swiper11,
            swiper12: id == 12 && type == 1 ? this.data.swiper12 == 0 ? len : --this.data.swiper12 : id == 12 && type == 2 ? this.data.swiper12 == len ? 0 : ++this.data.swiper12 : this.data.swiper12,
        })
    },
    closelz() {// 关闭填写
        this.setData({ popstu: 2 })
    },
	tabSwiper(e){// 点击精准切换
		let type = e.currentTarget.dataset.type;
		let tab = e.currentTarget.dataset.tab;
		let len = e.currentTarget.dataset.len-1;
		console.log(type,tab,len);
		this.setData({
			swiper1: type == 1 ? (tab == -1 ? len : tab) : this.data.swiper1,
			swiper2: type == 2 ? (tab == -1 ? len : tab) : this.data.swiper2,
			swiper3: type == 3 ? (tab == -1 ? len : tab) : this.data.swiper3,
			swiper4: type == 4 ? (tab == -1 ? len : tab) : this.data.swiper4,
			swiper5: type == 5 ? (tab == -1 ? len : tab) : this.data.swiper5,
			swiper6: type == 6 ? (tab == -1 ? len : tab) : this.data.swiper6,
			swiper7: type == 7 ? (tab == -1 ? len : tab) : this.data.swiper7,
			swiper8: type == 8 ? (tab == -1 ? len : tab) : this.data.swiper8,
			swiper9: type == 9 ? (tab == -1 ? len : tab) : this.data.swiper9,
			swiper10: type == 10 ? (tab == -1 ? len : tab) : this.data.swiper10,
			swiper11: type == 11 ? (tab == -1 ? len : tab) : this.data.swiper11,
			swiper12: type == 12 ? (tab == -1 ? len : tab) : this.data.swiper12,
		})
	}
})