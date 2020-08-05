// pages/showVote/showVote.js
const app = getApp()
const api = require("../../utils/config.js")
const qingqiu = require("../../utils/request.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgurl: [],
    iconUrl: api.iconUrl,
    wxCase: {},
    title: '',
    wxUserid: '',
    voteNum:0,
    date: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options != undefined) {
      if (options.url != undefined) {
        var url = JSON.parse(options.url)
        console.log(url)
        this.setData({
          wxCase: url,
          wxUserid: app.globalData.wxid
        })
      }
    }
    this.getVoteNum()
  },

  getVoteNum: function () {
    var that = this
    qingqiu.get("getVoteNum", {
      id: app.globalData.wxid
    }, function (res) {
      console.log(res)
      if (res.success == true) {
        that.setData({
          voteNum: res.result.backup6
        })
      }
    })
  },
  editVote: function (e) {
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../submitActivity/submitActivity?id=' + id,
    })
  },

  // 投票功能
  activity: function (e) {
    var that = this
    if (that.data.voteNum == 0) {
      wx.showToast({
        title: '当天投票次数已经用完，请明天再来...',
        icon: "none"
      })
      return
    }
    var item = e.currentTarget.dataset.itemobj;
    var data = {
      wxCaseId: item.id,
      wxUserIdGo: app.globalData.wxid
    }
    qingqiu.get("voteLikes", data, function (re) {
      console.log('投票', re)
      if (re.success == true) {
        if (item.giveState == 0) {
          item.giveGood += 1
        }
        item.giveState = 1
        wx.showToast({
          title: '投票成功',
          icon: 'success'
        })
        that.setData({
          wxCase: item,
          voteNum: Number(that.data.voteNum) - 1
        })
      }
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