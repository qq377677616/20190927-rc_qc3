// pages/community_detail/community_detail.js
const route = require('../../utils/tool/router.js');
const require_01 = require('../../utils/request/request_01.js');
const require_04 = require('../../utils/request/request_04.js');
const alert = require('../../utils/tool/alert.js');
// const WxParse = require('../../utils/wxParse/wxParse.js');
const app = getApp();//获取应用实例
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		IMGSERVICE: app.globalData.IMGSERVICE,
		remarkContent: '',
		rid: '',
		artDel: {},
		replyData: [],
		page: 1,
		currtotle: 0,
		toView:'',
		iscoin:false,
		nomore:false,
		boxHeight:0,
		type:''
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		console.log('type',options);
		this.setData({ type: options.type,rid: parseInt(options.rid)})
		require_01.login(() => {
			this.articleDel();//文章详情
			this.reply_list();//评论列表
		})
		let res = wx.getSystemInfoSync();
		let boxHeight = res.windowHeight - 50;
		this.setData({
			'boxHeight': boxHeight
		});
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
		this.setData({page:1})
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
	onShareAppMessage: function (option) {
		let image = option.target.dataset.img;
		console.log(image)
		let obj = {
			title: this.data.artDel.title,
			path: '/pages/community_detail/community_detail',
			imageUrl: image
		};
		return obj;
	},
	articleDel() {// 文章详情
		let dat = {
			user_id: wx.getStorageSync('userInfo').user_id,
			article_id: this.data.rid
		}
		require_01.articleDel(dat).then((res) => {
			console.log(res.data)
			if (res.data.status == 1) {
				console.log(666)
				this.setData({ artDel: res.data.data, iscoin: res.data.data.vcoin>0?true:false})
				if (this.data.type =="bottom")
				this.goViews();
			}
		}).catch((reason) => {
			console.log(reason)
		})
	},
	reply_list() {//评论列表
		let arr = this.data.replyData;
		let dat = {
			user_id: wx.getStorageSync('userInfo').user_id,
			article_id: this.data.rid,
			page: this.data.page
		}
		require_04.reply_list(dat).then((res) => {
			console.log(res.data)
			if (res.data.status == 1 && res.data.data.list.length > 0) {
				for (let i = 0; i < res.data.data.list.length; i++) {
					arr.push(res.data.data.list[i])
				}
				this.setData({ replyData: arr, currtotle: res.data.data.list.length })
			} else {
				// alert.alert({ str: '没有更多评论了！' })
				this.setData({ nomore: this.data.page == 1?true:false}) 
			}
		}).catch((reason) => {
			console.log(reason)
		})
	},
	lookMore() {//查看更多
		this.setData({ page: ++this.data.page });
		this.reply_list();
	},
	addLike(e) {//评论点赞
		let arr = [];
		arr = this.data.replyData;
		let rpid = e.currentTarget.dataset.rpid;//文章回复id
		let dat = {
			user_id: wx.getStorageSync('userInfo').user_id,
			reply_id: rpid,
			article_id: this.data.rid
		}
		require_04.addArtlike(dat).then((res) => {
			console.log(res.data)
			if (res.data.status == 1) {
				console.log('arr', arr)
				for (let i = 0; i < arr.length; i++) {
					if (arr[i].reply_id == rpid) {
						console.log(arr[i].is_favorite)
						arr[i].is_favorite = arr[i].is_favorite == '0' ? '1' : '0';
						arr[i].favorite_num = arr[i].is_favorite == '0' ? --arr[i].favorite_num : ++arr[i].favorite_num;
						console.log(arr[i].is_favorite);
					}
				}
				console.log(arr);
				this.setData({ replyData: arr })
			}
		}).catch((reason) => {
			console.log(reason);
		})
	},
	giveLike(e) {//点赞
		let currObj = this.data.artDel;
		let arid = e.currentTarget.dataset.arid;
		let fid = e.currentTarget.dataset.fid;
		currObj.is_favorite = fid == 0 ? 1 : 0;
		currObj.favorite_num = fid == 0 ? ++currObj.favorite_num : --currObj.favorite_num;
		this.setData({ artDel: currObj })
		console.log(arid, fid);
		let dat = {
			user_id: wx.getStorageSync('userInfo').user_id,
			article_id: arid
		}
		require_01.likeArticle(dat).then((res) => {
			console.log(res.data);
			if (res.data.status == 1) {
				if (arid == arr[i].article_id) {
					arr[i].is_favorite = arr[i].is_favorite == 1 ? 0 : 1;
				}
			}
		}).catch((reason) => {
			console.log(reason);
		})
	},
	showRemark() {
		route.jump_nav({ url: '/pages/addRemark/addRemark?rid=' + this.data.rid })
	},
	goViews(){
		this.setData({ toView:"bottom"})
	},
	goldClose(){
		this.setData({iscoin:false})
	}
})