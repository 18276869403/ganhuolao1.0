
//获取应用实例
const app = getApp()

const qingqiu = require('../../utils/request.js')
const api = require('../../utils/config.js')

Page({
  data: {
    viewUrl:api.viewUrl,
    showList:[],
    // imgList: [
    //   "http://192.168.1.254:3000/work-boot/sys/common/view/191590400845_.pic_hd.jpg",
    //   "http://192.168.1.254:3000/work-boot/sys/common/view/191590400845_.pic_hd.jpg",
    //   "http://192.168.1.254:3000/work-boot/sys/common/view/191590400845_.pic_hd.jpg"
    // ],
    imgList:[],
    sousuotext:'',
    id:'',
    name:'',
    sousuonr:'',
    pageNo:1
  },
  onPullDownRefresh: function () {
    app.globalData.showid = 1
    this.data.pageNo=1
    this.data.isLastPage=false
    this.data.showList.splice(0,this.data.showList.length)
    app.globalData.showworkRefresh = 1
    this.onShow()
    setTimeout(() => {
      wx.stopPullDownRefresh()
    }, 1000);
  },

  // 授权
  chushishouquan() {
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userInfo']) {
          wx.switchTab({
            url: '../index/index',
          })
        }
      }
    })
  },

  onShow:function(){
    wx.showShareMenu({
      withShareTicket: true
    })
    if(app.globalData.showworkRefresh != 0){
      this.chushishouquan()
      this.QueryoneArea()
      this.QuerytwoArea()
      if(app.globalData.oneCity != undefined){
        this.setData({
          showList:[],
          weizhi:app.globalData.oneCity.name + app.globalData.twoCity.name,
          pageNo:1
        })
        this.SelectshowList()
      }else{
        this.setData({
          showList:[],
          pageNo:1,
          cityId: this.data.id,
          cityname1: this.data.name,
          weizhi:'全部',
          areaId:0
        })
        this.SelectshowList()
      }
    }
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
    this.SelectshowList()
  },
  // 获取晒晒 
  SelectshowList() {
    var that = this
    var data={
      pageNo: that.data.pageNo,
      size: 10,
      caseName:that.data.sousuonr
    }
    if(app.globalData.oneCity != undefined && app.globalData.oneCity != "undefined"){
      data.oneAreaId = app.globalData.oneCity.id
    }
    if(app.globalData.twoCity != undefined && app.globalData.twoCity != "undefined"){
      if(app.globalData.twoCity.id!= 0){
        data.twoAreaId = app.globalData.twoCity.id
      }
    }
    qingqiu.get("CasePage", data, function(re) {
      console.log(re)
      if (re.success == true) {
        if (re.result != null) {
          that.showList=re.result.records
          for(var i= 0 ; i < that.showList.length; i++){
            that.showList[i].picOne = api.viewUrl+re.result.records[i].picOne.split(',')[0]
            that.data.imgList[i] = that.showList[i].picOne
            that.data.showList.push(re.result.records[i])
          } 
          console.log(that.data.showList)
          that.setData({
            showList:that.data.showList
          })
        } 
      } 
    })
  },
  // 晒晒点赞
  dianzan:function(e){
    var that=this
    var shaid = e.currentTarget.dataset.shaid;
    var data={
      wxCaseId:shaid
    }
    qingqiu.get("userLikes",data,function(re) {
      console.log(re)
      if (re.success == true) {
        for(let obj of that.data.showList){
          if(obj.id==shaid){
            obj.giveGood+=1
            obj.backup1=1
          }
        }
        that.setData({
          showList:that.data.showList
        })
      } 
    })
  },
  // 发布弹窗显示
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
  //发布弹窗关闭
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
  // 搜索框
   shurukuang:function(e){
    this.setData({
      sousuotext:e.detail.value
    })
  },
  // 搜索
  btnsearch:function(){
    var that=this
    that.data.pageNo=1
    that.data.isLastPage=false
    this.data.showList.splice(0,this.data.showList.length)
    that.data.sousuonr=that.data.sousuotext
    that.SelectshowList()
  },
  // 跳转到晒晒详情页面
   showDetails: function(e) {
    var ssid =e.currentTarget.dataset.ssid;
    qingqiu.get("updateWxCase",{id:ssid},function(re){
      console.log(re)
      if(re.success == true){
        app.globalData.showworkRefresh = 0
        wx.navigateTo({
          url: '../showDetails/showDetails?obj='+ssid,
        })
      }else{
        wx.showToast({
          title: re.message,
          icon:'none',
          duration:2000
        })
      }
    },'put')
  },
  // 发布晒晒页面
  submitShow: function() {
    app.globalData.showworkRefresh = 1
    wx.navigateTo({
      url: '../submitShow/submitShow',
    })
  },
  // 发布视频
  submitVideo:function(){
    var that = this
    wx.chooseVideo({
      camera: ['album','camera'],
      maxDuration:60,
      success:function(res){
        console.log(res)
        var tempFilePath = res.tempFilePath
        console.log(tempFilePath)
        wx.uploadFile({
          url: api.uploadurl,
          filePath: tempFilePath,
          header: {
            "Content-Type": "multipart/form-data"
          },
          formData: {
            method: 'POST' //请求方式
          },
          name: 'file',
          success:function(res){
            console.log(res)
            var re = JSON.parse(res.data)
            if(re.success == true){
              if(app.globalData.weizhiid==undefined || app.globalData.weizhiid=='')
              {
                var data = {
                  wxUserId:app.globalData.wxid,
                  backup3:1,
                  backup4:0,
                  picOne:re.message
                }
              }else{
                var data = {
                  wxUserId:app.globalData.wxid,
                  backup3:1,
                  backup4:0,
                  oneAreaId:app.globalData.weizhiid,
                  twoAreaId:app.globalData.weizhiid2,
                  picOne:re.message
                }
              }
              qingqiu.get('insertCase',data,function(res){
                if(res.success == true){
                  wx.showToast({
                    title: '发布成功,视频正在审核中...',
                    icon:'success',
                    duration:2000
                  })
                  setTimeout(function(){
                    that.hideModal1()
                    that.onShow()
                  },1000)
                }else{
                  wx.showToast({
                    title: res.message,
                    icon:'none',
                    duration:2000
                  })
                }
              },'post')
            }else{
              wx.showToast({
                title: res.message,
                icon:'none',
                duration:2000
              })
            }
          }
        })
      }
    })
  },
  // 一级区域
  QueryoneArea(){
    var that = this
    qingqiu.get("queryOneArea", null, function(re) {
    if (re.success == true) {
      if (re.result != null) {
        var obj = {id:0,areaName:'全部'}
        var city=[]
        city.push(obj)
        city.push(re.result[0])
        that.data.id=re.result[0].id
        that.data.name=re.result[0].areaName
        if(app.globalData.oneCity == undefined || app.globalData.oneCity == "undefined"){
          that.setData({
            cityId: that.data.id,
            cityname1: that.data.name,
            weizhi:'全部',
            areaId:0
          })
        }else{
          that.setData({
            cityId: app.globalData.oneCity.id,
            cityname1: app.globalData.oneCity.name,
            areaId:app.globalData.twoCity.id,
            areaname:app.globalData.twoCity.name
          })
        }
        that.setData({
          city:city
        })
      }else {
        qingqiu.tk('未查询到任何数据')
      }
    } 
  })
  },
  // 二级区域
  QuerytwoArea(){
    var that = this
    var data ={
      oneAreaId:that.data.id
    }
    qingqiu.get("queryTwoArea", data, function(re) {
    if (re.success == true) {
      if (re.result != null) {
        var obj = {id:0,oneAreaId:0,areaName:'全部'}
        var area = []
        area.push(obj)
        for(let obj of re.result){
          area.push(obj)
        }
        that.setData({
          area:area
        })
      }else {
        qingqiu.tk('未查询到任何数据')
      }
    } 
  })
  },
  //地址 显示弹窗样式
  showModal: function(e) {
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
    setTimeout(function() {
      animation.opacity(1).rotateX(0).step();
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 200)


  },
  //隐藏弹窗样式 地址
  hideModal: function() {
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
    setTimeout(function() {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus: false
      })
    }.bind(this), 200)
  },
  cityyiji: function() {
    var that = this
    qingqiu.get("oneAreaService", {}, function(re) {
      if (re.data.result.length > 0) {
        that.setData({
          cityId: re.data.result[0].id,
          cityname1: re.data.result[0].areaName
        })
      }
      that.setData({
        city: re.data.result
      })
      that.cityerji()
    })
  },
  cityerji: function() {
    var that = this
    var data = {
      oneAreaId: that.data.cityId
    }
    qingqiu.get("getAllTwoArea", data, function(re) {
      that.setData({
        area: re.data.result
      })
    })
  },
  // 左侧按钮
  cityleft: function(e) {
    var that = this;
    // var index = e.currentTarget.dataset.index;
    var id = e.currentTarget.dataset.id
    var name = e.currentTarget.dataset.name.replace(' ','')
    that.setData({
      cityId: id,
      cityname1: name,
      weizhi:name,
      showList:[]
    })
    if(id == 0){
      app.globalData.oneCity = undefined
      app.globalData.twoCity = undefined
      that.SelectshowList()  //商家 
      that.setData({
        showModalStatus: false,
        cityId: that.data.id,
        cityname1: that.data.name,
        areaId:0,
      })
    }else{
      var data ={
        oneAreaId:id
      }
      app.globalData.oneCity = {id:id,name:name}
      that.SelectshowList()  //商家 
      qingqiu.get("queryTwoArea", data, function(re) {
        if (re.success == true) {
          if (re.result != null) {
            that.area=re.result
            that.setData({
              area:that.area
            })
          }else {
            qingqiu.tk('未查询到任何数据')
          }
        } 
      })
    }
  },
  // 右侧单选点击
  arearight: function(e) {
    var that = this;
    if(that.data.weizhi == undefined || that.data.weizhi == ""){
      wx.showToast({
        title: '请选择城市',
        icon:'none',
        duration:1000
      })
      return
    }
    if(app.globalData.oneCity==undefined || app.globalData.oneCity==''){
      app.globalData.oneCity= {id:that.data.id,name:that.data.name}
      that.data.cityname1=that.data.name
    }
    var id = e.currentTarget.dataset.id
    var name = e.currentTarget.dataset.name
    app.globalData.twoCity={id:id,name:name}
    that.setData({
      weizhi:that.data.cityname1 + name,
      areaId: id,
      //curIndex: index,
      areaname: name,
      showList:[],
      showModalStatus: false,
      cityname: this.data.cityname1
    })
    that.SelectshowList()  //商家 
  },
})