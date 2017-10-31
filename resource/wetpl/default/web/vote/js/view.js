$(function() {
    // 计算操作显示框的位置
    // var window_height = $(window).height();
    // var window_width = $(window).width();
    // var alert_top = (window_height - $('.alert').height()) / 2;
    // var alert_left = (window_width - $('.alert').width()) / 2;
    // $('.alert').css('top', alert_top + 'px');
    // $('.alert').css('left', alert_left + 'px');

    $(function() {
	  $(".animsition").animsition({
		  
		    inClass               :   'fade-in',
		    outClass              :   'fade-out',
		    inDuration            :    1500,
		    outDuration           :    800,
		    linkElement           :   '.animsition-link',
		    // e.g. linkElement   :   'a:not([target="_blank"]):not([href^=#])'
		    loading               :    true,
		    loadingParentElement  :   'body', //animsition wrapper element
		    loadingClass          :   'animsition-loading',
		    unSupportCss          : [ 'animation-duration',
		                              '-webkit-animation-duration',
		                              '-o-animation-duration'
		                            ],
		    //"unSupportCss" option allows you to disable the "animsition" in case the css property in the array is not supported by your browser.
		    //The default setting is to disable the "animsition" in a browser that does not support "animation-duration".
		    
		    overlay               :   false,
		    
		    overlayClass          :   'animsition-overlay-slide',
		    overlayParentElement  :   'body'
		  });

      // setTimeout(function() {
      //   $('.alert').hide();
      // },
      // 2000);
      // $('.btn-close').click(function() {
      //   $('.alert').hide();
      // });
    });
  });

  //获取参数
  // var host = 'http://api.' + window.location.host;
  // var globalHost = host;
  // var ApiMaterPlatQiniuDomain = 'http://images.new.wezchina.com/';
  // var globalHost = "http://api.new.wezchina.com";  
  // var ApiMaterPlatQiniuDomain = 'http://images.new.wezchina.com/';
  var now_time = Math.round(new Date().getTime() / 1000);
  var lazy_cover = "/common/img/vote_front_cover.png";
  var path = window.location.pathname.split('/');
  var len = path.length;
  var globalWeid = path.pop();
  localStorage.setItem('vote-id', globalWeid);
  if (globalWeid == '') {
    globalWeid = path[len - 2];
    localStorage.setItem('vote-id', globalWeid);
  }

  function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg); //匹配目标参数
    if (r != null) return unescape(r[2]);
    return null; 
  }
  //判断为空
  function isNull(data) {
    return (data == "" || data == undefined || data == null || data == 'null') ? true: false;
  }

  var vm = new Vue({
    el: '.indexapp',
    data: {
      title: '',
      summary: '',
      cover: '/common/img/vote_front_cover.png',
      cover_default: '',
      num: '',
      views: '',
      begin_time: '',
      end_time: '',
      only_wechat: '',
      status: '',
      remark: '',
      statistic: '',
      countitem: '',
      rule: '',
      adv: '',
      list: [],
      total: '',
      page: 1,
      checkurl: '',
      rankurl: '',
      indexurl:'',
      appellation:'',
      support_text: '',
      support_link: ''
    },
    created: function() {
      var _self = this;
      var voteid=globalWeid;

      $.ajax({
        url: globalHost + '/vote/detail/' + globalWeid,
        type: 'GET',
        success: function(data) {
          // console.log(data);
          if (data.code == 200) {
            _self.title = data.data.title;
            _self.countitem = data.data.countitem;
            _self.num = data.data.num;
            _self.views = data.data.views;
            _self.cover = data.data.cover.indexOf('//') != -1 ? data.data.cover : ApiMaterPlatQiniuDomain + data.data.cover;
            _self.summary = data.data.summary;
            _self.begin_time = data.data.begin_time;
            _self.end_time = data.data.end_time;
            _self.rule = data.data.rule;
            _self.adv = data.data.adv;
            _self.appellation = data.data.appellation;
            _self.support_text = data.data.support_text;
            _self.support_link = data.data.support_link;
            var $add = '';
            for (var i = 0, ien = data.data.adv.length; i < ien; i++) {
              $add = $add + '<div class="mui-col-sm-12 mui-col-xs-12 ad-img">' + '<a href="' + data.data.adv[i].url + '"><img src="' + ApiMaterPlatQiniuDomain + data.data.adv[i].image + '" ></a>' + '</div>';
            }

            if (data.data.cover_default != null) {
                lazy_cover = ApiMaterPlatQiniuDomain + data.data.cover_default;
                // console.log('lazy_cover:', lazy_cover)
            }
          
            setTimeout(function() {
              jQuery('.ad-box').html($add);
            }, 10000);

            var fav = data.data.favicon;
            if (fav.indexOf('http') === -1) {
              fav = ApiMaterPlatQiniuDomain + fav;
            }
            $("#fav").attr("href", fav);

            //打开方式
            _self.only_wechat = data.data.only_wechat;
//            _self.checkurl = "check.html?id=" + globalWeid;
            _self.checkurl = "/vote/rule/" + globalWeid;
//            _self.rankurl = "rank.html?id=" + globalWeid;
            _self.rankurl = "/vote/report/" + globalWeid;
            _self.indexurl= "/new.wezchina.com/vote/" + globalWeid;
            $("title").text(_self.title);
            // sessionStorage.setItem('title', _self.title);
            // isopeninwechat(_self.only_wechat);
            jQuery(".lazy-cover").lazyload({
              // 图片淡入效果
              effect: "fadeIn",
              // 加载前的默认图片              
              placeholder: lazy_cover
            });
          }
        }
      })
    },
    methods: {
          goto: function(){
            window.location.href = '/vote/preview/' + globalWeid;
          }
        }
  })
  
  //判断是否在微信中打开
  /*function is_weixn() {
    var ua = navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessenger/i) == "micromessenger") {
      return true;
    } else {
      return false;
    }
  }*/
  //判断是否在微信中打开
  /*function isopeninwechat(flag) {
    var hidden_wechat = flag;
    var pc = getUrlParam('pc');
    if (!is_weixn()) {
      if (hidden_wechat == 1) {
        if (isNull(pc)) {
          window.location.href = "/vote/warn";
        }
      }
    }
  }*/
  $(function() {
    //判断在微信中打开直接登录
    /*if (is_weixn()) {
      var openidflag = sessionStorage.getItem('setopenid');
      //setopenid不为空时
      if (isNull(openidflag) == false) {
        var usertoken = sessionStorage.getItem('user-token');
        if (isNull(usertoken)) {
          openid = getUrlParam("openid");
          //获取来源首页进入
          var comeweid = '';
          comeweid = 'vote/' + globalWeid;
          //微信登录
          $.ajax({
            url: globalHost + '/wxlogin',
            type: 'POST',
            data: {
              openid: openid,
              ref_url: comeweid
            },
            success: function(data) {
              if (data.code == 200) {
                if (isNull(data.token) == false) {
                  sessionStorage.setItem('user-token', data.token);
                }
              }
            }
          })
        }
      } else {
        //微信未跳转时
        sessionStorage.setItem('setopenid', true);
        window.location.href = encodeURI(globalHost + '/openid?url=' + window.location.href);
      }
    }*/
    //初始化layerui
    layui.use(['layer', 'laypage', 'element'],
    function() {
      var layer = layui.layer
    });
    //下拉折叠
    jQuery(document).on('click', '.icon-downarrow',
    function() {
      jQuery('.condition-3').css('display', 'block');
      jQuery(this).removeClass('icon-downarrow').addClass('icon-toparrow');
    });
    jQuery(document).on('click', '.icon-toparrow',
    function() {
      jQuery('.condition-3').css('display', 'none');
      jQuery(this).removeClass('icon-toparrow').addClass('icon-downarrow');
    });

    // 异步加载投票列表数据
    var limit = 6;
    var i = 1; //ajax成功计数
    var lock = false; //init lock
    var pages_total = 1;
    var mem = 1;
    var lists;
    var isScroll = false;
    var isSuccess = false;

    var nextPage = (lis, voteid, limit, page, key, next) => {
      $.ajax({
          url: globalHost + '/vote/list',
          type: 'POST',
          data: {
            vote_id: voteid,
            limit: limit,
            page: page,
            keywords: key
          },
          success: function(data) {
            if (data.code == 200) {
              // console.log(data)
              lists = data.data;
              isSuccess = true;           
            }
          }
      })
    }

    var fast = (lists, lis, page, next) => {
      // console.log(lists);
      pages_total = Math.ceil(lists.total / limit);
      layui.each(lists.list,
      function(index, item) {                   
        var item_cover = item.cover.indexOf('//') != -1 ? item.cover : ApiMaterPlatQiniuDomain + item.cover
        lis.push('<div class="mui-col-xs-6 mui-col-sm-6 vote-list">' + '<div class="vote-list-bgc">' + '<a href="/vote/show/' + item.weid + '">' + '<img id="place" class="lazy-' + i + '" data-original="' + item_cover + '" alt="" />' + '</a>' + '<div class="vote-list-title">' + item.sort + '.' + item.title + '</div>' + '<div class="vote-list-btn">' + '<button id=' + item.sort + '.' + item.title + ' data-sort="' + item.sort + '" data-title="' + item.title + '" data-id="' + item.weid + '">' + '<i class="iconfont icon-zan"></i>投票' + '</button>' + '</div>' + '<div class="vote-list-num"><font>' + item.nums + '</font>票</div>' + '</div>' + '</div>');
      });
      next(lis.join(''), page < pages_total);
      // 图片懒加载
      jQuery(".lazy-" + i).lazyload({
        // 图片淡入效果
        effect: "fadeIn",
        // 加载前的默认图片
        placeholder: lazy_cover
      });
      i++;
    }

    layui.use('flow',
    function() {
      var flow = layui.flow;      
      // 信息流     
      flow.load({
        elem: '#vote_list' // 指定列表容器
        ,isAuto: true
        ,isLazyimg: true
        ,
        done: function(page, next) { // 到达临界点（默认滚动触发），触发下一页
          var lis = [];
          var voteid = globalWeid;
          var key = sessionStorage.getItem('key');
          if (key == null) {
            key = '';
          }
      
          if (i > 1) {
            limit = 4;
            page = page + 0.5;
            mem = page;
          };

          var loadFast = (page, next) => {
            $('.layui-flow-more').html('<div class="layui-flow-more"><a href="javascript:;"><i class="layui-anim layui-anim-rotate layui-anim-loop layui-icon iconfont">&#xe77f;</i></a></div>')
            var success = setInterval(function() {
              if (isSuccess) {
                isSuccess = false;                
                fast(lists, [], page, next);
                clearInterval(success);
              }
            }, 10);
          }

          // console.log('out page:', page)
          // console.log('mem:', mem)

          isScroll = false;

          nextPage(lis, voteid, limit, page, key, next);          

          //init 
          if (!lock) {
              lock = true;
              loadFast(page, next);
              isScroll = true;
          }

          if (page < pages_total) {
              $('.layui-flow-more').html('<div class="layui-flow-more"><a href="javascript:;"><cite id=' + page + '>加载更多</cite></a></div>') 
           } else {
              $('.layui-flow-more').html('<div class="layui-flow-more">没有更多了</div>')
           }

          if (!isScroll) {            
              isScroll = true;
              window.onscroll = function() {
              var clientHeight = document.documentElement.scrollTop === 0 ? document.body.clientHeight : document.documentElement.clientHeight;
              var scrollTop = document.documentElement.scrollTop === 0 ? document.body.scrollTop : document.documentElement.scrollTop;
              var scrollHeight = document.documentElement.scrollTop === 0 ? document.body.scrollHeight : document.documentElement.scrollHeight;
              if (clientHeight + scrollTop === scrollHeight && page < pages_total) {
                  // console.log('inner page:', page)
                  // console.log('bottom')
                  // console.log('i:', i)
                  
                  if (i == (mem - 0.5)) {
                      loadFast(page, next);
                  } else {
                      // console.log('error page', page)
                      var check = setInterval(function() {
                        if (i == (mem - 0.5)) {
                            loadFast(page, next);
                            clearInterval(check);
                        }
                      }, 10)
                  }
                }
              }
          }
           
           $("cite").click(function() {
              var lis = [];
              // console.log('clicked')
              // console.log('i:', i)
              // console.log('clicked page:', page);              
              loadFast(page, next);
           })
          }
      });
      // 图片懒加载
      flow.lazyimg();
    });

    //投票
    jQuery(document).on('click', '.vote-list-btn button',
    function() {
      //显示登录弹框
      //if (vm.only_wechat == 1) {
      if (vm.only_wechat == 0) {
        layer.msg("请扫描二维码在微信中投票", {
          time: 1500,
          offset: '350px'
        });
        return false;
      }
      if (vm.status == 2) {
        layer.msg("投票项目关闭", {
          time: 1500,
          offset: '350px'
        });
        return false;
      }
      var begin_time = Date.parse(new Date(vm.begin_time));
      begin_time = begin_time / 1000;
      if (now_time < begin_time) {
        layer.msg("本投票活动未开放投票", {
          time: 1500,
          offset: '350px'
        });
        return false;
      }
      var end_time = Date.parse(new Date(vm.end_time));
      end_time = end_time / 1000;
      if (now_time > vm.end_time) {
        layer.msg("本投票活动未开放投票", {
          time: 1500,
          offset: '350px'
        });
        return false;
      }
      var user = sessionStorage.getItem('user-token');
      var vote_id = jQuery(this).data('id');
      if (isNull(user)) {
        // $('#myModal2').modal();
        layer.msg("请扫描二维码在微信中投票", {
          time: 1500,
          offset: '350px'
        });
        
        jQuery('.openid').attr('value', vote_id);
      } else {
        //投票
        var now_obj = jQuery(this);
        var now_num = jQuery(this).parent().next().find('font').text(); // 列表中的投票数量
        var now_num1 = jQuery('.after-num').text(); // 标题栏中的投票数量
        var after_num = parseInt(now_num) + 1;
        var after_num1 = parseInt(now_num1) + 1;
        $.ajaxSetup({
          global: true,
          dataType: 'json',
          headers: {
            'Token': user
          }
        });
        $.ajax({
          url: globalHost + '/vote/voted',
          type: 'POST',
          data: {
            item_id: vote_id
          },
          success: function(data) {
            if (data.code == 200) {
              if (isNull(data.data) == false) {
                now_obj.parent().next().find('font').text(after_num); // 列表中的投票数量
                jQuery('.after-num').text(after_num1); // 标题栏中的投票数量
                layer.msg("投票成功", {
                  time: 1500,
                  offset: '350px'
                });
                var obj = vm;
                var title = '我投了' + now_obj.data('sort') + '号“' + now_obj.data('title') + '”项目一票，“' + vm.title + '”投票火热进行中，快来围观，参与投票吧！';
                initWx(obj, title);
              }
            } else {
              layer.msg(data.message, {
                time: 1500,
                offset: '350px'
              });
            }
          }
        })
      }
    });
  }); 
  
  /*var InterValObj; //timer变量，控制时间
  var count = 60; //间隔函数，1秒执行
  var curCount; //当前剩余秒数
  //发送验证码
  $('#btnSendCode').click(function(data) {
    sendMessage();
  });
  function sendMessage() {
    var mobile = $('#mobile').val();
    if (mobile != "" && /^1[34578]{1}\d{9}$/.test(mobile)) {
      curCount = count;
      //设置button效果，开始计时
      $("#btnSendCode").attr("disabled", "true");
      $("#btnSendCode").val("重新发送(" + curCount + ')');
      InterValObj = window.setInterval(SetRemainTime, 1000); //启动计时器，1秒执行一次
      //向后台发送处理数据
      $.ajax({
        url: globalHost + '/codes',
        type: 'POST',
        data: {
          phone: mobile
        },
        success: function(data) {
          if (data.code == 200) {
            layer.msg("发送验证码成功", {
              time: 1500,
              offset: '350px'
            });
          } else {
            layer.msg("发送验证码失败", {
              time: 1500,
              offset: '350px'
            });
          }
        }
      })
    } else {
      layer.msg("手机号为空或者格式不正确", {
        time: 1500,
        offset: '350px'
      });
    }
  }*/

  //timer处理函数
  /*function SetRemainTime() {
    if (curCount == 0) {
      window.clearInterval(InterValObj); //停止计时器
      $("#btnSendCode").removeAttr("disabled"); //启用按钮
      $("#btnSendCode").val("重新发送");
    } else {
      curCount--;
      $("#btnSendCode").val("重新发送(" + curCount + ')');
    }
  }*/

  //登录
  /*$('.save-code').click(function() {
    //获取来源首页进入
    var comeweid = '';
    comeweid = 'vote/' + globalWeid;
    var mobile = $('#mobile').val();
    var code = $('.input2').val();
    if (mobile == null || mobile == '' || code == null || code == '') {
      layer.msg("手机号和验证码不能为空", {
        time: 1500,
        offset: '350px'
      });
    } else {
      $.ajax({
        url: globalHost + '/login',
        type: 'POST',
        data: {
          phone: mobile,
          code: code,
          ref_url: ''
        },
        success: function(data) {
          if (data.code == 200) {
            if (isNull(data.token) == false) {
              //登录的toke
              sessionStorage.setItem('user-token', data.token);
              var item_id = jQuery('.openid').val();
              $.ajax({
                url: globalHost + '/vote/voted',
                type: 'POST',
                data: {
                  item_id: item_id
                },
                headers: {
                  'Token': data.token
                },
                success: function(data) {
                  if (data.code == 200) {
                    if (isNull(data.data) == false) {
                      layer.msg("投票成功", {
                        time: 1500,
                        offset: '350px'
                      });
                    }
                  } else {
                    layer.msg(data.message, {
                      time: 1500,
                      offset: '350px'
                    });
                  }
                }
              })
            }
          } else {
            layer.msg(data.message, {
              time: 1500,
              offset: '350px'
            });
          }
        }
      })
    }
  });*/

  //第三方统计
  setTimeout(function() {
    var statistic = vm.statistic;
    if (statistic) {
      eval(statistic);
    }
  },
  10000);

  /*$.ajax({
    url: globalHost + '/vote/view/' + globalWeid,
    type: 'GET',
    success: function(obj) {
      console.log(obj);
    }
  });*/

  /*$.ajax({
    url: globalHost + '/wxjssdk',
    type: 'POST',
    data: {
      currenturl: window.location.href
    },
    success: function(data) {
      if (data.code == 200) {
        wx.config({
          debug: false,
          appId: data.data.appId,
          timestamp: data.data.timestamp,
          nonceStr: data.data.nonceStr,
          signature: data.data.signature,
          jsApiList: ["onMenuShareTimeline", "onMenuShareAppMessage"]
        });
        $.ajax({
          url: globalHost + '/vote/detail/' + globalWeid,
          type: 'GET',
          success: function(obj) {
            wx.ready(function() {
              initWx(obj.data);
            });
          }
        })
      }
    }
  })*/

  //微信分享
  /*function initWx(data, title) {
    wx.onMenuShareTimeline({
      title: title,
      // 分享标题
      link: window.location.href,
      // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
      imgUrl: ApiMaterPlatQiniuDomain + data.cover,
      // 分享图标
      success: function() {
        // 用户确认分享后执行的回调函数
      },
      cancel: function() {
        // 用户取消分享后执行的回调函数
      }
    });
    wx.onMenuShareAppMessage({
      title: title,
      // 分享标题
      desc: data.summary,
      // 分享描述
      link: window.location.href,
      // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
      imgUrl: ApiMaterPlatQiniuDomain + data.cover,
      // 分享图标
      type: '',
      // 分享类型,music、video或link，不填默认为link
      dataUrl: '',
      // 如果type是music或video，则要提供数据链接，默认为空
      success: function() {
        // 用户确认分享后执行的回调函数
      },
      cancel: function() {
        // 用户取消分享后执行的回调函数
      }
    });
  }*/

  var search = function() {
    $("#vote_list").html('');
    var voteid = globalWeid;
    var key = $("#search_key").val();
    sessionStorage.setItem("key", key);
    // 异步加载投票列表数据
    layui.use(['layer', 'laypage', 'element'],
    function() {
      var layer = layui.layer
    });

    var limit = 6;
    var i = 1; //ajax成功计数
    var lock = false; //init lock
    var pages_total = 1; //搜索功能
    var mem = 1;
    var lists;
    var isScroll = true;
    var isSuccess = false;

    var nextPage = (lis, voteid, limit, page, key, next) => {
      $.ajax({
          url: globalHost + '/vote/list',
          type: 'POST',
          data: {
            vote_id: voteid,
            limit: limit,
            page: page,
            keywords: key
          },
          success: function(data) {
            if (data.code == 200) {
              // console.log(data)
              lists = data.data;
              isSuccess = true;           
            }
          }
      })
    }

    var fast = (lists, lis, page, next) => {
      // console.log(lists);
      pages_total = Math.ceil(lists.total / limit);
      layui.each(lists.list,
      function(index, item) {                   
        var item_cover = item.cover.indexOf('//') != -1 ? item.cover : ApiMaterPlatQiniuDomain + item.cover
        lis.push('<div class="mui-col-xs-6 mui-col-sm-6 vote-list">' + '<div class="vote-list-bgc">' + '<a href="/vote/show/' + item.weid + '">' + '<img id="place" class="lazy-' + i + '" data-original="' + item_cover + '" alt="" />' + '</a>' + '<div class="vote-list-title">' + item.sort + '.' + item.title + '</div>' + '<div class="vote-list-btn">' + '<button id=' + item.sort + '.' + item.title + ' data-sort="' + item.sort + '" data-title="' + item.title + '" data-id="' + item.weid + '">' + '<i class="iconfont icon-zan"></i>投票' + '</button>' + '</div>' + '<div class="vote-list-num"><font>' + item.nums + '</font>票</div>' + '</div>' + '</div>');
      });
      next(lis.join(''), page < pages_total);
      // 图片懒加载
      jQuery(".lazy-" + i).lazyload({
        // 图片淡入效果
        effect: "fadeIn",
        // 加载前的默认图片
        placeholder: lazy_cover
      });
      i++;
    }

    layui.use('flow',
    function() {
      var flow = layui.flow;
      // 信息流     
      flow.load({
        elem: '#vote_list' // 指定列表容器
        ,isAuto: true
        ,isLazyimg: true
        ,
        done: function(page, next) { // 到达临界点（默认滚动触发），触发下一页
          var lis = [];
          var voteid = globalWeid;
          // var key = sessionStorage.getItem('key');
          // if (key == null) {
          //   key = '';
          // }
      
          if (i > 1) {
            limit = 4;
            page = page + 0.5;
            mem = page;
          };

          var loadFast = (page, next) => {
            $('.layui-flow-more').html('<div class="layui-flow-more"><a href="javascript:;"><i class="layui-anim layui-anim-rotate layui-anim-loop layui-icon iconfont">&#xe77f;</i></a></div>')
            var success = setInterval(function() {
              if (isSuccess) {
                isSuccess = false;  
                fast(lists, [], page, next);
                clearInterval(success);
              }
            }, 10);
          }

          // console.log('out page:', page)
          // console.log('mem:', mem)

          isScroll = false;

          nextPage(lis, voteid, limit, page, key, next);          

          //init 
          if (!lock) {
              lock = true;
              loadFast(page, next);
              isScroll = true;
          }

          if (page < pages_total) {
              $('.layui-flow-more').html('<div class="layui-flow-more"><a href="javascript:;"><cite id=' + page + '>加载更多</cite></a></div>') 
           } else {
              $('.layui-flow-more').html('<div class="layui-flow-more">没有更多了</div>')
           }

          if (!isScroll) {
              isScroll = true;
              window.onscroll = function() {
              var clientHeight = document.documentElement.scrollTop === 0 ? document.body.clientHeight : document.documentElement.clientHeight;
              var scrollTop = document.documentElement.scrollTop === 0 ? document.body.scrollTop : document.documentElement.scrollTop;
              var scrollHeight = document.documentElement.scrollTop === 0 ? document.body.scrollHeight : document.documentElement.scrollHeight;
              if (clientHeight + scrollTop === scrollHeight && page < pages_total) {
                  // console.log('inner page:', page)
                  // console.log('bottom')
                  // console.log('i:', i)
                  
                  if (i == (mem - 0.5)) {
                      loadFast(page, next);
                  } else {
                      // console.log('error page', page)
                      var check = setInterval(function() {
                        if (i == (mem - 0.5)) {
                            loadFast(page, next);
                            clearInterval(check);
                        }
                      }, 10)
                  }
                }
              }
          }
           
           $("cite").click(function() {
              var lis = [];
              // console.log('clicked')
              // console.log('i:', i)
              // console.log('clicked page:', page);
              loadFast(page, next);
           })
          }
      });
      // 图片懒加载
      flow.lazyimg();
    });
     
    /*var limit = 6;    
    layui.use('flow',
    function() {
      var flow = layui.flow;
      // 信息流
      flow.load({
        elem: '#vote_list' // 指定列表容器
        ,isAuto: false
        ,isLazyimg: true
        ,
        done: function(page, next) { // 到达临界点（默认滚动触发），触发下一页
          var lis = [];
          // 以jQuery的Ajax请求为例，请求下一页数据（注意：page是从2开始返回）          
          $.ajax({
            url: globalHost + '/vote/list',
            type: 'POST',
            data: {
              vote_id: voteid,
              limit: limit,
              page: page,
              keywords: key
            },
            success: function(data) {
              // console.log(data);
              if (data.code == 200) {
                pages_total = Math.ceil(data.data.total / limit);
                layui.each(data.data.list,
                        function(index, item) {
                          var item_cover = item.cover.indexOf('//') != -1 ? item.cover : ApiMaterPlatQiniuDomain + item.cover
                          lis.push('<div class="mui-col-xs-6 mui-col-sm-6 vote-list">' + '<div class="vote-list-bgc">' + '<a href="/vote/show/' + item.weid + '">' + '<img class="lazy-' + page + '" data-original="' + item_cover + '" alt="" />' + '</a>' + '<div class="vote-list-title">' + item.sort + '.' + item.title + '</div>' + '<div class="vote-list-btn">' + '<button id=' + item.sort + '.' + item.title + ' data-sort="' + item.sort + '" data-title="' + item.title + '" data-id="' + item.weid + '">' + '<i class="iconfont icon-zan"></i>投票' + '</button>' + '</div>' + '<div class="vote-list-num"><font>' + item.nums + '</font>票</div>' + '</div>' + '</div>');
                        });
                next(lis.join(''), page < pages_total);
                // 图片懒加载
                jQuery(".lazy-" + page).lazyload({
                  // 图片淡入效果
                  effect: "fadeIn",
                  // 加载前的默认图片
                  placeholder: lazy_cover
                });
              }
            }
          })
        }
      });

      // 图片懒加载
      // flow.lazyimg();
    });*/
  	}

  $(".search-3").click(function(){
    search();
  })

  $("#search_key").keydown(function(evt){
    switch (evt.keyCode){
      case 13: search();
    }
  });