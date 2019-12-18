// components/Spike/cmp.js

const app = getApp();//获取应用实例

Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },
  options: {
    multipleSlots: true,
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
    closePop(){
      this.triggerEvent("close")
    }
  }
})
