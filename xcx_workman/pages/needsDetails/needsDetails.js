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
    // tupianlist: [{
    //   id: 1,
    //   tupian: '../image/top.png'
    // },
    // {
    //   id: 2,
    //   tupian: '../image/top.png'
    // },
    // {
    //   id: 3,
    //   tupian: '../image/top.png'
    // }
    // ],
    // jiedanList:[{
    //   id:1,
    //   name:'东鹏瓷砖万载总代',
    //   date:'05:00',
    //   details:'我可以做的，找我吧，我在哪哪哪哪',
    //   avator:'../image/top.png'
    // },
    //   {
    //     id: 2,
    //     name: '东鹏瓷砖万载总代',
    //     date: '05:00',
    //     details: '我可以做的，找我吧，我在哪哪哪哪',
    //     avator: '../image/top.png'
    //   },
    //   {
    //     id: 3,
    //     name: '东鹏瓷砖万载总代',
    //     date: '05:00',
    //     details: '我可以做的，找我吧，我在哪哪哪哪',
    //     avator: '../image/top.png'
    //   }],
    xqxqlist: [],
    jiedanList: [],
    tupianlist: [],
    id: '',
    wxUserid: '',
    btnFlag: false,
    type: ''
  },

  // 获取token值
  getTokenValue() {
    var that = this
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
    if(options != undefined){
      if(options.obj1 != undefined){
        var xqxqlist = JSON.parse(options.obj1)
        xqxqlist.publishMan = utils.formatName(xqxqlist.publishMan)
        this.setData({
          xqxqlist: xqxqlist,
          id: xqxqlist.id,
          xid: xqxqlist.wxUserId,
          wxUserid: app.globalData.wxid
        })
        console.log(this.data.xqxqlist)
        this.SelectjiedanList()
      }else if(options.id != undefined){
        
      }
    }
  },

  // 根据id获取详情
  

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
    wx.navigateTo({
      url: '../submitNeeds/submitNeeds?type=1&id=' + this.data.xqxqlist.id,
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
              var obj = {
                wxUserId: that.data.xid
              }
              console.log(that.data.xid)
              qingqiu.get("getPublicUserById", obj, function (res) {
                console.log(res)
                if (res.result.openid == "" || res.result.openid == null) {
                  return
                }
                var objdata = {
                  openId: res.result.openid,
                  access_token: app.globalData.access_TokenOff,
                  firstValue: "干活佬有人联系你啦！",
                  firstColor: '#173177',
                  keyword1Value: "您的需求有人报名了！",
                  keyword1Color: '#173177',
                  keyword2Value: utils.newDate(),
                  keyword2Color: '#173177',
                  remarkValue: '干活佬，助力工人/商家接单！',
                  remarkColor: '#173177',
                  MiniUrl: ''
                }
                qingqiu.get("SendWxMsg", objdata, function (re) {
                  console.log(re)
                  if (re.errcode != 0) {
                    wx.showToast({
                      title: '消息推送失败(用户尚未关注公众号或者用户拒接接收推送)',
                      icon: 'none',
                    })
                    return
                  }
                })
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
  shancuoxuqiu() {
    var that = this
    that.setData({
      btnFlag: true
    })
    var data = {
      id: that.data.id
    }
    wx.showModal({
      title: '提示',
      content: '您确定删除吗？',
      success: function (res) {
        if (res.confirm) {
          qingqiu.get("delYneedAndNeedSign", data, function (re) {
            if (re.success == true) {
              that.setData({
                btnFlag: false
              })
              wx.showToast({
                title: '删除成功',
                icon: 'success',
                duration: 2000
              })
              setTimeout(function () {
                wx.redirectTo({
                  url: '../myneeds/myneeds',
                })
              }, 1000)
            } else {
              that.setData({
                btnFlag: false
              })
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
  // 需求完成
  lianxita() {
    var that = this
    that.setData({
      btnFlag: true
    })
    var data = {
      id: that.id,
      needState: 1
    }
    qingqiu.get("needUpdateStateById", data, function (re) {
      if (re.success == true) {
        that.setData({
          btnFlag: false
        })
        wx.showToast({
          title: '需求已完成',
          icon: 'success',
          duration: 3000
        })
      } else {
        that.setData({
          btnFlag: false
        })
        wx.showToast({
          title: re.message,
          icon: 'none',
          duration: 2000
        })
      }
    }, "put")
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
    var shopName = e.currentTarget.dataset.shopname
    var wxNc = e.currentTarget.dataset.wxnc
    var nameV = ''

    if (name != '' && name != "null" && name != null && name != undefined) {
      nameV = name
    } else if (shopName != '' && shopName != "null" && shopName != null && shopName != undefined) {
      nameV = shopName
    } else {
      nameV = wxNc
    }
    wx.navigateTo({
      url: '../HM-chat/HM-chat?id=' + wxid + '&name=' + nameV,
    })
  },
  // 打电话
  phonecell: function (e) {
    var phone = e.currentTarget.dataset.phone
    if (phone == null || phone == '' || phone == 'null') {
      wx.showToast({
        title: '联系电话为空...',
        icon: 'none'
      })
      return
    } else {
      wx.makePhoneCall({
        phoneNumber: phone,
      })
    }
  }
})