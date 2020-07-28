// pages/needsDetails/needsDetails.js
const app = getApp()
//调用接口js
const qingqiu = require('../../utils/request.js')
const api = require('../../utils/config.js')
const utils = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    viewUrl:api.viewUrl,
    iconUrl:api.iconUrl,
    xqxqlist:[],
    jiedanList:[],
    tupianlist:[],
    id:'',
    wxUserid:'',
    btnFlag:false
  },

  onLoad: function (options) {
    wx.showShareMenu({
      withShareTicket: true
    })
    if(options != undefined){
      if(options.obj1 != undefined){
        var xqxqlist = JSON.parse(options.obj1)
        console.log(xqxqlist)
        xqxqlist.publishMan = utils.formatName(xqxqlist.publishMan)
        this.setData({
          xqxqlist: xqxqlist,
          id:xqxqlist.id,
          wxUserid: app.globalData.wxid
        })
      }else if(options.id != undefined){
        this.getYneed(options.id)
        this.setData({
          xqxqlist: xqxqlist,
          id:xqxqlist.id,
          wxUserid: app.globalData.wxid
        })
      }else{
        wx.showToast({
          title: '该剩料已被删除',
          icon:'none'
        })
        setTimeout(function(){
          wx.switchTab({
            url: '../index/index',
          })
        },1000)
      }
    }else{
      wx.showToast({
        title: '该剩料已被删除',
        icon:'none'
      })
      setTimeout(function(){
        wx.switchTab({
          url: '../index/index',
        })
      },1000)
    }
  }, 

   // 根据id获取详情
   getYneed(id) {
    var that = this
    qingqiu.get("yneedBy", {
      id: id
    }, function (res) {
      if (res.success == true) {
        res.result.publishTime = res.result.publishTime.split(' ')[0]
        if (res.result.backup1 != null && res.result.backup1.length > 0) {
          res.result.backup1 = res.result.backup1.split(',')
        }
        res.result.publishMan = utils.formatName(res.result.publishMan)
        that.setData({
          xqxqlist: res.result,
          xid: res.result.wxUserId
        })
      } else {
        wx.showToast({
          title: '需求已被删除',
          icon: 'none'
        })
        return
      }
    })
  },

  // 需求修改
  xiugaigunali(){ 
    wx.navigateTo({
      url: '../submitMaterial/submitMaterial?type=1&id=' + this.data.xqxqlist.id,
    })
  },
  // 需求在线联系
  zaixianlianxi(e){
    var id = e.currentTarget.dataset.wxid
    var name = e.currentTarget.dataset.name
    var shopName = e.currentTarget.dataset.shopName
    var wxNc = e.currentTarget.dataset.wxNc
    var nameV = ''
    if(name != '' && name != null && name != 'null'){
      nameV = name
    }else if(shopName != '' && shopName != null && shopName != 'null'){
      nameV = shopName
    }else{
      nameV = wxNc
    }
    wx.navigateTo({
      url: '../HM-chat/HM-chat?id=' +id+'&name=' + nameV,
    })
  },
  // 需求完成
  lianxita() {
    var that = this
    that.setData({
      btnFlag:true
    })
    var data={
      id: that.data.xqxqlist.id,
      needState: 1
    }
    qingqiu.get("needUpdateStateById", data, function(re) {
      if (re.success == true) {
        wx.showToast({
          title: '剩料已完成',
          icon: 'success',
          duration: 3000
        })
        that.setData({
          btnFlag:false
        })
        setTimeout(function(){
          wx.redirectTo({
            url: '../myMaterial/myMaterial',
          })
        },1000)
      } else{
        that.setData({
          btnFlag:false
        })
        wx.showToast({
          title: re.message,
          icon: 'none',
          duration: 2000
        })
      }
    },"put")
  },
  // 需求删除
  shancuoxuqiu() {
    var that = this
    that.setData({
      btnFlag:true
    })
    var data={
      id: that.data.id
    }
    wx.showModal({
      title:'提示',
      content:'您确定删除吗？',
      success:function(res){
        if(res.confirm){
          qingqiu.get("delYneedAndNeedSign", data, function(re) {
            if (re.success == true) {
               wx.showToast({
                 title: '删除成功',
                 icon:'success',
                 duration:2000
               })
               that.setData({
                btnFlag:false
              })
              app.globalData.materialRefresh = 1
               setTimeout(function(){
                // wx.redirectTo({
                //   url: '../myMaterial/myMaterial',
                // })
                wx.navigateBack({
                  delta: 1
                })
               },1000)
              } else {
                that.setData({
                  btnFlag:false
                })
                wx.showToast({
                  title: re.message,
                  icon: 'none',
                  duration: 2000
                })
              } 
          },'delete')
        }else{
          that.setData({
            btnFlag:false
          })
          return
        }
      }
    })
  },
  // 图片放大
  fangda:function(e){
    var currentUrl = e.currentTarget.dataset.src
    wx.previewImage({
      current: currentUrl, // 当前显示图片的http链接
      urls: [currentUrl] // 需要预览的图片http链接列表
    })
  }
})