// pages/submitWelfare/submitWelfare.js
const app = getApp()
const qingqiu = require('../../utils/request.js')
const api = require('../../utils/config.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    viewUrl: api.viewUrl,
    startdate: '选择活动时间',
    enddate: '选择截止时间',
    picIurl:'',
    picIurl1:'',
    piclist:[],
    workcityname:'',
    workareaname:''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showShareMenu({
      withShareTicket: true
    })
    this.getcity()
  },
  // 发布活动
  fabugongyi(){
    var data = {
      id: app.globalData.wxid,
      hireTitle:that.data.activityname,
      hireTitle:that.data.activityCompany,
      hireTitle:that.data.activityrenshu,
      hireTitle:that.data.activitycontent,
      hireTitle:that.data.startdate,
      hireTitle:that.data.enddate,
      hireTitle:that.data.picIurl1,
    }
    console.log(data)
    debugger
    qingqiu.get("", data, function (re) {
      if (re.success == true) {
        wx.showToast({
          title: '发布成功',
          icon: 'success',
          duration: 3000
        })
        wx.redirectTo({
          url: '../Welfare/Welfare',
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
  //获取活动名称
  activityname: function (e) {
    this.setData({
      activityname: e.detail.value
    })
  },
  //获取主办单位
  activityCompany: function (e) {
    this.setData({
      activityCompany: e.detail.value
    })
  },
  //获取招募人数
  activityrenshu: function (e) {
    this.setData({
      activityrenshu: e.detail.value
    })
  },
  //获取活动内容
  activitycontent: function (e) {
    this.setData({
      activitycontent: e.detail.value
    })
  },
   // 活动时间
   bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      startdate: e.detail.value
    })
  },
  // 截止时间
  FindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      enddate: e.detail.value
    })
  },
  // 图片上传（对接完成）
  upimg: function (e) {
    var that = this
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'], // 指定只能为压缩图，首先进行一次默认压缩
      sourceType: ['album', 'camera'],
      success: function (res) {
        console.log(res)
        const tempFilePaths = res.tempFilePaths;
        qingqiu.messageReg(tempFilePaths, 1, function(re) {
          var data = JSON.parse(re.data)
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
                that.data.piclist.push(jj.message)
                that.setData({
                  picIurl: sj,
                  picIurl1: jj.message,
                  piclist:that.data.piclist
                })
              }
            })
          }
        })
      },
    })
  },
  // 删除图片
  shanchu: function (e) {
    var that = this
    var tplj = e.currentTarget.dataset.tplj
    that.data.piclist.splice(tplj, 1)
    console.log(that.data.piclist)
    that.setData({
      piclist: that.data.piclist
    })
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