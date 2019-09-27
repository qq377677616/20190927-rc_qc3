// components/rule/rule.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    ruleImg: {
      type: '', 
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
    isHidePop() {
      this.triggerEvent("close")
    }
  }
})
