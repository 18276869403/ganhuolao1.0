// pages/submitWelfare/submitWelfare.js
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
    startdate: '选择活动时间',
    enddate: '选择截止时间',
    endDate:'',
    newDate:'',
    // 添加参数
    activityname:'',
    activitynameinput:'',
    activityCompany:'',
    activityrenshu:'',
    activitycontent:'',
    // startdate:'',
    // enddate:'',
    picIurl1:'',
    picIurl:'',
    piclist:[],
    btnFlag:false,
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
    this.setData({
      newDate:utils.newDate(),
      endDate:utils.newDate()
    })
  },
  // 发布活动
  fabugongyi(){
    var that = this
    that.setData({
      btnFlag:true
    })
    if(that.data.activitynameinput==''){
      wx.showToast({
        title: '请输入活动名称',
        icon: 'none',
        duration: 3000
      })
      that.setData({
        btnFlag:false
      })
      return
    }
    if(that.data.activitynameinput.length > 15){
      wx.showToast({
        title: '活动标题不能超过15个字',
        icon:'none'
      })
      that.setData({
        btnFlag:false
      })
      return
    }
    if(that.data.activityCompany==''){
      wx.showToast({
        title: '请输入主办单位',
        icon: 'none',
        duration: 3000
      })
      that.setData({
        btnFlag:false
      })
      return
    }
    if(that.data.activityrenshu==''){
      wx.showToast({
        title: '请输入招募人数',
        icon: 'none',
        duration: 3000
      })
      that.setData({
        btnFlag:false
      })
      return
    }
    if(that.data.startdate=='选择活动时间'){
      wx.showToast({
        title: '请输入活动时间',
        icon: 'none',
        duration: 3000
      })
      that.setData({
        btnFlag:false
      })
      return
    }
    if(that.data.enddate=='选择截止时间'){
      wx.showToast({
        title: '请输入截止时间',
        icon: 'none',
        duration: 3000
      })
      that.setData({
        btnFlag:false
      })
      return
    }
    if(utils.checkDate(that.data.enddate,that.data.startdate) < 1){
      wx.showToast({
        title: '报名时间不能大于活动截止时间哦',
        icon:'none'
      })
      that.setData({
        btnFlag:false
      })
      return
    }
    // if(that.data.picIurl1==''){
    //   wx.showToast({
    //     title: '请上传图片',
    //     icon: 'none',
    //     duration: 3000
    //   })
    //   return
    // }
    if(that.data.picIurl1!=''){
      var pic = ''
      for(let obj of that.data.piclist){
        pic += obj+','
      }
    }
    var data = {
      wxUserId: app.globalData.wxid,
      title:that.data.activitynameinput,
      company:that.data.activityCompany,
      activityNum:that.data.activityrenshu,
      content:that.data.activitycontent,
      activityTime:that.data.startdate + " 00:00:00",
      endTime:that.data.enddate + " 00:00:00",
      pic:pic,
    }
    console.log(data)
    qingqiu.get("addActivity", data, function (re) {
      console.log(re)
      that.setData({
        btnFlag:false
      })
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
  activitynameinput: function (e) {
    console.log(e.detail.value)
    this.setData({
      activitynameinput: e.detail.value
    })
  },
  // 活动名称失去焦点
  activitynameblur:function(e){
    var that=this
    if(e.detail.value.length > 15){
      wx.showToast({
        title: '活动标题不能超过15个字',
        icon:'none'
      })
      return
    }
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
  //获取主办单位
  activityCompanyinput: function (e) {
    this.setData({
      activityCompany: e.detail.value
    })
  },
  // 主办单位失去焦点
  activityCompanyblur:function(e){
    var that=this
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
  // 活动内容失去焦点
  activitycontentblur:function(e){
    var that=this
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
    var type = e.currentTarget.dataset.type
    var index = e.currentTarget.dataset.number
    var that = this
    that.setData({
      btnFlag:true
    })
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
              that.setData({
                btnFlag:false
              })
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
                  that.setData({
                    btnFlag:false
                  })
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