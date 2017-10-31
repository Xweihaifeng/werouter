/**
* wx
*
* 基础类库
* 提供前端所需要的各种便捷方法
* 目的是用最少代码实现丰富功能
*
* @author xuyong <xuyong@ucfgroup.com>
* @createTime 2014-03-18
* @projectHome https://github.com/xu-yong/wx
*
* Released under the MIT license:
*   http://www.opensource.org/licenses/mit-license.php
*/

(function(window, document, $, undefined){
  "use strict";

  var _winWidth   = $(window).width(),
      _winHeight  = $(window).height(),
      _globalData = {};

    function wx(){}
  window.wx = wx;

  wx.VERSION = "1.4.7";
  //当前页面的module,action和参数
  wx.MODULE  = "";
  wx.ACTION  = "";
  wx.REQUEST = {};
  //用于弹出框的常量值
  wx.BACK    = 0;
  wx.RELOAD  = 1;
  //全局配置信息
  wx.config  = {};

  _protoExtend();
  _browserCheck();

  $(function(){
    _pageInit();
    wx.validator();
    wx.lazyLoad();
  });

  /**
   * 渲染模板
   * @name    template
   * @param   {String}    模板ID
   * @param   {Object}    数据
   * @return  {String}    渲染好的HTML字符串
  */
  wx.template = function(id, data) {
    if(!window.template)
      return "";
    else
      return wx.trim(window.template(id, (data || {})));
  };

  /**
   * 管道节流，用于mouseover等调用频繁的优化处理
   * @name    throttle
   * @param   {Function}  真正用于执行的方法
   * @param   {Integer}   延时
   * @return  {Function}  节流方法
  */
    wx.throttle = function(fn, timeout) {
    var timer;
    return function(){
        var self = this, args = arguments;
        clearTimeout(timer);
        timer = setTimeout(function(){
            fn.apply(self, args);
        }, timeout);
    };
  };

  /**
   * 获得随机数，如果只传一个参数，则该参为最大数
   * @name    random
   * @param   {Integer}  最小数
   * @param   {Integer}  最大数
   * @return  {Integer}  随机数
  */
  wx.random = function(min, max) {
    if (!max) {
      max = min;
      min = 0;
    }
    return min + Math.floor(Math.random() * (max - min + 1));
  };

  /**
   * 倒计时
   * @name    countDown
   * @param   {Integer}  当前到结束的时间差
   * @param   {Integer}  唯一索引，当存在多个倒计时时区分
   * @param   {Function} 显示回调方法，将传入时分秒等信息
   * @param   {Function} 倒计时结束的回调方法
  */
  wx.countDown = function(time, index, showCallback, doneCallback) {
    var initTime = new Date().getTime();
    var timeback = time;
    function start(){
      var sTime = new Date().getTime();
      var timeId = setInterval(function(){
          var offsetTime = new Date().getTime()-sTime;
          sTime = new Date().getTime();
          time -= offsetTime;
          var fTime = getFormatTime(time,0);
          if(offsetTime>1200 || offsetTime<900){
            time =  timeback - (new Date().getTime()-initTime);
          }
          if(time<=0){
              clearInterval(timeId);
              if(typeof doneCallback !== "undefined")
                  doneCallback(index);
          } else {
              showCallback && showCallback(fTime[0],fTime[1],fTime[2],fTime[3]);
          }
      },1000);
    }
    function getFormatTime(t, isShow){
      t=t/1000;
      var day    = Math.floor(t/(60*60*24));
      var hour   = Math.floor((t-day*24*60*60)/3600);
      var minute = Math.floor((t-day*24*60*60-hour*3600)/60);
      var second = Math.floor(t-day*24*60*60-hour*3600-minute*60);
      hour   = hour<10?"0"+hour:hour;
      minute = minute<10?"0"+minute:minute;
      second = second<10?"0"+second:second;
      isShow && showCallback && showCallback(day,hour,minute,second);
      return [day,hour,minute,second];
    }
    getFormatTime(time,1);
    start();
  };

  /**
   * 图片加载
   * @name    imgLoad
   * @param   {String}    图片地址
   * @param   {Function}  加载完后的回调方法
  */
  wx.imgLoad = function (url, callback) {
    var image = new Image();
    image.src = url;
    if (image.readyState) {
      image.onreadystatechange = function() {
        if (image.readyState === "loaded" || image.readyState === "complete"){
          image.onreadystatechange = null;
          callback(image.width,image.height);
        }
      };
    } else {
      image.onload = function() {
        if (image.complete)
          callback(image.width,image.height);
      };
    }
  };

  /**
   * 判断是否为空对象，与jQuery.isEmptyObject功能相似
   * @name    isEmptyObject
   * @param   {Object}  要检测的对象
   * @return  {Boolean} 是否为空对象
  */
  wx.isEmptyObject = function(object) {
    for (var key in object){
      return false;
    }
    return true;
  };

  /**
   * 获得URL中以GET方式传输的参数
   * @name    getParamByName
   * @param   {String} 要获得的参数名
   * @return  {String} 指定参数名的值
  */
  wx.getParamByName = function(name) {
    var match = new RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
  };

  /**
   * 将Json数据转为String
   * @name    jsonToString
   * @param   {Object}  要转化的json对象
   * @param   {Boolean} 是否要进行转码以备URL传输
   * @return  {String}  转化后的字符串
  */
  wx.jsonToString = function(json, isEncode) {
    var strTemp = "";
    for (var key in json) {
      strTemp += key + '=' + (isEncode?encodeURIComponent(json[key]):json[key]) + '&';
    }
    return strTemp.slice(0, -1);
  };

  /**
   * 将String转为Json
   * @name    stringToJson
   * @param   {String}  要转化的字符串
   * @param   {Boolean} 是否要进行转码
   * @return  {String}  转化后的Json对象
  */
  wx.stringToJson = function(string,isDecode) {
    var tempURL = string.split('&'), json="";
    for(var i = 0;i<tempURL.length;i++){
      var t = tempURL[i].split('=');
      json += "'"+t[0]+"':'"+(isDecode?decodeURIComponent(t[1]):t[1])+"',";
    }
    return eval("({"+json.slice(0,-1)+"})");
  };

  /**
   * 去掉空格
   * @name    trim
   * @param   {String}  要去掉空格的字符串
   * @param   {Boolean} 是否去掉字符串中间的空格
   * @return  {String}  处理过的字符串
  */
  wx.trim = function(str, is_global) {
    if(!str) return "";
    var result = str.replace(/(^\s+)|(\s+$)/g, "");
    if (is_global) result = result.replace(/\s/g, "");
    return result;
  };

  /**
   * 获得页面的滚动高度，已被废弃
   * @name    getScrollTop
   * @return  {Integer}  高度
  */
  wx.getScrollTop = function() {
    return $(document).scrollTop();
  };

  /**
   * 用以解决回调地狱，参照Promise/A规范
   * @name    deferred
   * @return  {Object}  Promise对象
  */
  wx.deferred = function(){
    function Promise(){
      this.methods = [];
      this.isFirst = true;
    }
    Promise.prototype = {
      then : function(fn, context){
        this.methods.push({callback:fn,context:this});
        if(this.isFirst){
          this.next();
          this.isFirst = false;
        }
        return this;
      },
      next : function(){
        var _this = this,
            _next = this.methods.shift(),
             args = Array.prototype.slice.call(arguments);
        args.unshift(function(){
          if(_next)
            _this.next.apply(_this,arguments);
        });
        if(_next){
          _next.callback.apply(_next.context,args);
        }
      }
    };
    return new Promise();
  };

  /**
   * 数据发送
   * 使用节流方法避免双击等重复提交
   * @name    sendData
   * @param   {String}   发送地址
   * @param   {Object}   配置选项，如果为字符串则当做发送参数
   * @param   {Function} 请求返回后的回调方法
  */
  var _lastSendDataUrl,_lastUrlTimeout = wx.throttle(function(){_lastSendDataUrl="";},3000);
  wx.sendData=function(url, options, callback) {
    var ajaxObj     = null,
        _this       = this,
        timeoutId   = -1,
        timerLoadId = -1,
        currentUrl  = url+(options.param || options),
        urlParam    = options.param || ($.type(options) === "string" ? options : '');

    if(!options.dontCheck && currentUrl === _lastSendDataUrl){
      return;
    }
    _lastUrlTimeout();
    _lastSendDataUrl = currentUrl;
    if($.isFunction(options)){
      callback = options;
      options  = {};
    }
    if(options.showLoad){
       timerLoadId = window.setTimeout(function(){
          wx.loading();
       },options.loadDelay || 10);
    }
    if(options.sendTimeout){
      timeoutId = window.setTimeout(function(){ajaxObj.abort();if(callback) callback.call(_this,{"wxStatus":"timeout"});wx.alert("请求超时，请稍后再试！");},options.sendTimeout||20000);
    }
    ajaxObj = $.ajax({
      type: options.type || "post",
      url: url,
      async:options.async === false ? false : true,
      context:options.context || this,
      data: urlParam,
      dataType: options.dataType || "json",
      success:function(backData, textStatus) {
        if(options.showLoad)
          wx.popClose();
        window.clearTimeout(timerLoadId);
        if(options.sendTimeout)
          window.clearTimeout(timeoutId);
        if(backData[wx.config.dataFlag] == wx.config.dataDefaultAlertVal && (options.alertPrompt !== undefined ? options.alertPrompt : true)){
          wx.alert(backData.message || backData.info,function(){if(callback) callback.call(options.context || _this, backData, options.extData);});
        } else {
          if(callback === wx.RELOAD)
            location.reload();
          else if($.isFunction(callback))
            callback.call(options.context||_this, backData, options.extData);
        }
      },error:function(xhr, textStatus, errorThrown) {
        window.clearTimeout(timerLoadId);
        window.clearTimeout(timeoutId);
        if(callback)
          callback.call(_this,{"wxStatus":"error",message:textStatus});
      }
    });
  };

  /**
   * 弹出loading
   * @name    loading
   * @param   {Function} 关闭后的回调方法
   * @param   {Object}   配置选项
   * @return  {String}   pop对象
  */
  wx.loading = function(callback, opts) {
    if(!$.isFunction(callback) && $.type(callback) === "object")
        opts = callback;
    opts = opts || {};

    opts.content = $.type(callback) === "string" ? callback : (opts.text ? opts.text : null);
    return _pop(wx.tpl(wx.config.loading,opts),callback,opts);
  };

  /**
   * 弹出信息
   * @name    alert
   * @param   {String}    弹出内容
   * @param   {Function}  关闭后的回调方法
   * @param   {Object}    配置选项
   * @return  {String}    pop对象
  */
  wx.alert = function(content, callback, opts) {
    if(!content) return;
    if(!$.isFunction(callback) && $.type(callback) === "object")
      opts = callback;
    opts = opts || {};

    opts.content = content;
    wx.config.alert = _configTplTranslate(wx.config.alert);

    return _pop(wx.tpl(wx.config.alert,opts),callback,opts);
  };

  /**
   * 弹出确认
   * @name    confirm
   * @param   {String}    弹出内容
   * @param   {Function}  确定后的回调方法
   * @param   {Object}    配置选项
  */
  wx.confirm = function(content, callback, opts) {
    if(!content) return;
    if(!$.isFunction(callback) && $.type(callback) === "object")
      opts = callback;
    opts = opts || {};

    opts.content = content;
    wx.config.confirm = _configTplTranslate(wx.config.confirm);

    opts.shown = function(){
      $("#Js-confirm-ok").click(function(){
        if($.isFunction(callback))
          callback();
        wx.popClose();
      });
    };
    return _pop(wx.tpl(wx.config.confirm,opts),opts);
  };

  /**
   * 弹框关闭
   * @name    popClose
  */
  wx.popClose = function() {
    if(_globalData.currentPop)
      _globalData.currentPop.close();
  };

  /**
   * 弹框
   * @name    pop
   * @param   {String}    弹出内容
   * @param   {Function}  关闭后的回调方法
   * @param   {Object}    配置选项
   * @return  {String}    pop对象
  */
  wx.pop = function(content, callback, opts) {
    if(!content) return;
    if(!$.isFunction(callback) && $.type(callback) === "object")
      opts = callback;
    opts = opts || {};
    var temp;
    if(/^#/.test(content)){
      if(!$(content).length) return;
      temp = '<div class="pop form" '+(opts.width ? 'style="width:'+opts.width+'"': '')+'>'+$(content).html()+'</div>';
      if(opts.removeAfterShow)
       $(content).remove();
    } else{
      temp = '<div class="pop form" '+(opts.width ? 'style="width:'+opts.width+'"': '')+'>'+content+'</div>';
    }
    return _pop(temp,callback,opts);
  };

  //解决弹出模板问题
  function _configTplTranslate(string){
    return string.replace('<%',wx.config.tplOpenTag).replace('%>',wx.config.tplCloseTag);
  }

  //弹框的核心方法
    function _pop(content, callback, opts) {
    if(!$.isFunction(callback) && $.type(callback) === "object")
      opts = callback;
    opts = opts||{};

    if(callback === wx.RELOAD){
      callback = function(){
        location.reload();
      };
    } else if(callback === wx.BACK){
      callback = function(){
        history.back(-1);
      };
    } else if(callback && $.type(callback) === "string"){
      var jumpUrl = callback;
      callback = function(){
        location.href = jumpUrl;
      };
    }
    //立刻执行回调函数，不弹出浮框
    if(opts.notPop){
      callback();
      return;
    }
    $(".Js-pop").stop().remove();
    var htmlText = content;
    var temp = _getShadeLayer("Js-pop")+
                "<div id='Js-pop-body' class='Js-pop pop-container'>"+
                  htmlText+
                "</div>";
    $("body").append(temp).keyup(function(event){
      if(event.keyCode === 27)
        _close();
    });

    $("#Js-pop-body").children().show();
    _setEleToCenter("#Js-pop-body",opts);
    _moveAction(".title","#Js-pop-body");

    function _close(){
      if(opts.attachBg) $("body").css({"overflow":"auto","position":"static","height":"auto"});
      $("body").unbind("keyup");
      $(".Js-pop-close").unbind("click");
      _closeAni("#Js-pop-body",function(){
         $(".Js-pop").hide().remove();
      },opts);
      _globalData.currentPop = null;
    }

    if(opts.layerClick){
      $("#Js-shadeLayer").unbind("click").click(function(){
        _close();
      });
    }
    if(opts.attachBg){
      $("body").css({"overflow":"hidden","position":"relative","height":$(window).height()});
      $("#Js-shadeLayer").css({"width":$(window).width(),"height":$(window).height()});
    }
    _popAni("#Js-pop-body",function(){
      _pluginCheck("#Js-pop-body");
      if($.isFunction(opts.shown)){
        opts.shown();
      }
      if(wx.browser.msie && wx.browser.version === 6){
        if(typeof DD_belatedPNG !== "undefined") DD_belatedPNG.fix('.ie6fixpic');
      }
      wx.validator();
      $(".Js-pop-close").click(function(){
       _close();
       if($.isFunction(callback))
          callback();
       else if($.isFunction(opts.close))
          opts.close();
      });
      if(opts.autoClose){
        window.setTimeout(function(){
          _close();
        },opts.autoCloseTime || 3000);
      }
    },opts);

    _globalData.currentPop = {
      close : _close,
      open  : function(){
        _pop(htmlText,callback,opts);
      }
    };

    return _globalData.currentPop;
  }

  //弹出效果
  function _popAni(id, callback, opts) {
    if(!$.isFunction(callback) && $.type(callback) === "object")
      opts = callback;
    opts = opts||{};
    var o  = $(id);
    if(opts.notAni){
      o.show();
      if($.isFunction(callback))
        callback();
    } else {
      var top = parseInt(o.css("top").slice(0,-2));
      o.css("opacity",0);
      o.stop().animate({"opacity":1,"top":top+30},400,$.isFunction(callback)?callback:undefined);
    }
  }

  //弹出关闭
  function _closeAni(id, callback, opts) {
    if(!$.isFunction(callback) && $.type(callback) === "object")
      opts = callback;
    opts = opts||{};
    var o = $(id);
    if(opts.notAni){
      $("#Js-shadeLayer").css("opacity",0);
      o.css("opacity",0);
      if(callback)
        callback();
    } else {
      var top = parseInt(o.css("top").slice(0,-2));
      $("#Js-shadeLayer").animate({"opacity":0},200);
      o.stop().animate({"opacity":0,"top":top-30},300,callback);
    }
  }

  //将元素设置为居中
  function _setEleToCenter(eleId, opts) {
    opts = opts || {};
    var y      = opts.offsetY || -150,
        $ele   = $(eleId),
        width  = $ele.width(),
        height = $ele.height();

    if((wx.browser.msie && wx.browser.version <= 7) || opts.scrollFollow){
      y += $(document).scrollTop()+_winHeight/2-height/2;
      $ele.css("position","absolute");
    } else {
      y += _winHeight/2-height/2;
      $ele.css("position","fixed");
    }
    $ele.css({"top" : opts.y || (y<0 ? 10 : y),
              "left": opts.x || (_winWidth/2-width/2+(opts.offsetX||0)) });
  }


  //使元素可拖拽移动
  function _moveAction(moveBar, moveBody) {
    var isMove      = false,
        lastX       = -1,
        lastY       = -1,
        offsetX     = -1,
        offsetY     = -1,
        $winBody    = $("body"),
        $moveBar    = $(moveBar),
        $moveBody   = $(moveBody),
        isAbsoluate = $moveBody.css("position") === "absolute" ? true : false;

    if($moveBar.length === 0 || $moveBody.length === 0) return;
    $moveBar.css("cursor","move").unbind("mousedown").
      bind("mousedown",function(event){
        event.preventDefault();
        var body  = $moveBody,
            tempX = body.offset().left,
            tempY = body.offset().top - (isAbsoluate ? 0 : $(document).scrollTop());
        isMove  = true;
        lastX   = event.clientX;
        lastY   = event.clientY;
        offsetX = event.clientX - tempX;
        offsetY = event.clientY - tempY;
        $winBody.unbind("mousemove").bind("mousemove",function(event){
            if(!isMove) return false;
            event.preventDefault();
            event.stopPropagation();
            lastX = event.clientX - lastX;
            lastY = event.clientY - lastY;
            body.css({"left" : event.clientX-lastX-offsetX,"top" : event.clientY-lastY-offsetY});
            lastX = event.clientX;
            lastY = event.clientY;
        });
    }).unbind("mouseup").bind("mouseup",function(event){
        isMove = false;
        $winBody.unbind("mousemove");
    });
    $winBody.unbind("mouseup").bind("mouseup",function(){
        isMove = false;
    });
    $moveBar.blur(function(){
        isMove = false;
        $winBody.unbind("mousemove");
    });
  }

   //获得蒙版层
  function _getShadeLayer(layerClass) {
    var window_height = $('body').outerHeight() > _winHeight?$('body').outerHeight() : _winHeight;
    return '<div id="Js-shadeLayer" class="'+layerClass+' pop-bg" style="width:'+_winWidth+'px;height:'+window_height+'px;"></div>';
  }

  /**
   * 获取cookie和设置cookie
   * @name    cookie
   * @param   {String}  名字
   * @param   {String}  值
   * @param   {Object}  配置选项
   * @return  {String}  当只有名字时返回名字对应值
  */
  wx.cookie = function(name, value, options) {
    if (typeof value !== 'undefined') {
      options = options || {};
      if (value === null) {
        value = '';
        options = $.extend({}, options);
        options.expires = -1;
      }
      var expires = '';
      if (options.expires && (typeof options.expires === 'number' || options.expires.toUTCString)) {
        var date;
        if (typeof options.expires === 'number') {
          date = new Date();
          date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
        } else {
          date = options.expires;
        }
        expires = '; expires=' + date.toUTCString();
      }
      var path = options.path ? '; path=' + (options.path) : ';path=/';
      var domain = options.domain ? '; domain=' + (options.domain) : '';
      var secure = options.secure ? '; secure' : '';
      document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
    } else {
      var cookieValue = null;
      if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
          var cookie = wx.trim(cookies[i]);
          if (cookie.substring(0, name.length + 1) === (name + '=')) {
            cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
            break;
          }
        }
      }
      return cookieValue;
    }
  };

  /**
   * 删除cookie的快捷方法
   * @name    removeCookie
   * @param   {String}  名字
  */
  wx.removeCookie = function(key) {
    wx.cookie(key,'',{expires:-1});
  };

  //创建flash对象
  function _createSwfObject(src, attributes, parameters) {
    var i, html, div, obj, attr = attributes || {}, param = parameters || {};
    $.extend(param, {wmode:"transparent",allowScriptAccess:"always",quality:"high",menu:"false",scale:"noScale",bgcolor:"#E0F8E2"});

    attr.type = 'application/x-shockwave-flash';
    if (window.ActiveXObject) {
      attr.classid = 'clsid:d27cdb6e-ae6d-11cf-96b8-444553540000';
      param.movie = src;
    } else {
      attr.data = src;
    }
    html = '<object';
    for (i in attr) {
      html += ' ' + i + '="' + attr[i] + '"';
    }
    html += '>';
    for (i in param) {
      html += '<param name="' + i + '" value="' + param[i] + '" />';
    }
    html += '</object>';
    div = document.createElement('div');
    div.innerHTML = html;
    obj = div.firstChild;
    div.removeChild(obj);
    return obj;
  }

  /**
   * 加载flash文件
   * @name    loadFlash
   * @param   {String}    名字
   * @param   {Object}    属性
   * @param   {Object}    参数
   * @param   {Function}  加载后的回调方法
   * @return  {Object}    包含flash的object元素
  */
  wx.loadFlash = function(flashName, attrs, options, callback) {
    callback = callback || function(){};
    if($("#"+attrs.id).length){
        callback(window[attrs.id]);
        return "";
    } else{
      //此方法由actionscript调用
      window.wxFlashLoaded = function(){
        callback(window[attrs.id]);
      };
      return _createSwfObject((wx.config.flashUrl || wx.config.baseUrl)+"flash/"+flashName+'.swf?t='+new Date().getTime(),attrs, options);
    }
  };

  /**
   * 本地存储，在低版本下使用flash解决
   * @name    data
   * @param   {String}    名字
   * @param   {String}    参数
   * @param   {Function}  通过回调方法获取值
  */
  wx.data = function(key, value, callback) {
    var ls = window.localStorage;
    if(ls){
        if($.isFunction(value)){
          value(ls.getItem(key));
        } else {
          if(!callback){
            callback = function(isSucc){
              if(!isSucc && typeof isSucc !== "undefined") throw new Error("wx.data localStorage error");
            };
          }
          if(value === -1)
            callback(ls.removeItem(key));
          else
            callback(ls.setItem(key,value));
        }
    } else {
      var flash = wx.loadFlash("wx",{id:"wx-falsh",width:1,height:1},{},function(flashObj){
        if($.isFunction(value)){
          value(flashObj.loadData(key));
        } else {
          if(!callback){
            callback = function(isSucc){
              if(!isSucc) throw new Error("wx.data flash error");
            };
          }
          if(value === -1)
            callback(flashObj.deleteData(key));
          else
            callback(flashObj.saveData(key,value));
        }
      });
      $("body").append(flash);
    }
  };

  /**
   * 模板引擎
   * @name    tpl
   * @param   {String}  所要使用的模板，可以是id也可以是字符串
   * @param   {String}  需要结合的数据
   * @param   {String}  模板和数据结合后将append到这个元素里
  */
  wx.tpl = function(template,data,appendEle){
    wx.tpl.cache = wx.tpl.cache || {};
    if(!wx.tpl.cache[template]){
      var content    = template,
          match      = null,
          lastcursor = 0,
          codeStart  = 'var c = [];',
          codeEnd    = 'return c.join("");',
          param      = "",
          compileTpl = "",
          checkEXP   = /(^( )?(if|for|else|switch|case|continue|break|{|}))(.*)?/g,
          searchEXP  = new RegExp(wx.config.tplOpenTag+"(.*?)"+wx.config.tplCloseTag+"?","g"),
          replaceEXP = /[^\w$]+/g;

      if(template.charAt(0) === "#")
        content = $(template).html();
      else
        content = template;

      while(match = searchEXP.exec(content)){
        var b = RegExp.$1;
        var c = content.substring(lastcursor,match.index);
        c = _formatString(c);
        compileTpl += 'c.push("'+c+'");\n';
        if(checkEXP.test(b)){
          compileTpl += b;
        }
        else{
          compileTpl += 'c.push('+b+');\n';
        }
        _setVar(b);
        lastcursor = match.index+match[0].length;
      }
      compileTpl+= 'c.push("'+wx.trim(_formatString(content.substring(lastcursor)))+'");';
      wx.tpl.cache[template] = new Function('data','helper',param+codeStart+compileTpl+codeEnd);
    }

    var result = wx.tpl.cache[template].call(null,data,wx.tpl.helperList);
    if(appendEle){
     $(appendEle).append(result);
    }

    function _formatString(s){
      return s.replace(/^\s*|\s*$/gm, '').replace(/[\n\r\t\s]+/g, ' ').replace(/"/gm,'\\"');
    }

    function _setVar(code){
      code = code.replace(replaceEXP,',').split(',');
      for(var i=0,l=code.length;i<l;i++){
        code[i] = code[i].replace(checkEXP,'');
        if(!code[i].length || /^\d+$/.test(code[i])) continue;
        if(wx.tpl.helperList && code[i] in wx.tpl.helperList)
          param += code[i]+' = helper.'+code[i]+';';
        else
          param += 'var '+code[i]+' = data.'+code[i]+';';
      }
    }
    return result;
  };

  /**
   * 表单验证
   * @name    validator
  */
  wx.validator = function() {
    var prefix = wx.validator.config["validatorPrefix"],
        $form  = $("form["+prefix+"]");
    $form.each(initElement);

    function initElement(){
      var $thisForm = $(this),
          formInfo  = getFormInnerElement($thisForm);
      if($thisForm.data("hasValidator"))
        return;
      $thisForm.attr("autocomplete","off");
      $("a[type='submit']",$thisForm).click($.proxy(checkAll,this));
      $thisForm.submit($.proxy(checkAll,this));
      if(formInfo.entSubmit === "on"){
        formInfo.$input.filter(":visible :last").keydown(function(event) {
          if(event.keyCode === 13) $thisForm.submit();
        });
      }
      formInfo.$select.each(function(){
        var $thisSelect = $(this),
            thisAttr    = {"va" : $thisSelect.attr(prefix+"-error-value"),
                           "me" : prefix+"-"+$thisSelect.attr("name")+"-error",
                           "st" : $thisSelect.attr(prefix+"-show-type") || "normal",
                           "su" : $("#"+prefix+"-"+$thisSelect.attr("name")+"-success",$thisForm),
                           "nt" : typeof $thisSelect.attr(prefix+"-notip") !== "undefined"};
        if(!thisAttr['va']) return;
        $thisSelect.blur(function(){
          var $this = $(this);
          $("#"+thisAttr["me"]).hide();
          thisAttr["su"].hide();
          $("#"+formInfo.singleErr).text("");
          if(wx.trim($this.val()) === wx.trim(thisAttr["va"])){
            setFirstErrorMessage($thisForm,$this.attr(thisAttr["me"]),$this,thisAttr["me"]);
            if(!thisAttr["nt"]){
              if(formInfo.singleErr !== 'off'){
                $("#"+formInfo.singleErr).text($this.attr(thisAttr["me"]));
              } else if($("#"+thisAttr["me"]).length){
                $("#"+thisAttr["me"],$thisForm).show();
              } else if($this.attr(thisAttr["me"])){
                if(thisAttr["st"] === "pop")
                  wx.alert($this.attr(thisAttr["me"]));
                else
                  $this.after('<'+formInfo.errTag+' id="'+thisAttr["me"]+'" class="'+formInfo.errClass+'">'+$this.attr(thisAttr["me"])+'</'+formInfo.errTag+'>');
              }
            }
            $thisForm.data("valid",false);
          } else if(thisAttr["su"].length){
            thisAttr["su"].show();
          }
        });
      });
      formInfo.$checkbox.each(function(){
        var $thisCheckbox = $(this),
            thisAttr      = {"nc" : prefix+"-"+$thisCheckbox.attr("name")+"-nocheck",
                             "st" : $thisCheckbox.attr(prefix+"-show-type") || "normal",
                             "su" : $("#"+prefix+"-"+$thisCheckbox.attr("name")+"-success",$thisForm),
                             "nt" : typeof $thisCheckbox.attr(prefix+"-notip") !== "undefined"};
        thisAttr["me"] = $thisCheckbox.attr(thisAttr["nc"]);
        $thisCheckbox.blur(function(){
          $("#"+thisAttr["nc"]).hide();
          thisAttr["su"].hide();
          if(!$thisCheckbox.is(":checked") && thisAttr["me"]){
            setFirstErrorMessage($thisForm,thisAttr["me"],$thisCheckbox,thisAttr["nc"]);
            if(!thisAttr["nt"]){
              if(formInfo.singleErr !== 'off'){
                $("#"+formInfo.singleErr).text(thisAttr["me"]);
              } else if($("#"+thisAttr["nc"]).length){
                $("#"+thisAttr["nc"],$thisForm).show();
              } else {
                if(thisAttr["st"] === "pop")
                  wx.alert(thisAttr["me"]);
                else
                  $thisCheckbox.after('<'+formInfo.errTag+' id="'+thisAttr["nc"]+'" class="'+formInfo.errClass+'">'+thisAttr["me"]+'</'+formInfo.errTag+'>');
              }
            }
            $thisForm.data("valid",false);
          } else if(thisAttr["su"].length){
            thisAttr["su"].show();
          }
        });
      });
      formInfo.$input.each(function(){
        var $thisInput = $(this),
            thisAttr   = {"ph" : $thisInput.attr(prefix+"-placeholder"),
                          "et" : ($thisInput.attr(prefix+"-event-type") || "blur"),
                          "ru" : $thisInput.attr(prefix+"-rule"),
                          "pa" : $thisInput.attr(prefix+"-param"),
                          "ls" : $thisInput.attr(prefix+"-left-show"),
                          "lm" : $thisInput.attr(prefix+"-left-mode") || "normal",
                          "st" : $thisInput.attr(prefix+"-show-type") || "normal",
                          "na" : prefix+"-"+$thisInput.attr("name")+"-",
                          "nt" : typeof $thisInput.attr(prefix+"-notip") !== "undefined",
                          "nb" : $thisInput.attr(prefix+"-noBasicRule")};
        if(formInfo.autocomp === "off"){
          $thisInput.val("");
        }
        if(thisAttr["ph"]){
          if('placeholder' in this){
            $thisInput.attr("placeholder",thisAttr["ph"]);
            $thisInput.next('.wx-placeholder').remove();
          } else {
            var $inputNotice = $thisInput.next('.wx-placeholder').length ?
                               $thisInput.next('.wx-placeholder') :
                               $('<span class="wx-placeholder" style="position:absolute;top:'+($thisInput.position().top+12)+'px;left:'+($thisInput.position().left+10)+'px">'+thisAttr["ph"]+'</span>');
            $inputNotice.click(function(){
              $thisInput.focus();
            })
            $thisInput.after($inputNotice);
            if(!$thisInput.val().length){
              $inputNotice.show();
            } else{
              $inputNotice.hide();
            }
            $thisInput.bind("propertychange input blur",function(){
              if($thisInput.val().length)
                $inputNotice.hide();
              else
                $inputNotice.show();
            });
          }
        }
        $thisInput.bind(thisAttr["et"],function(){
            if(!thisAttr["ru"])
              return;
            var inputValue = $thisInput.val() === thisAttr["ph"] ? "" : wx.trim($thisInput.val(),"g"),
                inputParam = thisAttr["pa"] ? thisAttr["pa"].split("|") : "",
                $inputSucc = $("#"+thisAttr["na"]+"success",$thisForm),
                $inputErro = $("#"+thisAttr["na"]+"error",$thisForm),
                inputValid = true;

            $("[id^='"+thisAttr["na"]+"']",$thisForm).not("#"+thisAttr["na"]+"left").hide();
            $inputSucc.hide();
            $thisInput.removeClass("wx-inputErrBorder");
            $("#"+formInfo.singleErr).text("");
            $.each(thisAttr["ru"].split("|"),function(i,n){
              if(wx.validator.rule[n] && !wx.validator.rule[n](inputValue,inputParam[i] || "")){
                var errorFlag = thisAttr["na"]+n,
                    errorText = $thisInput.attr(errorFlag) || wx.validator.config[n].replace("@",inputParam[i]||"");
                inputValid = false;
                setFirstErrorMessage($thisForm,errorText,$thisInput,errorFlag);
                if(!thisAttr["nt"]){
                  if(formInfo.singleErr !== 'off'){
                    $("#"+formInfo.singleErr).text(errorText);
                    $(".wx-inputErrBorder").removeClass("wx-inputErrBorder");
                  } else if($inputErro.length){
                    $inputErro.show();
                  } else if($("#"+errorFlag,$thisForm).length){
                    $("#"+errorFlag,$thisForm).show();
                  } else {
                    if(thisAttr["st"] === "pop")
                      wx.alert(errorText);
                    else
                      $thisInput.after('<'+formInfo.errTag+' id="'+errorFlag+'" class="'+formInfo.errClass+'">'+errorText+'</'+formInfo.errTag+'>');
                  }
                }
                $thisForm.data("valid",false);
                $thisInput.addClass("wx-inputErrBorder");
                return false;
              }
          });
          if(inputValid && $inputSucc.length)
            $inputSucc.show();
        });
        if(thisAttr["ls"]){
          var $leftShowTo = $("#"+thisAttr["na"]+"left",$thisForm),
              mode        = (thisAttr["lm"] === "byte" ? 1 : 0),
              maxLength   = parseInt(thisAttr["ls"]),
              inputColor  = $leftShowTo.css("color");
          if(!$leftShowTo.length) return;
          $thisInput.bind("keyup",function(){
            var allCount = mode ? $(this).val().getBytes() : $(this).val().length,
               leftCount = maxLength - allCount;
            if(leftCount>=0){
                $leftShowTo.css("color",inputColor);
            }
            else{
                $leftShowTo.css("color","red");
            }
            $leftShowTo.text(leftCount);
          });
        }
      });
      $thisForm.data("hasValidator",true);
      wx.validator[$thisForm.attr("name")] = new FormValidator($thisForm);
    }

    function FormValidator(form){
      this.$thisForm  = form;
      this.formInfo   = getFormInnerElement(form);
    }
    FormValidator.prototype.valid = function(){
      this.$thisForm.data("valid",true);
      this.formInfo.$input.each(function(){
        $(this).trigger($(this).attr(prefix+"-event-type")||"blur");
      });
      this.formInfo.$select.trigger("blur");
      this.formInfo.$checkbox.trigger("blur");
      return this.$thisForm.data("valid");
    };

    function checkAll(event, isNoConfirm) {
      var $thisForm  = $(this),
          isAjax     = typeof $thisForm.attr(prefix+"-ajax") !== "undefined" ? "&ajax=1" : "",
          handleAjax = $thisForm.attr(prefix+"-ajax") || $thisForm.attr(prefix+"-ajax-action"),
          action     = $thisForm.attr("action"),
          callback   = $thisForm.attr("name"),
          formInfo   = getFormInnerElement($thisForm);
      $thisForm.data("valid",true);
      resetFirstErrorMessage($thisForm);
      formInfo.$input.each(function(){
        var $thisInput = $(this);
        $thisInput.trigger($thisInput.attr(prefix+"-event-type")||"blur");
      });
      formInfo.$select.trigger("blur");
      formInfo.$checkbox.trigger("blur");
      var $submitErr = $("#"+prefix+"-submit-error");
      $submitErr.hide();

      if(!$thisForm.data("valid")){
        if(window.returnValue) window.returnValue = false;
        event.preventDefault();
        var message = $submitErr.length || formInfo.$submitBn.attr(prefix+"-submit-error");
        if(message){
          if($.type(message) === "number")
            $submitErr.show();
          else
             wx.alert(message);
        } else if(formInfo.singleErr){
          $("#"+formInfo.singleErr).text(getFirstErrorMessage($thisForm).m);
          $(".wx-inputErrBorder").removeClass("wx-inputErrBorder");
          getFirstErrorMessage($thisForm).e.addClass("wx-inputErrBorder");
        }else if(typeof formInfo.$submitBn.attr(prefix+"-get-error") !== "undefined"){
          wx.alert(getFirstErrorMessage($thisForm).m);
        }
        if(!formInfo.noScroll){
          var errorEleTop = getFirstErrorMessage($thisForm).e.offset().top - getFirstErrorMessage($thisForm).e.height();
          if(errorEleTop < $(document).scrollTop()){
            $('html,body').animate({"scrollTop":errorEleTop},1000,function(){
              var $errEle = $("#"+getFirstErrorMessage($thisForm).i),count = 0;
              var tId = setInterval(function(){if(count%2)$errEle.show();else $errEle.hide();count++},300);
              setTimeout(function(){clearInterval(tId);$errEle.show();},2000);
            });
          }
        }
      } else {
        var confirmText = formInfo.$submitBn.attr(prefix+"-submit-confirm");

        if(confirmText && !isNoConfirm){
          wx.confirm(confirmText,function(){
            $thisForm.trigger("submit",true);
          });
          return false;
        }
        if(window[callback+"_before"] && !window[callback+"_before"]($thisForm,$(event.target))){
            return false;
        }
        if(isAjax){
          if(window.returnValue) window.returnValue = false;
          event.preventDefault();
          if(handleAjax){
            wx.sendData(action,$thisForm.serialize()+isAjax,function(ajData){
              if(ajData[wx.config.dataFlag] == wx.config.dataSuccessVal){
                var ajaxAction = handleAjax.split("-");
                wx.alert(ajData.info||ajData.message||ajData[wx.config.dataInfo],ajaxAction[0].toUpperCase() === "JUMP" ? ajData[wx.config.dataJumpFlag] : wx[ajaxAction[0].toUpperCase()],{notPop:ajaxAction.length===2});
              }
              else{
                wx.alert(ajData.info||ajData.message||ajData[wx.config.dataInfo]);
              }
            });
          } else{
            wx.sendData(action,$thisForm.serialize()+isAjax,$.isFunction(window[callback]) ? window[callback] : undefined);
          }
        } else {
          if(event.currentTarget.nodeType === 1)
            $thisForm.off('submit').submit();
        }
      }
    }
    function getFormInnerElement($form){
      return{
        $checkbox : $("input[type=checkbox]",$form),
        $select   : $("select",$form),
        $input    : $("input,textarea",$form).not("[type=submit]").not("[type=radio]").not("[type=checkbox]"),
        $submitBn : $("a[type='submit']",$form).length ? $("a[type='submit']",$form) : $("input[type='submit']",$form),
        errClass  : $form.attr(prefix+"-error-class")||"error-text",
        errTag    : $form.attr(prefix+"-error-tag")||"span",
        autocomp  : $form.attr(prefix+"-autocomplete")||"on",
        entSubmit : $form.attr(prefix+"-entersubmit")||"on",
        singleErr : $form.attr(prefix+"-single-error")||"off",
        noScroll  : typeof $form.attr(prefix+"-noscroll") != "undefined"
      };
    }
    function setFirstErrorMessage($form, message, elem, errorId){
      if(!$form.data("firstError"))
        $form.data("firstError", {'m':message,'e':elem,'i':errorId});
    }
    function getFirstErrorMessage($form){
      return $form.data("firstError");
    }
    function resetFirstErrorMessage($form){
        $form.data("firstError", 0);
    }
  };
  wx.validator.config = {
    "validatorPrefix" : "wx-validator",
    "required"        : "不能为空",
    "email"           : "请填写正确的电子邮箱",
    "mobile"          : "请填写正确的手机号码",
    "telphone"        : "请填写正确的固定电话",
    "range"           : "请输入区间在@的字符",
    "min"             : "请输入不小于@的字符",
    "max"             : "请输入不大于@的字符",
    "rangeEqual"      : "请输入@位的字符",
    "rangelength"     : "请输入@位的字符",
    "minLength"       : "请输入不小于@位的字符",
    "maxLength"       : "请输入不大于@位的字符",
    "byteRangeEqual"  : "请输入@位的字符",
    "byteRangeLength" : "请输入@位的字符",
    "byteMinLength"   : "请输入不小于@位的字符",
    "byteMaxLength"   : "请输入不大于@位的字符",
    "equalTo"         : "请保持所填写的内容一致",
    "digits"          : "请填写数字",
    "post"            : "请填写正确的邮编号码",
    "cardId"          : "请填写正确的身份证号码",
    "noSymbol"        : "不能有符号",
    "url"             : "请使用正确格式，如http://www.website.com"
  };

  /**
   * 为验证添加新规则
   * @name    addNewRule
   * @param   {String}    规则名称
   * @param   {String}    错误信息
   * @param   {Function}  验证方法
  */
  wx.validator.addNewRule = function(ruleName,errorMessage,fn){
    if(!ruleName || !errorMessage || !fn) return;
    wx.validator.rule[ruleName]   = fn;
    wx.validator.config[ruleName] = errorMessage;
  };

  wx.validator.rule = {
    required: function(value){
      return value.length > 0;
    },
    email: function(value) {
      return value.length === 0 || /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i.test(value);
    },
    mobile: function(value){
      return value.length === 0 || /^1[3|4|5|7|8][0-9]\d{8}$/.test(value);
    },
    telphone: function(value){
      return value.length === 0 || /^(\d{3}-\d{8}|\d{4,5}-\d{7,8})$/.test(value);
    },
    range: function(value, param) {
      param = param.split("-");
      return value.length === 0 || (value >= parseFloat(param[0]) && value <= parseFloat(param[1]));
    },
    min: function(value, param ) {
      return value.length === 0 || (value >= parseFloat(param));
    },
    max: function( value, param ) {
      return value.length === 0 || value <= parseFloat(param);
    },
    rangeEqual: function(value, param) {
      return  value.length === 0 ||  value.length === parseInt(param);
    },
    rangelength: function(value, param) {
      param = param.split("-");
      return  value.length === 0 || ( value.length >= parseInt(param[0]) && value.length <= parseInt(param[1]) );
    },
    minLength:function(value, param){
      return value.length === 0 || value.length >= parseInt(param);
    },
    maxLength:function(value, param){
      return value.length === 0 || value.length <= parseInt(param);
    },
    byteRangeLength: function(value, param) {
      param = param.split("-");
      return  value.length === 0 || ( value.getBytes() >= parseInt(param[0]) && value.getBytes() <= parseInt(param[1]) );
    },
    byteMinLength: function(value,param){
      return value.length === 0 || value.getBytes() >= parseInt(param);
    },
    byteMaxLength:function(value, param){
      return value.length === 0 || value.getBytes() <= parseInt(param);
    },
    byteRangeEqual: function(value, param) {
      return  value.length === 0 ||  value.getBytes() === parseInt(param);
    },
    equalTo: function(value, equalToElement) {
      return value.length === 0 || value.length>0 && value === $("input[name='"+equalToElement+"']").val();
    },
    digits: function(value) {
      return value.length === 0 || /^\d+$/.test(value);
    },
    post: function(value) {
      return value.length === 0 || /^[0-9]{6}$/.test(value);
    },
    cardId: function(value) {
      return value.length === 0 || /^(\d{18,18}|\d{15,15}|\d{17,17}[xX])$/.test(value);
    },
    passport: function(value) {
      return value.length === 0 || /^1[45][0-9]{7}$|^G[0-9]{8}$|^P[0-9]{7}$|^S[0-9]{7,8}$|^D[0-9]+$/.test(value);
    },
    noSymbol: function(value) {
      return value.length === 0 || /^[\w|\u4e00-\u9fa5]*$/.test(value);
    },
    url: function(value){
      return value.length === 0 || /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(value);
    },
    basic:function(value){
      return !/select|update|delete|truncate|join|union|exec|insert|drop|count|'|"|;|>|<|%/i.test(value);
    }
  };

  /**
   * 懒加载
   * @name    lazyLoad
   * @param   {String}    运行上下文
  */
  wx.lazyLoad = function(context) {
    var $els = $(context || "body").find("[wx-lz]:visible"),
        showType = wx.config.lazyLoadShowType,
        threshold  = wx.config.lazyLoadThreshold,
        _height = window.screen.height;

    if(!$els.length) return;

    $els.one("appear",function(){
      var $self = $(this),
          url   = $self.attr("wx-lz");
      $self.loaded = true;
      $self.hide();
      $("<img />").on("load", function(){
        if($self.is("img"))
          $self.attr("src",url);
        else
          $self.css("background-image","url("+url+")");
        $self[showType]();
      }).attr("src",url);
    });

    function update(){
      $els.each(function(){
        var $self = $(this);
        if($self.loaded) return;
        checkPos($self);
      });
    }

    function checkPos($el){
      var scroll = $(document).scrollTop()+_height;
      if($el.offset().top < scroll+threshold){
        $el.trigger('appear');
      }
    }

    $(window).on("scroll",wx.throttle(update,100));
    update();
  };

  //页面初始化
  function _pageInit() {
    if(window.console === undefined){
      window.console = {log:function(){}};
    } else {
      wx.log = function(text){
        console.log("%c"+text,"color:red;font-size:20px;font-weight:bold");
      };
    }

    if(!wx.config.baseUrl){
      var url = ($("script[wx-main]").length ? $("script[wx-main]") : $("script:first")).attr("src").split('/');
      var src = url.slice(0,url.indexOf("js"));
      wx.config.baseUrl = src.length ? src.join('/')  + '/' : './';
    }

    if(wx.config.loading){
      _pageSetup();
    } else if(wx.config.baseUrl){
      var ls = window.localStorage;
      if(ls){
        var lastVersion = ls.getItem("wxVersion");
        if(lastVersion && lastVersion === wx.VERSION){
          window.setTimeout(function(){
           wx.config = wx.stringToJson(ls.getItem("wxconfig"),true);
           _pageSetup();
          },0);
        } else {
          $.getScript(wx.config.baseUrl+"js/wx.config.js",function(){
              _pageSetup();
              if(wx.config.cache){
                ls.setItem("wxVersion",wx.VERSION);
                ls.setItem("wxconfig",wx.jsonToString(wx.config,true));
              }
          });
        }
      } else {
        $.getScript(wx.config.baseUrl+"js/wx.config.js",_pageSetup);
      }
    } else {
      wx.log("请设置静态文件路径");
    }
  }

  //页面构建
  function _pageSetup() {
    _pluginCheck();

    try{
      var path = location.pathname.substring(1).split("/");
      if(wx.config.route == 1){
        if(path[1]){
          for (var i = 0,list = path[1].split("-"),len = list.length; i < len; i+=2) {
            wx.REQUEST[list[i]] = list[i+1];
          }
        }
        wx.MODULE = path[0].split("-")[0];
        wx.ACTION = path[0].split("-")[1] || "index";
      }
    }
    catch(e){wx.log("路径解析错误");}

    if($.isFunction(window.wxInit))
      window.wxInit();
  }

  //对原生进行扩展
  function _protoExtend(){
    var arrayProto = Array.prototype,stringProto = String.prototype;
    if(stringProto.getBytes === undefined){
      stringProto.getBytes = function() {
        var cArr = this.match(/[^x00-xff]/ig);
        return this.length + (cArr === null ? 0 : cArr.length);
      };
    }
    if(arrayProto.remove === undefined){
      arrayProto.remove = function(index){
        return index > this.length ? this : this.splice(index,1) && this;
      };
    }
    if(arrayProto.indexOf === undefined){
      arrayProto.indexOf = function(value){
        for (var i = 0,len = this.length; i < len; i++) {
          if(this[i] === value)
            return i;
        }
        return -1;
      };
    }
  }

  //浏览器类型
  function _browserCheck(){
    wx.browser = wx.browser || {version:0};
    var ua = navigator.userAgent.toLowerCase(),
      msie = ua.indexOf("compatible") !== -1 && ua.indexOf("msie") !== -1;

    if(msie){
      wx.browser.msie = true;
      /msie (\d+\.\d+);/.test(ua);
      wx.browser.version = parseInt(RegExp.$1);
    }
  }

  //插件检测
  function _pluginCheck(context){
    var $body = $(context || "body");

    var $wxUpload = $body.find("input[wx-upload]");
    _uploadPlugin($wxUpload);
  }

  function _uploadPlugin($upload) {
    var load = null;
    if($upload.length){
      if(wx.upload){
        uploadOnLoad();
      }
      else{
       $upload.click(function(){load = wx.loading("正在加载，请等待...");});
        $.getScript(wx.config.baseUrl+"js/wx.upload.js",uploadOnLoad);
      }
    }
    function uploadOnLoad(){
      if(load){
        load.close();
        load = null;
      }
      $upload.unbind("click").each(function(){
        wx.upload($(this));
      });
    }
  }

})(window, document, jQuery);
/**
* wx.config
*
* wx配置文件
* 在开启cache情况下，此文件只有在主文件的版本号更新时才会再次被下载
*
* @author xuyong <xuyong@ucfgroup.com>
* @createTime 2014-03-18
* @version 1.0.0
* @projectHome https://github.com/xu-yong/wx
*
* Released under the MIT license:
*   http://www.opensource.org/licenses/mit-license.php
*/


