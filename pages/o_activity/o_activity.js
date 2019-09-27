// pages/o_activity/o_activity.js

const request_01 = require('../../utils/request/request_01.js');

const request_05 = require('../../utils/request/request_05.js');

const router = require('../../utils/tool/router.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    page:1,
	list:[],
	noctive:false,
	audtStatus:""
  },
  initData(){
     let user_id = wx.getStorageSync('userInfo').user_id;
     let page = this.data.page;
     request_05.myActivityList({user_id,page}).then(res=>{
        console.log(res);
        let list = res.data.data;
        this.setData({
          list,
		  noActive:!list.length>0
        }) 
     })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    request_01.login(()=>{
      this.initData();
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
    let page = this.data.page+1;
    let user_id = wx.getStorageSync('userInfo').user_id;
    request_05.myActivityList({ user_id, page }).then(res => {
      let list1 = this.data.list;
      let list2 = res.data.data;
      this.setData({
        list: [...list1, ...list12],
        page,
      })
    })
  },

  /**
   * 用户点击右上角分享
   */
//   onShareAppMessage: function () {

//   },
  goActive(e){
	  console.log(e);
	  let aid = e.currentTarget.dataset.aid;
	  let tid = e.currentTarget.dataset.tid;
	  switch (tid) {
		  case 1:
			  //1	抽奖
			  router.jump_nav({
				  url: `/pages/prize/prize?activity_id=${aid}`,
			  })
			  break;
		  case 2:
			  //2	投票
			  if (screen) {
				  router.jump_nav({
					  url: `/pages/ad/ad?activity_id=${aid}`,
				  })
			  } else {
				  router.jump_nav({
					  url: `/pages/vote/vote?activity_id=${aid}`,
				  })
			  }
			  break;
		  case 3:
			  //3	点亮
			  alert.alert({
				  str: '敬请期待'
			  })
			  break;
		  case 4:
			  //4	集攒
			  alert.alert({
				  str: '敬请期待'
			  })
			  break;
		  case 5:
			  //5	团购
			  router.jump_nav({
				  url: `/pages/assemble/pin/pin?activity_id=${aid}`,
			  })

			  break;
		  case 7:
			  //7	报名
			  alert.alert({
				  str: '敬请期待'
			  })
			  break;
		  case 11:
			  //11	看车
			  alert.alert({
				  str: '敬请期待'
			  })
			  break;
		  case 12:
			  //12	摇红包
			  alert.alert({
				  str: '敬请期待'
			  })
			  break;
		  case 13:
			  //13	砍价
			  router.jump_nav({
				  url: `/pages/bargain_index/bargain_index?activity_id=${aid}`,
			  })
			  break;
	  }
  },
	lookActive(){
		// alert(11)
		router.jump_nav({ url:"/pages/activity_list/activity_list"});
	}
})