<?php

// 路由额外验证规则
class controllerRouter 
{

    /**
     * $config['config'] = '';  config 的内容会读取到 config.js里面
     * config 的格式必须是  const XXXX=XXXX;
     * 
     * $config['template'] = '';  template 的是本次加载的真实模板文件，使用template 请保证模板真实存在.
     * @var [type]
     */
    public $config;
    //网站ID
    private $_weid;

    //用户ID
    private $_user_id = FALSE;

    private $_db;

    // 构造方法
    public function __construct($weid) 
    {
        $this->weid = $weid;

        $this->_db = new EasyDB();

    }


    
    public function clear()
    {
        $this->config = array();
    }

    // 验证个性域名
    public function domain($param)
    {

        // 测试 CONFIG 配置了 config 参数会直接追加到 config 最下面
        $this->config['config']['const title'] = 'yes';
        //$this->config['template'] = '/login.html';
        //if($param == 'index') return TRUE;

        $sql = 'SELECT domain FROM we_pages WHERE plat_id=? AND domain=? ';
        $row = $this->_db->queryOne($sql , array($this->weid , $param));
        if(!empty($row))
        {
            return TRUE;
        }   
        return FALSE;     
    }

    //查询 user token
    private function _user_token()
    {
        $token = $_COOKIE['token'];

        $sql = 'SELECT weid FROM we_plats_user WHERE token=?';
        $row = $this->_db->queryOne($sql , array($token));
        if(!empty($row['weid']))
        {
        	return $this->_user_id = $row['weid'];
        }
        return FALSE;
    }
    
    // 验证域名与文章是否匹配
    public function art($param)
    {
        return FALSE;
    }

    //验证TOKEN
    public function user($param)
    {
        $user_weid = $this->_user_token();
        if($user_weid == FALSE)
        {
        	redirect('/login');
        }
    }


    // user/admin 验证是否已经认证
    public function user_admin($param)
    {
        if($this->_user_id == FALSE)
        {
        	redirect('/login');
        }

		$sql = 'SELECT domain FROM we_pages  WHERE plat_id=? AND plat_user_id =?';
        $row = $this->_db->queryOne($sql , array($this->_weid , $this->_user_id));
        if(!empty($row['domain']))
        {
        	return TRUE;
        }
        redirect('/user/settings/realname');

    }

    // 频道额外规则
    public function channel( $param, $match = array())
    {
        $sql = 'SELECT we_plat_cms_template.template AS tml FROM we_plat_cms_channel  
                LEFT JOIN we_plat_cms_template ON we_plat_cms_channel.list_id = we_plat_cms_template.weid
                WHERE we_plat_cms_channel.plat_id =? AND  we_plat_cms_channel.domain = ?';
        $row = $this->_db->queryOne($sql , array($this->weid , $param));

        if(!empty($row['tml']))
        {   
        	if($match['current'] == $match['total'])
        	{
        		$this->config['template'] = '/views/list/'.$row['tml'].'.html';
        	}
            return TRUE;
        }
        return FALSE;
    }

    // 频道详情页
    public function channel_detailid($param , $match = array())
    {
    	$sql = 'SELECT C.template AS tml FROM we_plat_cms_content
    		 A LEFT JOIN we_plat_cms_cate B ON A.cate_id=B.weid
    		 LEFT JOIN we_plat_cms_template C ON B.show_id=C.weid
    		 WHERE A.weid=?';

    	$row = $this->_db->queryOne($sql , array($param));

		if(!empty($row['tml']))
        {   
        	if($match['current'] == $match['total'])
        	{
        		$this->config['template'] = '/views/show/'.$row['tml'].'.html';
        	}
            return TRUE;
        }
        return FALSE;

    }

}
