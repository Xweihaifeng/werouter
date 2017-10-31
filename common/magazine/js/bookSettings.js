var qiniu;
$.ajax({
	url: apiUrl + 'settings',
	type: 'get',
	async: false,
	success: function(data) {
		console.log('setting:', data)
		qiniu = 'http://' + data.data.qiniu.domain_custom + '/';
	},
	error: function(xhr) {
		console.log(xhr);
	}
})

var ename = window.location.href.split('/')[4];
var weid = window.location.href.split('/').pop();
var imgstr = '';
var bgimg = '';
var url=apiUrl + 'magazine/images?weid=' + weid;
// var qiniu='http://images.new.wezchina.com/';
var largePath=qiniu+'magazine/big/';

$("#favicon").attr('href', qiniu + localStorage.getItem('fav'));

$.getJSON(url,function(result){
            if (result.code === 200){
					 console.log(result);
					 $("title").text(result.data.title);
					 if (result.data.background_image != null && result.data.background_image != "") {
						 bgimg = qiniu + result.data.background_image;
					 } else {
						 bgimg = "/common/magazine/img/bookBackground.jpg";
					 }
					 //console.log(bgimg);
					 $.each(result.data.list, function(i, field){
						if(i<result.data.list.length-1) {
							imgstr=imgstr+(qiniu+field.image)+',';
						} else{
							imgstr=imgstr+(qiniu+field.image);
						}
					});
					bookCreate(imgstr, bgimg);
                }else {
                     console.log(result.data.message);
                     //console.log(data);
                }
        });
function bookCreate(imgstr, bgimg){
flippingBook.pages = [
							imgstr
						];     
// 跳转页设置处
flippingBook.contents = [
	[ "首页", 0 ],
	[ "目录", 6],
	[ "尾页", 99 ]
];

// 默认杂志图片大小
flippingBook.settings.bookWidth = 806;
flippingBook.settings.bookHeight = 550;
flippingBook.settings.pageBackgroundColor = 0xEEEEEE;
flippingBook.settings.backgroundColor = 0xEEEEEE;                    // 背景颜色修改
flippingBook.settings.zoomUIColor = 0x919d6c;
flippingBook.settings.useCustomCursors = false;
flippingBook.settings.dropShadowEnabled = false;
flippingBook.settings.zoomImageWidth = 1171;
flippingBook.settings.zoomImageHeight = 1600;
flippingBook.settings.downloadURL = "";
flippingBook.settings.flipSound = "/common/magazine/sounds/01.mp3";
flippingBook.settings.flipCornerStyle = "first page only";
flippingBook.settings.zoomHintEnabled = true;
flippingBook.settings.zoomPath = largePath;//图片放大路径设置
flippingBook.settings.backgroundImage = bgimg;

// default settings can be found in the flippingbook.js file  1222.jpg  12222.jpg
flippingBook.create();
}