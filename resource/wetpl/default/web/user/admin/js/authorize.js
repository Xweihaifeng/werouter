/**
 * Created by Hongguang on 2017/9/5.
 */

//ģ��
var moduleDetail = function(mid) {
    $.ajax({
        url: 'http://apitest.wezchina.com/pages/module/detail/' + mid,
        type: 'GET',
        headers: {
            'Token': docCookies.getItem("token")
        },
        success: function(data){
            if (data.code == 200){
                console.log('module detail:', data);
            } else {
                layer.msg(data.message, {
                    time: 1500
                });
            }
        },
        error: function(xhr){
            console.log(xhr);
        }
    })
}

var modeleName = [];
var moduleState = function(weid) {
    $.ajax({
        url: 'http://apitest.wezchina.com/pages/modulerun/list',
        type: 'GET',
        headers: {
            'Token': docCookies.getItem("token")
        },
        success: function(data){
            if (data.code == 200){
                console.log('module:', data.data.list);
                var state = data.data.list;
                state.map(x => {
                    modeleName.push(x.module_id);
                    if (x.module_id === '4009ea20-8ede-11e7-83a8-156d1da77933') { //article
                        if (x.status == 1) {
                            $(".we-art").slideDown(500)
                        }
                    }
                    if (x.module_id === '44fd5620-8d7f-11e7-9e08-e356d0b019f1') { //shopping
                        if (x.status == 1) {
                            $(".we-shop").slideDown(500)
                    }
                    }
                })
            } else {
                layer.msg(data.message, {
                    time: 1500
                });
            }
            //modeleName.map(x => moduleDetail(x))
        },
        error: function(xhr){
            console.log(xhr);
        }
    })
}

var moduleUser = function(weid) {
    $.ajax({
        url: 'http://apitest.wezchina.com/pages/modulerun/getDetailByUser/' + weid,
        type: 'GET',
        headers: {
            'Token': docCookies.getItem("token")
        },
        success: function(data){
            if (data.code == 200){
                console.log('module user:', data);
            } else {
                layer.msg(data.message, {
                    time: 1500
                });
            }
        },
        error: function(xhr){
            console.log(xhr);
        }
    })
}

var weid = docCookies.getItem("weid");
modelState(weid);