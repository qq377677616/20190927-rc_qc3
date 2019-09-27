import $ from './request.js'
// const SERVICE = "https://game.flyh5.cn/game/wx7c3ed56f7f792d84/yyt_dfqcfslb/public"
import request_01 from "./request_01.js"
const SERVICE = request_01.SERVICE
console.log("SERVICE", SERVICE)
const myRequest = (data, url, type = 'post', isUrl = false) => {
  let _url = `${SERVICE}${url}`
  if (isUrl) _url = `${url}`
  return new Promise((resolve, reject) => {
    $[`${type}P`](_url, data).then(res => {
      resolve(res)
    }).catch(err => {
      reject(err)
    })
  })
}

//抽奖列表
const getPrizeList = (data, url = '/api3/luckdraw/prize_list') => { return myRequest(data, url) }
//抽奖详情
const getPrizeDetails = (data, url = '/api3/luckdraw/activity_detail') => { return myRequest(data, url) }
//抽奖
const getPrize = (data, url = '/api3/luckdraw/draw') => { return myRequest(data, url) }
//门店列表
const getStoreList = (data, url = '/api3/dealer/dealer_list') => { return myRequest(data, url) }
//获取session_key
const getSessionKey = (data, url = '/api3/oauth/oauth_get') => { return myRequest(data, url) }
//解密手机号
const getPhoneNumber = (data, url = '/api3/oauth/de_phone') => { return myRequest(data, url) }
//我的奖品留资
const pushForm = (data, url = '/api3/prize/perfect_data') => { return myRequest(data, url) }
//我的奖品卡券核销
const cardCheck = (data, url = '/api3/prize/update_card_code') => { return myRequest(data, url) }
//我的订单卡券
const couponPushForm = (data, url = '/api3/order/get_wechat_card') => { return myRequest(data, url) }
//我的订单卡券核销
const orderCheck = (data, url = '/api3/order/update_card_code') => { return myRequest(data, url) }
//我的奖品列表
const myPrizeList = (data, url = '/api3/prize/my_prize_list') => { return myRequest(data, url) }
//短信验证码
const getVerificationCode = (data, url = '/api3/prize/send_sms') => { return myRequest(data, url) }
//朋友圈数据上报--获取token
const getAdvertToken = (data, url = 'http://weixin.venucia.com/api/Applet/get_qctoken') => { return myRequest(data, url, 'get', true) }
//朋友圈数据上报--获取user_action_set_id
const getUserActionSetId = (data, url = 'https://api.weixin.qq.com/marketing/user_action_sets/add') => { return myRequest(data, url, 'post', true) }
//朋友圈数据上报--回传数据
const returnData = (data, url = 'https://api.weixin.qq.com/marketing/user_actions/add') => { return myRequest(data, url, 'post', true) }
//朋友圈渠道上报
const channelUpload = (data, url = '/api3/oauth/bind_channel') => { return myRequest(data, url) }
//是否显示看车页的两个icon
const isShowIcon = (data, url = 'https://game.flyh5.cn/game/wx7c3ed56f7f792d84/yyt_dfqcfslb/public/api3/index/aaaa') => { return myRequest(data, url, 'post', true) }
module.exports = {
  myRequest,
  getPrizeList,
  getPrizeDetails,
  getPrize,
  getStoreList,
  getSessionKey,
  getPhoneNumber,
  pushForm,
  couponPushForm,
  cardCheck,
  orderCheck,
  myPrizeList,
  getVerificationCode,
  getAdvertToken,
  getUserActionSetId,
  returnData,
  channelUpload,
  isShowIcon
}