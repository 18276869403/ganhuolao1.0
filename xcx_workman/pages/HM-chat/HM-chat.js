const app      = getApp();
const RECORDER = wx.getRecorderManager(); 
const AUDIO    = wx.createInnerAudioContext();

const qingqiu = require('../../utils/request.js')
const api = require('../../utils/config.js')
const util = require('../../utils/util.js')
// pages/HM-chat/HM-chat.js

Page({

  /**
   * 页面的初始数据
   */
  data: {
    //文字消息
    textMsg:'',
    //消息列表
    isHistoryLoading:false,
    scrollAnimation:false,
    scrollTop:0,
    scrollToView:'',
    msgList:[],
    msgImgList:[],
    myuid:0,
    
    //录音相关参数
    // #ifndef H5
    //H5不能录音 
    // #endif
    isVoice:false,
    voiceTis:'按住 说话',
    recordTis:"手指上滑 取消发送",
    recording:false,
    willStop:false,
    initPoint:{identifier:0,Y:0},
    recordTimer:null,
    recordLength:0,
    
    //播放语音相关参数
    AUDIO : "",
    playMsgid:null,
    VoiceTimer:null,
    // 抽屉参数
    popupLayerClass:'',
    // more参数
    hideMore:true,
    //表情定义
    hideEmoji:true,
    emojiList:[
      [{"url":"100.gif",alt:"[微笑]"},{"url":"101.gif",alt:"[伤心]"},{"url":"102.gif",alt:"[美女]"},{"url":"103.gif",alt:"[发呆]"},{"url":"104.gif",alt:"[墨镜]"},{"url":"105.gif",alt:"[哭]"},{"url":"106.gif",alt:"[羞]"},{"url":"107.gif",alt:"[哑]"},{"url":"108.gif",alt:"[睡]"},{"url":"109.gif",alt:"[哭]"},{"url":"110.gif",alt:"[囧]"},{"url":"111.gif",alt:"[怒]"},{"url":"112.gif",alt:"[调皮]"},{"url":"113.gif",alt:"[笑]"},{"url":"114.gif",alt:"[惊讶]"},{"url":"115.gif",alt:"[难过]"},{"url":"116.gif",alt:"[酷]"},{"url":"117.gif",alt:"[汗]"},{"url":"118.gif",alt:"[抓狂]"},{"url":"119.gif",alt:"[吐]"},{"url":"120.gif",alt:"[笑]"},{"url":"121.gif",alt:"[快乐]"},{"url":"122.gif",alt:"[奇]"},{"url":"123.gif",alt:"[傲]"}],
      [{"url":"124.gif",alt:"[饿]"},{"url":"125.gif",alt:"[累]"},{"url":"126.gif",alt:"[吓]"},{"url":"127.gif",alt:"[汗]"},{"url":"128.gif",alt:"[高兴]"},{"url":"129.gif",alt:"[闲]"},{"url":"130.gif",alt:"[努力]"},{"url":"131.gif",alt:"[骂]"},{"url":"132.gif",alt:"[疑问]"},{"url":"133.gif",alt:"[秘密]"},{"url":"134.gif",alt:"[乱]"},{"url":"135.gif",alt:"[疯]"},{"url":"136.gif",alt:"[哀]"},{"url":"137.gif",alt:"[鬼]"},{"url":"138.gif",alt:"[打击]"},{"url":"139.gif",alt:"[bye]"},{"url":"140.gif",alt:"[汗]"},{"url":"141.gif",alt:"[抠]"},{"url":"142.gif",alt:"[鼓掌]"},{"url":"143.gif",alt:"[糟糕]"},{"url":"144.gif",alt:"[恶搞]"},{"url":"145.gif",alt:"[什么]"},{"url":"146.gif",alt:"[什么]"},{"url":"147.gif",alt:"[累]"}],
      [{"url":"148.gif",alt:"[看]"},{"url":"149.gif",alt:"[难过]"},{"url":"150.gif",alt:"[难过]"},{"url":"151.gif",alt:"[坏]"},{"url":"152.gif",alt:"[亲]"},{"url":"153.gif",alt:"[吓]"},{"url":"154.gif",alt:"[可怜]"},{"url":"155.gif",alt:"[刀]"},{"url":"156.gif",alt:"[水果]"},{"url":"157.gif",alt:"[酒]"},{"url":"158.gif",alt:"[篮球]"},{"url":"159.gif",alt:"[乒乓]"},{"url":"160.gif",alt:"[咖啡]"},{"url":"161.gif",alt:"[美食]"},{"url":"162.gif",alt:"[动物]"},{"url":"163.gif",alt:"[鲜花]"},{"url":"164.gif",alt:"[枯]"},{"url":"165.gif",alt:"[唇]"},{"url":"166.gif",alt:"[爱]"},{"url":"167.gif",alt:"[分手]"},{"url":"168.gif",alt:"[生日]"},{"url":"169.gif",alt:"[电]"},{"url":"170.gif",alt:"[炸弹]"},{"url":"171.gif",alt:"[刀子]"}],
      [{"url":"172.gif",alt:"[足球]"},{"url":"173.gif",alt:"[瓢虫]"},{"url":"174.gif",alt:"[翔]"},{"url":"175.gif",alt:"[月亮]"},{"url":"176.gif",alt:"[太阳]"},{"url":"177.gif",alt:"[礼物]"},{"url":"178.gif",alt:"[抱抱]"},{"url":"179.gif",alt:"[拇指]"},{"url":"180.gif",alt:"[贬低]"},{"url":"181.gif",alt:"[握手]"},{"url":"182.gif",alt:"[剪刀手]"},{"url":"183.gif",alt:"[抱拳]"},{"url":"184.gif",alt:"[勾引]"},{"url":"185.gif",alt:"[拳头]"},{"url":"186.gif",alt:"[小拇指]"},{"url":"187.gif",alt:"[拇指八]"},{"url":"188.gif",alt:"[食指]"},{"url":"189.gif",alt:"[ok]"},{"url":"190.gif",alt:"[情侣]"},{"url":"191.gif",alt:"[爱心]"},{"url":"192.gif",alt:"[蹦哒]"},{"url":"193.gif",alt:"[颤抖]"},{"url":"194.gif",alt:"[怄气]"},{"url":"195.gif",alt:"[跳舞]"}],
      [{"url":"196.gif",alt:"[发呆]"},{"url":"197.gif",alt:"[背着]"},{"url":"198.gif",alt:"[伸手]"},{"url":"199.gif",alt:"[耍帅]"},{"url":"200.png",alt:"[微笑]"},{"url":"201.png",alt:"[生病]"},{"url":"202.png",alt:"[哭泣]"},{"url":"203.png",alt:"[吐舌]"},{"url":"204.png",alt:"[迷糊]"},{"url":"205.png",alt:"[瞪眼]"},{"url":"206.png",alt:"[恐怖]"},{"url":"207.png",alt:"[忧愁]"},{"url":"208.png",alt:"[眨眉]"},{"url":"209.png",alt:"[闭眼]"},{"url":"210.png",alt:"[鄙视]"},{"url":"211.png",alt:"[阴暗]"},{"url":"212.png",alt:"[小鬼]"},{"url":"213.png",alt:"[礼物]"},{"url":"214.png",alt:"[拜佛]"},{"url":"215.png",alt:"[力量]"},{"url":"216.png",alt:"[金钱]"},{"url":"217.png",alt:"[蛋糕]"},{"url":"218.png",alt:"[彩带]"},{"url":"219.png",alt:"[礼物]"},]				
    ],
    //表情图片图床名称 ，由于我上传的第三方图床名称会有改变，所以有此数据来做对应，您实际应用中应该不需要
    onlineEmoji:{"100.gif":"AbNQgA.gif","101.gif":"AbN3ut.gif","102.gif":"AbNM3d.gif","103.gif":"AbN8DP.gif","104.gif":"AbNljI.gif","105.gif":"AbNtUS.gif","106.gif":"AbNGHf.gif","107.gif":"AbNYE8.gif","108.gif":"AbNaCQ.gif","109.gif":"AbNN4g.gif","110.gif":"AbN0vn.gif","111.gif":"AbNd3j.gif","112.gif":"AbNsbV.gif","113.gif":"AbNwgs.gif","114.gif":"AbNrD0.gif","115.gif":"AbNDuq.gif","116.gif":"AbNg5F.gif","117.gif":"AbN6ET.gif","118.gif":"AbNcUU.gif","119.gif":"AbNRC4.gif","120.gif":"AbNhvR.gif","121.gif":"AbNf29.gif","122.gif":"AbNW8J.gif","123.gif":"AbNob6.gif","124.gif":"AbN5K1.gif","125.gif":"AbNHUO.gif","126.gif":"AbNIDx.gif","127.gif":"AbN7VK.gif","128.gif":"AbNb5D.gif","129.gif":"AbNX2d.gif","130.gif":"AbNLPe.gif","131.gif":"AbNjxA.gif","132.gif":"AbNO8H.gif","133.gif":"AbNxKI.gif","134.gif":"AbNzrt.gif","135.gif":"AbU9Vf.gif","136.gif":"AbUSqP.gif","137.gif":"AbUCa8.gif","138.gif":"AbUkGQ.gif","139.gif":"AbUFPg.gif","140.gif":"AbUPIS.gif","141.gif":"AbUZMn.gif","142.gif":"AbUExs.gif","143.gif":"AbUA2j.gif","144.gif":"AbUMIU.gif","145.gif":"AbUerq.gif","146.gif":"AbUKaT.gif","147.gif":"AbUmq0.gif","148.gif":"AbUuZV.gif","149.gif":"AbUliF.gif","150.gif":"AbU1G4.gif","151.gif":"AbU8z9.gif","152.gif":"AbU3RJ.gif","153.gif":"AbUYs1.gif","154.gif":"AbUJMR.gif","155.gif":"AbUadK.gif","156.gif":"AbUtqx.gif","157.gif":"AbUUZ6.gif","158.gif":"AbUBJe.gif","159.gif":"AbUdIO.gif","160.gif":"AbU0iD.gif","161.gif":"AbUrzd.gif","162.gif":"AbUDRH.gif","163.gif":"AbUyQA.gif","164.gif":"AbUWo8.gif","165.gif":"AbU6sI.gif","166.gif":"AbU2eP.gif","167.gif":"AbUcLt.gif","168.gif":"AbU4Jg.gif","169.gif":"AbURdf.gif","170.gif":"AbUhFS.gif","171.gif":"AbU5WQ.gif","172.gif":"AbULwV.gif","173.gif":"AbUIzj.gif","174.gif":"AbUTQs.gif","175.gif":"AbU7yn.gif","176.gif":"AbUqe0.gif","177.gif":"AbUHLq.gif","178.gif":"AbUOoT.gif","179.gif":"AbUvYF.gif","180.gif":"AbUjFU.gif","181.gif":"AbaSSJ.gif","182.gif":"AbUxW4.gif","183.gif":"AbaCO1.gif","184.gif":"Abapl9.gif","185.gif":"Aba9yR.gif","186.gif":"AbaFw6.gif","187.gif":"Abaiex.gif","188.gif":"AbakTK.gif","189.gif":"AbaZfe.png","190.gif":"AbaEFO.gif","191.gif":"AbaVYD.gif","192.gif":"AbamSH.gif","193.gif":"AbaKOI.gif","194.gif":"Abanld.gif","195.gif":"Abau6A.gif","196.gif":"AbaQmt.gif","197.gif":"Abal0P.gif","198.gif":"AbatpQ.gif","199.gif":"Aba1Tf.gif","200.png":"Aba8k8.png","201.png":"AbaGtS.png","202.png":"AbaJfg.png","203.png":"AbaNlj.png","204.png":"Abawmq.png","205.png":"AbaU6s.png","206.png":"AbaaXn.png","207.png":"Aba000.png","208.png":"AbarkT.png","209.png":"AbastU.png","210.png":"AbaB7V.png","211.png":"Abafn1.png","212.png":"Abacp4.png","213.png":"AbayhF.png","214.png":"Abag1J.png","215.png":"Aba2c9.png","216.png":"AbaRXR.png","217.png":"Aba476.png","218.png":"Abah0x.png","219.png":"Abdg58.png"},
    //红包相关参数
    windowsState:'',
    redenvelopeData:{
      rid:null,	//红包ID
      from:null,
      face:null,
      blessing:null,
      money:null
		},
		toUserId : -1,
		toUserName : "",
		user : {},
		lastMsgId : -1,
		toUserInfo : {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {  
		wx.showShareMenu({
      withShareTicket: true
    })
			console.log(options)
			this.setData({
				toUserId : options.id,
				toUserName : options.name
			});
			wx.setNavigationBarTitle({
				title : options.name + " - 在线沟通"
			});
    	this.getMsgList();
			//语音自然播放结束
			AUDIO.onEnded((res)=>{
				this.playMsgid=null;
			});
			AUDIO.onPlay(() => { AUDIO.offCanplay() });
			AUDIO.onEnded(() => { wx.hideLoading() });//我这里不用 onstop
			// #ifndef H5
			//录音开始事件
			RECORDER.onStart((e)=>{
				this.recordBegin(e);
			})
			//录音结束事件
			RECORDER.onStop((e)=>{
				this.recordEnd(e);
			})
			RECORDER.onError((res) => {
				wx.showToast({ 
					title: '录音时发生错误,请检查是否给麦克风授权',
					icon:'none'
				})
			})
			
			// #endif
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
    this.data.scrollTop = 9999999;
			
			//模板借由本地缓存实现发红包效果，实际应用中请不要使用此方法。
			//
			// wx.getStorage({
			// 	key: 'redEnvelopeData',
			// 	success:  (res)=>{
			// 		console.log(res.data);
			// 		let nowDate = new Date();
			// 		let lastid = this.data.msgList[this.data.msgList.length-1].msg.id;
			// 		lastid++;
			// 		let row = {type:"user",msg:{id:lastid,type:"redEnvelope",time:nowDate.getHours()+":"+nowDate.getMinutes(),userinfo:{uid:0,username:"大黑哥",face:"/static/img/face.jpg"},content:{blessing:res.data.blessing,rid:Math.floor(Math.random()*1000+1),isReceived:false}}};
			// 		this.screenMsg(row);
			// 		wx.removeStorage({key: 'redEnvelopeData'});
			// 	}
			// });
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

  },
  // 接受消息(筛选处理)
			screenMsg(msg){
				//从长连接处转发给这个方法，进行筛选处理
				// if(msg.type=='system'){
				// 	// 系统消息
				// 	switch (msg.msg.type){
				// 		case 'text':
				// 			this.addSystemTextMsg(msg);
				// 			break;
				// 		case 'redEnvelope':
				// 			this.addSystemRedEnvelopeMsg(msg);
				// 			break;
				// 	}
				// }else if(msg.type=='user'){
					// 用户消息
					msg.userinfo = {
						id : this.data.user.id,
						username : this.data.user.wxNc,
						face : this.data.user.picUrl,
					};  
					msg.toUserinfo = {
						id : this.data.toUserInfo.id,
						username : this.data.toUserInfo.wxNc,
						face : this.data.toUserInfo.picUrl,
					}; 
					switch (msg.type){
						case 'text':
							this.addTextMsg(msg);
							break;
						case 'voice':
							this.addVoiceMsg(msg);
							break;
						case 'img':
							this.addImgMsg(msg);
							break;
						case 'redEnvelope':
							this.addRedEnvelopeMsg(msg);
							break;
					}
					// console.log('用户消息');
					//非自己的消息震动
					if(msg.userId != this.data.myuid){
						console.log('振动');
						wx.vibrateLong(); 
					}
				// }
				wx.nextTick(()=> {
					// 滚动到底
					this.setData({
						scrollToView : 'msg' + msg.id 
					})
				});
			},
			
			//触发滑动到顶部(加载历史信息记录)
			loadHistory(e){
				if(this.data.isHistoryLoading){
					return ;
				}
				this.setData({
					isHistoryLoading : true,//参数作为进入请求标识，防止重复请求
					scrollAnimation  : false //关闭滑动动画
				}) 
				qingqiu.get(api.im.imList,{
					toUserId : this.data.toUserId,
					userId   : app.globalData.wxid,
					lastId   : this.data.lastMsgId
				},res =>{
					// console.log("消息列表", res);
					var list = res.result.pageList;
					if(list.length > 0){

						list = list.reverse();

						var userInfo   = res.result.userInfo;
						var toUserInfo = res.result.toUserInfo;
	
						this.setData({
							user : userInfo,
							myuid : userInfo.id,
							toUserInfo : toUserInfo
						});
	
						// 获取消息中的图片,并处理显示尺寸
						var msgImgList = []; 
						var lastMsgId  = -1;
						for(let i = 0; i < list.length; i++){
							var imObj = list[i];
	
							if(lastMsgId == -1){
								lastMsgId = imObj.id;
							}
	
							imObj.time = imObj.createTime;
							imObj.content = JSON.parse(imObj.content); 
							imObj.userinfo = {
								id : userInfo.id,
								username : userInfo.wxNc,
								face : userInfo.picUrl,
							};  
							imObj.toUserinfo = {
								id : toUserInfo.id,
								username : toUserInfo.wxNc,
								face : toUserInfo.picUrl,
							}; 
							if(imObj.type == "img"){
								imObj.content = this.setPicSize(imObj.content);
								msgImgList.push(imObj.content.url);
							} 
						}
						this.setData({
							msgImgList : msgImgList.concat(this.data.msgImgList),
							msgList : list.concat(this.data.msgList),
							lastMsgId : lastMsgId
						})  
					}
					this.setData({
						isHistoryLoading : false,//参数作为进入请求标识，防止重复请求
						scrollAnimation  : false //关闭滑动动画
					}) 
				}); 
			},
			
  onUser: function(cb) {
    var that = this
    wx.login({
      success: function(res) {
        qingqiu.get("getKeyInfo", {
          code: res.code
        }, function(re) {
          app.globalData.wxid = re.result.wxUser.id
          if (re.result.wxUser.picUrl != null && re.result.wxUser.picUrl.length > 0) {
            app.globalData.sqgl = 1
          }
          app.globalData.openid = re.result.openId
					app.globalData.wxState = re.result.wxUser.wxState
					if(cb){
						cb();
					}
        }, "POST")
      }
    })
  },
			// 加载初始页面消息
			getMsgList(){ 
				// 创建websocket链接
				if(app.globalData.wxid){
					this.createWebsocket(app.globalData.wxid);
				} else {
					this.onUser(res=>{
						this.getMsgList
					});
					return;
				}
				this.setData({
					isHistoryLoading : true,//参数作为进入请求标识，防止重复请求
					scrollAnimation  : false //关闭滑动动画
				}) 
				qingqiu.get(api.im.imList,{
					toUserId : this.data.toUserId,
					userId : app.globalData.wxid 
				},res =>{
					// console.log("消息列表", res);
					var list = res.result.pageList;
					list = list.reverse();

					var userInfo   = res.result.userInfo;
					var toUserInfo = res.result.toUserInfo;

					this.setData({
						user : userInfo,
						myuid : userInfo.id
					});

					// 获取消息中的图片,并处理显示尺寸
					var msgImgList = []; 
					var lastMsgId  = -1;
					for(let i = 0; i < list.length; i++){
						var imObj = list[i];

						if(lastMsgId == -1){
							lastMsgId = imObj.id;
						}

						imObj.time = imObj.createTime;
						imObj.content = JSON.parse(imObj.content); 
						imObj.userinfo = {
							id : userInfo.id,
							username : userInfo.wxNc,
							face : userInfo.picUrl,
						};  
						imObj.toUserinfo = {
							id : toUserInfo.id,
							username : toUserInfo.wxNc,
							face : toUserInfo.picUrl,
						}; 
						if(imObj.type == "img"){
							imObj.content = this.setPicSize(imObj.content);
							msgImgList.push(imObj.content.url);
						} 
					}
					this.setData({
						msgImgList : msgImgList,
						msgList : list,
						lastMsgId : lastMsgId
					}) 
					// 滚动到底部
					wx.nextTick(()=> {
						//进入页面滚动到底部 
						this.setData({
							scrollTop : 9999,
							scrollAnimation : true, 
							isHistoryLoading : false 
						}); 
					}); 
				}); 
				// // 消息列表
				// let list = [
				// 	{type:"system",msg:{id:0,type:"text",content:{text:"创建连接成功"}}},
				// 	{type:"user",msg:{id:1,type:"text",time:"12:56",userinfo:{uid:0,username:"大黑哥",face:"/static/img/face.jpg"},content:{text:"为什么温度会相差那么大？"}}},
				// 	{type:"user",msg:{id:2,type:"text",time:"12:57",userinfo:{uid:1,username:"售后客服008",face:"/static/img/im/face/face_2.jpg"},content:{text:"这个是有偏差的，两个温度相差十几二十度是很正常的，如果相差五十度，那即是质量问题了。"}}},
				// 	{type:"user",msg:{id:3,type:"voice",time:"12:59",userinfo:{uid:1,username:"售后客服008",face:"/static/img/im/face/face_2.jpg"},content:{url:"/static/voice/1.mp3",length:"00:06"}}},
				// 	{type:"user",msg:{id:4,type:"voice",time:"13:05",userinfo:{uid:0,username:"大黑哥",face:"/static/img/face.jpg"},content:{url:"/static/voice/2.mp3",length:"00:06"}}},
				// 	{type:"user",msg:{id:5,type:"img",time:"13:05",userinfo:{uid:0,username:"大黑哥",face:"/static/img/face.jpg"},content:{url:"/static/img/p10.jpg",w:200,h:200}}},
				// 	{type:"user",msg:{id:6,type:"img",time:"12:59",userinfo:{uid:1,username:"售后客服008",face:"/static/img/im/face/face_2.jpg"},content:{url:"/static/img/q.jpg",w:1920,h:1080}}},
				// 	// {type:"system",msg:{id:7,type:"text",content:{text:"欢迎进入HM-chat聊天室"}}},
					
				// 	// {type:"system",msg:{id:9,type:"redEnvelope",content:{text:"售后客服008领取了你的红包"}}},
				// 	// {type:"user",msg:{id:10,type:"redEnvelope",time:"12:56",userinfo:{uid:0,username:"大黑哥",face:"/static/img/face.jpg"},content:{blessing:"恭喜发财，大吉大利，万事如意",rid:0,isReceived:false}}},
				// 	// {type:"user",msg:{id:11,type:"redEnvelope",time:"12:56",userinfo:{uid:1,username:"售后客服008",face:"/static/img/im/face/face_2.jpg"},content:{blessing:"恭喜发财",rid:1,isReceived:false}}},
				// ]
				// // 获取消息中的图片,并处理显示尺寸
				// var msgImgList = [];
				// for(let i=0;i<list.length;i++){
				// 	if(list[i].type=='user'&&list[i].msg.type=="img"){
				// 		list[i].msg.content = this.setPicSize(list[i].msg.content);
				// 		msgImgList.push(list[i].msg.content.url);
				// 	} 
				// }
				// this.setData({
				// 	msgImgList : msgImgList,
				// 	msgList : list
				// }) 
				// // 滚动到底部
				// wx.nextTick(()=> {
				// 	//进入页面滚动到底部 
				// 	this.setData({
				// 		scrollTop : 9999
				// 	});
				// 	wx.nextTick(()=> { 
				// 		this.setData({
				// 			scrollAnimation : true
				// 		});
				// 	});
					
				// });
			},
			//处理图片尺寸，如果不处理宽高，新进入页面加载图片时候会闪
			setPicSize(content){
				// 让图片最长边等于设置的最大长度，短边等比例缩小，图片控件真实改变，区别于aspectFit方式。
				let maxW = 350;//wx.upx2px(350);//350是定义消息图片最大宽度
				let maxH = 350;//wx.upx2px(350);//350是定义消息图片最大高度
				if(content.w>maxW||content.h>maxH){
					let scale = content.w/content.h;
					content.w = scale>1?maxW:maxH*scale;
					content.h = scale>1?maxW/scale:maxH;
				}
				return content;
			},
			
			//更多功能(点击+弹出) 
			showMore(){  
				this.setData({
					isVoice : false,
					hideEmoji : true
				});
				if(this.data.hideMore){  
					this.setData({
						hideMore : false 
					});
					this.openDrawer();
				}else{
					this.hideDrawer();
				}
			},
			// 打开抽屉
			openDrawer(){ 
				this.setData({
					popupLayerClass : "showLayer"
				});
			},
			// 隐藏抽屉
			hideDrawer(){ 
				this.setData({
					popupLayerClass : ""
				}); 
				setTimeout(()=>{ 
					this.setData({
						hideMore : true,
						hideEmoji : true
					}); 
				},150);
			},
			// 选择图片发送
			chooseImage(){
				this.getImage('album');
			},
			//拍照发送
			camera(){
				this.getImage('camera');
			},
			//发红包
			handRedEnvelopes(){
				wx.navigateTo({
					url:'HM-hand/HM-hand'
				});
				this.hideDrawer();
			},
			//选照片 or 拍照
			getImage(type){
				this.hideDrawer();
				wx.chooseImage({
					sourceType:[type],
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					success: (res)=>{
						for(let i=0;i<res.tempFilePaths.length;i++){
							wx.getImageInfo({
								src: res.tempFilePaths[i],
								success: (image)=>{
									// console.log(image.width);
									// console.log(image.height);
									wx.uploadFile({
										filePath: res.tempFilePaths[i],
										header : {
											"Content-type" : "multipart/form-data"
										},
										name: 'file',
										url: api.im.upload, 
										complete : ret=>{ 
											if(ret.data){ 
												ret.data = JSON.parse(ret.data);
												let msg  = {url: api.im.viewUrl + ret.data.message,w:image.width,h:image.height};
												this.sendMsg(msg,'img');
											}
										}
									})
								}
							});
						}
					}
				});
			},
			// 选择表情
			chooseEmoji(){ 
				this.setData({
					hideMore : true 
				});  
				if(this.data.hideEmoji){ 
					this.setData({
						hideEmoji : false 
					});  
					this.openDrawer();
				}else{
					this.hideDrawer();
				}
			},
			//添加表情
			addEmoji(e){ 
				var em = e.currentTarget.dataset.em;
				this.setData({
					textMsg : this.data.textMsg + em.alt
				});  
			},
			
			//获取焦点，如果不是选表情ing,则关闭抽屉
			textareaFocus(){
				if(this.data.popupLayerClass=='showLayer' && this.data.hideMore == false){
					this.hideDrawer();
				}
			},
			textMsgInput(e){
				this.setData({
					textMsg : e.detail.value
				})
			},
			textMsgInputblur:function(e){
				var that = this
				qingqiu.messageReg(e.detail.value,0,function(res){
					console.log('回调函数',res)
					if(res == 87014){
						that.setData({
							textMsg:''
						})
						wx.showToast({
							title: '内容包含敏感词，请重新输入...',
							icon:'none',
							duration:2000
						})
						return
					}
				},'POST')
			},
			// 发送文字消息
			sendText(){
				var that=this
				that.hideDrawer();//隐藏抽屉
				if(!that.data.textMsg){
					return;
				}
				qingqiu.messageReg(that.data.textMsg,0,function(res){
					console.log('回调函数',res)
					if(res == 87014){
						that.setData({
							textMsg:''
						})
						wx.showToast({
							title: '内容包含敏感词，请重新输入...',
							icon:'none',
							duration:2000
						})
						return
					}else{
						let content = that.replaceEmoji(that.data.textMsg);
						let msg = {text:content}
						that.sendMsg(msg,'text'); 
						that.setData({
							textMsg : ""
						}); 
					}
				},'POST')
				// let content = this.replaceEmoji(this.data.textMsg);
				// let msg = {text:content}
				// this.sendMsg(msg,'text'); 
				// this.setData({
				// 	textMsg : ""
				// });  
			},
			//替换表情符号为图片
			replaceEmoji(str){
				let replacedStr = str.replace(/\[([^(\]|\[)]*)\]/g,(item, index)=>{
					console.log("item: " + item);
					for(let i=0;i<this.data.emojiList.length;i++){
						let row = this.data.emojiList[i];
						for(let j=0;j<row.length;j++){
							let EM = row[j];
							if(EM.alt==item){
								//在线表情路径，图文混排必须使用网络路径，请上传一份表情到你的服务器后再替换此路径 
								//比如你上传服务器后，你的100.gif路径为https://www.xxx.com/emoji/100.gif 则替换onlinePath填写为https://www.xxx.com/emoji/
								// let onlinePath = 'http://192.168.1.235:8080/work-boot/sys/common/view/static/img/emoji/'
								let onlinePath = 'http://miss.it-ys.com:9123/work-boot/sys/common/view/static/img/emoji/'
								// let imgstr = '<img src="'+onlinePath+this.data.onlineEmoji[EM.url]+'">';
								let imgstr = '<img src="'+onlinePath+EM.url+'">';
								console.log("imgstr: " + imgstr);
								return imgstr;
							}
						}
					}
				});
				return '<div style="display: flex;align-items: center;word-wrap:break-word;">'+replacedStr+'</div>';
			},
			
			// 发送消息
			sendMsg(content,type){ 
				// 发送：消息内容
				var msg = {
					toUserId : this.data.toUserId,
					userId   : this.data.user.id,
					content  : JSON.stringify(content),
					type : type
				};
				var obj = {
					wxUserId:this.data.toUserId
				}
				console.log(this.data.toUserId)
				debugger
				qingqiu.get("getPublicUserById",obj,function(res){
					console.log(res)
					// var unionid = res.result.unionid
					var openid = res.result.openid
					var mesdata = {
						first:{
							value:"干活佬有人联系您啦！",
							color:"#173177"
						},
						keyword1:{
							value:"有人在线给你留言了，注意查看！",
							color:"#173177"
						},
						keyword2:{
							value:util.nowTime(),
							color:"#173177"
						},
						remark:{
							value:"干活佬,助力工人/商家接单！",
							color:"#173177"
						}
					}
					var objdata = {
						touser:openid,
						template_id:"JOX1BcyAiT8BbZdmlB3fAfwzOT5Ud25Tl_WjTDM1ycY",
						miniprogram:{
							appid:"wx14e076d27e942480"
						},
						url:"http://www.baidu.com/",
						data:mesdata
					}
					wx.request({
						url: 'https://api.weixin.qq.com/cgi-bin/message/template/send?access_token='+app.globalData.access_TokenOff,
						data:objdata,
						method:'POST',
						success:function(res){
							console.log(res)
						}
					})
				})
				wx.request({
					url: api.im.imSend,
					data : msg,
					method : "POST",
					success : res=>{ 
						var recMsg = res.data.result;
						recMsg.content = JSON.parse(recMsg.content);
						this.screenMsg(recMsg); 
					}
				});
			},
			
			// 添加文字消息到列表
			addTextMsg(msg){
				this.data.msgList.push(msg); 
				this.setData({
					msgList : this.data.msgList
				});  
			},
			// 添加语音消息到列表
			addVoiceMsg(msg){
				this.data.msgList.push(msg); 
				this.setData({
					msgList : this.data.msgList
				});  
			},
			// 添加图片消息到列表
			addImgMsg(msg){ 
				console.log(msg) 
				msg.content = this.setPicSize(msg.content);
				this.data.msgImgList.push(msg.content.url);
				this.data.msgList.push(msg);
				this.setData({
					msgList : this.data.msgList
				});  
			},
			addRedEnvelopeMsg(msg){
				this.data.msgList.push(msg);
				this.setData({
					msgList : this.data.msgList
				});  
			},
			// 添加系统文字消息到列表
			addSystemTextMsg(msg){
				this.data.msgList.push(msg);
				this.setData({
					msgList : this.data.msgList
				});  
			},
			// 添加系统红包消息到列表
			addSystemRedEnvelopeMsg(msg){
				this.data.msgList.push(msg);
				this.setData({
					msgList : this.data.msgList
				});  
			},
			// 打开红包
			openRedEnvelope(msg,index){
				let rid = msg.content.rid;
				wx.showLoading({
					title:'加载中...'
				});
				console.log("index: " + index);
				//模拟请求服务器效果
				setTimeout(()=>{
					//加载数据
					if(rid==0){
						this.redenvelopeData={
							rid:0,	//红包ID
							from:"大黑哥",
							face:"/static/img/im/face/face.jpg",
							blessing:"恭喜发财，大吉大利",
							money:"已领完"
						}
					}else{
						this.redenvelopeData={
							rid:1,	//红包ID
							from:"售后客服008",
							face:"/static/img/im/face/face_2.jpg",
							blessing:"恭喜发财",
							money:"0.01"
						}
						if(!msg.content.isReceived){
							// {type:"system",msg:{id:8,type:"redEnvelope",content:{text:"你领取了售后客服008的红包"}}},
							this.sendSystemMsg({text:"你领取了"+(msg.userinfo.uid==this.myuid?"自己":msg.userinfo.username)+"的红包"},'redEnvelope');
							console.log("this.msgList[index]: " + JSON.stringify(this.msgList[index]));
							this.data.msgList[index].msg.content.isReceived = true; 
							this.setData({
								msgList : this.data.msgList
							});  
						}
					}
					wx.hideLoading(); 
					this.setData({
						windowsState : "show"
					});  
				},200)
				
			},
			// 关闭红包弹窗
			closeRedEnvelope(){
				this.setData({
					windowsState : "hide"
				});   
				setTimeout(()=>{ 
					this.setData({
						windowsState : ""
					});   
				},200)
			},
			sendSystemMsg(content,type){
				let lastid = this.msgList[this.msgList.length-1].msg.id;
				lastid++;
				let row = {type:"system",msg:{id:lastid,type:type,content:content}};
				this.screenMsg(row)
			},
			//领取详情
			toDetails(rid){
				wx.navigateTo({
					url:'HM-details/HM-details?rid='+rid
				})
			},
			// 预览图片
			showPic(e){
				var msg = e.currentTarget.dataset.msg;
				wx.previewImage({
					indicator:"none",
					current:msg.content.url,
					urls: this.data.msgImgList
				});
			},
			// 播放语音
			playVoice(e){ 
				var msg = e.currentTarget.dataset.msg;
				console.log(msg)
				this.setData({
					playMsgid : msg.id,
					AUDIO : msg.content.url
				});  
				// AUDIO.onError = (e)=>{
				// 	console.log("语音播放失败", e);
				// }
				// AUDIO.src   = msg.content.url;
				// AUDIO.title = "语音留言";
				// AUDIO.autoplay = true;
				//  wx.nextTick(()=>{ 
				// 	AUDIO.play();
				//  });
				
			// 	if( AUDIO.src == msg.content.url ){ 
			// 		AUDIO.play(); 
			// 	} else { //不一致时 要用 onCanplay 才不会报错和出奇怪的问题 
			// 		AUDIO.src = msg.content.url ; 
			// 		AUDIO.onCanplay(() => { 
			// 			AUDIO.play(); 
			// 	  }) 
			// }

				// 背景播放
				var am   = wx.getBackgroundAudioManager();
				am.src   =  msg.content.url;
				am.onError = function(ex){
					console.log(ex);
				} 
				am.title =  "语音留言";
				am.play();  
			},
			// 录音开始
			voiceBegin(e){
				if(e.touches.length>1){
					return ;
				}
				this.data.initPoint.Y = e.touches[0].clientY;
				this.data.initPoint.identifier = e.touches[0].identifier;
				
				this.setData({
					initPoint : this.data.initPoint,
					initPoint : this.data.initPoint
				}); 
				RECORDER.start({  
						// format: 'aac' 
						format: 'wav'
						// format: 'mp3' 
				});//录音开始, 
			},
			//录音开始UI效果
			recordBegin(e){ 
				var recordTimer = setInterval(()=>{ 
					this.setData({
						recordLength : this.data.recordLength + 1
					});
				},1000)
				this.setData({
					recording : true,
					voiceTis  : '松开 结束',
					recordLength : 0,
					recordTimer : recordTimer
				}); 
			},
			// 录音被打断
			voiceCancel(){ 
				this.setData({
					recording : false,
					voiceTis  : '按住 说话',
					recordTis : '手指上滑 取消发送',
					willStop  : true,
					recordTimer : this.data.recordTimer
				});  
				RECORDER.stop();//录音结束
			},
			// 录音中(判断是否触发上滑取消发送)
			voiceIng(e){
				if(!this.data.recording){
					return;
				}
				let touche = e.touches[0];
				//上滑一个导航栏的高度触发上滑取消发送
				if(this.data.initPoint.Y - touche.clientY>=wx.upx2px(100)){
					this.setData({
						recordTis : '松开手指 取消发送',
						willStop  : true
					});  
				}else{
					this.setData({
						recordTis : '手指上滑 取消发送',
						willStop  : false
					});   
				}
			},
			// 结束录音
			voiceEnd(e){
				if(!this.data.recording){
					return;
				}
				
				this.setData({
					recordTis : '按住 说话',
					willStop  : false,
			  	recordTis : '手指上滑 取消发送'
				}); 
				RECORDER.stop();//录音结束
			},
			//录音结束(回调文件)
			recordEnd(e){
				clearInterval(this.data.recordTimer);
				if(!this.data.willStop){
					console.log("e: " + JSON.stringify(e));
					let msg = {
						length:0,
						url : e.tempFilePath
					}
					let min = parseInt(this.data.recordLength/60);
					let sec = this.data.recordLength%60;
					min = min<10?'0'+min:min;
					sec = sec<10?'0'+sec:sec;
					msg.length = min+':'+sec;

					 // 上传语言
					 wx.uploadFile({
						filePath: msg.url,
						header : {
							"Content-type" : "multipart/form-data"
						},
						name: 'file',
						url: api.im.upload, 
						complete : ret=>{ 
							if(ret.data){ 
								ret.data = JSON.parse(ret.data); 
								msg.url  = api.im.viewUrl + ret.data.message;
								this.sendMsg(msg, 'voice');
							}
						}
					})
				}else{
					console.log('取消发送录音');
				} 
				this.setData({
					recording : false,
					voiceTis  : '按住 说话',
					willStop  : false,
				}); 
			},
			// 切换语音/文字输入
			switchVoice(){
				this.hideDrawer(); 
				this.setData({
					isVoice  : this.data.isVoice ? false : true
				}); 
			},
			discard(){
				return;
			},
			createWebsocket(userId){
				 //本地测试使用 ws协议 ,正式上线使用 wss 协议
					var url = api.im.imReceive + userId;
					var wxst = wx.connectSocket({
						url: url,
						method: "GET"
					});
					wxst.onOpen(res => {
						console.info('连接打开成功');
					});
					wxst.onError(res => {
						console.info('链接异常');
						console.error(res);
					});
					wxst.onMessage(res => {
						var data = res.data;
						data = JSON.parse(data);
						data.content = JSON.parse(data.content);
						//console.info(data);
						this.screenMsg(data);
					});
					wxst.onClose(() => {
						console.info('连接关闭');
						setTimeout(() => {
							// 断开自动重连
							this.createWebsocket(userId);
						}, 500);
					}); 
			}
})