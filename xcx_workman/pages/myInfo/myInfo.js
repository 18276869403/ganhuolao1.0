// pages/myInfo/myInfo.js
var app = getApp()
var qingqiu = require('../../utils/request.js')
var api = require('../../utils/config.js') 
var utils = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    viewUrl:api.viewUrl,
    birth: "2019-01-02",
    sex: '0',
    itemList: ['男', '女'],
    date: '1970-01-01',
    name: '',
    phone: '',
    btnFlag:false,
    wxUser:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showShareMenu({
      withShareTicket: true
    })
    this.getUserInfo(options.id)  
  },
  getUserInfo:function(id){
    var that = this
    var data = {
      id:id
    }
    qingqiu.get("queryWxUser",data,function(re){
      console.log(re)
      if(re.success == true){
        if((re.result.name == "" || re.result.name == null || re.result.name == "null") && (re.result.shopName == "" || re.result.shopName == null || re.result.shopName == "null")){
          re.result.name = ''
        }
        if(re.result.phone == "" || re.result.phone == null || re.result.phone == null){
          re.result.phone = ''
        }
        if(re.result.dateBirth == null || re.result.dateBirth == "" || re.result.dateBirth == "null"){
          re.result.dateBirth = '1970-01-01'
        }
        if(re.result.sex == 0 || re.result.sex == 1){
          re.result.sex = 0
        }else{
          re.result.sex = 1
        }
        that.setData({
          wxUser:re.result
        })
      }else{
        wx.showToast({ 
          title: re.message,
          icon:'none',
          duration:2000
        })
      }
    })
  },
  // 保存
  UpdateUserInfo:function(){
    var that = this
    that.setData({
      btnFlag:true
    })
    var data = {
      id:that.data.wxUser.id,
      name:that.data.wxUser.name,
      dateBirth:that.data.wxUser.dateBirth,
      sex:that.data.wxUser.sex + 1,
      phone:that.data.wxUser.phone
    }
    var s = qingqiu.yanzheng(data.name + ',请输入真实姓名|' + data.sex + ',请选择性别|' + data.dateBirth + ',请选择出生年月|' + data.phone + ',请输入手机号')
    if(s != 0){
      wx.showToast({
        title: s,
        icon:'none'
      })
      that.setData({
        btnFlag:false
      })
      return
    }
    qingqiu.get("editWxUser",data,function(re){
      if (re.success == true) {
        wx.showToast({
          title: '保存成功！',
          icon:'none',
          duration:1000
        })
        that.setData({
          btnFlag:false
        })
        setTimeout(function(){
          wx.switchTab({
            url: '../mine/mine'
          })
        },1000)
      } else{
        that.setData({
          btnFlag:false
        })
        wx.showToast({
          title: re.message,
          icon:'none',
          duration:2000
        })
        return
      }
    },'put')
  },

  //性别选择
  sexChoose: function () {
    var that = this;
    wx.showActionSheet({
      itemList: that.data.itemList,
      success(res) {
        console.log(res.tapIndex)
        var sex = "wxUser.sex"
        that.setData({
          [sex]: res.tapIndex
        })
      },
      fail(res) {
        console.log(res.errMsg)
      }
    })
  },
  //日期选择器
  bindDateChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    var dateBirth = "wxUser.dateBirth"
    this.setData({
      [dateBirth] : e.detail.value
    })
  },
  //获取输入的名称
  nameinput: function (e) {
    var name = "wxUser.name"
    this.setData({
      [name]: e.detail.value
    })
  },
  //获取输入的手机号
  phoneinput: function (e) {
    var phone = "wxUser.phone"
    this.setData({
      [phone]: e.detail.value
    })
  },
})