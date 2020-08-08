// pages/convenience/convenience.js
const app = getApp()
const api = require('../../utils/config.js')
const qingqiu = require('../../utils/request.js')
const utils = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    iconUrl:api.iconUrl,
    // 参数
    parameter:{
      date:'',
      newDate:'',
      starAddress:'',
      endAddress:'',
      typeid: -1,
      pageNo:1,
      pageSize:10
    },
    type: ['车找人', '人找车','车找货','货找车'],
    conveniencelist:[],
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
    }],
  },

  /**
   * 获取集合
   */
  chushihua:function(){
    var that = this
    var para = that.data.parameter
    var data = {
      pageNo:para.pageNo,
      pageSize:para.pageSize
    }
    if(para.typeid != -1){
      data.type = para.typeid
    }
    if(para.date != ''){
      data.starTime = para.date
    }
    if(para.starAddress != ''){
      data.starAddress = para.starAddress
    }
    if(para.endAddress != ''){
      data.endAddress = para.endAddress
    }
    qingqiu.get("getConveniencePage",data,function(res){
      console.log(res)
      if(res.success == true){
        for(let obj of res.result.records){
          obj.starTime = obj.starTime.substring(0,10)
        }
        that.setData({
          conveniencelist:res.result.records
        })
      }
    })
  },

  /**
   * 确定按钮
   */
  queding:function(){
    this.setData({
      conveniencelist:[]
    })
    this.chushihua()
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.chushihua()
    this.setData({
      ['parameter.newDate']:utils.newDate
    })
  },
  
  /**
   * 目的地输入框
   * @param {*} e 
   */
  endAddressinput:function(e){
    this.setData({
      ['parameter.endAddress']:e.detail.value
    })
  },

  /**
   * 出发地输入框
   * @param {*} e 
   */
  starAddressinput:function(e){
    this.setData({
      ['parameter.starAddress']:e.detail.value
    })
  },

  /**
   * 类型切换
   * @param {*} e 
   */
  switchType:function(e){
    this.setData({
      ['parameter.typeid']:e.currentTarget.dataset.index
    })
  },

  /**
   * 日期选择器
   * @param {*} e 
   */
  bindDateChange:function(e){
    console.log('事件携带值：',e.detail.value)
    this.setData({
      ['parameter.date']:e.detail.value
    })
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
      showModalStatus: true,
      ['parameter.typeid']:0
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