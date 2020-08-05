// pages/Welfare/Welfare.js
const app = getApp()
const qingqiu = require('../../utils/request.js')
const api = require('../../utils/config.js')
const utils = require('../../utils/util.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    viewUrl: api.viewUrl,
    iconUrl: api.iconUrl,
    isShowConfirm: false, // 报名弹窗
    gongyilist: [], // 活动集合
    titleText: '', // 搜索框
    signName: '', //报名人数
    signPhone: '', //报名电话
    pageNo: 1,
    wxUserId: '',
    btnFlag: false,
    isLastPage: false
  },

  // 上拉功能
  onReachBottom: function () {
    if (this.data.isLastPage) {
      wx.showToast({
        title: '没有更多了！',
        icon: 'none',
        duration: 2000
      })
      return
    }
    this.setData({
      pageNo: this.data.pageNo + 1
    })
    this.getActivity()
  },
  // 获取token值
  getTokenValue() {
    var that = this
    // 公众号Token
    qingqiu.get("getPublicAccessToken", null, function (res) {
      if (res.success == true) {
        app.globalData.access_TokenOff = res.result.accessToken
      } else {
        wx.showToast({
          title: '令牌获取失败',
          icon: 'none'
        })
        return
      }
    })
  },
  // 弹窗
  signName: function (e) {
    console.log('报名人员姓名：', e.detail.value)
    this.setData({
      signName: e.detail.value
    })
  },

  // 敏感词
  signNameblur: function (e) {
    if (e.detail.value == '') {
      return
    }
    var that = this
    qingqiu.get("checkWords", {
      content: e.detail.value
    }, function (res) {
      if (res == 1) {
        that.setData({
          signName: ''
        })
        wx.showToast({
          title: '内容包含敏感词，请重新输入...',
          icon: 'none',
          duration: 2000
        })
        return
      } else if (res == 2) {
        wx.showToast({
          title: '校验失败',
          icon: 'none'
        })
        that.setData({
          signName: ''
        })
        return
      }
    }, 'POST')
  },

  signPhone: function (e) {
    console.log('报名人员电话：', e.detail.value)
    this.setData({
      signPhone: e.detail.value
    })
  },
  cancel: function () {
    var that = this
    that.setData({
      isShowConfirm: false,
    })
  },
  
  // 提交报名
  confirmAcceptance: function () {
    var that = this
    that.setData({
      btnFlag: true
    })
    var data = {
      signName: that.data.signName,
      signPhone: that.data.signPhone,
      activityId: that.data.activityId,
      wxUserId: app.globalData.wxid
    }
    if (data.signName == "" || data.signName == undefined) {
      wx.showToast({
        title: '请输入姓名',
        icon: 'none'
      })
      that.setData({
        btnFlag: false
      })
      return
    }
    if (data.signPhone == "" || data.signPhone == undefined) {
      wx.showToast({
        title: '请输入联系电话',
        icon: 'none'
      })
      that.setData({
        btnFlag: false
      })
      return
    }
    if (data.signPhone.length != 11) {
      wx.showToast({
        title: '请输入11位数的联系电话',
        icon: 'none'
      })
      that.setData({
        btnFlag: false
      })
      return
    }
    qingqiu.get("insertActivitySign", data, function (res) {
      console.log(res)
      that.setData({
        btnFlag: false
      })
      if (res.success == true) {
        wx.showToast({
          title: '报名成功',
          icon: 'none',
          duration: 2000
        })
        var obj = {
          wxUserId: that.data.wid
        }
        qingqiu.get("getPublicUserById", obj, function (res) {
          console.log(res)
          var objdata = {
            openId: res.result.openid,
            access_token: app.globalData.access_TokenOff,
            firstValue: "干活佬有人联系你啦！",
            firstColor: '#173177',
            keyword1Value: "有人报名你的活动啦！",
            keyword1Color: '#173177',
            keyword2Value: utils.newDate(),
            keyword2Color: '#173177',
            remarkValue: '干活佬，助力工人/商家接单！',
            remarkColor: '#173177',
            MiniUrl: 'pages/WelfareDetail/WelfareDetail?id=' + that.data.activityId
          }
          console.log(objdata)
          qingqiu.get("SendWxMsg", objdata, function (re) {
            console.log(re)
          })
        })
        qingqiu.get("updateActivity", {
          id: that.data.activityId
        }, function (res) {
          that.setData({
            isShowConfirm: false,
          })
        }, "PUT")
      } else {
        wx.showToast({
          title: res.message,
          icon: 'none'
        })
        return
      }
    }, 'post')
    that.setData({
      isShowConfirm: false,
    })
  },
  getText: function (e) {
    console.log("搜索内容", e.detail.value)
    this.setData({
      titleText: e.detail.value
    })
  },
  // 搜索
  getGoods: function () {
    this.getActivity()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onShow() {
    this.getTokenValue()
    if (app.globalData.welfareRefresh != 0) {
      this.setData({
        pageNo: 1,
        gongyilist: [],
        wxUserId: app.globalData.wxid
      })
      this.getActivity()
    }
  },

  // 下拉刷新
  onPullDownRefresh: function () {
    app.globalData.welfareRefresh = 1
    this.onShow()
    setTimeout(() => {
      wx.stopPullDownRefresh()
    }, 1000);
  },

  // 获取公益活动列表
  getActivity: function () {
    console.log('我执行了吗？')
    var that = this
    var data = {
      pageNo: that.data.pageNo,
      pageSize: 10
    }
    if (that.data.titleText != '' || that.data.titleText != null || that.data.titleText != undefined) {
      data.title = that.data.titleText
    }
    qingqiu.get("getActivityList", data, function (res) {
      console.log('公益活动列表', res)
      if (res.success == true) {
        if (res.result.records.length > 0) {
          var gongyilist = that.data.gongyilist
          for (let obj of res.result.records) {
            // obj.content = obj.content.split('&hc').join('\n')
            gongyilist.push(obj)
          }
          that.setData({
            gongyilist: gongyilist
          })
        } else {
          that.setData({
            isLastPage: true
          })
          return
        }
      }
    })
  },
  // 跳转修改活动页面
  updateActivity(e) {
    var id = e.currentTarget.dataset.id
    console.log('详情id', id)
    app.globalData.welfareRefresh = 1
    wx.navigateTo({
      url: '../submitWelfare/submitWelfare?id=' + id,
    })
  },
  // 公益详情
  WelfareDetail: function (e) {
    var list = e.currentTarget.dataset.list
    console.log(list)
    app.globalData.welfareRefresh = 0
    wx.navigateTo({
      url: '../welfareInlet/welfareInlet?id=' + list.id + '&wid=' + list.wxUserId,
    })
  },
  zaixianlianxi: function (e) {
    var that = this
    var activityId = e.currentTarget.dataset.item.id
    that.setData({
      activityId: activityId,
      wid: e.currentTarget.dataset.item.wxId,
      isShowConfirm: true
    })
  },
  // 发布工艺活动
  submitWelfare: function () {
    app.globalData.welfareRefresh = 1
    wx.navigateTo({
      url: '../submitWelfare/submitWelfare',
    })
  },

  // 置顶
  goTop: function (e) {
    if (wx.pageScrollTo) {
      wx.pageScrollTo({
        scrollTop: 0,
        duration: 300
      })
    } else {
      wx.showModal({
        title: '提示',
        cancelColor: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重新',
      })
    }
  },
  // 客服
  handleContact(e) {
    console.log(e)
    console.log(e.detail.path)
    console.log(e.detail.query)
  },
})