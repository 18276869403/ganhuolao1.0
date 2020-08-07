// pages/submitConvenience/submitConvenience.js
const app = getApp()
const api = require("../../utils/config.js")
const utils = require("../../utils/util.js")
const qingqiu = require("../../utils/request.js")
const date = new Date();
//月
var M = (date.getMonth());
//日
var D = date.getDate();
//时
var h = date.getHours();
//分
var m = date.getMinutes();
const years = [];
const months = [];
const days = [];
const hours = [];
const minutes = [];
//获取年
for (let i = date.getFullYear(); i <= date.getFullYear() + 5; i++) {
  years.push("" + i);
}
//获取月份
for (let i = 1; i <= 12; i++) {
  if (i < 10) {
    i = "0" + i;
  }
  months.push("" + i);
}
//获取日期
for (let i = 1; i <= 31; i++) {
  if (i < 10) {
    i = "0" + i;
  }
  days.push("" + i);
}
//获取小时
for (let i = 0; i < 24; i++) {
  if (i < 10) {
    i = "0" + i;
  }
  hours.push("" + i);
}
//获取分钟
for (let i = 0; i < 60; i++) {
  if (i < 10) {
    i = "0" + i;
  }
  minutes.push("" + i);
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    viewUrl: api.viewUrl,
    iconUrl: api.iconUrl,
    id: 0,
    index: 0,
    type: ['选择类型', '车找人', '人找车', '车找货'],
    multiArray: [years, months, days, hours, minutes],
    multiIndex: [0, 9, 16, 10, 17],
    choose_year: '',
    time: '选择出发日期',
    starAddress: '',
    endAddress: '',
    linkname: '',
    linkphone: '',
    content: '',
    tupianlists: [],
    num: 1,
    btnFlag: false
  },

  // 提交
  submit: function () {
    var that = this
    this.setData({
      btnFlag: true
    })
    var data = {}
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
    data.type = that.data.index
    data.wxUserId = 1552
    data.starAddress = that.data.starAddress
    data.endAddress = that.data.endAddress
    data.linkName = that.data.linkname
    data.linkPhone = that.data.linkphone
    data.content = that.data.content
    data.pic = that.data.picIurl1
    if (data.type == 0) {
      wx.showToast({
        title: '选择类型',
        icon: 'none'
      })
      this.setData({
        btnFlag: false
      })
      return
    }
    if (that.data.time == "选择出发日期") {
      wx.showToast({
        title: '选择出发日期',
        icon: 'none'
      })
      this.setData({
        btnFlag: false
      })
      return
    }
    data.starTime = that.data.time + ':00'
    var s = qingqiu.yanzheng(data.starAddress + ",输入出发地|" + data.endAddress + ",输入目的地|" + data.linkName + ",输入联系人|" + data.linkPhone + ",输入联系电话")
    if (s != 0) {
      wx.showToast({
        title: s,
        icon: "none"
      })
      this.setData({
        btnFlag: false
      })
      return
    }
    console.log(data.linkPhone)
    if (data.linkPhone.length != 11) {
      wx.showToast({
        title: '输入11位数电话',
        icon: 'none'
      })
      this.setData({
        btnFlag: false
      })
      return
    }
    // 判断id是否存在，如果不存在——添加/存在——修改
    if (that.data.id == 0) {
      console.log('添加',data)
      qingqiu.get("convenienceAdd", data, function (res) {
        that.setData({
          btnFlag: false
        })
        if (res.message == "添加成功!") {
          wx.showToast({
            title: '发布成功',
            icon: "none"
          })
          setTimeout(function () {
            wx.redirectTo({
              url: '../convenience/convenience',
            })
          }, 1000)
        } else {
          wx.showToast({
            title: res.message,
            icon: "none"
          })
        }
      }, 'post')
    } else {
      data.id = that.data.id
      qingqiu.get("convenienceEdit", data, function (res) {
        that.setData({
          btnFlag: false
        })
        if (res.message == "编辑成功！") {
          wx.showToast({
            title: '修改成功',
            icon: "none"
          })
          setTimeout(function () {
            wx.redirectTo({
              url: '../convenience/convenience',
            })
          }, 1000)
        } else {
          wx.showToast({
            title: res.message,
            icon: "none"
          })
        }
      }, 'put')
    }
  },

  // 修改数据回显
  chushihua: function (id) {
    var that = this
    qingqiu.get("queryconvenienceById", {id: id}, function (res) {
      if(res.success == true){
        if(res.result != null){
          if(res.result.pic.indexOf(',') != -1){
            that.data.tupianlists = res.result.pic.split(',')
          }else{
            that.data.tupianlists.push(res.result.pic)
          }
          that.setData({
            id:res.result.id,
            index:res.result.type,
            tupianlists:that.data.tupianlists,
            content:res.result.content,
            time:res.result.starTime.substring(0,16),
            starAddress:res.result.starAddress,
            endAddress:res.result.endAddress,
            linkname:res.result.linkName,
            linkphone:res.result.linkPhone,
          })
        }
      }else{
        wx.showToast({
          title: res.message,
          icon:"none"
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 传入id表示修改
    this.chushihua(1)
    if (options != undefined) {
      if (options.id != undefined) {
        this.chushihua(1)
        this.setData({
          id: options.id
        })
      }
    }
    console.log('默认年份', this.data.multiArray[0][0])
    console.log('默认月份', this.data.multiArray[1][M])
    console.log('默认日份', this.data.multiArray[2][D - 1])
    console.log('默认小时', this.data.multiArray[3][h])
    console.log('默认小时', this.data.multiArray[4][m])
    //设置默认的年份
    this.setData({
      choose_year: this.data.multiArray[0][0],
      ['multiIndex[1]']: M,
      ['multiIndex[2]']: D - 1,
      ['multiIndex[3]']: h,
      ['multiIndex[4]']: m
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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

  },

  // 选择类型
  bindPickerChangeType: function (e) {
    console.log(e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
  /**
   * 获取时间日期
   */
  bindMultiPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', +e.detail.value)
    this.setData({
      multiIndex: e.detail.value
    })
    const index = this.data.multiIndex;
    const year = this.data.multiArray[0][index[0]];
    const month = this.data.multiArray[1][index[1]];
    const day = this.data.multiArray[2][index[2]];
    const hour = this.data.multiArray[3][index[3]];
    const minute = this.data.multiArray[4][index[4]];
    console.log(`${year}-${month}-${day}-${hour}-${minute}`);
    this.setData({
      time: year + '-' + month + '-' + day + ' ' + hour + ':' + minute
    })
  },
  /**
   * 监听picker的滚动事件
   */
  bindMultiPickerColumnChange: function (e) {
    // 获取年份
    if (e.detail.column == 0) {
      let choose_year = this.data.multiArray[e.detail.column][e.detail.value]
      console.log(choose_year);
      this.setData({
        choose_year
      })
    }
    // 获取月份
    if (e.detail.column == 1) {
      let num = parseInt(this.data.multiArray[e.detail.column][e.detail.value]);
      let temp = [];
      // 判断31天的月份
      if (num == 1 || num == 3 || num == 5 || num == 7 || num == 8 || num == 10 || num == 12) {
        for (let i = 1; i <= 31; i++) {
          if (i < 10) {
            i = "0" + 1;
          }
          temp.push("" + i);
        }
        this.setData({
          ['multiArray[2]']: temp
        });
      } else if (num == 4 || num == 6 || num == 9 || num == 11) { // 判断30天的月份
        for (let i = 1; i <= 30; i++) {
          if (i < 10) {
            i = "0" + i;
          }
          temp.push("" + i);
        }
        this.setData({
          ['multiArray[2]']: temp
        });
      } else if (num == 2) { // 判断2月份天数
        let year = parseInt(this.data.choose_year);
        console.log(year);
        if (((year % 400 == 0) || (year % 100 != 0)) && (year % 4 == 0)) {
          for (let i = 1; i <= 29; i++) {
            if (i < 10) {
              i = "0" + i;
            }
            temp.push("" + i)
          }
          this.setData({
            ['multiArray[2]']: temp
          });
        } else {
          for (let i = 1; i <= 28; i++) {
            if (i < 10) {
              i = "0" + i;
            }
            temp.push("" + i);
          }
          this.setData({
            ['multiArray[2]']: temp
          })
        }
      }
      console.log(this.data.multiArray[2]);
    }
    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    data.multiIndex[e.detail.column] = e.detail.value;
    this.setData(data);
  },

  /**
   * 获取出发地
   */
  starAddressinput: function (e) {
    this.setData({
      starAddress: e.detail.value
    })
  },
  /**
   * 过滤出发地
   */
  starAddressblur: function (e) {
    console.log(e.detail.value)
    if (e.detail.value == '') {
      return
    }
    var that = this
    qingqiu.get("checkWords", {
      content: e.detail.value
    }, function (res) {
      if (res == 1) {
        that.setData({
          starAddress: ''
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
          starAddress: ''
        })
        return
      }
    }, 'POST')
  },

  /**
   * 获取目的地
   */
  endAddressinput: function (e) {
    this.setData({
      endAddress: e.detail.value
    })
  },
  /**
   * 过滤目的地
   */
  endAddressblur: function (e) {
    if (e.detail.value == '') {
      return
    }
    var that = this
    qingqiu.get("checkWords", {
      content: e.detail.value
    }, function (res) {
      if (res == 1) {
        that.setData({
          endAddress: ''
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
          endAddress: ''
        })
        return
      }
    }, 'POST')
  },

  /**
   * 获取联系人
   */
  linknameinput: function (e) {
    this.setData({
      linkname: e.detail.value
    })
  },
  /**
   * 过滤联系人
   */
  linknameblur: function (e) {
    if (e.detail.value == '') {
      return
    }
    var that = this
    qingqiu.get("checkWords", {
      content: e.detail.value
    }, function (res) {
      if (res == 1) {
        that.setData({
          linkname: ''
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
          linkname: ''
        })
        return
      }
    }, 'POST')
  },

  /**
   * 获取联系电话
   */
  linkphoneinput: function (e) {
    this.setData({
      linkphone: e.detail.value
    })
  },
  /**
   * 过滤联系电话
   */
  linkphoneblur: function (e) {
    if (e.detail.value == '') {
      return
    }
    var that = this
    qingqiu.get("checkWords", {
      content: e.detail.value
    }, function (res) {
      if (res == 1) {
        that.setData({
          linkphone: ''
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
          linkphone: ''
        })
        return
      }
    }, 'POST')
  },
  /**
   * 获取详细介绍
   */
  contentinput: function (e) {
    this.setData({
      content: e.detail.value
    })
  },
  /**
   * 过滤详细介绍
   */
  contentblur: function (e) {
    if (e.detail.value == '') {
      return
    }
    var that = this
    qingqiu.get("checkWords", {
      content: e.detail.value
    }, function (res) {
      if (res == 1) {
        that.setData({
          content: ''
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
          content: ''
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
                    var tupianlists = that.data.tupianlists
                    if (tupianlists.length < 5) {
                      tupianlists.push(jj.message)
                    }
                    that.setData({
                      tupianlists: tupianlists,
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