if(typeof wx !== "undefined" && typeof jQuery !== "undefined"){
  $.extend(wx.config, {

    //是否缓存此文件
    cache : true,

    //flash文件地址，如未指定将使用baseUrl
    flashUrl : '',

    /**
    路由地址类型
      0 不解析
      1 解析格式为：/module-action/param-1
    */
    route : 0,

    //默认上传地址
    uploadUrl : '',

    //默认上传类型，全部支持为 *
    //uploadType : 'jpeg|jpg|png|gif',
    uploadType : '*',

    //默认上传文件大小，以MB为单位
    uploadSize : '2',

    //懒加载的显示类型，可以是show或者是fadeIn
    lazyLoadShowType : 'show',

    //懒加载临界点
    lazyLoadThreshold : 100,

    //ajax请求返回数据成功与否的标示字段
    dataFlag : 'status',

    //ajax请求返回数据中的描述信息，用于向用户展示
    dataInfo : 'info',

    //ajax请求返回数据成功与否的判断数值
    dataSuccessVal : '1',

    //ajax请求返回数据中用于定义业务异常展示的数值
    dataDefaultAlertVal : '5',

    //ajax请求返回数据中用于获得跳转地址的字段
    dataJumpFlag : 'jump',

    //模板引擎解析时使用的开始标示符
    tplOpenTag : "<%",

    //模板引擎解析时使用的结束标示符
    tplCloseTag : "%>",

    //弹出框loading结构
    loading: '<table class="ui-dialog">\
      <tbody>\
          <td class="ui-dialog-body">\
            <div class="ui-dialog-content"><%content||"&nbsp;&nbsp;&nbsp;请等待..."%></div>\
          </td>\
        </tr>\
      </tbody>\
    </table>',

    //弹出框alert结构
    alert: '<table class="ui-dialog">\
      <tbody>\
        <tr class="title">\
          <td class="ui-dialog-header">\
            <%if(!noBtn){%>\
              <button class="ui-dialog-close Js-pop-close" title="取消">×</button>\
            <%}%>\
            <div class="ui-dialog-title"><%title||"提示"%></div>\
          </td>\
        </tr>\
        <tr>\
          <td class="ui-dialog-body">\
            <div class="ui-dialog-content"><%content%></div>\
          </td>\
        </tr>\
        <tr>\
          <td class="ui-dialog-footer">\
            <div class="ui-dialog-button">\
            <%if(!noBtn){%>\
              <button class="ui-dialog-autofocus Js-pop-close" type="button"><%okText||"确 定"%></button>\
            <%}%>\
            </div>\
          </td>\
        </tr>\
      </tbody>\
    </table>',

    //弹出框confirm结构
    confirm: '<table class="ui-dialog">\
      <tbody>\
        <tr class="title">\
          <td class="ui-dialog-header">\
            <button class="ui-dialog-close Js-pop-close" title="取消">×</button>\
            <div class="ui-dialog-title"><%title||"消息"%></div>\
          </td>\
        </tr>\
        <tr>\
          <td class="ui-dialog-body">\
            <div class="ui-dialog-content"><%content%></div>\
          </td>\
        </tr>\
        <tr>\
          <td class="ui-dialog-footer">\
            <div class="ui-dialog-button">\
              <button id="Js-confirm-ok" class="ui-dialog-autofocus" type="button"><%okText||"确 定"%></button>\
              <button class="Js-pop-close" type="button">取消</button>\
            </div>\
          </td>\
        </tr>\
      </tbody>\
    </table>'
  });
}

