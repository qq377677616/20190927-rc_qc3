const _request = require('./_request.js');

const authorization = require('../tool/authorization.js');

const alert = require('../tool/alert.js');

const tool = require('../tool/tool.js');

const SERVICE = "https://game.flyh5.cn/game/wx7c3ed56f7f792d84/yyt_dfqcfslb/public";
// const SERVICE = "https://weixinfslb.venucia.com";

//版本控制
const tag = (data) => {
    let url = 'https://game.flyh5.cn/game/wx7c3ed56f7f792d84/yyt_dfqcfslb/public/api3/oauth/version'
    return new Promise((resolve, reject) => {
        _request.request({
            url, 
            data
        })
        .then(res => {
            resolve(res)
        })
        .catch((reason)=>{
            reject(reason)
        })
    })
}

/** 
 * 
 * 
 * 购物车模块
*/

//我的任务列表
const taskIndex = (data) => {
    let url = `${SERVICE}/api3/task/task_list`
    return new Promise((resolve, reject) => {
        _request.request({
            url, 
            data
        })
        .then(res => {
            resolve(res)
        })
        .catch((reason)=>{
            reject(reason)
        })
    })
}

//添加购物车
const addShopCart = (data) => {
    let url = `${SERVICE}/api3/shoppingcart/add_shopping_cart`
    return new Promise((resolve, reject) => {
        _request.request({
            url, 
            data
        })
        .then(res => {
            resolve(res)
        })
        .catch((reason)=>{
            reject(reason)
        })
    })
}

//编辑购物车
const editShopCart = (data) => {
    let url = `${SERVICE}/api3/shoppingcart/edit_shopping_cart`
    return new Promise((resolve, reject) => {
        _request.request({
            url, 
            data
        })
        .then(res => {
            resolve(res)
        })
        .catch((reason)=>{
            reject(reason)
        })
    })
}

//购物车列表
const shopCartList = (data) => {
    let url = `${SERVICE}/api3/shoppingcart/shopping_cart_list`
    return new Promise((resolve, reject) => {
        _request.request({
            url, 
            data
        })
        .then(res => {
            resolve(res)
        })
        .catch((reason)=>{
            reject(reason)
        })
    })
}

//删除购物车
const deleteShopCart = (data) => {
    let url = `${SERVICE}/api3/shoppingcart/del_shopping_cart`
    return new Promise((resolve, reject) => {
        _request.request({
            url, 
            data
        })
        .then(res => {
            resolve(res)
        })
        .catch((reason)=>{
            reject(reason)
        })
    })
}

//购物车结算
const settlementShopCart = (data) => {
    let url = `${SERVICE}/api3/shoppingcart/settlement_shopping_cart`
    return new Promise((resolve, reject) => {
        _request.request({
            url, 
            data
        })
        .then(res => {
            resolve(res)
        })
        .catch((reason)=>{
            reject(reason)
        })
    })
}

/**
 * 
 * 
 * 用户模块
 */

//用户模块首页接口
const homeInfo = (data) => {
    let url = `${SERVICE}/api3/user/user_index`
    return new Promise((resolve, reject) => {
        _request.request({
            url, 
            data
        })
        .then(res => {
            resolve(res)
        })
        .catch((reason)=>{
            reject(reason)
        })
    })
}

//我的信息接口
const personalInfo = (data) => {
    let url = `${SERVICE}/api3/user/my_info`
    return new Promise((resolve, reject) => {
        _request.request({
            url, 
            data
        })
        .then(res => {
            resolve(res)
        })
        .catch((reason)=>{
            reject(reason)
        })
    })
}

//V豆来源
const vdouSrouse = (data) => {
    let url = `${SERVICE}/api3/user/my_vcoin_log`
    return new Promise((resolve, reject) => {
        _request.request({
            url, 
            data
        })
        .then(res => {
            resolve(res)
        })
        .catch((reason)=>{
            reject(reason)
        })
    })
}

//我的预约试驾
const myReservationDriving = (data) => {
	let url = `${SERVICE}/api3/testdrive/my_test_drive`;
    return new Promise((resolve, reject) => {
        _request.request({
            url, 
            data
        })
        .then(res => {
            resolve(res)
        })
        .catch((reason)=>{
            reject(reason)
        })
    })
}

//近期签到信息
const signInInfo = (data) => {
    let url = `${SERVICE}/api3/user/sign_in_info`
    return new Promise((resolve, reject) => {
        _request.request({
            url, 
            data
        })
        .then(res => {
            resolve(res)
        })
        .catch((reason)=>{
            reject(reason)
        })
    })
}

