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
    iconUrl: api.iconUrl,
    id:0,
    index: 0,
    type: ['选择类型', '车找人', '人找车','车找货'],
    multiArray: [years, months, days, hours, minutes],
    multiIndex: [0, 9, 16, 10, 17],
    choose_year: '',
    time:'选择出发日期',
    starAddress:'',
    endAddress:'',
    linkname:'',
    linkphone:'',
    content:'',
    btnFlag:false
  },

  // 提交
  submit:function(){
    var that = this
    this.setData({
      btnFlag:true
    })
    var data = {}
    // 判断id是否存在，如果不存在——添加/存在——修改
    if(that.data.id == 0){
      data.type = that.data.index
      data.wxUserId = app.globalData.wxid
      data.starAddress = that.data.starAddress
      data.endAddress = that.data.endAddress
      data.linkName = that.data.linkname
      data.linkPhone = that.data.linkphone
      data.content = that.data.content
      if(data.type == 0){
        wx.showToast({
          title:'选择类型',
          icon:'none'
        })
        this.setData({
          btnFlag:false
        })
        return
      }
      if(that.data.time == "选择出发日期"){
        wx.showToast({
          title:'选择出发日期',
          icon:'none'
        })
        this.setData({
          btnFlag:false
        })
        return
      }
      data.starTime = that.data.time + ':00'
      var s = qingqiu.yanzheng(data.starAddress + ",输入出发地|" + data.endAddress + ",输入目的地|" + data.linkName + ",输入联系人|" + data.linkPhone + ",输入联系电话")
      if(s != 0){
        wx.showToast({
          title: s,
          icon:"none"
        })
        this.setData({
          btnFlag:false
        })
        return
      }
      console.log(data.linkPhone)
      if(data.linkPhone.length != 11){
        wx.showToast({
          title: '输入11位数电话',
          icon:'none'
        })
        this.setData({
          btnFlag:false
        })
        return
      }
      qingqiu.get("convenienceAdd",data,function(res){
        that.setData({
          btnFlag:false
        })
        if(res.message == "添加成功!"){
          wx.showToast({
            title: '发布成功',
            icon:"none"
          })
          setTimeout(function(){
            wx.redirectTo({
              url: '../convenience/convenience',
            })
          },1000)
        }else{
          wx.showToast({
            title: res.message,
            icon:"none"
          })
        }
      },'post')
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('默认年份', this.data.multiArray[0][0])
    console.log('默认月份',this.data.multiArray[1][M])
    console.log('默认日份',this.data.multiArray[2][D-1])
    console.log('默认小时',this.data.multiArray[3][h])
    console.log('默认小时',this.data.multiArray[4][m])
    //设置默认的年份
    this.setData({
      choose_year: this.data.multiArray[0][0],
      ['multiIndex[1]']:M,
      ['multiIndex[2]']:D-1,
      ['multiIndex[3]']:h,
      ['multiIndex[4]']:m
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
      time: year + '-' + month + '-' + day  + ' ' + hour + ':' + minute
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
          for(let i =1;i<=29;i++){
            if(i<10){
              i = "0" + i;
            }
            temp.push("" + i)
          }
          this.setData({
            ['multiArray[2]']:temp
          });
        }else{
          for(let i = 1 ;i<=28;i++){
            if(i<10){
              i = "0" + i;
            }
            temp.push("" + i);
          }
          this.setData({['multiArray[2]']:temp})
        }
      }
      console.log(this.data.multiArray[2]);
    }
    var data = {
      multiArray:this.data.multiArray,
      multiIndex:this.data.multiIndex
    };
    data.multiIndex[e.detail.column] = e.detail.value;
    this.setData(data);
  },

  /**
   * 获取出发地
   */
  starAddressinput:function(e){
    this.setData({
      starAddress:e.detail.value
    })
  },
  /**
   * 过滤出发地
   */
  starAddressblur:function(e){
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
  endAddressinput:function(e){
    this.setData({
      endAddress:e.detail.value
    })
  },
  /**
   * 过滤目的地
   */
  endAddressblur:function(e){
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
  linknameinput:function(e){
    this.setData({
      linkname:e.detail.value
    })
  },
   /**
   * 过滤联系人
   */
  linknameblur:function(e){
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
  linkphoneinput:function(e){
    this.setData({
      linkphone:e.detail.value
    })
  },
  /**
   * 过滤联系电话
   */
  linkphoneblur:function(e){
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
  contentinput:function(e){
    this.setData({
      content:e.detail.value
    })
  },
  /**
   * 过滤详细介绍
   */
  contentblur:function(e){
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
  }
})