/**
* wx.upload
*
* 文件上传组件
* 支持三种上传方式，html5、flash和iframe
* 目的是以简单并且通用的方式解决上传问题
*
* @author xuyong <xuyong@ucfgroup.com>
* @createTime 2014-03-18
* @version 1.1.1
* @projectHome https://github.com/xu-yong/wx
*
* Released under the MIT license:
*   http://www.opensource.org/licenses/mit-license.php
*/

(function(window, document, $, wx, undefined){
    "use strict";

    if(wx.upload !== undefined)
        return;

    var W3C    = window.FormData !== undefined ? true : false,
        prefix = "wx-upload";

    wx.upload = function($elem) {
        var options = init($elem);
        if(!options.name || !options.url)
            return;

        if(W3C){
            $elem.change(h5);
        } else if(options.isUseFlash){
            flash($elem);
        } else{
            $elem.change(normal);
        }
    };

    function init($elem) {
        var options = {
            name       : $elem.attr("name"),
            url        : $elem.attr(prefix) || wx.config.uploadUrl || "",
            type       : $elem.attr(prefix+"-type") || wx.config.uploadType,
            size       : $elem.attr(prefix+"-size") || wx.config.uploadSize,
            set        : $elem.attr(prefix+"-set"),
            param      : $elem.attr(prefix+"-param") || "",
            assign     : $elem.attr(prefix+"-assign"),
            mult       : typeof $elem.attr(prefix+"-mult") != "undefined",
            loading    : typeof $elem.attr(prefix+"-load") != "undefined",
            isUseFlash : typeof $elem.attr(prefix+"-flash") != "undefined"
        };
        options.url      += options.url.indexOf("?") !== -1 ? "&_="+new Date().getTime() : "?_="+new Date().getTime();
        options.size     = options.size ? parseFloat(options.size)*1024*1024 : null;
        options.callback = $.isFunction(window[options.name]) ? window[options.name] : null;
        options.before   = $.isFunction(window[options.name+"_before"]) ? window[options.name+"_before"] : null;
        options.progress = $.isFunction(window[options.name+"_progress"]) ? window[options.name+"_progress"] : null;
        options.mult ? $elem.attr("multiple",true) : null;
        $elem.data("opt",options);
        $elem.attr('hidefocus','true');
        return options;
    }

    function before(options,$input) {
        var result = true;
        if(options.before)
            result = options.before($input);
        if(result && options.loading)
            wx.loading("正在上传...");
        return result;
    }

    function complete(responseText, options, $input) {
        try{
            var data = $.parseJSON(responseText);
            if(data[wx.config.dataFlag] == wx.config.dataSuccessVal){
                if(options.assign){
                    var assign = options.assign.split("&");
                    for(var i = 0; i<assign.length; i++){
                        var assVal     = "",
                            assignItem = assign[i].split("="),
                            $inputAss  = $("input[name='"+assignItem[0]+"']");
                        assVal = eval('data["'+assignItem[1].replace(/\./g,'"]["')+'"]');
                        if($inputAss.length)
                            $inputAss.val(assVal);
                        else
                            $input.before('<input name="'+assignItem[0]+'" value="'+assVal+'" style="display:none;">');
                    }
                }
                if(options.set){
                    var set   = options.set.split("&");
                    for(var i = 0; i<set.length; i++){
                        var setVal  = "",
                            setItem = set[i].split("="),
                            $elem   = $("#"+setItem[0]);
                        if($elem.length){
                            setVal = eval('data["'+setItem[1].replace(/\./g,'"]["')+'"]');
                            setVal += setVal.indexOf("?") !== -1 ? "&_"+new Date().getTime() : "?_="+new Date().getTime();
                            if($elem.is("img"))
                                $elem.attr("src",setVal);
                            else
                                $elem.css("background","url("+setVal+")");
                        }
                    }
                }
                if(options.loading)
                    wx.popClose();
                if(options.callback)
                    options.callback(data,$input);
            } else {
                wx.alert(data[wx.config.dataInfo]);
            }
        }
        catch(e){wx.log("uploadComplete error "+e);}
    }

    function h5() {
        var fd      = null,
            xhr     = null,
            files   = this.files,
            $input  = $(this),
            options = $input.data("opt");

        if(!before(options,$input)) return;

        for(var i=0; i<files.length; i++){
            if(options.size && files[i].size > options.size){
                wx.alert("上传的文件太大，请压缩后重新上传");
                continue;
            } else if(options.type && options.type !== "*" && (!files[i].type || options.type.indexOf(files[i].type.split("/")[1]) === -1)){
                wx.alert("文件格式不符");
                continue;
            }

            fd  = new FormData();
            xhr = new XMLHttpRequest();
            xhr.open("POST", options.url);
            bindEvent(xhr);
            addParam(fd);
            fd.append(options.name, files[i]);
            xhr.send(fd);
            fd = xhr = null;
            $input.unbind("change").val('').change(h5);
        }

        function addParam(fd){
            if(options.param){
                var tempURL = options.param.split('&');
                for(var i = 0;i<tempURL.length;i++){
                   var t = tempURL[i].split('=');
                   fd.append(t[0], t[1]);
                }
            }
        }

        function bindEvent(xhr){
            if(options.progress){
                xhr.upload.addEventListener("progress", function(evt){
                    if (evt.lengthComputable) {
                      options.progress(Math.round(evt.loaded * 100 / evt.total).toString(),$input);
                    } else {
                      wx.log('unable to compute');
                    }
                }, false);
            }
            xhr.addEventListener("load", function(evt){complete(evt.target.responseText,options,$input);}, false);
            xhr.addEventListener("error", function(error){complete('{"status:0",error:"'+error+'"}',options,$input);}, false);
        }
    }


    function flash($input) {
        var width    = $input.width(),
            height   = $input.height(),
            options  = $input.data("opt"),
            flashOpt = {};

        options.param += "&"+document.cookie.replace(/;/g,"&");
        if(options.url.indexOf('http') === -1)
            options.url = "http://"+location.host+options.url;
        options.url = encodeURIComponent(options.url);

        $.extend(flashOpt, options);

        if(flashOpt.progress)
            flashOpt.progress = flashOpt.progress.name;
        if(flashOpt.before)
            flashOpt.before = flashOpt.before.name;
        if(flashOpt.callback)
            flashOpt.callback = flashOpt.callback.name;
        flashOpt.param = encodeURIComponent(flashOpt.param);

        var falshObj = wx.loadFlash("wx",{id:"wx-falsh","width":width,"height":height},{flashvars:wx.jsonToString(flashOpt)});
        $input.before($('<div style="position:absolute;cursor:pointer;opacity:0;z-index:0;overflow:hidden;width:'+width+'px;height:'+height+'px;top:'+$input.position().top+'px;left:'+$input.position().left+'"></div>').append(falshObj));
        $input.remove();
        window.wxUploadFlashComplete = function(data) {
            complete(data,options,$input);
        };
        window.wxUploadFlashBefore = function(data) {
           return before(options);
        };
        window.wxUploadFlashError = function(data) {
            data = $.parseJSON(data);
            if(data.status === 2)
                wx.alert("上传的文件太大，请重新上传");
            else
                wx.alert("上传失败，请稍后重试");
        };
    }

    function normal() {
        var $iframe = null,
            $input  = $(this),
            $inputC = $input.clone(),
            options = $input.data("opt"),
            $form   = $('<form id="wx-upload-form" method="post" action="'+options.url+'" enctype="multipart/form-data" target="wx-upload-iframe"></form>');

        if(!before(options,$input)) return;

        if(wx.browser.msie && wx.browser.version == 6){
            var io = document.createElement('<iframe id="wx-upload-iframe" name="wx-upload-iframe" />');
            io.src = 'javascript:false';
            io.style.top = '-1000px';
            io.style.left = '-1000px';
            io.style.position = 'absolute';
            $iframe = $(io);
        } else {
            $iframe = $('<iframe name="wx-upload-iframe" style="display:none"></iframe>');
        }

        $input.parent().append($inputC);
        $form.css({"display":"none","position":"absolute","top":"-1000px","left":"-1000px"}).append($input);
        $iframe.appendTo('body');
        $form.appendTo('body');
        if(options.param){
            var tempURL = options.param.split('&'),
                param   = "";
            for(var i = 0;i<tempURL.length;i++){
               var t = tempURL[i].split('=');
               param += '<input name="'+t[0]+'" value="'+t[1]+'" style="display:none;">';
            }
            $form.append(param);
        }
        $iframe.on("load",function(){
            var content = this.contentWindow ? this.contentWindow : this.contentDocument,
                reponse = content.document.body ? content.document.body.innerHTML: null;
            complete(reponse,options,$input);
            $form.remove();
            $iframe.remove();
            $inputC.data("opt",options);
            $inputC.unbind("change").change(normal);
        });
        $form.submit();
    }
})(window,document,jQuery,wx);
window.zc = {};
loginDialog();

