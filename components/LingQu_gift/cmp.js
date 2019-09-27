// components/LingQu_gift/cmp.js
const app = getApp();//获取应用实例
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    types: {
      type: String,
      value: '1'
    },
    data: {
      type: Object,
      value: {}
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
	  IMGSERVICE: app.globalData.IMGSERVICE,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    runFunction(e) {
      this.triggerEvent("confirm", { type: e.currentTarget.dataset.type })
    } 
  }
})
