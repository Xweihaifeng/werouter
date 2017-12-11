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
}

