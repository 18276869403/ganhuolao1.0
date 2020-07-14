// pages/myneeds/myneeds.js

const app = getApp()
//调用接口js
const qingqiu = require('../../utils/request.js')
const api = require('../../utils/config.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    viewUrl: api.viewUrl,
    workList: [],
    pageNo: 1
  },

  // 下拉刷新
  onPullDownRefresh: function () {
    this.onShow()
    setTimeout(() => {
      wx.stopPullDownRefresh()
    }, 1000);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    wx.showShareMenu({
      withShareTicket: true
    })
    this.FindWorklist()
  },
  // 获取招工信息列表
  FindWorklist() {
    var that = this
    var data = {
      pageNo: that.data.pageNo,
      pageSize: 10,
      // needTitle:that.data.needTitle
    }
    if (app.globalData.oneCity != undefined && app.globalData.oneCity != "undefined") {
      data.oneAreaId = app.globalData.oneCity.id
    }
    if (app.globalData.twoCity != undefined && app.globalData.twoCity != "undefined") {
      data.twoAreaId = app.globalData.twoCity.id
    }
    console.log(data)
    qingqiu.get("list", data, function (re) {
      console.log('请求数据', re)
      if (re.success == true) {
        if (re.result != null) {
          if (re.result.records == '') {
            that.data.isLastPage = true
            return
          }
          for (var i = 0; i < re.result.records.length; i++) {
            re.result.records[i].createTime = re.result.records[i].createTime.substring(0, 16)
            if (re.result.records[i].backup4 != null && re.result.records[i].backup4.length > 0) {
              re.result.records[i].backup4 = re.result.records[i].backup4.split(',')
            }
            if (re.result.records[i].backup3 == null) {
              re.result.records[i].backup3 = 0
            }
            that.data.workList.push(re.result.records[i])
          }
          that.setData({
            workList: that.data.workList
          })
        } else {
          wx.showToast({
            title: '暂无数据',
            icon: 'none',
            duration: 2000
          })
        }
      }
    })
  },
  // 跳转到需求详情页面 
  recruitmentDetail: function (e) {
    var list1 = JSON.stringify(e.currentTarget.dataset.vall)
    wx.navigateTo({
      url: '../recruitmentDetail/recruitmentDetail?obj=' + list1,
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