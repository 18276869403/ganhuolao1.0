//获取应用实例
const app = getApp()

const qingqiu = require('../../utils/request.js')
const api = require('../../utils/config.js')
const util = require('../../utils/util.js')

Page({
  data: {
    viewUrl: api.viewUrl,
    iconUrl: api.iconUrl,
    workerDetail: [],
    showList: [],
    id: '',
    wxUserId: '',
    workerskill: '',
    price: '',
    istrue: 0,
    flag: true,
    btnFlag: false,
    index: 0,
    day: 0,
    predict: '',
    array: ['天/元', '月/元', '季/元', '年/元'],
    tian: ['天', '月', '季', '年']
  },

  getTokenValue: function () {
    // 公众号Token
    qingqiu.get("getPublicAccessToken", null, function (res) {
      if (res.success == true) {
        app.globalData.access_TokenOff = res.result.accessToken
      } else {
        wx.showToast({
          title: '令牌获取失败',
          icon: 'none'
        })
        return
      }
    })
  },
  onLoad: function (options) {
    this.getTokenValue()
    wx.showShareMenu({
      withShareTicket: true
    })
    var workerDetail = JSON.parse(options.obj)
    console.log(workerDetail)
    var id = workerDetail.id
    var phone = workerDetail.phone
    phone = util.formatPhone(phone)
    this.setData({
      id: id,
      workerDetail: workerDetail,
      phone: phone
    })
    this.grshowList()
  },
  // 图片放大，放大预览
  preview: function (e) {
    var current = e.currentTarget.dataset.src
    wx.previewImage({
      current: current, // 当前显示图片的http链接
      urls: [current] // 需要预览的图片http链接列表
    })
  },

  // 电话号显示隐藏
  phoneshow: function () {
    if (this.data.istrue == 0) {
      this.setData({
        istrue: 1
      })
    } else {
      this.setData({
        istrue: 0
      })
    }
  },
  // 获取工人晒晒
  grshowList() {
    var that = this
    var data = {
      wxUserId: this.data.id,
      pages: 1,
      size: 10
    }
    qingqiu.get("CasePage", data, function (re) {
      if (re.success == true) {
        if (re.result != null) {
          that.showList = re.result.records
          for (var i = 0; i < that.showList.length; i++) {
            that.showList[i].picOne = api.viewUrl + re.result.records[i].picOne.split(',')[0]
          }
          that.setData({
            showList: re.result.records
          })
        }
      }
    })
  },
  // 晒晒点击事件
  goshowshai: function (e) {
    var ssid = e.currentTarget.dataset.id;
    qingqiu.get("updateWxCase", {
      id: ssid
    }, function (re) {
      console.log(re)
      if (re.success == true) {
        app.globalData.showworkRefresh = 1
        wx.navigateTo({
          url: '../showDetails/showDetails?obj=' + ssid,
        })
      } else {
        wx.showToast({
          title: re.message,
          icon: 'none',
          duration: 2000
        })
      }
    }, 'put')
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
  bintapDetails: function () {
    // console.log(1)
    if (this.data.workerDetail.id == app.globalData.wxid) {
      wx.showToast({
        title: '不能雇佣自己',
        icon: 'none'
      })
      return
    }
    this.setData({
      flag: false
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
  guyongshiblur: function (e) {
    if (e.detail.value == '') {
      return
    }
    var that = this
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
          duration: 2000
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

  // 确认雇佣
  bindCon: function () {
    var that = this
    that.setData({
      btnFlag: true
    })
    if (app.globalData.wxid == "" || app.globalData.wxid == null) {
      this.onUser()
    }
    var data = {
      wxCaseId: app.globalData.wxid,
      wxCaseId2: this.data.workerDetail.id,
      estimatedCost: this.data.price,
      employmentMatters: this.data.workerskill,
      hiringTime: util.formatDate(new Date()),
      predict: this.data.predict,
      backup1: this.data.tian[this.data.day]
    }
    qingqiu.get("userWorkAdd", data, function (res) {
      console.log(res)
      that.setData({
        btnFlag: false
      })
      if (res.success == true) {
        wx.showToast({
          title: '雇佣成功',
          icon: 'success',
          duration: 2000
        })
        var obj = {
          wxUserId: that.data.workerDetail.id
        }
        qingqiu.get("getPublicUserById", obj, function (res) {
          var objdata = {
            openId: res.result.openid,
            access_token: app.globalData.access_TokenOff,
            firstValue: "干活佬有人联系你啦！",
            firstColor: '#173177',
            keyword1Value: "有人雇用你啦！",
            keyword1Color: '#173177',
            keyword2Value: util.newDate(),
            keyword2Color: '#173177',
            remarkValue: '干活佬，助力工人/商家接单！',
            remarkColor: '#173177',
            MiniUrl: ''
          }
          qingqiu.get("SendWxMsg", objdata, function (re) {
            console.log(re)
          })
        })
        setTimeout(function () {
          wx.navigateTo({
            url: '../myEmploy/myEmploy',
          })
        }, 1000)
      } else {
        wx.showToast({
          title: res.message,
          icon: 'none',
          duration: 3000
        })
        setTimeout(function () {
          wx.navigateTo({
            url: '../myInfo/myInfo?id=' + app.globalData.wxid,
          })
        })
      }
    }, 'post')
    this.setData({
      flag: true
    })
  },
  // onUser: function() {
  //   wx.login({
  //     success: function(res) {
  //       qingqiu.get("getKeyInfo", {
  //         code: res.code
  //       }, function(re) {
  //         app.globalData.wxid = re.result.wxUser.id
  //         if (re.result.wxUser.picUrl != null && re.result.wxUser.picUrl.length > 0) {
  //           app.globalData.sqgl = 1
  //         }
  //         app.globalData.openid = re.result.openId
  //         app.globalData.wxState = re.result.wxUser.wxState
  //       }, "POST")
  //     }
  //   })
  // },
  phonecall: function (e) {
    // var phone = e.currentTarget.dataset.phone;
    // wx.makePhoneCall({
    //   phoneNumber: phone,
    // }) 
    var wxId = e.currentTarget.dataset.id;
    var name = e.currentTarget.dataset.name;
    var wxNc = e.currentTarget.dataset.wxNc;
    if (name == '' || name == null || name == 'null') {
      name = wxNc
    }
    wx.navigateTo({
      url: '../HM-chat/HM-chat?id=' + wxId + "&name=" + name
    });
  },
  // 晒晒点赞
  dianzan: function (e) {
    var that = this
    var shaid = e.currentTarget.dataset.shaid;
    var data = {
      wxCaseId: shaid
    }
    qingqiu.get("userLikes", data, function (re) {
      console.log(re)
      if (re.success == true) {
        for (let obj of that.data.showList) {
          if (obj.id == shaid) {
            obj.giveGood += 1
            obj.backup1 = 1
          }
        }
        that.setData({
          showList: that.data.showList
        })
      }
    })
  },
})