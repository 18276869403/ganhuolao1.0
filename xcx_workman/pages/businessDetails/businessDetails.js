// pages/businessDetails/businessDetails.js
//获取应用实例
const app = getApp()

const qingqiu = require('../../utils/request.js')
const api = require('../../utils/config.js')

Page({
  data: {
    viewUrl: api.viewUrl,
    goodsList: [],
    iconUrl: api.iconUrl,
    score: 3,
    CheckItem: 0,
    goodsList: [],
    showList: [],
    goodsdata1: [{
        colName: "商品",
        id: 0
      },
      {
        colName: "晒晒",
        id: 1
      }
    ],
    goodslists: []
  },
  // 图片预览
  tupian: function (e) {
    var current = e.currentTarget.dataset.src
    wx.previewImage({
      current: current, //当前显示图片的http链接，我这边是把图片转成了base64
      urls: [current] //需要预览的图片http链接列表
    })
  },
  onLoad: function (options) {
    wx.showShareMenu({
      withShareTicket: true
    })
    this.getBusiness(1797)
    if (options != undefined) {
      if (options.obj != undefined) {
        var obj = JSON.parse(options.obj)
        console.log(obj)
        if (obj.wxNc == null) {
          obj.wxNc = ""
        }
        this.setData({
          goodsList: obj
        })
        this.getGoodsList(obj.id)
        this.getGoodsdata(obj.id)
      } else if(options.id) {
        this.getBusiness(options.id)
      } else {
        wx.showToast({
          title: '该商家未入驻',
          icon: 'none'
        })
        setTimeout(function () {
          wx.switchTab({
            url: '../index/index',
          })
        }, 1000)
      }
    } else {
      wx.showToast({
        title: '该商家未入驻',
        icon: 'none'
      })
      setTimeout(function () {
        wx.switchTab({
          url: '../index/index',
        })
      }, 1000)
    }
  },

  // 获取商家详情byid
  getBusiness: function (id) {
    var that = this
    var data = {
      id: id
    }
    qingqiu.get("getWxUserById", data, function (res) {
      console.log('byid', res)
      if (res.success == true) {
        res.result.picIurl = that.data.iconUrl + res.result.picIurl
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
        if (onename.length > 0) {
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
          goodsList: res.result
        })
        console.log(that.data.goodsList)
        that.getGoodsList(res.result.id)
        that.getGoodsdata(res.result.id)
      }
    })
  },

  phonecall: function (e) {
    var phone = e.currentTarget.dataset.phone
    if (phone == '' || phone == null || phone == 'null') {
      wx.showToast({
        title: '联系电话为空',
        icon: 'none',
        duration: 2000
      })
      return
    }
    wx.makePhoneCall({
      phoneNumber: phone,
    })
  },
  // 跳转店家晒晒
  goshowshai: function (e) {
    var ssid = e.currentTarget.dataset.ssid;
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

  // 获取店家晒晒
  getGoodsdata: function (id) {
    var that = this
    var data = {
      wxUserId: id,
      wxUserIdGo: app.globalData.wxid
    }
    qingqiu.get("casePage", data, function (re) {
      if (re.success == true) {
        if (re.result.records != null) {
          that.goodsList = re.result.records
          for (let obj of re.result.records) {
            if (obj.picOne.indexOf(",") == -1) {
              obj.picOne = that.data.viewUrl + obj.picOne
            } else {
              obj.picOne = that.data.iconUrl + obj.picOne.split(',')[0]
              // obj.picTwo= that.data.viewUrl + obj.picTwo.split(',')[0]
            }
          }
          console.log(re.result.records)
          that.setData({
            showList: re.result.records
          })
        }
      }
    })
  },
  // 跳转商品详情
  goGoodsDetails: function (e) {
    var obj = JSON.stringify(e.currentTarget.dataset.vals)
    app.globalData.goodsRefresh = 1
    wx.navigateTo({
      url: '../goodsDetails/goodsDetails?obj=' + obj
    })
  },

  liuyan: function (e) {
    var id = e.currentTarget.dataset.wxid
    var shopName = e.currentTarget.dataset.name
    var wxNc = e.currentTarget.dataset.wxNc
    var name = ''
    if (shopName == '' || shopName == null || shopName == 'null') {
      name = wxNc
    } else {
      name = shopName
    }
    wx.navigateTo({
      url: '../HM-chat/HM-chat?id=' + id + '&name=' + name,
    })
  },

  // 获取店家商品
  getGoodsList: function (goodsid) {
    var that = this
    var data = {
      pages: 1,
      size: 10,
      userId: goodsid,
      backup1: 1
    }
    qingqiu.get("tjsp", data, function (re) {
      if (re.success == true) {
        if (re.result.records != null) {
          for (let obj of re.result.records) {
            obj.goodPic1 = obj.goodPic1.split(',')
            obj.goodPic2 = obj.goodPic2.split(',')
          }
          that.setData({
            goodslists: re.result.records
          })
        } else {
          qingqiu.tk('未查询到任何数据')
        }
      }
    })
  },
  //最新最热样式变动
  serviceSelection1: function (e) {
    var navid = e.currentTarget.id;
    this.setData({
      CheckItem: navid
    })
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