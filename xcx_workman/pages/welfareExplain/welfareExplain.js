// pages/welfareExplain/welfareExplain.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title:"",
    remark:'<div style="line-height:40px;"><h3 style="color:red;text-align:center;">万载县“劳动创造美”摄影大赛征稿启示</h3><p class="text-p">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;为更好的反映万载县一线工人的辛勤劳动，表现万载企业(商家)服务万载经济的作用，展示万载的人文风貌,推动万载经济的发展，特举办2020万载县“劳动创造美”摄影比赛。现将有关事项告示如下：<h4>一、大赛主题</h4>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;劳动创造美<h4>二、大赛规则</h4>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1、征集作品时间：2020年8月6日 至 2020年8月31日，截稿时间：2020年8月31日24:00时。<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2、投稿方式:通过微信公众号”干活佬便民网”进入摄影比赛栏目报名、上传稿件。<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3、作品征集范围：<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;①反映一线工人辛勤劳动场景的作品。<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;②表现企业(商家)服务经济发展的作品。<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;③表现万载城市风光的作品。<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;4、拍摄工具：相机、手机拍摄均可。&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<h4>三、作品要求</h4>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1、全县人民均可投稿。<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2、作品应突出大赛主题，取材于万载县境内。<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3、作品拍摄彩色、黑白不限，仅限单幅投稿，每人投稿数量不超过5幅。<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;4、投稿作品不加水印、边框，本次大赛谢绝电脑创意作品，只允许明暗、色调调整, 不得改变原始图像，不符合要求者将被取消参赛资格。&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<h4>四、作品要求</h4>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1、广大摄影家、摄影爱好者均可投稿，参赛作品相机、手机拍摄均可。<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2、作品应突出大赛主题，取材于万载县境内。<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3、作品拍摄彩色、黑白不限，仅限单幅投稿，每人投稿数量不超过5幅。<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;4、投稿作品不加水印、边框，本次大赛谢绝电脑创意作品，只允许明暗、色调调整, 不得改变原始图像，不符合要求者将被取消参赛资格。&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<h4>四、奖项设置</h4>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;大赛奖项设置：一等奖1名、二等奖2名、三等奖3名、优秀奖50名，奖励如下：<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;一等奖1名，稿酬2000元人民币，获奖者同时授予获奖证书。<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;二等奖2名，稿酬各1000元人民币，获奖者同时授予获奖证书。<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;三等奖3名，稿酬各600元人民币，获奖者同时授予获奖证书。<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;优秀奖50名，稿酬各100元人民币&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<h4>五、评选方式</h4>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;本次大赛采用：网络投票（选择投票数前100名），再由万载摄影家协会评委线下评选产生名次。&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<h4>六、结果公布</h4>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1、所有投稿作品在干活佬便民平台上发布及进行网络投票。<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2、所有获奖作品在干活佬服务平台及相关网站发布。<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3、结果公布日期为：2020年9月10日&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<h4>七、注意事项 </h4>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1、参赛者应对参赛作品拥有完整的法律权益，对参赛的合法性负责，对赛事引发的权益纠纷负责。<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2、凡入选和获奖作品，主办方有权在著作权存续期内，以复制、发行、展览、放映、信息网络传播、广告宣传等方式使用作品，不再另付报酬。<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3、 入选获奖作品均须调取大片和原图，以备核查及展览等之需。在规定时间内未提供大片和原图者，视为放弃。<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;4、影赛不收参赛费，不退稿。<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;5、本次摄影大赛解释权归主办单位。凡投稿者，即视为已同意本征稿启事之所有规定。<br/><br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;大赛组委会电话：<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;黄小姐18160753037<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;朱小姐18676298715<br/><br/></p></div>'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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