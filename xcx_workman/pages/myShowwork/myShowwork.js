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
    showList: []
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
  // 获取晒晒
  getShowList(){
    var that = this
    var data = {
      wxUserId:app.globalData.wxid
    }
    qingqiu.get("casePage",data,function(re){
      console.log(re)
      if(re.success==true){
        that.data.showList=re.result.records
        for(var i= 0 ; i < that.data.showList.length; i++){
          that.data.showList[i].picOne = api.viewUrl+re.result.records[i].picOne.split(',')[0]
        } 
        that.setData({
          showList:re.result.records
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
  // 删除我的雇佣
  delEmploy:function(e){
    var that = this
    var data = {
      id:e.currentTarget.dataset.id
    }
    qingqiu.get("deleteUserWork",data,function(res){
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