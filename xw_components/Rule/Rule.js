// xw_components/Rule/Rule.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    ruleUrl: {
      type: String, 
      value: ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    IMGSERVICE: getApp().globalData.IMGSERVICE
  },

  /**
   * 组件的方法列表
   */
  methods: {
    isVisibleHandler() {
      this.triggerEvent("close")
    }
  }
})
