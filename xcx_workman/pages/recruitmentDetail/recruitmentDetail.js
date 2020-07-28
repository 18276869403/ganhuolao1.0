// pages/needsDetails/needsDetails.js
const app = getApp()
//调用接口js
const qingqiu = require('../../utils/request.js')
const api = require('../../utils/config.js')
const utils = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    viewUrl: api.viewUrl,
    iconUrl: api.iconUrl,
    xqxqlist: [],
    jiedanList: [],
    tupianlist: [],
    id: '',
    wxUserid: '',
    type: '',
    btnFlag: false
  },

  onLoad: function (options) {
    wx.showShareMenu({
      withShareTicket: true
    })
    if (options != undefined) {
      if (options.obj != undefined) {
        var zhaogong = JSON.parse(options.obj)
        zhaogong.publishMan = utils.formatName(zhaogong.publishMan)
        this.setData({
          zhaogong: zhaogong,
          id: zhaogong.id,
          zid: zhaogong.wxUserId,
          wxUserid: app.globalData.wxid
        })
        console.log(this.data.zhaogong)
        this.SelectjiedanList()
      } else if (options.id != undefined) {
        this.getRecrument(options.id)
        this.setData({
          id: options.id,
          wxUserid: app.globalData.wxid
        })
        this.SelectjiedanList()
      } else {
        wx.showToast({
          title: '该招工已被删除',
          icon: 'none'
        })
        setTimeout(function(){
          wx.redirectTo({
            url: '../index/index',
          })
        }, 1000);
        return
      }
    }else{
      wx.showToast({
        title: '该招工已被删除',
        icon: 'none'
      })
      setTimeout(function(){
        wx.redirectTo({
          url: '../index/index',
        })
      }, 1000);
      return
    }
  },
  // 根据id获取详情
  getRecrument(id) {
    var that = this
    qingqiu.get("queryloclaById", {id: id}, function (res) {
      console.log('招工byid', res)
      if (res.success == true) {
        res.result.createTime = res.result.createTime.substring(0,16)
        res.result.publishMan = utils.formatName(res.result.publishMan)
        that.setData({
          zhaogong: res.result,
          zid: res.result.wxUserId
        })
      } else {
        wx.showToast({
          title: '招工已被删除',
          icon: 'none'
        })
        return
      }
    })
  },
  // 接单人员
  SelectjiedanList() {
    var that = this
    var data = {
      needId: that.data.id,
      pages: 1,
      size: 10
    }
    console.log(data)
    that.data.type = ''
    qingqiu.get("needSignPage", data, function (re) {
      if (re.success == true) {
        if (re.result != null) {
          console.log(re)
          var list = re.result.records
          for (let obj of list) {
            if (obj.name != null && obj.name != "" && obj.name != "null") {
              obj.name = obj.name
            } else if (obj.shopName != null && obj.shopName != "" && obj.shopName != "null") {
              obj.name = obj.shopName
            } else {
              obj.name = obj.wxNc
            }
            if (obj.picIurl != null && obj.picIurl != "" && obj.picIurl != "null") {
              obj.picIurl = api.viewUrl + obj.picIurl
            } else {
              obj.picIurl = obj.picUrl
            }
            if (obj.signTime != null && obj.signTime != undefined && obj.signTime != "") {
              obj.signTime = obj.signTime.slice(0, 16)
            }
            if (obj.wxUserId == app.globalData.wxid) {
              that.data.type = 1
            }
          }
          that.setData({
            jiedanList: list,
            type: that.data.type
          })
        } else {
          qingqiu.tk('未查询到任何数据')
        }
      }
    })
  },
  // 图片
  // SelecttupianList() {
  //   var that = this
  //   var data={
  //     id: that.id,
  //     pages: 1,
  //     size: 10
  //   }
  //   qingqiu.get("zuixinxq", data, function(re) {
  //     if (re.success == true) {
  //       if (re.result != null) {
  //         // that.tupianlist = re.result.records
  //         for(let obj of re.result.records){
  //           obj.backup1 = api.viewUrl + obj.backup1.split(',')[0]
  //         }
  //         that.setData ({
  //           tupianlist : re.result.records
  //         })
  //         debugger
  //       } 
  //     } 
  //   })
  // },
  // 需求修改
  xiugaigunali() {
    wx.redirectTo({
      url: '../submitRecruitment/submitRecruitment?type=1&id=' + this.data.zhaogong.id,
    })
  },
  // 需求报名
  baoming() {
    var that = this
    that.setData({
      btnFlag: true
    })
    var data = {
      needId: that.data.id,
      wxUserId: app.globalData.wxid
    }
    wx.showModal({
      title: '提示',
      cancelText: '否',
      content: '你确认参与该需求吗？确认后雇主将能够看见你的联系方式！',
      confirmText: '是',
      success: function (res) {
        if (res.confirm) {
          console.log(data)
          qingqiu.get("insertNeedSign", data, function (res) {
            if (res.success == true) {
              that.setData({
                btnFlag: false
              })
              wx.showToast({
                title: '报名成功',
                icon: 'success',
                duration: 2000
              })
              that.SelectjiedanList()
            } else {
              that.setData({
                btnFlag: false
              })
              wx.showToast({
                title: res.message,
                icon: 'none',
                duration: 2000
              })
            }
          }, 'post')
        } else {
          that.setData({
            btnFlag: false
          })
          return
        }
      }
    })
  },
  // 需求删除
  delete() {
    var that = this
    that.setData({
      btnFlag: true
    })
    var data = {
      id: that.data.zhaogong.id
    }
    wx.showModal({
      title: '提示',
      content: '您确定删除吗？',
      success: function (res) {
        if (res.confirm) {
          qingqiu.get("workdelete", data, function (re) {
            that.setData({
              btnFlag: false
            })
            if (re.success == true) {
              wx.showToast({
                title: '删除成功',
                icon: 'success',
                duration: 2000
              })
              app.globalData.recruitRefresh = 0
              setTimeout(function () {
                // wx.navigateTo({
                //   url: '../myRecruitment/myRecruitment',
                // })
                wx.navigateBack({
                  delta: 1
                })
              }, 1000)
            } else {
              wx.showToast({
                title: re.message,
                icon: 'none',
                duration: 2000
              })
            }
          }, 'delete')
        } else {
          that.setData({
            btnFlag: false
          })
          return
        }
      }
    })
  },
  // 图片放大
  fangda: function (e) {
    var currentUrl = e.currentTarget.dataset.src
    wx.previewImage({
      current: currentUrl, // 当前显示图片的http链接
      urls: [currentUrl] // 需要预览的图片http链接列表
    })
  },
  // 留言
  liuyan: function (e) {
    var wxid = e.currentTarget.dataset.wxid
    var name = e.currentTarget.dataset.name
    var shopName = e.currentTarget.dataset.shopName
    var wxNc = e.currentTarget.dataset.wxNc
    var nameV = ''
    if (name != '' && name != "null" && name != null && name != undefined) {
      nameV = name
    } else if (shopName != '' && shopName != "null" && shopName != null && shopName != undefined) {
      nameV = shopName
    } else {
      nameV = wxNc
    }
    wx.redirectTo({
      url: '../HM-chat/HM-chat?id=' + wxid + '&name=' + nameV,
    })
  },
  // 打电话
  zaixianlianxi: function (e) {
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
  }
})