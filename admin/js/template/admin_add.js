$(document).ready(function () {
    start();
    var init = function () {
        $.ajax({
            url: ApiUrl + "roles",
            type: 'get',
            dataType: 'JSON',
            success: function (result) {
                if (result.code === 200) {
                    var html = '';
                    $.each(result.data.list, function (key, val) {
                        html += '<option name="options" value='+val.weid+' selected=\"selected\">' + val.display_name + '</option>';
                    });
                    $('input:radio[name="list"]').get(0).checked=true; 
                    $("#role_id").html(html);
                } else {
                    parent.layer.msg(result.message);

                    return false;
                }
            }
        });
    };

    $('#updateSet').click(function(){
    	var formList = {
    		'id'         :$("#role_id").find("option:selected").val(),
    		'username'   :$('#username1').val(),
    		'password'   :$('#password').val(),
    		'rePassword' :$('#rePassword').val(),
    		'phone'      :$('#phone').val(),
    		'real_name'  :$('#real_name').val(),
    		'inlineRadioOptions':$('input:radio[name="list"]:checked').val(),
    		'memo'       :$('#memo').val()
    	}

    	alert(formList.username);

    	 $.ajax({
            url: ApiUrl + 'admins',
            type: 'post',
            dataType: 'json',
            data:  {
            	role_id   :formList.id,
            	username  :formList.username,
            	password  :formList.password,
            	rePassword:formList.rePassword,
            	phone     :formList.phone,
            	real_name :formList.real_name,
            	inlineRadioOptions:formList.inlineRadioOptions,
            	memo      :formList.memo
            },
            success: function(data){
                if (data.code === 200){
                    showTips('添加成功!',2,'alert-info');
                } else {
                    showTips('添加失败!'+data.message,2,'alert-danger');
                    console.log('error: -200');
                }
            },
            error: function(xhr){
                console.log(xhr);
            }
        })
    });
    function showTips(tips, time, el) {
        var windowWidth = document.documentElement.clientWidth;
        var tipsDiv = '<div class="alert ' + el + '" role="alert">' + tips + '</div>';

        $('body').append(tipsDiv);
        $('div.alert').css({
            'top': '220px',
            'left': (windowWidth / 2) - (tips.length * 10 / 2) + 'px',
            'position': 'absolute',
            'padding': '3px 5px',
            'background': '#ffffff',
            'width': '200px',
            'font-size': 14 + 'px',
            'margin': '0 auto',
            'text-align': 'center',
            'z-index': '5000',
            'line-height': '230%',
            'opacity': '0.8'
        }).show();
        setTimeout(function () {
            $('div.alert').fadeOut();
            $('.alert').remove();
        }, (time * 1000)
        );
    }
    init();
});