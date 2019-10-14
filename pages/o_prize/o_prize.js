// pages/o_prize/o_prize.js
import tool from '../../utils/tool/tool.js'
import request_01 from '../../utils/request/request_01.js'
import api from '../../utils/request/request_03.js'
import route from "../../utils/tool/router.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShowForm: false,
    formsType: 2,//0为门店弹窗、1为详细地址弹窗、2为看车弹窗、3为报名留资弹窗
    prizeList: [],
    page: 1,
    moreType: 1,
    loadingText: '卡券领取中',
    code: '8888-8888-8888-8888'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options){
    request_01.login(() => { 
      this.myPrizeList() 
    })
  },
	goshopstroe(){//去商城
		route.jump_nav({ url:"/pages/activity_list/activity_list"})
	},
  //奖品列表
  myPrizeList() {
    let _data = {
      user_id: wx.getStorageSync("userInfo").user_id,
      openid: wx.getStorageSync("userInfo").openid,
      page: this.data.page || 1
    }
    api.myPrizeList(_data).then(res => {
      console.log("res", res)
      if (res.data.status == 1) {
        let _prizeList = this.data.prizeList
        _prizeList = _prizeList.concat(res.data.data.list)
        this.setData({ prizeList: _prizeList })
        if (this.data.page == 1 && res.data.data.list.length<1) {
          this.setData({ moreType: 0 })
        } else if (res.data.data.list.length < 10) {
          this.setData({ moreType: 2 })
        } 
        this.data.page += 1
      }
    })
  },
  //查看详情
  lookDetail(e){
    const index = e.currentTarget.dataset.index;
    const prizeList = this.data.prizeList;
    const item = prizeList[index];
    const prize_id = item.prize_id;
    
    //没领取的微信卡卷、快递 不允许查看奖品详情
    if( item.status == 0 )return;

    //奖品详情
    route.jump_nav({ 
      url:`/pages/o_prize_detail/o_prize_detail?prize_id=${prize_id}`
    })
  },
  //跳转
  jump(e) {
    let _item = this.data.prizeList[e.currentTarget.dataset.index]
    let _type = _item.prize_type
    let _id = _item.prize_id
    this.setData({ formsType: _type == 2 ? '1' : '0', curIndex: e.currentTarget.dataset.index })
    this.data.prize_type = _type
    this.data.prize_log_id = _id
    if (_type != 3) {
      this.isShowForm()
    } else {
      console.log(_item,'_item')
      if (!_item.xuni_code) {
        tool.alert("兑换码获取失败，请稍后再试~")
        return
      }
      this.setData({ code: _item.xuni_code })
      this.isShowCode()
    }
  },
  //留资领取
  submit(e) {
    console.log("留资表单", e.detail)
    console.log("this.data._popData", this.data.popData)
    let _res = e.detail
    let _data = {
      user_id: wx.getStorageSync("userInfo").user_id,
      openid: wx.getStorageSync("userInfo").openid,
      prize_log_id: this.data.prize_log_id,
      name: _res.name,
      mobile: _res.phone,
      verify_code: _res.code,
      dlr_code: _res.storeCode,
      area: _res.region.join(" "),
      address: _res.address || ''
    }
    api.pushForm(_data).then(res => {
      console.log("留资接口返回", res)
      let _data = res.data.data
      if (this.data.prize_type == 1) {
        this.addCard([res.data.data.card_info], _data.data_id)
      } else if (this.data.prize_type == 2) {
        tool.loading("信息提交中")
        setTimeout(() => {
          tool.loading_h()
          this.isShowForm()
          this.refreshStatus()
          tool.showModal("领取成功", "您的信息已提交成功，近期将会有工作人员电话联系您，敬请留意~", "好的,#124DB8", false)
        }, 800)
      } else if (this.data.prize_type == 3) {
        tool.loading("信息提交中")
        setTimeout(() => {
          tool.loading_h()
          this.refreshStatus()
          this.setData({ code: _data.xuni_code })
          this.isShowForm()
          this.isShowCode()
        })
      }
    })
  },
  //刷新按钮状态
  refreshStatus() {
    let _prizeList = this.data.prizeList
    _prizeList[this.data.curIndex].status = 1
    this.setData({ prizeList: _prizeList })
  },
  //领取卡券
  addCard(cardList, data_id) {
    this.isShowLoading()
    tool.addCard(cardList).then(res => {
      console.log("卡券返回", res)
      if (res.errMsg == "addCard:ok") {
        console.log("卡券领取成功")
        this.cardCheck(data_id, res.cardList[0].code)
      } else {
        this.isShowLoading()
        tool.alert("卡券领取失败")
      }
    }).catch(err => {
      console.log("err", err)
      this.isShowLoading()
      tool.alert("卡券领取失败")
    })
  },
  //卡券核销上报
  cardCheck(data_id, card_code) {
    let _data = {
      user_id: wx.getStorageSync("userInfo").user_id,
      prize_log_id: this.data.prize_log_id,
      data_id: data_id,
      card_code: card_code
    }
    api.cardCheck(_data).then(res => {
      console.log("卡券核销上报返回", res)
      if (res.statusCode == 200) {
        this.isShowLoading()
        tool.alert("卡券领取成功")
        this.refreshStatus()
        this.isShowForm()
        // if (this.data.prize_info.prize_type == 3) {
        //   this.isShowCode()
        // }
      }
    })
  },
  //留资弹窗打开、关闭
  isShowForm() {
    this.setData({ isShowForm: !this.data.isShowForm })
  },
  //自定义loading框
  isShowLoading() {
    this.setData({
      isShowLoading: !this.data.isShowLoading
    })
  },
  //兑换码弹窗
  isShowCode() {
    this.setData({ isShowCode: !this.data.isShowCode })
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
    this.myPrizeList()
  },
  setClipboar(){
	  var that = this;
	  wx.setClipboardData({
		  //准备复制的数据
		  data: that.data.code,
		  success: function (res) {
			  wx.showToast({
				  title: '复制成功',
			  });
		  }
	  });
  }
  /**
   * 用户点击右上角分享
   */
//   onShareAppMessage: function () {

//   }
})