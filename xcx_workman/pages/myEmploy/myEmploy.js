// pages/myEmploy/myEmploy.js
const app = getApp()
const qingqiu = require("../../utils/request.js")
const api = require("../../utils/config.js")
const util = require("../../utils/util.js")

Page({
  /**
   * 页面的初始数据
   */
  data: {
    viewUrl: api.viewUrl,
    xqlist: {},
    id: '',
    needsTypeid: 1,
    workerskill:'',
    needsTypeList: [{
        id: 1,
        name: '我的雇佣'
      },
      {
        id: 2,
        name: '雇佣我的'
      }
    ],
    btnFlag:false,
    price: '',
    istrue: 0,
    flag: true,
    index: 0,
    day: 0,
    predict: '',
    array: ['天/元', '月/元', '季/元', '年/元'],
    tian: ['天', '月', '季', '年'],
    messageList: [],
    isLastPage:false,
    pageNo:1
  },

  // 下拉刷新
  onPullDownRefresh: function () {
    this.data.messageList=[]
    this.data.isLastPage=false
    this.data.pageNo=1
    this.onLoad()
    setTimeout(() => {
      wx.stopPullDownRefresh()
    }, 1000);
  },
   // 上拉功能
   onReachBottom: function () {
    if (this.data.isLastPage) {
      wx.showToast({
        title: '没有更多了！',
        icon:'none',
        duration:2000
      })
        return
    }
    this.setData({ pageNo: this.data.pageNo + 1 })
    this.getmyEmploy()
  },
  /**
   * 生命周期函数--监听页面加载 
   */
  onLoad: function () {
    this.data.messageList=[]
    wx.showShareMenu({
      withShareTicket: true
    })
    this.getmyEmploy()
  },
  changeType: function (e) {
    var that = this;
    var id = e.currentTarget.dataset.id
    that.data.messageList=[]
    that.setData({
      needsTypeid: id,
      messageList:that.data.messageList
    })
    that.data.isLastPage=false
    that.data.pageNo=1
    that.getmyEmploy()
  },
  phonecall: function (e) {
    var phone = e.currentTarget.dataset.phone
    if(phone==''||phone==null){
      wx.showToast({
        title: '该用户暂未留电话号码',
        icon:'none',
        duration:2000
      })
      return
    }
    wx.makePhoneCall({
      phoneNumber: phone
    })
  },
  // 删除我的雇佣
  delEmploy: function (e) {
    var that = this
    that.setData({
      btnFlag:true
    })
    var data = {
      id: e.currentTarget.dataset.id
    }
    qingqiu.get("deleteUserWork", data, function (res) {
      console.log(res)
      if (res.success == true) {
        wx.showToast({
          title: '删除成功',
          icon: 'success',
          duration: 2000
        })
        setTimeout(function () {
          that.setData({
            btnFlag:false
          })
          that.onLoad()
        }, 1000)
      }else{
        that.setData({btnFlag:false})
      }
    }, 'delete')
  },

  // 在线联系
  liuyan: function (e) {
    var id = e.currentTarget.dataset.wxid
    var name = e.currentTarget.dataset.name
    wx.redirectTo({
      url: '../HM-chat/HM-chat?id=' + id + "&name=" + name,
    })
  },

  // 获取我的雇佣
  getmyEmploy: function () {
    var that = this
    var data = ""
    if (that.data.needsTypeid == 1) {
      data = {
        pageNo:that.data.pageNo,
        pageSize:10,
        wxCaseId: app.globalData.wxid
      }
    } else {
      data = {
        pageNo:that.data.pageNo,
        pageSize:10,
        wxCaseId2: app.globalData.wxid
      }
    }
    qingqiu.get("userWorkPage", data, function (re) {
      console.log(re)
      if (re.success == true) {
        if (re.result != null) {
          if(re.result.records==''){
            that.data.isLastPage=true
          }else{
            for (let obj of re.result.records) {
              obj.picIurl = api.viewUrl + obj.picIurl
              obj.hiringTime = obj.hiringTime.split(' ')[0]
              that.data.messageList.push(obj)
            }
            that.setData({
              messageList: that.data.messageList
            })
          }
        } else {
          wx.showToast({
            title: '未雇佣工人',
            icon: 'none',
            duration: 3000
          })
        }
      }
    })
  },
  bindPickerChange: function (e) {
    // console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
  bindPickerDay: function (e) {
    this.setData({
      day: e.detail.value
    })
  },
  bindPrice: function (e) {
    this.setData({
      price: e.detail.value
    })
  },
  bindDate: function (e) {
    this.setData({
      predict: e.detail.value
    })
  },
  bintapDetails: function (e) {
    // console.log(1)
    var xqlist = e.currentTarget.dataset.item
    xqlist.estimatedCost = xqlist.estimatedCost.replace('天/元', '')
    this.setData({
      flag: false,
      xqlist: xqlist,
      price:xqlist.estimatedCost,
      predict:xqlist.predict,
      workerskill:xqlist.employmentMatters
    })
  },
  // 修改雇佣
  bindCon: function () {
    var that = this
    that.setData({btnFlag:true})
    var data = {
      id: that.data.xqlist.id,
      estimatedCost: that.data.price + that.data.array[that.data.index],
      employmentMatters: that.data.workerskill,
      hiringTime: util.formatDate(new Date()),
      predict: that.data.predict,
      backup1: that.data.tian[that.data.day]
    }
    console.log(data)
    qingqiu.get("userWorkUpdateById", data, function (res) {
      console.log(res)
      if (res.success == true) {
        wx.showToast({
          title: '修改成功',
          icon: 'success',
          duration: 2000
        })
        setTimeout(function () {
          that.setData({btnFlag:false})
          that.onLoad()
        }, 1000)
      } else {
        that.setData({btnFlag:false})
        wx.showToast({
          title: '修改失败',
          icon: 'none',
          duration: 3000
        })
      }
    }, 'put')
    this.setData({
      flag: true
    })
  },

  
  bindClose: function () {
    this.setData({
      flag: true
    })
  },
  //获取雇佣事项
  guyongshiinput: function (e) {
    this.setData({
      workerskill: e.detail.value
    })
  },
  // 敏感词
  guyongshiblur:function(e){
    var that = this
    if(e.detail.value == ''){
      return
    }
    qingqiu.get("checkWords", {
      content: e.detail.value
    }, function (res) {
      if (res == 1) {
        that.setData({
          workerskill: ''
        })
        wx.showToast({
          title: '内容包含敏感词，请重新输入...',
          icon: 'none',
        })
        return
      } else if (res == 2) {
        wx.showToast({
          title: '校验失败',
          icon: 'none'
        })
        that.setData({
          workerskill: ''
        })
        return
      }
    }, 'POST')
  },
})