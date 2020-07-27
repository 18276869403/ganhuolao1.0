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
    if (options != undefined) {
      if (options.obj != undefined) {
        var workerDetail = JSON.parse(options.obj)
        console.log(workerDetail)
        var id = workerDetail.id
        var phone = workerDetail.phone
        phone = phone == null ? '' : util.formatPhone(phone)
        this.setData({
          id: id,
          workerDetail: workerDetail,
          phone: phone
        })
      } else if (options.id != undefined) {
        this.getWorker(options.id)
      } else {
        wx.showToast({
          title: "该工人未入驻",
          icon: "none"
        })
        setTimeout(function () {
          wx.switchTab({
            url: '../index/index',
          })
        }, 1000)
      }
    } else {
      wx.showToast({
        title: "该工人未入驻",
        icon: "none"
      })
      setTimeout(function () {
        wx.switchTab({
          url: '../index/index',
        })
      }, 1000)
    }
  },

  getWorker: function (id) {
    var that = this
    var data = {
      id: id
    }
    qingqiu.get("getWxUserById", data, function (res) {
      console.log('byid', res)
      if (res.success == true) {
        var phone = res.result.phone == null ? '' : util.formatPhone(res.result.phone)
        switch (res.result.starClass) {
          case "0":
            res.result.shopName = "暂未评定"
            break;
          case "1":
            res.result.shopName = "一级工匠"
            break;
          case "2":
            res.result.shopName = "二级工匠"
            break;
          case "3":
            res.result.shopName = "三级工匠"
            break;
          case "4":
            res.result.shopName = "四级工匠"
            break;
          case "5":
            res.result.shopName = "五级工匠"
            break;
          default:
            res.result.shopName = "暂未评定"
            break;
        }
        res.result.picIurl = that.data.iconUrl + res.result.picIurl
        res.result.dateBirth = util.ages(res.result.dateBirth)
        // 重定义分类
        var onename = []
        var twoname = []
        if (res.result.oneClassName != null) {
          if (res.result.oneClassName.indexOf(',') != -1) {
            onename = res.result.oneClassName.split(',')
          } else {
            onename[0] = res.result.oneClassName
          }
        }
        if (res.result.twoClassName != null) {
          if (res.result.twoClassName.indexOf(',') != -1) {
            twoname = res.result.twoClassName.split(',')
          } else {
            twoname[0] = res.result.twoClassName
          }
        }
        if (onename[0] != undefined) {
          res.result.oneClassName = onename[0] + ' | ' + twoname[0]
          if (onename.length > 1) {
            res.result.twoClassName = onename[1] + ' | ' + twoname[1]
          } else {
            res.result.twoClassName = ''
          }
        } else {
          res.result.oneClassName = ''
          res.result.twoClassName = ''
        }
        that.setData({
          id: res.result.id,
          workerDetail: res.result,
          phone: phone
        })
        this.grshowList()
      }
    })
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
      size: 10,
      wxUserIdGo: app.globalData.wxid
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
    var item = e.currentTarget.dataset.itemobj;
    var data = {
      wxCaseId: item.id,
      wxUserIdGo: app.globalData.wxid
    }
    qingqiu.get("userLikes", data, function (re) {
      console.log(re)
      if (re.success == true) {
        for (let obj of that.data.showList) {
          if (obj.id == item.id) {
            if (item.giveState == 0) {
              obj.giveGood += 1
            } else {
              obj.giveGood -= 1
            }
            obj.giveState = item.giveState == 0 ? 1 : 0
          }
        }
        that.setData({
          showList: that.data.showList
        })
      }
    })
  },
})