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
    viewUrl:api.viewUrl,
    xqlist:{},
    id:'',
    needsTypeid: 1,
    price:'',
    istrue:0,
    flag: true,
    index: 0,
    day: 0,
    predict:'',
    array: ['天/元', '月/元', '季/元', '年/元'],
    tian: ['天', '月', '季', '年'],
    showList: [],
    isLastPage:false,
    pageNo:1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function() {
    wx.showShareMenu({
      withShareTicket: true
    })
    this.getShowList()
  },
  // 下拉刷新
  onPullDownRefresh: function () {
    this.data.showList=[]
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
    this.getShowList()
  },
  // 获取晒晒
  getShowList(){
    var that = this
    var data = {
      wxUserId:app.globalData.wxid
    }
    qingqiu.get("casePage",data,function(re){
      console.log(re)
      if(re.success==true){
        if(re.result.records==''){
          that.data.isLastPage=true
          return
        }
        // that.data.showList=re.result.records
        for(var i= 0 ; i < re.result.records.length; i++){
          re.result.records[i].picOne = api.viewUrl+re.result.records[i].picOne.split(',')[0]
          that.data.showList.push(re.result.records[i])
        } 
        that.setData({
          showList:that.data.showList
        })
      }else{
        wx.showToast({
          title: re.message,
          icon:'none',
          duration:2000
        })
      }
    })
  },

  // 跳转到晒晒详情页面
  showDetails: function(e) {
    var ssid =e.currentTarget.dataset.ssid;
    qingqiu.get("updateWxCase",{id:ssid},function(re){
      console.log(re)
      if(re.success == true){
        app.globalData.showworkRefresh = 0
        wx.navigateTo({
          url: '../showDetails/showDetails?obj='+ssid,
        })
      }else{
        wx.showToast({
          title: re.message,
          icon:'none',
          duration:2000
        })
      }
    },'put')
    
  },
  
  phonecall: function(e) {
    var phone = e.currentTarget.dataset.phone
    wx.makePhoneCall({
      phoneNumber: phone 
    })
  },
  // 删除我的晒晒
  deletess(e){
    var that = this
    var data = {
      id:e.currentTarget.dataset.shaid
    }
    debugger
    qingqiu.get("",data,function(res){
      console.log(res)
      if(res.success == true){
        wx.showToast({
          title: '删除成功',
          icon:'success',
          duration:2000
        })
      }
    },'delete')
  },
})