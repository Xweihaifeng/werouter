
Vue.filter('img_src', function (value , width , height, mode) {

    if (!value) return '/common/img/news_default.jpg';

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

Vue.filter('href', function (value , from) {
    if (!value) return '';

    var string = value.substr(0 , 1);
    var url = '';
    if(string == '/')
    {
        url =  all_domian.substring(0 , all_domian.length-1) + value;
    }
    else
    {
        url =  all_domian + value;
    }

    if($app.empty(from) == true)
    {
        if(url.indexOf('?') == '-1')
        {
            url += '?from='+from;
        }
        else
        {
            url += '&from='+from;
        }
        
    }

    return url;
    
});
// f分站URL拼接
Vue.filter('sub_href', function (value , from) {
    if (!value) return '';

    var string = value.substr(0 , 1);
    var url = '';
    if(string == '/')
    {
        url =  all_domian.substring(0 , all_domian.length-1) + value;
    }
    else
    {
        url =  all_domian + value;
    }

    if($app.empty(from) == true)
    {
        if(url.indexOf('?') == '-1')
        {
            url += '?from='+from;
        }
        else
        {
            url += '&from='+from;
        }
        
    }

    return url;
    
});

Vue.filter('formateTime',function (value,type) {

    var date = new Date(value);
    if(value.toString().length === 10){
        date = new Date(value*1000);
    }
    var year = date.getFullYear();
    var month = (date.getMonth() + 1).toString().length == 1 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
    var day = (date.getDay() + 1).toString().length == 1 ? '0' + (date.getDay() + 1) : date.getDay() + 1;
    var hour = date.getHours().toString().length == 1 ? '0' + date.getHours() : date.getHours();
    var min = date.getMinutes().toString().length == 1 ? '0' + date.getMinutes() : date.getMinutes();

    switch (type){
        case 'MDHM':
            return month +'-'+day+' '+hour+':'+min;
        case 'YMDHM':
            return year + '-' +month +'-'+day+' '+hour+':'+min;
        case 'YMD':
            return year + '-' +month +'-'+day;
        case 'HM':
            return hour+':'+min;
        case 'MD-C':
            return month + '月' + day + '号';
    }
});

Vue.filter('formateString',function (value , state) {
    if($app.empty(value) == false) return '';

    var update =  (new Date(value)).getTime();//时间戳要乘1000
    update = new Date(update);
    
    if(update.toString().length === 10){
        update = new Date(update*1000);
    }
    
    year   = update.getFullYear();
    month  = (update.getMonth()+1<10)?('0'+(update.getMonth()+1)):(update.getMonth()+1);
    day    = (update.getDate()<10)?('0'+update.getDate()):(update.getDate());
    hour   = (update.getHours()<10)?('0'+update.getHours()):(update.getHours());
    minute = (update.getMinutes()<10)?('0'+update.getMinutes()):(update.getMinutes());
    second = (update.getSeconds()<10)?('0'+update.getSeconds()):(update.getSeconds());
    if (state == 3){
        str = year+'-'+month+'-'+day;
    }else if (state == 2){
        str = month+':'+day;
    }else{
        str = year+'-'+month+'-'+day+' '+hour+':'+minute+':'+second;
    }
    return str;
});

Vue.filter('limitLen',function (value,min,max) {
    // if($app.empty(value) == false) return false;
    if(value){
        if(value.length > max){
            value = value.substring(min,max) + '...'
        }
    }
    return value;
})

