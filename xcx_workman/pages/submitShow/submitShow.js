// pages/submitShow/submitShow.js
const app = getApp()
const qingqiu = require('../../utils/request.js')
const api = require('../../utils/config.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    viewUrl: api.viewUrl,
    needscontent: '',
    cityname: '',
    areaname: '',
    cityId: '',
    areaId: '',
    ceshi: [{
        id: 1,
        areaName: '万载'
      },
      {
        id: 2,
        areaName: '万载111'
      }
    ],
    city: [],
    area: [],
    tupian: '',
    id: '',
    name: '',
    tupianlist: [],
    imgUrl: '',
    cityname1: '',
    picIurl1: [],
    picIurl: '',
    picimg: '', 
    num: 1,
    tupianlists: [],
    addresslist: []
  },

  // 获取Token
  getAccessToken: function () {
    // 小程序Token
    qingqiu.getAccessTokenApplets(function (res) {
      console.log("小程序token", res)
      if (res.statusCode == 200) {
        app.globalData.access_Token = res.data.access_token
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    this.getAccessToken()
    wx.showShareMenu({
      withShareTicket: true
    })
    this.setData({
      wxuserid: app.globalData.wxid
    })
    this.QueryoneArea()
    // this.QuerytwoArea()
  },
  // 一级区域
  QueryoneArea() {
    var that = this
    qingqiu.get("queryOneArea", null, function (re) {
      if (re.success == true) {
        if (re.result != null) {
          that.data.city = re.result
          that.data.id = re.result[0].id
          that.data.name = re.result[0].areaName
          that.setData({
            cityId: that.data.id,
            cityname1: that.data.name,
            city: that.data.city
          })
        } else {
          qingqiu.tk('未查询到任何数据')
        }
      }
    })
    that.QuerytwoArea()
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
          that.data.area = re.result
          that.setData({
            area: that.data.area
          })
        } else {
          qingqiu.tk('未查询到任何数据')
        }
      }
    })
  },

  onShow: function () {

  },
  lijifabu: function () {

  },
  fanhui: function () {
    wx.switchTab({
      url: '../showwork/showwork',
    })
  },
  // 发布晒晒
  lijifabu() {
    var that = this
    if (that.data.needscontent == "") {
      wx.showToast({
        title: '晒晒详情不能为空！',
        icon: 'none',
        duration: 2000
      })
      return
    }
    if (that.data.cityId == "") {
      that.data.cityId = that.data.id
    }
    if (that.data.areaId == "") {
      wx.showToast({
        title: '请选择所在区域！',
        icon: 'none',
        duration: 2000
      })
      return
    }
    for (let obj of that.data.tupianlists) {
      that.data.picIurl1 += obj + ','
    }
    that.data.picIurl1 = that.data.picIurl1.substring(0, that.data.picIurl1.length - 1)
    console.log(app.globalData.wxid)
    var data = {
      wxUserId: app.globalData.wxid,
      backup3: 0,
      backup4: 0,
      oneAreaId: that.data.cityId,
      twoAreaId: that.data.areaId,
      caseName: that.data.needscontent,
      picOne: that.data.picIurl1
    }
    console.log(data)
    qingqiu.get("insertCase", data, function (re) {
      console.log(re)
      if (re.success == true) {
        wx.showToast({
          title: '发布成功！',
          icon: 'success',
          duration: 2000
        })
        // wx.switchTab({
        //   url: '../showwork/showwork',
        // })
        wx.navigateBack({
          delta: 1
        })
      }
    }, 'post')
  },
  //获取输入的晒活内容
  commentinput: function (e) {
    this.setData({
      needscontent: e.detail.value
    })
  },
  commentinputblur: function (e) {
    var that = this
    qingqiu.messageReg(e.detail.value, 0, function (res) {
      console.log('回调函数', res)
      if (res == 87014) {
        that.setData({
          needscontent: ''
        })
        wx.showToast({
          title: '内容包含敏感词，请重新输入...',
          icon: 'none',
          duration: 2000
        })
        return
      }
    }, 'POST')
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
  cityyiji: function () {
    var that = this
    qingqiu.get("oneAreaService", {}, function (re) {
      if (re.data.result.length > 0) {
        that.setData({
          cityId: re.data.result[0].id,
          cityname1: re.data.result[0].areaName
        })
      }
      that.setData({
        city: re.data.result
      })
      that.cityerji()
    })
  },
  cityerji: function () {
    var that = this
    var data = {
      oneAreaId: that.data.cityId
    }
    qingqiu.get("getAllTwoArea", data, function (re) {
      that.setData({
        area: re.data.result
      })
    })
  },
  // 左侧按钮
  cityleft: function (e) {
    var that = this;
    // var index = e.currentTarget.dataset.index;
    var id = e.currentTarget.dataset.id
    var name = e.currentTarget.dataset.name
    that.setData({
      cityId: id,
      cityname1: name,
    })
    var data = {
      oneAreaId: id
    }
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
  },
  // 右侧单选点击
  arearight: function (e) {
    var that = this;
    if (that.data.cityname1 == '') {
      // wx.showToast({
      //   title: '请先选择城市',
      //   icon:'none',
      //   duration:2000
      // })
      // return
      that.data.cityname1 = that.data.name
    }
    //var index = e.currentTarget.dataset.index;
    var id = e.currentTarget.dataset.id
    var name = e.currentTarget.dataset.name
    that.setData({
      areaId: id,
      //curIndex: index,
      areaname: name,
      showModalStatus: false,
      cityname: that.data.cityname1
    })
  },
  // 图片上传（对接完成）
  upimg: function (e) {
    var type = e.currentTarget.dataset.type
    var index = e.currentTarget.dataset.number
    var that = this
    wx.chooseImage({
      sizeType: ['compressed'], // 指定只能为压缩图，首先进行一次默认压缩
      sourceType: ['album', 'camera'],
      success: function (res) {
        const tempFilePaths = res.tempFilePaths;
        qingqiu.messageReg(tempFilePaths, 1, function (res) {
          var data = JSON.parse(res.data)
          if (data.errcode == 87014) {
            wx.showToast({
              title: '内容含有违法违规内容',
              icon: 'none'
            })
            return
          } else if (data.errcode != 0) {
            wx.showToast({
              title: '令牌失效，请重新进入小程序',
              icon: 'none'
            })
            return
          } else {
            wx.uploadFile({
              url: api.uploadurl, //仅为示例，非真实的接口地址
              filePath: tempFilePaths[0],
              header: {
                "Content-Type": "multipart/form-data"
              },
              formData: {
                method: 'POST' //请求方式
              },
              name: 'file',
              success(res) {
                var r = res.data
                var jj = JSON.parse(r);
                var sj = api.viewUrl + jj.message
                var tupianlists = that.data.tupianlists
                tupianlists.push(jj.message)
                that.setData({
                  tupianlists: tupianlists,
                  picimg1: sj,
                  picimgs1: jj.message
                })
              }
            })
          }
        })
      }
    })
  },
  // 删除图片
  shanchu: function (e) {
    var that = this
    var tplj = e.currentTarget.dataset.tplj
    that.data.tupianlists.splice(tplj, 1)
    console.log(that.data.tupianlists)
    that.setData({
      tupianlists: that.data.tupianlists
    })
    that.data.num -= 1;
    that.setData({
      num: that.data.num
    });
  },
})