// const baseUrl = "http://miss.it-ys.com:91/work-boot/"
 const baseUrl = "http://192.168.1.250:8080/work-boot/" 
//  const baseUrl = "http://192.168.1.233:8080/work-boot/" 
//  const baseUrl = "http://192.168.1.235:8080/work-boot/" 
// const imBaseUrl = "ws://miss.it-ys.com:9123/work-boot/"
 const imBaseUrl = "ws://192.168.1.250:8080/work-boot/"  
//  const imBaseUrl = "ws://192.168.1.233:8080/work-boot/"  
//  const imBaseUrl = "ws://192.168.1.235:8080/work-boot/"  

// 消息列表
const imList = baseUrl + "work/im/list"  
// 接收消息ws /work/im/user/{id}
const imReceive = imBaseUrl+ "work/im/user/"   
// 发送消息 /work/im/user/{id}
const imSend = baseUrl + "work/im/add" 
// 附件上传路径
const upload = baseUrl + "sys/common/upload"
// 图片预览
const viewUrl = baseUrl + 'sys/common/view/'

module.exports = {
  imSend : imSend,
  imList : imList,
  imReceive : imReceive,
  upload  : upload,
  viewUrl : viewUrl
};