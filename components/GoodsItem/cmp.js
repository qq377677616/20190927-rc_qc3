// components/goodsItem/cmp.js
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    goodsItem:{
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
    
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //阻止冒泡
    stopPropagation(){
      return false;
    },
    goodsDetailBtn(e){
      const id = e.currentTarget.dataset.id;
      this.triggerEvent('jump', id)
    }
  }
})
