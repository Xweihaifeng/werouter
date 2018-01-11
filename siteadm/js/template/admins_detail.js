$(document).ready(function() {
	start();
	var adminWeId = getParam('weid');
	var init = function() {
        $.ajax({
            url: ApiUrl + "admins/detail/" + adminWeId,
            type: 'get',
            dataType: 'JSON',
            success: function(result) {
                if(result.code === 200) {
                    $('#userName').val(result.data.username);
                    $('#role_name').val(result.data.role_name);
                    $('#real_name').val(result.data.real_name);
                    $('#sex').val(result.data.sex==1?'男':'女');
                    $('#phone').val(result.data.phone);
                    $('#memox').val(result.data.memo);
                } else {
                    parent.layer.msg(result.message);
                    return false;
                }
            }
        });
	};

	function getParam(paramName) {
		var paramValue = "",
			isFound = !1;
		if(this.location.search.indexOf("?") == 0 && this.location.search.indexOf("=") > 1) {
			arrSource = unescape(this.location.search).substring(1, this.location.search.length).split("&"), i = 0;
			while(i < arrSource.length && !isFound) arrSource[i].indexOf("=") > 0 && arrSource[i].split("=")[0].toLowerCase() == paramName.toLowerCase() && (paramValue = arrSource[i].split("=")[1], isFound = !0), i++
		}
		return paramValue == "" && (paramValue = null), paramValue
	};

	init();
});