// pages/showDetails/showDetails.js
const app = getApp()
const qingqiu = require('../../utils/request.js')
const api = require('../../utils/config.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    viewUrl: api.viewUrl,
    iconUrl: api.iconUrl,
    imgUrl: '',
    bannerImg: [],
    pinglunList: [],
    id: 0,
    wxCaseVo: null,
    caseMsgList: [],
    imgList: [],
    imgheights: [],
    current: 0,
    givePic:[],
    ssid: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showShareMenu({
      withShareTicket: true
    })
    if (options.id != undefined) {
      this.setData({
        ssid: options.id
      })
    } else {
      console.log(options.obj)
      this.setData({
        ssid: options.obj
      })
    }
    // console.log(options.obj)
    // this.setData({ssid:options.obj})
    this.ssxqbyid()
    this.pinglun()
    this.getShowGivePic()
  },
  // 晒晒详情
  ssxqbyid() {
    var that = this
    var data = {
      id: that.data.ssid,
      wxUserIdGo: app.globalData.wxid
    }
    qingqiu.get("pcQueryWxCaseById", data, function (re) {
      console.log(re)
      if (re.success == true) {
        if (re.result != null) {
          if (re.result.name != "null" && re.result.name != null && re.result.name != '') {
            re.result.name = re.result.name
          } else if (re.result.shopName != "null" && re.result.shopName != null && re.result.shopName != '') {
            re.result.name = re.result.shopName
          } else {
            re.result.name = re.result.wxnc
          }
          if (re.result.name == null || re.result.name == "null") {
            re.result.name = ''
          }
          that.data.caseMsgList = re.result
          that.data.imgList = that.data.caseMsgList.picOne.split(',')
          that.data.caseMsgList.picOne = that.data.caseMsgList.picOne.split(',')
          that.data.caseMsgList.addTime = that.data.caseMsgList.addTime.substring(0, 16)
          for (var i = 0; i < that.data.imgList.length; i++) {
            that.data.imgList[i] = api.iconUrl + that.data.imgList[i]
          }
          that.setData({
            caseMsgList: that.data.caseMsgList,
            imgList: that.imgList
          })
          console.log('晒晒', that.data.caseMsgList)
        } else {
          wx.showToast({
            title: re.message,
            icon: 'none',
            duration: 2000
          })
        }
      }
    })
  },
  /**
   * 获取晒晒点赞人数头像
   */
  getShowGivePic: function () {
    var that = this
    qingqiu.get("getShowGive", {
      id: that.data.ssid
    }, function (res) {
      console.log('点赞人数',res)
      that.setData({
        givePic:res.result
      })
    })
  },
  // 晒晒评论
  pinglun() {
    var that = this
    var data = {
      wxCaseId: that.data.ssid,
      pages: 1,
      size: 100
    }
    qingqiu.get("caseMessageVoList", data, function (re) {
      if (re.success == true) {
        if (re.result != null) {
          that.data.pinglunList = re.result.records
          for (var i = 0; i < re.result.records.length; i++) {
            if (that.data.pinglunList[i].name != null && that.data.pinglunList[i].name != '' && that.data.pinglunList[i].name != "null") {
              that.data.pinglunList[i].name = that.data.pinglunList[i].name
            } else if (that.data.pinglunList[i].shopName != null && that.data.pinglunList[i].shopName != '' && that.data.pinglunList[i].shopName != "null") {
              that.data.pinglunList[i].name = that.data.pinglunList[i].shopName
            } else {
              that.data.pinglunList[i].name = that.data.pinglunList[i].wxnc
            }
            that.data.pinglunList[i].createTime = that.data.pinglunList[i].createTime.substring(0, 16)
          }
          that.setData({
            pinglunList: that.data.pinglunList
          })
        } else {
          wx.showToast({
            title: '暂无评论！',
            icon: 'none',
            duration: 3000
          })
        }
      }
    })
  },
  // 晒晒点击事件
  imgYu: function (event) {
    var that = this
    var src = api.viewUrl + event.currentTarget.dataset.src;
    wx.previewImage({
      current: src,
      urls: that.data.imgList
    })
  },
  onShow: function () {
    this.pinglun()
  },
  fangda: function (e) {
    var img = e.currentTarget.dataset.img
    wx.previewImage({
      current: img, // 当前显示图片的http链接
      urls: this.data.bannerImg // 需要预览的图片http链接列表
    })
  },
  //跳转到添加评论页面
  comment: function () {
    wx.navigateTo({
      url: '../comment/comment?id=' + this.data.caseMsgList.id + '&wid=' + this.data.caseMsgList.wxUserId,
    })
  },
  lianxita: function (e) {
    wx.makePhoneCall({
      phoneNumber: '19191919919'
    })
  },
  // 图片自动调整高度
  imageLoad: function (e) {
    //获取图片真实宽度
    var imgwidth = e.detail.width,
      imgheight = e.detail.height,
      //宽高比
      ratio = imgwidth / imgheight;
    //计算的高度值
    var viewHeight = 750 / ratio;
    var imgheight = viewHeight
    var imgheights = this.data.imgheights
    //把每一张图片的高度记录到数组里
    imgheights[e.target.dataset['index']] = imgheight; // 改了这里 赋值给当前 index
    this.setData({
      imgheights: imgheights,
    })
  },
  bindchange: function (e) {
    this.setData({
      current: e.detail.current
    })
  },

  // 晒晒点赞
  dianzan: function (e) {
    var that = this
    var item = e.currentTarget.dataset.itemobj;
    console.log(item)
    var data = {
      wxCaseId: item.id,
      wxUserIdGo: app.globalData.wxid
    }
    qingqiu.get("userLikes", data, function (re) {
      if (re.success == true) {
        if (that.data.caseMsgList.id == item.id) {
          if (item.giveState == 0) {
            that.data.caseMsgList.giveGood += 1
          } else {
            that.data.caseMsgList.giveGood -= 1
          }
          that.data.caseMsgList.giveState = item.giveState == 0 ? 1 : 0
          that.getShowGivePic()
        }
      }
      that.setData({
        caseMsgList: that.data.caseMsgList
      })
    })
  },
})