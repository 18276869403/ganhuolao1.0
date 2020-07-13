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
    gongyilist:[{
      id:1,
      title:'七月敬老活动',
      content:'于本月20日组织爱心人士前往万载养老院，针对老师做些基本护理工作，帮助老人打扫房间、清理敬老院；陪老人聊天、散步、锻炼身体；为老人奉上丰富多彩的文艺表演活动；进行各种各样的小活动。欢迎爱心人士踊跃报名',
      time:'2020-7-20'
    },{
      id:2,
      title:'七月敬老活动',
      content:'关爱老人，关爱留守儿童',
      time:'2020-7-20' 
    }],
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
  // 获取公益活动列表
  getActivity:function(){
    var that = this
    var data = {
      wxUserId:app.globalData.wxid,
      pageNo:that.data.pageNo,
      pageSize:10
    }
    qingqiu.get("getActivityList",data,function(res){
      console.log('我的公益活动列表',res)
      if(res.success == true){
        that.setData({
          gongyilist:res.result.records
        })
      }
    })
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