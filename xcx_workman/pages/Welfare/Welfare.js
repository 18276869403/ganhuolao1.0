// pages/Welfare/Welfare.js
const app = getApp()
const qingqiu = require('../../utils/request.js')
const api = require('../../utils/config.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    viewUrl: api.viewUrl,
    isShowConfirm:false,
    gongyilist:[{
      id:1,
      title:'七月敬老活动',
      content:'关爱老人，关爱留守儿童',
      time:'2020-7-20'
    },{
      id:2,
      title:'七月敬老活动',
      content:'关爱老人，关爱留守儿童',
      time:'2020-7-20'
    }],
    signName:'',
    signPhone:''
  },

  // 弹窗
  signName: function (e) {
    console.log('报名人员姓名：',e.detail.value)
    this.setData({
      signName: e.detail.value
    })
  },
  signPhone:function(e){
    console.log('报名人员电话：',e.detail.value)
    this.setData({
      signPhone:e.detail.value
    })
  },
  cancel: function () {
    var that = this
    that.setData({
      isShowConfirm: false,
    })
  },
  confirmAcceptance:function(){
    var that = this
    that.setData({
      isShowConfirm: false,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  // 公益详情
  WelfareDetail:function(){
    wx.navigateTo({
      url: '../WelfareDetail/WelfareDetail',
    })
  },
  zaixianlianxi:function(){
    this.setData({
      isShowConfirm:true
    })
  },
  // 发布工艺活动
  submitWelfare:function(){
    wx.navigateTo({
      url: '../submitWelfare/submitWelfare',
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