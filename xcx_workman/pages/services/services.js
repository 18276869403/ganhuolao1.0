//获取应用实例
const app = getApp()

const qingqiu = require('../../utils/request.js')
const api = require('../../utils/config.js')
const util = require('../../utils/util.js')

Page({
  data: {
    viewUrl: api.viewUrl,
    chooseworker: 1,
    needsList: [],
    goodsdata3: [],
    city:[],
    workerlist: [],
    workerlist1:[],
    businesslist1:[],
    businesslist: [],
    oneclass:[],
    twoclass:[],
    firstId:'',
    navRightItems:[],
    firstname:'',
    secondId:'',
    secondname:'',
    oneclassid:'',
    twoclassid:'',
    fenClass1:'请选择业务分类',
    fenClass2:'',
    tempClass:'',
    sid:'',
    sname:'',
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
    wid:1,
    yijiid:'',
    yijiname:'',
    erjiid:'',
    isLastPage:false,
    erjiname:'',
    fenleilx:1,
    pageNo:1,
    oneClassId:'',
    twoClassId:'',
    show:false,
    name:'',
    shopName:'',
    weizhi:''
  },
  // 下拉刷新
  onPullDownRefresh: function () {
    this.data.pageNo=1
    this.data.isLastPage=false
    this.data.workerlist.splice(0,this.data.workerlist.length)
    this.data.businesslist.splice(0,this.data.businesslist.length)
    app.globalData.serverRefresh = 1
    app.globalData.servicestype = this.data.chooseworker
    this.onShow()
    // this.onLoad()
    setTimeout(() => {
      wx.stopPullDownRefresh()
    }, 1000);
  },
  // 搜索框
  shurukuang:function(e){
    this.setData({
      sousuotext:e.detail.value
    })
  },
  // 搜索按钮
  btnsearch:function(){
    this.data.pageNo=1
    this.data.isLastPage=false
    if(this.data.yijiid != "" && this.data.yijiid != "undefined" && this.data.yijiid != null){
      this.data.oneClassId = this.data.yijiid
    }else{
      this.data.oneClassId=''
    }
    if(this.data.erjiid != "" && this.data.erjiid != "undefined" && this.data.erjiid != null){
      this.data.twoClassId = this.data.erjiid
    }else{
      this.data.twoClassId=''
    }
    if(this.data.chooseworker == 1){
      this.data.workerlist.splice(0,this.data.workerlist.length)
      if(this.data.sousuotext != "" && this.data.sousuotext != "undefined" && this.data.sousuotext != null){
        this.data.name = this.data.sousuotext
      }else{
        this.data.name=''
      }
      this.data.workerlist=[]
      this.setData({
        workerlist:this.data.workerlist
      })
      this.grneedlist()
    }else{
      this.data.businesslist.splice(0,this.data.businesslist.length)
      if(this.data.sousuotext != "" && this.data.sousuotext != "undefined" && this.data.sousuotext != null){
        this.data.shopName = this.data.sousuotext
      }else{
        this.data.shopName=''
      }
      this.data.businesslist=[]
      this.setData({
        businesslist:this.data.businesslist
      })
      this.sjneedlist()
    }
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
  
  onShow: function(){
    wx.showShareMenu({
      withShareTicket: true
    })
    if(app.globalData.serverRefresh != 0){
      this.chushishouquan()
      var type = app.globalData.servicestype
      if(type == 0){
        this.setData({
          chooseworker:0
        })
        if(app.globalData.oneCity != undefined){
          this.setData({
            businesslist:[],
            weizhi:app.globalData.oneCity.name + app.globalData.twoCity.name,
            pageNo:1
          })
          this.sjneedlist()
        }else{
          this.setData({
            businesslist:[],
            pageNo:1,
            cityId: this.data.sid,
            cityname1: this.data.sname,
            weizhi:'全部',
            areaId:0
          })
          this.sjneedlist()
        }
      }else{
        this.setData({
          chooseworker:1
        })
        if(app.globalData.oneCity != undefined){
          this.setData({
            workerlist:[],
            weizhi:app.globalData.oneCity.name + app.globalData.twoCity.name,
            pageNo:1
          })
          this.grneedlist()
        }else{
          this.setData({
            workerlist:[],
            pageNo:1,
            cityId: this.data.sid,
            cityname1: this.data.sname,
            weizhi:'全部',
            areaId:0
          })
          this.grneedlist()
        }
      }
      this.QueryoneArea()
      this.QuerytwoArea()
    }
  },
  onLoad: function() {
    // this.grneedlist()
    // this.sjneedlist()
  },
  // 我要入驻
  ruzhu:function(){
    var type = this.data.chooseworker
    if(type == 1){
      if(app.globalData.wxState == 0){
        wx.showToast({
          title: '您已入驻商家,同一微信不能入驻两种类型',
          icon:'none',
          duration:2000
        })
        return
      }else{
        app.globalData.serverRefresh = 0
        wx.navigateTo({
          url: '../applyBusiness/applyBusiness?typeid=1',
        })
      }
    }else if(type == 0){
      if(app.globalData.wxState == 1){
        wx.showToast({
          title: '您已入驻工人,同一微信不能入驻两种类型',
        })
        return
      }else{
        app.globalData.serverRefresh = 0
        wx.navigateTo({
          url: '../applyBusiness/applyBusiness?typeid=2',
        })
      }
    }else{
      app.globalData.serverRefresh = 0
      type = type == 0 ? 2:1
      wx.navigateTo({
        url: '../applyBusiness/applyBusiness?typeid='+type,
      })
    }
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
  changeType: function(e) {
    var that = this
    that.data.isLastPage=false
    that.setData({
      yijiname : '',
      erjiname : '',
      yijiid:'',
      erjiid:'',
      pageNo:1
    })
    if (that.data.chooseworker == 0) {
      that.setData({
        chooseworker: 1,
        workerlist:[],
        fenleilx:1
      })
      // that.data.fenleilx=1
      that.grneedlist()
    } else {
      that.setData({
        chooseworker: 0,
        businesslist:[],
        fenleilx:2
      }) 
      // that.data.fenleilx=2
      that.sjneedlist()
    }
  },
  // 一级分类
  // oneClass(){
  //   var that =this
  //   var data={
  //     type:that.data.fenleilx
  //   }
  //   qingqiu.get("oneClassList", data, function(re) {
  //   if (re.success == true) {
  //     if (re.result != null) {
  //       that.oneclass = re.result
  //       that.setData ({
  //         oneclass : that.oneclass
  //       })
  //       console.log(that.oneclass)
  //     } else {
  //       qingqiu.tk('未查询到任何数据')
  //     }
  //   } 
  // })
  // },
  // 二级分类
  // twoClass(){
  //   var that =this
  //   var data={
  //     oneClassId:2
  //   }
  //   qingqiu.get("twoClassList", data, function(re) {
  //   if (re.success == true) {
  //     if (re.result != null) {
  //       that.twoclass = re.result
  //       that.setData ({
  //         twoclass : that.twoclass
  //       })
  //       console.log(that.twoclass)
  //     } else {
  //       qingqiu.tk('未查询到任何数据')
  //     }
  //   } 
  // })
  // },
  // 左侧按钮
  // left: function (e) {
  //   var that = this;
  //   var id = e.currentTarget.dataset.id
  //   var name = e.currentTarget.dataset.name
  //   that.setData({
  //     firstId: id,
  //     firstname: name
  //   })
  //   var data={
  //     oneClassId:that.data.firstId
  //   }
  //   qingqiu.get("twoClassList", data, function(re) {
  //   if (re.success == true) {
  //     if (re.result != null) {
  //       that.twoclass = re.result
  //       that.setData ({
  //         twoclass : that.twoclass
  //       })
  //     } else {}
  //   } 
  // })
  // },
  // 右侧单选点击
  // right: function (e) {
  //   var that = this;
  //   var id = e.currentTarget.dataset.id
  //   var name = e.currentTarget.dataset.name
  //   that.setData({
  //     secondId: id,
  //     secondname: name,
  //     yijiname: this.data.yijiname1,
  //     showModalStatus: false,
  //   })
  // },
  // // 全部
  // quanbu:function(){
  //   var that = this
  //   that.data.firstId=''
  //   that.data.secondId=''
  //   that.data.firstname=''
  //   that.setData({
  //     showModalStatus: false,
  //     firstname:that.data.firstname
  //   })
  // },

  // 跳转到商家详情页面
  businessDetails: function (e) {
    app.globalData.servicestype = 0
    var obj = JSON.stringify(e.currentTarget.dataset.vals)
    app.globalData.serverRefresh = 0
    wx.navigateTo({
      url: '../businessDetails/businessDetails?obj=' + obj,
    })
  },
  // 上拉功能
  onReachBottom: function () {
    if(this.data.chooseworker == 1){
      if (this.data.isLastPage) {
        wx.showToast({
          title: '没有更多了！',
          icon:'none',
          duration:2000
        })
        return
      }
      this.setData({ pageNo: this.data.pageNo + 1 })
      this.grneedlist()
    }else{
      if (this.data.isLastPage) {
        wx.showToast({
          title: '没有更多了！',
          icon:'none',
          duration:2000
        })
          return
      }
      this.setData({ pageNo: this.data.pageNo + 1 })
      this.sjneedlist()
    }
  },
  // 推荐工人
  grneedlist() {
    var that = this
    var data={
      pageNo:that.data.pageNo,
      pageSize:10,
      oneClassId:that.data.yijiid,
      twoClassId:that.data.erjiid,
      name:that.data.name,
      wxState:that.data.chooseworker
    }
    if(app.globalData.oneCity != undefined && app.globalData.oneCity != "undefined" ){
      data.oneAreaId = app.globalData.oneCity.id
    }
    if(app.globalData.twoCity != undefined && app.globalData.twoCity != "undefined"){
      if(app.globalData.twoCity.id != 0){
        data.twoAreaId = app.globalData.twoCity.id
      }
    }
    console.log(data)
    qingqiu.get("wxUserPage", data, function(re) {
      console.log(re)
      if (re.success == true) {
        if (re.result != null) {
          if(re.result.records==''){
            that.setData({
              isLastPage:true
            })
          }else{
            for(let obj of re.result.records){
              if(obj.starClass == 0){
                obj.shopName = "暂未评级"
              }else if(obj.starClass == 1){
                obj.shopName = "一级工匠"
              }else if(obj.starClass == 2){
                obj.shopName = "二级工匠"
              }else if(obj.starClass == 3){
                obj.shopName = "三级工匠"
              }else if(obj.starClass == 4){
                obj.shopName = "四级工匠"
              }if(obj.starClass == 5){
                obj.shopName = "五级工匠"
              }
              obj.dateBirth = util.ages(obj.dateBirth)
              obj.picIurl = that.data.viewUrl + obj.picIurl
              var onename = []
              var twoname = []
              if(obj.oneClassName != null){
                if(obj.oneClassName.indexOf(',') != -1){
                  onename = obj.oneClassName.split(',')
                }else{
                  onename[0] = obj.oneClassName
                }
              }
              if(obj.twoClassName != null){
                if(obj.twoClassName.indexOf(',') != -1){
                  twoname = obj.twoClassName.split(',')
                }else{
                  twoname[0] = obj.twoClassName
                }
              }
              obj.oneClassName = onename[0] + ' | '+twoname[0]
              if(onename.length > 1){
                obj.twoClassName = onename[1] + ' | ' + twoname[1] 
              }else{
                obj.twoClassName = ''
              }
              that.data.workerlist.push(obj)
            }
            that.setData({
              workerlist:that.data.workerlist,
              workerlist1:re.result.records
            })
          }
        } 
      } 
    })
  },

  // 推荐商家
  sjneedlist() {
    var that = this
    var data={
      pageNo:that.data.pageNo,
      size:10,
      oneClassId:that.data.yijiid,
      twoClassId:that.data.erjiid,
      shopName:that.data.shopName,
      wxState:that.data.chooseworker
    }
    if(app.globalData.oneCity != undefined && app.globalData.oneCity != "undefined"){
      data.oneAreaId = app.globalData.oneCity.id
    }
    if(app.globalData.twoCity != undefined && app.globalData.twoCity != "undefined"){
      if(app.globalData.twoCity.id!=0){
        data.twoAreaId = app.globalData.twoCity.id
      }
    }
    console.log(data)
    qingqiu.get("wxUserPage", data, function(re) {
      console.log('推荐商家',re)
      if (re.success == true) {
        if (re.result != null) {
          if(re.result.records==''){
            that.setData({
              isLastPage:true
            })
          }else{
            for(let obj of re.result.records){
              obj.picIurl = that.data.viewUrl + obj.picIurl
              // 重定义分类
              var onename = []
              var twoname = []
              if(obj.oneClassName != null){
                if(obj.oneClassName.indexOf(',') != -1){
                  onename = obj.oneClassName.split(',')
                }else{
                  onename[0] = obj.oneClassName
                }
              }
              if(obj.twoClassName != null){
                if(obj.twoClassName.indexOf(',') != -1){
                  twoname = obj.twoClassName.split(',')
                }else{
                  twoname[0] = obj.twoClassName
                }
              }
              obj.oneClassName = onename[0] + ' | ' + twoname[0]
              if(onename.length > 1){
                obj.twoClassName = onename[1] + ' | ' + twoname[1]
              }else{
                obj.twoClassName = ''
              }
              that.data.businesslist.push(obj)
            }
            that.setData({
              businesslist:that.data.businesslist,
            })
          }
        } 
      } 
    })
  },
  // 跳转到工人详情页面
  workerDetails: function (e) {
    app.globalData.servicestype = 1
    var obj = JSON.stringify(e.currentTarget.dataset.vals)
    app.globalData.serverRefresh = 0
    wx.navigateTo({
      url: '../workerDetails/workerDetails?obj=' + obj,
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
        showModalStatus2: false
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
      animationData2: animation.export(),
      showModalStatuslist: true,
      showModalStatus2:true,
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
    if(flag=="true"){
      that.setData({
        yijiid: that.data.yijiid,
        erjiid:that.data.erjiid,
        yijiname : that.data.yijiname,
        erjiname : that.data.erjiname,
      })
    }else{
      that.setData({
        yijiname : '',
        erjiname : '',
        yijiid:'',
        erjiid:''
      })
      if(that.data.chooseworker == 1){
        that.setData({workerlist:[]})
        that.grneedlist()
      }else{
        that.setData({businesslist:[]})
        that.sjneedlist()
      }
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
        // showModalStatus2:false,
        showModalStatus6:false
      })
    }.bind(this), 200)
  },
  // 获取分类
  typefenleiyj: function() {
    var that = this
    var data = {
      type:that.data.fenleilx
    }
    qingqiu.get("oneClassList", data, function(re) {
      that.setData({
        gongzhong:''
      })
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
  // typefenleiej: function() {
  //   var data = {
  //     oneClassId: this.data.typeyj
  //   }
  //   var that = this
  //   qingqiu.get("twoClassService", data, function(re) {
  //     that.setData({
  //       typeejlist: re.data.result
  //     })
  //   })
  // },
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
 
  // 改变二级分类
  changetwoclass: function (e) {
    var that=this
    var erjiid = e.currentTarget.dataset.id
    var yijiid = e.currentTarget.dataset.yjid
    var yijiname = e.currentTarget.dataset.yijiname
    var erjiname = e.currentTarget.dataset.erjiname
    that.setData({
      erjiid:erjiid,
      yijiid:yijiid,
      yijiname:yijiname,
      erjiname:erjiname,
      pageNo:1
    })
    if (that.data.chooseworker == 1) {
      that.setData({
        workerlist:[],
        fenleilx:1
      })
      that.grneedlist()
    } else {
      that.setData({
        businesslist:[],
        fenleilx:2
      }) 
      that.sjneedlist()
    }
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
        that.data.sid=re.result[0].id
        that.data.sname=re.result[0].areaName
        if(app.globalData.oneCity == undefined || app.globalData.oneCity == "undefined"){
          that.setData({
            cityId: that.data.sid,
            cityname1: that.data.sname,
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
      oneAreaId:that.data.wid
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
      show:true,
      cityId: id,
      cityname1: name,
      weizhi:name,
      workerlist:[],
      businesslist:[],
      pageNo:1
    })
    if(id == 0){
      app.globalData.oneCity = undefined
      app.globalData.twoCity = undefined
      id = 0
      that.grneedlist() //工人
      that.sjneedlist()  //商家 
      that.setData({
        // area:[],
        cityId: that.data.sid,
        cityname1: that.data.sname,
        areaId:0,
        showModalStatus: false,
        show:true
      })
    }else{
      var data ={
        oneAreaId:id
      }
      app.globalData.oneCity = {id:id,name:name}
      that.grneedlist() //工人
      that.sjneedlist()  //商家 
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
      app.globalData.oneCity= {id:that.data.sid,name:that.data.sname}
      that.data.cityname1=that.data.sname
    }
    if(that.data.weizhi == undefined || that.data.weizhi == ""){
      wx.showToast({
        title: '请选择城市',
        icon:'none',
        duration:1000
      })
      return
    }
    var id = e.currentTarget.dataset.id
    var name = e.currentTarget.dataset.name
    app.globalData.twoCity={id:id,name:name}
    that.setData({
      weizhi:that.data.cityname1 + name,
      areaId: id,
      //curIndex: index,
      show:false,
      areaname: name,
      workerlist:[],
      businesslist:[],
      showModalStatus: false,
      cityname: this.data.cityname1
    })
    console.log(that.data.weizhi)
    that.grneedlist() //工人
    that.sjneedlist()  //商家 
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
})