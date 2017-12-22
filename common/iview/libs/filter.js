Vue.filter('img_src', function (value , width , height, mode) {

    if (!value) return '';

    if(value.indexOf('http') !== -1){

        return value;
    }

    var settings = http_type + plats_qiniu.domain_custom + '/';

    if($app.empty(width) == false || $app.empty(height) == false )
    {
        return settings + value;
    }
    else
    {
        if (mode != undefined) {
            return settings + value + '?imageView2/' + mode + '/w/' + width + '/h/' + height;
        } else {
            return settings + value + '?imageView2/3/w/' + width + '/h/' + height;
        }
    }
});

Vue.filter('href', function (value) {
    if (!value) return '';
    var string = value.substr(0 , 1);
    if(string == '/')
    {
        return all_domian.substring(0 , all_domian.length-1) + value;
    }
    else
    {
        return all_domian + value;
    }
    
});

Vue.filter('formateTime',function (value,type) {

    var date = new Date(value);
    var year = date.getFullYear();
    var month = (date.getMonth() + 1).toString().length == 1 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
    var day = (date.getDay() + 1).toString().length == 1 ? '0' + (date.getDay() + 1) : date.getDay() + 1;
    var hour = date.getHours().toString().length == 1 ? '0' + date.getHours() : date.getHours();
    var min = date.getMinutes().toString().length == 1 ? '0' + date.getMinutes() : date.getMinutes();

    switch (type){
        case 'MDHM':
            return month +'-'+day+' '+hour+':'+min;
        case 'YMDHM':
            date = new Date(value * 1000);
            year = date.getFullYear();
            return year + '-' +month +'-'+day+' '+hour+':'+min;
        case 'YMD':
            date = new Date(value * 1000);
            year = date.getFullYear();
            return year + '-' +month +'-'+day;
        case 'HM':
            return hour+':'+min;
        case 'MD-C':
            return month + '月' + day + '号';
    }


});

Vue.filter('limitLen',function (value,min,max) {
    if(value.length>max){
        value = value.substring(min,max) + '...'
    }
    return value;
})

