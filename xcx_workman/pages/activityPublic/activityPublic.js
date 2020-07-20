// pages/activity/activity.js
const qingqiu = require('../../utils/request.js')
const api = require('../../utils/config.js')
Page({
  
  /**
   * 页面的初始数据
   */
  data: {
    codew:'',
    codeh:'',
    viewUrl:api.viewUrl,
    imgurl:'',
    imageurl:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showShareMenu({
      withShareTicket: true
    })
  },
  // 分享
  fenxiang:function(){
    this.onShareAppMessage()
  },
  onShareAppMessage: function (res) {
    return {
      title: '',
      path: '/pages/activity/activity',
      success: function (res) {
        // that.shareClick();
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  getImg:function(){
    var that = this
    const ctx = wx.createCanvasContext('shareCanvas')
    var bgImgPath = that.data.viewUrl + 'static/image/tuijieyouli.png'
    console.log(bgImgPath)
    wx.downloadFile({
      url: bgImgPath, //仅为示例，并非真实的资源
      success (res) {
        // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
        if (res.statusCode === 200) {
          wx.getImageInfo({
            src: res.tempFilePath,
            success:function(res){
              let imgPath = res.path
              ctx.drawImage(imgPath, 0, 0, that.data.codew, that.data.codeh)
              wx.downloadFile({
                url: that.data.viewUrl + that.data.imgurl, //仅为示例，并非真实的资源
                success (res) {
                  // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
                  if (res.statusCode === 200) {
                    wx.getImageInfo({
                      src: res.tempFilePath,
                      success:function(res){
                          // 绘制二维码
                          ctx.drawImage(res.path, 100, that.data.codeh - 310, 160, 160)
                          ctx.draw()
                      }
                    })
                  }
                }
              })
            }
          })
        }
      }
    })
  }
})