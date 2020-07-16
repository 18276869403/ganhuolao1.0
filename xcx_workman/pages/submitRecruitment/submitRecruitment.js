// pages/applyBusiness/applyBusiness.js
const app = getApp()

const qingqiu = require('../../utils/request.js')
const api = require('../../utils/config.js')
const utils = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    viewUrl: api.viewUrl,
    bindImg: [],
    // 发布参数
    needsname: '',
    linkman: '',
    workcityname: '',
    workareaname: '',
    phone: '',
    needscontent: '',
    salary: '',
    // 用户信息
    wxUser: '',
    id: 0,
    select: 'circle',
    cityname: '',
    areaname: '',
    cityId: '',
    areaId: '',
    workcityname: '',
    workareaname: '',
    city: [],
    area: [],
    picIurl: '',
    picIurl1: ''
  },

  // 获取一级区域
  getcity: function () {
    var that = this
    qingqiu.get("queryOneArea", null, function (res) {
      if (res.success == true) {
        for (let i = 0; i < res.result.length; i++) {
          that.getarea(res.result[i].id)
        }
        that.setData({
          city: res.result
        })
      }
    })
  },
  // 获取二级区域
  getarea: function (e) {
    var that = this
    var data = {
      oneAreaId: e
    }
    qingqiu.get("queryTwoArea", data, function (res) {
      if (res.success == true) {
        that.setData({
          area: res.result
        })
      }
    })
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
  onLoad: function (options) {
    this.getTokenValue()
    wx.showShareMenu({
      withShareTicket: true
    })
    this.getcity()
  },

  //获取输入的需求标题
  needsnameinput: function (e) {
    this.setData({
      needsname: e.detail.value
    })
  },
  needsnameblur: function (e) {
    var that = this
    qingqiu.get("checkWords",{content:e.detail.value}, function (res) {
      if (res == 1) {
        that.setData({
          needscontent: ''
        })
        wx.showToast({
          title: '内容包含敏感词，请重新输入...',
          icon: 'none',
          duration: 2000
        })
        return
      }else if(res == 2){
        wx.showToast({
          title: '校验失败',
          icon:'none'
        })
        that.setData({
          needscontent: ''
        })
        return
      }
    }, 'POST')
  },
  // 获取薪资的输入内容
  salaryinput: function (e) {
    this.setData({
      salary: e.detail.value
    })
  },
  //获取输入的需求内容
  needscontentinput: function (e) {
    this.setData({
      needscontent: e.detail.value
    })
  },
  needscontentblur: function (e) {
    var that = this
    qingqiu.get("checkWords",{content:e.detail.value}, function (res) {
      if (res == 1) {
        that.setData({
          needscontent: ''
        })
        wx.showToast({
          title: '内容包含敏感词，请重新输入...',
          icon: 'none',
          duration: 2000
        })
        return
      }else if(res == 2){
        wx.showToast({
          title: '校验失败',
          icon:'none'
        })
        that.setData({
          needscontent: ''
        })
        return
      }
    }, 'POST')
  },

  //获取输入的联系人
  linkmaninput: function (e) {
    this.setData({
      linkman: e.detail.value
    })
  },
  //商家联系人敏感词
  linkmanblur: function (e) {
    var that = this
    qingqiu.get("checkWords",{content:e.detail.value}, function (res) {
      if (res == 1) {
        that.setData({
          needscontent: ''
        })
        wx.showToast({
          title: '内容包含敏感词，请重新输入...',
          icon: 'none',
          duration: 2000
        })
        return
      }else if(res == 2){
        wx.showToast({
          title: '校验失败',
          icon:'none'
        })
        that.setData({
          needscontent: ''
        })
        return
      }
    }, 'POST')
  },
  //获取输入的联系电话
  phoneinput: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },

  // 右侧多选点击
  itemSelected: function (e) {
    var index = e.currentTarget.dataset.index;
    var item = this.data.navRightItems[index];
    item.isSelected = !item.isSelected;
    this.setData({
      navRightItems: this.data.navRightItems,
    });
  },

  // 提交申请
  fabuzhaogong: function () {
    var that = this
    var s = qingqiu.yanzheng(that.data.needsname + ",输入职位标题|" + that.data.salary + ",选择输入薪资|" + that.data.workcityname + ",选择工作地|" + that.data.linkman + "输入联系人|" + that.data.phone + ",输入联系电话")
    if (s != 0) {
      wx.showToast({
        title: s,
        icon: 'none',
        duration: 2000
      })
      return
    }
    var data = {
      wxUserId: app.globalData.wxid,
      hireTitle: that.data.needsname,
      backup3: that.data.salary,
      oneAreaId: that.data.typeid,
      twoAreaId: that.data.areaId,
      publishMan: that.data.linkman,
      publishPhone: that.data.phone,
      hireContent: that.data.needscontent,
      backup4: that.data.picIurl1
    }
    qingqiu.get("localHireAdd", data, function (re) {
      console.log(re)
      if (re.success == true) {
        wx.showToast({
          title: '发布成功',
          icon: 'success',
          duration: 3000
        })
        // 公众号消息推送
        qingqiu.get("getPublicUser", null, function (res) {
          console.log(res)
          for (let obj of res.result) {
            var openid = obj.openid
            var mesdata = {
              first: {
                value: "干活佬又上新啦，赶紧去看看！",
                color: "#173177"
              },
              keyword1: {
                value: "有1条招工信息发布啦",
                color: "#173177"
              },
              keyword2: {
                value: utils.nowTime(),
                color: "#173177"
              },
              remark: {
                value: "请进入干活佬查看详情",
                color: "#173177"
              }
            }
            var objdata = {
              touser: openid,
              template_id: "JOX1BcyAiT8BbZdmlB3fAfwzOT5Ud25Tl_WjTDM1ycY",
              miniprogram: {
                appid: "wx14e076d27e942480"
              },
              url: "http://www.baidu.com/",
              data: mesdata
            }
            wx.request({
              url: 'https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=' + app.globalData.access_TokenOff,
              data: objdata,
              method: 'POST',
              success: function (res) {
                console.log(res)
              }
            })
          }
          wx.redirectTo({
            url: '../recruitment/recruitment',
          })
        })
      } else {
        wx.showToast({
          title: re.message,
          icon: 'none',
          duration: 2000
        })
      }
    }, 'post')
  },
