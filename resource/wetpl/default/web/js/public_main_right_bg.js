var options200 = $.get(apiUrl + "cms/setting/show");
options200.done(function(data) {
	if(data.code == 200 && data.data) {
		var result = data.data;
		var bgRight = result.background_right;
		if(!bgRight) {
            bgRight = "/common/img/dibu.jpg";
        } else if (bgRight.indexOf('http') != 0 && bgRight != "") {
            bgRight = imgSet(bgRight, 1200, 960, 3);
        }
        $("#public_main_right_bg")  .css({ "background-image": "url(" + bgRight + ")"})
	}
});
options200.fail(function(error) {
	console.log(error);
});