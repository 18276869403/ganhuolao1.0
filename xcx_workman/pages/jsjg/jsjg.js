// pages/jsjg/jsjg.js
const qingqiu = require('../../utils/request.js')
const api = require('../../utils/config.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    viewUrl:api.viewUrl,
    iconUrl:api.iconUrl,
    jieguo:'',
    goodslist:[],
    zanwu:[{
      id:1,
      goodPic1:['static/image/zanwushangpin.png'],
      goodName:'',
      newPrice:'',
      state:false
    },
    {
      id:2,
      goodPic1:['static/image/zanwushangpin.png'],
      goodName:'',
      newPrice:'',
      state:false
    }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showShareMenu({
      withShareTicket: true
    })
    this.data.jieguo=options.obj
    this.getGoodsList({pageNo:1,pageSize:10,oneClassId:options.oneclass,twoClassId:options.twoclass})
    this.setData({
      jieguo:this.data.jieguo
    })
  },

  getGoodsList(data){
    var that = this
    qingqiu.get("tjsp",data,function(res){
      console.log(res)
      if(res.success == true){
        for(let obj of res.result.records){
          obj.goodPic1 = obj.goodPic1.split(',')
          obj.goodPic2 = obj.goodPic2.split(',')
        }
        that.setData({
          goodslist:res.result.records
        })
      }
      if(res.result.records==''){
        that.setData({
          goodslist:that.data.zanwu
        })
      }
    })
  },
  // 跳转到商品详情页面
  goodsDetails(e) {
    var obj =e.currentTarget.dataset.vals;
    if(obj.state==false){
      return
    }
    var shopxq = JSON.stringify(obj);
    wx.navigateTo({
      url: '../goodsDetails/goodsDetails?obj=' + shopxq,
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