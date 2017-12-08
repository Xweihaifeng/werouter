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
    private $weid;

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
        $this->config['config']['var title'] = 'yes';
        //$this->config['template'] = '/login.html';
        //if($param == 'index') return TRUE;

        $sql = 'SELECT domain,weid,plat_id,plat_user_id,is_brand,summary,background,share_image FROM we_pages WHERE plat_id=? AND domain=? ';
        $row = $this->_db->queryOne($sql , array($this->weid , $param));
        
        if(!empty($row))
        {

            $wezchina_plats['plats_domian'] = $row;
            //$this->config['config']['const wezchina_domain_weid'] = $row['weid'];
            // 获取用户信息
            $plats_user_sql = 'SELECT avatar,sex,real_name,nickname,motto,province_id,area_id FROM we_plats_user    WHERE plat_id=? AND weid=? ';

            $wezchina_plats['plats_user'] = $this->_db->queryOne($plats_user_sql , array($this->weid , $row['plat_user_id']));

            // 获取省份
            $plats_province_sql = 'SELECT name FROM we_plats_province WHERE id=?';
            $wezchina_plats['plats_user']['province'] = $this->_db->queryOne($plats_province_sql , array($wezchina_plats['plats_user']['province_id']));

            // 获取市
            $plats_area_sql = 'SELECT name FROM we_plats_area WHERE id=?';
            $wezchina_plats['plats_user']['area'] = $this->_db->queryOne($plats_area_sql , array($wezchina_plats['plats_user']['area_id']));

            // 获取品牌
            $plats_brand_sql = 'SELECT title,business,logo FROM we_pages_brand WHERE plat_id=? AND plat_user_id=? ';
            
            $wezchina_plats['plats_brand'] = $this->_db->queryOne($plats_brand_sql , array($this->weid , $row['plat_user_id']));

            // 实名认证
            $plats_user_auth_sql = 'SELECT is_authenticated,origo,residential FROM we_plats_user_auth WHERE plat_id=? AND plat_user_id=? ';
            
            $wezchina_plats['plats_user_auth'] = $this->_db->queryOne($plats_user_auth_sql , array($this->weid , $row['plat_user_id']));

            // 官方认证
            $plats_user_cert_sql = 'SELECT is_authenticated FROM we_plats_user_cert WHERE plat_id=? AND plat_user_id=? ';
            
            $wezchina_plats['plats_user_cert'] = $this->_db->queryOne($plats_user_cert_sql , array($this->weid , $row['plat_user_id']));
            
            $this->config['config']['const wezchina_plats'] = json_encode($wezchina_plats);

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

        $sql = 'SELECT weid FROM we_pages  WHERE plat_id=? AND plat_user_id =?';
        $row = $this->_db->queryOne($sql , array($this->weid , $this->_user_id));
        if(!empty($row['weid']))
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

    // 频道额外规则
    public function channel_art( $param, $match = array())
    {
        $sql = 'SELECT B.template AS tml FROM we_plat_cms_cate A LEFT JOIN we_plat_cms_template B on A.list_id=B.weid  WHERE A.plat_id =? AND A.domain=?';
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
