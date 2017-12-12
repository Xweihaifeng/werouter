<?php 
class controller
{

	public $db;

	// 写入公共数据
	public $public_data;
	
	// 构造方法
    public function __construct() 
    {
    	$this->db = new EasyDB();

    	//$this->public_data = [];
    }

    // 验证用户token
    public function user_token()
    {
    	$token = $_COOKIE['token'];
		$sql = 'SELECT weid FROM we_plats_user WHERE token=?';
        $row = $this->db->queryOne($sql , array($token));
        if(!empty($row['weid']))
        {
            return $row['weid'];
        }
        return FALSE;
    }

}

