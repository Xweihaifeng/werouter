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
		$sql = 'SELECT weid,avatar,sex,real_name,nickname,motto,province_id,area_id FROM we_plats_user WHERE token=?';
        $row = $this->db->queryOne($sql , array($token));
        if(!empty($row['weid']))
        {
        	if(empty($row['real_name']))
        	{
        		$row['real_name'] = '神秘人';
        	}
        	if(empty($row['motto']))
        	{
        		$row['motto'] = '人懒什么都没有';
        	}
            return $row;
        }
        return FALSE;
    }

}

