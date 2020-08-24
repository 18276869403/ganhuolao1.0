// pages/buildDrawDetails/buildDrawDetails.js
const app = getApp()
const qingqiu = require('../../utils/request.js')
const api = require('../../utils/config.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 浏览图片
    iconUrl: api.iconUrl,
    // 详情对象
    builddraw: {},
    // 按钮控制
    btnFlag: false,
    // 控制按钮显示
    wxUserId:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      wxUserId:app.globalData.wxid
    })
    if (options != undefined) {
      if (options.id != undefined) {
        this.getBuildDraw(options.id)
      } else {
        wx.showToast({
          title: '图纸异常',
          icon: 'none'
        })
        setTimeout(function () {
          wx.navigateBack({
            delta: 1
          })
        },1000)
      }
    } else {
      wx.showToast({
        title: '图纸异常',
        icon: 'none'
      })
      setTimeout(function () {
        wx.navigateBack({
          delta: 1
        })
      },1000)
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 活动图纸详情
   * @param {建房图纸编号} id 
   */
  getBuildDraw: function (id) {
    var that = this
    qingqiu.get("buildQueryById", {
      id: id
    }, function (res) {
      console.log(res)
      if (res.result != null) {
        var m = res.result
        var piclist = []
        // 判断是否为空，同时判断是否存在多张图片
        if (m.pic != "" && m.pic != null) {
          if (m.pic.indexOf(',') != -1) {
            piclist = m.pic.split(',')
          } else {
            piclist.push(m.pic)
          }
        }
        m.pic = piclist
        that.setData({
          builddraw: m
        })
      }
    })
  },

  /**
   * 修改
   * @param {id} e 
   */
  edit: function (e) {
    this.setData({
      btnFlag: true
    })
    var id = e.currentTarget.dataset.id
    wx.redirectTo({
      url: '../submitBuilddraw/submitBuilddraw?id=' + id,
    })
  },

  /**
   * 删除
   * @param {id} e 
   */
  delete: function (e) {
    var id = e.currentTarget.dataset.id
    var that = this
    that.setData({
      btnFlag: true
    })
    wx.showModal({
      title: '提示',
      content: '您确定删除吗？',
      success: function (res) {
        if (res.confirm) {
          qingqiu.get("builddelete", {
            id: id
          }, function (res) {
            console.log(res)
            if (res.result == 0) {
              wx.showToast({
                title: '删除成功',
                icon: 'none'
              })
              setTimeout(function () {
                that.setData({
                  btnFlag: false
                })
                wx.navigateBack({
                  delta: 1
                })
              }, 1000)
            }else{
              wx.showToast({
                title: '删除成功',
                icon: 'none'
              })
              setTimeout(function () {
                that.setData({
                  btnFlag: false
                })
              }, 1000)
            }
          })
        } else {
          that.setData({
            btnFlag: false
          })
          return
        }
      }
    })
  },

  /**
   * 图片预览
   * @param {*} e 
   */
  tupian:function(e){
    var src = e.currentTarget.dataset.url
    wx.previewImage({
      current:src,
      urls: [src]
    })
  },

  /**
   * 拨打电话
   * @param {*} e 
   */
  phone: function (e) {
    var phone = e.currentTarget.dataset.phone
    if (phone == "" || phone == "null" || phone == null) {
      wx.showToast({
        title: '未填写联系电话',
        icon: "none"
      })
      return
    }
    wx.makePhoneCall({
      phoneNumber: phone,
    })
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