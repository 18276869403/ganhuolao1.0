// pages/comment/comment.js
const app = getApp()
const qingqiu = require('../../utils/request.js')
const api = require('../../utils/config.js')
const util = require('../../utils/util.js')
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
    this.setData({
      id:options.id,
      wid:options.wid
    })
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
        var obj = {
          wxUserId: that.data.wid
        }
        console.log(that.data.wid)
        qingqiu.get("getPublicUserById", obj, function (res) {
          console.log(res)
          // var unionid = res.result.unionid
          var openid = res.result.openid
          var mesdata = {
            first: {
              value: "干活佬有人联系您啦！",
              color: "#173177"
            },
            keyword1: {
              value: "您的晒晒有人评论了！",
              color: "#173177"
            },
            keyword2: {
              value: util.nowTime(),
              color: "#173177"
            },
            remark: {
              value: "干活佬,助力工人/商家接单！",
              color: "#173177"
            }
          }
          var objdata = {
            touser: openid,
            template_id: "JOX1BcyAiT8BbZdmlB3fAfwzOT5Ud25Tl_WjTDM1ycY",
            miniprogram: {
              appid: "wx14e076d27e942480"
            },
            url: "http://www.baidu.com/",
            data: mesdata
          }
          wx.request({
            url: 'https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=' + app.globalData.access_TokenOff,
            data: objdata,
            method: 'POST',
            success: function (res) {
              console.log(res)
            }
          })
          wx.navigateBack({
            delta: 1
          })
        })
        // wx.navigateBack({
        //   delta: 1
        // })
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