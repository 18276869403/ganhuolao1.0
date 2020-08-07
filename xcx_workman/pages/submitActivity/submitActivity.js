// pages/submitShow/submitShow.js
const app = getApp()
const qingqiu = require('../../utils/request.js')
const api = require('../../utils/config.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    uploaderlist: [],
    viewUrl: api.viewUrl,
    iconUrl: api.iconUrl,
    activityId: 0,
    wxCaseId:0,
    needscontent: '',
    comment:'',
    tupian: '',
    id: '',
    name: '',
    tupianlist: [],
    imgUrl: '',
    picIurl1: [],
    picIurl: '',
    picimg: '',
    num: 1,
    btnFlag: false,
    tupianlists: [],
    caseitem:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showShareMenu({
      withShareTicket: true
    })
    if (options != undefined) {
      if (options.id != undefined) {
        var that = this
        qingqiu.get("getVoteById",{id:options.id},function(res){
          console.log(res)
          if(res.result != null){
            var tupianlists = []
            if(res.result.picOne.indexOf(',') != -1){
              tupianlists = res.result.picOne.split(',')
            }else{
              tupianlists.push(res.result.picOne)
            }
            res.result.picOne = tupianlists
            that.setData({
              comment:res.result.caseName,
              needscontent:res.result.caseContent,
              tupianlists:tupianlists,
              wxCase:res.result,
              wxCaseId:res.result.id
            })
          }else{
            wx.showToast({
              title: res.message,
              icon:"none"
            })
          }
        })
      }
      if(options.obj != undefined){
        var item = JSON.parse(options.obj)
        console.log(item)
        var tupianlists = []
        if(item.picOne.indexOf(',') != -1){
          tupianlists = item.picOne.split(',')
        }else{
          tupianlists.push(item.picOne)
        }
        this.setData({
          comment:item.caseName,
          needscontent:item.caseContent,
          tupianlists:tupianlists,
          wxCase:item,
          wxCaseId:item.id
        })
      }
    }
    this.setData({
      wxuserid: app.globalData.wxid
    })
  },
  onShow: function () {

  },
  // lijifabu: function () {

  // },
  fanhui: function () {
    wx.switchTab({
      url: '../showwork/showwork',
    })
  },
  // 发布晒晒
  lijifabu() {
    var that = this
    that.setData({
      btnFlag: true
    })
    if (that.data.comment == "") {
      wx.showToast({
        title: '活动标题不能为空！',
        icon: 'none',
        duration: 2000
      })
      that.setData({
        btnFlag: false
      })
      return
    }
    that.data.picIurl1 = []
    if (that.data.tupianlists.length > 0) {
      for (let obj of that.data.tupianlists) {
        that.data.picIurl1 += obj + ','
      }
      that.data.picIurl1 = that.data.picIurl1.substring(0, that.data.picIurl1.length - 1)
    } else {
      wx.showToast({
        title: '至少上传一张图片',
        icon: 'none'
      })
      that.setData({
        btnFlag: false
      })
      return
    }
    if(that.data.wxCaseId == 0){
      var data = {
        wxUserId: app.globalData.wxid,
        backup2: 1,
        backup3: 0,
        backup4: 0,
        caseName: that.data.comment,
        caseContent:that.data.needscontent,
        picOne: that.data.picIurl1
      }
      qingqiu.get("insertCase", data, function (re) {
        console.log(re)
        that.setData({
          btnFlag: false
        })
        if (re.success == true) {
          wx.showToast({
            title: '发布成功！',
            icon: 'success',
            duration: 2000
          })
          app.globalData.showworkRefresh = 1
          // wx.switchTab({
          //   url: '../showwork/showwork',
          // })
          setTimeout(function () {
            wx.navigateBack({
              delta: 1
            })
          }, 1000)
        }
      }, 'post')
    }else{
      var data = {
        id:that.data.wxCase.id,
        wxUserId:app.globalData.wxid,
        backup2:that.data.wxCase.backup2,
        backup3:that.data.wxCase.backup3,
        backup4:that.data.wxCase.backup4,
        caseName:that.data.comment,
        caseContent:that.data.needscontent,
        picOne:that.data.picIurl1
      }
      qingqiu.get("updateCase",data,function(res){
        that.setData({
          btnFlag: true
        })
        if(res.result != true){
          wx.showToast({
            title: '修改成功',
            icon:'none'
          })
          setTimeout(function () {
            app.globalData.showworkRefresh = 1
            wx.switchTab({
              url: '../showwork/showwork',
            })
          }, 1000)
        }else{
          wx.showToast({
            title: res.message,
            icon:"none"
          })
        }
      })
    }
  },
  //获取输入的晒活内容
  commentinput: function (e) {
    this.setData({
      comment: e.detail.value
    })
  },
  commentinputblur: function (e) {
    if (e.detail.value == '') {
      return
    }
    var that = this
    qingqiu.get("checkWords", {
      content: e.detail.value
    }, function (res) {
      if (res == 1) {
        that.setData({
          comment: ''
        })
        wx.showToast({
          title: '内容包含敏感词，请重新输入...',
          icon: 'none',
          duration: 2000
        })
        return
      } else if (res == 2) {
        wx.showToast({
          title: '校验失败',
          icon: 'none'
        })
        that.setData({
          comment: ''
        })
        return
      }
    }, 'POST')
  },

  //获取输入的晒活内容
  needscontentinput: function (e) {
    this.setData({
      needscontent: e.detail.value
    })
  },
  needscontentblur: function (e) {
    if (e.detail.value == '') {
      return
    }
    var that = this
    qingqiu.get("checkWords", {
      content: e.detail.value
    }, function (res) {
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
      } else if (res == 2) {
        wx.showToast({
          title: '校验失败',
          icon: 'none'
        })
        that.setData({
          needscontent: ''
        })
        return
      }
    }, 'POST')
  },

  // 图片上传（对接完成）
  upimg: function (e) {
    var type = e.currentTarget.dataset.type
    var index = e.currentTarget.dataset.number
    var that = this
    var index2 = 0
    var index3 = 0
    that.setData({
      btnFlag: true
    })
    wx.chooseImage({
      count: 5,
      sizeType: ['compressed'], // 指定只能为压缩图，首先进行一次默认压缩
      sourceType: ['album', 'camera'],
      success: function (res) {
        that.setData({
          btnFlag: false
        })
        console.log(res)
        const tempFilePaths = res.tempFilePaths;
        // const uploaderlist=that.data.uploaderlist.concat(tempFilePaths)  
        for (let i = 0; i < tempFilePaths.length; i++) {
          if (!/\.(jpg|jpeg|png|JPG|PNG)$/.test(tempFilePaths[i])) {
            wx.showToast({
              title: '请上传静态图片',
              icon: 'none'
            })
            that.setData({
              btnFlag: false
            })
            return
          }
          wx.uploadFile({
            url: api.imgFilter,
            name: 'file',
            filePath: tempFilePaths[index3],
            formData: {
              media: tempFilePaths[index3]
            },
            method: 'POST',
            header: {
              "Content-Type": "multipart/form-data"
            },
            success: function (res) {
              console.log(res)
              if (res.data == "false") {
                that.setData({
                  btnFlag: false
                })
                wx.showToast({
                  title: '内容含有违法违规内容',
                  icon: 'none'
                })
                return
              } else {
                wx.uploadFile({
                  url: api.uploadurl,
                  filePath: tempFilePaths[index2],
                  header: {
                    "Content-Type": "multipart/form-data"
                  },
                  formData: {
                    method: 'POST' //请求方式
                  },
                  name: 'file',
                  success(res) {
                    that.setData({
                      btnFlag: false
                    })
                    console.log(index2)
                    var r = res.data
                    var jj = JSON.parse(r);
                    var sj = api.viewUrl + jj.message
                    var tupianlists = that.data.tupianlists
                    if (tupianlists.length < 5) {
                      tupianlists.push(jj.message)
                    }
                    // tupianlists.push(jj.message)
                    that.setData({
                      tupianlists: tupianlists,
                      picimg1: sj,
                      picimgs1: jj.message
                    })
                  }
                })
                index2 += 1
              }
            }
          })
          index3 += 1
        }
      },
    })
    that.setData({
      btnFlag: false
    })
  },
  // 删除图片
  shanchu: function (e) {
    var that = this
    var tplj = e.currentTarget.dataset.tplj
    that.data.tupianlists.splice(tplj, 1)
    console.log(that.data.tupianlists)
    that.setData({
      tupianlists: that.data.tupianlists
    })
    that.data.num -= 1;
    that.setData({
      num: that.data.num
    });
  },
  // 预览图片
  imgview: function (e) {
    var src = e.currentTarget.dataset.src
    wx.previewImage({
      current: src,
      urls: [src]
    })
  }
})