var gaTrack=function(){// 先初始化为空函数，不执行逻辑
};

$(function(){
    $('body').on('click','.js-checkLogin',function(){

        var href = $(this).data('href');
        if( $('#siteHTopBox').data('status') == 'off' ){
            zc.show_login(function(){
                location.href = href;
            })
        }else{
            location.href = href;
        }
    });
})



$(function () {
    //showUserList();
    getRegion();
    goTop();

    setTimeout(function(){
        agrantsemAnalytics();
        gaTrack = googleAnalytics();//gaTrack被正确赋值
        baizeAnalytics();
        zcAnalytics();
    }, 6000);

    //aysnYsh();
});

var loginRegisterJump = "";
function loginDialog() {
    var loginTpl = '<div class="titleWrap"><div class="title">登录<a class="shut-down-icon Js-pop-close"></a></div></div>\
                 <div class="logwrap clearfix Js-user-handle-box">\
                 <form action="/user-ajax_login" wx-validator wx-validator-ajax name="loginForm" wx-validator-single-error="registerFormError">\
                 <div class="logright"><span class="error-text"></span>\
                 <div class="linebg clearfix shell"><b class="fond"></b>合作账号登录<b class="back"></b></div>\
                 <div class="icon clearfix shell"><a class="qq" href="/qq-login"></a><a class="wx" href="/weixin-login"></a><a class="wb" href="/sina-login"></a></div>\
                 <div class="shell zhdl2"><a class="Js-mshowLogin" href="javascript:;">手机短信登录</a></div>\
                 <div class="shell login">没有账号？<a class="Js-showRegister fonthov" href="javascript:;">快速注册</a></div>\
                 </div>\
                 <div class="logleft"><span id="registerFormError" class="error-text"></span>\
                 <div class="shell clearfix"><input class="foc" name="username" wx-validator-rule="required" wx-validator-username-required="*请输入账号" wx-validator-placeholder="用户名/手机号/邮箱" type="text" ></div>\
                 <div class="shell clearfix"><input type="password"  name="user_pwd" wx-validator-rule="required|rangelength" wx-validator-param="|6-16"  wx-validator-user_pwd-required="*请输入密码" wx-validator-placeholder="密码"></div>\
                 <div class="numwrap shell clearfix hidden"><input disabled="disabled" type="text" name="code" wx-validator-code-required="*请输入图形验证码" wx-validator-placeholder="验证码"><a href="javascript:;"><img class="JS-m-code" style="width:78px;height:40px;"\
                src="/verify.php" onclick="this.src=\'/verify.php?\' + Math.random();" class="get-verification-code" />\
                 </a></div>\
                 <div class="shell submitwrap clearfix"><a id="login-btn" class="zc" href="javascript:;">登录</a><a class="wjmm" href="/user-getpassword">忘记密码</a></div>\
                 </div>\
                 </form>\
                 </div>';


    var mloginTpl = '<div class="titleWrap"><div class="title">登录<a class="shut-down-icon Js-pop-close"></a></div></div>\
                  <div class="logwrap clearfix Js-user-handle-box">\
                  <form action="/user-ajax_sms_login" wx-validator wx-validator-ajax name="mloginForm" wx-validator-single-error="registerFormError">\
                  <div class="logright">\
                  <div class="linebg clearfix shell"><b class="fond"></b>合作账号登录<b class="back"></b></div>\
                  <div class="icon clearfix shell"><a class="qq" href="/qq-login"></a><a class="wx" href="/weixin-login"></a><a class="wb" href="/sina-login"></a></div>\
                   <span class="error-text"></span>\
                  <div class="shell zhdl"><a class="Js-showLogin" href="javascript:;">账号登录</a></div>\
                  <div class="shell login">没有账号？<a class="Js-showRegister fonthov" href="javascript:;">快速注册</a></div>\
                  </div>\
                  <div class="logleft"><span id="registerFormError" class="error-text"></span>\
                  <div class="shell clearfix"><input class="foc" name="mobile" wx-validator-rule="required|mobile" wx-validator-username-required="*请输入手机号" wx-validator-placeholder="手机号(无需注册也可登录)" type="text"></div>\
                  <div class="numwrap shell clearfix"><input  type="text" name="code" wx-validator-code-required="*请输入图形验证码" wx-validator-placeholder="验证码"><a href="javascript:;"><img class="JS-m-code" style="width:78px;height:40px;"\
                  src="/verify.php" onclick="this.src=\'/verify.php?\' + Math.random();" class="get-verification-code" />\
                  </a></div>\
                  <div class="numwrap shell clearfix"><input wx-validator-rule="required" name="sms_code" type="text" wx-validator-sms_code-required="*请输入短信中的验证码" wx-validator-placeholder="短信验证码"><a id="Js-registerGetCode" data-type="log" href="javascript:;">获取</a></div>\
                  <div class="shell submitwrap clearfix"><a class="zc" href="javascript:;">登录</a></div>\
                  </div>\
                  </form>\
                  </div>';

    var registerTpl = '\
        <div class="titleWrap"><div class="title">注册<a class="shut-down-icon Js-pop-close"></a></div></div>\
        <div class="regwrap clearfix Js-user-handle-box">\
            <form action="/user-ajax_register"  wx-validator-ajax  wx-validator name="registerForm" wx-validator-single-error="registerFormError" >\
                 <div class="logright">\
                    <div class="linebg clearfix shell"><b class="fond"></b>合作账号登录<b class="back"></b></div>\
                    <div class="icon clearfix shell">\
                        <a class="qq" href="/qq-login"></a>\
                        <a class="wx" href="/weixin-login"></a>\
                        <a class="wb" href="/sina-login"></a>\
                    </div>\
                    <span class="error-text"></span>\
                    <div class="shell zhdl2 Js-showEmailRegister">\
                        <a href="javascript:;">邮箱注册</a>\
                    </div>\
                    <div class="shell login">已有账号？<a class="Js-showLogin fonthov" href="javascript:;">登录</a></div>\
                </div>\
                <div class="logleft">\
                    <span id="registerFormError" class="error-text"></span>\
                    <div class="shell clearfix">\
                        <input class="foc" name="mobile" type="text" wx-validator-mobile-required="*请输入手机号" wx-validator-mobile-mobile="*请输入正确手机号" wx-validator-rule="required|mobile" wx-validator-placeholder="手机号">\
                    </div>\
                    <div class="numwrap shell clearfix hidden">\
                        <input disabled="disabled"  type="text" name="code" wx-validator-code-required="*请输入图形验证码" wx-validator-placeholder="验证码">\
                        <a href="javascript:;">\
                            <img class="JS-m-code" style="width:78px;height:40px;" src="/verify.php" onclick="this.src=\'/verify.php?\' + Math.random();" class="get-verification-code" />\
                        </a>\
                    </div>\
                    <div class="codewrap shell clearfix">\
                        <input name="verify" wx-validator-rule="required" type="text" wx-validator-verify-required="*请输入短信中的验证码" wx-validator-placeholder="手机验证码">\
                        <a id="Js-registerGetCode" data-type="reg" href="javascript:;">获取</a>\
                    </div>\
                    <div class="shell clearfix">\
                        <input type="text"  name="user_pwd" wx-validator-user_pwd-required="*请输入密码" wx-validator-rule="required|rangelength" wx-validator-param="|6-16"  wx-validator-placeholder="密码">\
                    </div>\
                    <div class="shell submitwrap clearfix">\
                        <span>\
                            <input class="xy" name="article" wx-validator-article-nocheck="请阅读协议并勾选同意" type="checkbox" checked="checked">\
                            <label>阅读并同意</label>\
                            <a target="_blank" href="/help-registerpro">《用户注册服务协议》</a>\
                        </span>\
                        <br />\
                        <a type="submit" class="zc" href="javascript:;">注册</a></div>\
                </div>\
            </form>\
        </div>';
    var emailRegisterTpl ='\
        <div class="titleWrap"><div class="title">注册<a class="shut-down-icon Js-pop-close"></a></div></div>\
        <div class="logwrap clearfix Js-user-handle-box">\
            <form action="/user-ajax_register" wx-validator-ajax="" wx-validator="" name="registerEmailForm" wx-validator-single-error="registerFormError" autocomplete="off">\
                 <div class="logright">\
                    <div class="linebg clearfix shell">\
                        <b class="fond"></b>合作账号登录<b class="back"></b>\
                    </div>\
                    <div class="icon clearfix shell">\
                        <a class="qq" href="/qq-login"></a>\
                        <a class="wx" href="/weixin-login"></a>\
                        <a class="wb" href="/sina-login"></a>\
                    </div>\
                     <span class="error-text"></span>\
                    <div class="shell zhdl2 Js-showRegister"><a href="javascript:;">手机注册</a></div>\
                    <div class="shell login">已有账号？<a class="Js-showLogin fonthov" href="javascript:;">登录</a></div>\
                </div>\
                <div class="logleft">\
                    <span id="registerFormError" class="error-text"></span>\
                    <div class="shell clearfix">\
                        <input class="foc" name="email" type="text" wx-validator-email-required="*请输入邮箱" wx-validator-email-email="*请输入正确邮箱" wx-validator-rule="required|email"  wx-validator-placeholder="邮箱" placeholder="邮箱">\
                    </div>\
                    <div class="shell clearfix">\
                        <input type="text" name="user_pwd" wx-validator-user_pwd-required="*请输入密码" wx-validator-rule="required|rangelength" wx-validator-param="|6-16" wx-validator-placeholder="设置密码" placeholder="设置密码">\
                    </div>\
                    <div class="shell submitwrap clearfix">\
                        <span>\
                          <input class="xy" name="article" wx-validator-article-nocheck="请阅读协议并勾选同意" type="checkbox" checked="checked">\
                              <label>阅读并同意</label>\
                              <a target="_blank" href="/help-registerpro">《用户注册服务协议》</a>\
                        </span>\
                        <br>\
                        <a type="submit" class="zc" href="javascript:;">注册</a>\
                    </div>\
                </div>\
            </form>\
        </div>';


    $("input[name='user_pwd'], input[name='username'], input[name='code']").live("keypress", function (e) {
        if (e.keyCode == '13') {
            beforeSubmit(e,'登录','loginForm');
        }
    });
    $("input[name='mobile'], input[name='code'], input[name='sms_code']").live("keypress", function (e) {
        if (e.keyCode == '13') {
            beforeSubmit(e,'登录','mloginForm');
        }
    });

    $("input[name='mobile'], input[name='verify'], input[name='user_pwd'], input[name='code']").live("keypress", function (e) {
        if (e.keyCode == '13') {
            beforeSubmit(e,'注册','registerForm');
        }
    });
    $("input[name='email'], input[name='user_pwd']").live("keypress", function (e) {
        if (e.keyCode == '13') {
            beforeSubmit(e,'注册','registerEmailForm');
        }
    });


    $(".Js-showLogin").live("click", function () {
        show_login();
    });

    function show_login(callback) {
        if(!zc.loginCallback){
            zc.loginCallback = callback;

        }
        loginRegisterJump = loginRegisterJump || $(this).attr('data-jump');
        zc.lastpopid = wx.pop(loginTpl, {shown: loginTplCallback});
    }
    zc.show_login = show_login;

    $(".Js-showLogin").live("click", function () {
        loginRegisterJump = loginRegisterJump || $(this).attr('data-jump');
        wx.pop(loginTpl, {shown: loginTplCallback});
    });

    $(".Js-mshowLogin").live("click", function () {
        loginRegisterJump = loginRegisterJump || $(this).attr('data-jump');
        gaTrack('login', 'preMobileLogin'); //点击手机登录
        wx.pop(mloginTpl, {shown: mloginTplCallback});
        if(showCode == 'on')$('.shell.hidden').show().find('input').removeAttr('disabled');
    });

    $(".Js-showRegister").live("click", function () {
        loginRegisterJump = loginRegisterJump || $(this).attr('data-jump');
        gaTrack('register', 'preRegister');
        wx.pop(registerTpl, {shown: registerTplCallback});
        if(showCode == 'on')$('.shell.hidden').show().find('input').removeAttr('disabled');
    });

    $(".Js-showEmailRegister").live("click", function () {
        loginRegisterJump = loginRegisterJump || $(this).attr('data-jump');
        wx.pop(emailRegisterTpl, {shown: emailRegisterTplCallback});
    });

    $(".Js-pop-close").live("click", function () {
        wx.popClose();
    });

    $("#Js-registerGetCode").live("click", function () {
        if ($(this).hasClass('Js-hasSendCode') || $('[name="mobile"]').hasClass('wx-inputErrBorder')){
            return;
        }

        var v_code = $(".Js-user-handle-box input[name=code]").val(),
            $error = $("#registerFormError"),
            type = $(this).data("type"),
            query = "mobile=" + $("input[name='mobile']").val() + "&csrf_token=" + ($("#csrf_token").val() || "") + "&v_code=" + v_code + "&type=" + type;

        wx.deferred().then(function (next) {
            if (!$(".Js-user-handle-box input[name='mobile']").val()) {
                $error.text("请输入手机号");
                return;
            } else if ($(".Js-user-handle-box input[name=code]").prop("disabled")) {
                setTimeout(next, 100);
            } else if (!v_code) {
                $error.text("请输入图形验证码");
                return;
            } else {
                wx.sendData("/user-checkvcode", "v_code=" + v_code, function (data) {
                    if (data.status)
                        next();
                    else if ($(".Js-user-handle-box input[name=code]").prop("disabled")) {
                        next();
                    } else {
                        $error.text(data.info);
                    }
                });
            }
        }).then(function () {
            wx.sendData("/user-ajax_send_code_160508", query, function (data) {
                $('.JS-m-code').click();
                if (data.status == 1) {
                    var interId, time = 60, ele = $("#Js-registerGetCode");
                    ele.addClass('Js-hasSendCode sendCode');
                    $error.text("");
                    interId = setInterval(function () {
                        time--;
                        ele.html(time + '秒后重发');
                        if (time === 0) {
                            ele.removeClass('Js-hasSendCode sendCode');
                            clearInterval(interId);
                            ele.html('获取验证码');
                        }
                    }, 1000);
                } else {
                    $error.text(data.info);
                }
                if (data.status >= 4) {
                    $('.shell.hidden').show().find('input').removeAttr('disabled');
                }
            });
        })
    });

    //头部 banner 的GA
    $('#slider').on('click', function(e){
        var href = $(e.target).attr('href').split('/');
        var id = href[href.length - 1];
        gaTrack('banner', id); //点击首页的轮播图
    });

    //原始会
    $('#xmqkBtnWrap').on('click', 'a', function(e){
        var text = $(e.target).text();
        switch(text) {
            case '我要投资':
                gaTrack('subscribe', 'iWantSubscribe');
                break;
            case '我要预约':
                gaTrack('reserve', 'iWantReserve');
                break;
            case '我要领投':
                gaTrack('reserve', 'iWantLead');
                break;
        }
    })

    function loginTplCallback() {
        $('.zc').unbind('click').click(function (e) {
            beforeSubmit(e,'登录','loginForm');
        });
    }

    function mloginTplCallback() {
        $('.zc').unbind('click').click(function (e) {
            beforeSubmit(e,'登录','mloginForm');
        });
    }

    function registerTplCallback() {
        $('.zc').unbind('click').click(function (e) {
            beforeSubmit(e,'注册','registerForm');
        });
    }

    function emailRegisterTplCallback() {
        $('.zc').unbind('click').click(function (e) {
            beforeSubmit(e,'注册','registerEmailForm');
        });
    }
}
function beforeSubmit(e,text,formName) {
    switch (formName){
        case 'loginForm':
            if($(".Js-user-handle-box input[name='user_pwd']").val()=='' || $(".Js-user-handle-box input[name='username']").val()==''){
                return false;
            };
            break;
        case 'mloginForm':
            if($(".Js-user-handle-box input[name='mobile']").val()=='' || $(".Js-user-handle-box input[name='sms_code']").val()==''){
                return false;
            };
            break;
        case 'registerForm':
            if(!$(".Js-user-handle-box input[name='code']").parent().hasClass('hidden') && $(".Js-user-handle-box input[name='code']").val()==''){
                return false;
            }else{
                if($(".Js-user-handle-box input[name='mobile']").val()=='' || $(".Js-user-handle-box input[name='user_pwd']").val()==''|| !$(".Js-user-handle-box input[name='article']").attr("checked")){
                    return false;
                };
            }

            break;
        case 'registerEmailForm':
            if($(".Js-user-handle-box input[name='email']").val()==''|| $(".Js-user-handle-box input[name='user_pwd']").val()=='' || !$(".Js-user-handle-box input[name='article']").attr("checked")){
                return false;
            };
            break;
        default :
            return false;
    }
    formName === 'mloginForm' && gaTrack('login', 'mobileLogin');//手机登录页面的登陆按钮

    $('.pop input').blur();
    if($("input[name='article']").attr("checked")){
        $("input[name='article']").removeClass('wx-inputErrBorder');
    }
    if (!$('.zc').attr('submitting') && $('.pop .wx-inputErrBorder').length == 0) {
        $('.zc').text(text+'中...');
       // $('.zc').attr('submitting','true');
        $('.zc').css('background', '#aaa');




        //短信登录
        if(formName == 'mloginForm' || formName == 'registerForm' || formName == 'registerEmailForm'){
            var action = $("form[name="+formName+"]").attr('action');
             if(action.indexOf('?')>0){
             action = action.substring(0,action.indexOf('?'));
             }
             $("form[name="+formName+"]").attr('action',action+'?rnd='+Math.random());
             $("form[name="+formName+"]").submit();

        }else{
            Sso.login({
                error: function(){
                    $('#login-btn').text('登录').css('background','#489ada');

                    /*$(".shell.hidden").show().find('input').removeAttr('disabled');
                     //$("#registerFormError").text(data.info);
                     $("#registerFormError").text('请输入验证码');
                     resetBtnText('登录');
                     $('.zc').unbind('click').click(function (e) {
                     beforeSubmit(e,'登录','loginForm');
                     });*/
                }
            });
        }




        //$(e.target).unbind('click');
    }
};


