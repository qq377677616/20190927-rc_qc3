// pages/community/community.js
const route =  require('../../utils/tool/router.js');
const require_01 = require('../../utils/request/request_01.js');
const alert = require('../../utils/tool/alert.js');
const app = getApp();//获取应用实例
Page({

  /**
   * 页面的初始数据
   */
  data: {
	  articleData:[],
	  IMGSERVICE: app.globalData.IMGSERVICE,	 
	  page:1 
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
	  console.log('文章列表页面参数',options)
	  require_01.login(() => {
		this.articleList();
		this.shareJump(options.rid);
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
	  this.setData({page:1, articleData:[]});
	  this.articleList();
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
	  this.setData({ page:++this.data.page});
	  this.articleList();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (option) {
	let rid = option.target.dataset.rid;
	let image = option.target.dataset.img;
	let title = option.target.dataset.title;
	  console.log(image)
	console.log(image)
	  let obj = {
		  title: "启辰头条资讯，第一时间看新鲜！",
		  path: '/pages/community/community?rid=' + rid,
		  imageUrl: image
	  };  
	  return obj;
  },
  articleList(){//文章列表
	  let arr = this.data.articleData;
	  let dat = {
		  user_id: wx.getStorageSync('userInfo').user_id,
		  cate_id:12,
		  page: this.data.page
	  }
	  require_01.articleList(dat).then((res)=>{
		  console.log(res.data);
		  if (res.data.status == 1 && res.data.data.list.length>0){
			  for (let i = 0; i < res.data.data.list.length;i++){
				  arr.push(res.data.data.list[i])
			  }
			  this.setData({ articleData:arr})
			  console.log(arr);
		  }else{
			  alert.alert({ str:'没有更多数据了！'})
		  }
	  }).catch((reason)=>{
		  console.log(reason);
	  })
  },
  giveLike(e){//点赞
	  let arr = this.data.articleData;
	  let arid = e.currentTarget.dataset.arid;
	  console.log(e.currentTarget.dataset.arid)
	  let dat = {
		  user_id: wx.getStorageSync('userInfo').user_id,
		  article_id:arid
	  }
	  require_01.likeArticle(dat).then((res)=>{
		  console.log(res.data);
		  if(res.data.status==1){
			for(let i=0;i<arr.length;i++){
				if (arid == arr[i].article_id){
					arr[i].is_favorite = arr[i].is_favorite==1?0:1;
					arr[i].favorite_num = arr[i].is_favorite == 1 ? ++arr[i].favorite_num : --arr[i].favorite_num;
				}
			}  
			this.setData({articleData:arr});	  
		  }
	  }).catch((reason)=>{
		  console.log(reason);
	  })
  },
  remark(e){//点击评论跳转
	  let rid = e.currentTarget.dataset.rid;
	  let type =  e.currentTarget.dataset.type;
	  console.log(type);
	  console.log(e.currentTarget.dataset.rid);
	  route.jump_nav({ url: '/pages/community_detail/community_detail?rid=' + rid+'&type='+type})
	},
	shareJump(rid){
		if (rid > 0 && rid){
			alert.loading({ str: '' })
			route.jump_nav({ url: '/pages/community_detail/community_detail?rid=' + rid }).then(()=>{
				alert.loading_h()
				console.log('跳转成功')
			})
		}
	}
})