<?php
// 获取网站内容
function curl_action($url, $timeout = '2',$device = false)
{
    // 1. 初始化
    $ch = curl_init();
    // 2. 设置选项，包括URL
    curl_setopt($ch, CURLOPT_URL, $url );

    curl_setopt($ch, CURLOPT_TIMEOUT, $timeout);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false); // 跳过证书检查  
    //curl_setopt($ch, CURLOPT_HEADER, 0);
    //curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);
    if($device){
        curl_setopt($ch, CURLOPT_USERAGENT, "Mobile Explorer");
    }
    // 3. 执行并获取HTML文档内容
    $info = curl_exec($ch);
    // 4. 释放curl句柄
    curl_close($ch);
    return $info;
}

// 获取网站秘钥
function auth_code($string, $key = 'wezchina' , $operation = 'ENCODE', $expiry = 7200)
{
    $c_key_length = 6;

    $key = md5($key);

    $expiry = $expiry;

    $key_a = md5(substr($key, 0, 16));

    $key_b = md5(substr($key, 16, 16));

    $key_c = $c_key_length ? ($operation == 'DECODE' ? substr($string, 0, $c_key_length)
        : substr(md5(microtime()), -$c_key_length)) : '';

    $crypt_key = $key_a . md5($key_a . $key_c);

    $key_length = strlen($crypt_key);

    $string = $operation == 'DECODE' ? base64_decode(substr($string, $c_key_length))
        : sprintf('%010d', $expiry ? $expiry + time() : 0) . substr(md5($string . $key_b), 0, 16) . $string;

    $string_length = strlen($string);
    $result = '';
    $box = range(0, 255);
    $rnd_key = array();
    for ($i = 0; $i <= 255; $i++) {
        $rnd_key[$i] = ord($crypt_key[$i % $key_length]);
    }

    for ($j = $i = 0; $i < 256; $i++) {
        $j = ($j + $box[$i] + $rnd_key[$i]) % 256;
        $tmp = $box[$i];
        $box[$i] = $box[$j];
        $box[$j] = $tmp;
    }

    for ($a = $j = $i = 0; $i < $string_length; $i++) {
        $a = ($a + 1) % 256;
        $j = ($j + $box[$a]) % 256;
        $tmp = $box[$a];
        $box[$a] = $box[$j];
        $box[$j] = $tmp;
        $result .= chr(ord($string[$i]) ^ ($box[($box[$a] + $box[$j]) % 256]));
    }

    if ($operation == 'DECODE') {

        if ((substr($result, 0, 10) == 0 || substr($result, 0, 10) - time() > 0) &&
            substr($result, 10, 16) == substr(md5(substr($result, 26) . $key_b), 0, 16)) {

            return substr($result, 26);
        } else {

            return '';
        }
    } else {
        return $key_c . str_replace('=', '', base64_encode($result));
    }
}

// 二位数组排序
function array_sort($arr, $keys, $type = 'asc') 
{
    $keysvalue = $new_array = array();
    foreach ($arr as $k => $v){
        $keysvalue[$k] = $v[$keys];
    }
    $type == 'asc' ? asort($keysvalue) : arsort($keysvalue);
    reset($keysvalue);
    foreach ($keysvalue as $k => $v) {
       $new_array[$k] = $arr[$k];
    }
    return $new_array;
}

// 错误提示
function error($code)
{
    $file = './resource/404.html';

    if(is_mobile() == TRUE)
    {
        $file = './resource/404_wap.html';
    }

    echo file_get_contents($file);
    //暂时方案 
    header("HTTP/1.1 404 Not Found");exit;  
}

// 跳转链接
function redirect($router)
{
    header("Location: ".$router); 
    exit;
}

// 加载类文件
function loader($file)
{
    if(is_file('./library/'.$file))
    {
        require_once($file);
    }
}

function is_weixin()
{ 
    if ( strpos($_SERVER['HTTP_USER_AGENT'], 'MicroMessenger') !== false ) {
        return 'yes';
    }  
    return 'no';
}
// 判断是否是手机
function is_mobile()
{ 
    // 如果有HTTP_X_WAP_PROFILE则一定是移动设备
    if (isset ($_SERVER['HTTP_X_WAP_PROFILE']))
    {
        return true;
    } 
    // 如果via信息含有wap则一定是移动设备,部分服务商会屏蔽该信息
    if (isset ($_SERVER['HTTP_VIA']))
    { 
        // 找不到为flase,否则为true
        return stristr($_SERVER['HTTP_VIA'], "wap") ? true : false;
    } 
    // 脑残法，判断手机发送的客户端标志,兼容性有待提高
    if (isset ($_SERVER['HTTP_USER_AGENT']))
    {
        $clientkeywords = array ('nokia',
            'sony',
            'ericsson',
            'mot',
            'samsung',
            'htc',
            'sgh',
            'lg',
            'sharp',
            'sie-',
            'philips',
            'panasonic',
            'alcatel',
            'lenovo',
            'iphone',
            'ipod',
            'blackberry',
            'meizu',
            'android',
            'netfront',
            'symbian',
            'ucweb',
            'windowsce',
            'palm',
            'operamini',
            'operamobi',
            'openwave',
            'nexusone',
            'cldc',
            'midp',
            'wap',
            'mobile'
            ); 
        // 从HTTP_USER_AGENT中查找手机浏览器的关键字
        if (preg_match("/(" . implode('|', $clientkeywords) . ")/i", strtolower($_SERVER['HTTP_USER_AGENT'])))
        {
            return true;
        } 
    } 
    return false;
} 
