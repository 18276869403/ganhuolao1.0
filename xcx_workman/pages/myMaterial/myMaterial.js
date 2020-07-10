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
    needsList:[]
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
      pageNo:1,
      pageSize:10,
      wxUserId:app.globalData.wxid,
      backup5:1
    }
    console.log(data)
    qingqiu.get("zuixinxq", data, function(re) {
      console.log(re)
      if (re.success == true) {
        if (re.result != null) {
          var needsList = that.data.needsList
          for(let obj of re.result.records){
            obj.publishTime = obj.publishTime.split(' ')[0]
            if(obj.backup1!= null&&obj.backup1.length>0){
              obj.backup1 = obj.backup1.split(',')
            }
            if(obj.needPrice == '' || obj.needPrice == 'null' || obj.needPrice == null){
              obj.needPrice = 0
            }
           needsList.push(obj)
          }
          that.setData ({
            needsList : needsList,
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
          url: '../MaterialDetails/MaterialDetails?obj1=' + xqxq,
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