//签到操作
const signIn = (data) => {
    let url = `${SERVICE}/api3/user/do_sign_in`
    return new Promise((resolve, reject) => {
        _request.request({
            url, 
            data
        })
        .then(res => {
            resolve(res)
        })
        .catch((reason)=>{
            reject(reason)
        })
    })
}

//我的团购列表
const groupList = (data) => {
    let url = `${SERVICE}/api3/groupbuy/my_groupbuy_order_list`
    return new Promise((resolve, reject) => {
        _request.request({
            url, 
            data
        })
        .then(res => {
            resolve(res)
        })
        .catch((reason)=>{
            reject(reason)
        })
    })
}

//我的团购详情
const groupDetail = (data) => {
    let url = `${SERVICE}/api3/groupbuy/my_groupbuy_order_detail`
    return new Promise((resolve, reject) => {
        _request.request({
            url, 
            data
        })
        .then(res => {
            resolve(res)
        })
        .catch((reason)=>{
            reject(reason)
        })
    })
}

//领取奖品
const getOrderId = (data) => {
    let url = `${SERVICE}/api3/groupbuy/receive_prize`
    return new Promise((resolve, reject) => {
        _request.request({
            url, 
            data
        })
        .then(res => {
            resolve(res)
        })
        .catch((reason)=>{
            reject(reason)
        })
    })
}

//车主认证
const carAuth = (data) => {
    let url = `${SERVICE}/api3/user/car_owner_auth`
    return new Promise((resolve, reject) => {
        _request.request({
            url, 
            data
        })
        .then(res => {
            resolve(res)
        })
        .catch((reason)=>{
            reject(reason)
        })
    })
}

/**
 * 
 * 
 * 文章模块
 */

//发布文章
const publishArticle = (data) => {
    let url = `${SERVICE}/api3/article/release_article`
    return new Promise((resolve, reject) => {
        _request.request({
            url, 
            data
        })
        .then(res => {
            resolve(res)
        })
        .catch((reason)=>{
            reject(reason)
        })
    })
}

//文章列表
const articleList = (data) => {
    let url = `${SERVICE}/api3/article/article_list`
    return new Promise((resolve, reject) => {
        _request.request({
            url, 
            data
        })
        .then(res => {
            resolve(res)
        })
        .catch((reason)=>{
            reject(reason)
        })
    })
}

//点赞/取消点赞
const likeArticle = (data) => {
    let url = `${SERVICE}/api3/article/favorite_article`
    return new Promise((resolve, reject) => {
        _request.request({
            url, 
            data
        })
        .then(res => {
            resolve(res)
        })
        .catch((reason)=>{
            reject(reason)
        })
    })
}

//转发文章记录
const forwardArticle = (data) => {
    let url = `${SERVICE}/api3/article/relay_article`
    return new Promise((resolve, reject) => {
        _request.request({
            url, 
            data
        })
        .then(res => {
            resolve(res)
        })
        .catch((reason)=>{
            reject(reason)
        })
    })
}

//评论
const commentArticle = (data) => {
    let url = `${SERVICE}/api3/article/reply_article`
    return new Promise((resolve, reject) => {
        _request.request({
            url, 
            data
        })
        .then(res => {
            resolve(res)
        })
        .catch((reason)=>{
            reject(reason)
        })
    })
}

/**
 * 
 * 
 * 商城模块
 */

//商城首页
const shopMall = (data) => {
    let url = `${SERVICE}/api3/shop/shop_index`
    return new Promise((resolve, reject) => {
        _request.request({
            url, 
            data
        })
        .then(res => {
            resolve(res)
        })
        .catch((reason)=>{
            reject(reason)
        })
    })
}

//商品列表
const goodsList = (data) => {
    let url = `${SERVICE}/api3/shop/goods_list`
    return new Promise((resolve, reject) => {
        _request.request({
            url, 
            data
        })
        .then(res => {
            resolve(res)
        })
        .catch((reason)=>{
            reject(reason)
        })
    })
}

//购买商品
const goodsSettlement = (data) => {
    let url = `${SERVICE}/api3/shop/settlement`
    return new Promise((resolve, reject) => {
        _request.request({
            url, 
            data
        })
        .then(res => {
            resolve(res)
        })
        .catch((reason)=>{
            reject(reason)
        })
    })
}

