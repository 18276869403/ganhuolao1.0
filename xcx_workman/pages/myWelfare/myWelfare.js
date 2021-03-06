// pages/myWelfare/myWelfare.js
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
    isShowConfirm: false,
    GyTypeid: 1,
    tid: '',
    type: [{
      tid: 1,
      name: '我发布的公益'
    }, {
      tid: 2,
      name: '我参加的公益'
    }],
    gongyilist: [],
    isLastPage: false,
    pageNo: 1,
    pageSize: 10,
    zstate:false
  },

  // 下拉刷新
  onPullDownRefresh: function () {
    this.setData({
      pageNo: 1,
      isLastPage: false,
    })
    this.onShow()
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
    this.getActivity()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function (options) {
    if(this.data.pageNo > 1){
      this.setData({
        pageSize:Number(this.data.pageNo)*10,
        zstate:true,
        gongyilist: []
      })
    }else{
      this.setData({
        gongyilist: []
      })
    }
    this.getActivity()
  },
  // 切换类型
  changetype: function (e) {
    var that = this;
    that.data.gongyilist = []
    var id = e.currentTarget.dataset.id
    that.setData({
      pageNo: 1,
      GyTypeid: id,
      gongyilist:that.data.gongyilist
    })
    that.getActivity()
  },
  // 获取我发布的公益活动
  getActivity: function () {
    var that = this
    if(that.data.zstate == true){
      var data = {
        wxUserId: app.globalData.wxid,
        pageNo: 1,
        pageSize: that.data.pageSize
      }
    }else{
      var data = {
        wxUserId: app.globalData.wxid,
        pageNo: that.data.pageNo,
        pageSize: 10
      }
    }
    console.log(data)
    if (that.data.GyTypeid == 1) {
      qingqiu.get("myActivityList", data, function (res) {
        console.log('我发布的公益活动', res)
        if (res.success == true) {
          if (res.result.records.length > 0) {
            var gongyilist = that.data.gongyilist
            for (let obj of res.result.records) {
              gongyilist.push(obj)
            }
            that.setData({
              gongyilist: gongyilist,
              zstate:false
            })
          } else {
            that.setData({
              isLastPage: true
            })
            return
          }
        }
      })
    } else {
      qingqiu.get("myActivitySignList", data, function (res) {
        console.log('我参加的公益活动', res)
        if (res.success == true) {
          if (res.result.records.length > 0) {
            var gongyilist = that.data.gongyilist
            for (let obj of res.result.records) {
              gongyilist.push(obj)
            }
            that.setData({
              gongyilist: gongyilist,
              zstate:false
            })
          } else {
            that.setData({
              isLastPage: true
            })
            return
          }
        }
      })
    }
  },
  // 公益详情
  WelfareDetail: function (e) {
    var list = e.currentTarget.dataset.list
    var list1 = JSON.stringify(list)
    wx.navigateTo({
      url: '../WelfareDetail/WelfareDetail?obj=' + list1,
    })
  },
  // 修改公益
  updateActivity:function(e){
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../submitWelfare/submitWelfare?id=' + id,
    })
  }
})