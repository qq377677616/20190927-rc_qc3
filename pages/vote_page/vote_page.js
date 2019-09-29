// pages/vote_page/vote_page.js活动id:42 43有数据
const request_01 = require('../../utils/request/request_01.js');
const router = require('../../utils/tool/router.js');
const alert = require('../../utils/tool/alert.js');
const tool = require('../../utils/tool/tool.js');
const app = getApp();
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		IMGSERVICEZ: app.globalData.IMGSERVICE,
		voteList: [],
		page: 1,
    firstShow:false,
    options:[],
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
    let activity_id = options.activity_id;
    this.setData({activity_id})
		request_01.login(()=>{
      this.getrankList();
		})
    this.setData({
      options,
    })
	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {
    tool.loading_h();
    this.setData({
      firstShow:true
    })
	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {
    this.setData({ voteList:[],page:1});
    let options = this.data.options
    if(this.data.firstShow){
      this.onLoad(options);
    }
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
		this.setData({ page: ++this.data.page })
		this.getrankList();
	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {

	},
  getrankList(){
    tool.loading('加载中')
		let arr = [];
		arr = this.data.voteList;
    let activity_id = this.data.activity_id
    console.log("activity_id", activity_id);
    this.setData({
      activity_id,
    })
		let dat = {
      activity_id: activity_id,
			user_id: wx.getStorageSync('userInfo').user_id,
			page:this.data.page
		}
		request_01.voteList(dat).then((res)=>{
			console.log(res.data.data.list);
			if (res.data.status == 1 && res.data.data.list.length > 0) {
				for (let i = 0; i < res.data.data.list.length; i++) {
					// console.log(res.data.data.list[i])
					arr.push(res.data.data.list[i])
				}
				this.setData({ voteList: arr })
				console.log('排行榜列表',arr);
			}
		}).catch((reason)=>{
			console.log(reason);
		})
    tool.loading_h();
	},
	goVote(e) {
		console.log(e)
		let vote_id = e.currentTarget.dataset.vote;
		let arrlist = this.data.voteList;
		let dat = {
			user_id: wx.getStorageSync('userInfo').user_id,
			vote_id: vote_id,
			type:1	
		}
		request_01.voteing(dat).then((res)=>{
			console.log(res.data)
			if(res.data.status==1){
				for (let i = 0; i < arrlist.length; i++) {
					
					if (arrlist[i].vote_id == vote_id) {
						console.log('i',i)
						arrlist[i].is_favorite = 1;
            arrlist[i].votes = arrlist[i].votes+1;
					}
				}
			this.setData({ voteList:arrlist});
			console.log(this.data.voteList)
			}else{
        alert.alert({ str:'您今天已为TA投过票~'})
      }

		}).catch((reason)=>{
			tool.alert(reason);
		})
	},
  goVotedel(e){
    let vote_id = e.currentTarget.dataset.id;
    let activity_id = this.data.activity_id;
    router.jump_nav({
      url: `/pages/vote_detail/vote_detail?vote_id=${vote_id}&activity_id=${activity_id}`,
    })
  }
})