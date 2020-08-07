// pages/inletWelfare/inletWelfare.js
const api = require('../../utils/config.js')
const qingqiu = require('../../utils/request.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    iconUrl: api.iconUrl,
    activityId: 0,
    isShowConfirm: false,
    signName: '',
    signPhone: '',
    btnFlag: false
  },

  // 活动说明
  activityRemark: function () {
    wx.navigateTo({
      url: '../welfareExplain/welfareExplain',
    })
  },
  // 活动详情
  WelfareDetail: function (e) {
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../WelfareDetail/WelfareDetail?id=' + id,
    })
  },
  // 作品欣赏
  showwork: function () {
    app.globalData.showtype = 0
    wx.switchTab({
      url: '../showwork/showwork',
    })
  },
  // 上传作品
  submitVote: function () {
    var that = this
    qingqiu.get("getActivityVote", {
      wxUserId: app.globalData.wxid
    }, function (res) {
      console.log(res)
      if (res.result > 0) {
        qingqiu.get("getVoteCount", {
          wxUserId: app.globalData.wxid
        }, function (re) {
          console.log(re)
          if (re.result != null) {
            var obj = JSON.stringify(re.result)
            wx.navigateTo({
              url: '../submitActivity/submitActivity?obj=' + obj,
            })
          }else{
            wx.navigateTo({
              url: '../submitActivity/submitActivity',
            })
          }
        })
      } else {
        wx.showToast({
          title: '请先报名，再来上传作品',
          icon: "none"
        })
      }
    })
  },
  //获奖公布
  votePublish:function(){
    wx.showToast({
      title: '暂未到获奖公布时间',
      icon:"none"
    })
  },

  // 弹窗
  activityJoin: function () {
    var that = this
    qingqiu.get("getActivityVote", {
      wxUserId: app.globalData.wxid
    }, function (res) {
      if (res.result > 0) {
        wx.showToast({
          title: '你己经报名，请上传作品',
          icon:'none'
        })
      } else {
        that.setData({
          isShowConfirm: true
        })
      }
    })
    
  },
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
    console.log(data)
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.id)
    this.setData({
      activityId: options.id,
      wid: options.wid
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})