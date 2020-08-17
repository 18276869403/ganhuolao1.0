// pages/showVote/showVote.js
const app = getApp()
const api = require("../../utils/config.js")
const qingqiu = require("../../utils/request.js")
const date = new Date();
//年
var Y = date.getFullYear();
//月
var M = (date.getMonth());
//日
var D = date.getDate();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgurl: [],
    iconUrl: api.iconUrl,
    wxCase: {},
    title: '',
    wxUserid: '',
    voteNum: 0,
    btnFlag: false,
    date: '',
    repara:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options != undefined) {
      if (options.url != undefined) {
        var url = JSON.parse(options.url)
        console.log(url)
        this.setData({
          wxCase: url,
          wxUserid: app.globalData.wxid
        })
      }
      if(options.repara != undefined){
        this.setData({
          repara:options.repara
        })
      }
    }
    this.getVoteNum()
  },

  // 图片放大
  priview: function (e) {
    var url = e.currentTarget.dataset.src
    wx.previewImage({
      current: url,
      urls: [url]
    })
  },
  getVoteNum: function () {
    var that = this
    qingqiu.get("getVoteNum", {
      id: app.globalData.wxid
    }, function (res) {
      console.log(res)
      if (res.success == true) {
        that.setData({
          voteNum: res.result.backup6
        })
      }
    })
  },
  editVote: function (e) {
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../submitActivity/submitActivity?id=' + id,
    })
  },
  deleteVote: function (e) {
    var that = this
    var data = {
      id: e.currentTarget.dataset.id
    }
    wx.showModal({
      title: '提示',
      content: '你确定要删除吗？',
      success(res) {
        if (res.confirm) {
          qingqiu.get("deletess", data, function (res) {
            console.log(res)
            if (res.success == true) {
              that.setData({
                btnFlag: false
              })
              wx.showToast({
                title: '删除成功',
                icon: 'success',
                duration: 2000
              })
              setTimeout(function () {
                if(that.data.repara == 0){
                  app.globalData.showworkRefresh = 1
                  wx.switchTab({
                    url: '../showwork/showwork',
                  })
                }else{
                  that.setData({
                    repara:0
                  })
                  wx.navigateBack({
                    delta:1
                  })
                }
              }, 1000)
            }
          }, 'delete')
        }
      }
    })
  },

  // 投票功能
  activity: function (e) {
    var that = this
    that.setData({
      btnFlag: true
    })
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userInfo']) {
          wx.showToast({
            title: '未授权，无法投票',
            icon: "none"
          })
          that.setData({
            btnFlag: false
          })
        }
      }
    })
    if (Y == 2020) {
      if (M == 9) {
        if (D < 16) {
          wx.showToast({
            title: '考虑大赛公平性，投票通道2020年9月16日开启，8月6日至7日投票数仍然有效累计。',
            icon:'none'
          })
          that.setData({
            btnFlag: false
          })
          return
        }
      }else{
        wx.showToast({
          title: '考虑大赛公平性，投票通道2020年9月16日开启，8月6日至7日投票数仍然有效累计。',
          icon:'none'
        })
        that.setData({
          btnFlag: false
        })
        return
      }
    }else{
      wx.showToast({
        title: '考虑大赛公平性，投票通道2020年9月16日开启，8月6日至7日投票数仍然有效累计。',
        icon:'none'
      })
      that.setData({
        btnFlag: false
      })
      return
    }
    if (that.data.voteNum == 0) {
      wx.showToast({
        title: '当天投票次数已经用完，请明天再来...',
        icon: "none"
      })
      that.setData({
        btnFlag: false
      })
      return
    }
    var item = e.currentTarget.dataset.itemobj;
    var data = {
      wxCaseId: item.id,
      wxUserIdGo: app.globalData.wxid,
      backup1: app.globalData.wxNc,
      backup2: app.globalData.openid
    }
    qingqiu.get("voteLikes", data, function (re) {
      that.setData({
        btnFlag: false
      })
      console.log('投票', re)
      if (re.success == true) {
        item.giveGood += 1
        wx.showToast({
          title: '投票成功',
          icon: 'success'
        })
        that.setData({
          wxCase: item,
          voteNum: Number(that.data.voteNum) - 1
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