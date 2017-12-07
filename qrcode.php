<?php
// 简介版二维码处理方案
// 
// 上线之后必须做优化
// 
// GUANZHAO
// 
// https://images.wezchina.com/qrcode/kezunping.png?imageView2/0/q/75|watermark/1/image/aHR0cHM6Ly9pbWFnZS53ZXpjaGluYS5jb20vcGFnZXMvYXJ0aWNsZS8xNTEyNDgxMDYyNjAyLnBuZw==/dissolve/100/gravity/Center/dx/0/dy/-2|imageslim
// 
// 

require_once "vendor/autoload.php";

use Hprose\Client;

use Qiniu\Auth;
use Qiniu\Storage\UploadManager;

function base64_urlSafeEncode($data)
{
    $find = array('+', '/');
    $replace = array('-', '_');
    return str_replace($find, $replace, base64_encode($data));
}

// 用于签名的公钥和私钥
$accessKey = '3C18srWCsPzjl8sf_L-el16dBJ2EjH5U82wTH1d3';
$secretKey = 'C51Q1mBQBeOYwnVrmvCLg3FW5y2EV_8o-CYa_Cux';

  // 初始化签权对象
$auth = new Auth($accessKey, $secretKey);

$api_id = 'qr265316';

$api_key = '20171207097867';
// 
$timestamp= time();
	
try{
	$get = $_GET;
	
	$url = urldecode($get['url']);
	
	$logo = urldecode($get['logo']);

	$logo = base64_urlSafeEncode($logo.'?roundPic/radius/16|imageView2/5/w/85/h/85');

	$domain = $get['domain'];
	$strm = stream_context_create(array( 
	    'http' => array( 
	        'timeout' => 1 
	        ) 
	    )
	); 
	$cdn = file_get_contents("https://images.wezchina.com/qrcode/$domain.png?imageView2/0/q/75|watermark/1/image/$logo/dissolve/100/gravity/Center/dx/0/dy/-2|imageslim" , 0 , $strm);
	header('Content-type: image/jpg');
	echo $cdn;
	exit();

	if(!$url || !$logo || !$domain)
	{
		return FALSE;
	}
	
	//Client
	$client = Client::create();// true 异步   false同步
	
	$qrdata = $url;
	
	$size = 400;$xt = 1;
	
	$level = 'M';$p_color = '#000000';$i_color = '#000000';$back_color = '#FFFFFF';$fore_color ='#000000';
	
	$signature = md5($api_key.$timestamp.$qrdata);//简易数据签名
	
	$result = $client->qrencode($api_id,$signature,$timestamp,$qrdata,$size,$xt,$level,$p_color,$i_color,$back_color,$fore_color,$logo,$wlogo,$hlogo);
	
	if($result['status'] == 1)
	{
		// header('Content-type: image/jpg');
		$qrcode = $result['data']['qr_filepath'];
		$QR = imagecreatefrompng($qrcode);
		$border = imagecreatefrompng('./public/images/quanquan_09.png');
		
		list($qrwidth, $qrheight) = array(imagesx($QR), imagesy($QR));
		list($bowidth, $boheight) = array(imagesx($border), imagesy($border));
		
		$logo_qr_width = $qrwidth / 5;
		$scale = $bowidth/$logo_qr_width;
		$logo_qr_height = $boheight/$scale;
		$from_width = ($qrwidth - 100) / 2;
		imagesavealpha($border,true);
		
		imagecolortransparent($border, imagecolorat($border, 1, 1));
		
		//imagecopyresampled($QR, $border, $from_width, $from_width, 0, 0, $logo_qr_width,$logo_qr_height, $bowidth, $boheight);
		imagecopyresampled($QR, $border, $from_width, $from_width, 0, 0, 100 , 100, $bowidth, $boheight);

		$time = './storage/'.time().'_qrcode.png';

		ImagePng($QR , $time);

		// 七牛上传
		$auth = new Auth($accessKey, $secretKey);
		$bucket = 'wezc';
		// 生成上传Token
		$token = $auth->uploadToken($bucket);
		// 构建 UploadManager 对象
		$uploadMgr = new UploadManager();

		$file_path = $time;
		// 上传到七牛后保存的文件名
		$key = "qrcode/$domain.png";

		$upload = $uploadMgr->putFile($token, $key, $file_path);

		$upload = current($upload);

		$img = "https://images.wezchina.com/$key?imageView2/0/q/75|watermark/1/image/$logo/dissolve/100/gravity/Center/dx/0/dy/-2|imageslim";

		echo '<p><img src="' . $img . '" /><p>';
		
	}
	

}catch(Exception $e)
{
	return "";
}

