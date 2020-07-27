//index.js
//获取应用实例
const app = getApp()
//调用接口js
const qingqiu = require('../../utils/request.js')
const api = require('../../utils/config.js')
const util = require('../../utils/util.js')
const bmap = require('../../utils/bmap-wx.min.js')

Page({
  data: {
    viewUrl: api.viewUrl,
    iconUrl:api.iconUrl,
    showModalStatus1: true,
    openid: '',
    sousuotext: '',
    gongren: '2',
    shangjia: '1',
    msgList: [],
    bannerImg: [],
    needsList: [],
    needsListfy: [],
    workerList: [],
    storeList: [],
    goodsList: [],
    xuqiulist: [],
    grlist: [],
    sjlist: [],
    tupian: [],
    id: '',
    name: '',
    cityId: 0,
    addressId: 0,
    oneid: 0,
    areaId: 0,
    yijiAddress: '',
    isAuto: 0,
    erjiAddress: '',
    userdata: []
  },
  // 搜索框
  shurukuang: function (e) {
    this.setData({
      sousuotext: e.detail.value
    })
  },
  // 搜索按钮
  btnsearch: function () {
    var obj = {
      pageNo: 1,
      pageSize: 3,
      backup5: 0
    }
    if (this.data.sousuotext != "" || this.data.firstId != "undefined" || this.data.firstId != null) {
      obj.needTitle = this.data.sousuotext
    }
    this.xqneedlist(obj)
  },
  // 授权
  chushishouquan() {
    var that = this
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo']) {
          that.dialog.hideDialog();
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.login({
            success: function (res) {
              var code = res.code
              var encryptedData = res.encryptedData
              var iv = res.iv
              // qingqiu.get("getOpenIdbyjscode", {
              //   js_code: code
              // }, function (res) {
              //   console.log('公众号接口测试', res)
              // })
              wx.getUserInfo({
                lang: 'zh_CN',
                success(res) {
                  if (res.userInfo == undefined) {
                    that.dialog.showDialog()
                  }
                  const userInfo = res.userInfo
                  var data = {
                    code: code,
                    picUrl: userInfo.avatarUrl,
                    wxNc: userInfo.nickName,
                  }
                  if (that.data.openid != '') {
                    data.backup1 = that.data.openid
                  }
                  qingqiu.get("getKeyInfo", data, function (re) {
                    console.log(re)
                    app.globalData.wxid = re.result.wxUser.id
                    if (re.result.wxUser.picUrl != null && re.result.wxUser.picUrl.length > 0) {
                      app.globalData.sqgl = 1
                    }
                    app.globalData.openid = re.result.openId
                    app.globalData.unionid = re.result.wxUser.unionid
                    app.globalData.wxState = re.result.wxUser.wxState
                    app.globalData.gender = re.result.wxUser.sex
                  }, 'post')
                }
              })
            }
          })
        } else {
          that.dialog.showDialog();
          return
        }
      }
    })
  },

  // 获取地理位置信息 
  getAddress() {
    var that = this
    /* 获取地理位置 */
    var BMap = new bmap.BMapWX({
      ak: api.baiduAK
    })
    var fail = function (data) {
      console.log(data)
    }
    // 发起regeocoding检索请求   
    BMap.regeocoding({
      fail: fail,
      success: function (data) {
        var address = data.originalData.result.addressComponent
        // 返回数据内，已经包含经纬度
        that.setData({
          yijiAddress: address.city,
          yijiAddress: address.district,
        })
        var data = {
          one: address.city,
          two: address.district
        }
        qingqiu.get("queryAreaByName", data, function (res) {
          console.log(res)
          if (res.success == true) {
            var obj = {};
            var erjiname = ''
            var yijiname = ''
            if (res.result.two != null) {
              erjiname = address.district
              obj.cityId = res.result.one
              obj.id = res.result.one
            } else {
              obj.cityId = null
            }
            if (res.result.one != null) {
              yijiname = address.city
              obj.areaId = res.result.two
            } else {
              obj.areaId = null
            }
            obj.weizhi = yijiname + erjiname
            that.setData(obj)
            that.QueryoneArea() //一级区域
            that.QuerytwoArea() //二级区域
            that.xqneedlist({
              pageNo: 1,
              pageSize: 3,
              oneAreaId: obj.cityId,
              backup5: 0
            }) //需求
            that.grneedlist({
              pageNo: 1,
              pageSize: 10,
              wxState: 1,
              oneAreaId: obj.cityId,
            }) //工人
            that.sjneedlist({
              pageNo: 1,
              pageSize: 10,
              wxState: 0,
              oneAreaId: obj.cityId,
            }) //商家 
            that.spneedlist({
              pageNo: 1,
              pageSize: 10,
              backup1: 1,
              oneAreaId: obj.cityId,

            }) //商品
          } else {
            wx.showToast({
              title: res.message,
              icon: 'none',
              duration: 1000
            })
          }
        })
      }
    })
  },

  onShow: function () {
    wx.showShareMenu({
      withShareTicket: true
    })
    //获得dialog组件
    this.dialog = this.selectComponent("#dialog");
    // this.getAddress() // 获取位置信息
    this.firstbanner() //banner
    this.pointList() //通知
    this.QueryoneArea() //一级区域
    this.QuerytwoArea() //二级区域
    if (app.globalData.oneCity == undefined || app.globalData.oneCity == "undefined") {
      // this.setData({weizhi:'全部'})
      this.setData({
        cityId: this.data.id,
        cityname1: this.data.name,
        weizhi: '全部',
        areaId: 0
      })
      this.xqneedlist({
        pageNo: 1,
        pageSize: 3,
        backup5: 0
      }) //需求
      this.grneedlist({
        pageNo: 1,
        pageSize: 10,
        wxState: 1
      }) //工人
      this.sjneedlist({
        pageNo: 1,
        pageSize: 10,
        wxState: 0
      }) //商家 
      this.spneedlist({
        pageNo: 1,
        pageSize: 10,
        backup1: 1
      }) //商品
    } else {
      this.setData({
        weizhi: app.globalData.oneCity.name + app.globalData.twoCity.name
      })
      this.xqneedlist({
        pageNo: 1,
        pageSize: 3,
        oneAreaId: app.globalData.oneCity.id,
        backup5: 0
      }) //需求
      this.grneedlist({
        pageNo: 1,
        pageSize: 10,
        wxState: 1,
        oneAreaId: app.globalData.oneCity.id
      }) //工人
      this.sjneedlist({
        pageNo: 1,
        pageSize: 10,
        wxState: 0,
        oneAreaId: app.globalData.oneCity.id
      }) //商家 
      this.spneedlist({
        pageNo: 1,
        pageSize: 10,
        backup1: 1,
        oneAreaId: app.globalData.oneCity.id
      }) //商品
    }
  },
  onLoad: function (options) {
    // 获取二维码参数
    if (options != undefined) {
      if (options.scene != undefined) {
        var scene = decodeURIComponent(options.scene);
        if (scene != undefined) {
          this.data.openid = scene
        } else {
          this.data.openid = ''
        }
      }
    }
    this.chushishouquan()
  },

  // 取消授权
  cancelEvent: function () {
    var that = this
    wx.showModal({
      title: '温馨提示',
      content: '取消授权会影响部分功能的使用，您确定取消吗？',
      success(res) {
        if (res.confirm) {
          that.dialog.hideDialog();
        }
      }
    })
  },

  // 下拉刷新
  onPullDownRefresh: function () {
    this.onShow()
    setTimeout(() => {
      wx.stopPullDownRefresh()
    }, 1000);
  },
  // 截获竖向滑动
  catchTouchMove: function (res) {
    return false
  },
  // 需求列表
  xqneedlist(data) {
    var that = this
    if (app.globalData.oneCity != undefined && app.globalData.oneCity != "undefined") {
      if (app.globalData.twoCity.id != 0) {
        data.twoAreaId = app.globalData.twoCity.id
      }
    }
    qingqiu.get("zuixinxq", data, function (re) {
      if (re.success == true) {
        if (re.result != null) {
          that.xuqiulist = re.result.records
          for (var i = 0; i < that.xuqiulist.length; i++) {
            that.xuqiulist[i].publishTime = re.result.records[i].publishTime.split(" ")[0]
            if (that.xuqiulist[i].backup1 != null && that.xuqiulist[i].backup1.length > 0) {
              that.xuqiulist[i].backup1 = re.result.records[i].backup1.split(',')
            }
          }
          that.setData({
            xuqiulist: re.result.records,
          })
        } else {
          qingqiu.tk('未查询到任何数据')
        }
      }
    })
  },
  // 推荐工人
  grneedlist(data) {
    var that = this
    if (app.globalData.oneCity != undefined && app.globalData.oneCity != "undefined") {
      if (app.globalData.twoCity.id != 0) {
        data.twoAreaId = app.globalData.twoCity.id
      }
    }
    qingqiu.get("wxIndexUserPage", data, function (re) {
      console.log(re)
      if (re.success == true) {
        if (re.result != null) {
          for (let obj of re.result.records) {
            if (obj.starClass == 0) {
              obj.shopName = "暂未评定"
            } else if (obj.starClass == 1) {
              obj.shopName = "一级工匠"
            } else if (obj.starClass == 2) {
              obj.shopName = "二级工匠"
            } else if (obj.starClass == 3) {
              obj.shopName = "三级工匠"
            } else if (obj.starClass == 4) {
              obj.shopName = "四级工匠"
            }
            if (obj.starClass == 5) {
              obj.shopName = "五级工匠"
            }
            obj.picIurl = that.data.iconUrl + obj.picIurl
            obj.dateBirth = util.ages(obj.dateBirth)
            // 重定义分类
            var onename = []
            var twoname = []
            if (obj.oneClassName != null) {
              if (obj.oneClassName.indexOf(',') != -1) {
                onename = obj.oneClassName.split(',')
              } else {
                onename[0] = obj.oneClassName
              }
            }
            if (obj.twoClassName != null) {
              if (obj.twoClassName.indexOf(',') != -1) {
                twoname = obj.twoClassName.split(',')
              } else {
                twoname[0] = obj.twoClassName
              }
            }
            if (onename[0] != undefined) {
              obj.oneClassName = onename[0] + ' | ' + twoname[0]
              if (onename.length > 1) {
                obj.twoClassName = onename[1] + ' | ' + twoname[1]
              } else {
                obj.twoClassName = ''
              }
            } else {
              obj.oneClassName = ''
              obj.twoClassName = ''
            }
          }
          that.setData({
            workerList: re.result.records
          })
        }
      }
    })
  },
  // 推荐商家
  sjneedlist(data) {
    var that = this
    if (app.globalData.oneCity != undefined && app.globalData.oneCity != "undefined") {
      if (app.globalData.twoCity.id != 0) {
        data.twoAreaId = app.globalData.twoCity.id
      }
    }
    qingqiu.get("wxIndexUserPage", data, function (re) {
      console.log(re)
      if (re.success == true) {
        if (re.result != null) {
          for (let obj of re.result.records) {
            obj.picIurl = that.data.iconUrl + obj.picIurl
            // 重定义分类
            var onename = []
            var twoname = []
            if (obj.oneClassName != null) {
              if (obj.oneClassName.indexOf(',') != -1) {
                onename = obj.oneClassName.split(',')
              } else {
                onename[0] = obj.oneClassName
              }
            }
            if (obj.twoClassName != null) {
              if (obj.twoClassName.indexOf(',') != -1) {
                twoname = obj.twoClassName.split(',')
              } else {
                twoname[0] = obj.twoClassName
              }
            }
            if (onename.length > 0) {
              obj.oneClassName = onename[0] + ' | ' + twoname[0]
              if (onename.length > 1) {
                obj.twoClassName = onename[1] + ' | ' + twoname[1]
              } else {
                obj.twoClassName = ''
              }
            } else {
              obj.oneClassName = ''
              obj.twoClassName = ''
            }
          }
          that.setData({
            storeList: re.result.records
          })
        }
      }
    })
  },

  // 获取广告
  firstbanner: function () {
    var that = this
    var data = {
      page: 1,
      size: 100
    }
    qingqiu.get("bannerlist", data, function (re) {
      if (re.success == true) {
        if (re.result != null) {
          that.data.bannerImg = re.result
          for (let obj of that.data.bannerImg) {
            obj.bannerUrl = that.data.iconUrl + obj.bannerUrl;
          }
          that.setData({
            bannerImg: that.data.bannerImg
          })
        }
      }
    })
  },

  // // banner点击事件
  // goBaidu: function (event) {
  //   var data = (event.currentTarget.dataset)
  //   wx.navigateTo({
  //     url: '../outurl/outurl?goBaidu=' + data.url, //
  //     success: function () {}, //成功后的回调；
  //     fail: function () {}, //失败后的回调；
  //     complete: function () {}, //结束后的回调(成功，失败都会执行)
  //   })
  // },

  // 通知
  pointList: function () {
    var that = this
    var data = {
      page: 1,
      size: 10
    }
    qingqiu.get("pointList", data, function (re) {
      console.log(re)
      if (re.success == true) {
        if (re.result != null) {
          for (let obj of re.result.records) {
            if (obj.name == '' || obj.name == null) {
              obj.name = obj.shopName
            }
            obj.name = util.formatName(obj.name)
            obj.name = "恭喜" + obj.name + "成功入驻";
          }
          that.setData({
            msgList: re.result.records
          })
        }
      }
    })
  },

  // 跳转到工人入驻页面
  applyBusiness: function (e) {
    var that = this
    var obj = e.currentTarget.dataset.typeid
    if (obj == 1) {
      if (app.globalData.wxState == 0) {
        wx.showToast({
          title: '您已入驻商家,同一微信不能入驻两种类型',
          icon: 'none',
          duration: 2000
        })
        return
      } else {
        wx.navigateTo({
          url: '../applyBusiness/applyBusiness?typeid=' + obj
        })
      }
    } else if (obj == 2) {
      if (app.globalData.wxState == 1) {
        wx.showToast({
          title: '您已入驻工人,同一微信不能入驻两种类型',
          icon: 'none',
          duration: 2000
        })
        return
      } else {
        wx.navigateTo({
          url: '../applyBusiness/applyBusiness?typeid=' + obj
        })
      }
    } else {
      wx.navigateTo({
        url: '../applyBusiness/applyBusiness?typeid=' + obj
      })
    }
  },
  // 商家促销
  cuxiao: function () {
    app.globalData.goodsRefresh=1
    wx.navigateTo({
      url: '../goodsList/goodsList',
    })
  },
  // 剩料交易
  ershou: function () {
    app.globalData.materialRefresh = 1
    wx.navigateTo({
      url: '../Material/Material',
    })
  },
  // 本地招工
  bendi: function () {
    app.globalData.recruitRefresh = 0
    wx.navigateTo({
      url: '../recruitment/recruitment',
    })
  },
  // 公益活动
  gongyi: function () {
    app.globalData.welfareRefresh = 1
    wx.navigateTo({
      url: '../Welfare/Welfare',
    })
  },
  // 跳转到推荐有礼页面
  activity: function () {
    wx.navigateTo({
      url: '../activity/activity',
    })
  },
  // 跳转到更多需求页面
  need: function () {
    app.globalData.needRefresh=1
    wx.switchTab({
      url: '../need/need',
    })
  },
  // 跳转到需求详情页面
  needsDetails: function (e) {
    var that = this
    var obj1 = e.currentTarget.dataset.vall;
    var data = {
      id: obj1.id
    }
    qingqiu.get("updateYeedById", data, function (res) {
      if (res.success == true) {
        var xqxq = JSON.stringify(obj1);
        app.globalData.needRefresh = 1
        wx.navigateTo({
          url: '../needsDetails/needsDetails?obj1=' + xqxq,
        })
      } else {
        wx.showToast({
          title: res.message,
          icon: 'none',
          duration: 2000
        })
      }
    }, 'put')
  },
  // 跳转到推荐工人更多页面
  services: function (e) {
    app.globalData.servicestype = e.currentTarget.dataset.type
    wx.switchTab({
      url: '../services/services',
      success: function (res) {
        var page = getCurrentPages().pop()
        if (page == undefined || page == null) return
        page.onLoad()
      }
    })

  },
  // 跳转到推荐商品更多页面
  goodList: function () {
    app.globalData.goodsRefresh=1
    wx.navigateTo({
      url: '../goodsList/goodsList',
    })
  },
  // 跳转到工人详情页面
  workerDetails: function (e) {
    var obj = e.currentTarget.dataset.vals;
    obj = JSON.stringify(obj);
    app.globalData.serverRefresh = 0
    wx.navigateTo({
      url: '../workerDetails/workerDetails?obj=' + obj,
    })
  },
  // 跳转到商家详情页面
  businessDetails: function (e) {
    var obj = e.currentTarget.dataset.vals
    obj = JSON.stringify(obj)
    app.globalData.serverRefresh = 0
    wx.navigateTo({
      url: '../businessDetails/businessDetails?obj=' + obj,
    })
  },
  // 跳转到商品列表页面
  goodsList: function () {
    app.globalData.goodsRefresh = 1
    wx.navigateTo({
      url: '../goodsList/goodsList',
    })
  },
  // 推荐商品
  spneedlist(data) {
    var that = this
    if (app.globalData.oneCity != undefined && app.globalData.oneCity != "undefined") {
      if (app.globalData.twoCity.id != 0) {
        data.twoAreaId = app.globalData.twoCity.id
      }
    }
    qingqiu.get("wxUserGoodPage", data, function (re) {
      console.log('推荐商品', re)
      if (re.success == true) {
        if (re.result.records != null) {
          that.goodsList = re.result.records
          for (let obj of re.result.records) {
            if (obj.shopName == null) {
              obj.userId = 0
              obj.shopName = '敬请期待'
            }
            if (obj.newPrice == '' || obj.newPrice == null || obj.newPrice == "null") {
              obj.newPrice = "面议"
            }
            obj.goodPic1 = obj.goodPic1.split(',')
            obj.goodPic2 = obj.goodPic2.split(',')
            if(obj.goodPic1[0]==''&&obj.goodPic1[1]!=''){
              obj.goodPic1[0]=obj.goodPic1[1]
              obj.goodPic1[1]=''
            }
          }
          that.setData({
            goodsList: re.result.records
          })
        } else {
          qingqiu.tk('未查询到任何数据')
        }
      }
    })
  },
  // 一级区域
  QueryoneArea() {
    var that = this
    qingqiu.get("queryOneArea", null, function (re) {
      if (re.success == true) {
        if (re.result != null) {
          var obj = {
            id: 0,
            areaName: '全部'
          }
          var city = []
          city.push(obj)
          city.push(re.result[0])
          that.data.id = re.result[0].id
          that.data.name = re.result[0].areaName
          if (app.globalData.oneCity == undefined || app.globalData.oneCity == "undefined") {
            that.setData({
              cityId: that.data.id,
              cityname1: that.data.name,
              weizhi: '全部',
              areaId: 0
            })
          } else {
            that.setData({
              cityId: app.globalData.oneCity.id,
              cityname1: app.globalData.oneCity.name,
              areaId: app.globalData.twoCity.id,
              areaname: app.globalData.twoCity.name
            })
          }
          that.setData({
            city: city
          })
        } else {
          qingqiu.tk('未查询到任何数据')
        }
      }
    })
  },
  // 二级区域
  QuerytwoArea() {
    var that = this
    var data = {
      oneAreaId: that.data.id
    }
    qingqiu.get("queryTwoArea", data, function (re) {
      if (re.success == true) {
        if (re.result != null) {
          var obj = {
            id: 0,
            oneAreaId: 0,
            areaName: '全部'
          }
          var area = []
          area.push(obj)
          for (let obj of re.result) {
            area.push(obj)
          }
          that.setData({
            area: area
          })
        } else {
          qingqiu.tk('未查询到任何数据')
        }
      }
    })
  },
  //获取位置信息
  // weizhi:function(){
  //   var that = this;
  //   wx.getLocation({
  //     type: 'wgs84',
  //     success(res) {
  //       var latitude = res.latitude
  //       var longitude = res.longitude
  //       wx.showModal({
  //         title: '当前位置',
  //         content: "纬度:" + latitude + ",经度:" + longitude,
  //       })
  //       console.log(res)
  //     }
  //   })
  //   wx.chooseLocation({
  //     success: function(res) {
  //     console.log(res.address)
  //     },
  //   })
  // },
  // 跳转到商品详情页面
  goodsDetails(e) {
    app.globalData.goodsRefresh=1
    var obj = e.currentTarget.dataset.vals;
    var shopxq = JSON.stringify(obj);
    //debugger
    wx.navigateTo({
      url: '../goodsDetails/goodsDetails?obj=' + shopxq,
    })
  },
  //地址 显示弹窗样式
  showModal: function (e) {
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
  // 左侧按钮
  cityleft: function (e) {
    var that = this;
    // var index = e.currentTarget.dataset.index;
    var id = e.currentTarget.dataset.id
    var name = e.currentTarget.dataset.name.replace(' ', '')
    if (id != 0) {
      app.globalData.oneCity = {
        id: id,
        name: name
      }
    } else {
      app.globalData.oneCity = undefined
      app.globalData.twoCity = undefined
    }
    that.setData({
      cityId: id,
      cityname1: name,
      weizhi: name,
      areaId: 0
    })
    if (id == 0) {
      that.xqneedlist({
        pageNo: 1,
        pageSize: 3,
        backup5: 0
      }) //需求
      that.grneedlist({
        pageNo: 1,
        pageSize: 10,
        wxState: 1
      }) //工人
      that.sjneedlist({
        pageNo: 1,
        pageSize: 10,
        wxState: 0
      }) //商家 
      that.spneedlist({
        pageNo: 1,
        pageSize: 10,
        backup1: 1
      }) //商品
      that.setData({
        cityId: that.data.id,
        cityname1: that.data.name,
        areaId: 0,
        showModalStatus: false,
      })
    } else {
      var data = {
        oneAreaId: id
      }
      that.xqneedlist({
        pageNo: 1,
        pageSize: 3,
        oneAreaId: id,
        backup5: 0
      }) //需求
      that.grneedlist({
        pageNo: 1,
        pageSize: 10,
        wxState: 1,
        oneAreaId: id
      }) //工人
      that.sjneedlist({
        pageNo: 1,
        pageSize: 10,
        wxState: 0,
        oneAreaId: id
      }) //商家 
      that.spneedlist({
        pageNo: 1,
        pageSize: 10,
        backup1: 1,
        oneAreaId: id
      }) //商品
      qingqiu.get("queryTwoArea", data, function (re) {
        if (re.success == true) {
          if (re.result != null) {
            that.area = re.result
            that.setData({
              area: that.area
            })
          } else {
            qingqiu.tk('未查询到任何数据')
          }
        }
      })
    }
  },
  // 右侧单选点击
  arearight: function (e) {
    var that = this;
    if (that.data.cityname1 == undefined || that.data.cityname1 == '') {
      wx.showToast({
        title: '请先选择城市',
        icon: 'none',
        duration: 2000
      })
      return
    }
    if (app.globalData.oneCity == undefined || app.globalData.oneCity == '') {
      app.globalData.oneCity = {
        id: that.data.id,
        name: that.data.name
      }
      that.data.cityname1 = that.data.name
    }
    //var index = e.currentTarget.dataset.index; 
    var id = e.currentTarget.dataset.id
    var name = e.currentTarget.dataset.name
    app.globalData.twoCity = {
      id: id,
      name: name
    }
    if (that.data.weizhi == undefined || that.data.weizhi == "") {
      wx.showToast({
        title: '请选择城市',
        icon: 'none',
        duration: 1000
      })
      return
    }
    that.setData({
      weizhi: that.data.cityname1 + name,
      areaId: id,
      //curIndex: index,
      areaname: name,
      showModalStatus: false,
      cityname: this.data.cityname1
    })
    that.xqneedlist({
      pageNo: 1,
      pageSize: 3,
      oneAreaId: app.globalData.oneCity.id,
      backup5: 0
    }) //需求
    that.grneedlist({
      pageNo: 1,
      pageSize: 10,
      wxState: 1,
      oneAreaId: app.globalData.oneCity.id,
    }) //工人
    that.sjneedlist({
      pageNo: 1,
      pageSize: 10,
      wxState: 0,
      oneAreaId: app.globalData.oneCity.id,
    }) //商家 
    that.spneedlist({
      pageNo: 1,
      pageSize: 10,
      oneAreaId: app.globalData.oneCity.id,
    }) //商品
  },

  // 显示弹窗样式 授权
  showModal1: function (e) {
    var animation = wx.createAnimation({
      duration: 300,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.opacity(0).rotateX(-100).step();
    this.setData({
      animationData: animation.export(),
      showModalStatus1: true
    })
    setTimeout(function () {
      animation.opacity(1).rotateX(0).step();
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 200)


  },
  //隐藏分类弹窗样式
  hideModal1: function () {
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
        showModalStatus1: false,
        navLeftItems: [],
      })
    }.bind(this), 200)
  },
  // 跳转到建工计算详情
  activity02() {
    wx.navigateTo({
      url: '../activity02/activity02',
    })
  },
  handleContact: function (e) {
    console.log(e.detail.path)
    console.log(e.detail.query)
  }
})