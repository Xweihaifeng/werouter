/*!  var system ={
win : false,
mac : false,
xll : false
};
//���ƽ̨
var p = navigator.platform;
var url=window.location.href.replace("m","www");
system.win = p.indexOf("Win") == 0;
system.mac = p.indexOf("Mac") == 0;
system.x11 = (p == "X11") || (p.indexOf("Linux") == 0);
if(system.win||system.mac||system.xll){
 window.location.href=url;
} */