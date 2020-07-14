/**
 * 数据请求
 */
const app = getApp()
var api = require('./config.js')
const Get = function(url, data, huidiao, method = 'GET') {
	// console.log('UserAuthorization:' + wx.getStorageSync('yrzuser'))
	var auth = wx.getStorageSync('yrzuser') != null ? wx.getStorageSync('yrzuser').access_token : ''
		var geturl = ""
	if (api[url] != null) {
		geturl = api[url]
	} else if (api.deng[url] != null) {
		geturl = api.deng[url]
	} else if (api.zhu[url] != null) {
		geturl = api.zhu[url]
	} else {
		geturl = url;
	}
	// console.log(geturl)
	wx.request({
		url: geturl,
		method: method,
		dataType: "json",
		data: data,
		sslVerify: false,
		header: {
			"Content-Type": "application/x-www-form-urlencoded",
			'Authorization': auth
		},
		success: function(res) {
			if (res.statusCode == 401) {
				huidiao("用户需要重新登入")
				wx.removeStorageSync('yrzuser');
			} else {
				huidiao(res.data)
			}
		},
		fail(e) {
			console.log(e)
		}
	}, 1000)
}

const yanzheng = function(str){
	var strlist = str.split('|')
	for(let obj of strlist){
		var list = obj.split(',')
		if(list[0] == ""||list[0]==0||list[0]==undefined||list[0]==null){
			return list[1]
		}
	}
	return 0
}
// str/敏感词 type/类别(0/文字,1/图片,2/视频)
const messageReg = function(str,type,huidiao, method = 'POST'){
	if(type == 0){
		wx.request({
			url:'https://api.weixin.qq.com/wxa/msg_sec_check?access_token=' + app.globalData.access_Token,
			method:method,
			data:{content:str},
			success:function(res){
				console.log('敏感词信息',res)
				huidiao(res.data.errcode) 
			}
		})
	}else if(type ==1){
		wx.uploadFile({
			url:'https://api.weixin.qq.com/wxa/img_sec_check?access_token=' + app.globalData.access_Token,
			name: 'file',
			filePath: str[0],
			formData:{
				media:str[0]
			},
			method:method,
			header:{
				"Content-Type": "multipart/form-data" 
			},
			success:function(res){
				huidiao(res)
			}
		})
	}else{

	}
}
// 公众号消息推送
const messagePush = function(url,data,huidiao,method='GET'){
	wx.request({
		url: url,
		method: method,
		data: data,
		success: function(res) {
			if (res.statusCode == 401) {
				huidiao("消息模板推送失败")
			} else {
				huidiao(res.data)
			}
		},
		fail(e) {
			console.log(e)
		}
	}, 1000)
}
// 小程序Token
const getAccessTokenApplets = function(huidiao){
	wx.request({
		url: 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wx14e076d27e942480&secret=fb16e928e1a41fa0e8f21b2f50aa89d5',
		success: function (res) {
			if (res.data.expires_in == 7200) {
				app.globalData.access_Token = res.data.access_token
			}
			console.log('全局变量', app.globalData.access_Token)
			huidiao()
		}
	})
}
// 公众号Token
const getAccessTokenAccount = function(huidiao){
	wx.request({
		url: 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wx51f85979e24ae75b&secret=84a07fa8501abc705c79f48667eabb35',
		success: function (res) {
			if (res.data.expires_in == 7200) {
				app.globalData.access_TokenOff = res.data.access_token
			}
			console.log('公众号token',app.globalData.access_TokenOff)
			huidiao()
		}
	})
}

module.exports = {
	get: Get,
	yanzheng:yanzheng, // 简单数据为空验证
	messageReg:messageReg, // 敏感词过滤
	messagePush:messagePush, // 消息推送
	getAccessTokenApplets:getAccessTokenApplets, // 小程序Token
	getAccessTokenAccount:getAccessTokenAccount // 公众号Token
}