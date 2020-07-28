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
    iconUrl: api.iconUrl,
    pageNo: 1,
    pageSize:10,
    isLastPage: false,
    needsList: [],
    zstate:false
  },

  // 下拉刷新
  onPullDownRefresh: function () {
    this.setData({
      pageNo: 1,
      isLastPage: false,
      needsList: []
    })
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
    this.xqneedlist()
  },
  
  // 需求列表
  xqneedlist() {
    var that = this
    if(this.data.zstate==true){
      var data = {
        pageNo: 1,
        pageSize: that.data.pageSize,
        wxUserId: app.globalData.wxid,
        backup5: 1
      }
    }else{
      var data = {
        pageNo: that.data.pageNo,
        pageSize: 10,
        wxUserId: app.globalData.wxid,
        backup5: 1
      }
    }
    console.log(data)
    qingqiu.get("zuixinxq", data, function (re) {
      console.log(re)
      if (re.success == true) {
        that.data.zstate=false
        if (re.result != null) {
          if (re.result.records.length > 0) {
            var needsList = that.data.needsList
            for (let obj of re.result.records) {
              obj.publishTime = obj.publishTime.split(' ')[0]
              if (obj.backup1 != null && obj.backup1.length > 0) {
                obj.backup1 = obj.backup1.split(',')
              }
              if (obj.needPrice == '' || obj.needPrice == 'null' || obj.needPrice == null) {
                obj.needPrice = 0
              }
              needsList.push(obj)
            }
            that.setData({
              needsList: needsList,
            })
          } else {
            that.setData({
              isLastPage: true
            })
            return
          }
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
  needsDetails: function (e) {
    var that = this
    var obj1 = e.currentTarget.dataset.vall;
    console.log(obj1)
    var data = {
      id: obj1.id
    }
    qingqiu.get("updateYeedById", data, function (res) {
      console.log(res)
      if (res.success == true) {
        var xqxq = JSON.stringify(obj1);
        app.globalData.needRefresh = 0
        wx.navigateTo({
          url: '../MaterialDetails/MaterialDetails?obj1=' + xqxq,
        })
      } else {
        wx.showToast({
          title: res.message,
          icon: 'none',
          duration: 2000
        })
      }
    }, 'put')
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onLoad: function () {
    this.data.isLastPage=false
    this.data.needsList=[]
    if(this.data.pageNo>1){
      this.data.pageSize=Number(this.data.pageNo)*10
      this.data.zstate=true
    }
    wx.showShareMenu({
      withShareTicket: true
    })
    this.xqneedlist()
  },

})