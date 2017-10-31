/**
 * Created by millet on 17/6/20.
 */
(function(window, document){
    function createHttpRequest()
    {
        if(window.ActiveXObject){
            return new ActiveXObject("Microsoft.XMLHTTP");
        }
        else if(window.XMLHttpRequest){
            return new XMLHttpRequest();
        }
    }
    function AliLogTracker(host,project,logstore)
    {
        this.uri_ = '//' + project + '.' + host + '/logstores/' + logstore + '/track?APIVersion=0.6.0';
        this.params_=new Array();
        this.httpRequest_ = createHttpRequest();
    }
    AliLogTracker.prototype = {
        push: function(key,value) {
            if(!key || !value) {
                return;
            }
            this.params_.push(key);
            this.params_.push(value);
        },
        logger: function()
        {
            var url = this.uri_;
            var k = 0;
            while(this.params_.length > 0)
            {
                if(k % 2 == 0)
                {
                    url += '&' + encodeURIComponent(this.params_.shift());
                }
                else
                {
                    url += '=' + encodeURIComponent(this.params_.shift());
                }
                ++k;
            }
            try
            {
                this.httpRequest_.open("GET",url,true);
                this.httpRequest_.send(null);
            }
            catch (ex)
            {
                if (window && window.console && typeof window.console.log === 'function')
                {
                    console.log("Failed to log to ali log service because of this exception:\n" + ex);
                    console.log("Failed log data:", url);
                }
            }

        }
    };
    //获取当前页面的属性
    function Browser(logger)
    {
        var browser_name = "";
        var Sys = {};
        var ua = navigator.userAgent.toLowerCase();
        var s;
        (s = ua.match(/msie ([\d.]+)/)) ? Sys.ie = s[1] :
            (s = ua.match(/firefox\/([\d.]+)/)) ? Sys.firefox = s[1] :
                (s = ua.match(/chrome\/([\d.]+)/)) ? Sys.chrome = s[1] :
                    (s = ua.match(/opera.([\d.]+)/)) ? Sys.opera = s[1] :
                        (s = ua.match(/version\/([\d.]+).*safari/)) ? Sys.safari = s[1] : 0;
        if (Sys.ie) browser_name = 'IE: ' + Sys.ie;
        if (Sys.firefox) browser_name = 'Firefox: ' + Sys.firefox;
        if (Sys.chrome) browser_name = 'Chrome: ' + Sys.chrome;
        if (Sys.opera) browser_name = 'Opera: ' + Sys.opera;
        if (Sys.safari) browser_name = 'Safari: ' + Sys.safari;
        logger.push('_ua_', browser_name);
    }
    function OS(logger)
    {
        var userAgent = navigator.userAgent;
        var os  = "";
        if(navigator.platform.indexOf("Win") > -1){
            if(userAgent.indexOf("Windows NT 5.0") > -1){
                os += "Win2000";
            }else if(userAgent.indexOf("Windows NT 5.1") > -1){
                os += "WinXP";
            }else if(userAgent.indexOf("Windows NT 5.2") > -1){
                os += "Win2003";
            }else if(userAgent.indexOf("Windows NT 6.0") > -1){
                os += "WindowsVista";
            }else if(userAgent.indexOf("Windows NT 6.1") > -1 || userAgent.indexOf("Windows 7") > -1){
                os += "Win7";
            }else if(userAgent.indexOf("Windows 8") > -1){
                os += "Win8";
            }else{
                os += "Other";
            }
        }else if(navigator.platform.indexOf("Mac") > -1){
            os += "Mac";
        }else if(navigator.platform.indexOf("X11") > -1){
            os += "Unix";
        }else if(navigator.platform.indexOf("Linux") > -1){
            os += "Linux";
        }else{
            os += "Other";
        }
        logger.push('_os_', os);
    }
    function SCR(logger)
    {
        logger.push("_scr_", window.screen.width + "*" + window.screen.height);
    }
    function GetSID(c_name){
        if(document.cookie.length>0){
            c_start=document.cookie.indexOf(c_name + "=")
            if(c_start!=-1){
                c_start=c_start + c_name.length+1
                c_end=document.cookie.indexOf(";",c_start)
                if(c_end==-1) c_end=document.cookie.length
                return unescape(document.cookie.substring(c_start,c_end));
            }
        }
    }
    function Url(logger)
    {
        var title = document.title;
        if(title == null)
        {
            var t_titles = document.getElementByTagName("title");
            if(t_titles && t_titles.length >0)
            {
                title =  t_titles[0];
            }
            else
            {
                title = "";
            }
        }
        logger.push('_title_', title);
        var ref = '';
        if (document.referrer.length > 0) {
            ref = document.referrer;
        }
        try
        {
            if (ref.length == 0 && opener.location.href.length > 0) {
                ref = opener.location.href;
            }
        }
        catch(e){}
        logger.push('_ref_', ref);
        logger.push('_url_', window.location.href);
        logger.push('_can_', document.cookie);
        logger.push('_sid_', GetSID(logger.sessionName_));
    }
    function ls(logger){
        var QscToken = window.localStorage.getItem("Qsc-Token");
        QscToken =$.parseJSON(QscToken);
        var DTASESSIONID = getCookie('DTASESSIONID');
        var DTAUSRID = getCookie('DTAUSRID');
        if(QscToken){
            logger.push('access_token', (JSON.parse(QscToken)).access_token);
        }

        if(DTASESSIONID){
            logger.push('dtasessionid', DTASESSIONID);
        };
        if(DTAUSRID){
            logger.push('dtauserid', DTAUSRID);
        }
    };
    //读取cookie
    function getCookie(name)
    {
        var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
        if(arr=document.cookie.match(reg))
            return unescape(arr[2]);
        else
            return null;
    }
    function Agent(logger)
    {
        Url(logger);
        Browser(logger);
        OS(logger);
        SCR(logger);
        ls(logger);
    }
    window.Tracker = AliLogTracker;
    window.Agent = Agent;
})(window, document);

/**
 * 阿里数据统计
 * @date 2016.12.22
 */
var statistics = new function() {
    /**
     * 调用aliyun统计代码
     */
    this.tracker = function(message, source, lineno, colno, error) {
        var logger = new window.Tracker('cn-hangzhou.log.aliyuncs.com','qsclogs-js','error');
        logger.push('message', message);
        logger.push('source', source);
        logger.push('lineno', lineno);
        logger.push('colno', colno);
        logger.push('error', error);
        window.Agent(logger);
        logger.logger();

    };

    return this;
};
window.onerror = function(message, source, lineno, colno, error){
//            console.log(message, source, lineno, colno, error);
    statistics.tracker(message, source, lineno, colno, error);
};