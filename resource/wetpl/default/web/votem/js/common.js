    // 分享模板关键字替换
    var STMP = {
        TMP : {
            index : '我投了{{number}}号"{{name}}"{{showname}}一票，"{{votename}}"投票火热进行中，快来围观，参与投票吧！',
            detail : '我为{{number}}号"{{name}}"{{showname}}带盐，欢迎各位朋友前来围观，请支持TA，投上您宝贵的一票！',
        },
        tmp_variant : {
            votename : '我的投票',
            number : '1',
            name : '投票',
            showname : '项目'
        }
    };
    function templaten(string, MX){
        for (prop in MX) {
            string = string.replace(new RegExp('{{' + prop + '}}','gm'),MX[prop]);
        }
        return string;
    }

    //获取参数
    function getUrlParam(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
        var r = window.location.search.substr(1).match(reg); //匹配目标参数
        if (r != null) return unescape(r[2]);
        return null; //返回参数值
    }
    //判断为空
    function isNull(data) {
        return (data == "" || data == undefined || data == null || data == 'null') ? true: false;
    }


