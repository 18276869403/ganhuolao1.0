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
    if(gongyilist.name != '' || gongyilist.name != null){
      gongyilist.name = gongyilist.name
    }else if(gongyilist.shopName != '' || gongyilist.shopName != null){
      gongyilist.name = gongyilist.shopName
    }else{
      gongyilist.name = gongyilist.wxNc
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
 
  // 活动人数人数+1
  AddActivity(){
    var data = {
      needId:that.data.id,
      wxUserId:app.globalData.wxid
    }
    qingqiu.get("updateActivity", data, function(re) {
    },'put')
  },
  // 需求删除
  deleteActive() {
    var that = this
    var data={
      id: that.data.activityid
    }
    wx.showModal({
      title:'提示',
      content:'您确定删除吗？',
      success:function(res){
        if(res.confirm){
          qingqiu.get("delActivity", data, function(re) {
            if (re.success == true) {
               wx.showToast({
                 title: '删除成功',
                 icon:'success',
                 duration:2000
               })
               setTimeout(function(){
                wx.redirectTo({
                  url: '../Welfare/Welfare',
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
  // 活动报名
  signName: function (e) {
    console.log('报名人员姓名：',e.detail.value)
    this.setData({
      signName: e.detail.value
    })
  },
  signPhone:function(e){
    console.log('报名人员电话：',e.detail.value)
    this.setData({
      signPhone:e.detail.value
    })
  },
  woyaobaoming(e){
    this.setData({
      activityId:this.data.activityId,
      isShowConfirm:true
    })
  },
  AddnameActive:function(){
    var that = this
    var data={
      signName:that.data.signName,
      signPhone:that.data.signPhone,
      activityId:that.data.activityid,
      wxUserId:app.globalData.wxid
    }
    console.log(data)
    qingqiu.get("insertActivitySign",data,function(res){
      console.log(res)
      if(res.success == true){
        wx.showToast({
          title: '报名成功',
          icon: 'none',
          duration: 2000
        })
        qingqiu.get("updateActivity",{id:that.data.activityid},function(res){
          console.log(res)
          that.setData({
            isShowConfirm: false,
          })
        },"PUT")
        // that.onLoad()
      }
    },'post')
    that.setData({
      isShowConfirm: false,
    })
  },
  cancel: function () {
    var that = this
    that.setData({
      isShowConfirm: false,
    })
  },
  
  // 图片放大
  fangda:function(e){
    var currentUrl = e.currentTarget.dataset.src
    wx.previewImage({
      current: currentUrl, // 当前显示图片的http链接
      urls: [currentUrl] // 需要预览的图片http链接列表
    })
  },
  
})