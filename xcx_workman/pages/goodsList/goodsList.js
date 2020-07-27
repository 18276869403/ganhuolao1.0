// pages/goodsList/goodsList.js
//获取应用实例
const app = getApp()
const qingqiu = require('../../utils/request.js')
const api = require('../../utils/config.js')

Page({
  data: {
    viewUrl:api.viewUrl,
    iconUrl:api.iconUrl,
    cityId:'',
    cityname1:'',
    cityname:'',
    areaname:'',
    yijiid:'',
    erjiid:'',
    yijiname:'',
    erjiname:'',
    areaId:'',
    weizhi:'',
    id:'',
    name:'',
    showModalStatus:false,
    goodslist:[],
    where:'',
    isLastPage:false,
    twoclass:[],
    oneclass:[],
    pageNo:1,
    size:10,
    city:[],
    area:[]
  },

  onShow: function() {
    wx.showShareMenu({
      withShareTicket: true
    })
    if(app.globalData.goodsRefresh != 0){
      this.oneClass()
      this.twoClass()
      this.QueryoneArea()
      this.QuerytwoArea()
      if(app.globalData.oneCity != undefined && app.globalData.oneCity != "undefined"){
        this.setData({
          goodslist:[],
          weizhi:app.globalData.oneCity.name + app.globalData.twoCity.name,
          pageNo:1
        })
        this.selectsp()
      }else{
        this.setData({goodslist:[],weizhi:'全部',pageNo:1})
        this.selectsp()
      }
    }
  },
  // 下拉刷新
  onPullDownRefresh: function () {
    this.onShow()
    setTimeout(() => {
      wx.stopPullDownRefresh()
    }, 1000);
  },
  // 我要开店
  kaidian:function(e){
    var type = e.currentTarget.dataset.type
    if(type == 2){
      if(app.globalData.wxState == 1){
        wx.showToast({
          title: '您已入驻工人,同一微信不能入驻两种类型',
          icon:'none',
          duration:2000
        })
        return
      }else{
        app.globalData.type1 = 3
        wx.navigateTo({
          url: '../applyBusiness/applyBusiness?typeid=' + type
        })
      }
    }
  },
  // 获取搜索内容
  getText:function(e){
    this.setData({
      where:e.detail.value
    })
  },
  // 搜索商品
  getGoods:function(){
    if(this.data.where==""){
      this.data.where==this.data.where
    }else{
      this.data.where==""
    }
    this.data.pageNo=1
    this.data.isLastPage=false
    this.data.goodslist.splice(0,this.data.goodslist.length)
    this.selectsp()
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
    this.selectsp()
  },
  // 获取商品
  selectsp(data){
    var that = this
    var data={
      pageNo:that.data.pageNo,
      size:10,
      backup1:1
    }
    if(that.data.where != ''){ data.goodName = that.data.erjiname }
    if(app.globalData.oneCity != undefined){ data.oneAreaId = app.globalData.oneCity.id }
    if(app.globalData.twoCity != undefined){ data.twoAreaId = app.globalData.oneCity.id }
    if(that.data.yijiid != ''){ data.oneClassId =  that.data.yijiid }
    if(that.data.erjiid != ''){ data.twoClassId =  that.data.erjiid }
    if(app.globalData.twoCity != undefined && app.globalData.twoCity != "undefined"){
      if(app.globalData.twoCity.id != 0) {
        data.twoClassId =  app.globalData.twoCity.id 
      }
    }
    qingqiu.get("tjsp", data, function(re) {
      if (re.success == true) {
        if (re.result != null) {
          if(re.result.records==''){
            that.data.isLastPage=true
            wx.showToast({
              title: '没有更多了！',
              icon:'none',
              duration:2000
            })
            return
          }
          that.goodslist=re.result.records
          for(let obj of re.result.records){
            if(obj.shopName == null){
              obj.userId = 0
              obj.shopName = '敬请期待'
            }
            obj.goodPic1 = obj.goodPic1.split(',')
            obj.goodPic2  = obj.goodPic2.split(',')
            if(obj.goodPic1[0]==''&&obj.goodPic1[1]!=''){
              obj.goodPic1[0]=obj.goodPic1[1]
              obj.goodPic1[1]=''
            }
            that.data.goodslist.push(obj)
          }
          that.setData({
            goodslist:that.data.goodslist
          })
          console.log(that.data.goodslist)
        }else{
          wx.showToast({
            title: '暂无商品！',
            icon: 'none',
            duration: 3000
          })
        }
      }else{
        wx.showToast({
          title: '加载失败！',
          icon: 'none',
          duration: 3000
        })
      }
    })
  },
  // 跳转到商品详情页面
  goodsDetails(e) {
    var obj =e.currentTarget.dataset.vals;
    var shopxq = JSON.stringify(obj);
    // debugger
    app.globalData.goodsRefresh = 0
    wx.navigateTo({
      url: '../goodsDetails/goodsDetails?obj=' + shopxq,
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
      goodslist:[],
    })
    if(id == 0){
      app.globalData.oneCity = undefined
      app.globalData.twoCity = undefined
      that.selectsp() //商品
      that.setData({
        // area:[],
        cityId: that.data.id,
        cityname1: that.data.name,
        areaId:0,
        showModalStatus: false,
      })
    }else{
      var data ={
        oneAreaId:id
      }
      app.globalData.oneCity = {id:id,name:name}
      that.selectsp() //商品
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
    if(app.globalData.oneCity==undefined || app.globalData.oneCity==''){
      app.globalData.oneCity= {id:that.data.id,name:that.data.name}
      that.data.cityname1=that.data.name
    }
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
    that.setData({
      weizhi:that.data.cityname1 + name,
      areaId: id,
      //curIndex: index,
      areaname: name,
      showModalStatus: false,
      goodslist:[],
      cityname: that.data.cityname1
    })
    that.selectsp() //商品
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
  // 一级分类
  oneClass(){
    var that =this
    var data={
      type:2
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
        goodslist:[],
        pageNo:1
      })
      that.selectsp()
    }
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
      type:2
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
  // 选项卡点击事件获取分类
  fenlei: function(e) {
    var that = this;
    var id = 1
    var typeid = "fenleitype1.yjid"
    var typeerji = "fenleitype1.erjiid"
    var typestate = "fenleitype1.typestate"
    that.setData({
      [typeid]:'',
      [typeerji]:'',
      [typestate]:false,
      fenClass1:'',
      fenClass2:'',
      yijiname: '',
      secondId: 0,
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
      goodslist:[],
      pageNo:1
    })
    this.selectsp()
  },
  // 分类全部
 typeQuan:function(e){
  var type = e.currentTarget.dataset.id
  if(type == -1){
    this.setData({
      goodslist:[],
      yijiid:'',
      erjiid:'',
      fenleilx:1,
      yijiname:'',
      pageNo:1
    })
  }
  this.selectsp()
},
})