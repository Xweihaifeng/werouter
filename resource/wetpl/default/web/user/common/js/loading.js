/**
 * Created by lisheng on 2017/12/19.
 * 加载页面
 */

/*
var _PageHeight = document.documentElement.clientHeight;
var _PageWidth = document.documentElement.clientWidth;
var _LoadingTop = _PageHeight > 61 ? (_PageHeight - 61) / 2 : 0;
var _LoadingLeft = _PageWidth > 215 ? (_PageWidth - 215) / 2 : 0;
var Loadimagerul="https://images.wezchina.com/5-121204193R0.gif";
var _LoadingHtml = '<div id="loadingDiv" style="position:absolute;left:0;width:100%;height:' + _PageHeight + 'px;top:0;background:#fff;opacity:1;filter:alpha(opacity=80);z-index:10000;"><div style="position: absolute; cursor1: wait; left: ' + _LoadingLeft + 'px; top:' + _LoadingTop + 'px; width:100px;; height: 57px; line-height: 57px; padding-left: 50px; padding-right: 5px; background: #fff url('+Loadimagerul+') no-repeat scroll 5px 12px;font-family:\'Microsoft YaHei\';"></div></div>';

document.write(_LoadingHtml);
*/
$(function () {
    if ($("#right").length > 0){
        $("#right").before('<div id="loadingDiv" style="background: white;position: relative;margin-left: 230px;float: left;left: 80px;top: 110px;width: 998px;height: 2000px;"><div style="position: absolute;cursor1: wait;left: 449px;top: 300px;width: 100px;height: 57px;line-height: 57px;padding-left: 50px;padding-right: 5px;background: #fff url(https://images.wezchina.com/5-121204193R0.gif) no-repeat scroll 5px 12px;font-family: \'Microsoft YaHei\';"></div></div>');
    }else{
        $("#right_load_div").before('<div id="loadingDiv" style="background: white;position: relative;margin-left: 230px;float: left;left: 80px;top: 110px;width: 998px;height: 2000px;"><div style="position: absolute;cursor1: wait;left: 449px;top: 300px;width: 100px;height: 57px;line-height: 57px;padding-left: 50px;padding-right: 5px;background: #fff url(https://images.wezchina.com/5-121204193R0.gif) no-repeat scroll 5px 12px;font-family: \'Microsoft YaHei\';"></div></div>');
    }
})
