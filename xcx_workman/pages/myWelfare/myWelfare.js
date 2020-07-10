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
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  //切换
  changeType: function(e) {
    var that = this;
    var id = e.currentTarget.dataset.id
    that.setData({
      needsTypeid: id
    })
    // this.getmyEmploy()
  },
  // 公益详情
  WelfareDetail:function(){
    wx.navigateTo({
      url: '../WelfareDetail/WelfareDetail',
    })
  },
})