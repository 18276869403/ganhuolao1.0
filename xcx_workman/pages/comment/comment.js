// pages/comment/comment.js
const app = getApp()
const qingqiu = require('../../utils/request.js')
const api = require('../../utils/config.js')
const utils = require('../../utils/util.js')
Page({
 
  /**
   * 页面的初始数据
   */
  data: {
    viewUrl:api.viewUrl,
    needsname: '',
    needscontent: '',
    picUrl:'',
    btnFlag:false,
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
    that.setData({
      btnFlag:true
    })
    var data={
      wxId:app.globalData.wxid,
      wxCaseId:that.data.id,
      content:that.data.needscontent
    }
    qingqiu.get("insertCaseMessage", data, function(re) {
      that.setData({
        btnFlag:false
      })
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
          var objdata = {
            openId: res.result.openid,
            access_token:app.globalData.access_TokenOff,
            firstValue:"干活佬有人联系你啦！",
            firstColor:'#173177',
            keyword1Value:"您的晒晒有人评论啦！",
            keyword1Color:'#173177',
            keyword2Value:utils.newDate(),
            keyword2Color:'#173177',
            remarkValue:'干活佬，助力工人/商家接单！',
            remarkColor:'#173177',
            MiniUrl:''
          }
         qingqiu.get("SendWxMsg",objdata,function(re){
           console.log(re)
           that.setData({
            btnFlag:false
          })
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
  commentinput:function(e){
    if(e.detail.value == ''){
      return
    }
    var that = this
    qingqiu.get("checkWords", {
      content: e.detail.value
    }, function (res) {
      if (res == 1) {
        that.setData({
          comment: ''
        })
        wx.showToast({
          title: '内容包含敏感词，请重新输入...',
          icon: 'none',
          duration: 2000
        })
        return
      } else if (res == 2) {
        wx.showToast({
          title: '校验失败',
          icon: 'none'
        })
        that.setData({
          comment: ''
        })
        return
      }
    }, 'POST')
  }
})