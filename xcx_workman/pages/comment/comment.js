// pages/comment/comment.js
const app = getApp()
const qingqiu = require('../../utils/request.js')
const api = require('../../utils/config.js')
Page({
 
  /**
   * 页面的初始数据
   */
  data: {
    viewUrl:api.viewUrl,
    needsname: '',
    needscontent: '',
    picUrl:'',
    id: 0
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showShareMenu({
      withShareTicket: true
    })
    this.setData({id:options.id})
  },
  // 发布评论
  pinglun(){
    var that=this
    var data={
      wxId:app.globalData.wxid,
      wxCaseId:that.data.id,
      content:that.data.needscontent
    }
    qingqiu.get("insertCaseMessage", data, function(re) {
      if (re.success == true) {
        wx.showToast({
          title: '提交成功！',
          icon: 'success',
          duration: 2000
        })
        // setTimeout(function(){
        //   wx.redirectTo({
        //     url: '../showDetails/showDetails?obj=' + that.data.id,
        //   })
        // },1000)
        wx.navigateBack({
          delta: 1
        })
      }else{
        wx.showToast({
          title: re.message,
          icon: 'none',
          duration: 2000
        })
      }
    },'post')
  },
  //获取输入的评论内容
  commentinput: function (e) {
    this.setData({
      needscontent: e.detail.value
    })
  },

})