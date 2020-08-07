// pages/convenienceDetails/convenienceDetails.js
const app = getApp()
const api = require("../../utils/config.js")
const qingqiu = require("../../utils/request.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    iconUrl:api.iconUrl,
    convenience:{},
    tupian:[]
  },

  /**
   * 通过id加载数据
   * @param {*} id 
   */
  chushihuabyid:function(id){
    var that = this
    qingqiu.get("queryconvenienceById",{id:id},function(res){
      console.log(res)
      if(res.success == true){
        if(res.result != null){
          if(res.result.pic.indexOf(',') != -1){
            that.data.tupian = res.result.pic.split(',')
          }else{
            that.data.tupian.push(res.result.pic)
          }
          that.setData({
            convenience:res.result,
            tupian:that.data.tupian
          })
        }
      }
    })
  },

  /**
   * 图片放大
   * @param {*} e 
   */
  tupian:function(e){
    var url = e.currentTarget.dataset.url
    wx.previewImage({
      current:url,
      urls: [url],
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.chushihuabyid(1)
    // 通过id加载数据
    if(options != undefined){
      if(options.id != undefined){
        this.chushihuabyid(options.id)
      }else{
        wx.showToast({
          title: '资源不存在',
          icon:'none'
        })
        setTimeout(function(){
          wx.navigateBack({
            delta:1
          })
        })
      }
    }else{
      wx.showToast({
        title: '资源不存在',
        icon:'none'
      })
      setTimeout(function(){
        wx.navigateBack({
          delta:1
        })
      })
    }
  },

  /**
   * 联系TA
   * @param {*} e 
   */
  phone:function(e){
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone,
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