// import { match } from "assert"

// pages/yyyy/yyyy.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shendu:'',
    fjkd:'',
    fjcd:'',
    mgd:'',
    mkd:'',
    msl:'',
    cgd:'',
    ckd:'',
    csl:'',
    // 地板
    dbfjcd:'',
    dbfjkd:'',
    dbdcd:'',
    dbdkd:'',
    // 地砖
    dzfjcd:'',
    dzfjkd:'',
    dzzcd:'',
    dzzkd:'',
    // 墙砖
    qzfjcd:'',
    qzfjkd:'',
    qzfjgd:'',
    qzmgd:'',
    qzmkd:'',
    qzmss:'',
    qzcgd:'',
    qzckd:'',
    qzcss:'',
    qzcd:'',
    qzkd:'',
    //壁纸
    bzfjcd:'',
    bzfjkd:'',
    bzfjgd:'',
    bzgg:'',
    //窗帘
    chcd:'',
    chkd:'',
    blkd:'',
    //顶棚
    dpfjcd:'',
    dpfjkd:'',
    dpddgd:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showShareMenu({
      withShareTicket: true
    })
    console.log(options.obj)
    if(options.obj==1){
      this.setData({
        type:1
      })
      wx.setNavigationBarTitle({
        title: '涂料用量'
      })
    }
    if(options.obj==2){
      this.setData({
        type:2
      })
      wx.setNavigationBarTitle({
        title: '地板用量'
      })
    }
    if(options.obj==3){
      this.setData({
        type:3
      })
      wx.setNavigationBarTitle({
        title: '地砖用量'
      })
    }
    if(options.obj==4){
      this.setData({
        type:4
      })
      wx.setNavigationBarTitle({
        title: '墙砖用量'
      })
    }
    if(options.obj==5){
      this.setData({
        type:5
      })
      wx.setNavigationBarTitle({
        title: '壁纸用量'
      })
    }
    if(options.obj==6){
      this.setData({
        type:6
      })
      wx.setNavigationBarTitle({
        title: '窗帘用量'
      })
    }
    if(options.obj==7){
      this.setData({
        type:7
      })
      wx.setNavigationBarTitle({
        title: '顶棚用量'
      })
    }
  },
  // 获取深度
  shendu:function(e){
    this.setData({
      shendu:e.detail.value
    })
  },
  //房间宽度
  fjkd:function(e){
    this.setData({
      fjkd:e.detail.value
    })
  },
  //房间长度
  fjcd:function(e){
    this.setData({
      fjcd:e.detail.value
    })
  },
  //门高度
  mgd:function(e){
    this.setData({
      mgd:e.detail.value
    })

  },
  //门宽度
  mkd:function(e){
    this.setData({
      mkd:e.detail.value
    })
  },
  //门数量
  msl:function(e){
    this.setData({
      msl:e.detail.value
    })
  },
  //窗高度
  cgd:function(e){
    this.setData({
      cgd:e.detail.value
    })
  },
  //窗宽度
  ckd:function(e){
    this.setData({
      ckd:e.detail.value
    })
  },
  //窗数量
  csl:function(e){
    this.setData({
      csl:e.detail.value
    })
  },

  shendu:function(e){
    this.setData({
      shendu:e.detail.value
    })
  },
  // 计算-涂料用量
  jisuan:function(){
    var that=this
    if(that.data.shendu==''){
      wx.showToast({
        title: '请输入房间高度',
        icon:'none',
        duration:2000
      })
      return
    }
    if(that.data.fjkd==''){
      wx.showToast({
        title: '请输入房间宽度',
        icon:'none',
        duration:2000
      })
      return
    }
    if(that.data.fjcd==''){
      wx.showToast({
        title: '请输入房间长度',
        icon:'none',
        duration:2000
      })
      return
    }
    if(that.data.mgd==''){
      wx.showToast({
        title: '请输入门高度',
        icon:'none',
        duration:2000
      })
      return
    }
    if(that.data.mkd==''){
      wx.showToast({
        title: '请输入门宽度',
        icon:'none',
        duration:2000
      })
      return
    }
    if(that.data.msl==''){
      wx.showToast({
        title: '请输入门数量',
        icon:'none',
        duration:2000
      })
      return
    }
    if(that.data.cgd==''){
      wx.showToast({
        title: '请输入窗高度',
        icon:'none',
        duration:2000
      })
      return
    }
    if(that.data.ckd==''){
      wx.showToast({
        title: '请输入窗宽度',
        icon:'none',
        duration:2000
      })
      return
    }
    if(that.data.csl==''){
      wx.showToast({
        title: '请输入窗数量',
        icon:'none',
        duration:2000
      })
      return
    }
    var fc=that.data.fjcd
    var fk=that.data.fjkd
    var fs=that.data.shendu
    var mainji=(Number(fc)+Number(fk))*2*Number(fs)+Number(fc)*Number(fk)
    var menmainji=Number(that.data.mgd)*Number(that.data.mkd)*Number(that.data.msl)
    var chuangmainji=Number(that.data.cgd)*Number(that.data.ckd)*Number(that.data.csl)
    var sjmj=Number(mainji)-Number(menmainji)-Number(chuangmainji)
    var jieguo1=(Number(sjmj)/8.6*100)/100
    var jieguotl=Math.round((Number(sjmj)/8.6*100)/100)
    if(Number(jieguotl)<Number(jieguo1))
    {
      var jieguotl=Number(jieguotl)+1
    }
    console.log(jieguotl)
    wx.navigateTo({
      url: '../jsjg/jsjg?obj='+jieguotl+'升'+'&oneclass=26&twoclass=73',
    })
  },

  // 地板用量计算
  //房间长度
  dbfjcd:function(e){
    this.setData({
      dbfjcd:e.detail.value
    })
  },
  //房间宽度
  dbfjkd:function(e){
    this.setData({
      dbfjkd:e.detail.value
    })
  },
  //地板长度
  dbdcd:function(e){
    this.setData({
      dbdcd:e.detail.value
    })
  },
  //地板宽度
  dbdkd:function(e){
    this.setData({
      dbdkd:e.detail.value
    })
  },
  //计算
  jisuandb(){
    var that=this
    if(that.data.dbfjcd==''){
      wx.showToast({
        title: '请输入房间长度',
        icon:'none',
        duration:2000
      })
      return
    }
    if(that.data.dbfjkd==''){
      wx.showToast({
        title: '请输入房间宽度',
        icon:'none',
        duration:2000
      })
      return
    }
    if(that.data.dbdcd==''){
      wx.showToast({
        title: '请输入地板长度',
        icon:'none',
        duration:2000
      })
      return
    }
    if(that.data.dbdkd==''){
      wx.showToast({
        title: '请输入地板宽度',
        icon:'none',
        duration:2000
      })
      return
    }
    // 耗损率
    var rate=1.05
    var dbfjcd=Number(that.data.dbfjcd)*100
    var dbfjkd=Number(that.data.dbfjkd)*100
    var jieguo2=(Number(dbfjcd)/Number(that.data.dbdcd))*(Number(dbfjkd)/Number(that.data.dbdkd))*Number(rate)
    var jieguodb=Math.round(jieguo2)
    if(Number(jieguodb)<Number(jieguo2))
    {
      var jieguodb=Number(jieguodb)+1
    }
    console.log(jieguodb)
    wx.navigateTo({
      url: '../jsjg/jsjg?obj='+jieguodb+'块'+'&oneclass=26&twoclass=72',
    })
  },

  // 地砖用量计算
  //房间长度
  dzfjcd:function(e){
    this.setData({
      dzfjcd:e.detail.value
    })
  },
  //房间宽度
  dzfjkd:function(e){
    this.setData({
      dzfjkd:e.detail.value
    })
  },
  //地砖长度
  dzzcd:function(e){
    this.setData({
      dzzcd:e.detail.value
    })
  },
  //地砖宽度
  dzzkd:function(e){
    this.setData({
      dzzkd:e.detail.value
    })
  },
  //计算
  jisuandz(){
    var that=this
    if(that.data.dzfjcd==''){
      wx.showToast({
        title: '请输入房间长度',
        icon:'none',
        duration:2000
      })
      return
    }
    if(that.data.dzfjkd==''){
      wx.showToast({
        title: '请输入房间宽度',
        icon:'none',
        duration:2000
      })
      return
    }
    if(that.data.dzzcd==''){
      wx.showToast({
        title: '请输入地砖长度',
        icon:'none',
        duration:2000
      })
      return
    }
    if(that.data.dzzkd==''){
      wx.showToast({
        title: '请输入地砖宽度',
        icon:'none',
        duration:2000
      })
      return
    }
    // 耗损率
    var rate=1.05
    var jieguo3=(Number(that.data.dzfjcd)*100/Number(that.data.dzzcd))*(Number(that.data.dzfjkd)*100/Number(that.data.dzzkd))*Number(rate)
    var jieguodz=Math.round(jieguo3)
    if(Number(jieguodz)<Number(jieguo3))
    {
      var jieguodz=Number(jieguodz)+1
    }
    console.log(jieguodz)
    wx.navigateTo({
      url: '../jsjg/jsjg?obj='+jieguodz+'块'+'&oneclass=26&twoclass=72',
    })
  },
  
  // 墙砖用量计算
   
  //房间长度
  qzfjcd:function(e){
    this.setData({
      qzfjcd:e.detail.value
    })
  },
  //房间宽度
  qzfjkd:function(e){
    this.setData({
      qzfjkd:e.detail.value
    })
  },
  //房间高度
  qzfjgd:function(e){
    this.setData({
      qzfjgd:e.detail.value
    })
  },
  //门高度
  qzmgd:function(e){
    this.setData({
      qzmgd:e.detail.value
    })
  },
  //门宽度
  qzmkd:function(e){
    this.setData({
      qzmkd:e.detail.value
    })
  },
  //门扇数
  qzmss:function(e){
    this.setData({
      qzmss:e.detail.value
    })
  },
  //窗高度
  qzcgd:function(e){
    this.setData({
      qzcgd:e.detail.value
    })
  },
  //窗宽度
  qzckd:function(e){
    this.setData({
      qzckd:e.detail.value
    })
  },
  //窗扇数
  qzcss:function(e){
    this.setData({
      qzcss:e.detail.value
    })
  },
  //墙砖长度
  qzcd:function(e){
    this.setData({
      qzcd:e.detail.value
    })
  },
  //墙砖宽度
  qzkd:function(e){
    this.setData({
      qzkd:e.detail.value
    })
  },
  //计算
  jisuanqz(){
    var that=this
    if(that.data.qzfjcd==''){
      wx.showToast({
        title: '请输入房间长度',
        icon:'none',
        duration:2000
      })
      return
    }
    if(that.data.qzfjkd==''){
      wx.showToast({
        title: '请输入房间宽度',
        icon:'none',
        duration:2000
      })
      return
    }
    if(that.data.qzfjgd==''){
      wx.showToast({
        title: '请输入房间高度',
        icon:'none',
        duration:2000
      })
      return
    }
    if(that.data.qzmgd==''){
      wx.showToast({
        title: '请输入门高度',
        icon:'none',
        duration:2000
      })
      return
    }
    if(that.data.qzmkd==''){
      wx.showToast({
        title: '请输入门宽度',
        icon:'none',
        duration:2000
      })
      return
    }
    if(that.data.qzmss==''){
      wx.showToast({
        title: '请输入门扇数',
        icon:'none',
        duration:2000
      })
      return
    }
    if(that.data.qzcgd==''){
      wx.showToast({
        title: '请输入窗高度',
        icon:'none',
        duration:2000
      })
      return
    }
    if(that.data.qzckd==''){
      wx.showToast({
        title: '请输入窗宽度',
        icon:'none',
        duration:2000
      })
      return
    }
    if(that.data.qzcss==''){
      wx.showToast({
        title: '请输入窗扇数',
        icon:'none',
        duration:2000
      })
      return
    }
    if(that.data.qzcd==''){
      wx.showToast({
        title: '请输入墙砖长度',
        icon:'none',
        duration:2000
      })
      return
    }
    if(that.data.qzkd==''){
      wx.showToast({
        title: '请输入墙砖宽度',
        icon:'none',
        duration:2000
      })
      return
    }
    // 耗损率
    var rate=1.05
    var num1= (Number(that.data.qzfjcd)*100/Number(that.data.qzcd))*(Number(that.data.qzfjgd)*100/Number(that.data.qzkd))*2
    var num2= (Number(that.data.qzfjkd)*100/Number(that.data.qzcd))*(Number(that.data.qzfjgd)*100/Number(that.data.qzkd))*2
    var num3= (Number(that.data.qzcgd)*100/Number(that.data.qzcd))*(Number(that.data.qzckd)*100/Number(that.data.qzkd))*Number(that.data.qzcss)
    var num4= (Number(that.data.qzmgd)*100/Number(that.data.qzcd))*(Number(that.data.qzmkd)*100/Number(that.data.qzkd))*Number(that.data.qzmss)
    var num5=Number(num1)+Number(num2)-Number(num3)-Number(num4)
    var jieguo4=Number(num5)*Number(rate)
    var jieguoqz=Math.round(jieguo4)
    if(Number(jieguoqz)<Number(jieguo4))
    {
      var jieguoqz=Number(jieguoqz)+1
    }
    console.log(jieguoqz)
    wx.navigateTo({
      url: '../jsjg/jsjg?obj='+jieguoqz+'块'+'&oneclass=26&twoclass=72',
    })
  },

  // 壁纸用量计算
   
  //房间长度
  bzfjcd:function(e){
    this.setData({
      bzfjcd:e.detail.value
    })
  },
  //房间宽度
  bzfjkd:function(e){
    this.setData({
      bzfjkd:e.detail.value
    })
  },
  //房间高度
  bzfjgd:function(e){
    this.setData({
      bzfjgd:e.detail.value
    })
  },
  //壁纸规格
  bzgg:function(e){
    this.setData({
      bzgg:e.detail.value
    })
  },
  //计算
  jisuanbz(){
    var that=this
    if(that.data.bzfjcd==''){
      wx.showToast({
        title: '请输入房间长度',
        icon:'none',
        duration:2000
      })
      return
    }
    if(that.data.bzfjkd==''){
      wx.showToast({
        title: '请输入房间宽度',
        icon:'none',
        duration:2000
      })
      return
    }
    if(that.data.bzfjgd==''){
      wx.showToast({
        title: '请输入房间高度',
        icon:'none',
        duration:2000
      })
      return
    }
    if(that.data.bzgg==''){
      wx.showToast({
        title: '请输入壁纸规格',
        icon:'none',
        duration:2000
      })
      return
    }
    // 耗损率
    var rate=1.1
    var jieguo5=(Number(that.data.bzfjcd)*2+Number(that.data.bzfjkd)*2)*Number(that.data.bzfjgd)*Number(rate)/Number(that.data.bzgg)
    var jieguobz=Math.round(jieguo5)
    if(Number(jieguobz)<Number(jieguo5))
    {
      var jieguobz=Number(jieguobz)+1
    }
    console.log(jieguobz)
    wx.navigateTo({
      url: '../jsjg/jsjg?obj='+jieguobz+'卷'+'&oneclass=26&twoclass=81',
    })
  },
  
  // 窗帘用量计算
   
  //窗户长度
  chcd:function(e){
    this.setData({
      chcd:e.detail.value
    })
  },
  //窗户宽度
  chkd:function(e){
    this.setData({
      chkd:e.detail.value
    })
  },
  //布料宽度
  blkd:function(e){
    this.setData({
      blkd:e.detail.value
    })
  },
  //计算
  jisuancl(){
    var that=this
    if(that.data.chcd==''){
      wx.showToast({
        title: '请输入窗户长度',
        icon:'none',
        duration:2000
      })
      return
    }
    if(that.data.chkd==''){
      wx.showToast({
        title: '请输入窗户宽度',
        icon:'none',
        duration:2000
      })
      return
    }
    if(that.data.blkd==''){
      wx.showToast({
        title: '请输入布料宽度',
        icon:'none',
        duration:2000
      })
      return
    }
    var jieguo6=(Number(that.data.chkd)+0.15*2)*2/Number(that.data.blkd)*(0.85+Number(that.data.chcd))
    var jieguocl=Math.round(jieguo6)
    if(Number(jieguocl)<Number(jieguo6))
    {
      var jieguocl=Number(jieguocl)+1
    }
    console.log(jieguocl)
    wx.navigateTo({
      url: '../jsjg/jsjg?obj='+jieguocl+'米'+'&oneclass=26&twoclass=90',
    })
  },
  
  // 顶棚用量计算
   
  //房间长度
  dpfjcd:function(e){
    this.setData({
      dpfjcd:e.detail.value
    })
  },
  //房间宽度
  dpfjkd:function(e){
    this.setData({
      dpfjkd:e.detail.value
    })
  },
  //吊顶高度
  dpddgd:function(e){
    this.setData({
      dpddgd:e.detail.value
    })
  },
  //计算
  jisuandp(){
    var that=this
    if(that.data.dpfjcd==''){
      wx.showToast({
        title: '请输入房间长度',
        icon:'none',
        duration:2000
      })
      return
    }
    if(that.data.dpfjkd==''){
      wx.showToast({
        title: '请输入房间宽度',
        icon:'none',
        duration:2000
      })
      return
    }
    if(that.data.dpddgd==''){
      wx.showToast({
        title: '请输入吊顶高度',
        icon:'none',
        duration:2000
      })
      return
    }
    var jieguodp=(Number(that.data.dpfjcd)*Number(that.data.dpfjkd))+(Number(that.data.dpfjcd)*Number(that.data.dpddgd))
    console.log(jieguodp)
    wx.navigateTo({
      url: '../jsjg/jsjg?obj='+jieguodp+'平方米'+'&oneclass=26&twoclass=74',
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