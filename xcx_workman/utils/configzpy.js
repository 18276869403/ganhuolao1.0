var api = require('./config.js')
// const baseUrl = "http://miss.it-ys.com:91/work-boot/"
const baseUrl = "http://192.168.1.204:8080/work-boot/" 
// const baseUrl = "http://192.168.1.233:8080/work-boot/" 
// const baseUrl = "http://192.168.1.235:8080/work-boot/" 

// 大厅最新需求
const zuixinxq = baseUrl + "pc/hall/yneedList" 
// 推荐商品
const tjsp = baseUrl + "pc/hall/userGoodPage"
// 我的商品
const queryMyGoodPage = baseUrl + "pc/user/queryMyGoodPage"
// 我的商品-置顶
const editMyGoodTop = baseUrl + "pc/user/editMyGoodTop"
// 工人晒晒
const CasePage = baseUrl + "pc/hall/casePage"
// 需求详情-报名接单人员
const needSignPage = baseUrl + "pc/hall/needSignPage"
// 需求删除
const delYneedAndNeedSign = baseUrl + "pc/hall/delYneedAndNeedSign"
// 需求完成
const needUpdateStateById = baseUrl + "pc/hall/needUpdateStateById"
// 我的留言
const pcQueryMessagePageByUserID = baseUrl + "pc/user/pcQueryMessagePageByUserId"
// 删除留言
const deleteUserIm = baseUrl + "pc/user/deleteUserIm"
// 删除我的商品
const deleteUserGood = baseUrl + "pc/user/deleteUserGood"
// 添加商品
const addUserGood = baseUrl + "pc/hall/addUserGood"
// 修改商品
const editUserGood = baseUrl + "pc/user/editUserGood"
// 我的推荐
const pcQueryUserPointPage = baseUrl + "pc/user/pcQueryUserPointPage"
// 发布晒晒
const insertCase = baseUrl + "pc/user/insertCase"
// 晒晒详情
const pcQueryWxCaseById = baseUrl + "pc/user/pcQueryWxCaseById"
// 一级区域
const queryOneArea = baseUrl + "pc/hall/queryOneArea"
// 二级区域
const queryTwoArea = baseUrl + "pc/hall/queryTwoArea"
// 需求发布
const insertYneed = baseUrl + "pc/user/insertYneed"
// 一级分类
const oneClassList = baseUrl + "pc/hall/oneClassList"
// 二级分类
const twoClassList = baseUrl + "pc/hall/twoClassList"
//晒晒发布评论
const insertCaseMessage = baseUrl + "pc/user/insertCaseMessage"
//晒晒评论详情
const caseMessageVoList = baseUrl + "pc/user/caseMessageVoList"
// 本地招工
const list = baseUrl + "work/loclahire/list"
// 本地招工-通过ID
const queryloclaById = baseUrl + "work/loclahire/queryloclaById"
// 发布招工
const localHireAdd = baseUrl + "work/loclahire/localHireAdd"

module.exports = {
  twoClassList:twoClassList,
  oneClassList:oneClassList,
  insertYneed:insertYneed,
  queryOneArea:queryOneArea,
  queryTwoArea:queryTwoArea,
  CasePage:CasePage,
  //xqurl:xqurl,
  caseMessageVoList:caseMessageVoList,
  insertCaseMessage:insertCaseMessage,
  zuixinxq:zuixinxq,
  needSignPage:needSignPage,
  delYneedAndNeedSign:delYneedAndNeedSign,
  needUpdateStateById:needUpdateStateById,
  tjsp:tjsp,
  editUserGood:editUserGood,
  addUserGood:addUserGood,
  pcQueryUserPointPage:pcQueryUserPointPage,
  deleteUserGood:deleteUserGood,
  deleteUserIm:deleteUserIm,
  pcQueryMessagePageByUserID:pcQueryMessagePageByUserID,
  insertCase:insertCase,
  pcQueryWxCaseById:pcQueryWxCaseById,
  queryMyGoodPage:queryMyGoodPage,
  editMyGoodTop:editMyGoodTop,
  list:list,
  queryloclaById:queryloclaById,
  localHireAdd:localHireAdd
};