// 图片上传（对接完成）
upimg: function (e) {
  var type = e.currentTarget.dataset.type
  var index = e.currentTarget.dataset.number
  var that = this
  wx.chooseImage({
    count: 1,
    sizeType: ['compressed'], // 指定只能为压缩图，首先进行一次默认压缩
    sourceType: ['album', 'camera'],
    success: function (res) {
      console.log(res)
      const tempFilePaths = res.tempFilePaths;
      wx.uploadFile({
        url: api.imgFilter,
        name: 'file',
        filePath: tempFilePaths[0],
        formData: {
          media: tempFilePaths[0]
        },
        method: 'POST',
        header: {
          "Content-Type": "multipart/form-data"
        },
        success: function (res) {
          console.log(res)
          if (res.data =="false") {
            wx.showToast({
              title: '内容含有违法违规内容',
              icon: 'none'
            })
            return
          } else {
            wx.uploadFile({
              url: api.uploadurl,
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
                var sj = that.data.viewUrl + jj.message
                console.log(res)
                that.setData({
                  picIurl: sj,
                  picIurl1: jj.message
                })
              }
            })
          }
        }
      })
    },
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
    var index = e.currentTarget.dataset.index;
    var id = e.currentTarget.dataset.id
    var name = e.currentTarget.dataset.name
    that.setData({
      show: true,
      typeid: id,
      curIndex: index,
      workcityname1: name,
    })
  },
  // 右侧单选点击
  arearight: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    var id = e.currentTarget.dataset.id
    var name = e.currentTarget.dataset.name
    if (that.data.workcityname1 == undefined) {
      wx.showToast({
        title: '请先选择城市',
        icon: 'none',
        duration: 2000
      })
      return
    }
    that.setData({
      show: false,
      showModalStatus: false,
      areaId: id,
      curIndex: index,
      workareaname: name,
      workcityname: that.data.workcityname1
    })
  },
  // 服务规则页面显示
  showModal1: function () {
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
      showModalStatus1: true
    })
    setTimeout(function () {
      animation.opacity(1).rotateX(0).step();
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 200)
  },
  //服务规则页面关闭
  hideModal1: function () {
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    // flag = 0;
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
        showModalStatus1: false
      })
    }.bind(this), 200)
  },

})