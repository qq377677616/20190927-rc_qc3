// xw_components/Form/Form.js
const app = getApp(); //获取应用实例
import { defaultAddress, storeList } from '../../xw_api/index.js'
import { alert, loading, hideLoading } from '../../xw_utils/alert.js'
import { getPosition } from '../../xw_utils/tools.js'
import { jump_nav } from '../../xw_utils/route.js'

let userInfo = wx.getStorageSync('userInfo');
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    personalInfo: {
      type: Object,
      value: {
        isVisible: false,
        value: {}
      }
    },
    storeInfo: {
      type: Object,
      value: {
        isVisible: false,
        value: {}
      }
    },
    params: {
      type: Object,
      value: {
        btnText: '提交'
      }
    }
  },
  options: {
    multipleSlots: true,
  },
  lifetimes: {
    attached: function () {
      // 在组件实例进入页面节点树时执行
      this.initData()
    },
    detached: function () {
      // 在组件实例被从页面节点树移除时执行
    },
  },
  observers: {
    'personalInfo': function (newValue) {

      if (Boolean(newValue.value.address_id)) {
        loading({
          title: '定位中'
        })
        getPosition().then((res) => {

          let { location } = res.result
          //获取专营店
          return storeList({
            data: {
              city: newValue.value.area.split(' ')[1],
              lon: location.lng,
              lat: location.lat,
            }
          }).then((res) => {

            let storeList = res.data.data
            this.setData({
              storeList,
            })
            this.triggerEvent("changeStoreInfoHandler", {
              store:storeList[0]
            })
          }).catch((err) => {

            return storeList({
              data: {
                city: newValue.value.area.split(' ')[1],
                lon: '',
                lat: '',
              }
            }).then((res) => {
              let storeList = res.data.data

              this.setData({
                storeList,
              })
              this.triggerEvent("changeStoreInfoHandler", {
                store:storeList[0]
              })
            })

          })
        }).catch((err) => {
          alert({
            title: err.message
          })
        }).then(() => {
          hideLoading()
        })
      }

    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    IMGSERVICE: app.globalData.IMGSERVICE,
    storeList: [],
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 留资表单提交
     */
    formSubmitHandler() {
      let personalInfo = this.properties.personalInfo
      let storeInfo = this.properties.storeInfo

      const validatList = [
        {
          rule: personalInfo.isVisible && Boolean(personalInfo.value.address_id),
          tips: "请选择地址"
        },
        {
          rule: storeInfo.isVisible && Boolean(storeInfo.value.code),
          tips: "请选择专营店"
        },
      ];

      const validat = validatList.every(item => {
        if (!item.rule) {
          alert({
            title: item.tips
          })
          return false;
        } else {
          return true;
        }
      });

      if (!validat) return;

      this.triggerEvent("formSubmitHandler", {
        personalInfoValue: personalInfo.value,
        storeInfoValue: storeInfo.value,
      })
    },
    /** */
    formCancelHandler(){
      this.triggerEvent("formCancelHandler")
    },
    /**
     * 初始化
     */
    initData() {
      loading({
        title: '加载中'
      })
      //获取默认地址信息、地理位置
      defaultAddress({
        data: {
          openid: userInfo.openid,
          user_id: userInfo.user_id,
        }
      }).then((res) => {
        let { msg: msg0, status: status0, data: data0 } = res.data
        this.triggerEvent("formPersonalInfoHandler", data0)
      }).catch((err) => {
        alert({
          title: err.message,
        })
      }).then(() => {
        hideLoading()
      })
    },
    /**
     * 改变个人相关信息
     */
    changePersonalInfoHandler() {
      jump_nav(`/pages/o_address/o_address?pageType=back`)
    },
    /**
     * 改变专营店相关信息
     */
    changeStoreInfoHandler(e) {
      let storeIndex = e.detail.value
      let storeList = this.data.storeList
      let store = storeList[storeIndex]
      this.triggerEvent("changeStoreInfoHandler", {
        store
      })
    },
  }
})
