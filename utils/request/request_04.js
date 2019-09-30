const _request = require('./_request.js');
import request_01 from "./request_01.js"
// const SERVICE = request_01.SERVICE;

const authorization = require('../tool/authorization.js');

const alert = require('../tool/alert.js');

const SERVICE = "https://game.flyh5.cn/game/wx7c3ed56f7f792d84/yyt_dfqcfslb/public";
// const SERVICE = "https://weixinfslb.venucia.com";
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
	let url = `${SERVICE}/api3/user/car_owner_remove`
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
}