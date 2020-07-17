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

module.exports = {
	get: Get,
	yanzheng:yanzheng, // 简单数据为空验证
}