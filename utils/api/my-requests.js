import $ from './request.js'
const QQMapWX = require('../../utils/other/qqmap-wx-jssdk.min.js');
const REQUESTURL = getApp().globalData.REQUESTURL
const myRequest = (data, url, type = 'post', isUrl = false) => {
  !isUrl && (url = `${REQUESTURL}${url}`)
  return new Promise((resolve, reject) => {
    $[`${type}P`](url, data).then(res => {
      resolve(res)
    }).catch(err => {
      reject(err)
    })
  })
}

//获取openid
const getOpenid = (data, url = '/api/oauth/getcode') => { return myRequest(data, url) }
//上传头像昵称
const uploadUserInfo = (data, url = '/api/oauth/perfect_info') => { return myRequest(data, url) }
//手机号解密
const getPhoneNumber = (data, url = '/api/Oauth/decryptedPhone') => { return myRequest(data, url) }
//上传base64图片
const uploadBase64 = (data, url = '/api/upload/upload_file_base64') => { return myRequest(data, url) }
//发送订阅消息
const requestSubscribeMessage = (data, url = '/api/message/send_remind_msg') => { return myRequest(data, url) }
//微信客户端登陆
const clientLogin = (data, url = '/index/index/clientLogin') => { return myRequest(data, url) }
// 获取专营店信息 
const getInfo = (data, url = '/index/index/getInfo') => { return myRequest(data, url) }
//获取地理位置

const getPosition = () => {
	return new Promise((resolve, reject) => {
		let qqmapsdk = new QQMapWX({ key: 'GW3BZ-NMN6J-JSEFT-FTC6R-F7DA3-Z3FVJ' });
		qqmapsdk.reverseGeocoder({
			success: (res) => {//成功后的回调
				resolve(res)
			},
			fail: function (err) {
				reject(err)
				console.log("定位失败333")
			}
		})
	})
}
// 获取专营店信息 
const msgLog = (data, url = '/index/index/msgLog') => { return myRequest(data, url) }
//消息记录接口
const msgList = (data, url = '/index/index/isExistMsg') => { return myRequest(data, url) }
// 清除消息记录 
const cleaninfo = (data, url = '/index/index/clean') => { return myRequest(data, url) }
// 图片上传
const uploadFiles = (data) => {
	let url = `${REQUESTURL}/index/index/upload`;
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
			fail(err) {
				reject(err)
			}
		})
	})
}
module.exports = {
  myRequest,
  getOpenid,
  uploadUserInfo,
  getPhoneNumber,
  uploadBase64,
  requestSubscribeMessage,
  clientLogin,
  getInfo,
  getPosition,
	msgLog,
	uploadFiles,
	msgList,
	cleaninfo,
}