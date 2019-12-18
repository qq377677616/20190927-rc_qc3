const _request = require('./_request.js');

const authorization = require('../tool/authorization.js');

import request_01 from "./request_01.js"
const SERVICE = request_01.SERVICE;

const alert = require('../tool/alert.js');

// const SERVICE = "https://game.flyh5.cn/game/wx7c3ed56f7f792d84/yyt_dfqcfslb/public";
// const SERVICE = "https://weixinfslb.venucia.com";


/** 
 * 
 * 
 * 投票模块
*/

// 投票首页轮播
const voteRandPlay = (data) => {
  let url = `${SERVICE}/api3/vote/rand_play`
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


// 我的投票信息
const myVote = (data) => {
  let url = `${SERVICE}/api3/vote/my_vote`
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

// 投票活动首页
const voteIndex = (data) => {
  let url = `${SERVICE}/api3/vote/activity_detail`
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

// 上传投票信息 
const uploadVote = (data) => {
  let url = `${SERVICE}/api3/vote/join_vote`
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

//投票详情(非自己)
const voteDetail = (data) => {
  let url = `${SERVICE}/api3/vote/vote_detail`
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

//点赞分享
const doVote = (data) => {
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


/** 
 * 
 * 
 * 卡包模块
*/

// 卡券列表
const voucherList = (data) => {
  let url = `${SERVICE}/api3/voucher/my_voucher_list`
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

// 卡券详情

const voucherInfo = (data) => {
  let url = `${SERVICE}/api3/voucher/voucher_info`
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

/** 
 * 
 * 
 * 报名模块
*/

// 点击进入

const enterApply = (data) => {
  let url = `${SERVICE}/api3/activityapply/enter_apply_activity`
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

// 报名
const participate = (data) => {
  let url = `${SERVICE}/api3/Activityapply/immediately_participate`
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

// 获奖名单
const hasParticipate = (data) => {
  let url = `${SERVICE}/api3/Activityapply/has_participate`
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

// 用户信息回填
const getUserMessage = (data) => {
  let url = `${SERVICE}/api3/Activityapply/get_user_message`
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

// 任务列表

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
      .catch((reason) => {
        reject(reason)
      })
  })
}

// 我的活动

const myActivityList = (data) => {
  let url = `${SERVICE}/api3/activity/my_activity_list`
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
 * 摇一摇模块
*/

//摇一摇首页
const shakeDetail = (data) => {
  let url = `${SERVICE}/api3/shake/shake_detail`
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

//摇一摇
const shake = (data) => {
  let url = `${SERVICE}/api3/shake/shake`
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

//好友助力页面
const shakeInfo = (data) => {
  let url = `${SERVICE}/api3/shake/shake_info`
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

//助力操作
const shakeHelp = (data) => {
  let url = `${SERVICE}/api3/shake/shake_help`
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

//升级卡券
const upgradePrize = (data) => {
  let url = `${SERVICE}/api3/shake/upgrade_prize`
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

//核销码上报
const updateCardCode = (data) => {
  let url = `${SERVICE}/api3/shake/update_card_code`
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
  myVote,
  uploadVote,
  voucherList,
  voucherInfo,
  voteDetail,
  enterApply,
  participate,
  hasParticipate,
  getUserMessage,
  taskIndex,
  myActivityList,
  doVote,
  voteRandPlay,
  voteIndex,
  shakeDetail,
  shake,
  shakeInfo,
  shakeHelp,
  upgradePrize,
  updateCardCode,
}