//商品详情
const goodsDetail = (data) => {
    let url = `${SERVICE}/api3/shop/goods_detail`
    return new Promise((resolve, reject) => {
        _request.request({
            url, 
            data
        })
        .then(res => {
            resolve(res)
        })
        .catch((reason)=>{
            reject(reason)
        })
    })
}

//分类列表
const classList = (data) => {
    let url = `${SERVICE}/api3/shop/cate_list`
    return new Promise((resolve, reject) => {
        _request.request({
            url, 
            data
        })
        .then(res => {
            resolve(res)
        })
        .catch((reason)=>{
            reject(reason)
        })
    })
}

/**
 * 
 * 
 * EV抽奖游戏模块
 */

//抽奖
const EV_Draw = (data) => {
    let url = `${SERVICE}/api/evgame/lottery_draw`
    return new Promise((resolve, reject) => {
        _request.request({
            url, 
            data
        })
        .then(res => {
            resolve(res)
        })
        .catch((reason)=>{
            reject(reason)
        })
    })
}

//分享上报
const EV_Share = (data) => {
    let url = `${SERVICE}/api/evgame/share_game`
    return new Promise((resolve, reject) => {
        _request.request({
            url, 
            data
        })
        .then(res => {
            resolve(res)
        })
        .catch((reason)=>{
            reject(reason)
        })
    })
}

//中奖留资接口
const EV_RetainInfo = (data) => {
    let url = `${SERVICE}/api/evgame/receive_prize`
    return new Promise((resolve, reject) => {
        _request.request({
            url, 
            data
        })
        .then(res => {
            resolve(res)
        })
        .catch((reason)=>{
            reject(reason)
        })
    })
}

//判断是否是车主
const EV_isOwner = (data) => {
    let url = `${SERVICE}/api/evgame/check_identity`
    return new Promise((resolve, reject) => {
        _request.request({
            url, 
            data
        })
        .then(res => {
            resolve(res)
        })
        .catch((reason)=>{
            reject(reason)
        })
    })
}

//中奖播报列表
const EV_broadcastList = (data) => {
    let url = `${SERVICE}/api/evgame/win_list`
    return new Promise((resolve, reject) => {
        _request.request({
            url, 
            data
        })
        .then(res => {
            resolve(res)
        })
        .catch((reason)=>{
            reject(reason)
        })
    })
}

//我的奖品
const EV_myPrize = (data) => {
    let url = `${SERVICE}/api/evgame/my_prize`
    return new Promise((resolve, reject) => {
        _request.request({
            url, 
            data
        })
        .then(res => {
            resolve(res)
        })
        .catch((reason)=>{
            reject(reason)
        })
    })
}

/**
 * 
 * 
 * 经销商模块
 */

//专营店列表
const storeList = (data) => {
    let url = `${SERVICE}/api3/dealer/dealer_list`
    return new Promise((resolve, reject) => {
        _request.request({
            url, 
            data
        })
        .then(res => {
            resolve(res)
        })
        .catch((reason)=>{
            reject(reason)
        })
    })
}

/**
 * 
 * 
 * 订单模块
 */

//我的订单列表
const orderList = (data) => {
    let url = `${SERVICE}/api3/order/my_order_list`
    return new Promise((resolve, reject) => {
        _request.request({
            url, 
            data
        })
        .then(res => {
            resolve(res)
        })
        .catch((reason)=>{
            reject(reason)
        })
    })
}

//我的订单列表
const orderDetail = (data) => {
    let url = `${SERVICE}/api3/order/my_order_detail`
    return new Promise((resolve, reject) => {
        _request.request({
            url, 
            data
        })
        .then(res => {
            resolve(res)
        })
        .catch((reason)=>{
            reject(reason)
        })
    })
}

//我的订单列表
const orderWuliu = (data) => {
    let url = `${SERVICE}/api3/order/shipping_info`
    return new Promise((resolve, reject) => {
        _request.request({
            url, 
            data
        })
        .then(res => {
            resolve(res)
        })
        .catch((reason)=>{
            reject(reason)
        })
    })
}

/**
 * 
 * 
 * 活动模块-9.9元看车
 */

//活动列表
const activityList = (data) => {
    let url = `${SERVICE}/api3/activity/activity_list`
    return new Promise((resolve, reject) => {
        _request.request({
            url, 
            data
        })
        .then(res => {
            resolve(res)
        })
        .catch((reason)=>{
            reject(reason)
        })
    })
}

