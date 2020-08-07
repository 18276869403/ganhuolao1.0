// pages/convenience/convenience.js
const api = require('../../utils/config.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    iconUrl:api.iconUrl,
    NoticeList:["1、便民站从今日开始正式开发啦！","2、点击查看便民站使用说明",'3、欢迎使用便民站'],
    index: 0,
    type: ['选择类型', '车找人', '人找车','车找货'],
    bianminlist:[{
      id:1,
      chu:'上海',
      mu:'江苏',
      time:'2020-5-20'
    },{
      id:2,
      chu:'上海',
      mu:'江苏',
      time:'2020-5-20'
    }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  
  //显示弹窗样式
  Findss: function (e) {
    this.setData({
      hasMask: true
    })
    var animation = wx.createAnimation({
      duration: 300,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.opacity(0).rotateX(-100).step();
    this.setData({
      animationData: animation.export(),
      showModalStatus: true
    })
    setTimeout(function () {
      animation.opacity(1).rotateX(0).step();
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 200)
  },
  //隐藏弹窗样式 地址
  hideModal: function () {
    var that = this;
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
      hasMask: false
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus: false
      })
    }.bind(this), 200)
  },
})