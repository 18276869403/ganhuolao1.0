// pages/myEmploy/myEmploy.js
const app = getApp()
const qingqiu = require("../../utils/request.js")
const api = require("../../utils/config.js")
const util = require("../../utils/util.js")

Page({
  /**
   * 页面的初始数据
   */
  data: {
    viewUrl: api.viewUrl,
    iconUrl: api.iconUrl,
    xqlist: {},
    id: '',
    needsTypeid: 1,
    price: '',
    istrue: 0,
    btnFlag: false,
    flag: true,
    index: 0,
    day: 0,
    predict: '',
    array: ['天/元', '月/元', '季/元', '年/元'],
    tian: ['天', '月', '季', '年'],
    showList: [],
    isLastPage: false,
    pageNo: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    wx.showShareMenu({
      withShareTicket: true
    })
    this.data.showList = []
    this.data.isLastPage = false
    this.data.pageNo = 1
    this.getShowList()
  },
  // 下拉刷新
  onPullDownRefresh: function () {
    this.onLoad()
    setTimeout(() => {
      wx.stopPullDownRefresh()
    }, 1000);
  },
  // 上拉功能
  onReachBottom: function () {
    if (this.data.isLastPage) {
      wx.showToast({
        title: '没有更多了！',
        icon: 'none',
        duration: 2000
      })
      return
    }
    this.setData({
      pageNo: this.data.pageNo + 1
    })
    this.getShowList()
  },
  // 获取晒晒
  getShowList() {
    var that = this
    var data = {
      pageNo: that.data.pageNo,
      pageSize: 10,
      wxUserId: app.globalData.wxid
    }
    qingqiu.get("casePage", data, function (re) {
      console.log(re)
      if (re.success == true) {
        if (re.result.records == '') {
          that.data.isLastPage = true
        }else{
          for (var i = 0; i < re.result.records.length; i++) {
            re.result.records[i].picOne = re.result.records[i].picOne.split(',')[0]
            that.data.showList.push(re.result.records[i])
          }
        }
        // that.data.showList=re.result.records
        that.setData({
          showList: that.data.showList
        })
      } else {
        wx.showToast({
          title: re.message,
          icon: 'none',
          duration: 2000
        })
      }
    })
  },

  // 跳转到晒晒详情页面
  showDetails: function (e) {
    var ssid = e.currentTarget.dataset.ssid;
    qingqiu.get("updateWxCase", {
      id: ssid
    }, function (re) {
      console.log(re)
      if (re.success == true) {
        app.globalData.showworkRefresh = 0
        wx.navigateTo({
          url: '../showDetails/showDetails?obj=' + ssid,
        })
      } else {
        wx.showToast({
          title: re.message,
          icon: 'none',
          duration: 2000
        })
      }
    }, 'put')

  },

   // 晒晒点赞
   dianzan: function (e) {
    var that = this
    var item = e.currentTarget.dataset.itemobj;
    var data = {
      wxCaseId: item.id,
      wxUserIdGo:app.globalData.wxid
    }
    qingqiu.get("userLikes", data, function (re) {
      console.log(re)
      if (re.success == true) {
        for (let obj of that.data.showList) {
          if (obj.id == item.id) {
            if (item.giveState == 0) {
              obj.giveGood += 1
            } else { 
              obj.giveGood -= 1
            }
            obj.giveState = item.giveState == 0 ? 1 : 0
          }
        }
        that.setData({
          showList: that.data.showList
        })
      }
    })
  },

  phonecall: function (e) {
    var phone = e.currentTarget.dataset.phone
    wx.makePhoneCall({
      phoneNumber: phone
    })
  },
  // 删除我的晒晒
  deletess(e) {
    var that = this
    that.setData({
      btnFlag: true
    })
    var data = {
      id: e.currentTarget.dataset.shaid
    }
    wx.showModal({
      title: '提示',
      content: '你确定要删除吗？',
      success (res) {
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
              that.onLoad()
            } else {
              that.setData({
                btnFlag: true
              })
            }
          }, 'delete')
        } else if (res.cancel) {
          that.setData({btnFlag:false})
          wx.showToast({
            title: '取消删除！',
            icon:'none',
            duration:2000
          })
        }
      }
    })
  },
})