define(function(require, exports, module) {
  var $back = $('.backdrop'),
    $body = $('body');

  var browser = {
    versions: function() {
      var u = navigator.userAgent,
        app = navigator.appVersion;
      return {
        trident: u.indexOf('Trident') > -1, //IE内核
        presto: u.indexOf('Presto') > -1, //opera内核
        webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
        gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
        mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
        ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
        android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
        iPhone: u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器
        iPad: u.indexOf('iPad') > -1, //是否iPad
        webApp: u.indexOf('Safari') == -1, //是否web应该程序，没有头部与底部
        weixin: u.indexOf('MicroMessenger') > -1, //是否微信 （2015-01-22新增）
        welian: u.indexOf('Welian') > -1, //是否微链 (2016-12-14新增)
        uc: u.indexOf('UC') > -1,
        liebao: u.indexOf('LieBao') > -1,
        chrome: u.indexOf('Chrome') > -1,
        qq: u.match(/\sQQ/i) == " qq" //是否QQ
      };
    }(),
    language: (navigator.browserLanguage || navigator.language).toLowerCase()
  };

  exports.browser = browser;

  /**
   * 背景蒙层
   * @type {Object}
   */
  exports.backdrop = {
    show: function(callback) {
      if ($back.length == 0) {
        $('body').append('<aside class="backdrop fade"></aside>');
      }
      $body.css('overflow', 'hidden');
      $back.show();
      setTimeout(function() {
        $back.addClass('in');
        callback && callback();
      }, 0);
    },
    hide: function(callback) {
      $body.css('overflow', 'visible');
      $back.removeClass('in');
      callback && callback();
      setTimeout(function() {
        $back.hide();
      }, 300);
    }
  };

  /**
   * 加载动画
   * @type {Object}
   */
  exports.loading = {
    show: function(msg) {
      var $loading = $('.J_Loading');
      if ($loading.length <= 0) {
        $('body').append('<aside class="wl-loading-bg fade"></aside><aside class="wl-loading J_Loading"><img src="http://fed.welian.com/loading.gif"><p>' + msg + '</p></aside>');
        $loading = $('.J_Loading');
      }
      $loading.show();
    },
    hide: function(callback) {
      $('.J_Loading').hide();
    }
  };

  /**
   * 下拉加载
   */
  exports.scrollLoad = function(selector, limit, callback) {
    var url = $('#J_AjaxListLoadUrl').val();
    var formData = {};
    var isEnd = false;
    var isLoading = false;

    $(window).scroll(function() {
      var scrollTop = $(this).scrollTop();
      var windowHeight = $(this).height();
      var scrollHeight = $('body').height();
      if (scrollTop + windowHeight >= scrollHeight) {
        if (isEnd) return;
        if (isLoading) return;
        isLoading = true;
        $(selector).append('<li class="tips J_ListLoading">活动加载中...</li>');
        get(url, formData, function(html) {
          var $html = $(html);
          //获取列表数据
          $list = $html.find('li');
          //重写url
          url = $html.find('#J_AjaxListLoadUrl').val();
          if ($list.length > 0) {
            //数据列表加入列表中
            $(selector).append($list);
            callback && callback($list);
          }
          //数据长度小于限制数就没有数据可以加载
          if ($list.length < limit) {
            isEnd = true;
            $(selector).append('<li class="tips">没有数据了~</li>');
          }
        }, function() {
          isLoading = false;
          $(selector).find('.J_ListLoading').remove();
        });
      }
    });
  };

  /**
   * 表单验证
   * @param  {[type]} form  [description]
   * @param  {[type]} rules [description]
   * @return {[type]}       [description]
   */
  exports.validata = function(form, rules) {
    for (var i = 0; i < form.elements.length; i++) {
      var node = form.elements[i];
      var mobileReg = /^((1)+\d{10})/;
      var emailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((.[a-zA-Z0-9_-]{2,3}){1,2})$/;
      if (node.tagName.toLowerCase() == 'input' || node.tagName.toLowerCase() == 'textarea') {
        var value = rules[node.name];
        if (value) {
          switch (typeof value) {
            case 'string':
              if (!node.value) {
                return alertErrorMsg(node, value);
              }
              break;
            case 'object':
              try {
                var keys = Object.keys(value);
                if (keys.indexOf('require') != -1 && !node.value) {
                  return alertErrorMsg(node, value['require']);
                }
                if (keys.indexOf('mobile') != -1 && !mobileReg.test(node.value)) {
                  return alertErrorMsg(node, value['mobile']);
                }
                if (keys.indexOf('email') != -1 && !emailReg.test(node.value)) {
                  return alertErrorMsg(node, value['email']);
                }
              } catch (e) {
                return false;
              }
              break;
          }
        }
      }
    }
    return true;
  };

  /**
   * 初始化
   * @return {[type]} [description]
   */
  exports.init = function() {
      $('a[data-app]').on('click', function(e) {
        if ($(this).data('browser') == 1) {
          seajs.use('browser', function(browser) {
            browser.show(function() {
              openApp(e);
            });
          });
        } else {
          openApp(e);
        }
        return false;
      });
      $('*[data-link]').on('click', function() {
        window.location.href = $(this).data('link');
      });
      //循环图片进行后加载
      $('img[data-src]').each(function() {
        this.src = $(this).data('src');
        this.onload = function() {
          $(this).css('opacity', 1);
        };
      });

      //循环图片集
      $('.wl-pic-item').each(function(i, item) {
        var width = $(item).width(),
          height = $(item).height(),
          $img = $(this).children('img'),
          src = $img.attr('src'),
          srcArr = src.split('.'),
          nameArr = srcArr[2].split('_'),
          imgWidth = parseInt(nameArr[1], 10),
          imgHeight = parseInt(nameArr[2], 10);
        if (imgWidth > imgHeight) {
          $img.height(width);
        } else {
          $img.width(width);
        }
      });
    };

    /**
     * webview初始化
     * @author cafe
     * @date   2016-12-14T13:02:52+0800
     * @param  {[type]}                 responseData [description]
     * @return {[type]}                              [description]
     */
    exports.webView = function(model, type) {
      var responseData = {'data': {'model': model, 'type': type}};
      if(browser.versions.welian) {
        setupWebViewJavascriptBridge(function(bridge) {
          // 注册事件供app调用
          bridge.registerHandler('getWelianH5Data', function(data, responseCallback) {
            responseCallback(responseData)
          })
          // 调用app事件获取用户信息
          bridge.callHandler('getUserBaseData', {}, function(response) {
            window.localStorage.setItem('welian_app_user');
          })
        });
      }
    }

    function setupWebViewJavascriptBridge(callback) {
      if (window.WebViewJavascriptBridge) { return callback(WebViewJavascriptBridge); }
      if (window.WVJBCallbacks) { return window.WVJBCallbacks.push(callback); }
      window.WVJBCallbacks = [callback];
      var WVJBIframe = document.createElement('iframe');
      WVJBIframe.style.display = 'none';
      WVJBIframe.src = 'wvjbscheme://__BRIDGE_LOADED__';
      document.documentElement.appendChild(WVJBIframe);
      setTimeout(function() { document.documentElement.removeChild(WVJBIframe) }, 0)
    }
    /*
    exports.geocoder = function(address, callback) {
        if (!AMap) {
            alert('高德地图API加载失败');
            return false;
        }
        if (!address) {
            alert('无法解析定位地址。');
            return false;
        }
        //加载地理编码插件
        AMap.service(["AMap.Geocoder"], function() {
            var MGeocoder = new AMap.Geocoder({
                city: "", //城市，默认：“全国”
                radius: 1000 //范围，默认：500
            });
            //返回地理编码结果
            //地理编码
            MGeocoder.getLocation(address, function(status, result) {
                if (status === 'complete' && result.info === 'OK') {
                    callback && callback(result);
                } else {
                    alert('地理位置获取失败')
                }
            });
        });
    }*/
    /**
     * 腾讯地图解析定位地址
     * @Author   cafe
     * @DateTime 2016-05-15T16:59:02+0800
     * @param    {string}                 address  [定位地址]
     * @param    {Function}               callback [回调函数]
     * @return   {array}                           [定位信息]
     */
  exports.geocoder = function(address, callback) {
    if (!qq.maps) {
      alert('腾讯地图API加载失败');
      return false;
    }
    if (!address) {
      alert('无法解析定位地址。');
      return false;
    }
    var MGeocoder = new qq.maps.Geocoder();
    //对指定地址进行解析
    MGeocoder.getLocation(address);
    //设置服务请求成功的回调函数
    MGeocoder.setComplete(function(result) {
      callback && callback(result);
    });
    //若服务请求失败，则运行以下函数
    MGeocoder.setError(function() {
      alert("地理位置获取失败");
    });
  };

  /**
   * 百度坐标转腾讯坐标
   * @Author   cafe
   * @DateTime 2016-05-18T11:20:48+0800
   * @param    {string}                 lng      [经度]
   * @param    {string}                 lat      [纬度]
   * @param    {Function}               callback [回调函数]
   * @return   {[type]}                          [description]
   */
  exports.convertor = function(lng, lat, callback) {
    if (!qq.maps) {
      alert('腾讯地图API加载失败');
      return false;
    }
    if (!lng || !lat) {
      alert('无法解析定位地址。');
      return false;
    }
    qq.maps.convertor.translate(new qq.maps.LatLng(lat, lng), 3, function(result) {
      callback && callback(result);
    });
  };


  function get(url, formData, callback, complete) {
    $.ajax({
      url: url,
      type: 'GET',
      data: formData,
      dataType: 'html',
      success: function(res) {
        callback && callback(res);
      },
      error: function(xhr, errorType, error) {
        // alert(error);
        console.log(error);
      },
      complete: function(xhr, status) {
        complete && complete();
      }
    });
  }

  function alertErrorMsg(node, msg) {
    alert(msg);
    node.focus();
    return false;
  }

  function openApp(e) {
    var $this = $(e.target);
    var appUrl = $this.data('app');
    var targetUrl = $this.attr('href');
    if (!browser.versions.mobile) {
      window.location.href = targetUrl;
    } else if (browser.versions.iPhone) {
      window.location.href = appUrl;
    } else {
      var ifr = document.createElement("iframe");
      ifr.src = appUrl;
      ifr.style.display = "none";
      document.body.appendChild(ifr);
    }
  }

  /* 2016-08-11 Cafe */
  //截取字符串 包含中文处理
  //(串,长度,增加...)
  exports.subString = function(str, len, hasDot) {
    var newLength = 0;
    var newStr = "";
    var chineseRegex = /[^\x00-\xff]/g;
    var singleChar = "";
    var strLength = str.replace(chineseRegex, "**").length;
    for (var i = 0; i < strLength; i++) {
      singleChar = str.charAt(i).toString();
      if (singleChar.match(chineseRegex) != null) {
        newLength += 2;
      } else {
        newLength++;
      }
      if (newLength > len) {
        break;
      }
      newStr += singleChar;
    }

    if (hasDot && strLength > len) {
      newStr += "...";
    }
    return newStr;
  };

  exports.getHtml = function(url, formData, callback, complete) {
    $.ajax({
      url: url,
      type: 'GET',
      data: formData,
      dataType: 'html',
      success: function(res) {
        callback && callback(res);
      },
      error: function(xhr, errorType, error) {
        // alert(error);
        console.log(error);
      },
      complete: function(xhr, status) {
        complete && complete();
      }
    });
  };
});
