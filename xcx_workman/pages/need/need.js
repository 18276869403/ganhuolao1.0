// pages/need/need.js
//获取应用实例
const app = getApp()
//调用接口js
const qingqiu = require('../../utils/request.js')
const api = require('../../utils/config.js')
const bmap = require('../../utils/bmap-wx.min.js')

Page({
  data: {
    viewUrl:api.viewUrl,
    animationData:'',
    showModalStatus:'',
    animationData:'',
    navRightItems:'',
    isLastPage:false,
    hasMask:'',
    sousuotext:'',
    needsListfy:[],
    needsList:[],
    oneclass:[],
    twoclass:[],
    city:[],
    firstId:'',
    firstname:'',
    firstnamewhere:'',
    secondId:'',
    secondname:'',
    secondnamewhere:'',
    gongzhong: [{
      id: 1,
      oneclass: '',
      twoclasslist:[{
        id:1,
        twoclass:'erji'
      },
      {
        id:2,
        twoclass:'erji111'
      }]
    }],
    flerjiid:'',
    yijiid:'',
    yijiname:'',
    erjiid:'',
    erjiname:'',
    pageNo:1,
    pageSize:10,
    jihe:[],
    id:'',
    name:'',
    mid:'',
    needTitle:'',
    oneClassId:'',
    twoClassId:'',
    weizhi:''
  },
   // 搜索框
   shurukuang:function(e){
    this.setData({
      sousuotext:e.detail.value
    })
  },
  // 全部
  quanbu:function(){
     var that = this
     that.data.firstId=''
     that.data.secondId=''
     that.data.firstname=''
     that.setData({
        showModalStatus: false,
        firstname:that.data.firstname
      })
  },

  // 获取地理位置信息 
  getAddress(){
    var that = this
    /* 获取地理位置 */
    var BMap = new bmap.BMapWX({
      ak:api.baiduAK
    })
    var fail = function(data){
      console.log(data)
    }
    // 发起regeocoding检索请求   
    BMap.regeocoding({
      fail: fail,
      success: function(data){
        var address = data.originalData.result.addressComponent
        // 返回数据内，已经包含经纬度
        that.setData({
          yijiAddress: address.city,
          yijiAddress: address.district,
        })
        var data = {
          one:address.city,
          two:address.district
        }
        qingqiu.get("queryAreaByName",data,function(res){
          console.log(res)
          if(res.success == true){
            var obj ={};
            var erjiname = ''
            var yijiname = ''
            if(res.result.two!=null){
              erjiname = address.district
              obj.cityId = res.result.one
              obj.id = res.result.one
            }else{
              obj.cityId = null
            }
            if(res.result.one != null){
              yijiname = address.city
              obj.areaId =res.result.two
            }else{
              obj.areaId = null
            }
            obj.weizhi = yijiname + erjiname
            that.setData(obj)
            that.QueryoneArea() //一级区域
            that.QuerytwoArea() //二级区域
            that.xqneedlist({pageNo:1,pageSize:3,oneAreaId: obj.cityId,twoAreaId:obj.areaId}) //需求
          }else{
            wx.showToast({
              title: res.message,
              icon:'none',
              duration:1000
            })
          }
        })
      }
    })
  },

  // 搜索按钮
  btnsearch:function(){
    this.data.needsList.splice(0,this.data.needsList.length)
    this.data.pageNo=1
    this.data.isLastPage=false
    if(this.data.sousuotext != "" && this.data.yijiid != "undefined" && this.data.yijiid != null){
      this.data.needTitle = this.data.sousuotext
    }
    else{
      this.data.needTitle =''
    }
    if(this.data.yijiid != "" && this.data.yijiid != "undefined" && this.data.yijiid != null){
      this.data.oneClassId = this.data.yijiid
    }else{
      this.data.oneClassId =''
    }
    if(this.data.flerjiid != "" && this.data.flerjiid != "undefined" && this.data.yijiid != null){
      this.data.twoClassId = this.data.flerjiid
    }else{
      this.data.twoClassId =''
    }
    this.xqneedlist()
  },
  // 下拉刷新
  onPullDownRefresh: function () {
    app.globalData.xuqiuid = 1
    // this.data.needsList.splice(0,this.data.needsList.length)
    this.data.pageNo=1
    this.data.isLastPage=false
    app.globalData.needRefresh = 1
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

  onShow(){
    wx.showShareMenu({
      withShareTicket: true
    })
    if(app.globalData.needRefresh != 0){
      this.chushishouquan()
      if(app.globalData.xuqiuid == 0){
        this.data.mid=app.globalData.wxid
      }else{
        this.data.mid=''
      }
      this.oneClass()
      this.twoClass()
      this.QueryoneArea()
      this.QuerytwoArea()
      if(app.globalData.oneCity != undefined && app.globalData.oneCity != "undefined"){
        this.setData({
          needsList:[],
          weizhi:app.globalData.oneCity.name + app.globalData.twoCity.name,
          pageNo:1
        })
        this.xqneedlist()
      }else{
        // this.setData({needsList:[],weizhi:'全部',pageNo:1})
        this.setData({
          cityId: this.data.id,
          cityname1: this.data.name,
          needsList:[],
          weizhi:'全部',
          areaId:0
        })
        this.xqneedlist()
      }
    }
  },

  // 一级分类
  oneClass(){
    var that =this
    var data={
      type:3
    }
    qingqiu.get("oneClassList", data, function(re) {
    if (re.success == true) {
      if (re.result != null) {
        that.oneclass = re.result
        that.setData ({
          oneclass : that.oneclass
        })
      } else {
        qingqiu.tk('未查询到任何数据')
      }
    } 
  })
  },
  // 二级分类
  twoClass(){
    var that =this
    var data={
      oneClassId:3
    }
    qingqiu.get("twoClassList", data, function(re) {
    if (re.success == true) {
      if (re.result != null) {
        that.twoclass = re.result
        that.setData ({
          twoclass : that.twoclass
        })
      } else {
        qingqiu.tk('未查询到任何数据')
      }
    } 
  })
  },
  // 左侧按钮
  left: function (e) {
    var that = this;
    var id = e.currentTarget.dataset.id
    var name = e.currentTarget.dataset.name
    that.setData({
      firstId: id,
      firstname: name
    })
    var data={
      oneClassId:that.data.firstId
    }
    qingqiu.get("twoClassList", data, function(re) {
    if (re.success == true) {
      if (re.result != null) {
        that.twoclass = re.result
        that.setData ({
          twoclass : that.twoclass
        })
      } else {
      }
    } 
  })
  },
  // 右侧单选点击
  right: function (e) {
    var that = this;
    var id = e.currentTarget.dataset.id
    var name = e.currentTarget.dataset.name
    that.setData({
      secondId: id,
      secondname: name,
      yijiname: this.data.yijiname1,
      showModalStatus: false,
    })
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
    this.xqneedlist()
  },
  //置顶
  goTop(){
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 300
    })
  },
  // 需求列表
  xqneedlist() {
    var that = this
    var data={
      pageNo:that.data.pageNo,
      pageSize:10,
      wxUserId:that.data.mid,
      needTitle:that.data.needTitle,
      backup5:0
    }
    if(app.globalData.oneCity != undefined && app.globalData.oneCity != "undefined"){
      data.oneAreaId = app.globalData.oneCity.id
    }
    if(app.globalData.twoCity != undefined && app.globalData.twoCity != "undefined"){
      if(app.globalData.twoCity.id != 0){
        data.twoAreaId = app.globalData.twoCity.id
      }
    }
    console.log(data)
    qingqiu.get("zuixinxq", data, function(re) {
      console.log(re)
      if (re.success == true) {
        if (re.result != null) {
          // if(re.result.records==''){
          //   that.data.isLastPage=true
          //   return
          // }
          that.needsList = re.result.records
          for(var i= 0 ; i < that.needsList.length; i++){
            re.result.records[i].publishTime = re.result.records[i].publishTime.split(' ')[0]
            if(re.result.records[i].backup1!= null&&re.result.records[i].backup1.length>0){
              re.result.records[i].backup1 = re.result.records[i].backup1.split(',')
            }
            that.data.needsList.push(re.result.records[i])
          }
          that.setData ({
            needsList : that.data.needsList,
            needsListfy : re.result.records
          })
        } else {
          wx.showToast({
            title: '暂无数据',
            icon:'none',
            duration:2000
          })
        }
      } 
    })
  },
  //显示弹窗样式
  showModal: function (e) {
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
    setTimeout(function () {
      animation.opacity(1).rotateX(0).step();
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 200)
  },
  //隐藏弹窗样式
  hideModal6: function () {
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
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus: false
      })
      var erjiId = ''
      var erjiName = ""
      for (var i = 0; i < that.data.navRightItems.length; i++) {
        if (that.data.navRightItems[i].isSelected == true) {
          if (erjiId != '') {
            erjiId = erjiId + ',' + that.data.navRightItems[i].id
            erjiName = erjiName + ',' + that.data.navRightItems[i].name
          } else {
            erjiId = that.data.navRightItems[i].id
            erjiName = that.data.navRightItems[i].name
          }

          that.setData({
            erjiName: erjiName,
            erjiId: erjiId,
          })
        }
      }
      that.setData({
        itemList: [],
        cost: ''
      })
    }.bind(this), 200)
  },
  // 跳转到需求详情页面
  needsDetails: function(e) {
    var that = this
    var obj1 =e.currentTarget.dataset.vall;
    var data = {
      id:obj1.id
    }
    qingqiu.get("updateYeedById",data,function(res){
      console.log(res)
      if(res.success == true){
        var xqxq = JSON.stringify(obj1);
        app.globalData.needRefresh = 0
        wx.navigateTo({
          url: '../needsDetails/needsDetails?obj1=' + xqxq,
        })
      }else{
        wx.showToast({
          title: res.message,
          icon:'none',
          duration:2000
        })
      }
    },'put')
  },
  // 跳转到提交需求页面
  submitNeeds: function() {
    app.globalData.needRefresh = 1
    wx.navigateTo({
      url: '../submitNeeds/submitNeeds?type=0&id=0',
    })
  },
  //显示弹窗样式
  showModal: function (e) {
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
    setTimeout(function () {
      animation.opacity(1).rotateX(0).step();
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 200)
  },
  // 置顶
  goTop:function(e){
    if(wx.pageScrollTo){
      wx.pageScrollTo({
        scrollTop: 0,
        duration: 300
      })
    }else{
      wx.showModal({
        title: '提示',
        cancelColor: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重新',
      })
    }
  },
  // 客服
  handleContact (e) {
    console.log(e)
    console.log(e.detail.path)
    console.log(e.detail.query)
  },
  // 隐藏弹窗样式
  hideModal6: function () {
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
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus: false
      })
      var erjiId = ''
      var erjiName = ""
      for (var i = 0; i < that.data.navRightItems.length; i++) {
        if (that.data.navRightItems[i].isSelected == true) {
          if (erjiId != '') {
            erjiId = erjiId + ',' + that.data.navRightItems[i].id
            erjiName = erjiName + ',' + that.data.navRightItems[i].name
          } else {
            erjiId = that.data.navRightItems[i].id
            erjiName = that.data.navRightItems[i].name
          }
          that.setData({
            erjiName: erjiName,
            erjiId: erjiId,
          })
        }
      }
      that.setData({
        itemList: [],
        cost: ''
      })
    }.bind(this), 200)
  },
  // 业务分类
  showModallist: function() {
    this.typefenleiyj()
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
      showModalStatuslist: true,
      showModalStatus6:true
    })
    setTimeout(function() {
      animation.opacity(1).rotateX(0).step();
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 200)
  },
  //选择业务页面关闭
  hideModallist: function(e) {
    var that=this
    var flag = e.currentTarget.dataset.return
    if(flag=="false"){
      that.setData({
        yijiid:'',
        erjiid:'',
        yijiname:'',
        erjiname:'',
        pageNo:1,
        needsList:[]
      })
      that.xqneedlist()
    }
    //this.writeclass(flag)
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    // flag = 0;
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData2: animation.export(),
      hasMask: false
    })
    setTimeout(function() {
      animation.translateY(0).step()
      this.setData({
        animationData2: animation.export(),
        showModalStatuslist: false,
        showModalStatus6:false
      })
    }.bind(this), 200)
  },
  // 获取分类
  typefenleiyj: function() {
    var that = this
    var data = {
      type:3
    }
    qingqiu.get("oneClassList", data, function(re) {
      if (re.success == true) {
        if (re.result != null) {
          for(let i=0;i<re.result.length;i++){
            var gongzhongclass = 'gongzhong[' + i +'].oneclass'
            var gongzhongid = 'gongzhong[' + i + '].id'
            that.setData({
              [gongzhongid]:re.result[i].id,
              [gongzhongclass]:re.result[i].className
            })
            console.log(re.result[i].className)
            var onedata = { oneClassId:re.result[i].id }
            qingqiu.get("twoClassList",onedata,function(re){
              if (re.success == true){
                if (re.result != null) {
                  var gongzhongclass2 = 'gongzhong[' + i +'].twoclasslist'
                  that.setData({
                    [gongzhongclass2]:re.result
                  })
                }
              }
            })
          }
        } 
      } 
    })
  },
  typefenleiej: function() {
    var data = {
      oneClassId: this.data.typeyj
    }
    var that = this
    qingqiu.get("twoClassService", data, function(re) {
      that.setData({
        typeejlist: re.data.result
      })
    })
  },
  // 选项卡点击事件获取分类
  fenlei: function(e) {
    var that = this;
    var id = 1
    var litype = 0
    if (id == 1) {
      litype = 2;
    } else {
      litype = 1;
    }
    var typeid = "fenleitype1.yjid"
    var typeerji = "fenleitype1.erjiid"
    var typestate = "fenleitype1.typestate"
    var typeid1 = "fenleitype2.yjid"
    var typeerji1 = "fenleitype2.erjiid"
    var typestate1 = "fenleitype2.typestate"
    that.setData({
      [typeid]:'',
      [typeerji]:'',
      [typestate]:false,
      [typeid1]:'',
      [typeerji1]:'',
      [typestate1]:false,
      fenClass1:'',
      fenClass2:'',
      needsTypeid: id,
      litype: litype,
      yijiname: '',
      secondId: 0,
      erjiworkname: '',
      typeyj: 0
    })
    this.typefenleiyj()
  },
  // 改变二级分类
  changetwoclass: function (e) {
    var erjiid = e.currentTarget.dataset.id
    var yijiid = e.currentTarget.dataset.yjid
    var yijiname = e.currentTarget.dataset.yijiname
    var erjiname = e.currentTarget.dataset.erjiname
    this.setData({
      erjiid:erjiid,
      yijiid:yijiid,
      yijiname:yijiname,
      erjiname:erjiname,
      needsList:[],
      pageNo:1
    })
    this.xqneedlist()
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

// 分类全部
typeQuan:function(e){
  var type = e.currentTarget.dataset.id
  if(type == -1){
    if (this.data.chooseworker == 1) {
      this.setData({
        workerlist:[],
        yijiid:'',
        erjiid:'',
        fenleilx:1,
        yijiname:'',
        pageNo:1
      })
      this.grneedlist()
    } else {
      this.setData({
        businesslist:[],
        fenleilx:2,
        yijiid:'',
        erjiid:'',
        yijiname:'',
        pageNo:1
      }) 
      this.sjneedlist()
      }
    }
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
      weizhi:name,
      cityname1: name,
      needsList:[],
    })
    if(id == 0){
      app.globalData.oneCity = undefined
      app.globalData.twoCity = undefined
      that.xqneedlist() //需求
      that.setData({
        // area:[],
        areaId:0,
        cityId: that.data.id,
        cityname1: that.data.name,
        showModalStatus: false,
      })
    }else{
      var data ={
        oneAreaId:id
      }
      app.globalData.oneCity = {id:id,name:name}
      that.xqneedlist() //需求
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
    if(that.data.cityname1==undefined)
    {
      wx.showToast({
        title: '请先选择城市',
        icon:'none',
        duration:2000
      })
      return
    }
    //var index = e.currentTarget.dataset.index;
    var id = e.currentTarget.dataset.id
    var name = e.currentTarget.dataset.name
    app.globalData.twoCity={id:id,name:name}
    if(that.data.weizhi == undefined || that.data.weizhi == ""){
      wx.showToast({
        title: '请选择城市',
        icon:'none',
        duration:1000
      })
      return
    }
    if(app.globalData.oneCity==undefined ||app.globalData.oneCity==''){
      app.globalData.oneCity= {id:that.data.id,name:that.data.name}
      that.data.cityname1=that.data.name
    }
    that.setData({
      weizhi:that.data.cityname1 + name,
      areaId: id,
      //curIndex: index,
      areaname: name,
      showModalStatus: false,
      needsList:[],
      cityname: this.data.cityname1
    })
    that.xqneedlist({pageNo:1,pageSize:3,oneAreaId:app.globalData.oneCity.id,twoAreaId:id}) //需求
  },
})