// pages/buildDraw/buildDraw.js
const app = getApp()
const qingqiu = require('../../utils/request.js')
const api = require('../../utils/config.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 图片浏览
    iconUrl: api.iconUrl,
    // 搜索参数
    layerid: 0,
    buildstyleId: 0,
    structureId: 0,
    manufacturId: 0,
    buildareaId: 0,
    title: '',
    pageNo: 1,
    pageSize: 10,
    // 弹窗集合
    items: [{
        name: "建筑层数",
        typename: '',
        classid: 0
      },
      {
        name: "建筑风格",
        typename: '',
        classid: 0
      },
      {
        name: "结构形式",
        typename: '',
        classid: 0
      },
      {
        name: "主体造价",
        typename: '',
        classid: 0
      },
      {
        name: "占地面积",
        typename: '',
        classid: 0
      }
    ],

    // 遮罩控制
    showModalStatus: false,
    showModaltype: 0,
    classification: [],
    // 数据展示
    buildslist: [],
    // 下滑加载
    isLastPage: false,
    // 禁用按钮控制
    btnFlag:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var backupitems = [
      { name: "建筑层数",typename: '',classid: 0 },
      { name: "建筑风格",typename: '',classid: 0 },
      { name: "结构形式",typename: '',classid: 0 },
      { name: "主体造价",typename: '',classid: 0 },
      { name: "占地面积",typename: '',classid: 0 }
    ]
    if(app.globalData.buildDrawType != 1){
      this.setData({
        buildslist: [],
        layerid: 0,
        buildstyleId: 0,
        structureId: 0,
        manufacturId: 0,
        buildareaId: 0,
        title: '',
        items: backupitems,
        pageNo: 1,
        pageSize: 10,
        isLastPage: false
      })
      this.findbuilds()
    }
    app.globalData.buildDrawType = 0
  },

  /**
   * 搜索框
   * @param {搜索条件} e 
   */
  getSearch: function (e) {
    this.setData({
      title: e.detail.value
    })
  },

  /**
   * 切换到详情页
   * @param {id} e 
   */
  buildsDetails:function(e){
    var that = this
    that.setData({btnFlag:true})
    var id = e.currentTarget.dataset.id
    app.globalData.buildDrawType = 1
    qingqiu.get("buildeditById",{id:id},function(res){
      that.setData({btnFlag:false})
      wx.navigateTo({
        url: '../buildDrawDetails/buildDrawDetails?id=' + id,
      })
    })
  },

  /**
   * 搜索按钮
   */
  getbuilds: function () {
    this.setData({
      buildslist: [],
      pageNo: 1,
      pageSize: 10,
      isLastPage: false
    })
    this.findbuilds()
  },

  /**
   * 发布按钮
   */
  submit:function(){
    wx.navigateTo({
      url: '../submitBuilddraw/submitBuilddraw',
    })
  },

  /**
   * 获取建房图纸集合
   */
  findbuilds: function () {
    var that = this
    var val = that.data
    var data = {
      pageNo: val.pageNo,
      pageSize: val.pageSize
    }
    if (val.layerid != 0) {
      data.layerId = val.layerid
    }
    if (val.buildstyleId != 0) {
      data.buildStyleId = val.buildstyleId
    }
    if (val.structureId != 0) {
      data.structureId = val.structureId
    }
    if (val.manufacturId != 0) {
      data.manufacturId = val.manufacturId
    }
    if (val.buildareaId != 0) {
      data.buildAreaId = val.buildareaId
    }
    if (val.title != '') {
      data.title = val.title
    }
    console.log(data)
    qingqiu.get("buildfindlist", data, function (res) {
      console.log(res)
      if (res.success == true) {
        if (res.result.records == '') {
          val.isLastPage = true
          wx.showToast({
            title: '没有更多了！',
            icon: 'none',
            duration: 2000
          })
          return
        }
        for (let obj of res.result.records) {
          var piclist = []
          if (obj.pic != "" && obj.pic != null) {
            if (obj.pic.indexOf(',') != -1) {
              piclist = obj.pic.split(',')
            } else {
              piclist.push(obj.pic)
            }
            obj.pic = piclist
          }
          val.buildslist.push(obj)
        }
        that.setData({
          buildslist: val.buildslist
        })
      }
    })
  },

  /**
   * 显示弹窗样式
   * @param {类别} e 
   */
  showModal: function (e) {
    var type = e.currentTarget.dataset.type
    this.setData({
      hasMask: true,
      showModaltype: type,
    })
    this.getClassification(type)
    var animation = wx.createAnimation({
      duration: 300,
      timingFunction: 'linear',
      delay: 0,
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

  /**
   * 选中分类事件
   * @param {选中分类的id和name} e 
   */
  changeclass: function (e) {
    var id = e.currentTarget.dataset.id
    var name = e.currentTarget.dataset.name
    var para = this.data
    var item = "items[" + para.showModaltype + "].typename"
    var classid = "items[" + para.showModaltype + "].classid"
    console.log(item)
    this.setData({
      [classid]: id,
      [item]: name
    })
    switch (para.showModaltype) {
      case 0:
        this.setData({
          layerid: id
        })
        break;
      case 1:
        this.setData({
          buildstyleId: id
        })
        break;
      case 2:
        this.setData({
          structureId: id
        })
        break;
      case 3:
        this.setData({
          manufacturId: id
        })
        break;
      case 4:
        this.setData({
          buildareaId: id
        })
    }
    this.setData({
      buildslist: [],
      pageNo: 1,
      pageSize: 10,
      isLastPage: false
    })
    this.findbuilds()
  },

  /**
   * 根据类别id获取分类
   * @param {类别id} type 
   */
  getClassification: function (type) {
    var that = this
    qingqiu.get("findClass", {
      typeid: type
    }, function (res) {
      console.log(res)
      if (res.success == true) {
        var obj = {
          id: 0,
          bname: '全部'
        }
        var classification = []
        classification.push(obj)
        for (let obj of res.result) {
          classification.push(obj)
        }
        that.setData({
          classification: classification
        })
      }
    })
  },

  /**
   * 隐藏弹窗样式
   * @param {*} e 
   */
  hideModal: function (e) {
    var that = this
    var flag = e.currentTarget.dataset.return
    // 判断 确定/取消
    if (flag == "true") {
      that.setData({
        classname: that.data.classname,
        classid: that.data.classid
      })
    } else {
      that.setData({
        classname: '',
        classid: ''
      })
    }
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0,
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
    }.bind(this), 200)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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
    this.onShow()
    setTimeout(() => {
      wx.stopPullDownRefresh()
    }, 1000);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.isLastPage) {
      wx.showToast({
        title: '没有更多了！',
        icon: 'none',
        duration: 2000
      })
      return
    }
    this.setData({
      pageNo: this.data.pageNo + 1
    })
    this.findbuilds()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})