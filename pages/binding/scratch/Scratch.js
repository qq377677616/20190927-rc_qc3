// pages/binding/scratch/Scratch.js
import tool from '../../../utils/public/tool.js'
import Scrape from '../../../utils/scrape.js'
import request4 from '../../../utils/request/request_04.js'
import request1 from '../../../utils/request/request_01.js'

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    IMGSERVICE: app.globalData.IMGSERVICE,//图片基本路劲
    canvasWidth: 229, //刮刮乐宽
    canvasHeight: 137, //刮刮乐高
    prize_img: '', //奖品图片
    img: '',//
	activity_id:'',//活动id
	wordData:[],//奖品列表
	draw:false,//默认不能刮
	showWord:false,//是否显示奖品
	wordDel:null,//奖品详情
	wordstus:null,//抽奖状态
	useNum:0,//刮奖使用次数
	allNum:0,//刮奖总次数
	flag:0,//记录是第几次
	prize_log_id:null,//奖品id
	showbtn:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // 创建临时canvas绘制图片填充
    var _this = this
    let ctx2 = wx.createCanvasContext('myCanvas')
    wx.getImageInfo({
      src: 'https://game.flyh5.cn/resources/game/wechat/xw/rc_qc/assets_3.0/center/guajiang.png?v_1',
      success(res) {
        _this.setData({
          img: res.path
        })
      }
    })
	  this.setData({ activity_id: options.activity_id })
	  request1.login(() => {
		  this.setData({
			  activity_id: options.activity_id,
			  userInfo: wx.getStorageSync("userInfo"),
		  });
		  this.shaveList();
	  })
  },
  scrapeInit() {
	console.log('初始化')
    //刮刮乐初始化
    this.scrape = new Scrape(this, {
      width: this.data.canvasWidth,
      height: this.data.canvasHeight,
      maskColor: '',
      bgPic: this.data.img,
      range: "30%",
      ininOk: "scrapeIninOk",
      callback: "scrapeOk"
    })
  },
  //刮刮乐初始化OK
  scrapeIninOk() {
	this.setData({draw:true})
    tool.loading("刮刮乐初始化")
    setTimeout(() => {
      this.setData({
		  prize_img: 'https://game.flyh5.cn/resources/game/wechat/xw/rc_qc/assets_3.0/center/smimg.png'
      })
      tool.loading_h()
    }, 200)
  },
  //刮完奖回调
  scrapeOk() {
	console.log(this.data.draw);
	if(!this.data.draw){
		console.log('不能画了')
		return;
	}
    let _this = this
	  console.log("112233");
	  this.runShave();
    // tool.showModal("刮刮乐", "恭喜您刮中100元现金", "放进口袋,#CF5673", false).then(() => {
    //   tool.loading("刮刮乐重置中")
    //   setTimeout(() => {
    //     _this.scrape.init()
    //     tool.alert("刮刮乐重置成功")
    //   }, 800)
	
    // })
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(e) {
	  // 分享增加机会
	  let that  = this;
	  if(e.from=="button"){
		   that.upShare();
		   return{
			   title:"刮刮乐",
			   path:`/pages/binding/owner/owner?activity_id=57`,
			   imageUrl:'https: //game.flyh5.cn/resources/game/wechat/szq/images/img_12.jpg',
			   success(){
				   console.log("通过按钮分享上报")
				   
			   }
		   }	
	  }else{
		  return {
			  title: "刮刮乐",
			  path: `/pages/binding/owner/owner?activity_id=57`,
			  imageUrl: 'https: //game.flyh5.cn/resources/game/wechat/szq/images/img_12.jpg',
			  success() {
				  console.log("通过右上角不上报")
				//   that.upShare();
			  }
		  }
	  }
  },
	shaveList(){
		// 查询 中奖列表和 刮奖机会
		let dat = {
			activity_id:this.data.activity_id,
			openid:this.data.userInfo.openid
		}
		request4.shaveList(dat).then((res)=>{
			if(res.data.status=='1'){
				this.setData({ 
					wordstus:res.data.data.shave_info,
					wordData: this.addArr(res.data.data.win_list,4),
					useNum: res.data.data.shave_info.used_num,
					allNum: res.data.data.shave_info.all_num,
					showbtn: res.data.data.activity_info.share_num
					})
			if (this.data.useNum < this.data.allNum&&this.data.flag==0) this.scrapeInit();
				this.setData({ flag:++this.data.flag})
			}
		})
	},
	addArr(arr, n) {
		// 数组填充操作
		let _length = arr.length
		if (_length >= n) return arr
		for (let i = 0; i < n - _length; i++) {
			arr.push({ nickname: '-', prize_name: '-', create_time: '-' })
		}
		return arr
	},
	runShave(){
		//用户刮奖获得奖品
		let dat = {
			activity_id: this.data.activity_id,
			openid: this.data.userInfo.openid
		}
		request4.runShave(dat).then((res)=>{
			if (res.data.status==1){
				this.shaveList();
				this.setData({ prize_log_id:res.data.data.prize_log_id,showWord:true, draw: false, wordDel: res.data.data.prize_info, prize_img: res.data.data.prize_info.prize_img})	
			}
		})
	},
	upShare(){
		// 分享成功 获得奖品
		let dat = {
			activity_id: this.data.activity_id,
			openid: this.data.userInfo.openid
		}
		request4.upShare(dat).then((res)=>{
			if(res.data.status=="1"){
				console.log("分享成功");
				this.shaveList();
			}
		})
	},
	showTips(){
		// 分享过后 提示
		if (this.data.wordstus.is_share != '0')
		tool.alert("您已经分享过了!")
	},
	closePop(){
		//关闭弹窗
		this.setData({ showWord:false})
		if (this.data.useNum < this.data.allNum) this.scrapeInit();
	},
	my_words(){
		//领取奖品
		let obj = this.data.wordDel;
		if (obj.prize_type==4){
			this.setData({ showWord: false });
			this.shaveList();
			if (this.data.useNum < this.data.allNum) this.scrapeInit();
			return;
		}
		this.shaveList()
		obj.prize_id = this.data.prize_log_id;
		console.log(obj)
		tool.jump_nav(`/pages/binding/receive/receive?obj=${JSON.stringify(obj)}`)
	}
})