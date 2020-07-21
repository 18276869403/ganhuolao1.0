// pages/goodsDetails/goodsDetails.js
const qingqiu = require('../../utils/request.js')
const api = require('../../utils/config.js')
Page({
 
  /**
   * 页面的初始数据
   */
  data: {
    viewUrl:api.viewUrl,
    current:0,
    spxqlist:[],
    tupian:[],
    imgheights:[],
    tupian2:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showShareMenu({
      withShareTicket: true
    })
    // this.spxiangqinglist()
    var splist = JSON.parse(options.obj)
    console.log(splist)
    for(var i=0;i<splist.goodPic1.length;i++){
      this.data.tupian.push(api.viewUrl+splist.goodPic1[i])
    }
    for(var j=0;j<splist.goodPic2.length;j++){
      this.data.tupian2.push(api.viewUrl+splist.goodPic2[j])
    }
    this.setData({
      splist: splist
    })
  },

  imageLoad:function(e){
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
    imgheights[e.target.dataset['index']] = imgheight;// 改了这里 赋值给当前 index
    this.setData({
      imgheights: imgheights,
    })
  },
  bindchange: function (e) {
    this.setData({
      current: e.detail.current
    })
  },

  tupian:function(e){
    var current = api.viewUrl+e.currentTarget.dataset.src
    wx.previewImage({
      current: current,//当前显示图片的http链接，我这边是把图片转成了base64
      urls: this.data.tupian //需要预览的图片http链接列表
    })
  },
  tupian2:function(e){
    var current = api.viewUrl+e.currentTarget.dataset.src
    wx.previewImage({
      current: current,//当前显示图片的http链接，我这边是把图片转成了base64
      urls: this.data.tupian2 //需要预览的图片http链接列表
    })
  },
  // 进他的店
  goShopping:function(){
    var that = this
    if(that.data.splist.userId == 0){
      wx.showToast({
        title: '该店尚未开张，敬请期待',
        icon:'none',
        duration:2000
      })
      return
    }
    var data = {
      id:that.data.splist.userId,
    }
    qingqiu.get("queryWxUser",data,function(res){
      if(res.success==true){
        res.result.picIurl = that.data.viewUrl + res.result.picIurl
          // 重定义分类
          var onename = []
          var twoname = []
          if (res.result.oneClassName != null) {
            if (res.result.oneClassName.indexOf(',') != -1) {
              onename = res.result.oneClassName.split(',')
            } else {
              onename[0] = res.result.oneClassName
            }
          }
          if (res.result.twoClassName != null) {
            if (res.result.twoClassName.indexOf(',') != -1) {
              twoname = res.result.twoClassName.split(',')
            } else {
              twoname[0] = res.result.twoClassName
            }
          }
          res.result.oneClassName = onename[0] + ' | ' + twoname[0]
          if (onename.length > 1) {
            res.result.twoClassName = onename[1] + ' | ' + twoname[1]
          } else {
            res.result.twoClassName = ''
          }
        var obj = JSON.stringify(res.result)
        wx.navigateTo({
          url: '../businessDetails/businessDetails?obj=' + obj,
        })
      }else{
        wx.showToast({
          title: '操作出错了',
          icon:'none',
          duration:'2000'
        })
      }
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

  }
})