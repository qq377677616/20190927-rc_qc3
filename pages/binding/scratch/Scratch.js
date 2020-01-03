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
	create_time:null,//领奖时间
	delMC:true,//默认显示点击刮奖层
	nochange:false,//默认有机会
	firstend:0,//是否第一次抽奖机会没有
	dy_info:false,//是否接受订阅消息
	gglImg:'https://game.flyh5.cn/resources/game/wechat/xw/rc_qc/assets_3.0/guaguale',//测试图片地址
	xlzindex:0,//当前序列帧
	change:false,//默认有机会抽奖
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
      range: "50%",
      ininOk: "scrapeIninOk",
      callback: "scrapeOk",
	  scrapeStart: "scrapeStart",
	  size:40,
    })
  },//开始刮奖
	scrapeStart(){
		console.log("开始刮奖")
		// console.log(this.data.isend)
		// this.setData({
		// 	prize_img: 'https://game.flyh5.cn/resources/game/wechat/xw/rc_qc/assets_3.0/center/smimg.png'
		// })
	},
  //刮刮乐初始化OK
  scrapeIninOk() {
	console.log("初始化完成")
	this.setData({draw:true})
    tool.loading("请等待")
    setTimeout(() => {
      tool.loading_h()
    }, 800)
  },
  //刮完奖回调
  scrapeOk() {
	let flag = this.data.firstend;
	if(flag>0)return;
	console.log(this.data.useNum == this.data.allNum);
	this.setData({ firstend: this.data.useNum == this.data.allNum ? (this.data.firstend++):this.data.firstend});
	console.log(this.data.firstend);
	console.log(this.data.useNum < this.data.allNum, this.data.firstend != 0);
	  if (!(this.data.useNum < this.data.allNum) && flag!=0) {
		this.setData({ nochange: true,showWord:false});
	}else{
		this.setData({ showWord: true, nochange:false });
	}
	if(!this.data.draw){
		console.log('不能画了')
		return;
	}
	flag = this.data.useNum == this.data.allNum ? this.data.firstend++ : this.data.firstend;
	console.log(this.data.nochange)
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
			   title:"立即认证启辰车主，即可赢好礼！",
			   path: `/pages/binding/owner/owner?activity_id=${this.data.activity_id}`,
			   imageUrl:`${this.data.IMGSERVICE}/guaguale/gglshare.jpg`,
			   success(){
				   console.log("通过按钮分享上报")
			   }
		   }	
	  }else{
		  return {
			  title: "立即认证启辰车主，即可赢好礼！",
			  path: `/pages/binding/owner/owner?activity_id=${this.data.activity_id}`,
			  imageUrl: `${this.data.IMGSERVICE}/guaguale/gglshare.jpg`,
			  success() {
				  console.log("通过右上角不上报")
				//   that.upShare();
			  }
		  }
	  }
  },
	shaveList(){
		// 查询 中奖列表和 刮奖机会
		let that =this;
		let dat = {
			activity_id: this.data.activity_id,
			openid: this.data.userInfo.openid
		}
		request4.shaveList(dat).then((res)=>{
			if(res.data.status=='1'){
				this.setData({ 
					wordstus:res.data.data.shave_info,
					wordData:res.data.data.win_list,
					useNum: res.data.data.shave_info.used_num,
					allNum: res.data.data.shave_info.all_num,
					showbtn: res.data.data.activity_info.share_num
					})
				if (!(this.data.useNum < this.data.allNum)&&this.data.flag==0) {
					this.setData({ change:true});
			     }
				this.setData({ flag:++this.data.flag})
			}
		})
		.catch((reason)=>{
			console.error(reason, '????????????')
		})
	},
	addArr(arr, n) {
		// 数组填充操作
		let _length = arr.length
		if (_length >= n) return arr
		for (let i = 0; i < n - _length; i++) {
			arr.push({ nickname: '', prize_name: '', create_time: '' })
		}
		return arr
	},
	runShave() {
		//用户刮奖获得奖品
		let that = this;
		tool.loading(" ")
		let dat = {
			activity_id: this.data.activity_id,
			openid: this.data.userInfo.openid,
			agree_msg:this.data.dy_info?1:0
		}
		console.log("刮奖参数",dat)
		request4.runShave(dat).then((res)=>{
			if (res.data.status==1){
				this.playXLZ();
				this.shaveList();
				console.log("刮奖返回",res)
				this.setData({ create_time:res.data.data.date, prize_log_id:res.data.data.prize_log_id,draw: false, wordDel: res.data.data.prize_info})	
				this.scrapeInit();
				setTimeout(function(){
					that.setData({ prize_img: res.data.data.prize_info.prize_img})
				},200)
				tool.loading_h()
			}
		})
	},
	upShare() {
		// 分享成功 获得奖品
		let dat = {
			activity_id: this.data.activity_id,
			openid: this.data.userInfo.openid
		}
		request4.upShare(dat).then((res) => {
			if (res.data.status == "1") {
				console.log("分享成功");
				this.shaveList();
			}
		})
	},
	showTips() {
		// 分享过后 提示
		if (this.data.wordstus.is_share != '0')
			tool.alert("您已经分享过了!")
	},
	closePop(){
		//关闭弹窗this.setData({ isend:0})
		console.log(this.data.useNum,this.data.allNum);
		this.setData({ showWord: false, delMC: this.data.useNum < this.data.allNum, xlzindex: 0, change: this.data.useNum >= this.data.allNum})
	},
	my_words() {
		//领取奖品
		let obj = this.data.wordDel;
		if (obj.prize_type == 4) {
			this.setData({ showWord: false });
			this.shaveList();
			this.closePop();
			if (this.data.useNum < this.data.allNum) this.scrapeInit();
			return;
		}
		this.shaveList()
		obj.prize_id = this.data.prize_log_id;
		obj.create_time = this.data.create_time;
		obj.activity_id = this.data.activity_id;
		this.closePop();
		tool.jump_nav(`/pages/binding/receive/receive?obj=${JSON.stringify(obj)}`)
	},
	kjbox(){
		let that = this;
		if (this.data.useNum < this.data.allNum) {
		// if (wx.getStorageSync('dyinfo')!=1){//订阅消息暂时不用
		// 	wx.requestSubscribeMessage({
		// 		tmplIds: ['DhQWIgncCTFXk3Vi7Po1zN5cUCfwYCnMB4rw7ceeNt8'],
		// 		success(res) {
		// 			console.log("jieshou", res, res['DhQWIgncCTFXk3Vi7Po1zN5cUCfwYCnMB4rw7ceeNt8'], res.errMsg)
		// 			if (res['DhQWIgncCTFXk3Vi7Po1zN5cUCfwYCnMB4rw7ceeNt8']=="accept"){
		// 				wx.setStorageSync('dyinfo', 1)
						that.setData({ dy_info: true,delMC: false, prize_img: "" });
						that.runShave();
					}else{
						tool.alert("暂无刮奖次数!");
					}
		// 		},
		// 		fail(err) {
		// 			console.log("不接受",err)
		// 		}
		// 	})
		// 	}else{
		// 		this.setData({ delMC: false, prize_img:"" });
		// 		that.runShave();
		// 	}
		// }
	},
	playXLZ(){
		let flag = 0;
		let time = setInterval(()=>{
			console.log(flag, '==', this.data.xlzindex);
			if(flag>28){
				clearInterval(time);
				this.setData({showWord: true});
			}
			this.setData({ xlzindex: ++this.data.xlzindex})
			flag++;
		},50)
	}
})