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
    xqxqlist:[],
    jiedanList:[],
    tupianlist:[],
    id:'',
    wxUserid:''
  },

  onLoad: function (options) {
    wx.showShareMenu({
      withShareTicket: true
    })
    if(options.obj1 != undefined){
      var xqxqlist = JSON.parse(options.obj1)
      console.log(xqxqlist)
      xqxqlist.publishMan = utils.formatName(xqxqlist.publishMan)
      this.setData({
        xqxqlist: xqxqlist,
        id:xqxqlist.id,
        wxUserid: app.globalData.wxid
      })
    }
  }, 
  // // 接单人员
  // SelectjiedanList() {
  //   var that = this
  //   var data={
  //     needId: that.data.id,
  //     pages: 1,
  //     size: 10
  //   }
  //   console.log(data)
  //   qingqiu.get("needSignPage", data, function(re) {
  //     if (re.success == true) {
  //       if (re.result != null) {
  //         console.log(re)
  //         var list  = re.result.records
  //         for(let obj of list){
  //           if(obj.name != null && obj.name != "" && obj.name != "null"){
  //             obj.name = obj.name
  //           }else if(obj.shopName != null && obj.shopName != "" && obj.shopName != "null"){
  //             obj.name = obj.shopName
  //           }else{
  //             obj.name = obj.wxNc
  //           }
  //           if(obj.picIurl != null && obj.picIurl!=""&& obj.picIurl!= "null"){
  //             obj.picIurl = api.viewUrl + obj.picIurl
  //           }else{
  //             obj.picIurl = obj.picUrl
  //           }
  //           if(obj.signTime != null && obj.signTime != undefined && obj.signTime != ""){
  //             obj.signTime = obj.signTime.slice(0,16)
  //           }
  //         } 
  //         that.setData ({
  //           jiedanList : list
  //         })
  //       } else {
  //         qingqiu.tk('未查询到任何数据')
  //       }
  //     } 
  //   })
  // },
  // 图片
  // SelecttupianList() {
  //   var that = this
  //   var data={
  //     id: that.id,
  //     pages: 1,
  //     size: 10
  //   }
  //   qingqiu.get("zuixinxq", data, function(re) {
  //     if (re.success == true) {
  //       if (re.result != null) {
  //         // that.tupianlist = re.result.records
  //         for(let obj of re.result.records){
  //           obj.backup1 = api.viewUrl + obj.backup1.split(',')[0]
  //         }
  //         that.setData ({
  //           tupianlist : re.result.records
  //         })
  //         debugger
  //       } 
  //     } 
  //   })
  // },
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
        setTimeout(function(){
          wx.redirectTo({
            url: '../myMaterial/myMaterial',
          })
        },1000)
      } else{
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
               setTimeout(function(){
                // wx.redirectTo({
                //   url: '../myMaterial/myMaterial',
                // })
                wx.navigateBack({
                  delta: 1
                })
               },1000)
              } else {
                wx.showToast({
                  title: re.message,
                  icon: 'none',
                  duration: 2000
                })
              } 
          },'delete')
        }else{
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