/*
function beforeSubmit(e,text,formName) {
    switch (formName){
        case 'loginForm':
            if($("input[name='user_pwd']").val()=='' || $("input[name='username']").val()==''){
                return false;
            };
            break;
        case 'mloginForm':
            if($("input[name='mobile']").val()=='' || $("input[name='sms_code']").val()==''){
                return false;
            };
            break;
        case 'registerForm':
            if(!$("input[name='code']").parent().hasClass('hidden') && $("input[name='code']").val()==''){
                return false;
            }else{
                if($("input[name='mobile']").val()=='' || $("input[name='user_pwd']").val()==''|| !$("input[name='article']").attr("checked")){
                    return false;
                };
            }

            break;
        case 'registerEmailForm':
            if($("input[name='email']").val()==''|| $("input[name='user_pwd']").val()=='' || !$("input[name='article']").attr("checked")){
                return false;
            };
            break;
        default :
            return false;
    }
    formName === 'mloginForm' && gaTrack('login', 'mobileLogin');//手机登录页面的登陆按钮

    $('.pop input').blur();
    if($("input[name='article']").attr("checked")){
        $("input[name='article']").removeClass('wx-inputErrBorder');
    }
    if (!$('.zc').attr('submitting') && $('.pop .wx-inputErrBorder').length == 0) {
        $('.zc').text(text+'中...');
        $('.zc').attr('submitting','true');
        $('.zc').css('background', '#aaa');
        var action = $("form[name="+formName+"]").attr('action');
        if(action.indexOf('?')>0){
            action = action.substring(0,action.indexOf('?'));
        }
        $("form[name="+formName+"]").attr('action',action+'?rnd='+Math.random());
        $("form[name="+formName+"]").submit();
        $(e.target).unbind('click');
    }
};*/



