// pages/components/dialog.js
const app = getApp()
const qingqiu = require('../../utils/request.js')
const api = require('../../utils/config.js')
Component({
  options:{
    multipleSlots:true // 在组件定义时的选项中启用多slot支持
  },
  /**
   * 组件的属性列表
   */
  properties: {
    // 弹窗标题 
    title:{
      type: String,
      value:'微信授权登录' //默认值
    },
    // 弹窗内容
    content:{
      type:String,
      value:'获取你的公开信息（昵称、头像等）'
    },
    // 弹窗确认按钮文字
    confirmText:{
      type:String,
      value:'发起授权'
    },
    cancelText:{
      type:String,
      value:'取消'
    }
  },

   /**
   * 组件内私有数据/初始数据
   */
  data: {
    // 弹窗显示控制
    isShow:false,
    iconUrl:api.iconUrl
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //隐藏弹框
    hideDialog(){
      this.setData({
        isShow: false
      })
    },
    //展示弹框
    showDialog(){
      this.setData({
        isShow: true
      })
    },
    /**
     * triggerEvent 组件之间通信
     */
    _confirmEvent(){
      this.triggerEvent("confirmEvent");
    },
    _cancelEvent(){
      this.triggerEvent("cancelEvent");
    },
    bindGetUserInfo(e){
      var that = this
      this.triggerEvent("bindGetUserInfo");
      if (e.detail.errMsg == "getUserInfo:fail auth deny") {
        wx.showToast({
          title: '未授权',
          icon: 'none',
          duration:3000
        })
        that.setData({
          isShow: true,
        })
      } else {
        wx.login({
          success: function(res) {
            var code = res.code
            wx.getUserInfo({
              lang: 'zh_CN',
              success(res) {
                // debugger
                const userInfo = res.userInfo
                var openid = wx.getStorageSync('openid')
                var data = {
                  code:code,
                  picUrl: userInfo.avatarUrl,
                  sex: userInfo.gender,
                  wxNc: userInfo.nickName,
                  backup1:openid
                }
                qingqiu.get("getKeyInfo", data, function(re) {
                  if (re.success == true) {
                    app.globalData.wxid = re.result.wxUser.id
                    if (re.result.wxUser.picUrl != null && re.result.wxUser.picUrl.length > 0) {
                      app.globalData.sqgl = 1
                    }
                    app.globalData.openid = re.result.openId
                    app.globalData.wxState = re.result.wxUser.wxState
                    app.globalData.gender = re.result.wxUser.sex
                    wx.showToast({
                      title: '授权成功',
                      icon:'success',
                      duration:1000
                    })
                    that.hideDialog();
                  }else{
                    wx.showToast({
                      title: re.message,
                      icon:'none',
                      duration:1000
                    })
                  }
                }, 'post')
              }
            })
          }
        })
      }
    }
  }
})
