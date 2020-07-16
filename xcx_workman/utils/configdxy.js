var api = require('./config.js')
const baseUrl = "http://miss.it-ys.com:91/work-boot/"  
// const baseUrl = "http://192.168.1.250:8080/work-boot/"  
// const baseUrl = "http://192.168.1.233:8080/work-boot/"  
// const baseUrl = "http://192.168.1.235:8080/work-boot/"   

// 2.0需要工人，商家分类表：可选2个分类-编辑
const WxUserAdd = baseUrl + "pc/hall/wxUserAdd"
// 登录
const GetKeyInfo = baseUrl + "work/wxLogin/getKeyInfo"
// 公众号推送 
const GetUnionid = baseUrl + "work/wxLogin/GetUnionid"
// 图片上传
const Upload = baseUrl + "sys/common/upload"
// 获取广告列表
const Bannerlist = baseUrl + "pc/hall/list"
// 获取广告列表
const PointLIst = baseUrl + "pc/hall/pointList"
// 获取推荐工人/推荐商家
const WxUserPage = baseUrl + "pc/hall/wxUserPage"
// 入驻功能一级分类 
const OneClassList = baseUrl + "pc/hall/oneClassList"
// 入驻功能二级分类
const TwoClassList = baseUrl + "pc/hall/twoClassList"
// 查询晒晒
const CasePage = baseUrl + "pc/hall/casePage"
// 加载个人信息
const QueryWxUser = baseUrl + "pc/user/queryWxUser"
// 修改个人信息
const EditWxUser = baseUrl + "/pc/user/editWxUser"
// 我的雇佣
const UserWorkPage = baseUrl + "pc/user/userWorkPage"
// 获取二维码
const GetCode = baseUrl + "pc/hall/code"
// 雇佣TA
const UserWorkAdd = baseUrl + "/pc/hall/userWorkAdd"
// 删除我的雇佣
const DeleteUserWork = baseUrl + "/pc/hall/deleteUserWork"
// 需求报名
const InsertNeedSign = baseUrl + "/pc/user/insertNeedSign"
// 通过需求id查询需求
const YneedBy = baseUrl + "/pc/hall/yneedBy"
// 通过雇佣id查询
const UserWorkBy = baseUrl + "/pc/user/userWorkBy"
// 修改雇佣
const UserWorkUpdateById = baseUrl + "/pc/user/userWorkUpdateById"
// 晒晒浏览+1
const UpdateWxCase = baseUrl + "/pc/user/updateWxCase"
// 定位-获取区域id
const queryAreaByName = baseUrl + "pc/hall/queryAreaByName"
// 需求浏览人数+1
const updateYeedById = baseUrl + "pc/hall/updateYeedById"
// 给我的留言
const messageForMe = baseUrl + "pc/user/messageForMe"
// 我发起的留言
const myMessage = baseUrl + "pc/user/myMessage"
// 微信小程序公众号
const getOpenIdbyjscode = baseUrl + "pc/wx_small_app/get_openid_by_js_code"
// 获取公益活动列表
const getActivityList = baseUrl + "pc/hall/getActivityList"
// 发布公益活动
const addActivity = baseUrl + "pc/hall/addActivity"
// 图片过滤
const checkPic = baseUrl + "work/wxLogin/checkPic"
// 公众号用户添加
const addPublicUser = baseUrl + "pc/hall/addPublicUser"
// 获取公众号最后一个openid
const getPublicUserByIdDesc = baseUrl + "pc/hall/getPublicUserByIdDesc"
// 获取个人的公众号openid
const getPublicUserById = baseUrl + "pc/hall/getPublicUserById"
// 获取所有关注公众号的用户
const getPublicUser = baseUrl + "pc/hall/getPublicUser"
// 招工删除
const workdelete = baseUrl + "work/loclahire/delete"
// 获取公众号令牌
const getPublicAccessToken = baseUrl + "pc/hall/getPublicAccessToken"

module.exports = {
  wxUserAdd: WxUserAdd,
  getKeyInfo:GetKeyInfo,
  upload:Upload,
  bannerlist:Bannerlist,
  pointList:PointLIst,
  wxUserPage:WxUserPage,
  oneClassList:OneClassList,
  casePage:CasePage ,
  twoClassList:TwoClassList,
  queryWxUser:QueryWxUser,
  userWorkPage:UserWorkPage,
  editWxUser:EditWxUser,
  getCode:GetCode,
  userWorkAdd:UserWorkAdd,
  deleteUserWork:DeleteUserWork,
  insertNeedSign:InsertNeedSign,
  yneedBy:YneedBy,
  userWorkBy:UserWorkBy,
  userWorkUpdateById:UserWorkUpdateById,
  updateWxCase:UpdateWxCase,
  queryAreaByName:queryAreaByName,
  updateYeedById:updateYeedById,
  messageForMe:messageForMe,
  myMessage:myMessage,
  getOpenIdbyjscode:getOpenIdbyjscode,
  getActivityList:getActivityList,
  addActivity:addActivity,
  GetUnionid:GetUnionid,
  checkPic:checkPic,
  addPublicUser:addPublicUser,
  getPublicUserById:getPublicUserById,
  getPublicUserByIdDesc:getPublicUserByIdDesc,
  getPublicUser:getPublicUser,
  workdelete:workdelete,
  getPublicAccessToken:getPublicAccessToken
};
