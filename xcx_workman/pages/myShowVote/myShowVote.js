//获取应用实例
const app = getApp()
const qingqiu = require('../../utils/request.js')
const api = require('../../utils/config.js')
const utils = require('../../utils/util.js')
const date = new Date();
//年
var Y = date.getFullYear();
//月
var M = (date.getMonth());
//日
var D = date.getDate();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    viewUrl: api.viewUrl,
    iconUrl: api.iconUrl,
    btnFlag: false,
    activityList: [],
    voteNum: 0
  },

  /**
   * 下拉刷新
   */
  onPullDownRefresh: function () {
    this.onShow()
    setTimeout(() => {
      wx.stopPullDownRefresh()
    }, 1000);
  },

  // 获取作品列表
  getCasePageVote: function () {
    var that = this
    var data = {
      pageNo: 1,
      size: 10,
      wxUserId: app.globalData.wxid,
      wxUserIdGo: app.globalData.wxid,
      backup2: 1
    }
    qingqiu.get("getCasePageVote", data, function (res) {
      if (res.success == true) {
        if (res.result != null) {
          console.log(res)
          var activityList = that.data.activityList
          for (var i = 0; i < res.result.records.length; i++) {
            var activityimg = []
            if (res.result.records[i].picOne.indexOf(',') != -1) {
              activityimg = res.result.records[i].picOne.split(',')
            } else {
              activityimg.push(res.result.records[i].picOne)
            }
            if (res.result.records[i].caseContent == undefined || res.result.records[i].caseContent == "undefined" || res.result.records[i].caseContent == null) {
              res.result.records[i].caseContent = ''
            }
            res.result.records[i].picOne = activityimg
            activityList.push(res.result.records[i])
          }
          that.setData({
            activityList: activityList
          })
        } else {
          wx.showToast({
            title: re.message,
            icon: "none"
          })
        }
      }
    })
  },
  // 跳转到晒晒详情页面
  showVote: function (e) {
    console.log(e.currentTarget.dataset.obj)
    var item = e.currentTarget.dataset.obj;
    item = JSON.stringify(item)
    console.log(item)
    wx.navigateTo({
      url: '../showVote/showVote?url=' + item + '&repara=1',
    })
  },
  // 投票功能
  activity: function (e) {
    var that = this
    that.setData({
      btnFlag: true
    })
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userInfo']) {
          wx.showToast({
            title: '未授权，无法投票',
            icon: "none"
          })
          that.setData({
            btnFlag: false
          })
        }
      }
    })
    if (Y == 2020) {
      if (M == 9) {
        if (D < 16) {
          wx.showToast({
            title: '考虑大赛公平性，投票通道2020年9月16日开启，8月6日至7日投票数仍然有效累计。',
            icon: 'none'
          })
          that.setData({
            btnFlag: false
          })
          return
        }
      } else {
        wx.showToast({
          title: '考虑大赛公平性，投票通道2020年9月16日开启，8月6日至7日投票数仍然有效累计。',
          icon: 'none'
        })
        that.setData({
          btnFlag: false
        })
        return
      }
    } else {
      wx.showToast({
        title: '考虑大赛公平性，投票通道2020年9月16日开启，8月6日至7日投票数仍然有效累计。',
        icon: 'none'
      })
      that.setData({
        btnFlag: false
      })
      return
    }
    if (that.data.voteNum == 0) {
      wx.showToast({
        title: '当天投票次数已经用完，请明天再来...',
        icon: "none"
      })
      that.setData({
        btnFlag: false
      })
      return
    }
    var item = e.currentTarget.dataset.itemobj;
    var data = {
      wxCaseId: item.id,
      wxUserIdGo: app.globalData.wxid,
      backup1: app.globalData.wxNc,
      backup2: app.globalData.openid
    }
    qingqiu.get("voteLikes", data, function (re) {
      that.setData({
        btnFlag: false
      })
      console.log('投票', re)
      if (re.success == true) {
        for (let obj of that.data.activityList) {
          if (obj.id == item.id) {
            obj.giveGood += 1
          }
        }
        wx.showToast({
          title: '投票成功',
          icon: 'success'
        })
        that.setData({
          activityList: that.data.activityList,
          voteNum: Number(that.data.voteNum) - 1
        })
      }
    })
  },

  /**
   * 投票数量
   */
  getVoteNum: function () {
    var that = this
    qingqiu.get("getVoteNum", {
      id: app.globalData.wxid
    }, function (res) {
      console.log('投票数量', res)
      if (res.success == true) {
        that.setData({
          voteNum: res.result.backup6
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    this.setData({
      activityList: [],
    })
    this.getCasePageVote()
    this.getVoteNum()
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