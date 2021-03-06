const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

// 生成年月日
const formatDate = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  return [year, month, day].map(formatNumber).join('-')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

// 通过时间判断距离当前时间多少年
const Ages = function (str) {
  if (str.indexOf(' ') != -1) {
    str = str.split(' ')[0]
  }
  var r = str.match(/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/);
  if (r == null) return false;
  var d = new Date(r[1], r[3] - 1, r[4]);
  if (d.getFullYear() == r[1] && (d.getMonth() + 1) == r[3] && d.getDate() == r[4]) {
    var Y = new Date().getFullYear();
    return Y - r[1];
  }
  return ("输入的日期格式错误！");
}

// 长度限制
const SubName = function (str) {
  var temp = "";
  if (str.length > 2) {
    temp = temp + str.substring(0, 3) + "...";
  } else {
    temp = str
  }
  return temp;
}

// 隐藏姓名
const FormatName = function (str) {
  var temp = ""
  if (str.length > 1) {
    return temp = str.substring(0, 1) + '**';
  } else {
    return str + "**"
  }
}

// 手机号隐藏
const FormatPhone = function (str) {
  var temp = "";
  for (var i = 0; i < str.length; i++) {
    if (i < 3 || i > 8) {
      temp = temp + str.substring(i, i + 1);
    } else {
      temp = temp + "*";
    }
  }
  return temp;
}

// 数字验证(不带小数点)
const numberReg = function (str) {
  var patten = /^\d+(\.\d+)?$/;
  if (!patten.test(str)) {
    return "请您输入数字"
  } else {
    return 0
  }
}

// 数字验证(带小数点)
const floatReg = function (str) {
  var patten = /^[+-]?(0|([1-9]\d*))(\.\d+)?$/g;
  if (!patten.test(str)) {
    return "请输入数字";
  } else {
    return 0;
  }
}

// 带错误信息数字验证 (带小数点)
const floatReglist = function (str) {
  var patten = /^[+-]?(0|([1-9]\d*))(\.\d+)?$/g;
  var strlist = str.split('|')
  for (let obj of strlist) {
    var list = obj.split(',')
    if (!patten.test(list[0])) {
      return list[1]
    }
  }
  return 0
}
// 带错误信息数字验证 (带小数点)
const numberReglist = function (str) {
  var patten = /^[+-]?(0|([1-9]\d*))(\.\d+)?$/g;
  var strlist = str.split('|')
  for (let obj of strlist) {
    var list = obj.split(',')
    if (!patten.test(list[0])) {
      return list[1]
    }
  }
  return 0
}

const nowTime = function () {
  // 微信小程序获取当前时间
  var timestamp = Date.parse(new Date());
  timestamp = timestamp / 1000;
  //获取当前时间
  var n = timestamp * 1000;
  var date = new Date(n);
  //年
  var Y = date.getFullYear();
  //月
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
  //日
  var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
  //时
  var h = date.getHours();
  //分
  var m = date.getMinutes();
  //秒
  var s = date.getSeconds();
  return Y + "-" + M + "-" + D + " " + h + ":" + m + ":" + s
}

// 获取日期
const newDate = function () {
  var date = new Date();
  //年
  var Y = date.getFullYear();
  //月
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
  //日
  var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
  return Y + "-" + M + "-" + D
}
// 编号重定义
const getById = function (str) {
  console.log(str)
  switch (str.length) {
    case 1:
      str = '000' + str
      break;
    case 2:
      str = '00' + str
      break;
    case 3:
      str = '0' + str
      break
    default:
      str = str
      break
  }
  return str
}

// 比较两个时间的大小
const checkDate = function (startTime, endTime) {
  //日期格式化
  var start_date = new Date(startTime.replace(/-/g, "/"));
  var end_date = new Date(endTime.replace(/-/g, "/"));
  //转成毫秒数，两个日期相减
  var ms = end_date.getTime() - start_date.getTime();
  //转换成天数
  var day = parseInt(ms / (1000 * 60 * 60 * 24));
  //do something
  return day;
}

module.exports = {
  formatTime: formatTime,
  formatDate: formatDate,
  ages: Ages,
  formatName: FormatName,
  subName: SubName,
  formatPhone: FormatPhone,
  floatReg: floatReg,
  numberReg: numberReg,
  floatReglist: floatReglist,
  numberReglist: numberReglist,
  nowTime: nowTime,
  newDate: newDate,
  checkDate: checkDate,
  getById:getById
}