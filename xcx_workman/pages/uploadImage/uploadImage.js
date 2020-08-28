// pages/uploadImage/uploadImage.js
const api = require('../../utils/config.js')
const qingqiu = require('../../utils/request.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    viewUrl: api.viewUrl,
    iconUrl: api.iconUrl,
    tupianlists: [],
    num: 1
  },
  /**
   * 开启调试
   */
  gotop: function () {
    // 打开调试
    wx.setEnableDebug({
      enableDebug: true
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  // 图片上传（对接完成）
  upimg: function (e) {
    var that = this
    wx.chooseImage({
      count: 9,
      sizeType: ['compressed'], // 指定只能为压缩图，首先进行一次默认压缩
      sourceType: ['album', 'camera'],
      success: function (res) {
        console.log(res)
        const tempFilePaths = res.tempFilePaths;
        console.log(tempFilePaths)
        // const src = tempFilePaths[0].replace('/temp/', '/')
        wx.uploadFile({
          url: api.uploadurl,
          filePath: tempFilePaths[0],
          header: {
            // "Content-Type": "multipart/form-data"
          },
          formData: {
            method: 'POST' //请求方式
          },
          name: 'file',
          success(res) {
            console.log(res)
            var r = res.data
            var jj = JSON.parse(r);
            if (!jj.success) {
              wx.showToast({
                title: '图片上传失败',
                icon: 'none'
              })
              return
            }
            var sj = api.viewUrl + jj.message
            var tupianlists = that.data.tupianlists
            if (tupianlists.length < 9) {
              tupianlists.push(jj.message)
            }
            // tupianlists.push(jj.message)
            that.setData({
              tupianlists: tupianlists,
              picimg1: sj,
              picimgs1: jj.message
            })
          }
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