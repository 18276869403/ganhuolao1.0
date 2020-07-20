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
    isShowConfirm: false, // 报名弹窗
    gongyilist: [], // 活动集合
    titleText: '', // 搜索框
    signName: '', //报名人数
    signPhone: '', //报名电话
    pageNo: 1,
    wxUserId: '',
    btnFlag:false,
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
      btnFlag:true
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
        btnFlag:false
      })
      return
    }
    if (data.signPhone == "" || data.signPhone == undefined) {
      wx.showToast({
        title: '请输入联系电话',
        icon: 'none'
      })
      that.setData({
        btnFlag:false
      })
      return
    }
    if (data.signPhone.length != 11) {
      wx.showToast({
        title: '请输入11位数的联系电话',
        icon: 'none'
      })
      that.setData({
        btnFlag:false
      })
      return
    }
    console.log(data)
    qingqiu.get("insertActivitySign", data, function (res) {
      console.log(res)
      that.setData({
        btnFlag:false
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
        console.log(that.data.wid)
        qingqiu.get("getPublicUserById", obj, function (res) {
          console.log(res)
          var objdata = {
            openId: res.result.openid,
            access_token:app.globalData.access_TokenOff,
            firstValue:"干活佬有人联系你啦！",
            firstColor:'#173177',
            keyword1Value:"有人报名你的活动啦！",
            keyword1Color:'#173177',
            keyword2Value:utils.newDate(),
            keyword2Color:'#173177',
            remarkValue:'干活佬，助力工人/商家接单！',
            remarkColor:'#173177',
            MiniUrl:''
          }
         qingqiu.get("SendWxMsg",objdata,function(re){
           console.log(re)
         })
        })
        qingqiu.get("updateActivity", {
          id: that.data.activityId
        }, function (res) {
          console.log(res)
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
  onLoad: function (options) {
    this.getTokenValue()
    this.getActivity()
    this.setData({
      wxUserId: app.globalData.wxid
    })
  },

  // 下拉刷新
  onPullDownRefresh: function () {
    this.setData({
      pageNo: 1,
      gongyilist: []
    })
    this.onLoad()
    setTimeout(() => {
      wx.stopPullDownRefresh()
    }, 1000);
  },

  // 获取公益活动列表
  getActivity: function () {
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
  // 公益详情
  WelfareDetail: function (e) {
    var list = e.currentTarget.dataset.list
    var list1 = JSON.stringify(list)
    wx.navigateTo({
      url: '../WelfareDetail/WelfareDetail?obj=' + list1,
    })
  },
  zaixianlianxi: function (e) {
    var that=this
    var activityId = e.currentTarget.dataset.item.id
    that.setData({
      activityId: activityId,
      wid:e.currentTarget.dataset.item.wxId,
      isShowConfirm: true
    })
  },
  // 发布工艺活动
  submitWelfare: function () {
    wx.navigateTo({
      url: '../submitWelfare/submitWelfare',
    })
  },
})