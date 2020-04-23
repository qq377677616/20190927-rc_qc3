// pages/o_dot/o_dot.js

const method = require('../../utils/tool/method.js');

const request_01 = require('../../utils/request/request_01.js');

const request_04 = require('../../utils/request/request_04.js');

const alert = require('../../utils/tool/alert.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    location:{},
    storeList:[],
	mystroe:{},//我的购车门店
	region: ['广东省', '广州市', '海珠区'],
	citys:'定位失败',
	selectCity:'',
	status:0,
	nostroe:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    request_01.login(()=>{
      this.initData(options)
		this.getBuystroe();
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
//   onShareAppMessage: function () {

//   },
  //页面初始化
  initData(){
    Promise.all([
      method.getPosition(),
	  
    ])
      .then((value)=>{
        //success
		// console.log(value);
        const location = value[0].result;
		  console.log(location.location);
        this.setData({
          location,
		  citys: value[0].result.address_component.city
        })
		  return this.getstroelist(location);
      }).catch(()=>{
		  console.log("定位失败！")
	  })
      
  },
	re_local(){
		this.setData({selectCity:''})
		this.initData();
	},
	getBuystroe(){
		console.log(this.data.location,"参数");
		let dat ={
			user_id:wx.getStorageSync('userInfo').user_id,
			lon: this.data.location.lng,
			lat: this.data.location.lat
		}
		request_04.getBuystroe(dat).then((res)=>{
			console.log(res.data)
			if(res.data.status==1){
				this.setData({ mystroe: res.data.data, status: res.data.status})
			}else{
				this.setData({ mystroe: res.data.status })
			}
		}).catch((reason)=>{
			console.log(reason)
		})
	},
	bindRegionChange: function (e) {
		console.log(e.detail.value);
		this.setData({
			region: e.detail.value,
			citys: e.detail.value[1],
			selectCity: e.detail.value[1]
		})
		this.getstroelist();
	},
	getstroelist(location={}){
		console.log(this.data.location, "参数");
		let dat = {};
		if (this.data.selectCity == "") {
			dat = {
				city: location.address_component.city,
				lon: location.location.lng,
				lat: location.location.lat,
			}
		} else {
			dat = {
				city: this.data.selectCity,
			}
		}
		request_01.storeList(dat).then((value) => {
			const storeList = value.data.data;
			console.log('门店列表', storeList);
			this.setData({
				storeList,
				nostroe: !storeList.length>0,
			})
		})
			.catch((reason) => {
				//fail
				console.log('catch')
			})
			.finally(() => {
				//complete
				console.log('finally')
			})
	}
})