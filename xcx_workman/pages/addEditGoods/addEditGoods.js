// pages/addEditGoods/addEditGoods.js
const app = getApp()
const qingqiu = require('../../utils/request.js')
const api = require('../../utils/config.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    viewUrl: api.viewUrl,
    iconUrl:api.iconUrl,
    imgUrl: '',
    needsname: '',
    goodsname: '',
    originalPrice: '',
    salesPrice: '',
    detailscontent: '',
    needscontent: '',
    workaddress: '',
    linkman: '',
    phone: '',
    addspid: '',
    addspid: [],
    imglunbo: '',
    imgDetail: '',
    spxglist: [],
    yhid: '',
    spid: '',
    btnFlag: false,
    picIurl: '',
    picIurl1: '',
    picIurltwo: '',
    picIurltwo1: '',
    picDetail: '',
    picDetail1: '',
    picDetailtwo: '',
    picDetailtwo1: '',
    wxuserid: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showShareMenu({
      withShareTicket: true
    })
    var spxglist = JSON.parse(options.obj1 == undefined ? options.obj : options.obj1)
    this.spid = spxglist
    if (options.obj == undefined) {
      var picIurl1 = spxglist.goodPic1[0]
      var picIurltwo1 = spxglist.goodPic1[1]
      var picDetail1 = spxglist.goodPic2[0]
      var picDetailtwo1 = spxglist.goodPic2[1]
    } else {
      var picIurl1 = ""
      var picIurltwo1 = ""
      var picDetail1 = ""
      var picDetailtwo1 = ""
    }
    console.log(spxglist)
    this.setData({
      spxglist: spxglist,
      picIurl1: picIurl1,
      picIurltwo1: picIurltwo1,
      picDetail1: picDetail1,
      picDetailtwo1: picDetailtwo1,
      wxuserid: app.globalData.wxid
    })
  },
  // 修改商品
  xugaispxx() {
    var that = this
    that.setData({
      btnFlag: true
    })
    that.imglunbo = that.data.picIurl1 + ',' + that.data.picIurltwo1
    that.imgDetail = that.data.picDetail1 + ',' + that.data.picDetailtwo1
    var data = {
      id: that.data.spxglist.id,
      userId: that.data.spxglist.userId,
      goodName: that.data.goodsname != "" ? that.data.goodsname : that.data.spxglist.goodName,
      oldPrice: that.data.originalPrice != "" ? that.data.originalPrice : that.data.spxglist.oldPrice,
      newPrice: that.data.salesPrice != "" ? that.data.salesPrice : that.data.spxglist.newPrice,
      goodMemo: that.data.detailscontent != "" ? that.data.detailscontent : that.data.spxglist.goodMemo,
      goodPic1: that.imglunbo != "," ? that.imglunbo : that.data.spxglist.goodPic1[0] + ',' + that.data.spxglist.goodPic1[1],
      goodPic2: that.imgDetail != "," ? that.imgDetail : that.data.spxglist.goodPic2[0] + ',' + that.data.spxglist.goodPic2[1],
    }
    qingqiu.get("editUserGood", data, function (re) {
      that.setData({
        btnFlag: false
      })
      if (re.success == true) {
        wx.showToast({
          title: '修改成功！',
          icon: 'success',
          duration: 2000
        })
        wx.navigateBack({
          delta: 1,
          success: function(e) {
            var page = getCurrentPages().pop();
            if (page == undefined || page == null) return;
            page.onLoad();
          }
        })
      }
    }, 'put')
  },

  // 添加商品
  lijifabu() {
    var that = this
    that.setData({
      btnFlag: true
    })
    that.imglunbo = that.data.picIurl1 + ',' + that.data.picIurltwo1
    that.imgDetail = that.data.picDetail1 + ',' + that.data.picDetailtwo1
    if (that.data.goodsname == "") {
      wx.showToast({
        title: '商品名字不能为空',
        icon: 'none'
      })
      that.setData({
        btnFlag: false
      })
      return
    }
    if (that.data.originalPrice == "") {
      wx.showToast({
        title: '商品原价不能为空',
        icon: 'none'
      })
      that.setData({
        btnFlag: false
      })
      return
    }
    var data = {
      userId: app.globalData.wxid,
      goodName: that.data.goodsname,
      oldPrice: that.data.originalPrice,
      newPrice: that.data.salesPrice,
      goodMemo: that.data.detailscontent,
      goodPic1: that.imglunbo,
      goodPic2: that.imgDetail
    }
    qingqiu.get("addUserGood", data, function (re) {
      that.setData({
        btnFlag: false
      })
      if(re.message == "操作失败"){
        wx.showToast({
          title: "添加失败!",
          icon:'none'
        })
        return
      }else if (re.success == true) {
        wx.showToast({
          title: '添加成功！',
          icon: 'success',
          duration: 2000 
        })
        wx.navigateBack({
          delta: 1,
          success: function(e) {
            var page = getCurrentPages().pop();
            if (page == undefined || page == null) return;
            page.onLoad();
          }
        })
        // wx.redirectTo({
        //   url: '../myGoods/myGoods',
        // })
      } else {
        wx.showToast({
          title: '店铺没有认证，请认证后添加商品',
          icon: 'none',
          duration: 2000
        })
      }
    }, 'post')
  },
  //获取输入的商品名字
  goodsnameinput: function (e) {
    this.setData({
      goodsname: e.detail.value
    })
  },
  // 敏感词过滤
  goodsnameblur: function (e) {
    var that = this
    if(e.detail.value == ''){
      return
    }
    qingqiu.get("checkWords", {
      content: e.detail.value
    }, function (res) {
      if (res == 1) {
        that.setData({
          goodsname: ''
        })
        wx.showToast({
          title: '内容包含敏感词，请重新输入...',
          icon: 'none',
        })
        return
      } else if (res == 2) {
        wx.showToast({
          title: '校验失败',
          icon: 'none'
        })
        that.setData({
          goodsname: ''
        })
        return
      }
    }, 'POST')
  },
  //获取输入的原价
  originalPriceinput: function (e) {
    this.setData({
      originalPrice: e.detail.value
    })
  },
  //获取输入的优惠价
  salesPriceinput: function (e) {
    this.setData({
      salesPrice: e.detail.value
    })
  },
  //获取输入的商品详情
  detailscontentinput: function (e) {
    this.setData({
      detailscontent: e.detail.value
    })
  },
  //敏感词
  detailscontentblur: function (e) {
    var that = this
    if(e.detail.value == ''){
      return
    }
    qingqiu.get("checkWords", {
      content: e.detail.value
    }, function (res) {
      if (res == 1) {
        that.setData({
          detailscontent: ''
        })
        wx.showToast({
          title: '内容包含敏感词，请重新输入...',
          icon: 'none',
        })
        return
      } else if (res == 2) {
        wx.showToast({
          title: '校验失败',
          icon: 'none'
        })
        that.setData({
          detailscontent: ''
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
    that.setData({
      btnFlag: true
    })
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'], // 指定只能为压缩图，首先进行一次默认压缩
      sourceType: ['album', 'camera'],
      success: function (res) {
        console.log(res)
        const tempFilePaths = res.tempFilePaths;
        if(!/\.(jpg|jpeg|png|JPG|PNG)$/.test(tempFilePaths[0])){
          wx.showToast({
            title: '请上传静态图片',
            icon:'none'
          })
          that.setData({
            btnFlag:false
          })
          return
        }
        wx.showLoading({
          title: '上传图片中',
        })
        wx.uploadFile({
          url: api.imgFilter,
          name: 'file',
          filePath: tempFilePaths[0],
          formData: {
            media: tempFilePaths[0]
          },
          method: 'POST',
          header: {
            // "Content-Type": "multipart/form-data"
          },
          success: function (res) {
            console.log(res)
            if (res.data == "false") {
              wx.showToast({
                title: '内容含有违法违规内容',
                icon: 'none'
              })
              that.setData({
                btnFlag: false
              })
              return
            } else {
              wx.uploadFile({
                url: api.uploadurl,
                filePath: tempFilePaths[0],
                header: {
                  // "Content-Type": "multipart/form-data"
                },
                formData: {
                  method: 'POST' //请求方式
                },
                name: 'file',
                success(re) {
                  that.setData({
                    btnFlag: false
                  })
                  var r = re.data
                  var jj = JSON.parse(r);
                  if(!jj.success){
                    wx.showToast({
                      title: '图片上传失败',
                      icon:'none'
                    })
                    return
                  }
                  wx.hideLoading({
                    complete: (res) => {},
                  })
                  var sj = api.viewUrl + jj.message
                  console.log(re)
                  if (type == '1') {
                    that.setData({
                      picIurl: sj,
                      picIurl1: jj.message
                    })
                  } else if (type == '2') {
                    that.setData({
                      picIurltwo: sj,
                      picIurltwo1: jj.message
                    })
                  } else if (type == '3') {
                    that.setData({
                      picDetail: sj,
                      picDetail1: jj.message
                    })
                  } else if (type == '4') {
                    that.setData({
                      picDetailtwo: sj,
                      picDetailtwo1: jj.message
                    })
                  }
                  that.setData({
                    btnFlag: false
                  })
                }
              })
            }
          }
        })
      },
    })
    that.setData({
      btnFlag: false
    })
  },
  // 删除图片
  shanchu1: function (e) {
    var that = this
    var tplj = e.currentTarget.dataset.tplj
    if (that.data.picIurl1 == tplj) {
      that.data.picIurl1 = ''
    }
    that.setData({
      picIurl1: that.data.picIurl1
    })
  }, 
  // 预览图片
  imgview: function (e) {
    var src = e.currentTarget.dataset.src
    wx.previewImage({
      current: src,
      urls: [src]
    })
  },
  shanchu2: function (e) {
    var that = this
    var tplj = e.currentTarget.dataset.tplj
    if (that.data.picIurltwo1 = tplj) {
      that.data.picIurltwo1 = ''
    }
    that.setData({
      picIurltwo1: that.data.picIurltwo1
    })
  },
  shanchu3: function (e) {
    var that = this
    var tplj = e.currentTarget.dataset.tplj
    if (that.data.picDetail1 = tplj) {
      that.data.picDetail1 = ''
    }
    that.setData({
      picDetail1: that.data.picDetail1
    })
  },
  shanchu4: function (e) {
    var that = this
    var tplj = e.currentTarget.dataset.tplj
    if (that.data.picDetailtwo1 = tplj) {
      that.data.picDetailtwo1 = ''
    }
    that.setData({
      picDetailtwo1: that.data.picDetailtwo1
    })
  },
})