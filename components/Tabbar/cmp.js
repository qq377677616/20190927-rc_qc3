// components/tabber/cmp.js

const method = require('../../utils/tool/method.js');

const app = getApp();
import { jump_rel } from '../../xw_utils/route.js'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    tabbarList: {
      type: Array,
      value: [
        { text: '首页', path: '/pages/index/index' },
        { text: '看车', path: '/pages/test2/test2' },
        { text: '商城', path: '/mall_module/pages/shop_mall/shop_mall' },
        { text: '我的', path: '/pages/home/home' }
      ]
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    curTabbarIndex: null,
    isIponeX: false,
  },
  lifetimes: {
    // 在组件实例进入页面节点树时执行
    attached() {
      this.initData()
    },
    // 在组件实例被从页面节点树移除时执行
    detached: function () {

    },
  },
  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 初始化
     */
    initData() {
      let curPageUrl = this.getPageUrl();
      let tabbarList = this.properties.tabbarList;
      tabbarList.some((item, index) => {
        let tabbarUrl = item.path.slice(1)
        if (tabbarUrl == curPageUrl) {
          this.setData({
            curTabbarIndex: index
          })
          return true;
        }
      })

      /**
       * 获取手机相关信息
       */
      method.getSystem()
        .then((value) => {
          console.log("屏幕高度", value.screenHeight);
          const model = value.model;
          value.screenHeight > 667 ? wx.setStorageSync('isH', 1) : wx.setStorageSync('isH', 2);
          if (model.search('iPhone X') != -1) {
            wx.setStorageSync("isX", 1)
            this.setData({
              isIponeX: true,
            })
          } else {
            wx.setStorageSync("isX", 2)
            this.setData({
              isIponeX: false,
            })

          }
        })

    },
    /**
     * 获取页面路径
     * @param {*} n 
     */
    getPageUrl(n = 1) {
      let pages = getCurrentPages();
      let currentPage = pages[pages.length - 1];
      return currentPage.route;
    },
    /**
     * 切换tabbar
     * @param {*} e 
     */
    switchTabbarBtn(e) {
      let index = e.currentTarget.dataset.index
      let tabbarUrl = this.properties.tabbarList[index].path

      if (index == this.data.curTabbarIndex) return;

      jump_rel(tabbarUrl).then(() => {
        this.setData({
          curTabbarIndex: index
        })
      })
    }
  }
})
