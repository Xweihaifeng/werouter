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
	

	/**
	 * ------------------------------------------------
	 *  以下为各个模块的导出方法
	 * ------------------------------------------------
	 */

	// 导出活动报名人
	private function activity_enroll_list() {
		$activity_id = !empty($_GET['activity_id']) ? $_GET['activity_id'] : null;
		if (empty($activity_id)) 
			exit('请求错误');

		$activity_sql =  'SELECT weid, plat_user_id, title  FROM we_page_activity a
		where
			a.plat_user_id = ?
		and a.weid = ?
		and a.plat_id = ?';
		$activity = $this->db->queryOne($activity_sql , array($this->user_token()['weid'], $activity_id, config::$plats['plats']['weid']));
		if (empty($activity)) 
			exit('请求错误');
		// 报名
        $enroll_sql = 'SELECT 
			e.weid, u.real_name, u.phone, u.company, u.position, e.is_attend, e.created_at
		FROM we_page_activity_enroll e
		left join we_plats_user u  on u.weid = e.plat_user_id
		left join we_page_activity a on a.weid = e.activity_id
		where
			a.plat_user_id = ?
		and e.activity_id = ?
		and e.status = 1
		and e.plat_id = ?';
		$results = $this->db->queryAll($enroll_sql , array($this->user_token()['weid'], $activity_id, config::$plats['plats']['weid']));

		// 票务
		$counts_sql = 'SELECT e.weid as enroll_id, t.weid as ticket_id, t.price, t.name 
		FROM we_page_activity_ticket_hold h
		left join we_page_activity_ticket t on h.ticket_id = t.weid 
		left join we_page_activity_enroll e on e.weid = h.enroll_id 
		left join we_plats_user u  on u.weid = e.plat_user_id
		left join we_page_activity a on a.weid = e.activity_id 
		where
			a.plat_user_id = ?
		and e.activity_id = ?
		and e.status = 1
		and e.plat_id = ?';
		$results_counts = $this->db->queryAll($counts_sql , array($this->user_token()['weid'], $activity_id, config::$plats['plats']['weid']));

        $enrollTickets = [];
        foreach ($results_counts as $key => $value) {
            if (!array_key_exists($value['enroll_id'], $enrollTickets)) {
                $enrollTickets[$value['enroll_id']] = [];
            }
            if (array_key_exists($value['ticket_id'], $enrollTickets[$value['enroll_id']])) {
                $enrollTickets[$value['enroll_id']][$value['ticket_id']]['num'] = $enrollTickets[$value['enroll_id']][$value['ticket_id']]['num'] + 1;
            } else {
                $enrollTickets[$value['enroll_id']][$value['ticket_id']] = [];
                $enrollTickets[$value['enroll_id']][$value['ticket_id']]['name'] = $value['name'];
                $enrollTickets[$value['enroll_id']][$value['ticket_id']]['num'] = 1;
                $enrollTickets[$value['enroll_id']][$value['ticket_id']]['price'] = $value['price'];
            }
		}

        $file_name = $activity['title'] . '-' . date('m月d') . '.csv';
        header('Content-Type: application/octet-stream');
        header('Content-Disposition: attachment; filename=' . $file_name);
        $header_data = ['姓名', '手机', '公司', '职位', '报名时间', '票务信息', '是否签到'];
        if (!empty($header_data)) {
            echo iconv('utf-8','gbk//TRANSLIT' , '"' . implode('","',$header_data) . '"' . "\n");
        }
        foreach ($results as $key => $value) {
            $output = array();
            $output[] = $value['real_name'] . "\t";
            $output[] = $value['phone'] . "\t";
            $output[] = $value['company'] . "\t";
            $output[] = $value['position'] . "\t";
			$output[] = date('Y-m-d H:i:s', $value['created_at']) . "\t";
			foreach($enrollTickets as $k => $v) {
				if ($k === $value['weid']) {
					$__tmp = [];
					$__info = '';
					$__enroll_id = $value['weid'];
					$__theEnroll = $enrollTickets[$__enroll_id];
					foreach ($__theEnroll as $key => $val) {
						$__info .= $val['name'] . '(' . $val['price'] . '元x' . $val['num'] . ')' . "\t";
					}
					$output['ticketInfo'] = $__info;
				}
			}
			$output[] = ($value['is_attend'] == 1 ? '是' : '否') . "\t";
			echo iconv('utf-8','gbk//TRANSLIT' , '"' . implode('","', $output) . "\"\n");
        }
	}





}	

