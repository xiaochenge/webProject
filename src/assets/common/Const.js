import axios from 'axios'
import localStore from 'store'
import router from '../../router'

/**
 * 自定义的常量类
 * @type {{}}
 */
let Const = {}

let userKey="asdasdsafasdfasdfsad";

let IsLgoin=false;

let serverInfo = {
  // proUrl: 'http://www.imasion-gms.com/gms',
  testUrl: 'http://192.168.0.102:9000/',
}

/** 常量键 */
let constKey = {

}
axios.defaults.baseURL = serverInfo.testUrl

let jsonRequest = axios.create({})
jsonRequest.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8'

/*let webSocketURL = (process.env.NODE_ENV == 'production') ? serverInfo.websocketProUrl : serverInfo.websocketTestUrl
let websocket = null*/

/**
 * 发送POST请求
 * @param uri
 * @param params
 * @param callback
 */
function doPost (uri, params, callback) {
  jsonRequest.post(uri, params).then(function (res) {
    if(callback!=null)
    callback(res.data)
  }).catch(function (res) {
    callback(res.data)
  })
}
function nonEmpty(str){
  if( str=="" || str==null || str==undefined ){
    return false
  }else{
    return true
  }
}
function getIsLogin (){
  return IsLgoin;
}
/**
 * 判断一个数是不是整型
 * @param x
 * @returns {boolean}
 */
function isInteger(x) {
  return x % 1 === 0;
}
/**
 * 根据时间戳返回格式化的时间
 * @param timeStamp
 * @returns {string}
 */
function formatDateTime(timeStamp) {
  var date = new Date();
  date.setTime(timeStamp);
  var y = date.getFullYear();
  var m = date.getMonth() + 1;
  m = m < 10 ? ('0' + m) : m;
  var d = date.getDate();
  d = d < 10 ? ('0' + d) : d;
  var h = date.getHours();
  h = h < 10 ? ('0' + h) : h;
  var minute = date.getMinutes();
  var second = date.getSeconds();
  minute = minute < 10 ? ('0' + minute) : minute;
  second = second < 10 ? ('0' + second) : second;
  return y + '-' + m + '-' + d+' '+h+':'+minute+':'+second;
}

/**
 * 过滤html代码
 * @param str
 */
function filterHtml(str){
  var reg=/<[^<>]+>/g;
  return str.replace(reg,'');
}

/**
 * 截取一部分字符串
 * @param str
 * @param indexA
 * @param indexB
 * @returns {string}
 */
function substring(str,indexA,indexB) {
  str=str+""
  return str.substring(indexA,indexB)
}

var localStoreObj = {
/**
 * 清除token
 */
 clearToken:function clearToken () {

},

/**
 * 缓存用户信息
 * @param userobj
 */
setUser:function setUser (userobj) {
  IsLgoin=true;
  localStore.set(userKey, userobj);
},

/**
 * 清除用户信息
 */
clearUser:function clearUser () {
  IsLgoin=false;
  return localStore.remove(userKey)
},

/**
 * 获取用户信息
 * @returns {*}
 */
getUser:function getUser () {
  return localStore.get(userKey)
},

/**
 * 消除所有的缓存
 */
clearlocalStore:function clearlocalStore () {
  IsLgoin=false;
  localStore.clearAll()
},

/**
 * 保存自定义数据到缓存中
 * @param key
 * @param value
 */
setkeyVal:function setkeyVal (key, value) {
  localStore.set(key, value)
},

/**
 * 从缓存中读取自定义数据
 * @param key
 * @returns {*}
 */
getVal:function getVal (key) {
  return localStore.get(key)
},

/**
 * 删除对应的key的值
 * @param key
 */
removeValByKey:function removeValByKey (key) {
  localStore.remove(key)
}

}

function logout () {

  router.replace({path: '/'})
}
/**
 * 关闭websocket

function closeWebSocket () {
  if (!!websocket && websocket.readyState == websocket.OPEN) {
    websocket.close()
    websocket = null
  }
  websocket = null
}
 */
/**
 * 发送消息到后端
 * @param param

function sendmsg (param) {
  if (!websocket) {
    startWebSocket(param)
    return
  }
  if (websocket.readyState == websocket.OPEN) {
    websocket.send(JSON.stringify(param))
  }
}
 */
/**
 * 前端接收到消息时调用
 * @param event

function onMessage (event) {
  let dt = JSON.parse(event.data)
  let dataCarrier = map.get(dt.dataKey)
  if (dataCarrier) {
    dataCarrier(dt)
  } else {
    // 判断是否强制退出
    if (dt.dataKey == 'forced/return') {
      // 关闭socket并且跳转到登陆页面
      closeWebSocket()
      router.replace({path: '/login'})
    }
  }
}
 */
/**
 * 打开webSocket
 * @param params

function startWebSocket (params) {
  let userInfo = getUser()
  if (!userInfo) {
    return
  }

  let arr = Object.getOwnPropertyNames(userInfo)
  if (arr.length == 0) {
    return
  }

  if (!websocket) {
    websocket = new WebSocket(webSocketURL)

    websocket.onopen = function (evt) {
      if (websocket.readyState == websocket.OPEN) {
        // 连接成功发送会话token
        websocket.send(JSON.stringify({action: 'join', business: userInfo}))
        // 一旦建立连接就读取前悬
        findMenus()
        // 然后初始化页面信息
        if (params) {
          websocket.send(JSON.stringify(params))
        }
      }
      websocket.onclose = function (evt) {
        websocket = null
      }

      websocket.onerror = function (evt) {
        closeWebSocket()
      }

      websocket.onmessage = function (evt) {
        onMessage(evt)
      }
    }
  }
}
 */
Const.install = function (Vue, options) {

  let _const = {
    doPost: doPost,
    formatDateTime: formatDateTime,
    filterHtml:filterHtml,
    gxSubstring:substring,
    localStoreObj:localStoreObj,
    nonEmpty:nonEmpty,
    isInteger:isInteger,
    isLogin:getIsLogin,
  }
  Vue.prototype.$Const = _const
}

export default Const