function openLogin(jump) {
    loginRegisterJump = jump;
    $('.Js-showLogin').trigger('click');
}

function quickOpenLogin(jump) {
    loginRegisterJump = jump;
    $('.Js-mshowLogin').trigger('click');
}

function resetBtnText(text){
    $('.zc').text(text);
    $('.zc').removeAttr('submitting');
    $('.zc').removeAttr('style');
}

function loginForm(data) {
    if (data.status == 0) {
        $('.JS-m-code').click();
        resetBtnText('登录');
        $('.zc').unbind('click').click(function (e) {
            beforeSubmit(e,'登录','loginForm');
        });
        if(data.data && data.data.type=='email'){
            showEmailRegSuccessPop(data.data.show_email,true,data.data.resend_url,data.data.seconds);
            return;
        }
        $("#registerFormError").text(data.info);
    } else if (data.status == 4) {
        $(".shell.hidden").show().find('input').removeAttr('disabled');
        $("#registerFormError").text(data.info);
        resetBtnText('登录');
        $('.zc').unbind('click').click(function (e) {
            beforeSubmit(e,'登录','loginForm');
        });
    }
    else if(zc.loginCallback){
        zc.loginCallback(data);
        wx.popClose();
    }
    else if (loginRegisterJump) {
        location.href = loginRegisterJump;
        location.reload();
    } else {
       //手机账号登陆成功

        if (data.jump)
            window.location.href = data.jump;
        else
            location.reload();

    }
}

function mloginForm_before(form) {
    if ($('.Js-user-handle-box input[name=code]').prop('disabled') != true) {
        if ($('.Js-user-handle-box input[name=code]').val() == "") {
            $("#registerFormError").text("图形验证码不能为空");
            return false;
        } else {
            return true;
        }
    } else {
        return true;
    }
}
function registerForm_before(form) {
    if ($('.Js-user-handle-box input[name=code]').prop('disabled') != true) {
        if ($('.Js-user-handle-box input[name=code]').val() == "") {
            $("#registerFormError").text("图形验证码不能为空");
            return false;
        } else {
            return true;
        }
    } else {
        return true;
    }
}
function registerEmailForm_before(form) {
    if ($('.Js-user-handle-box input[name=code]').prop('disabled') != true) {
        if ($('.Js-user-handle-box input[name=code]').val() == "") {
            $("#registerFormError").text("图形验证码不能为空");
            return false;
        } else {
            return true;
        }
    } else {
        return true;
    }
}

function mloginForm(data) {
    if (data.status == 0) {
        resetBtnText('登录');
        $('.zc').unbind('click').click(function (e) {
            beforeSubmit(e,'登录','mloginForm');
        });
        if(data.data && data.type=='email'){
            showEmailRegSuccessPop(result.data.show_email,true,result.data.resend_url);
            return;
        }
        $("#registerFormError").text(data.info);
    } else if (data.status == 4) {
        resetBtnText('登录');
        $('.zc').unbind('click').click(function (e) {
            beforeSubmit(e,'登录','mloginForm');
        });
        $(".shell.hidden").show().find('input').removeAttr('disabled');
    } else if (loginRegisterJump) {
        location.href = loginRegisterJump;
        location.reload();

    } else {
        gaTrack('login', 'mobileLoginSuccess');//手机登录成功

        /*alert('手机短信登陆成功');
        //location.reload();*/
        if (data.jump)
            window.location.href = data.jump;
        else
            location.reload();
    }
}
//测试 start
/*var testData = {
 data: [],
 info: "手机号已注册，请直接登录",
 jump: "",
 status: 1
 }
 registerForm(testData)*/
//测试 end



