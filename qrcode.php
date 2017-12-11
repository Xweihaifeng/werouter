<?php
// 简介版二维码处理方案 已经废弃1
// 
// 上线之后必须做优化
// 
// GUANZHAO
// 
// https://images.wezchina.com/qrcode/kezunping.png?imageView2/0/q/75|watermark/1/image/aHR0cHM6Ly9pbWFnZS53ZXpjaGluYS5jb20vcGFnZXMvYXJ0aWNsZS8xNTEyNDgxMDYyNjAyLnBuZw==/dissolve/100/gravity/Center/dx/0/dy/-2|imageslim
// 
//  

date_default_timezone_set('Etc/GMT-8'); 

require_once "vendor/autoload.php";

// use Hprose\Client;

use Qiniu\Auth;
use Qiniu\Storage\UploadManager;

function base64_urlSafeEncode($data)
{
    $find = array('+', '/');
    $replace = array('-', '_');
    return str_replace($find, $replace, base64_encode($data));
}

// 根据域名获取首字母
function curr_doamin($str)
{
	$domain =  substr( $str, 0, 1 ).'/';
	$domain .= substr( $str, 1, 1 ).'/';
	return "./storage/logs/$domain";
}
// 用于签名的公钥和私钥
$accessKey = '3C18srWCsPzjl8sf_L-el16dBJ2EjH5U82wTH1d3';
$secretKey = 'C51Q1mBQBeOYwnVrmvCLg3FW5y2EV_8o-CYa_Cux';

  // 初始化签权对象
$auth = new Auth($accessKey, $secretKey);

$api_id = 'qr265316';

$api_key = 'xZlqLOUAbzOGNK';
// 
$timestamp= time();
	
try{
	$get = $_GET;
	
	$url = urldecode($get['url']);
	
	$logo = urldecode($get['logo']);

	// $logo = base64_urlSafeEncode($logo.'?roundPic/radius/16|imageView2/5/w/91/h/91');

	$domain = $get['domain'];

	$size_img = (!empty($get['size'])) ? $get['size'] : 430 ;
	// $strm = stream_context_create(array( 
	//     'http' => array( 
	//         'timeout' => 1 
	//         ) 
	//     )
	// ); 
	// $cdn = file_get_contents("https://images.wezchina.com/qrcode/$domain.png?imageView2/0/q/75|watermark/1/image/$logo/dissolve/100/gravity/Center/dx/0/dy/-2|imageslim" , 0 , $strm);
	// header('Content-type: image/jpg');
	// echo $cdn;
	// exit();

	if(!$url || !$logo || !$domain)
	{
		return FALSE;
	}
	$current_domain = curr_doamin($domain);
	$file_cache = $current_domain.$domain.'.json';	


	
	if(is_file($file_cache))
	{
		$cache_file_img = unserialize(file_get_contents($file_cache));

		$img = $cache_file_img['img'];
		
		echo "var wezchina_qrcode = '".$img."';";
		exit();
	}
	
	$QR = imagecreatefrompng("http://qr.liantu.com/api.php?&w=420&text=$url");
	$border = imagecreatefrompng('./public/images/quanquan_09.png');
	
	list($qrwidth, $qrheight) = array(imagesx($QR), imagesy($QR));
	list($bowidth, $boheight) = array(imagesx($border), imagesy($border));
	
	$logo_qr_width = $qrwidth / 3.6;
	$scale = $bowidth/$logo_qr_width;
	$logo_qr_height = $boheight/$scale;
	$from_width = ($qrwidth - $logo_qr_width) / 2;
	//imagesavealpha($border,true);
	
	//imagecolortransparent($border, imagecolorat($border, 1, 1));
	// echo $logo_qr_width,$logo_qr_height, $bowidth, $boheight;
	// exit();
	imagecopyresampled($QR, $border, $from_width, $from_width, 0, 0, $logo_qr_width,$logo_qr_height, $bowidth, $boheight);

	imagedestroy($border);
	// $img = imagecreatefrompng('./public/images/empty.png');
	// $color = imagecolorallocate($img,255,255,255); 
	// imagecolortransparent($img, $color); 
	// imagefill($img,0,0,$color);
	// 
	// 
	// 
	// list($emptywidth, $emptyheight) = array(imagesx($empty), imagesy($empty));

	// $img = imagecreate(430, 430); 
	// //2.上色 
	// $color = imagecolorallocate($img,255,255,255); 
	// //3.设置透明 
	// imagecolortransparent($img, $color); 
	// imagefill($img,0,0,$color); 
	// imagesavealpha($QR,true);
	// imagecolortransparent($QR, imagecolorat($QR, 1, 1));
	// 
		$newImage = imagecreatetruecolor(430,430);
	$c = imagecolorallocatealpha($newImage , 255 , 255 , 255 , 0);//拾取一个完全透明的颜色
	imagealphablending($newImage , false);//关闭混合模式，以便透明颜色能覆盖原画布
	imagefill($newImage , 0 , 0 , $c);//填充
	//增加一个白色的底，不然新建的画布是黑色的
	imagesavealpha($newImage , true);//设置保存PNG时保留透明通道信息
	
	imagecopyresampled($newImage, $QR, 10, 10, 0 , 0, 410,410 , 420 , 420);
	$time = './storage/'.time().'_qrcode.png';
	$linshi_time = time();
	// ImagePng($newImage , $time);
	
	imagedestroy($QR);
	// imagedestroy($newImage);
	
	$logo_gd = imagecreatefrompng($logo.'?roundPic/radius/16|imageView2/5/w/91/h/91|imageMogr2/format/png');
	
	imagecopyresampled($newImage, $logo_gd, 170, 168, 0, 0, 90 , 90, 90, 90);
	ImagePng($newImage  , $time );
	imagedestroy($newImage);
	// 七牛上传
	$auth = new Auth($accessKey, $secretKey);
	$bucket = 'wezc';
	// 生成上传Token
	$token = $auth->uploadToken($bucket);
	// 构建 UploadManager 对象
	$uploadMgr = new UploadManager();

	$file_path = $time;
	// 上传到七牛后保存的文件名
	$key = "qrcode/$linshi_time/$domain.png";

	$upload = $uploadMgr->putFile($token, $key, $file_path);

	$upload = current($upload);

	$img = "https://images.wezchina.com/$key";

	$cache['img'] = $img;
	if (!is_dir($current_domain)) mkdir($current_domain, 0777 , true);
	file_put_contents($file_cache, serialize($cache));	
	unlink($time);
	echo "var wezchina_qrcode = '".$img."';";

	
}catch(Exception $e)
{
	return "";
}

