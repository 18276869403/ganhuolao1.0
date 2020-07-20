// pages/submitNeeds/submitNeeds.js
const app = getApp()
//调用接口js
const qingqiu = require('../../utils/request.js')
const api = require('../../utils/config.js')
const util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    viewUrl: api.viewUrl,
    id: '',
    needsTypeid: 0,
    select: 'circle',
    hasMask: false,
    imgUrl: '',
    firstId: 3,
    secondId: '',
    yijiname: '',
    erjiname: '',
    cityname: '',
    areaname: '',
    cityId: 1,
    areaId: '',
    needsname: '',
    needscontent: '',
    workaddress: '',
    linkman: '',
    phone: '',
    show: false,
    btnFlag:false,
    needsTypeList: [{
        id: 0,
        name: '普通'
      },
      {
        id: 1,
        name: '加急'
      }
    ],
    navLeftItems: [],
    navRightItems: [],
    city: [],
    tupianlist: [],
    tupianlists: [],
    area: [],
    mianzhe: '欢迎您使用干活佬的服务！本平台仅提供同城信息共享，发布桥梁，信息发布、接单均不收取用户任何费用。\
      为使用干活佬的服务，您应当阅读并遵守《干活佬使用协议》。本协议是用户与干活佬之间的法律协议，是用户注册干活佬平台账号和/或使用干活佬服务时使用的通用\条款。请您务必审慎阅读、充分理解各条款内容，特别是免除或者限制责任的条款、管辖与法律适用条款。限制、免责条款可能以黑体加粗或加下划线的形式提示您重\点注意。您不应当以干活佬未对本协议以合理方式提醒用户注意或未根据用户要求尽到说明义务为理由而声称或要求法院或其它任何第三方确认相关条款非法或无效。\除非您已阅读并接受本协议所有条款，否则您无权使用干活佬提供的服务。您使用干活佬的服务即视为您已阅读并同意上述协议的约束。\
      一、协议的效力\
      在您按照注册页面提示填写信息、阅读并同意本协议并完成全部注册程序后或以其他干活佬允许的方式实际使用干活佬平台服务时，您即受本协议的约束。\
      二、注册\
      1、您确认，在您完成注册程序或以其他干活佬允许的方式实际使用干活佬平台服务时，您应当是具备相应民事行为能力的自然人（十六周岁以上的未成年人，以自己\的劳动收入为主要生活来源的，视为完全民事行为能力人）、法人或其他组织。若您不具备前述主体资格，则您及您的家长或法定监护人（以下统称"监护人"）应承\
      担因此而导致的一切后果，且干活佬有权注销您的账户，并向您及您的监护人索偿。\
      2、干活佬非常重视对青少年个人信息搜集和使用的安全性的保护。干活佬建议，任何未满18周岁的未成年人参加网上活动应事先取得其监护人可经查证的同意并遵守\《全国青少年网络文明公约》。监护人应承担未成年人网络活动风险及保护未成年人相关网络隐私的首要责任。\
      3、在您签署本协议，完成注册入驻程序时，干活佬会向您提供唯一编号的干活佬账户。您应对您的用户账户、登录密码、支付密码（如有）、验证码的安全，以及对通过您的账户和密码实施的行为负责；因此所衍生的任何损失或损害，干活佬无法也不承担任何责任。除非有法律规定或行政司法机关的指令，且征得干活佬的同意，否则您的用户账户、登录密码、支付密码（如有）和验证码不得以任何方式转让、借用、赠与、继承（与账户相关的财产权益除外）<或>在第三方平台上进行展示或售\卖。否则，由此给您（或干活佬、任何第三方）造成的一切损失，概由您自行承担（或者负责赔偿）。\
      4、干活佬承诺非经法定原因、本协议的约定或您的事先许可，干活佬不会向任何第三方透露您的注册账号、手机号码等非公开信息。如果发现任何人不当使用您的账户\或有任何其他可能危及您的账户安全的情形时，您应当立即以有效方式通知干活佬，要求干活佬暂停相关服务。您理解干活佬对您的请求采取行动需要合理时间，干活\佬对在采取行动前已经产生的后果（包括但不限于您的任何损失）不承担任何责任。\
      5、您在注册帐号或使用干活佬平台服务的过程中，应提供合法、真实、准确的个人资料，您填写的个人资料有变动的，应及时进行更新。如果因您提供的个人资料不合\法、不真实、不准确的，您需承担因此引起的相应责任及后果，并且干活佬保留终止您使用干活佬各项服务的权利。\
      6、您了解并同意，如您符合并且遵守本协议条款，在通过干活佬平台完成注册程序之后，即可成为干活佬平台注册用户。对于您主动提交的相关信息，您授权干活佬及/或干活佬网站运营者及关联服务提供方委托的第三方通过合法渠道（包括但不限于征信机构等）了解、咨询、审查您的个人市场交易风险的真实情况，并据此判断您的\风险状况。\
      7、您不得通过任何手段恶意注册干活佬网站帐号，包括但不限于以牟利、炒作、套现等为目的多个账号注册。您亦不得盗用其他用户帐号。\
      8、您了解并同意，一经注册用户账号，即视为您同意干活佬及/或其关联公司可以通过拨打电话、发送短信或者电子邮件等方式向您注册时填写的手机号码、电子邮箱\等发送、告知相应的产品服务广告信息、促销优惠等营销信息；您如果不同意接收相关信息，您可以通过相应的退订功能或相关提示进行退订。\
      三、干活佬平台服务使用规范\
      1、通过干活佬平台，您可以按照干活佬的规则发布各种生活信息。但所发布之信息不得含有如下内容：\
      1) 反对宪法所确定的基本原则，煽动抗拒、破坏宪法和法律、行政法规实施的；\
      2)煽动危害国家安全、泄露国家秘密、颠覆国家政权，推翻社会主义制度的；\
      3)煽动分裂国家、破坏国家统一、损害国家荣誉和民族利益的；\
      4)煽动民族仇恨、民族歧视，破坏民族团结的；\
      5)捏造或者歪曲事实，散布谣言，扰乱社会秩序的；\
      6)进行政治宣传或破坏国家宗教政策、宣扬封建迷信、淫秽、色情、赌博、暴力、凶杀、恐怖、教唆犯罪的；\
      7)公然侮辱他人或者捏造事实诽谤他人的，或者进行其他恶意攻击的；\
      8)损害国家机关信誉的；\
      9)其他违反宪法和法律法规的；\
      2、在接受干活佬服务的过程中，您不得从事下列行为：\
      1）发表、传送、传播、储存侵害他人知识产权、商业秘密权等合法权利的内容，包含病毒、木马、定时炸弹等可能对干活佬系统造成伤害或影响其稳定性的内容制造虚假身份以误导、欺骗他人；\
      2）传送或散布以其他方式实现传送的含有受到知识产权法律保护的图像、相片、软件或其他资料的文件，作为举例（但不限于此）：包括版权或商标法（或隐私权或公开权），除非用户拥有或控制着相应的权利或已得到所有必要的认可；\
      3）使用任何包含有通过侵犯商标、版权、专利、商业机密或任何一方的其他专有权利的方式利用本“软件”获得的图像或相片的资料或信息；\
      4）进行危害计算机网络安全的行为，包括但不限于：使用未经许可的数据或进入未经许可的服务器/帐号；未经允许进入公众计算机网络或者他人计算机系统并删除、修改、增加存储信息；未经许可，企图探查、扫描、测试本平台系统或网络的弱点或其它实施破坏网络安全的行为；企图干涉、破坏本平台系统或网站的正常运行，故意传播恶意程序或病毒以及其他破坏干扰正常网络信息服务的行为；伪造TCP/IP数据包名称或部分名称；\
      5）修改或伪造软件作品运行中的指令、数据、数据包，增加、删减、变动软件 的功能或运行效果，不得将用于上述用途的软件通过信息网络向公众传播或者运营；\
      6）在未经干活佬书面明确授权前提下，出售、出租、出借、散布、转移或转授权软件和服务或相关的链接或从使用软件和服务或软件和服务的条款中获利，无论以上使用是否为直接经济或金钱收益；\
      7） 违背干活佬页面公布之活动规则，包括但不限于发布虚假信息、作弊或通过其他手段进行虚假交易。\
      3、您了解并同意，干活佬有权应政府部门（包括司法及行政部门）的要求，向其提供您在干活佬平台填写的注册信息和发布纪录等必要信息，且无须征得您的同意或提前通知于您。\
      4、在干活佬平台上使用干活佬服务过程中，您承诺遵守以下约定：\
      1)在使用干活佬平台服务过程中实施的所有行为均遵守国家法律、法规等规范文件及干活佬平台各项规则的规定和要求，不违背社会公共利益或公共道德，不损害他人的合法权益，不违反本协议及相关规则。您如果违反前述承诺，产生任何法律后果的，您应以自己的名义独立承担所有的法律责任，并确保干活佬免于因此产生任何损失或增加费用。\
      2)不发布国家禁止发布的信息（除非取得合法且足够的许可），不发布涉嫌侵犯他人知识产权或其它合法权益的信息，不发布违背社会公共利益或公共道德、公序良俗的信息，不发布其它涉嫌违法或违反本协议及各类规则的信息。\
      3)不对干活佬平台上的任何数据作商业性利用，包括但不限于在未经干活佬事先书面同意的情况下，以复制、传播等任何方式使用干活佬平台站上展示的资料。\
      4)不使用任何装置、软件或例行程序干预或试图干预干活佬平台的正常运作或正在干活佬平台上进行的任何活动。您不得采取任何将导致不合理的庞大数据负载加诸干活佬平台网络设备的行动。\
      5、您了解并同意：\
      1)您违反上述承诺时，干活佬有权依据本协议的约定，做出相应处理或终止向您提供服务，且无须征得您的同意或提前通知于您。\
      2)根据相关法令的指定或者干活佬服务规则的判断，您的行为涉嫌违反法律法规的规定或违反本协议和/或规则的条款的，干活佬有权采取相应措施，包括但不限于直接屏蔽、删除侵权信息、降低您的信用值或直接停止提供服务。如因此使干活佬遭受损失，或受到任何第三方的索赔，或受到任何行政管理部门的处罚，您应当赔偿干活佬因此造成的损失及（或）发生的费用，包括合理的律师费用。\
      3)对于您在干活佬平台上实施的行为，包括您未在干活佬平台上实施但已经对干活佬平台及其用户产生影响的行为，干活佬有权单方认定您行为的性质及是否构成对本协议和/或规则的违反，并据此采取相应的处理措施。您应自行保存与您行为有关的全部证据，并应对无法提供充要证据承担不利后果。\
      4)对于您涉嫌违反承诺的行为对任意第三方造成损害的，您均应当以自己的名义独立承担所有的法律责任，并应确保干活佬免于承担因此产生的损失或增加的费用。\
      四、责任范围和责任限制\
      1、干活佬负责向您提供干活佬平台服务。但干活佬对干活佬平台服务不作任何明示或暗示的保证，包括但不限于干活佬平台服务的适用性、没有错误或疏漏、持续性、准确性、可靠性、适用于某一特定用途。同时，干活佬也不对干活佬平台服务所涉及的技术及信息的有效性、准确性、正确性、可靠性、稳定性、完整性和及时性作出任何承诺和保证。\
      2、干活佬仅向您提供干活佬平台服务，您了解干活佬平台上的信息系用户自行发布，由于海量信息的存在，且干活佬平台无法杜绝可能存在风险和瑕疵。您应谨慎判断确定相关信息的真实性、合法性和有效性，并注意保留相应的证据以利于维权，如可能，尽量采用网站建议的交易方式进行。\
      3、干活佬平台与其他的在线使用的互联网网站一样，也会受到各种不良信息、网络安全和网络故障问题的困扰，包括但不限于：\
      1）其他用户可能会发布诈骗或虚假信息，或者发表有谩骂、诅咒、诋毁、攻击内容的，或者含有淫秽、色情、下流、反动、煽动民族仇恨等让人反感、厌恶的内容的非法言论；\
      2）其他用户可能会发布一些侵犯您或者其他第三方知识产权、肖像权、姓名权、名誉权、隐私权和/或其他合法权益的图片、照片、文字等资料；\
      3）面临着诸如黑客攻击、计算机病毒困扰、系统崩溃、网络掉线、网速缓慢、程序漏洞等问题的困扰和威胁。\
      您充分了解并同意：上述的各种不良信息、网络安全和网络故障问题，并不是干活佬或者干活佬平台所导致的问题，由此可能会造成您感到反感、恶心、呕吐等精神损害，或者给您造成其他的损失，概由您自行承担，干活佬无须向您承担任何责任。\
      4、您同意，在发现本网站任何内容不符合法律规定，或不符合本用户协议规定的，您有义务及时通知干活佬。如果您发现您的个人信息被盗用、您的版权或者其他权利被侵害，请将此情况告知干活佬并同时提供如下信息和材料：\
      1)侵犯您权利的信息的网址，编号或其他可以找到该信息的细节；\
      2)您是所述的版权或者其他权利的合法拥有者的权利证明；\
      3)您的联系方式，包括联系人姓名，地址，电话号码和电子邮件；\
      4)您的身份证复印件、营业执照等其他相关资料。\
      经审查得到证实的，我们将及时删除相关信息。我们仅接受邮寄、电子邮件或传真方式的书面侵权通知。情况紧急的，您可以通过客服电话先行告知，我们会视情况采取相应措施。\
      5、您了解并同意，干活佬不对因下述任一情况而导致您的任何损害赔偿承担责任，包括但不限于利润、商誉、使用、数据等方面的损失或其它无形损失的损害赔偿：\
      1) 使用或未能使用干活佬平台服务；\
      2) 第三方未经批准地使用您的账户或更改您的数据；\
      3) 通过干活佬平台服务购买或获取任何商品、样品、数据、信息等行为或替代行为产生的费用及损失；\
      4) 您对干活佬平台服务的误解；\
      5) 任何非因干活佬的原因而引起的与干活佬平台服务有关的其它损失。\
      6、您在干活佬上使用第三方提供的产品或服务时，除遵守本协议约定外，还应遵守第三方的用户协议。干活佬和第三方对可能出现的纠纷在法律规定和约定的范围内各自承担责任。\
      7、您同意在使用干活佬平台服务过程中显示干活佬自行或由第三方服务商向您发送的推广或宣传信息（包括商业与非商业信息），其方式和范围可不经向您特别通知而变更。除法律法规明确规定外，您应自行对依该推广信息进行的交易负责，对用户因依该推广信息进行的交易或前述第三方服务商提供的内容而遭受的损失或损害，干活佬不承担任何责任。\
      8、干活佬对下列不可抗力行为免责：信息网络正常的设备维护，信息网络连接故障，电脑、通讯或其他系统的故障，电力故障，罢工，劳动争议，暴乱，起义，骚乱，生产力或生产资料不足，火灾，洪水，风暴，爆炸，战争，政府行为，司法行政机关的命令或第三方的不作为而造成的不能服务或延迟服务。\
      9、您应当严格遵守本协议及干活佬发布的其他协议、活动规则，因您违反协议或规则的行为给第三方或干活佬造成损失的，您应当承担全部责任。\
      10、干活佬保留在中华人民共和国大陆地区法施行之法律允许的范围内独立决定拒绝服务、关闭用户账户、清除或编辑内容或取消订单的权利。\
      五、协议终止\
      1、您同意，干活佬基于平台服务的安全性，有权中止向您提供部分或全部干活佬平台服务，暂时冻结您的账户，待安全问题解决后及时恢复，并对中止、冻结及恢复的事实及时通知。如果网站的安全问题是由于您的违法行为引起，干活佬有权终止向您提供部分或全部干活佬平台服务，永久冻结（注销）您的帐户，并有权向您对损失进行索赔。\
      2、如您对本协议的修改有异议，或对干活佬的服务不满，可以行使如下权利：\
      1）停止使用干活佬的网络服务；\
      2）通过客服等渠道告知干活佬停止对其服务。结束服务后，您使用干活佬服务的权利立即终止。在此情况下，干活佬没有义务传送任何未处理的信息或未完成的服务给您或任何无直接关系的第三方。\
      3、您同意，您与干活佬的协议关系终止后，干活佬仍享有下列权利：\
      1) 继续保存您未及时删除的注册信息及您使用干活佬平台服务期间发布的所有信息至法律规定的记录保存期满。\
      2）您在使用干活佬平台服务期间存在违法行为或违反本协议和/或规则的行为的，干活佬仍可依据本协议向您主张权利、追究责任。\
      ',
    needTitle: '',
    oneclass: [],
    twoclass: [],
    picIurl: '',
    picIurl1: '',
    needstate: '',
    city: '',
    area: '',
    curIndex: '',
    picIurl1: '',
    picIurl: '',
    picimg: '',
    num: 1,
    yijiname1: ''
  },

  // 获取token值
  getTokenValue() {
    var that = this
    // 公众号Token
    qingqiu.get("getPublicAccessToken", null, function (res) {
      if (res.success == true) {
        app.globalData.access_TokenOff = res.result.accessToken
      } else {
        wx.showToast({
          title: '令牌获取失败',
          icon: 'none'
        })
        return
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getTokenValue()
    wx.showShareMenu({
      withShareTicket: true
    })
    if (options.type == 1) {
      this.setData({
        type: 1,
        id: options.id,
        wxuserid: app.globalData.wxid
      })
      // this.oneClass()
      // this.twoClass()
      this.QueryoneArea()
      this.QuerytwoArea()
      // this.QuerytwoArea()
      this.needSignPage()
    } else {
      this.setData({
        type: 0,
        wxuserid: app.globalData.wxid
      })
      // this.oneClass()
      // this.twoClass()
      this.QueryoneArea()
      this.QuerytwoArea()
    }
  },
  // 过滤
  needsnameblur: function (e) {
    var that = this
    qingqiu.get("checkWords",{content:e.detail.value}, function (res) {
      if (res == 1) {
        that.setData({
          needscontent: ''
        })
        wx.showToast({
          title: '内容包含敏感词，请重新输入...',
          icon: 'none',
          duration: 2000
        })
        return
      }else if(res == 2){
        wx.showToast({
          title: '校验失败',
          icon:'none'
        })
        that.setData({
          needscontent: ''
        })
        return
      }
    }, 'POST')
  },
  needscontentblur: function (e) {
    var that = this
    qingqiu.get("checkWords",{content:e.detail.value}, function (res) {
      if (res == 1) {
        that.setData({
          needscontent: ''
        })
        wx.showToast({
          title: '内容包含敏感词，请重新输入...',
          icon: 'none',
          duration: 2000
        })
        return
      }else if(res == 2){
        wx.showToast({
          title: '校验失败',
          icon:'none'
        })
        that.setData({
          needscontent: ''
        })
        return
      }
    }, 'POST')
  },
  linkmanblur: function (e) {
    var that = this
    qingqiu.get("checkWords",{content:e.detail.value}, function (res) {
      if (res == 1) {
        that.setData({
          needscontent: ''
        })
        wx.showToast({
          title: '内容包含敏感词，请重新输入...',
          icon: 'none',
          duration: 2000
        })
        return
      }else if(res == 2){
        wx.showToast({
          title: '校验失败',
          icon:'none'
        })
        that.setData({
          needscontent: ''
        })
        return
      }
    }, 'POST')
  },

  // 获取需求
  needSignPage() {
    var that = this
    if (that.data.id == "" || that.data.id == undefined || that.data.id == null || that.data.id == 0) {
      wx.showToast({
        title: '需求错误',
        icon: 'none',
        duration: 2000
      })
      return
    }
    var data = {
      id: that.data.id
    }
    console.log(data)
    qingqiu.get("yneedBy", data, function (res) {
      if (res.success == true) {
        console.log(res)
        for (let obj of res.result.backup1.split(',')) {
          if (obj != '') {
            that.data.tupianlists.push(obj)
          }
        }
        that.setData({
          wxuserid: res.result.wxUserId,
          needsTypeid: res.result.needType,
          needscontent: res.result.needContent,
          needsname: res.result.needTitle,
          youhuijia: res.result.backup3,
          linkman: res.result.publishMan,
          phone: res.result.publishPhone,
          picIurl: that.data.viewUrl + res.result.backup1,
          tupianlists: that.data.tupianlists,
          needstate: res.result.needState,
          cityId: res.result.oneAreaId,
          areaId: res.result.twoAreaId,
          cityname: res.result.oneAreaName,
          areaname: res.result.twoAreaName,
        })
      }
    })
  },
  // 发布需求
  lijifabu() {
    var that = this
    that.setData({btnFlag:true})
    for (let obj of that.data.tupianlists) {
      that.data.picIurl1 += obj + ","
    }
    that.data.picIurl1 = that.data.picIurl1.substring(0, that.data.picIurl1.length - 1)
    var s = qingqiu.yanzheng(that.data.needsname + ",输入标题|" + that.data.phone + ",输入联系电话|" + that.data.linkman + ",输入联系人|" + that.data.cityId + ",请选择一级区域|" + that.data.areaId + ",请选择二级区域")
    if (s != 0) {
      wx.showToast({
        title: s,
        icon: 'none',
        duration: 2000
      })
      that.setData({btnFlag:false})
      return
    }
    var shuzi = util.numberReg(that.data.phone)
    if (shuzi != 0) {
      wx.showToast({
        title: shuzi,
        icon: 'none',
        duration: 2000
      })
      that.setData({btnFlag:false})
      return
    }
    if (that.data.select == "circle") {
      wx.showToast({
        title: '请勾选同意协议！',
        icon: 'none',
        duration: 2000
      })
      that.setData({btnFlag:false})
      return
    }
    if (that.data.type == 1) {
      var data = {
        id: that.data.id,
        wxUserId: app.globalData.wxid,
        needContent: that.data.needscontent,
        needTitle: that.data.needsname,
        backup3: that.data.youhuijia,
        publishMan: that.data.linkman,
        publishPhone: that.data.phone,
        backup1: that.data.picIurl1,
        needState: that.data.needstate,
        oneAreaId: that.data.cityId,
        twoAreaId: that.data.areaId,
        backup5: 1
      }
      console.log(data)
      qingqiu.get("needUpdateStateById", data, function (re) {
        if (re.success == true) {
          that.setData({btnFlag:false})
          wx.showToast({
            title: '修改成功',
            icon: 'success',
            duration: 2000
          })
          setTimeout(function () {
            // wx.switchTab({
            //   url: '../Material/Material',
            // })
            wx.navigateBack({
              delta: 2
            })
          }, 1000)
        } else {
          that.setData({btnFlag:false})
          wx.showToast({
            title: re.message,
            icon: 'none',
            duration: 2000
          })
        }
      }, "put")
    } else {
      var data = {
        wxUserId: app.globalData.wxid,
        needContent: that.data.needscontent,
        backup3: that.data.youhuijia == undefined ? '' : that.data.youhuijia,
        needTitle: that.data.needsname,
        publishMan: that.data.linkman,
        publishPhone: that.data.phone,
        backup1: that.data.picIurl1,
        oneAreaId: that.data.cityId,
        twoAreaId: that.data.areaId,
        needType: 2,
        needState: 0,
        backup5: 1
      }

      console.log(data)
      qingqiu.get("insertYneed", data, function (re) {
        console.log(re)
        if (re.success == true) {
          that.setData({btnFlag:false})
          wx.showToast({
            title: '发布成功',
            icon: 'none',
            duration: 2000
          })
          // 公众号消息推送
          qingqiu.get("getPublicUser", null, function (res) {
            for (let obj of res.result) {
              var objdata = {
                openId: obj.openid,
                access_token: app.globalData.access_TokenOff,
                firstValue: "干活佬又上新啦，赶紧去看看！",
                firstColor: '#173177',
                keyword1Value: "有1条剩料发布啦！",
                keyword1Color: '#173177',
                keyword2Value: util.nowTime(),
                keyword2Color: '#173177',
                remarkValue: '请进入干活佬查看详情',
                remarkColor: '#173177',
                MiniUrl: ''
              }
              qingqiu.get("SendWxMsg", objdata, function (re) {
                console.log(re)
              })
            }
          })
          setTimeout(function () {
            app.globalData.materialRefresh = 1
            wx.redirectTo({
              url: '../Material/Material',
            })
          }, 1000)
        } else {
          that.setData({btnFlag:false})
          wx.showToast({
            title: re.message,
            icon: 'none',
            duration: 2000
          })
        }
      }, 'post')
    }
  },
  // 一级分类
  oneClass() {
    var that = this
    var data = {
      type: 3
    }
    qingqiu.get("oneClassList", data, function (re) {
      if (re.success == true) {
        if (re.result != null) {
          that.setData({
            oneclass: re.result
          })
        } else {
          wx.showToast({
            title: '一级分类：' + re.message,
            icon: 'none',
            duration: 2000
          })
        }
      }
    })
  },
  // 二级分类
  twoClass() {
    var that = this
    var data = {
      oneClassId: that.data.firstId
    }
    qingqiu.get("oneClassList", data, function (re) {
      if (re.success == true) {
        if (re.result != null) {
          that.setData({
            twoclass: re.result
          })
        } else {
          wx.showToast({
            title: '二级分类：' + re.message,
            icon: 'none',
            duration: 2000
          })
        }
      }
    })
  },
  // 一级区域
  QueryoneArea() {
    var that = this
    qingqiu.get("queryOneArea", null, function (re) {
      if (re.success == true) {
        if (re.result != null) {
          that.city = re.result
          that.setData({
            city: that.city
          })
        } else {
          wx.showToast({
            title: '一级区域：' + re.message,
            icon: 'none',
            duration: 2000
          })
        }
      }
    })
  },
  // 二级区域
  QuerytwoArea() {
    var that = this
    var data = {
      oneAreaId: that.data.cityId
    }
    qingqiu.get("queryTwoArea", data, function (re) {
      if (re.success == true) {
        if (re.result != null) {
          that.area = re.result
          that.setData({
            area: that.area
          })
        } else {
          wx.showToast({
            title: '二级区域：' + re.message,
            icon: 'none',
            duration: 2000
          })
        }
      }
    })
  },
  //隐藏弹窗样式 地址
  hideModal: function () {
    var that = this;
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
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
  onUser: function () {
    var that = this
    wx.login({
      success: function (res) {
        qingqiu.get("getKeyInfo", {
          code: res.code
        }, function (re) {
          app.globalData.wxid = re.data.result.wxUser.id
          if (re.data.result.wxUser.picUrl != null && re.data.result.wxUser.picUrl.length > 0) {
            app.globalData.sqgl = 1
          }
          app.globalData.openid = re.data.result.openId
          app.globalData.wxState = re.data.result.wxUser.wxState
        }, "POST")
      }
    })
  },
  getdata(id) {
    var data = {
      yneedId: id
    }
    var that = this
    qingqiu.get("needAndUserSignById", data, function (re) {
      var sj = re.data.result
      var yneed = sj.yneed
      that.setData({
        workaddress: yneed.needAddress != null ? yneed.needAddress : '',
        needscontent: yneed.needContent,
        tupianlist: yneed.needAddress != null ? yneed.needAddress.split(',') : [],
        needsname: yneed.needTitle,
        cityId: yneed.oneAreaId,
        areaId: yneed.twoAreaId,
        firstId: yneed.oneClassId,
        secondId: yneed.twoClassId,
        //needsTypeid: yneed.needType,
        yijiname: yneed.oclassName,
        erjiname: yneed.tclassName,
        linkman: yneed.publishMan,
        phone: yneed.publishPhone,
        cityname: yneed.oareaName,
        areaname: yneed.tareaName,
        select: 'success'
      })
    })
  },
  //获取输入的需求标题
  needsnameinput: function (e) {
    this.setData({
      needsname: e.detail.value
    })
  },
  //获取输入的需求内容
  needscontentinput: function (e) {
    this.setData({
      needscontent: e.detail.value
    })
  },
  //获取输入的联系人
  linkmaninput: function (e) {
    this.setData({
      linkman: e.detail.value
    })
  },
  //获取输入的联系电话
  phoneinput: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },
  //获取输入的工作地址
  workaddressinput: function (e) {
    this.setData({
      workaddress: e.detail.value
    })
  },
  //获取输入的初价
  youhuijiainput: function (e) {
    this.setData({
      youhuijia: e.detail.value
    })
  },
  changeType: function (e) {
    var that = this;
    var id = e.currentTarget.dataset.id
    that.setData({
      needsTypeid: id
    })
  },
  //改变选框状态(免责协议)
  change: function (e) {
    var that = this
    //得到选中状态
    var select = e.currentTarget.dataset.select
    if (select == "circle") {
      var stype = "success"

    } else {
      var stype = "circle"
    }
    //赋值
    that.setData({
      select: stype
    })
  },
  typefenleiyj: function () {
    var that = this
    qingqiu.get("oneClassService", {}, function (re) {
      for (var i = 0; i < re.data.result.length; i++) {
        if (re.data.result[i].backup1 == '3') {
          that.setData({
            firstId: re.data.result[i].id,
            yijiname1: re.data.result[i].className
          })
          break
        }
      }
      that.setData({
        navLeftItems: re.data.result
      })
      that.typefenleiej()
    })
  },
  typefenleiej: function () {
    var data = {
      oneClassId: this.data.firstId
    }
    var that = this
    qingqiu.get("twoClassService", data, function (re) {
      that.setData({
        navRightItems: re.data.result
      })
    })
  },
  // 左侧按钮
  left: function (e) {
    var that = this;
    //var index = e.currentTarget.dataset.index;
    var id = e.currentTarget.dataset.id
    var name = e.currentTarget.dataset.name
    that.setData({
      // show: true,
      firstId: id,
      yijiname1: name
    })
    var data = {
      oneClassId: that.data.firstId
    }
    qingqiu.get("twoClassList", data, function (re) {
      if (re.success == true) {
        if (re.result != null) {
          that.twoclass = re.result
          that.setData({
            twoclass: that.twoclass
          })
        } else {
          qingqiu.tk('未查询到任何数据')
        }
      }
    })
  },
  // 右侧单选点击
  right: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    var id = e.currentTarget.dataset.id
    var name = e.currentTarget.dataset.name
    that.setData({
      secondId: id,
      curIndex: index,
      erjiname: name,
      yijiname: this.data.yijiname1,
      showModalStatus6: false,
    })
  },
  // 
  //显示弹窗样式
  showModal6: function (e) {
    this.setData({
      hasMask: true
    })
    var animation = wx.createAnimation({
      duration: 300,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.opacity(0).rotateX(-100).step();
    this.setData({
      animationData: animation.export(),
      showModalStatus6: true
    })
    setTimeout(function () {
      animation.opacity(1).rotateX(0).step();
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 200)
  },
  //隐藏弹窗样式
  hideModal6: function () {
    var that = this;
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
      hasMask: false3
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus6: false
      })
      var erjiId = ''
      var erjiName = ""
      for (var i = 0; i < that.data.navRightItems.length; i++) {
        if (that.data.navRightItems[i].isSelected == true) {
          if (erjiId != '') {
            erjiId = erjiId + ',' + that.data.navRightItems[i].id
            erjiName = erjiName + ',' + that.data.navRightItems[i].name
          } else {
            erjiId = that.data.navRightItems[i].id
            erjiName = that.data.navRightItems[i].name
          }

          that.setData({
            erjiName: erjiName,
            erjiId: erjiId,
          })
        }
      }
      that.setData({
        itemList: [],
        cost: ''
      })
    }.bind(this), 200)
  },

  //地址 显示弹窗样式
  showModal: function (e) {
    this.setData({
      hasMask: true
    })
    var animation = wx.createAnimation({
      duration: 300,
      timingFunction: "linear",
      delay: 0
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
  //隐藏弹窗样式 地址
  hideModal: function () {
    var that = this;
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
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
  cityyiji: function () {
    var that = this
    qingqiu.get("oneAreaService", {}, function (re) {
      if (re.data.result.length > 0) {
        that.setData({
          cityId: re.data.result[0].id,
          cityname1: re.data.result[0].areaName
        })
      }
      that.setData({
        city: re.data.result
      })
      that.cityerji()
    })
  },
  cityerji: function () {
    var that = this
    var data = {
      oneAreaId: that.data.cityId
    }
    qingqiu.get("getAllTwoArea", data, function (re) {
      that.setData({
        area: re.data.result
      })
    })
  },
  // 左侧按钮
  cityleft: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    var id = e.currentTarget.dataset.id
    var name = e.currentTarget.dataset.name
    that.setData({
      cityId: id,
      curIndex: index,
      cityname1: name,
      show: true
    })
    var data = {
      oneAreaId: that.data.cityId
    }
    qingqiu.get("queryTwoArea", data, function (re) {
      if (re.success == true) {
        if (re.result != null) {
          that.area = re.result
          that.setData({
            area: that.area
          })
        } else {
          qingqiu.tk('未查询到任何数据')
        }
      }
    })
  },
  // 右侧单选点击
  arearight: function (e) {
    var that = this;
    var cityname = '万载县'
    // if (that.data.cityname == undefined) {
    //   wx.showToast({
    //     title: '请先选择城市',
    //     icon: 'none',
    //     duration: 2000
    //   })
    //   return
    // }
    var index = e.currentTarget.dataset.index;
    var id = e.currentTarget.dataset.id
    var name = e.currentTarget.dataset.name
    that.setData({
      areaId: id,
      curIndex: index,
      areaname: name,
      show: false,
      cityname: cityname,
      showModalStatus: false,
    })
  },
  // 服务规则页面显示
  showModal1: function () {
    this.setData({
      hasMask: true
    })
    var animation = wx.createAnimation({
      duration: 300,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation

    animation.opacity(0).rotateX(-100).step();
    this.setData({
      animationData: animation.export(),
      showModalStatus1: true
    })
    setTimeout(function () {
      animation.opacity(1).rotateX(0).step();
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 200)
  },
  //服务规则页面关闭
  hideModal1: function () {
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    // flag = 0;
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
        showModalStatus1: false
      })
    }.bind(this), 200)
  },
  shanchutup: function (e) {
    var img = e.currentTarget.dataset.img
    img = (this.data.workaddress + ',').replace(img + ',', "")
    if (img != '') {
      img = img.substr(0, img.length - 1)
    }
    this.setData({
      workaddress: img,
      tupianlist: img != '' ? img.split(',') : []
    })
  },
  // 图片上传（对接完成）
  upimg: function (e) {
    var type = e.currentTarget.dataset.type
    var index = e.currentTarget.dataset.number
    var that = this
    that.setData({btnFlag:true})
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'], // 指定只能为压缩图，首先进行一次默认压缩
      sourceType: ['album', 'camera'],
      success: function (res) {
        console.log(res)
        const tempFilePaths = res.tempFilePaths;
        wx.uploadFile({
          url: api.imgFilter,
          name: 'file',
          filePath: tempFilePaths[0],
          formData: {
            media: tempFilePaths[0]
          },
          method: 'POST',
          header: {
            "Content-Type": "multipart/form-data"
          },
          success: function (res) {
            console.log(res)
            if (res.data =="false") {
              that.setData({btnFlag:false})
              wx.showToast({
                title: '内容含有违法违规内容',
                icon: 'none'
              })
              return
            } else {
              wx.uploadFile({
                url: api.uploadurl,
                filePath: tempFilePaths[0],
                header: {
                  "Content-Type": "multipart/form-data"
                },
                formData: {
                  method: 'POST' //请求方式
                },
                name: 'file',
                success(res) {
                  that.setData({btnFlag:false})
                  var r = res.data
                  var jj = JSON.parse(r);
                  var sj = api.viewUrl + jj.message
                  that.data.tupianlists.push(jj.message)
                  that.setData({
                    tupianlists: that.data.tupianlists,
                    picimg1: sj,
                    picimgs1: jj.message
                  })
                }
              })
            }
          }
        })
      },
    })
    that.setData({
      btnFlag:false
    })
  },
  // 删除图片
  shanchu: function (e) {
    var that = this
    var tplj = e.currentTarget.dataset.tplj
    that.data.tupianlists.splice(tplj, 1)
    console.log(that.data.tupianlists)
    that.setData({
      tupianlists: that.data.tupianlists
    })
    that.data.num -= 1;
    that.setData({
      num: that.data.num
    });
  },
  //显示弹窗样式
  showModal: function (e) {
    this.setData({
      hasMask: true
    })
    var animation = wx.createAnimation({
      duration: 300,
      timingFunction: "linear",
      delay: 0
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
  //隐藏弹窗样式
  hideModal6: function () {
    var that = this;
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
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
      var erjiId = ''
      var erjiName = ""
      for (var i = 0; i < that.data.navRightItems.length; i++) {
        if (that.data.navRightItems[i].isSelected == true) {
          if (erjiId != '') {
            erjiId = erjiId + ',' + that.data.navRightItems[i].id
            erjiName = erjiName + ',' + that.data.navRightItems[i].name
          } else {
            erjiId = that.data.navRightItems[i].id
            erjiName = that.data.navRightItems[i].name
          }
          that.setData({
            erjiName: erjiName,
            erjiId: erjiId,
          })
        }
      }
      that.setData({
        itemList: [],
        cost: ''
      })
    }.bind(this), 200)
  },
  // 业务分类
  showModallist: function () {
    this.typefenleiyj()
    this.setData({
      hasMask: true
    })
    var animation = wx.createAnimation({
      duration: 300,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.opacity(0).rotateX(-100).step();
    this.setData({
      animationData: animation.export(),
      showModalStatuslist: true,
      showModalStatus6: true
    })
    setTimeout(function () {
      animation.opacity(1).rotateX(0).step();
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 200)
  },
  //选择业务页面关闭
  hideModallist: function (e) {
    var that = this
    var flag = e.currentTarget.dataset.return
    if (flag == "ture") {
      that.setData({
        yijiname: that.data.yijiname,
        erjiname: that.data.erjiname,
      })
    } else {
      that.setData({
        yijiname: '',
        erjiname: '',
      })
    }
    //this.writeclass(flag)
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    // flag = 0;
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData2: animation.export(),
      hasMask: false
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData2: animation.export(),
        showModalStatuslist: false,
        showModalStatus6: false
      })
    }.bind(this), 200)
  },
  // 获取分类
  typefenleiyj: function () {
    var that = this
    var data = {
      type: 4
    }
    qingqiu.get("oneClassList", data, function (re) {
      if (re.success == true) {
        if (re.result != null) {
          for (let i = 0; i < re.result.length; i++) {
            var gongzhongclass = 'gongzhong[' + i + '].oneclass'
            var gongzhongid = 'gongzhong[' + i + '].id'
            that.setData({
              [gongzhongid]: re.result[i].id,
              [gongzhongclass]: re.result[i].className
            })
            console.log(re.result[i].className)
            var onedata = {
              oneClassId: re.result[i].id
            }
            qingqiu.get("twoClassList", onedata, function (re) {
              if (re.success == true) {
                if (re.result != null) {
                  var gongzhongclass2 = 'gongzhong[' + i + '].twoclasslist'
                  that.setData({
                    [gongzhongclass2]: re.result
                  })
                }
              }
            })
          }
        }
      }
    })
  },
  typefenleiej: function () {
    var data = {
      oneClassId: this.data.typeyj
    }
    var that = this
    qingqiu.get("twoClassService", data, function (re) {
      that.setData({
        typeejlist: re.data.result
      })
    })
  },
  // 选项卡点击事件获取分类
  fenlei: function (e) {
    var that = this;
    var id = 1
    var litype = 0
    if (id == 1) {
      litype = 2;
    } else {
      litype = 1;
    }
    var typeid = "fenleitype1.yjid"
    var typeerji = "fenleitype1.erjiid"
    var typestate = "fenleitype1.typestate"
    var typeid1 = "fenleitype2.yjid"
    var typeerji1 = "fenleitype2.erjiid"
    var typestate1 = "fenleitype2.typestate"
    that.setData({
      [typeid]: '',
      [typeerji]: '',
      [typestate]: false,
      [typeid1]: '',
      [typeerji1]: '',
      [typestate1]: false,
      fenClass1: '',
      fenClass2: '',
      // needsTypeid: id,
      litype: litype,
      yijiname: '',
      secondId: 0,
      erjiworkname: '',
      typeyj: 0
    })
    this.typefenleiyj()
  },
  // 改变二级分类
  changetwoclass: function (e) {
    var that = this
    that.data.flerjiid = e.currentTarget.dataset.id
    that.data.yijiid = e.currentTarget.dataset.yjid
    that.data.yijiname = e.currentTarget.dataset.yijiname
    that.data.erjiname = e.currentTarget.dataset.erjiname
    that.setData({
      flerjiid: that.data.flerjiid
    })
  },
})