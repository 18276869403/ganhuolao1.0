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
    viewUrl:api.viewUrl,
    needsList:[],
    isLastPage:false,
    pageNo:1
  },

  // 下拉刷新
  onPullDownRefresh: function () {
    this.data.needsList=[]
    this.data.isLastPage=false
    this.data.pageNo=1
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
        icon:'none',
        duration:2000
      })
        return
    }
    this.setData({ pageNo: this.data.pageNo + 1 })
    this.xqneedlist()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    wx.showShareMenu({
      withShareTicket: true
    })
    this.xqneedlist()
  },
  // 需求列表
  xqneedlist() {
    var that = this
    var data={
      pageNo:that.data.pageNo,
      pageSize:10,
      wxUserId:app.globalData.wxid,
      backup5:0
    }
    qingqiu.get("zuixinxq", data, function(re) {
      console.log(re)
      if (re.success == true) {
        if (re.result != null) {
          if(re.result.records==''){
            that.data.isLastPage=true
            return
          }
          that.needsList = re.result.records
          for(var i= 0 ; i < that.needsList.length; i++){
            re.result.records[i].publishTime = re.result.records[i].publishTime.split(' ')[0]
            if(re.result.records[i].backup1!= null&&re.result.records[i].backup1.length>0){
              re.result.records[i].backup1 = re.result.records[i].backup1.split(',')
            }
            that.data.needsList.push(re.result.records[i])
          }
          that.setData ({
            needsList : that.data.needsList,
            needsListfy : re.result.records
          })
        } else {
          wx.showToast({
            title: '暂无数据',
            icon:'none',
            duration:2000
          })
        }
      } 
    })
  },
  // 跳转到需求详情页面
  needsDetails: function(e) {
    var that = this
    var obj1 =e.currentTarget.dataset.vall;
    console.log(obj1)
    var data = {
      id:obj1.id
    }
    qingqiu.get("updateYeedById",data,function(res){
      console.log(res)
      if(res.success == true){
        var xqxq = JSON.stringify(obj1);
        app.globalData.needRefresh = 0
        wx.navigateTo({
          url: '../needsDetails/needsDetails?obj1=' + xqxq,
        })
      }else{
        wx.showToast({
          title: res.message,
          icon:'none',
          duration:2000
        })
      }
    },'put')
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