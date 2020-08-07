// pages/convenienceDetails/convenienceDetails.js
const app = getApp()
const api = require("../../utils/config.js")
const qingqiu = require("../../utils/request.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    convenience:{}
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
          that.setData({
            convenience:res.result
          })
        }
      }
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.chushihuabyid(1)
    // 通过id加载数据
    if(options != undefined){
      if(options.id != undefined){
        this.chushihuabyid(options.id)
      }
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