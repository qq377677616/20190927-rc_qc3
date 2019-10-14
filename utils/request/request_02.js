const _request = require('./_request.js');

import request_01 from "./request_01.js"
const SERVICE = request_01.SERVICE;

// const SERVICE = "https://game.flyh5.cn/game/wx7c3ed56f7f792d84/yyt_dfqcfslb/public";
// const SERVICE = "https://weixinfslb.venucia.com";

//投票活动人数接口
const activityVoteInfo = (data) => {
    let url = `${SERVICE}/api/Activity/activityVoteInfo`
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

//分享增加抽奖次数
const addShare = (data) => {
    let url = `${SERVICE}/api/Choujiang/shareCj`
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

//奖品列表
const getPrizeList = (data) => {
    let url = `${SERVICE}/api/Choujiang/getCjInfo`
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

//抽奖
const getPrize = (data) => {
    let url = `${SERVICE}/api/Choujiang/activityCj2`
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

//球票专用接口
const cardRelation = (data) => {
    let url = `${SERVICE}/api/Getwxcard/editPrizeMsg`
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

//一年使用权专用接口
const ticketUpload = (data) => {
    let url = `${SERVICE}/api/Getwxcard/experience`
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

//普通卡券信息提交
const cardSet = (data) => {
    let url = `${SERVICE}/api/Getwxcard/saveMsg`
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

//产品详情
const goodsDetail = (data) => {
    let url = `${SERVICE}/api/Product/detail`
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

//获取门店列表
const getStoreList = (data) => {
    let url = `${SERVICE}/api/Dealer/dealerList`
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


//获取openid
const getOpenid = (data) => {
    let url = `${SERVICE}/api/Oauth/getCode`
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

//手机号解密
const getPhoneNumber = (data) => {
    let url = `${SERVICE}/api/Oauth/decryptedPhon`
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

//上传头像昵称
const uploadUserInfo = (data) => {
    let url = `${SERVICE}/api/Oauth/perfectUserInfo`
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

module.exports = {
    activityVoteInfo,
    addShare,
    getPrizeList,
    getPrize,
    cardRelation,
    ticketUpload,
    cardSet,
    goodsDetail,
    getStoreList,
    getOpenid,
    getPhoneNumber,
    uploadUserInfo,
}