//活动详情
const activityDetail = (data) => {
    let url = `${SERVICE}/api3/activity/activity_detail`
    return new Promise((resolve, reject) => {
        _request.request({
            url, 
            data
        })
        .then(res => {
            resolve(res)
        })
        .catch((reason)=>{
            reject(reason)
        })
    })
}

//参加活动
const joinActivity = (data) => {
    let url = `${SERVICE}/api3/activity/join_activity`
    return new Promise((resolve, reject) => {
        _request.request({
            url, 
            data
        })
        .then(res => {
            resolve(res)
        })
        .catch((reason)=>{
            reject(reason)
        })
    })
}

//第一步-获取状态
const getStatus = (data) => {
    let url = `${SERVICE}/api3/ninepay/join_status`
    return new Promise((resolve, reject) => {
        _request.request({
            url, 
            data
        })
        .then(res => {
            resolve(res)
        })
        .catch((reason)=>{
            reject(reason)
        })
    })
}

//第二步-领取支付
const receivePay = (data) => {
    let url = `${SERVICE}/api3/ninepay/pay`
    return new Promise((resolve, reject) => {
        _request.request({
            url, 
            data
        })
        .then(res => {
            resolve(res)
        })
        .catch((reason)=>{
            reject(reason)
        })
    })
}

/**
 * 
 * 
 * 活动模块-团购活动
 */

//团购首页
const pinIndex = (data) => {
    let url = `${SERVICE}/api3/groupbuy/group_buy_index`
    return new Promise((resolve, reject) => {
        _request.request({
            url, 
            data
        })
        .then(res => {
            resolve(res)
        })
        .catch((reason)=>{
            reject(reason)
        })
    })
}

//团购商品列表
const pinGoodsList = (data) => {
    let url = `${SERVICE}/api3/groupbuy/goods_list`
    return new Promise((resolve, reject) => {
        _request.request({
            url, 
            data
        })
        .then(res => {
            resolve(res)
        })
        .catch((reason)=>{
            reject(reason)
        })
    })
}

//团购商品详情
const pinGoodsDetail = (data) => {
    let url = `${SERVICE}/api3/groupbuy/goods_detail`
    return new Promise((resolve, reject) => {
        _request.request({
            url, 
            data
        })
        .then(res => {
            resolve(res)
        })
        .catch((reason)=>{
            reject(reason)
        })
    })
}

//发起拼团
const launchPin = (data) => {
    let url = `${SERVICE}/api3/groupbuy/group_buying`
    return new Promise((resolve, reject) => {
        _request.request({
            url, 
            data
        })
        .then(res => {
            resolve(res)
        })
        .catch((reason)=>{
            reject(reason)
        })
    })
}

//拼团详情
const pinDetail = (data) => {
    let url = `${SERVICE}/api3/groupbuy/groupbuy_detail`
    return new Promise((resolve, reject) => {
        _request.request({
            url, 
            data
        })
        .then(res => {
            resolve(res)
        })
        .catch((reason)=>{
            reject(reason)
        })
    })
}

//参与拼团
const joinPin = (data) => {
    let url = `${SERVICE}/api3/groupbuy/join_group_buying`
    return new Promise((resolve, reject) => {
        _request.request({
            url, 
            data
        })
        .then(res => {
            resolve(res)
        })
        .catch((reason)=>{
            reject(reason)
        })
    })
}

/**
 * 
 * 
 * 授权模块
 */

//根据code获取用户信息
const getUserInfo = (data) => {
    let url = `${SERVICE}/api3/oauth/oauth_reg`
    return new Promise((resolve, reject) => {
        _request.request({
            url, 
            data
        })
        .then(res => {
            resolve(res)
        })
        .catch((reason)=>{
            reject(reason)
        })
    })
}

//根据code获取session_key授权
const getSessionKey = (data) => {
    let url = `${SERVICE}/api3/oauth/oauth_get`
    return new Promise((resolve, reject) => {
        _request.request({
            url, 
            data
        })
        .then(res => {
            resolve(res)
        })
        .catch((reason)=>{
            reject(reason)
        })
    })
}

//手机号解密并保存
const getPhone = (data) => {
    let url = `${SERVICE}/api3/oauth/de_phone`
    return new Promise((resolve, reject) => {
        _request.request({
            url, 
            data
        })
        .then(res => {
            resolve(res)
        })
        .catch((reason)=>{
            reject(reason)
        })
    })
}

