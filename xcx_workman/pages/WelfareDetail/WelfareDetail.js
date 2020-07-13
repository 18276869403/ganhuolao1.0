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
    bannerImg:[
      {id:1,bannerUrl:"http://miss.it-ys.com:91/work-boot/sys/common/view/static/image/huodong1.png"},
      {id:2,bannerUrl:"http://miss.it-ys.com:91/work-boot/sys/common/view/static/image/huodong2.png"}
    ],
    xqxqlist:[],
    jiedanList:[],
    tupianlist:[],
    id:'',
    wxUserid:'',
    type:'',
  },

  aixinzhuanfa:function(e){
    this.onShareAppMessage()
  },

  onShareAppMessage: function (res) {
    return {
      title: '',
      path: '/pages/WelfareDetail/WelfareDetail',
      success: function (res) {
        // that.shareClick();
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },

  onLoad: function (options) {
    wx.showShareMenu({
      withShareTicket: true
    })
    var gongyilist = JSON.parse(options.obj)
    gongyilist.createTime=gongyilist.createTime.split(' ')[0]
    if(gongyilist.signNum==''||gongyilist.signNum==null){
      gongyilist.signNum=0
    }
    var piclist=[]
    if(gongyilist.pic!=''&&gongyilist.pic!=null){
      piclist=gongyilist.pic.split(',')
    }
    var activityid=gongyilist.id
    this.setData({
      gongyilist: gongyilist,
      piclist:piclist,
      activityid:activityid,
      wxUserId:app.globalData.wxid
    })
    console.log(gongyilist)
    this.SelectjiedanList()
  }, 
  // 接单人员
  SelectjiedanList() {
    var that = this
    var data={
      activityid:that.data.activityid
    }
    qingqiu.get("getActivitySign", data, function(re) {
      if (re.success == true) {
        if (re.result != null) {
          that.data.jiedanList=re.result
          that.setData({
            jiedanList:that.data.jiedanList
          })
          console.log(that.data.jiedanList)
        } else {
          qingqiu.tk('未查询到任何数据')
        }
      } 
    })
  },
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
      url: '../submitNeeds/submitNeeds?type=1&id=' + this.data.xqxqlist.id,
    })
  },
  // 需求人数+1
  AddActivity(){
    var data = {
      needId:that.data.id,
      wxUserId:app.globalData.wxid
    }
    qingqiu.get("updateActivity", data, function(re) {
    },'put')
  },
  // 需求报名
  baoming(){
    var that = this
    var data = {
      needId:that.data.id,
      wxUserId:app.globalData.wxid
    }
    wx.showModal({
      title:'提示',
      cancelText:'否',
      content:'你确认参与该需求吗？确认后雇主将能够看见你的联系方式！',
      confirmText:'是',
      success:function(res){
        if(res.confirm){
          console.log(data)
          qingqiu.get("insertNeedSign",data,function(res){
            if(res.success == true){
              wx.showToast({
                title: '报名成功',
                icon:'success',
                duration:2000
              })
              that.AddActivity()
              that.SelectjiedanList()
            }else{
              wx.showToast({
                title: res.message,
                icon:'none',
                duration:2000
              })
            }
          },'post')
        }else{
          return
        }
      }
    })
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
                wx.redirectTo({
                  url: '../myneeds/myneeds',
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
  // 需求完成
  lianxita() {
    var that = this
    var data={
      id: that.id,
      needState: 1
    }
    qingqiu.get("needUpdateStateById", data, function(re) {
      if (re.success == true) {
        wx.showToast({
          title: '需求已完成',
          icon: 'success',
          duration: 3000
        })
      } else{
        wx.showToast({
          title: re.message,
          icon: 'none',
          duration: 2000
        })
      }
    },"put")
  },
  // 图片放大
  fangda:function(e){
    var currentUrl = e.currentTarget.dataset.src
    wx.previewImage({
      current: currentUrl, // 当前显示图片的http链接
      urls: [currentUrl] // 需要预览的图片http链接列表
    })
  },
  // 留言
  liuyan:function(e){
    var wxid = e.currentTarget.dataset.wxid
    var name = e.currentTarget.dataset.name
    var shopName = e.currentTarget.dataset.shopName
    var wxNc = e.currentTarget.dataset.wxNc
    var nameV = ''
    if(name != '' && name != "null" && name != null && name != undefined){
      nameV = name
    }else if(shopName != '' && shopName != "null" && shopName!=null && shopName!= undefined){
      nameV = shopName
    }else{
      nameV = wxNc
    }
    wx.navigateTo({
      url: '../HM-chat/HM-chat?id=' + wxid + '&name=' + nameV,
    })
  },
  // 打电话
  phonecell:function(e){
    var phone = e.currentTarget.dataset.phone
    if(phone == null||phone==''||phone=='null'){
      wx.showToast({
        title: '联系电话为空...',
        icon:'none'
      })
      return
    }else{
      wx.makePhoneCall({
        phoneNumber: phone,
      })
    }
  }
})