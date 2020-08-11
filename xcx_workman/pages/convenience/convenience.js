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
    iconUrl: api.iconUrl,
    // 参数
    parameter: {
      date: '',
      newDate: '',
      starAddress: '',
      endAddress: '',
      typeid: -1,
      pageNo: 1,
      pageSize: 10
    },
    type: [{
        value: '1',
        name: '车找人',
        src: '../image/iconchezhaoren.png',
        type: 1
      },
      {
        value: '2',
        src: '../image/iconrenzhaoche.png',
        name: '人找车',
        type: 0
      },
      {
        value: '3',
        src: '../image/iconchezhaohuo.png',
        name: '车找货',
        type: 0
      },
      {
        value: '4',
        src: '../image/iconhuozhaoche.png',
        name: '货找车',
        type: 0
      }
    ],
    // type: ['车找人', '人找车', '车找货', '货找车'],
    conveniencelist: [],
    isLastPage: false
  },


  // 上拉功能
  onReachBottom: function () {
    if (this.data.isLastPage) {
      wx.showToast({
        title: '没有更多了！',
        icon: 'none',
        duration: 2000
      })
      return
    }
    this.setData({
      ['parameter.pageNo']: this.data.pageNo + 1
    })
    this.chushihua()
  },

  /**
   * 获取集合
   */
  chushihua: function () {
    var that = this
    var para = that.data.parameter
    var data = {
      pageNo: para.pageNo,
      pageSize: para.pageSize
    }
    if (para.typeid != -1) {
      data.type = para.typeid
    }
    if (para.date != '') {
      data.starTime = para.date
    }
    if (para.starAddress != '') {
      data.starAddress = para.starAddress
    }
    if (para.endAddress != '') {
      data.endAddress = para.endAddress
    }
    console.log(data)
    qingqiu.get("getConveniencePage", data, function (res) {
      console.log(res)
      if (res.success == true) {
        if (res.result.records == '') {
          that.data.isLastPage = true
          return
        }
        for (let obj of res.result.records) {
          obj.starTime = obj.starTime.substring(0, 10)
        }
        that.setData({
          conveniencelist: res.result.records
        })
      }
    })
  },

  /**
   * 确定按钮
   */
  queding: function () {
    this.setData({
      ['parameter.pageNo']: 1,
      conveniencelist: [],
      isLastPage: false
    })
    this.chushihua()
  },

  /**
   * 取消按钮
   */
  quxiao: function () {
    this.setData({
      showModalStatus: false
    })
  },

  /**
   * 类型选择
   * @param {*} e 
   */
  convType: function (e) {
    console.log('radio发生change事件，携带value值为：', e.currentTarget.dataset.id)
    var value = e.currentTarget.dataset.id
    var type = this.data.type
    for (let i = 0, len = type.length; i < len; i++) {
      type[i].type = 0 
      if(type[i].value == value){
        type[i].type = 1
      }
    }
    this.setData({
      ['parameter.typeid']:value,
      type:type
    })
  },

  /**
   * 跳转到详情页
   * @param {*} e 
   */
  convenienceDetails: function (e) {
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../convenienceDetails/convenienceDetails?id=' + id,
    })
  },

  /**
   * 跳转发布页面
   */
  submit: function () {
    wx.navigateTo({
      url: '../submitConvenience/submitConvenience',
    })
  },

  // 下拉刷新
  onPullDownRefresh: function () {
    this.setData({
      conveniencelist: [],
      ['parameter.typeid']: -1,
      ['parameter.pageNo']: 1,
      isLastPage: false
    })
    this.onShow()
    setTimeout(() => {
      wx.stopPullDownRefresh()
    }, 1000);
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  onShow:function(){
    this.chushihua()
    this.setData({
      ['parameter.newDate']: utils.newDate
    })
  },

  /**
   * 目的地输入框
   * @param {*} e 
   */
  endAddressinput: function (e) {
    this.setData({
      ['parameter.endAddress']: e.detail.value
    })
  },

  /**
   * 出发地输入框
   * @param {*} e 
   */
  starAddressinput: function (e) {
    this.setData({
      ['parameter.starAddress']: e.detail.value
    })
  },

  /**
   * 类型切换
   * @param {*} e 
   */
  switchType: function (e) {
    this.setData({
      ['parameter.typeid']: e.currentTarget.dataset.index
    })
  },

  /**
   * 日期选择器
   * @param {*} e 
   */
  bindDateChange: function (e) {
    console.log('事件携带值：', e.detail.value)
    this.setData({
      ['parameter.date']: e.detail.value
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
      ['parameter.typeid']: 0
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