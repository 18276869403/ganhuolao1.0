// pages/need/need.js
//获取应用实例
const app = getApp()
//调用接口js
const qingqiu = require('../../utils/request.js')
const api = require('../../utils/config.js')
const bmap = require('../../utils/bmap-wx.min.js')

Page({
  data: {
    viewUrl: api.viewUrl,
    workList:[],
    pageNo: 1,
    oneClassId: '',
    twoClassId: '',
    weizhi: '',
    id:'',
    name:'',
    needTitle:'',
  },
  // 搜索框
  shurukuang: function (e) {
    this.setData({
      sousuotext: e.detail.value
    })
  },
  // 全部
  quanbu: function () {
    var that = this
    that.data.firstId = ''
    that.data.secondId = ''
    that.data.firstname = ''
    that.setData({
      showModalStatus: false,
      firstname: that.data.firstname
    })
  },

  // 搜索按钮
  btnsearch: function () {
    this.data.workList.splice(0, this.data.workList.length)
    this.data.pageNo = 1
    this.data.isLastPage = false
    this.data.workList=[]
    this.setData({
      workList:this.data.workList
    })
    if (this.data.sousuotext != "") {
      this.data.needTitle = this.data.sousuotext
    } else {
      this.data.needTitle = ''
    }
    this.FindWorklist()
  },
  // 下拉刷新
  onPullDownRefresh: function () {
    this.setData({
      pageNo:1,
      isLastPage:false,
      workList:[]
    })
    this.onLoad()
    setTimeout(() => {
      wx.stopPullDownRefresh()
    }, 1000);
  },

  // 授权
  chushishouquan() {
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userInfo']) {
          wx.switchTab({
            url: '../index/index',
          })
        }
      }
    })
  },

  onLoad() {
    wx.showShareMenu({
      withShareTicket: true
    })
    if(app.globalData.needRefresh != 0){
      this.chushishouquan()
      // if(app.globalData.xuqiuid == 0){
      //   this.data.mid=app.globalData.wxid
      // }else{
      //   this.data.mid=''
      // }
      // this.oneClass()
      // this.twoClass()
      this.QueryoneArea()
      this.QuerytwoArea()
      if(app.globalData.oneCity != undefined && app.globalData.oneCity != "undefined"){
        this.setData({
          workList:[],
          weizhi:app.globalData.oneCity.name + app.globalData.twoCity.name,
          pageNo:1
        })
        this.FindWorklist()
      }else{
        this.setData({
          cityId: this.data.id,
          cityname1: this.data.name,
          workList:[],
          weizhi:'全部',
          areaId:0
        })
        this.FindWorklist()
      }
    }
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
      pageNo: this.data.pageNo + 1
    })
    this.FindWorklist()
  },
  //置顶
  goTop() {
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 300
    })
  },
  // 获取招工信息列表
  FindWorklist() {
    var that = this
    var data = {
      pageNo: that.data.pageNo,
      pageSize: 10,
    }
    if(that.data.needTitle != '' || that.data.needTitle!= null || that.data.needTitle != undefined){
     data.hireTitle = that.data.needTitle
    }
    if (app.globalData.oneCity != undefined && app.globalData.oneCity != "undefined") {
      data.oneAreaId = app.globalData.oneCity.id
    }
    if (app.globalData.twoCity != undefined && app.globalData.twoCity != "undefined") {
      data.twoAreaId = app.globalData.twoCity.id
    }
    qingqiu.get("list", data, function (re) {
      console.log(re)
      if (re.success == true) {
        if (re.result != null) {
          if(re.result.records==''){
            that.data.isLastPage=true
          }else{
            for (var i = 0; i < re.result.records.length; i++) {
              re.result.records[i].createTime = re.result.records[i].createTime.substring(0,16)
              if (re.result.records[i].backup1 != null && re.result.records[i].backup1.length > 0) {
                re.result.records[i].backup1 = re.result.records[i].backup1.split(',')
              }
              if(re.result.records[i].backup3 == null){
                re.result.records[i].backup3 = 0
              }
              that.data.workList.push(re.result.records[i])
            }
            that.setData({
              workList: that.data.workList
            })
          }
        } else {
          wx.showToast({
            title: '暂无数据',
            icon: 'none',
            duration: 2000
          })
        }
      }
    })
  },
  //显示弹窗样式
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
  //隐藏弹窗样式
  hideModal6: function () {
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
      var erjiId = ''
      var erjiName = ""
      for (var i = 0; i < that.data.navRightItems.length; i++) {
        if (that.data.navRightItems[i].isSelected == true) {
          if (erjiId != '') {
            erjiId = erjiId + ',' + that.data.navRightItems[i].id
            erjiName = erjiName + ',' + that.data.navRightItems[i].name
          } else {
            erjiId = that.data.navRightItems[i].id
            erjiName = that.data.navRightItems[i].name
          }

          that.setData({
            erjiName: erjiName,
            erjiId: erjiId,
          })
        }
      }
      that.setData({
        itemList: [],
        cost: ''
      })
    }.bind(this), 200)
  },
  // 跳转到需求详情页面
  recruitmentDetail: function (e) {
    var list=e.currentTarget.dataset.list
    var list1 = JSON.stringify(list)
    wx.navigateTo({
      url: '../recruitmentDetail/recruitmentDetail?obj='+list1,
    })
  },
  // 跳转到提交需求页面
  submitRecruitment: function (e) {
    wx.redirectTo({
      url: '../submitRecruitment/submitRecruitment',
    })
  },
  //显示弹窗样式
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
  // 置顶
  goTop: function (e) {
    if (wx.pageScrollTo) {
      wx.pageScrollTo({
        scrollTop: 0,
        duration: 300
      })
    } else {
      wx.showModal({
        title: '提示',
        cancelColor: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重新',
      })
    }
  },
  // 客服
  handleContact(e) {
    console.log(e)
    console.log(e.detail.path)
    console.log(e.detail.query)
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
          // var obj = {id:0,oneAreaId:0,areaName:'全部'}
          var area = []
          // area.push(obj)
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
    that.setData({
      cityId: id,
      weizhi: name,
      cityname1: name,
      workList: [],
    })
    if (id == 0) {
      app.globalData.oneCity = undefined
      app.globalData.twoCity = undefined
      that.FindWorklist() //招工列表
      that.setData({
        areaId: 0,
        cityId: that.data.id,
        cityname1: that.data.name,
        showModalStatus: false,
      })
    } else {
      var data = {
        oneAreaId: id
      }
      app.globalData.oneCity = {
        id: id,
        name: name
      }
      that.FindWorklist() //招工列表
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
    if (that.data.cityname1 == undefined) {
      wx.showToast({
        title: '请先选择城市',
        icon: 'none',
        duration: 2000
      })
      return
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
    if (app.globalData.oneCity == undefined || app.globalData.oneCity == '') {
      app.globalData.oneCity = {
        id: that.data.id,
        name: that.data.name
      }
      that.data.cityname1 = that.data.name
    }
    that.setData({
      weizhi: that.data.cityname1 + name,
      areaId: id,
      areaname: name,
      showModalStatus: false,
      workList: [],
      cityname: this.data.cityname1
    })
    that.setData({
      pageNo: 1,
      pageSize: 3,
      oneAreaId: app.globalData.oneCity.id,
      twoAreaId: id
    }) 
    that.FindWorklist()
  },
})