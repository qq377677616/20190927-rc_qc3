const _request = require('./_request.js');
import request_01 from "./request_01.js"
const SERVICE = request_01.SERVICE;

const authorization = require('../tool/authorization.js');

const alert = require('../tool/alert.js');


// 文章模块
//文章评论列表
const reply_list = (data) => {
	let url = `${SERVICE}/api3/article/article_reply_list`
	return new Promise((resolve, reject) => {
		_request.request({
			url,
			data
		})
			.then(res => {
				resolve(res)
			})
			.catch((reason) => {
				reject(reason)
			})
	})
}

//文章评论点赞/取消点赞
const addArtlike = (data) => {
	let url = `${SERVICE}/api3/article/article_reply_favorite`
	return new Promise((resolve, reject) => {
		_request.request({
			url,
			data
		})
			.then(res => {
				resolve(res)
			})
			.catch((reason) => {
				reject(reason)
			})
	})
}

//砍价模块  砍价商品列表
const bargain_shop_list = (data) => {
	let url = `${SERVICE}/api3/bargain/kj_goods`
	return new Promise((resolve, reject) => {
		_request.request({
			url,
			data
		})
			.then(res => {
				resolve(res)
			})
			.catch((reason) => {
				reject(reason)
			})
	})
}

//砍价模块 砍价记录
const bargainList = (data) => {
	let url = `${SERVICE}/api3/bargain/kj_jl`
	return new Promise((resolve, reject) => {
		_request.request({
			url,
			data
		})
			.then(res => {
				resolve(res)
			})
			.catch((reason) => {
				reject(reason)
			})
	})
}
// 查询剩余砍价次数
const restBarnum = (data) => {
	let url = `${SERVICE}/api3/bargain/sy_kj_num`
	return new Promise((resolve, reject) => {
		_request.request({
			url,
			data
		})
			.then(res => {
				resolve(res)
			})
			.catch((reason) => {
				reject(reason)
			})
	})
}
// 点击确认砍价商品
const comfirBar = (data) => {
	let url = `${SERVICE}/api3/bargain/check_prize`
	return new Promise((resolve, reject) => {
		_request.request({
			url,
			data
		})
			.then(res => {
				resolve(res)
			})
			.catch((reason) => {
				reject(reason)
			})
	})
}
// 多少人免费拿到和砍价记录
const freeList = (data) => {
	let url = `${SERVICE}/api3/bargain/kj_index`
	return new Promise((resolve, reject) => {
		_request.request({
			url,
			data
		})
			.then(res => {
				resolve(res)
			})
			.catch((reason) => {
				reject(reason)
			})
	})
}
//商品详情页
const shopDel = (data) => {
	let url = `${SERVICE}/api3/bargain/prize_index`
	return new Promise((resolve, reject) => {
		_request.request({
			url,
			data
		})
			.then(res => {
				resolve(res)
			})
			.catch((reason) => {
				reject(reason)
			})
	})
}
// 好友帮忙砍价
const friendHelp = (data) => {
	let url = `${SERVICE}/api3/bargain/click_kj`
	return new Promise((resolve, reject) => {
		_request.request({
			url,
			data
		})
			.then(res => {
				resolve(res)
			})
			.catch((reason) => {
				reject(reason)
			})
	})
}
//砍价模块  轮播  和跑马灯
const getBanarlist = (data) => {
	let url = `${SERVICE}/api3/bargain/top`
	return new Promise((resolve, reject) => {
		_request.request({
			url,
			data
		})
			.then(res => {
				resolve(res)
			})
			.catch((reason) => {
				reject(reason)
			})
	})
}
// 领取奖品
const getWolrd = (data) => {
	let url = `${SERVICE}/api3/bargain/lq_prize`
	return new Promise((resolve, reject) => {
		_request.request({
			url,
			data
		})
			.then(res => {
				resolve(res)
			})
			.catch((reason) => {
				reject(reason)
			})
	})
}
// 获取门店列表
const getStors = (data) => {
	let url = `${SERVICE}/api3/dealer/dealer_list`
	return new Promise((resolve, reject) => {
		_request.request({
			url,
			data
		})
			.then(res => {
				resolve(res)
			})
			.catch((reason) => {
				reject(reason)
			})
	})
}
// 获取车主信息
const getcarInfo = (data) => {
	let url = `${SERVICE}/api3/user/my_info`
	return new Promise((resolve, reject) => {
		_request.request({
			url,
			data
		})
			.then(res => {
				resolve(res)
			})
			.catch((reason) => {
				reject(reason)
			})
	})
}
// 车主解绑
const removeCarinfo = (data) => {
	// let url = `${SERVICE}/api3/user/car_owner_remove`
	let url = `${SERVICE}/api3/member/un_bind_member`
	return new Promise((resolve, reject) => {
		_request.request({
			url,
			data
		})
			.then(res => {
				resolve(res)
			})
			.catch((reason) => {
				reject(reason)
			})
	})
}
//获取默认地址
const getdefault = (data) => {
	let url = `${SERVICE}/api3/address/default_address`
	return new Promise((resolve, reject) => {
		_request.request({
			url,
			data:{...data, openid:wx.getStorageSync('userInfo').openid}
		})
			.then(res => {
				resolve(res)
			})
			.catch((reason) => {
				reject(reason)
			})
	})
}
// 获取我的购车门店getBuystroe
const getBuystroe = (data) => {
	let url = `${SERVICE}/api3/dealer/my_dealer`
	return new Promise((resolve, reject) => {
		_request.request({
			url,
			data
		})
			.then(res => {
				resolve(res)
			})
			.catch((reason) => {
				reject(reason)
			})
	})
}
//刮刮乐  活动首页
const shaveDel= (data) => {
	let url = `${SERVICE}/api3/shave/activity_detail`
	return new Promise((resolve, reject) => {
		_request.request({
			url,
			data
		})
			.then(res => {
				resolve(res)
			})
			.catch((reason) => {
				reject(reason)
			})
	})
}
// 中奖人员列表
const shaveList = (data) => {
	let url = `${SERVICE}/api3/shave/shave_detail`
	return new Promise((resolve, reject) => {
		_request.request({
			url,
			data
		})
			.then(res => {
				resolve(res)
			})
			.catch((reason) => {
				reject(reason)
			})
	})
}
// 刮奖 
const runShave = (data) => {
	let url = `${SERVICE}/api3/shave/shave`
	return new Promise((resolve, reject) => {
		_request.request({
			url,
			data
		})
			.then(res => {
				resolve(res)
			})
			.catch((reason) => {
				reject(reason)
			})
	})
}
// 分享上报
const upShare = (data) => {
	let url = `${SERVICE}/api3/activity/share`
	return new Promise((resolve, reject) => {
		_request.request({
			url,
			data
		})
			.then(res => {
				resolve(res)
			})
			.catch((reason) => {
				reject(reason)
			})
	})
}
//奖品页面过来 领取奖品
const getword = (data) => {
	let url = `${SERVICE}/api3/prize/perfect_data`
	return new Promise((resolve, reject) => {
		_request.request({
			url,
			data
		})
			.then(res => {
				resolve(res)
			})
			.catch((reason) => {
				reject(reason)
			})
	})
}
//领取微信卡券
const getwxcard = (data) => {
	let url = `${SERVICE}/api3/order/get_wechat_card`
	return new Promise((resolve, reject) => {
		_request.request({
			url,
			data
		})
			.then(res => {
				resolve(res)
			})
			.catch((reason) => {
				reject(reason)
			})
	})
}
//秒杀领取留资
const lq_receive = (data) => {
	let url = `${SERVICE}/api3/seckill/receive`
	return new Promise((resolve, reject) => {
		_request.request({
			url,
			data
		})
			.then(res => {
				resolve(res)
			})
			.catch((reason) => {
				reject(reason)
			})
	})
}
// 秒杀 预约留资
const yy_receive = (data) => {
	let url = `${SERVICE}/api3/seckill/leave_info`
	return new Promise((resolve, reject) => {
		_request.request({
			url,
			data
		})
			.then(res => {
				resolve(res)
			})
			.catch((reason) => {
				reject(reason)
			})
	})
}
// 已经留资的回填
const order_info = (data) => {
	let url = `${SERVICE}/api3/seckill/order_info`
	return new Promise((resolve, reject) => {
		_request.request({
			url,
			data
		})
			.then(res => {
				resolve(res)
			})
			.catch((reason) => {
				reject(reason)
			})
	})
}
// 判断接口999直接退出不能绑定车主 api3/member/is_upgrade_time
const is_upgrade = (data) => {
	let url = `${SERVICE}/api3/member/is_upgrade_time`
	return new Promise((resolve, reject) => {
		_request.request({
			url,
			data
		})
			.then(res => {
				resolve(res)
			})
			.catch((reason) => {
				reject(reason)
			})
	})
}
//解密手机号 api3/oauth/de_phone
const de_phone = (data) => {
	let url = `${SERVICE}/api3/oauth/de_phone`
	return new Promise((resolve, reject) => {
		_request.request({
			url,
			data
		})
			.then(res => {
				resolve(res)
			})
			.catch((reason) => {
				reject(reason)
			})
	})
}
//获取默认地址
const defaultAddress = (data) => {
	let url = `${SERVICE}/api3/address/default_address`
	return new Promise((resolve, reject) => {
		_request.request({
			url,
			data
		})
			.then(res => {
				resolve(res)
			})
			.catch((reason) => {
				reject(reason)
			})
	})
}
// 经销商 获取门店
const store_list = (data) => {
	let url = `${SERVICE}/api3/dealer_activity/store_list`
	return new Promise((resolve, reject) => {
		_request.request({
			url,
			data
		})
			.then(res => {
				resolve(res)
			})
			.catch((reason) => {
				reject(reason)
			})
	})
}
// 经销商 获取砍价首页接口
const bargainDel = (data) => {
	let url = `${SERVICE}/api3/dealer_bargain/detail`
	return new Promise((resolve, reject) => {
		_request.request({
			url,
			data
		})
			.then(res => {
				resolve(res)
			})
			.catch((reason) => {
				reject(reason)
			})
	})
}
//经销商 发起砍价接口
const start_bargain = (data) => {
	let url = `${SERVICE}/api3/dealer_bargain/start_bargain`
	return new Promise((resolve, reject) => {
		_request.request({
			url,
			data
		})
			.then(res => {
				resolve(res)
			})
			.catch((reason) => {
				reject(reason)
			})
	})
}
// 经销商 查询砍价信息接口
const bargain_info = (data) => {
	let url = `${SERVICE}/api3/dealer_bargain/bargain_info`
	return new Promise((resolve, reject) => {
		_request.request({
			url,
			data
		})
			.then(res => {
				resolve(res)
			})
			.catch((reason) => {
				reject(reason)
			})
	})
}
// 经销商 分享上报接口
const share_log = (data) => {
	let url = `${SERVICE}/api3/dealer_activity/share_log`
	return new Promise((resolve, reject) => {
		_request.request({
			url,
			data
		})
			.then(res => {
				resolve(res)
			})
			.catch((reason) => {
				reject(reason)
			})
	})
}
// 经销商 好友帮忙砍价
const helpbargain = (data) => {
	let url = `${SERVICE}/api3/dealer_bargain/bargain`
	return new Promise((resolve, reject) => {
		_request.request({
			url,
			data
		})
			.then(res => {
				resolve(res)
			})
			.catch((reason) => {
				reject(reason)
			})
	})
}
// 经销商 
const bargainreceive = (data) => {
	let url = `${SERVICE}/api3/dealer_bargain/receive`
	return new Promise((resolve, reject) => {
		_request.request({
			url,
			data
		})
			.then(res => {
				resolve(res)
			})
			.catch((reason) => {
				reject(reason)
			})
	})
}
module.exports = {
	reply_list,
	addArtlike,
	bargainList,
	bargain_shop_list,
	restBarnum,
	comfirBar,
	freeList,
	shopDel,
	friendHelp,
	getBanarlist,
	getWolrd,
	getStors,
	getcarInfo,
	removeCarinfo,
	getdefault,
	getBuystroe,
	shaveDel,
	shaveList,
	runShave,
	upShare,
	getword,
	getwxcard,
	lq_receive,
	yy_receive,
	order_info,
	is_upgrade,
	de_phone,
	defaultAddress,
	store_list,
	bargainDel,
	start_bargain,
	bargain_info,
	share_log,
	helpbargain,
	bargainreceive,
}