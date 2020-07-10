// pages/myRecommend/myRecommend.js
//调用接口js
const app = getApp()
const qingqiu = require('../../utils/request.js')
const api = require('../../utils/config.js')
Page({
 
  /**
   * 页面的初始数据
   */
  data: {
    viewUrl:api.viewUrl,
    // jointype为0，入驻商家，为1，入驻工人
    recommendList: [{
      id: 1,
      url: '../image/top.png',
      name: '万载梦天万载梦天木门专卖店',
      jointype: 0,
      score: 10
    },
      {
        id: 2,
        url: '../image/top.png',
        name: '万载梦天万载梦天木门专卖店',
        jointype: 1,
        score: 100
      }],
    recommendList:[],
    myid:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showShareMenu({
      withShareTicket: true
    })
    this.myid = JSON.parse(options.obj)
    this.myrecommedlist()
  },
  // 我的推荐
  myrecommedlist() {
    var that = this
    var data={
      pages: 1,
      size: 10,
      userId: app.globalData.wxid
    }
    qingqiu.get("pcQueryUserPointPage", data, function(re) {
    console.log(re)
      if (re.success == true) {
        if (re.result.records != null) {
          that.recommendLists= re.result.records
          that.setData ({
            recommendLists: re.result.records
          })

        } else {
          qingqiu.tk('未查询到任何数据')
        }
      } 
    })
  }
})