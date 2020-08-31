// pages/workList/workList.js
const app = getApp()
const api = require('../../utils/config.js')
const qingqiu = require('../../utils/request.js')
const util = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    iconUrl:api.iconUrl,
    // 金牌工人分页
    TopPageNo:1,
    // 工人列表分页
    pageNo:1,
    pageSize:10,
    // 金牌工人
    workerListTop:[],
    // 工人列表
    workerList:[],
    // 热门分类
    classListTop:[],
    sousuotext:'',
    isLastPage:false
  },

  // 更多金牌工人
  bindWorkerTop:function(){
    this.setData({
      pageNo:this.data.TopPageNo + 1
    })
    this.workListTop()
  },

  // 金牌工人
  workListTop() {
    var that = this
    var data = {
      pageNo:that.data.TopPageNo,
      pageSize:10,
      wxState: 1
    }
    if (app.globalData.oneCity != undefined && app.globalData.oneCity != "undefined") {
      data.oneAreaId = app.globalData.oneCity.id
    }
    if (app.globalData.twoCity != undefined && app.globalData.twoCity != "undefined") {
      if (app.globalData.twoCity.id != 0) {
        data.twoAreaId = app.globalData.twoCity.id
      }
    }
    qingqiu.get("wxIndexUserPage", data, function (re) {
      console.log(re)
      if (re.success == true) {
        if (re.result != null) {
          if(re.result.records.length == 0){
            wx.showToast({
              title: '没有更多了',
              icon:'none'
            })
            return
          }
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
            that.data.workerListTop.push(obj)
          }
          that.setData({
            workerListTop: that.data.workerListTop
          })
        }else{
          wx.showToast({
            title: '没有更多了',
            icon:'none'
          })
        }
      }
    })
  },



  /**
   * 获取热门分类
   */
  getClassTop:function(){
    var that = this
    var data ={
      type:1,
      pageSize:7
    }
    qingqiu.get("twoClassListTop",data,function(res){
      console.log('热门分类',res)
      if(res.success == true){
        if(res.result.records.length > 0){
          that.setData({
            classListTop:res.result.records
          })
        }
      }
    })
  },

  /**
   * 跳转到更多页面
   */
  ClassList:function(){
    wx.navigateTo({
      url: '../classList/classList',
    })
  },

  /**
   * 跳转到工人分类页面
   * @param {value} e 
   */
  WorkerClass:function(e){
    var oneid = e.currentTarget.dataset.oneid
    var twoid = e.currentTarget.dataset.twoid
    var onename = e.currentTarget.dataset.onename
    var twoname = e.currentTarget.dataset.twoname
    wx.navigateTo({
      url: '../workerClass/workerClass?oneid=' + oneid + '&twoid=' + twoid + '&onename=' + onename + '&twoname=' + twoname,
    })
  },

  /**
   * 输入框
   * @param {value} e 
   */
  shurukuang:function(e){
    this.setData({
      sousuotext:e.detail.value
    })
  },

  /**
   * 搜索
   */
  btnsearch:function(){
    this.setData({
      pageNo:1,
      workerList:[],
      isLastPage:false
    })
    this.workerList()
  },

  // 推荐工人
  workerList() {
    var that = this
    var data = {
      pageNo: that.data.pageNo,
      pageSize: 10,
      wxState: 1,
    }
    if(that.data.sousuotext != ''){
      data.name = that.data.sousuotext
    }
    if (app.globalData.oneCity != undefined && app.globalData.oneCity != "undefined") {
      data.oneAreaId = app.globalData.oneCity.id
    }
    if (app.globalData.twoCity != undefined && app.globalData.twoCity != "undefined") {
      if (app.globalData.twoCity.id != 0) {
        data.twoAreaId = app.globalData.twoCity.id
      }
    }
    qingqiu.get("wxUserPage", data, function (re) {
      console.log('工人列表',re)
      if (re.success == true) {
        if (re.result != null) {
          if (re.result.records.length == 0) {
            that.setData({
              isLastPage:true
            })
          } else {
            for (let obj of re.result.records) {
              if (obj.starClass == 0) {
                obj.shopName = "暂未评级"
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
              obj.dateBirth = util.ages(obj.dateBirth)
              obj.picIurl = obj.picIurl
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
              that.data.workerList.push(obj)
            }
            that.setData({
              workerList: that.data.workerList,
            })
          }
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.workListTop()
    this.getClassTop()
    this.workerList()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.setData({
      pageNo:1,
      workerListTop:[],
      classListTop:[],
      workerList:[],
      isLastPage:false
    })
    this.onLoad()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if(this.data.isLastPage){
      wx.showToast({
        title: '没有更多了',
      })
    }else{
      this.setData({
        pageNo:this.data.pageNo + 1
      })
      this.workerList()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})