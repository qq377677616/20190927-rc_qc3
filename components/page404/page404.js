// components/page404/page404.js
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    
  },

  /**
   * 组件的初始数据
   */
  data: {
    IMGSERVICE: app.globalData.IMGSERVICE
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //重新加载
    reload() {
      this.triggerEvent("reload")
    }
  }
})
