// pages/mine/mine.js
//index.js
//获取应用实例
const app = getApp()
var qingqiu = require('../../utils/request.js')
var api = require('../../utils/config.js')
const util = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 0 普通用户，1工人，2商家
    viewUrl:api.viewUrl,
    iconUrl:api.iconUrl,
    userType: 0,
    star: 4,
    chushihua: '1',
    wxState: 2,
    openid:'',
    wxUser:[],
    Name:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  // onLoad: function(options) {
  //   this.chushishouquan()
  //   this.setData({
  //     wxState: app.globalData.wxState
  //   })
  //   this.getWxUser()
  // },
  // 下拉刷新
  onPullDownRefresh: function () {
    this.onShow()
    setTimeout(() => {
      wx.stopPullDownRefresh()
    }, 1000);
  },
  uploadImage:function(){
    wx.navigateTo({
      url: '../uploadImage/uploadImage',
    })
  },
  getWxUser:function(){
    var that = this
    var data = {
      wxId:app.globalData.openid,
      id:app.globalData.wxid
    }
    qingqiu.get("queryWxUser",data,function(re){
      console.log(re)
      if(re.success){
        if(re.result != null){
          if(re.result.name != ""&&re.result.name != null){
            that.setData({
              Name:re.result.name
            })
          }else if(re.result.shopName != "" && re.result.shopName != null){
            that.setData({
              Name:re.result.shopName
            })
          }else if(re.result.wxNc != "" && re.result.wxNc != null){
            that.setData({
              Name:re.result.wxNc
            })
          }
          
          if(re.result.backup4 == "0" || re.result.backup4 == "" || re.result.backup4==null){
            re.result.backup4 = "未实名认证"
          }else{
            re.result.backup4 = "实名认证"
          }
          if(re.result.backup2 == null || re.result.backup2 == ''){
            re.result.backup2 = 0
          }
          if(re.result.userPoint == null || re.result.userPoint == ''){
            re.result.userPoint = 0
          }
          if(re.result.wxState == 1){
            if(re.result.starClass == 0 || re.result.starClass == null){
              re.result.starClass = "暂未评定"
            }else if(re.result.starClass == 1){
              re.result.starClass = "一级工匠"
            }else if(re.result.starClass == 2){
              re.result.starClass = "二级工匠"
            }else if(re.result.starClass == 3){
              re.result.starClass = "三级工匠"
            }else if(re.result.starClass == 4){
              re.result.starClass = "四级工匠"
            }if(re.result.starClass == 5){
              re.result.starClass = "五级工匠"
            }
          }else if(re.result.wxState == 0){
            if(re.result.starClass == 0 || re.result.starClass == null){
              re.result.starClass = "暂未评定"
            }else if(re.result.starClass == 1){
              re.result.starClass = "一星商铺"
            }else if(re.result.starClass == 2){
              re.result.starClass = "二星商铺"
            }else if(re.result.starClass == 3){
              re.result.starClass = "三星商铺"
            }else if(re.result.starClass == 4){
              re.result.starClass = "四星商铺"
            }if(re.result.starClass == 5){
              re.result.starClass = "五星商铺"
            }
          }else{
            re.result.starClass="普通用户"
          }
          
          re.result.picIurl = that.data.viewUrl + re.result.picIurl
          // 重定义分类
          var onename = []
          var twoname = []
          if(re.result.oneClassName != null){
            if(re.result.oneClassName.indexOf(',') != -1){
              onename = re.result.oneClassName.split(',')
            }else{
              onename[0] = re.result.oneClassName
            }
          }
          if(re.result.twoClassName != null){
            if(re.result.twoClassName.indexOf(',') != -1){
              twoname = re.result.twoClassName.split(',')
            }else{
              twoname[0] = re.result.twoClassName
            }
          }
          if(onename.length > 0){
            re.result.oneClassName = onename[0] + ' | ' + twoname[0]
            if(onename.length > 1){
              re.result.twoClassName = onename[1] + ' | ' + twoname[1]
            }else{
              re.result.twoClassName = ''
            } 
          }else{
            re.result.oneClassName = ''
            re.result.twoClassName = ''
          }
          that.setData({
            wxUser:re.result,
            userType:re.result.wxState
          })
        }
      }
    })
  },

  // 授权
  chushishouquan() {
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userInfo']) {
          wx.switchTab({
            url: '../index/index',
          })
        }
      }
    })
  },

  onShow() {
    wx.showShareMenu({
      withShareTicket: true
    })
    this.chushishouquan()
    this.setData({
      wxState: app.globalData.wxState
    })
    if (app.globalData.wxid == null || app.globalData.wxid == '') {
      this.onUser()
    }else{
      this.getWxUser()
    }
  },

  onUser: function() {
    var that = this
    wx.login({
      success: function(res) {
        qingqiu.get("getKeyInfo", {
          code: res.code
        }, function(re) {
          app.globalData.wxid = re.result.wxUser.id
          if (re.result.wxUser.picUrl != null && re.result.wxUser.picUrl.length > 0) {
            app.globalData.sqgl = 1
          }
          app.globalData.openid = re.result.openId
          app.globalData.wxState = re.result.wxUser.wxState
          that.getWxUser()
          that.setData({
            openid:re.result.openId,
            userType:re.result.wxState
          })
        }, "POST")
      }
    })
  },
  // 跳转到我的雇佣页面
  myEmploy: function() {
    wx.navigateTo({
      url: '../myEmploy/myEmploy?id=' + this.data.wxUser.id,
    })
  },
  // 申请成为工人或者商家
  applyBusiness: function() {
    wx.navigateTo({
      url: '../applyBusiness/applyBusiness',
    })
  },
  // 跳转到我的资料页面
  myInfo: function () {
    if (this.data.wxUser.wxState == 2){
      wx.navigateTo({
        url: '../myInfo/myInfo?id=' + app.globalData.wxid,
      })
    }else if(this.data.wxUser.wxState == 1){
      wx.navigateTo({
        url: '../applyBusiness/applyBusiness?typeid=1',
      })
    }else{
      wx.navigateTo({  
        url: '../applyBusiness/applyBusiness?typeid=2',
      })
    }
  },
  // 跳转到我的需求页面
  myNeeds: function() {
    // getApp().globalData.xuqiuid =0
    wx.navigateTo({ 
     url: '../myneeds/myneeds',
    })
  },
  // 跳转到我的晒活页面
  showwork: function() {
    wx.navigateTo({
      url: '../myShowwork/myShowwork',
    })
  },
  // 跳转到我留言页面
  myMessage: function () {
    wx.navigateTo({
      url: '../myMessage/myMessage', 
    })
  },
  // 跳转到我的商品页面
  myGoods: function (e) {
    wx.navigateTo({
      url: '../myGoods/myGoods',
    })
  },
  // 跳转到我的剩料页面
  myMaterial:function(e){
    wx.navigateTo({
      url: '../myMaterial/myMaterial',
    })
  },
  // 跳转到我的招工页面
  myRecruitment:function(e){
    wx.navigateTo({
      url: '../myRecruitment/myRecruitment',
    })
  },
  // 跳转到我的公益页面
  myWelfare:function(e){
    wx.navigateTo({
      url: '../myWelfare/myWelfare',
    })
  },
  // 跳转到我的推荐页面
  myRecommend: function (e) {
    var myid = JSON.stringify(this.data.wxUser.id)
    wx.navigateTo({
      url: '../myRecommend/myRecommend?obj='+myid,
    })
  },
  phonecall: function () {
    wx.makePhoneCall({
      phoneNumber: '15001875806' //仅为示例，并非真实的电话号码
    })
  },
  //关注公众号
  thePublic:function(){
    wx.navigateTo({
      url: '../activityPublic/activityPublic',
    })
  }
})