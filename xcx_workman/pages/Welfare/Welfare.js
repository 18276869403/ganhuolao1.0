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
    isShowConfirm:false, // 报名弹窗
    gongyilist:[],  // 活动集合
    titleText:'', // 搜索框
    signName:'',  //报名人数
    signPhone:'', //报名电话
    pageNo:1
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
    var data={
      sign_Name:that.data.signName,
      sign_Phone:that.data.signPhone,
      activityId:that.data.activityId
    }
    debugger
    qingqiu.get("insertActivitySign",data,function(res){
      if(res.success == true){
        wx.showToast({
          title: '报名成功',
          icon: 'none',
          duration: 2000
        })
      }
    },'post')
    that.setData({
      isShowConfirm: false,
    })
  },
  getText:function(e){
    console.log("搜索内容",e.detail.value)
    this.setData({
      titleText:e.detail.value
    })
  },
  // 搜索
  getGoods:function(){
    this.getActivity()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getActivity()
  },
  // 获取公益活动列表
  getActivity:function(){
    var that = this
    var data = {
      pageNo:that.data.pageNo,
      pageSize:10
    }
    if(that.data.titleText != '' || that.data.titleText != null || that.data.titleText != undefined){
      data.title = that.data.titleText
    }
    qingqiu.get("getActivityList",data,function(res){
      console.log('公益活动列表',res)
      if(res.success == true){
        that.setData({
          gongyilist:res.result.records
        })
      }
    })
  },
  // 公益详情
  WelfareDetail:function(e){
    var list=e.currentTarget.dataset.list
    var list1 = JSON.stringify(list)
    wx.navigateTo({
      url: '../WelfareDetail/WelfareDetail?obj='+list1,
    })
  },
  zaixianlianxi:function(e){
    var activityId=e.currentTarget.dataset.id
    this.setData({
      activityId:activityId,
      isShowConfirm:true
    })
  },
  // 发布工艺活动
  submitWelfare:function(){
    wx.navigateTo({ 
      url: '../submitWelfare/submitWelfare',
    })
  },
})