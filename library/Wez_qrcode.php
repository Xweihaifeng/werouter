<?php 
/**
*  二维码生成
*/
use Qiniu\Auth;
use Qiniu\Storage\UploadManager;
class Wez_qrcode extends controller
{
	private static $variable;
	    // 构造方法
    public function __construct() 
    {
        parent::__construct();

    }
	public static function init($logo ,  $url , $logo_is)
	{
		$protocol = empty($_SERVER['HTTP_X_CLIENT_PROTO']) ? 'http://' : $_SERVER['HTTP_X_CLIENT_PROTO'] . '://';
		$logo = $protocol.config::$plats['qiniu']['domain_custom'].'/'.$logo;

		// 用于签名的公钥和私钥
		$accessKey = config::$plats['qiniu']['access_key'];
		$secretKey = config::$plats['qiniu']['secret_key'];

		$qrcode_img = imagecreatefrompng("http://qr.liantu.com/api.php?&w=420&text=$url");
		$border = imagecreatefrompng('./public/images/quanquan_09.png');
		
		list($qrcode_imgwidth, $qrcode_imgheight) = array(imagesx($qrcode_img), imagesy($qrcode_img));
		list($bowidth, $boheight) = array(imagesx($border), imagesy($border));
		
		$logo_qr_width = $qrcode_imgwidth / 3.6;
		$scale = $bowidth/$logo_qr_width;
		$logo_qr_height = $boheight/$scale;
		$from_width = ($qrcode_imgwidth - $logo_qr_width) / 2;

		imagecopyresampled($qrcode_img, $border, $from_width, $from_width, 0, 0, $logo_qr_width,$logo_qr_height, $bowidth, $boheight);
		imagedestroy($border);

		$newImage = imagecreatetruecolor(430,430);
		$c = imagecolorallocatealpha($newImage , 255 , 255 , 255 , 0);//拾取一个完全透明的颜色
		imagealphablending($newImage , false);//关闭混合模式，以便透明颜色能覆盖原画布
		imagefill($newImage , 0 , 0 , $c);//填充
		//增加一个白色的底，不然新建的画布是黑色的
		imagesavealpha($newImage , true);//设置保存PNG时保留透明通道信息
		
		imagecopyresampled($newImage, $qrcode_img, 10, 10, 0 , 0, 410,410 , 420 , 420);
		$storage_img = './storage/'.time().'_qrcode.png';
		$linshi_time = time();

		imagedestroy($qrcode_img);
		// imagedestroy($newImage);

		$logo_gd = imagecreatefrompng($logo.'?roundPic/radius/16|imageView2/5/w/91/h/91|imageMogr2/format/png');
		
		imagecopyresampled($newImage, $logo_gd, 170, 168, 0, 0, 90 , 90, 90, 90);
		ImagePng($newImage  , $storage_img );
		imagedestroy($newImage);

		// 七牛上传
		$auth = new Auth($accessKey, $secretKey);
		$bucket = 'wezc';
		// 生成上传Token
		$token = $auth->uploadToken($bucket);
		// 构建 UploadManager 对象
		$uploadMgr = new UploadManager();

		// 上传到七牛后保存的文件名
		$key = "qrcode/$linshi_time/$logo_is";

		$upload = $uploadMgr->putFile($token, $key, $storage_img);

		unlink($storage_img);
		return $key;

	}
}