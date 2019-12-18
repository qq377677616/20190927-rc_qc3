const request_04 = require('../../utils/request/request_04.js');
const request_01 = require('../../utils/request/request_01.js');
const route = require('../../utils/tool/router.js');
const alert = require('../../utils/tool/alert.js');
const WxParse = require('../../utils/wxParse/wxParse.js');

import tool from '../../utils/tool/tool.js';
import api from '../../utils/request/request_03.js'
const app = getApp();//获取应用实例

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		IMGSERVICE: app.globalData.IMGSERVICE,
		istrue: true,
		shopdelData: {},
		barType: 0,
		barPop: false,
		shopData: {},//传递参数的对象
		proInfo: [],
		noshuoming:false,//有没有产品说明
		noImg:false,
		textArr:["到店领取","邮寄到家","线上领取"],
		getWay:0,
		is_jh:false,
		isCodeShow: false,
		code:'',
		loadingText: '卡券领取中',
		isShowLoading:false,
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		// b_type:1继续砍价2：砍价完成未领取 点击免费拿 4：已领取 5：抢完了 6 已经抢过了
		
		console.log('页面参数', options);
		this.setData({ barType: options.b_type, is_jh: options.is_jh})
		//   if(options.shopobj){
		this.setData({ activity_id: wx.getStorageSync("activity_id"),shopData: options.shopobj ? options.shopobj : '' });
		//   }
		request_01.login(() => {
			this.shopDel(options.prize_id)
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
	// onShareAppMessage: function () {

	// },
	shopDel(prize_id = '') { //获取商品详情信息

		let dat = {
			openid: wx.getStorageSync('userInfo').openid,
			prize_id: prize_id,
			activity_id: this.data.activity_id
		}
		request_04.shopDel(dat).then((res) => {
			console.log(res.data)
			if (res.data.status == 0) {
				// for (let i = 0; i < res.data.data.intro.length; i++) {
				// 	res.data.data.intro[i].value = res.data.data.intro[i].value.replace(/&nbsp;/g, " ");
				// }
				this.setData({ 
					shopdelData: res.data.data, 
					getWay:res.data.data.type,
					noImg: res.data.data.goods_detail_img=="",
				})
				WxParse.wxParse('product_explain', 'html', res.data.data.intro, this); 
			}
		}).catch((reason) => {
			console.log(reason)
		})
	},
	freeGet(e) {//点击我要免费拿
		// this.setData({ barPop: true });
		if(this.data.is_jh==0){
			wx.showToast({
				icon: "none",
				title: '非常抱歉 您已达到该活动礼品领取上限 感谢您的参与'
			})
			return;
		}
		let type = e.currentTarget.dataset.type;
		let shopobj = {};
		let shopdelData = this.data.shopdelData;
		shopobj.shopName = shopdelData.title;
		shopobj.shopImg = shopdelData.thumb;
		shopobj.shopPrice = shopdelData.price;
		shopobj.type = shopdelData.type;
		shopobj.shopid = shopdelData.id;
		route.jump_nav({ url: '/pages/cut_cart/cut_cart?shopobj=' + JSON.stringify(shopobj) });
	},
	closePop() {//关闭弹窗统一处理
		this.setData({ barPop: false })
	},
	startBar(e) {//开始砍价 第一次砍价
		// this.setData({ barPop: false });
	},
	getworld() {//领取奖品 
		const shopdelData = this.data.shopdelData;

		if( shopdelData.order_id ){
			route.jump_nav({ url: "/pages/order_detail/order_detail?order_id=" + shopdelData.order_id });
		}
		else{
			request_04.getWolrd({
				openid: wx.getStorageSync("userInfo").openid,
				kj_id: JSON.parse(this.data.shopData).id,
				activity_id: this.data.activity_id
			}).then((value) => {
				const msg = value.data.msg;
				const status = value.data.status;
				const data = value.data.data;
				const type = data.type;// 商品类型 1-微信卡券 2-快递 3-虚拟卡券
				const xuni_code = data.xuni_code;
				const card_info = data.card_info;
				const order_goods_id = data.order_goods_id;
				alert.loading_h()


				if (status == 1) {

					switch (type) {
						case 1://微信卡券
							this.addCard(card_info, order_goods_id)
							break;
						case 2://快递
							alert.alert({
								str: '领取成功',
							})
							break;
						case 3://虚拟卡券
							this.setData({
								isCodeShow: true,
								code: xuni_code,
							})
							break;
					}
				}
				else {//获取失败
					alert.alert({
						str: msg,
					})
				}


				route.jump_nav({ url: "/pages/order_detail/order_detail?order_id="+value.data.data.order_id});
			}).catch((reason)=>{
				//fail
				alert.loading_h()
				alert.alert({
					str: JSON.stringify(reason)
				})
			})
		}
		
	},
	contBar() {
		if (this.data.is_jh==0) {
			wx.showToast({
				icon: "none",
				title: '非常抱歉 您已达到该活动礼品领取上限 感谢您的参与'
			})
			return;
		}
		route.jump_nav({ url: '/pages/bargain_state/bargain_state?shopobj=' + this.data.shopData });
	},
	//领取卡券
    addCard(cardList, order_goods_id) {
        this.isShowLoading()
        tool.addCard(cardList).then(res => {
            console.log("卡券返回", res)
            if (res.errMsg == "addCard:ok") {
                
                console.log("卡券领取成功",res)
                let _card_code = ''
                
                for (let i = 0; i < res.cardList.length; i++) {
                    _card_code += ((i == 0 ? '' : ',') + res.cardList[i].code)
                }
                this.cardCheck(_card_code, order_goods_id)
            } else {
                this.isShowLoading()
                tool.alert("卡券领取失败")
            }
        }).catch(err => {
            console.log("err", err)
            this.isShowLoading()
            tool.alert("卡券领取失败")
        })
    },
    //卡券核销上报
    cardCheck(card_code, order_goods_id) {
        let _data = {
            user_id: wx.getStorageSync("userInfo").user_id,
            order_goods_id,
            card_code: card_code
        }
        api.orderCheck(_data).then(res => {
            console.log("卡券核销上报返回", res)
            if (res.statusCode == 200) {
                this.isShowLoading()
                tool.alert("卡券领取成功，请到我的卡包查看卡券使用详情")
                // let _orderDetail = this.data.orderDetail
                // _orderDetail.order_goods[this.data.curIndex].is_receive = 1
                // console.log("_orderDetail", _orderDetail)
                // this.setData({ orderDetail: _orderDetail })
            }
        })
    },
    //自定义loading框
    isShowLoading() {
        this.setData({
            isShowLoading: !this.data.isShowLoading
        })
    },
	//关闭虚拟兑换窗口
    closeCode() {
        this.setData({
            isCodeShow: false,
        })
    },
    //复制兑换码
    setClipboar() {
        let code = this.data.code;
        wx.setClipboardData({
            //准备复制的数据
            data: code,
        });
    },
})