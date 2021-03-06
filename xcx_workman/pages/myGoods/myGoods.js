// pages/myGoods/myGoods.js
const app = getApp()
const qingqiu = require('../../utils/request.js')
const api = require('../../utils/config.js')
Page({
 
  /**
   * 页面的初始数据
   */
  data: {
    viewUrl:api.viewUrl,
    iconUrl:api.iconUrl,
    goodsList: [
      // {
      //   id: 1,
      //   img: '../image/top.png', 
      //   name: '室内F-10木门（含五金件五',
      //   price: '299'
      // },
      // {
      //   id: 2,
      //   img: '../image/top.png',
      //   name: '室内F-10木门（含五金件五',
      //   price: '299'
      // },
      // {
      //   id: 3,
      //   img: '../image/top.png',
      //   name: '室内F-10木门（含五金件五',
      //   price: '299'
      // },
      // {
      //   id: 4,
      //   img: '../image/top.png',
      //   name: '室内F-10木门（含五金件五',
      //   price: '299'
      // },
      // {
      //   id: 5,
      //   img: '../image/top.png',
      //   name: '室内F-10木门（含五金件五',
      //   price: '299'
      // },
      // {
      //   id: 6,
      //   img: '../image/top.png',
      //   name: '室内F-10木门（10木门（含五金件五10木门（含五金件五含五金件五',
      //   price: '299'
      // }
    ],
    goodsLists:[],
    spmyid:'',
    spid:'',
    spxx:'',
    pageNo:1,
    pageSize:10,
    isLastPage:false,
    btnFlag:false,
    type:0,
    zstate:false
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // this.setData({
    //   isLastPage:false,
    //   pageNo:1,
    //   
    // })
    this.data.goodsLists=[]
    if(this.data.pageNo>1){
      this.setData({
        pageSize:Number(this.data.pageNo)*10,
        zstate:true,
        goodsLists:[]
      })
    }
    wx.showShareMenu({
      withShareTicket: true
    })
    this.mygoodsList()
  },
  // 下拉刷新
  onPullDownRefresh: function () {
    this.data.isLastPage=false
    this.data.pageNo=1
    this.data.goodsLists=[]
    this.onLoad()
    setTimeout(() => {
      wx.stopPullDownRefresh()
    }, 1000);
  },
  // 上拉功能
  onReachBottom: function () {
    if (this.data.isLastPage) {
      wx.showToast({
        title: '没有更多了！',
        icon:'none',
        duration:2000
      })
      return
    }
    this.setData({ pageNo: this.data.pageNo + 1 })
    this.mygoodsList()
  }, 
  // 我的商品
  mygoodsList() {
    var that = this
    if(that.data.zstate==true){
      var data={
        userId:app.globalData.wxid,
        pageNo:1,
        pageSize:that.data.pageSize
      }
    }else{
      var data={
        userId:app.globalData.wxid,
        pageNo:that.data.pageNo,
        pageSize:that.data.pageSize
      }
    }
  qingqiu.get("queryMyGoodPage", data, function(re) {
    console.log(re)
  if (re.success == true) {
    that.data.zstate=false
    if(re.result.records==''){
      that.data.isLastPage=true
    }
    if (re.result != null) {
      // that.goodsLists =re.result.records
      for(var i= 0 ; i < re.result.records.length; i++){
        if(re.result.records[i].goodPic1 !=null && re.result.records[i].goodPic1.length>0){
          re.result.records[i].goodPic1 = re.result.records[i].goodPic1.split(',')
          re.result.records[i].goodPic2 = re.result.records[i].goodPic2.split(',')
        }
        if(re.result.records[i].goodPic1[0]==''&&re.result.records[i].goodPic1[1]!=''){
          re.result.records[i].goodPic1[0]=re.result.records[i].goodPic1[1]
          re.result.records[i].goodPic1[1]=''
        }
        that.data.goodsLists.push(re.result.records[i])    
      }
      that.setData ({
        goodsLists : that.data.goodsLists
      })
    } else {
      qingqiu.tk('未查询到任何数据')
    }
  } 
})
},
  // 添加商品
  addEditGoods:function(e){
    this.setData({btnFlag:false})
    wx.navigateTo({
      url: '../addEditGoods/addEditGoods?obj='+ app.globalData.wxid, 
    })
  },
  //置顶
  onemyGood:function(e){
    var  that=this
    that.setData({btnFlag:true})
    var spid =e.currentTarget.dataset.myspid;
    that.data.spid=spid
    var data={
      id: spid 
    }
    qingqiu.get("editMyGoodTop", data, function(re) {
    if (re.success == true) {
      wx.showToast({
        title: '置顶成功！',
        icon:'none',
        duration:2000
      })
      that.setData({btnFlag:false})
      that.onLoad()
    }else{
      that.setData({btnFlag:false})
    }
  },'put')
  },

  // 编辑商品
  addEditGoods2:function(e){
    var spxx = e.currentTarget.dataset.spxx
    var spxx1 = JSON.stringify(spxx);
    wx.navigateTo({
      url: '../addEditGoods/addEditGoods?obj1='+ spxx1,
    })
  },
  //删除我的商品
  DeletemyGood: function(e) {
    var that = this
    that.setData({btnFlag:true})
    var spid =e.currentTarget.dataset.myspid;
    var data={
      id: spid 
    }
    var userid = JSON.stringify(that.spmyid)
    wx.showModal({
      title: '提示',
      content: '你确定要删除吗？',
      success (res) {
        if (res.confirm) {
          qingqiu.get("deleteUserGood", data, function(re) {
            if (re.success == true) {
              wx.showToast({
                title: '删除成功！',
                icon:'none',
                duration:2000
              })
              that.setData({btnFlag:false})
              that.onLoad()
            }else{
              that.setData({btnFlag:false})
            }
          },"delete")
        } else if (res.cancel) {
          that.setData({btnFlag:false})
          wx.showToast({
            title: '取消删除！',
            icon:'none',
            duration:2000
          })
        }
      }
    })
},
mygooddetail(e){
  var spxx = e.currentTarget.dataset.mgd
  var spxx1 = JSON.stringify(spxx);
  wx.navigateTo({
     url: '../goodsDetails/goodsDetails?obj=' + spxx1,
  })
}
})