//完善用户信息
const perfectInfo = (data) => {
    let url = `${SERVICE}/api3/oauth/perfect`
    return new Promise((resolve, reject) => {
        _request.request({
            url, 
            data
        })
        .then(res => {
            resolve(res)
        })
        .catch((reason)=>{
            reject(reason)
        })
    })
}

/**
 * 
 * 
 * 首页模块
 */

//首页轮播图接口
const indexBanner = (data) => {
    let url = `${SERVICE}/api3/index/banner`
    return new Promise((resolve, reject) => {
        _request.request({
            url, 
            data
        })
        .then(res => {
            resolve(res)
        })
        .catch((reason)=>{
            reject(reason)
        })
    })
}

//首页活动
const indexActivity = (data) => {
    let url = `${SERVICE}/api3/index/recommend_activity`
    return new Promise((resolve, reject) => {
        _request.request({
            url, 
            data
        })
        .then(res => {
            resolve(res)
        })
        .catch((reason)=>{
            reject(reason)
        })
    })
}

//游戏列表
const gameList = (data) => {
    let url = `${SERVICE}/api3/index/game_list`
    return new Promise((resolve, reject) => {
        _request.request({
            url, 
            data
        })
        .then(res => {
            resolve(res)
        })
        .catch((reason)=>{
            reject(reason)
        })
    })
}

//看车列表
const lookCarList = (data) => {
    let url = `${SERVICE}/api3/lookcar/car_list`
    return new Promise((resolve, reject) => {
        _request.request({
            url, 
            data
        })
        .then(res => {
            resolve(res)
        })
        .catch((reason)=>{
            reject(reason)
        })
    })
}

//看车详情
const lookCarDetail = (data) => {
    let url = `${SERVICE}/api3/lookcar/car_details`
    return new Promise((resolve, reject) => {
        _request.request({
            url, 
            data
        })
        .then(res => {
            resolve(res)
        })
        .catch((reason)=>{
            reject(reason)
        })
    })
}

//预约试驾
const lookCarSubmit = (data) => {
    let url = `${SERVICE}/api3/testdrive/look_car_log`
    return new Promise((resolve, reject) => {
        _request.request({
            url, 
            data
        })
        .then(res => {
            resolve(res)
        })
        .catch((reason)=>{
            reject(reason)
        })
    })
}
// /**
//  * 
//  * 
//  * H5小游戏
//  */

// //是否授权了手机号
// const userPhone = (data) => {
//     let url = `${SERVICE}/api/ActivityVote/user_phone`
//     return new Promise((resolve, reject) => {
//         _request.request({
//             url, 
//             data
//         })
//         .then(res => {
//             resolve(res)
//         })
//         .catch((reason)=>{
//             reject(reason)
//         })
//     })
// }

/**
 * 
 * 
 * 收货地址模块
 */

//添加收货地址
const addAddress = (data) => {
    let url = `${SERVICE}/api3/address/add_address`
    return new Promise((resolve, reject) => {
        _request.request({
            url, 
            data
        })
        .then(res => {
            resolve(res)
        })
        .catch((reason)=>{
            reject(reason)
        })
    })
}

//修改收货地址
const editAddress = (data) => {
    let url = `${SERVICE}/api3/address/edit_address`
    return new Promise((resolve, reject) => {
        _request.request({
            url, 
            data
        })
        .then(res => {
            resolve(res)
        })
        .catch((reason)=>{
            reject(reason)
        })
    })
}

