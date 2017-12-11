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

		$qrcode_img = imagecreatefrompng("http://qr.liantu.com/api.php?&w=410&text=$url");
		$border = imagecreatefrompng('./public/images/quanquan_09.png');
		
		list($qrcode_imgwidth, $qrcode_imgheight) = array(imagesx($qrcode_img), imagesy($qrcode_img));
		list($bowidth, $boheight) = array(imagesx($border), imagesy($border));
		
		$logo_qr_width = $qrcode_imgwidth / 3.6;
		$scale = $bowidth/$logo_qr_width;
		$logo_qr_height = $boheight/$scale;
		$from_width = ($qrcode_imgwidth - $logo_qr_width) / 2;

		imagecopyresampled($qrcode_img, $border, 155, 155, 0, 0, 102,102, 102, 102);
		imagedestroy($border);


		$newImage = imagecreatetruecolor(430,430);
		$c = imagecolorallocatealpha($newImage , 255 , 255 , 255 , 0);//拾取一个完全透明的颜色
		imagealphablending($newImage , false);//关闭混合模式，以便透明颜色能覆盖原画布
		imagefill($newImage , 0 , 0 , $c);//填充
		//增加一个白色的底，不然新建的画布是黑色的
		imagesavealpha($newImage , true);//设置保存PNG时保留透明通道信息
		
		imagecopyresampled($newImage, $qrcode_img, 10, 10, 0 , 0, 410,410 , 410 , 410);
		$storage_img = './storage/'.time().'_qrcode.png';
		$linshi_time = time();

		imagedestroy($qrcode_img);
		// imagedestroy($newImage);

		$logo_gd = imagecreatefrompng($logo.'?roundPic/radius/!16p|imageView2/1/w/88/h/88|imageMogr2/format/png');
		
		imagecopyresampled($newImage, $logo_gd, 173, 171, 0, 0, 88 , 88, 88, 88);

		ImagePng($newImage  , $storage_img );

		imagedestroy($newImage);

		// 七牛上传
		$auth = new Auth($accessKey, $secretKey);
		$bucket = config::$plats['qiniu']['bucket'];
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