// pages/myWelfare/myWelfare.js
const app = getApp()
//调用接口js
const qingqiu = require('../../utils/request.js')
const api = require('../../utils/config.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    viewUrl: api.viewUrl,
    isShowConfirm:false,
    GyTypeid:1,
    tid:'',
    type:[{
      tid:1,
      name:'我发布的公益'
    },{
      tid:2,
      name:'我参加的公益'
    }],
    gongyilist:[],
    pageNo:1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getActivity()
  },
  // 切换类型
  changetype: function(e) {
    var that = this;
    var id = e.currentTarget.dataset.id
    that.setData({
      GyTypeid: id
    })
    that.getActivity()
  },
  // 获取我发布的公益活动
  getActivity:function(){
    var that = this
    var data = {
      wxUserId:app.globalData.wxid,
      pageNo:that.data.pageNo,
      pageSize:10
    }
    if(that.data.GyTypeid==1){
      qingqiu.get("myActivityList",data,function(res){
        console.log('我发布的公益活动',res)
        if(res.success == true){
          that.setData({
            gongyilist:res.result.records
          })
        }
      })
    }else{
      qingqiu.get("myActivitySignList",data,function(res){
        console.log('我参加的公益活动',res)
        if(res.success == true){
          that.setData({
            gongyilist:res.result.records
          })
        }
      })
    }
  },
  // 公益详情
  WelfareDetail:function(e){
    var list=e.currentTarget.dataset.list
    var list1 = JSON.stringify(list)
    wx.navigateTo({
      url: '../WelfareDetail/WelfareDetail?obj='+list1,
    })
  },
})