//删除收货地址
const deleteAddress = (data) => {
    let url = `${SERVICE}/api3/address/del_address`
    return new Promise((resolve, reject) => {
        _request.request({
            url, 
            data
        })
        .then(res => {
            resolve(res)
        })
        .catch((reason)=>{
            reject(reason)
        })
    })
}
const prizeList = (data) => {//我的兑换列表
	let url = `${SERVICE}/api3/prize/my_prize_list`
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
//我的收货地址列表exchange
const addressList = (data) => {
    let url = `${SERVICE}/api3/address/my_address`
    return new Promise((resolve, reject) => {
        _request.request({
            url, 
            data
        })
        .then(res => {
            resolve(res)
        })
        .catch((reason)=>{
            reject(reason)
        })
    })
}
//我的收货地址列表-yls-0910
const exchangeList = (data) => {
	let url = `${SERVICE}/api3/order/my_order_list`
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
        .catch((reason)=>{
            reject(reason)
        })
    })
}
//文件视频/上传-yls-0910
const uploadFiles = (data)=>{
	let url = `${SERVICE}/api3/upload/upload_image`;
	return new Promise((resolve, reject) => {
		wx.chooseImage({
			success(res) {
				const tempFilePaths = res.tempFilePaths
				wx.uploadFile({
					url: url, 
					filePath: tempFilePaths[0],
					name: 'file',
					formData: {},
					success(res) {
						const data = res.data
						resolve(JSON.parse(data))
					}
				})
			},
			fail(err){
				reject(err)
			}
		})	
	})
}
// 投票排行榜列表yls
const voteList = (data) => {
	let url = `${SERVICE}/api3/vote/vote_list`
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
// 为别人投票接口yls
const voteing = (data) => {
	let url = `${SERVICE}/api3/vote/do_vote`
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
//评论接口yls
const remarkArt = (data) => {
	let url = `${SERVICE}/api3/article/reply_article`
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
//文章详情接口
const articleDel = (data) => {
	let url = `${SERVICE}/api3/article/article_detail`
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


/**
 * 
 * 
 * 
 */
//登录
const login = (callback)=>{

    return new Promise((resolve, reject)=>{

        const userInfo = wx.getStorageSync('userInfo');

        alert.loading({
            str: '登录中'
        })
       

        if( userInfo.user_id ){//本地已保存用户信息
         
            alert.loading_h();
            callback()
            // resolve()

        }else{//本地未保存用户信息

            authorization.login()
                .then((value) => {

                    return getUserInfo({
                        code: value.code,
                        parent_id: wx.getStorageSync("shareIds").parent_id,
                        channel_id: wx.getStorageSync("shareIds").channel_id
                    })
                })
                .then((value) => {
                    const data = value.data.data;
                    if (data.errcode && data.errmsg) {
                        login(callback)
                    } else {
                        console.log('<<<',data,'>>>')
                        wx.setStorageSync('userInfo', data)

                        alert.loading_h();
                        callback()
                        // resolve()
                    }
                })
                .catch((reason) => {
                    alert.loading_h();

                    alert.alert({
                        str: reason
                    })
                    callback()
                    // reject()
                })
        }
    })

}
//授权
const setUserInfo = (e) => {
  return new Promise((resolve, reject) => {
    tool.loading("授权中")
    const userInfo = e.detail.userInfo
    if (userInfo) {
      Object.assign(userInfo, wx.getStorageSync("userInfo") || {})
      wx.setStorageSync("userInfo", userInfo)
      tool.loading_h()
      //这里做上传头像昵称给后台操作
      uploadUserInfo({
        user_id: wx.getStorageSync("userInfo").user_id,
        nickname: userInfo.nickName,
        headimg: userInfo.avatarUrl,
        gender: 1
      }).then(res => {
        tool.loading_h()
        resolve(true)
      }).catch(err => {
        reject(err)
      })
    } else {
      tool.loading_h()
      // tool.showModal('授权', '为了更好的体验，请先授权', '好的,#124DB8', false)
      resolve(false)
    }
  })
}
//上传头像昵称
const uploadUserInfo = (data) => {
  let url = `${SERVICE}/api3/oauth/perfect`
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
    tag,
    taskIndex,
    addShopCart,
    editShopCart,
    shopCartList,
    deleteShopCart,
    settlementShopCart,
    myReservationDriving,
    signInInfo,
    signIn,
    groupList,
    groupDetail,
    getOrderId,
    carAuth,
    publishArticle,
    articleList,
    likeArticle,
    commentArticle,
    shopMall,
    goodsList,
    goodsSettlement,
    goodsDetail,
    classList,
    EV_Draw,
    EV_Share,
    EV_RetainInfo,
    EV_isOwner,
    EV_broadcastList,
    EV_myPrize,
    storeList,
    orderList,
    orderDetail,
    orderWuliu,
    activityList,
    activityDetail,
    joinActivity,
    getStatus,
    receivePay,
    pinIndex,
    pinGoodsList,
    pinGoodsDetail,
    launchPin,
    pinDetail,
    joinPin,
    getUserInfo,
    setUserInfo,
    getSessionKey,
    getPhone,
    perfectInfo,
    indexBanner,
    // userPhone,
    indexActivity,
    gameList,
    lookCarList,
    lookCarDetail,
    lookCarSubmit,
    homeInfo,
    personalInfo,
    addAddress,
    editAddress,
    deleteAddress,
    addressList,
    vdouSrouse,
    exchangeList,
    defaultAddress,
  	prizeList,
  	uploadFiles,
  	voteList,
  	voteing,
  	remarkArt,
  	articleDel,
    login,
    SERVICE,
}