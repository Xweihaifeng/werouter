Vue.filter('img_src', function (value , width , height) {
    if (!value) return '';

    var settings = http_type + plats_qiniu.domain_custom + '/';

    if($app.empty(width) == false || $app.empty(height) == false )
    {
        return settings + value;
    }
    else
    {
        return settings + value + '?imageView2/1/w/' + width + '/h/' + height;
    }
});

Vue.filter('imgSet', function (value, width, height, mode) {
    if(value.indexOf('http') !== -1){
        return value
    }else{
        if (mode != undefined) {
            return ApiMaterPlatQiniuDomain + value + '?imageView2/' + mode + '/w/' + width + '/h/' + height;
        } else {
            return ApiMaterPlatQiniuDomain + value + '?imageView2/3/w/' + width + '/h/' + height;
        }
    }
})

Vue.filter('href', function (value) {
    if (!value) return '';

    return all_domian + value;
});

Vue.filter('formateTime',function (value,type) {
    var date = new Date(value);
    var year = date.getFullYear();
    var month = (date.getMonth() + 1).toString().length == 1 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
    var day = (date.getDay() + 1).toString().length == 1 ? '0' + (date.getDay() + 1) : date.getDay() + 1;
    var hour = date.getHours().toString().length == 1 ? '0' + date.getHours() : date.getHours();
    var min = date.getMinutes().toString().length == 1 ? '0' + date.getMinutes() : date.getMinutes();
    if(type == 'MDHM'){
        return month +'-'+day+' '+hour+':'+min
    }else if(type == 'HM'){
        return hour+':'+min;
    }

});

Vue.filter('limitLen',function (value,min,max) {
    if(value.length>max){
        value = value.substring(min,max) + '...'
    }
    return value;
})

