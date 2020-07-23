// pages/activity02/activity02.js
var api = require('../../utils/config.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    viewUrl:api.viewUrl,
    iconUrl:api.iconUrl
  }, 
   // 跳转到涂料用量
  yyyy: function () {
    wx.navigateTo({
      url: '../calculate/calculate?obj='+1,
    })
  },
  // 跳转到地板用量
  yl02: function () {
    wx.navigateTo({
      url: '../calculate/calculate?obj='+2,
    })
  },
  // 跳转到地砖用量
  yl03: function () {
    wx.navigateTo({
      url: '../calculate/calculate?obj='+3,
    })
  },
  // 跳转到墙砖用量
  yl04: function () {
    wx.navigateTo({
      url: '../calculate/calculate?obj='+4,
    })
  },
  // 跳转到壁纸用量
  yl05: function () {
    wx.navigateTo({
      url: '../calculate/calculate?obj='+5,
    })
  },
  // 跳转到窗帘用量
  yl06: function () {
    wx.navigateTo({
      url: '../calculate/calculate?obj='+6,
    })
  },
  // 跳转到顶棚用量
  yl07: function () {
    wx.navigateTo({
      url: '../calculate/calculate?obj='+7,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showShareMenu({
      withShareTicket: true
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