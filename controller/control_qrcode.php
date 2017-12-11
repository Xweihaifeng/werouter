<?php 
/**
* 二维码生成
*/


use Qiniu\Auth;
use Qiniu\Storage\UploadManager;

class control_qrcode extends controller
{
	public $cofing = [
		'access_key' => '3C18srWCsPzjl8sf_L-el16dBJ2EjH5U82wTH1d3',
		'secret_key' => 'C51Q1mBQBeOYwnVrmvCLg3FW5y2EV_8o-CYa_Cux',
		'domain_custom' => 'images.wezchina.com',
		'buckut' => 'wezc',
	];
	
	public function index()
	{

		$this->weid = $this->public_data['weid'];

		$domain = $_GET['domain'];
		
		// 获取网站七牛配置文件		
		$conifg = $this->_setting($domain);

		// 获取二维码信息
		

	}

	private function _base64_urlSafeEncode($data)
	{
	    $find = array('+', '/');
	    $replace = array('-', '_');
	    return str_replace($find, $replace, base64_encode($data));
	}

	// 获取网站配置文件
	private function _setting($domain)
	{
		$sql = 'SELECT name , config FROM we_plats_setting
				WHERE plat_id=? AND name = "qiNiuConfig"';
		$row = $this->db->queryOne($sql , array($this->weid));

		$config = json_decode($row['config'] , TRUE);
		
		if(empty($config['domain_custom']))
		{
			$cofing['access_key'] = $this->cofing['access_key'];
			$cofing['secret_key'] = $this->cofing['secret_key'];
			$cofing['domain_custom'] = $this->cofing['domain_custom'];
			$cofing['buckut'] = $this->cofing['buckut'];
		}
	}

	// 根据域名获取首字母
	private function curr_doamin($str)
	{
		$domain =  substr( $str, 0, 1 ).'/';
		$domain .= substr( $str, 1, 1 ).'/';
		return "./storage/logs/$domain";
	}
}