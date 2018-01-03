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
    public function user_token($where = array())
    {
    	if(!empty($where))
    	{
    		$key_array = '';
    		$value_array = [];
    		foreach ($where as $key => $value) {
    			$key_array .= " $key=? AND ";
    			$value_array[] = $value;
    		}
    		$key_array = rtrim($key_array , ' AND');
    		$sql = "SELECT weid,avatar,sex,real_name,nickname,motto,province_id,area_id,phone,company,position FROM we_plats_user WHERE $key_array";
    		$row = $this->db->queryOne($sql , $value_array);
    	}
    	else
    	{
    		$token = $_COOKIE['token'];

			$sql = 'SELECT weid,avatar,sex,real_name,nickname,motto,province_id,area_id,phone,company,position FROM we_plats_user WHERE token=?';

			$row = $this->db->queryOne($sql , array($token));
    	}


        if(!empty($row['weid']))
        {
        	if(empty($row['nickname']))
        	{
        		$row['nickname'] = '神秘人';
        	}
        	if(empty($row['real_name']))
        	{
        		$row['real_name'] = '神秘人';
        	}
        	if(empty($row['motto']))
        	{
        		$row['motto'] = '咱俩不太熟，暂时保密';
        	}
            if(empty($row['avatar']))
            {
                $row['avatar'] = '/common/img/avatar.png';
            }
            return $row;
        }
        return FALSE;
    }

}