function registerForm(data) {
    if (data.status == 0 /*false*/ ) {
        resetBtnText('注册');
        $('.zc').unbind('click').click(function (e) {
            beforeSubmit(e,'注册','registerForm');
        });
        $("#registerFormError").text(data.info);
    }
    else {
        gaTrack('register', 'registerSuccess');
        agrantsemAnalytics([['_atsev', '101'], ['_atsusr', ($("input[name='mobile']").val() || "email")]]);
        setTimeout(function () {

            // if(zc.loginCallback){
            //     zc.loginCallback(data);
            //     wx.popClose();
            // }
            // else if (loginRegisterJump) {
            //     location.href = loginRegisterJump;
            //     location.reload();
            // }else
            //     location.reload();
            window.location.href="/sso-thirdLogin?msg=7";
        }, 300);
    }
}
function registerEmailForm(data) {
    var result = data;
    if (result.status == 0) {
        resetBtnText('注册');
        $('.zc').unbind('click').click(function (e) {
            beforeSubmit(e,'注册','registerEmailForm');
        });
        $("#registerFormError").text(result.info);
    } else {
        showEmailRegSuccessPop(result.data.show_email,false,result.data.resend_url,result.data.seconds);
    }
}
var sendEmailInterval;
var hash = {
    'qq.com': 'http://mail.qq.com',
    'gmail.com': 'http://mail.google.com',
    'sina.com': 'http://mail.sina.com.cn',
    '163.com': 'http://mail.163.com',
    '126.com': 'http://mail.126.com',
    'yeah.net': 'http://www.yeah.net/',
    'sohu.com': 'http://mail.sohu.com/',
    'tom.com': 'http://mail.tom.com/',
    'sogou.com': 'http://mail.sogou.com/',
    '139.com': 'http://mail.10086.cn/',
    'hotmail.com': 'http://www.hotmail.com',
    'live.com': 'http://login.live.com/',
    'live.cn': 'http://login.live.cn/',
    'live.com.cn': 'http://login.live.com.cn',
    '189.com': 'http://webmail16.189.cn/webmail/',
    'yahoo.com.cn': 'http://mail.cn.yahoo.com/',
    'yahoo.cn': 'http://mail.cn.yahoo.com/',
    'eyou.com': 'http://www.eyou.com/',
    '21cn.com': 'http://mail.21cn.com/',
    '188.com': 'http://www.188.com/',
    'foxmail.com': 'http://www.foxmail.com'
};
function showEmailRegSuccessPop(email,isLogin,resendURL,seconds){
    wx.popClose();
    if(sendEmailInterval){
        clearInterval(sendEmailInterval);
    }
    var MyPop = function(){
        this.pop_reg_email = email;
        this.isLogin = isLogin;
        this.show = function(){
            if(!this.pop_reg_email) return false;
            var laster = this.pop_reg_email.split('@')[1];
            var url = 'javascript:;';
            if(laster) {
                if (hash[laster]) {
                    url = hash[laster];
                }else{
                    url = 'http://mail.'+laster;
                }
            }
            var showHtml = '<p>已发送激活邮件到 '+ this.pop_reg_email +'</p>';
            if(this.isLogin){
                showHtml = '<p>您还没有完成邮箱激活</p><p>账户： '+ this.pop_reg_email +'</p>';
            }
            var tmpl ='\
                <div class="titleWrap"><div class="title">注册<a class="shut-down-icon Js-pop-close"></a></div></div>\
                <div class="logwrap clearfix">\
                    <div class="mail-activation">\
                        <div class="mail-activation-into tc">\
                            '+showHtml+'\
                            <p class="enter-mail">请您进入邮箱中点击验证完成注册</p>\
                            <a href="'+url+'" target="_blank" class="btn act-btn">去邮箱激活</a>\
                        </div>\
                        <div class="no-mail">\
                            <b>没有收到确认邮件，怎么办？</b>\
                            - 看看是否在邮箱的回收站中、垃圾邮件中<br>\
                            - 重新发送，<a href="javascript:" class="resend cor-blue">点此重发一封</a>\
                                <a href="javascript:" class="resend cor-grey in-progress" style="display:none"></a>\
                                <a href="javascript:" class="resend cor-grey success" style="display:none">重新发送成功</a>\
                        </div>\
                    </div>\
                </div>';
            wx.pop(tmpl);
            var doInterval = function(time,showSuccess){
                $('.no-mail .cor-blue').hide();
                $('.no-mail .in-progress').html('点此重发一封 ('+time+'秒)').show();
                if(showSuccess) {
                    $('.no-mail .success').show();
                }
                sendEmailInterval = setInterval(function(){
                    time--;
                    if(time<=0){
                        $('.no-mail .in-progress').hide();
                        $('.no-mail .success').hide();
                        $('.no-mail .cor-blue').show();
                        clearInterval(sendEmailInterval);
                    }
                    if(!isNaN(time)) {
                        $('.no-mail .in-progress').html('点此重发一封 (' + time + '秒)');
                    }
                },1000);
            };
            doInterval(seconds);
            $('.no-mail .cor-blue').click(function(){
                $(this).hide();
                $('.no-mail .success').hide();
                $('.no-mail .in-progress').html('点此重发一封').show();
                $.getJSON(resendURL,{},function(data){
                    if(data.status == 1){
                        doInterval(data.data.seconds,true);
                    }else{
                        doInterval(seconds,true);
                    }
                });
            });
        };
        this.time = function(){
            var self = this;
            setTimeout(function(){self.show();}, 500);
        };
    };
    new MyPop().time();
}

function showUserList() {
    $("#Js-header-loginBtn").hover(function () {
        $(this).find('span').addClass('avtive');
        $("#Js-header-login").show();
    }, function () {
        $(this).find('span').removeClass('avtive');
        $("#Js-header-login").hide();
    });
}

function getRegion(baseData) {
    var options = {
        url: '/settings-get_region',
        provinceElm: $("select[name='province']"),
        cityElm: $("select[name='city']"),
        provinceName: '请选择',
        cityName: '请选择'
    }
    $.extend(options, baseData);

    if (!options.provinceElm || !options.cityElm)
        return;

    options.provinceName = options.provinceElm.attr('data-default') || options.provinceName;
    options.cityName = options.cityElm.attr('data-default') || options.cityName;

    options.provinceElm.off('change').change(function () {
        if ($(this).val() === '请选择') {
            wx.sendData(options.url, "id=0", function (proData) {
                var provinceOps = "";
                for (var i = 0; i < proData.length; i++) {
                    provinceOps += "<option data-id='" + proData[i].id + "' value='" + proData[i].name + "' " + (options.provinceName == proData[i].name ? "selected" : "") + ">" + proData[i].name + "</option>";
                    if (options.cityName && options.provinceName == proData[i].name)
                        getCity(proData[i].id);
                }
                options.provinceElm.append(provinceOps);
            });
        } else {
            getCity($(this).find("option:selected").attr("data-id"));
        }
    });
    function getCity(pId) {
        wx.sendData(options.url, "id=" + pId, function (cityData) {
            var cityOps = "<option data-id='-1' value='请选择'>请选择</option>";
            for (var i = 0; i < cityData.length; i++) {
                cityOps += "<option data-id='" + cityData[i].id + "' value='" + cityData[i].name + "' " + (options.cityName == cityData[i].name ? "selected" : "") + ">" + cityData[i].name + "</option>";
            }
            options.cityElm.empty().append(cityOps);
        });
    }

    options.provinceElm.trigger("change");
}

function goTop() {
    var $goTop = $('#gotop'),
        $doc = $(document);
    $(window).scroll(wx.throttle(function () {
        $doc.scrollTop() > 50 ? $goTop.fadeIn() : $goTop.fadeOut();
    }, 300));
    $goTop.bind("click", function () {
        $("html,body").animate({scrollTop: 0}, "fast");
    });
}


var _gaq = _gaq || [];
var _agt = _agt || [];
var _ncf = {
    "prd": "zhongchou",
    "pstr": "",
    "pfunc": null,
    "pcon": "&na=index",
    "pck": {"beid": "beid", "zcid": "zcid"}
};


var hostname = window.location.hostname;

function googleAnalytics() {
    var _gaList = [];

    if(/zhongchou/.test(hostname)){
        _gaq.push(['_setAccount', 'UA-62825735-1']);
    }else if(/yuanshihui/.test(hostname)) {
        _gaq.push(['_setAccount', 'UA-68082252-1']);
    }

    _gaq.push(['_trackPageview']);
    var ga = document.createElement('script');
    ga.type = 'text/javascript';
    ga.async = true;
    //ga.src = ('https:' == document.location.protocol ? 'https://' : 'http://') + 'stats.g.doubleclick.net/dc.js';
        ga.src = ('https:' == document.location.protocol ? 'https://' : 'http://') + 'zcs1.ncfstatic.com/js/dc.js';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(ga, s);
    $(ga).on('load', function () {
        if (_gaList && _gaList.length) {
            var g = _gaq._getAsyncTracker();
            for (var i = 0; i < _gaList.length; i++) {
                g._trackEvent.apply(g, _gaList[i]);
                _gaList.remove(i);
            }
        }
    });
    return function () {
        if (_gaq && _gaq._getAsyncTracker) {
            try {
                var g = _gaq._getAsyncTracker();
                g._trackEvent.apply(g, arguments);
            }
            catch (e) {
                console.log(e);
            }
        }
        else {
            _gaList.push(arguments);
        }
    }
}

function agrantsemAnalytics(args) {
    _agt.length = 0;
    _agt.push(['_atscu', 'AG_524833_SVCU']);
    _agt.push(['_atsdomain', 'zhongchou.com']);
    if (args) {
        for (var i = args.length - 1; i >= 0; i--) {
            _agt.push(args[i])
        }
        ;
    }
    var ag = document.createElement('script');
    ag.type = 'text/javascript';
    ag.async = true;
    ag.src = (document.location.protocol == 'https:' ? 'https' : 'http') + '://' + 't.agrantsem.com/js/ag.js';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(ag, s);
}

function baizeAnalytics() {
    var o = document.createElement("script");
    o.async = true;
    o.src = "http://zcs1.ncfstatic.com/js/ncfpb.1.1.min.js";
    // document.getElementsByTagName("HEAD")[0].appendChild(o);
}

function zcAnalytics() {
    var o = document.createElement("script");
    o.async = true;
    o.src = "http://pb.static.zhongchou.cn/js/zcpb.1.0.min.js";
    o.src = "http://zcs1.ncfstatic.com/js/zcpb.1.0.min.js";
    document.getElementsByTagName("HEAD")[0].appendChild(o);
}

function aysnYsh() {
    $.getScript('http://www.yuanshihui.com/about/go?' + Math.random(), function () {
        $.post("/user-ajax_ysh_login", {
            'userId': cookieUser.userId,
            'userToken': cookieUser.userToken,
            'logTime': cookieUser.logTime
        }, function (data) {
            if (data.status == 0) {
                //不变
                return;
            } else if (data.status == 1 && data.userName != null) {
                //登录
                $('#siteLRBox').hide();
                $('#siteLogined').find('.siteLgInner').html(data.userName + '<i></i>');
                $('#siteLogined').show();
                $('#RSLg_w_Box').hide();
                $('#RSLg_y_Box>img').attr('src', data.avatar);
                $('#RSLg_y_Box').show();
            } else if (data.status == -1) {
                //未登录
                $('#siteLRBox').show();
                $('#siteLogined').hide();
                $('#RSLg_w_Box').show();
                $('#RSLg_y_Box').hide();
            }
        }, 'json');
    });

}

