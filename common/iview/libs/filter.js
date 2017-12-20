Vue.filter('img_src', function (value , width , height) {
    if (!value) return '';

    var settings = http_type + plats_qiniu.domain_custom + '/';

    if($app.empty(width) == false || $app.empty(height) == false )
    {
        return settings + value;
    }
    else
    {
        return settings + value + '?imageView2/3/w/' + width + '/h/' + height;
    }
  
});