<?php
class export extends controller
{
	public function index()
	{
		$type = !empty($_GET['type']) ? $_GET['type'] : null;
		if (!method_exists($this, $type)) 
			exit('请求错误');
		else
			$this->$type();
	}

	// 导出活动报名人
	private function activity_enroll_list() {
		$activity_id = !empty($_GET['activity_id']) ? $_GET['activity_id'] : null;
		print_r(config::plats);die;
		if (empty($activity_id)) 
			exit('请求错误');
        $sql = 'SELECT is_authenticated,origo,residential,name,type FROM we_plats_user_auth WHERE plat_id=? AND plat_user_id=? ';
        $results= $this->db->query($sql , array($this->weid , $this->user_token()['weid']));

	}
}	