function openWindow(title,content,closeCallback){
    var obj = $('<div id="prefectInfo-pop" class="pop-bg">\
            <div class="success-popup">\
                <div class="popup-header">\
                    '+title+'<a href="javascript:void(0);" class="close"></a>\
                </div>\
                <div class="popup-wrap">\
                    <div class="popup-form"></div>\
                </div>\
            </div>\
        </div>\
    ').css({
        width: $(document.body).width(),
        position:'fixed',
        height:document.documentElement.clientHeight
    });
    if($('.success-popup').length == 0){
        obj.find('.popup-form').append(content);
        $(document.body).append(obj);
    }
}
var serviceUrl = function (url) {
    var r = '/rpc-' + url.replace(/\//g, ',');
    return r;
};

var eqParams = function(controller, action, method ,params){

    var obj = {
        a : controller,
        f : action,
        t : method == 'GET' ? "0" : "1"
    };

    var p_arr = [];
    for(var key in params){
        p_arr.push(key + "|" + params[key]);
    }
    obj.p = p_arr.join("|");
    return obj;
};

function showValidEmailWindow(title,email,resendURL){
    $('#prefect_user_info_btn').hide();
    var form = $('\
        <i class="mail-pic"></i>\
        <div class="have-send">\
            <p><i></i>已发送激活邮件到'+email+'</p>\
            <p class="light-grey">请您进入邮箱中点击验证完成优质投资人认证</p>\
            <a class="btn btn-blue small mt10">去邮箱激活</a>\
        </div>\
    ');
    openWindow(title,form);
    var footer = $('<div class="to-do">\
        没有收到确认邮件，怎么办？<br>\
        - 看看是否在回收站中，垃圾邮件中<br>\
        - 重新发送，<a href="javascript:void(0);">点此重发一封</a>\
        <span class="cor-grey in-progress" style="display: none"></span>\
        <span class="cor-grey success" style="display: none">重新发送成功</span>\
    </div>');
    footer.insertAfter(form.parent().parent());
    var laster = email.split('@')[1];
    var url = 'javascript:;';
    if(laster) {
        if (hash[laster]) {
            url = hash[laster];
        }else{
            url = 'http://mail.'+laster;
        }
        form.find('a').attr('href',url).attr('target','_blank');
    }

    var doInterval = function(time,isFirst){
        footer.find('a').hide();
        footer.find('.success').hide();
        footer.find('.in-progress').html('点此重发一封 (' + time + '秒)').show();
        sendEmailInterval = setInterval(function(){
            time--;
            if(time<=0){
                footer.find('.in-progress').hide();
                if(!isFirst) {
                    footer.find('.success').show();
                }
                footer.find('a').show();
                clearInterval(sendEmailInterval);
            }
            if(!isNaN(time)) {
                footer.find(' .in-progress').html('点此重发一封 (' + time + '秒)');
            }
        },1000);
    };
    doInterval(60,true);
    footer.find('a').click(function(){
        var seconds = 60;
        footer.find('a').hide();
        footer.find('.success').hide();
        footer.find('.in-progress').html('点此重发一封').show();
        $.getJSON(resendURL,{},function(data){
            if(data.status == 1){
                doInterval(data.data.seconds);
            }else{
                doInterval(seconds);
            }
        });
    });
    $('#prefectInfo-pop').find('.close').click(closeWindow);
    setPosition();
}

function showSuccessWindow(title){
    $('#prefect_user_info_btn').hide();
    var form = $('\
        <div class="tag-suc">\
            <i class="tag-suc-pic"></i>\
            <p>恭喜您认证成功！</p>\
            <a href="javascript:void(0);" class="btn btn-blue small">确定</a>\
        </div>\
    ');
    openWindow(title?title:'完善投资人信息',form);
    form.find('a').click(closeWindow);
    $('#prefectInfo-pop').find('.close').click(closeWindow);
    setPosition();
}

function closeWindow(){
    $('#prefectInfo-pop').remove();
}

function setPosition(){
    var popHeight = $('#prefectInfo-pop').find('.success-popup').height();
    var clientHeight = window.screen.height;
    if(clientHeight - popHeight > 0){
        $('#prefectInfo-pop').find('.success-popup').css('top',(clientHeight - popHeight)/3);
    }else{
        $('#prefectInfo-pop').find('.success-popup').css('top',0);
    }
}

function showPerfectUserInfoWindow(status){
    var isEmailForm = false;
    //0不显示 1 收集手机 2 收集邮箱
    if(status == 0) return;
    else if(status == 2) {
        isEmailForm = true;
    }
    function close(){
        closeWindow();
        $.getJSON(serviceUrl('user/showonce?v=3'),null,function(data){ });
    };

    $.getJSON(serviceUrl('deal/dealcates?v=3'),null,function(data){
        var form = $('<div></div>');
        var useImageValidCode = false;

        var top,company,position,cate,mobilePhone,imgValidCode,mobileValidCode,email,btnGroup;
        function buildPerfectUserInfoForm(){
            top = $('<fieldset><legend>您的信息还不完善，现在完善信息，可以获得以下特权：<span class="red">优质项目优先推送，路演活动优先通知</span></legend></fieldset>');
            company = $('\
                <div class="formitm">\
                    <label class="lab">所在公司：</label>\
                    <div class="inpt">\
                    <input type="text" input-type="company" class="u-ipt">\
                        <span class="error-txt">*所在公司不能为空</span>\
                    </div>\
                </div>\
            ');
            position = $('\
                <div class="formitm">\
                    <label class="lab">职位/头衔：</label>\
                    <div class="inpt">\
                    <input type="text" input-type="position" class="u-ipt">\
                        <span class="error-txt">*职务/头衔不能为空</span>\
                    </div>\
                </div>\
            ');

            cate = $('\
                <div class="formitm">\
                    <label class="lab">关注行业：</label>\
                    <div class="inpt">\
                        <ul class="concerned-industry clearfix">\
                        </ul>\
                        <span class="error-txt" style="margin-top:-15px"></span>\
                    </div>\
                </div>\
            ');

            mobilePhone = $('\
                <div class="formitm">\
                    <label class="lab">手机号码：</label>\
                    <div class="inpt">\
                    <input type="text" class="u-ipt">\
                        <span class="error-txt">*手机号不能为空</span>\
                    </div>\
                </div>\
            ');
            imgValidCode = $('\
                <div class="formitm">\
                    <label class="lab">图片验证码：</label>\
                    <div class="inpt img-tel-ver">\
                        <input type="text" class="u-ipt">\
                        <img src="/verify.php" alt="" class="domain">\
                        <span class="error-txt">*请填写图片验证码</span>\
                    </div>\
                </div>\
            ');
            mobileValidCode = $('\
                <div class="formitm">\
                    <label class="lab">手机验证码：</label>\
                    <div class="inpt img-tel-ver">\
                        <input type="text" class="u-ipt">\
                        <a href="javascript:" class="domain btn-orange">获取</a>\
                        <span class="error-txt">*请填写手机验证码</span>\
                    </div>\
                </div>\
            ');
            email = $('\
                <div class="formitm">\
                    <label class="lab">常用邮箱：</label>\
                    <div class="inpt">\
                    <input type="text" class="u-ipt">\
                        <span class="error-txt">*常用邮箱不能为空</span>\
                    </div>\
                </div>\
            ');
            btnGroup = $('\
                <div class="formitm">\
                    <div class="inpt mt10">\
                        <button class="btn btn-blue small mr20" type="button">提交</button>\
                        <button class="btn btn-light-gay small" type="button">下次再说</button>\
                    </div>\
                </div>\
            ');
        };
        function init(){
            var info = {};
            var industy = [];

            if($('#siteHTopBox').attr('c').length>0){
                info.company = $('#siteHTopBox').attr('c');
                company.find('input').val(info.company).attr('disabled','disabled');
            }
            if($('#siteHTopBox').attr('p').length>0){
                info.position = $('#siteHTopBox').attr('p');
                position.find('input').val(info.position).attr('disabled','disabled');
            }
            if($('#siteHTopBox').attr('i').length>0){
                info.industy = $('#siteHTopBox').attr('i');
                industy = info.industy.split(',');
            }
            $.each(data.data,function(i,item){
                var index = -1;
                for(var i =0 ;i<industy.length;i++){
                    if(industy[i]==item.id){
                        index=i;
                        break;
                    }
                }
                if(index > -1) {
                    cate.find('ul').append('<li class="crt" value="' + item.id + '"><i></i>' + item.text + '</li>');
                }else{
                    cate.find('ul').append('<li value="' + item.id + '"><i></i>' + item.text + '</li>');
                }
            });
            imgValidCode.find('img').click(function(){
                var src = $(this).attr('src');
                $(this).attr('src',src+'?');
            });

            cate.find('li').click(function(){
                $(this).toggleClass('crt');
                if(cate.find('.crt').length>3){
                    cate.find('.error-txt').show().text('最多可选3个');
                    cate.attr('invalid', 'true');
                }else if(cate.find('.crt').length == 0){
                    cate.find('.error-txt').show().text('请选择关注行业');
                    cate.attr('invalid', 'true');
                }else{
                    cate.find('.error-txt').hide();
                    cate.removeAttr('invalid');
                }
            });

            var errorCls = '.error-txt';
            function textBlur(obj,message){
                var value = $.trim(obj.val());
                var empty = value.length == 0;
                if (empty) {
                    obj.parent().find(errorCls).show().text(message);
                    obj.attr('invalid', 'true');
                } else {
                    if(obj.attr('input-type')=='company' && value.length>30){
                        obj.parent().find(errorCls).show().text('最多只能输入30个字符');
                        obj.attr('invalid', 'true');
                        return;
                    }
                    if(obj.attr('input-type')=='position' && value.length>10){
                        obj.parent().find(errorCls).show().text('最多只能输入10个字符');
                        obj.attr('invalid', 'true');
                        return;
                    }
                    if (value.length > 50) {
                        obj.parent().find(errorCls).show().text('最多只能输入50个字符');
                        obj.attr('invalid', 'true');
                        return;
                    }
                    obj.removeAttr('invalid');
                    obj.parent().find(errorCls).hide();
                }
            }
            company.find('input').on('blur',function(){
                textBlur($(this),'请输入您所在的公司名称');
            });
            position.find('input').on('blur',function(){
                textBlur($(this),'请输入您的职位/头衔');
            });
            mobilePhone.find('input').on('blur',function(){
                textBlur($(this),'请输入手机号码');
                var value = $.trim($(this).val());
                if(value.length>0){
                    if(!/^1[3|4|5|7|8][0-9]\d{8}$/.test(value)){
                        $(this).parent().find(errorCls).show().text('手机号码格式错误');
                        $(this).attr('invalid', 'true');
                    }else{
                        $(this).removeAttr('invalid');
                        $(this).parent().find(errorCls).hide();
                    }
                }
            });
            mobileValidCode.find('input').on('blur',function(){
                textBlur($(this),'请输入手机验证码');
            });

            mobileValidCode.find('a').click(function(){
                if($(this).hasClass('btn-light-gray')) return;
                mobilePhone.find('input').blur();
                if(mobilePhone.find('input')[0].hasAttribute('invalid')){
                    return;
                }

                var postData = {
                    mobile : $.trim(mobilePhone.find('input').val())
                };

                if(useImageValidCode){
                    imgValidCode.find('input').blur();
                    if(imgValidCode.find('input')[0].hasAttribute('invalid')){
                        return;
                    }else {
                        postData.v_code = $.trim(imgValidCode.find('input').val());
                    }
                }

                $(this).removeClass('btn-orange').addClass('btn-light-gray');
                $.post(serviceUrl('user/sendsms?v=3'),postData,function(data){
                    if(data.errno == 0) {
                        var time = 60;
                        var interval = setInterval(function () {
                            time--;
                            if (time == 0) {
                                mobileValidCode.find('a').text('获取');
                                mobileValidCode.find('a').removeClass('btn-light-gray').addClass('btn-orange');
                                clearInterval(interval);
                            } else {
                                mobileValidCode.find('a').text(time + '秒后获取');
                            }
                        }, 1000);
                        wx.alert('发送成功');
                    }else{
                        wx.alert(data.error);
                        mobileValidCode.find('a').removeClass('btn-light-gray').addClass('btn-orange');
                        imgValidCode.find('img').click();
                    }
                    if (data.data.show_captcha) {
                        useImageValidCode = true;
                        imgValidCode.show();
                    }
                });
            });
            imgValidCode.find('input').on('blur',function(){
                textBlur($(this),'请输入验证码');
            });
            email.find('input').on('blur',function(){
                var value = $.trim($(this).val());
                if(value.length>0){
                    if(!/\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/.test(value)){
                        $(this).parent().find(errorCls).show().text('邮箱格式错误');
                        $(this).attr('invalid', 'true');
                    }else{
                        $(this).removeAttr('invalid');
                        $(this).parent().find(errorCls).hide();
                    }
                }else{
                    $(this).parent().find(errorCls).show().text('请输入您的常用邮箱');
                    $(this).attr('invalid', 'true');
                }
            });
            btnGroup.find('button').first().click(function(){
                form.find('input').blur();
                if(cate.find('.crt').length==0){
                    cate.attr('invalid', 'true');
                    cate.find('.error-txt').show().text('请选择关注行业');
                }
                if(!isEmailForm && !useImageValidCode){
                    imgValidCode.find('input').removeAttr('invalid');
                }
                if($('[invalid]').length==0){
                    var companyValue = $.trim(company.find('input').val());
                    var positionValue= $.trim(position.find('input').val());
                    var industryValue= '';
                    var emailValue= $.trim(email.find('input').val());

                    $.each(cate.find('.crt'),function(i,item){
                        industryValue += $(item).attr('value')+',';
                    });
                    if(industryValue.length>0) industryValue = industryValue.substring(0,industryValue.length-1);
                    var postData = {
                        has : info.company && info.position ? 1:0,
                        company : companyValue,
                        position  : positionValue,
                        industry  : industryValue
                    };
                    if(status!=3) {
                        if (!isEmailForm) {
                            var mobilePhoneValue = $.trim(mobilePhone.find('input').val());
                            var mobilePhoneCodeValue = $.trim(mobileValidCode.find('input').val());
                            postData.mobile = mobilePhoneValue;
                            postData.smscode = mobilePhoneCodeValue;
                        } else {
                            postData.email = emailValue;
                        }
                    }
                    var _this = this;
                    $(_this).removeClass('btn-blue').addClass('btn-light-gray');
                    $.post(serviceUrl('/user/collectemail?v=3'),postData,function(data){
                        $(_this).removeClass('btn-light-gray').addClass('btn-blue');
                        if(data.errno == 0){
                            closeWindow();
                            if(isEmailForm){
                                showValidEmailWindow('完善投资人信息',data.data.show_email,data.data.resend_url);
                            }else{
                                showSuccessWindow();
                            }
                        }else{
                            wx.alert(data.error);
                        }
                    });

                }
            });

            btnGroup.find('button').last().click(close);
        }
        buildPerfectUserInfoForm();
        init();

        if(status == 3){
            form.append(top).append(company).append(position).append(cate).append(btnGroup);
        }else {
            if (!isEmailForm) {
                form.append(top).append(company).append(position).append(cate).append(mobilePhone).append(imgValidCode.hide()).append(mobileValidCode).append(btnGroup);
            } else {
                form.append(top).append(company).append(position).append(cate).append(email).append(btnGroup);
            }
        }

        openWindow('完善投资人信息',form);
        $('#prefectInfo-pop').find('.close').click(close);
        setPosition();
    });

}

$(document).ready(function () {
    try{
        var hint = new InputHinter({container: 'search-box', id: "searchInput"});
        $('#searchBtn').click(function () {
            var $input = $('#searchInput');
            window.location.href = "/search/kw-" + hint.encodeKw($.trim($input.val()) || $input.attr('placeholder'));
        });
        //$("#searchInput").focus();
        if($('#siteHTopBox').length > 0){
            var status = $('#siteHTopBox').attr('editstatus');
            showPerfectUserInfoWindow(status);
            $('#prefect_user_info_btn').click(function(){
                showPerfectUserInfoWindow($(this).attr('ctype'));
            });
        }

    }catch(e){}
});
/**//************************************************************************

|    函数名称： setCookie                                                |
|    函数功能： 设置cookie函数                                            |
|    入口参数： name：cookie名称；value：cookie 值,second:cookie保存的时间（单位：秒）,可以不填写                        |
|    维护记录： Ray(创建）                                            |
*************************************************************************/
function setCookie(name, value,second)
{
    /*var argv = setCookie.arguments;
    var argc = setCookie.arguments.length;
    var expires = (argc > 2) ? argv[2] : null;
    if(expires!=null)
    {
        //将userId和userName两个cookie设置为10天后过期
        var LargeExpDate = new Date ();
        LargeExpDate.setTime(LargeExpDate.getTime() + (expires*1000*3600*24));
    }
    document.cookie = name + "=" + escape (value)+((expires == null) ? "" : ("; expires=" +LargeExpDate.toGMTString()))+"; path=" + "/";
*/

    var Days = 1; //此 cookie 将被保存 1 天
    var exp = new Date();    //new Date("December 31, 9998");
    if(second&&second!=0)
    exp.setTime(exp.getTime() + 1000*second);
    else
    exp.setTime(exp.getTime() + Days*24*60*60*1000);
    document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString()+"; path=" + "/";
}
/************************************************************************
|    函数名称： getCookie                                                |
|    函数功能： 读取cookie函数                                            |
|    入口参数： Name：cookie名称                                          |
|    维护记录： Ray(创建）                                               |
*************************************************************************/
function getCookie(Name)
{
    var search = Name + "=" ;
    if(document.cookie.length > 0)
    {
        offset = document.cookie.indexOf(search);
        if(offset != -1)
        {
            offset += search.length;
            end = document.cookie.indexOf(";", offset);
            if(end == -1) end = document.cookie.length ;
            return unescape(document.cookie.substring(offset, end)) ;
        }
        else return "";
    }
}

/************************************************************************
|    函数名称： deleteCookie                                             |
|    函数功能： 删除cookie函数                                           |
|    入口参数： Name：cookie名称                                            |
|    维护记录： Ray(创建）                                              |
*************************************************************************/
function delCookie(name)
{
     /*var expdate = new Date();
     expdate.setTime(expdate.getTime() - (86400 * 1000 * 1));
     setCookie(name, "", expdate);
     */
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval=getCookie(name);
    if(cval!=null)
        document.cookie= name + "="+cval+";expires="+ exp.toGMTString()+"; path=" + "/";
}

$(function(){
    if(window.location.href.indexOf('yuanshihui')>0){
    function cook(){
        var pop  = getCookie('pop');
        if(pop==null||pop==''){
        $('.newpop-bg,.newpopcontent').show();
            $('.ie-close,.goonbtn').click(function() {
                $('.newpop-bg,.newpopcontent').hide();
                setCookie('pop','555',60*60*24);
            });
        }
    }
    function pop(){
        $('.newpop-bg,.newpopcontent').show();
        $('.ie-close,.goonbtn').click(function() {
        $('.newpop-bg,.newpopcontent').hide();
        });
    }
        var browser=navigator.appName
        var b_version=navigator.appVersion
        var version=b_version.split(";");
        var trim_Version=version[1].replace(/[ ]/g,"");
        if(browser=="Microsoft Internet Explorer" && trim_Version=="MSIE6.0")
        {
        cook();
        }
        else if(browser=="Microsoft Internet Explorer" && trim_Version=="MSIE7.0")
        {
        cook();
        }
    }
})

