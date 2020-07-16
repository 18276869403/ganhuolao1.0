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
    bannerImg: [{
        id: 1,
        bannerUrl: "http://miss.it-ys.com:91/work-boot/sys/common/view/static/image/huodong1.png"
      },
      {
        id: 2,
        bannerUrl: "http://miss.it-ys.com:91/work-boot/sys/common/view/static/image/huodong2.png"
      }
    ],
    xqxqlist: [],
    jiedanList: [],
    tupianlist: [],
    id: '',
    wxUserid: '',
    type: '',
  },

  aixinzhuanfa: function (e) {
    this.onShareAppMessage()
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
  onShareAppMessage: function (res) {
    return {
      title: '',
      path: '/pages/WelfareDetail/WelfareDetail',
      success: function (res) {
        // that.shareClick();
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },

  onLoad: function (options) {
    this.getTokenValue()
    wx.showShareMenu({
      withShareTicket: true
    })
    var gongyilist = JSON.parse(options.obj)
    gongyilist.createTime = gongyilist.createTime.split(' ')[0]
    if (gongyilist.signNum == '' || gongyilist.signNum == null) {
      gongyilist.signNum = 0
    }
    if (gongyilist.name != '' || gongyilist.name != null) {
      gongyilist.name = gongyilist.name
    } else if (gongyilist.shopName != '' || gongyilist.shopName != null) {
      gongyilist.name = gongyilist.shopName
    } else {
      gongyilist.name = gongyilist.wxNc
    }
    var piclist = []
    if (gongyilist.pic != '' && gongyilist.pic != null) {
      piclist = gongyilist.pic.split(',')
    }
    var piclist1 = []
    var piclist2 = []
    for (let obj of piclist) {
      if (obj != '') {
        piclist1.push(obj)
        piclist2.push(api.viewUrl + obj)
      }
    }
    var activityid = gongyilist.id
    console.log(piclist1)
    this.setData({
      gongyilist: gongyilist,
      piclist: piclist1,
      activityid: activityid,
      wxId:gongyilist.wxId,
      wxUserId: app.globalData.wxid,
      piclist2: piclist2
    })
    console.log(gongyilist)
    this.SelectjiedanList()
  },
  // 图片点击放大
  imgYu: function (event) {
    var that = this
    var src = api.viewUrl + event.currentTarget.dataset.picid;
    wx.previewImage({
      current: src,
      urls: that.data.piclist2
    })
  },
  // 接单人员
  SelectjiedanList() {
    var that = this
    var data = {
      activityid: that.data.activityid
    }
    qingqiu.get("getActivitySign", data, function (re) {
      if (re.success == true) {
        if (re.result != null) {
          that.data.jiedanList = re.result
          that.setData({
            jiedanList: that.data.jiedanList
          })
          console.log(that.data.jiedanList)
        } else {
          qingqiu.tk('未查询到任何数据')
        }
      }
    })
  },

  // 活动人数人数+1
  AddActivity() {
    var data = {
      needId: that.data.id,
      wxUserId: app.globalData.wxid
    }
    qingqiu.get("updateActivity", data, function (re) {}, 'put')
  },
  // 需求删除
  deleteActive() {
    var that = this
    var data = {
      id: that.data.activityid
    }
    wx.showModal({
      title: '提示',
      content: '您确定删除吗？',
      success: function (res) {
        if (res.confirm) {
          qingqiu.get("delActivity", data, function (re) {
            if (re.success == true) {
              wx.showToast({
                title: '删除成功',
                icon: 'success',
                duration: 2000
              })
              setTimeout(function () {
                wx.redirectTo({
                  url: '../Welfare/Welfare',
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
          return
        }
      }
    })
  },
  // 活动报名
  signName: function (e) {
    console.log('报名人员姓名：', e.detail.value)
    this.setData({
      signName: e.detail.value
    })
  },
  signPhone: function (e) {
    console.log('报名人员电话：', e.detail.value)
    this.setData({
      signPhone: e.detail.value
    })
  },
  woyaobaoming(e) {
    if(this.data.gongyilist.signNum==this.data.gongyilist.activityNum){
      wx.showToast({
        title: '报名人数已满！',
        icon: 'none',
        duration: 2000
      })
      return
    }
    for(let obj of this.data.jiedanList){
      if(obj.wxUserId==app.globalData.wxid){
        wx.showToast({
          title: '您已报过名了',
          icon: 'none',
          duration: 2000
        })
        return
      }
    }
    this.setData({
      activityId: this.data.activityId,
      isShowConfirm: true
    })
  },
  AddnameActive: function () {
    var that = this
    var data = {
      signName: that.data.signName,
      signPhone: that.data.signPhone,
      activityId: that.data.activityid,
      wxUserId: app.globalData.wxid
    }
    console.log(data)
    qingqiu.get("insertActivitySign", data, function (res) {
      console.log(res)
      if (res.success == true) {
        wx.showToast({
          title: '报名成功',
          icon: 'none',
          duration: 2000
        })
        var obj = {
          wxUserId: that.data.wxId
        }
        console.log(that.data.wxId)
        qingqiu.get("getPublicUserById", obj, function (res) {
          console.log(res)
          var objdata = {
            openId: res.result.openid,
            access_token:app.globalData.access_TokenOff,
            firstValue:"干活佬有人联系你啦！",
            firstColor:'#173177',
            keyword1Value:"有人报名你的活动啦！",
            keyword1Color:'#173177',
            keyword2Value:utils.newDate(),
            keyword2Color:'#173177',
            remarkValue:'干活佬，助力工人/商家接单！',
            remarkColor:'#173177',
            MiniUrl:''
          }
         qingqiu.get("SendWxMsg",objdata,function(re){
           console.log(re)
           if(re.errcode != 0){
             wx.showToast({
               title: '消息推送失败(用户尚未关注公众号或者用户拒接接收推送)',
               icon:'none',
             })
             return
           }
         })
        })
        qingqiu.get("updateActivity", {
          id: that.data.activityid
        }, function (res) {
          console.log(res)
          that.setData({
            isShowConfirm: false,
          })
        }, "PUT")
        // that.onLoad()
        that.SelectjiedanList()
      }
    }, 'post')
    that.setData({
      isShowConfirm: false,
    })
  },
  cancel: function () {
    var that = this
    that.setData({
      isShowConfirm: false,
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
  // 联系他
  phonecell:function(e){
    var phone = e.currentTarget.dataset.phone
    if(phone==''||phone==null||phone=='null'){
      wx.showToast({
        title: '联系电话为空',
        icon:'none',
        duration:2000
      })
      return
    }
    wx.makePhoneCall({
      phoneNumber: phone,
    })
  },
})