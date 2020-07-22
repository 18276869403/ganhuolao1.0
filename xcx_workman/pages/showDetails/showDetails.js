// pages/showDetails/showDetails.js
const app = getApp()
const qingqiu = require('../../utils/request.js')
const api = require('../../utils/config.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    viewUrl:api.viewUrl,
    imgUrl: '',
    bannerImg:[],
    pinglunList:[], 
    id: 0,
    wxCaseVo: null,
    caseMsgList:[],
    imgList:[],
    ssid:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showShareMenu({
      withShareTicket: true
    })
    console.log(options.obj)
    this.setData({ssid:options.obj})
    this.ssxqbyid()
    this.pinglun()
  },
   // 晒晒详情
   ssxqbyid(){
    var that =this
    var data={
      id : that.data.ssid
    }
    qingqiu.get("pcQueryWxCaseById", data, function(re) {
      console.log(re)
    if (re.success == true) {
      if (re.result != null) {
        if(re.result.name != "null" && re.result.name != null && re.result.name != ''){
          re.result.name = re.result.name
        }else if(re.result.shopName != "null" && re.result.shopName != null && re.result.shopName != ''){
          re.result.name = re.result.shopName
        }else{
          re.result.name = re.result.wxnc
        }
        if(re.result.name == null || re.result.name == "null"){
          re.result.name = ''
        }
        that.caseMsgList = re.result
        that.imgList = that.caseMsgList.picOne.split(',')
        that.caseMsgList.picOne = that.caseMsgList.picOne.split(',')
        that.caseMsgList.addTime=that.caseMsgList.addTime.substring(0, 16)
        for(var i= 0 ; i < that.imgList.length; i++){
          that.imgList[i]=api.viewUrl+that.imgList[i]
        }
        that.setData ({
          caseMsgList : re.result,
          imgList :that.imgList
        })
      } else {
        wx.showToast({
          title: re.message,
          icon:'none',
          duration:2000
        })
      }
    } 
  })
  },
  // 晒晒评论
  pinglun(){
    var that =this
    var data={
      wxCaseId : that.data.ssid,
      pages: 1,
      size: 100
    }
    qingqiu.get("caseMessageVoList", data, function(re) {
    if (re.success == true) {
      if (re.result != null) {
        that.data.pinglunList = re.result.records
        for(var i=0;i<re.result.records.length;i++){
          if(that.data.pinglunList[i].name != null && that.data.pinglunList[i].name != '' && that.data.pinglunList[i].name !="null"){
            that.data.pinglunList[i].name = that.data.pinglunList[i].name
          }else if(that.data.pinglunList[i].shopName != null && that.data.pinglunList[i].shopName != '' && that.data.pinglunList[i].shopName != "null"){
            that.data.pinglunList[i].name = that.data.pinglunList[i].shopName
          }else{
            that.data.pinglunList[i].name = that.data.pinglunList[i].wxnc
          }
          that.data.pinglunList[i].createTime=that.data.pinglunList[i].createTime.substring(0,16)
        }
        that.setData ({
          pinglunList:that.data.pinglunList
        })
      } else {
        wx.showToast({
          title: '暂无评论！',
          icon: 'none',
          duration: 3000
        })
      }
    } 
  })
  },
  // 晒晒点击事件
  imgYu:function(event){
    var that =this
    var src = api.viewUrl+event.currentTarget.dataset.src;
    wx.previewImage({
      current: src,
      urls: that.data.imgList
    })
  },
  onShow: function() {
    this.pinglun()
  },
  fangda: function(e) {
    var img = e.currentTarget.dataset.img
    wx.previewImage({
      current: img, // 当前显示图片的http链接
      urls: this.data.bannerImg // 需要预览的图片http链接列表
    })
  },
  //跳转到添加评论页面
  comment: function() {
    wx.navigateTo({
      url: '../comment/comment?id=' + this.data.caseMsgList.id+'&wid='+this.data.caseMsgList.wxUserId,
    })
  },
  lianxita: function(e) {
    wx.makePhoneCall({
      phoneNumber: '19191919919'
    })
  },

})