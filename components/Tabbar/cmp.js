// components/tabber/cmp.js
const router = require('../../utils/tool/router.js');

const method = require('../../utils/tool/method.js');

const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    tabbarList:{
      type:Array,
      value:[{text:'首页', path:'/pages/index/index'},{text:'看车', path:'/pages/look_car/look_car'},{text:'商城', path:'/pages/shop_mall/shop_mall'},{text:'我的', path:'/pages/home/home'}]
    },
    oData:{
      type:Object,
      value:{}
    },
    IMGSERVICE:{
      type:String,
      value:app.globalData.IMGSERVICE
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    currentIndex:null,
    isIponeX:false,
  },
  attached(){
    this.initData()
  },
  /**
   * 组件的方法列表
   */
  methods: {
    //数据初始化
    initData(){
      let currentUrl = this.getUrl();
      let tabbarList = this.properties.tabbarList;
      tabbarList.some((item, index)=>{
        if( item.path.slice(1) == currentUrl ){
          this.setData({
            currentIndex:index
          })
          return true;
        }
      })


      //获取手机信息
      method.getSystem()
        .then((value)=>{
          const model = value.model;

          if ( model.search('iPhone X') != -1 ){
              this.setData({
                isIponeX:true,
              })

          }else{

            this.setData({
              isIponeX:false,
            })

          }
        })
        
    },
    //获取当前页面路径
    getUrl(){
      let pages = getCurrentPages();
      let currentPage = pages[pages.length-1];
      return currentPage.route;
    },  

    switchBtn(e){
      let index = e.currentTarget.dataset.index;
      let url = this.properties.tabbarList[index].path;
      
      if( index == this.data.currentIndex )return;

      this.setData({currentIndex:index})

      router.jump_rel({
        url,
      })
    }
  } 
})
