// pages/classList/classList.js
const app = getApp()
const api = require('../../utils/config.js')
const qingqiu = require('../../utils/request.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    iconUrl: api.iconUrl,
    /** 一级分类 */
    oneList: [],
    twoList: [],
    toView: '',
  },

  /**
   * 一级分类
   */
  classListOne: function () {
    var that = this
    var data = {
      type: 1
    }
    qingqiu.get("oneClassList", data, function (res) {
      console.log('一级分类', res)
      that.setData({
        oneList: res.result
      })
    })
  },

  oneClass: function (e) {
    var oneid = e.currentTarget.dataset.oneid
    this.setData({
      toView: oneid
    })
    this.toView()
  },

  toView: function () {
    var toViewid = '#type' + this.data.toView
    console.log('id', toViewid)
    var scrollTop;
    const query = wx.createSelectorQuery(); // 创建节点查询器
    query.select(toViewid).boundingClientRect() // 选择toViewid获取位置信息
    query.selectViewport().scrollOffset() // 获取页面查询位置的
    query.exec(function (res) {
      console.log(res)
      scrollTop = res[0].top
      wx.pageScrollTo({
        scrollTop: scrollTop,
        duration: 300
      })
      wx.createSelectorQuery().select('.container').boundingClientRect(function (rect) {

      })
    })
  },

  /**
   * 二级分类
   */
  classListTwo: function () {
    var that = this
    var data = {
      type: 1
    }
    qingqiu.get("twoClassListAll", data, function (res) {
      console.log('所有二级分类', res)
      that.setData({
        twoList: res.result
      })
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.classListOne()
    this.classListTwo()
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