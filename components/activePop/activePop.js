// components/activePop/activePop.js
const app = getApp();//获取应用实例
const route = require('../../utils/tool/router.js');
Component({
	/**
	 * 组件的属性列表
	 */
	properties: {
		popType: {
			type: String,
			value: 0
		},
		text: {
			type: String,
			value: '暂时不能参与该活动'
		}
	},

	/**
	 * 组件的初始数据
	 */
	data: {
		IMGSERVICE: app.globalData.IMGSERVICE,
		popShow: true
	},

	/**
	 * 组件的方法列表
	 */
	methods: {
		otherAct() {
			let pages = getCurrentPages();
			let len = pages.length;

			this.closePop()

			if( len > 1 ){
				route.jump_back()
			}
			else{
				route.jump_nav({
					url:`/pages/activity_list/activity_list`
				})
			}
		},
		closePop() {
			//this.setData({ popShow:false})
			this.triggerEvent("close")
		},
		AuthBannerJump(e) {
			if (!e.detail.userInfo) return
			// let obj = {};
			// obj.headimg = e.detail.userInfo.avatarUrl;
			// obj.nickname = e.detail.userInfo.nickName;
			this.setData({ popShow: false })
			this.triggerEvent('getParme', e.detail);
		},
		bindCarer() {
			this.closePop()
			route.jump_nav({ url: '/pages/o_love_car/o_love_car?pageType=back' });
		},
		backpage(){
			route.jump_back();
		}
	}
})
