var url = window.location.href,
    host = 'https://g.welian.com/',
    version = 0;

var getPath = function() {
    var js = document.scripts,
      script = js[js.length - 1],
      jsPath = script.src;
    if (script.getAttribute('merge')) return;
    return jsPath.substring(0, jsPath.lastIndexOf("/") + 1);
}

if (url.indexOf('http://h5.welian.com') === -1) {
    host = 'http://' + getPath().split('/')[2];
}

$script = document.getElementsByTagName('script');

for (var i = 0; i < $script.length; i++) {
  if ($script[i].src.indexOf('config.js')) {
    version = $script[i].src.replace('http://').split('/')[1];
  }
}

var base_url = host;
seajs.config({
    // 别名配置
    alias: {
        wx: base_url + '/h5/common/wx.js',
        browser: base_url + '/h5/plugins/browser.js',
        iscroll: base_url + '/common/plugins/iscroll.js',
        'welianJsBridge': base_url + '/h5/common/WelianJSBridge.js',
        'jquery': base_url + '/static/js/jquery.min.js',
        'vue': base_url + '/static/js/vue-2.1.10.min.js',
        'vueRouter': base_url + '/static/js/vue-router-2.2.1.min.js',
        'vueInfiniteLoading': base_url + '/h5/js/vue-infinite-loading.js',
        'toast': base_url + '/h5/js/toast.js',
        'vueComponents': base_url + '/h5/js/components.js'
    },

    // 路径配置
    paths: {},

    // 变量配置
    vars: {
        imageUrl: 'http://fed.welian.com'
    },

    //文件映射
    map: [
        //可配置版本号
        // ['.js', '.js?v=' + new Date().getTime()]
    ],

    // 预加载项
    preload: [],

    // 调试模式
    debug: 0,

    // Sea.js 的基础路径
    base: base_url + '/h5/js/',

    // 文件编码
    charset: 'utf-8'
});
