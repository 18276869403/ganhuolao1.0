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
    pageNo:1,
    pageSize:10,
    workerListTop:[]
  },


  // 金牌工人
  workListTop() {
    var that = this
    var data = {
      pageNo:1,
      pageSize:10,
      wxState: 1
    }
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
            workerListTop: re.result.records
          })
        }
      }
    })
  },

  // 推荐工人
  grneedlist() {
    var that = this
    var data = {
      pageNo: that.data.pageNo,
      pageSize: 10,
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
    qingqiu.get("wxUserPage", data, function (re) {
      console.log(re)
      if (re.success == true) {
        if (re.result != null) {
          if (re.result.records == '') {
            that.setData({
              isLastPage: true
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
              obj.picIurl = that.data.iconUrl + obj.picIurl
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
              that.data.workerlist.push(obj)
            }
            that.setData({
              workerlist: that.data.workerlist,
              workerlist1: re.result.records
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})