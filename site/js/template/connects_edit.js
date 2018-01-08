$(document).ready(function () {
    start();
    var weid = getParam('weid');
    var init = function () {
        $.ajax({
            url: ApiUrl + "setting/"+weid,
            type: 'get',
            dataType: 'JSON',
            success: function (result) {
            	var html = '';
                if (result.code === 200) {
				    		$('#con_name').val(result.data.name);
				    		var config = result.data.config;
                            $.each(config,function (key,val) {
                                html +="<div class=\"form-group\">\n" +
                                    "   <label class=\"control-label col-sm-3 col-md-2 col-lg-1\">"+key+"</label>\n" +
                                    "   <div class=\"col-sm-9 col-md-10 col-lg-11\">\t\t\t\t                      \t\n" +
                                    "     <input type=\"text\" class=\"form-control\" id="+key+"  placeholder=\"domain_default\" value="+val+">\n" +
                                    "   </div>\n" +
                                    "</div>";
                            });

                            $('#config_cont').html(html);
                } else {
                    parent.layer.msg(result.message);

                    return false;
                }
            }
        });
    };
    function getParam(paramName) { 
	    var paramValue = "", isFound = !1; 
	    if (this.location.search.indexOf("?") == 0 && this.location.search.indexOf("=") > 1) { 
	        arrSource = unescape(this.location.search).substring(1, this.location.search.length).split("&"), i = 0; 
	        while (i < arrSource.length && !isFound) arrSource[i].indexOf("=") > 0 && arrSource[i].split("=")[0].toLowerCase() == paramName.toLowerCase() && (paramValue = arrSource[i].split("=")[1], isFound = !0), i++ 
	    } 
	    return paramValue == "" && (paramValue = null), paramValue 
	}; 
    
     $('#updateSet').click(function(){
    	
    	var con_name = $('#con_name').val()
    	var formList = {
    		'domain_custom'   :$('#domain_custom').val(),
    		'domain_default'  :$('#domain_default').val(),
    		'domain_https'    :$('#domain_https').val(),
    		'notify_url'      :$('#notify_url').val(),
    		'secret_key'      :$('#secret_key').val()
    	};
       $.ajax({
        url: ApiUrl + 'setting/'+weid,
            type: 'post',
            dataType: 'json',
            data: {
            	name        :con_name,
            	config      :formList
            },
            success: function(data){
                console.log(data);
                if (data.code === 200){
                	console.log('ok');
                } else {
                    console.log('error: -200');
                }
            },
            error: function(xhr){
                console.log(xhr);
            }
        })
    })
    init();
});