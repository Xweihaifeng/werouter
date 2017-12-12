<?php

// 路由额外验证规则
class controllerRouter extends controller
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

    // config::$plats  domain_custom  七牛域名, plats_info 网站信息

    // 构造方法
    public function __construct($weid) 
    {
        parent::__construct();

        $this->weid = $weid;
    }

    
    public function clear()
    {
        $this->config = array();
    }
    
    // 个性域名公共数据调用
    private function _domain_init($row)
    {

        $wezchina_plats['plats_domian'] = $row;
        //$this->config['config']['const wezchina_domain_weid'] = $row['weid'];
        // 获取用户信息
        $plats_user_sql = 'SELECT weid,avatar,sex,real_name,nickname,motto,province_id,area_id FROM we_plats_user    WHERE plat_id=? AND weid=? ';

        $wezchina_plats['plats_user'] = $this->db->queryOne($plats_user_sql , array($this->weid , $row['plat_user_id']));

        if(empty($wezchina_plats['plats_user']['nickname']))
        {
            $wezchina_plats['plats_user']['nickname'] = '神秘人';
        }
        
        // 获取省份
        $plats_province_sql = 'SELECT name FROM we_plats_province WHERE id=?';
        $wezchina_plats['plats_user']['province'] = $this->db->queryOne($plats_province_sql , array($wezchina_plats['plats_user']['province_id']));
        
        // 获取市
        $plats_area_sql = 'SELECT name FROM we_plats_area WHERE id=?';
        $wezchina_plats['plats_user']['area'] = $this->db->queryOne($plats_area_sql , array($wezchina_plats['plats_user']['area_id']));

        $wezchina_plats['plats_brand'] = FALSE;
        if($row['is_brand'] == 1)
        {
            // 获取品牌
            $plats_brand_sql = 'SELECT title,business,logo,slogan FROM we_pages_brand WHERE plat_id=? AND plat_user_id=? ';
            $wezchina_plats['plats_brand'] = $this->db->queryOne($plats_brand_sql , array($this->weid , $row['plat_user_id']));

        }
        
        // 实名认证
        $plats_user_auth_sql = 'SELECT is_authenticated,origo,residential,name,type FROM we_plats_user_auth WHERE plat_id=? AND plat_user_id=? ';
        
        $wezchina_plats['plats_user_auth'] = $this->db->queryOne($plats_user_auth_sql , array($this->weid , $row['plat_user_id']));

        // 官方认证
        $plats_user_cert_sql = 'SELECT is_authenticated,name,cert_info,type FROM we_plats_user_cert WHERE plat_id=? AND plat_user_id=? ';
        
        $wezchina_plats['plats_user_cert'] = $this->db->queryOne($plats_user_cert_sql , array($this->weid , $row['plat_user_id']));

        $protocol = empty($_SERVER['HTTP_X_CLIENT_PROTO']) ? 'http://' : $_SERVER['HTTP_X_CLIENT_PROTO'] . '://';

        $url = urldecode($protocol.$_SERVER['HTTP_HOST'].'/wecard/'.$row['plat_user_id']);

        $logo = (!empty($wezchina_plats['plats_brand']['logo']) && $row['is_brand'] == 1) ? $wezchina_plats['plats_brand']['logo'] : $wezchina_plats['plats_user']['avatar'];
        //二维码已存在图片  
        $qrcode_img = $row['qrcode_img'];

        //Wez_template::init($logo);

         //二维码圆心图片
        $logo_array = explode('/', $logo);
        $logo_is = end($logo_array);
        //是否重新生成二维码
        $qrset = FALSE;
        if(empty($qrcode_img))
        {
            $qrset = TRUE;
        }
        else
        {
            $qrcode_img_array = explode('/', $row['qrcode_img']);
            $qrcode_img_array_is = end($qrcode_img_array);
            if($qrcode_img_array_is != $logo_is) $qrset = TRUE;
        }
        //$qrset = TRUE;
        if($qrset == TRUE)
        {
            $qrcode_img = Wez_qrcode::init($logo , $url , $logo_is);
            $set = array('qrcode_img' => $qrcode_img);
            $where = array('plat_id' => $row['plat_id'] , 'domain' => $row['domain']);
            $this->db->update('we_pages' , $set , $where);
        }

        $wezchina_plats['plats_user_qrcode'] = $qrcode_img;

        return $wezchina_plats;
    }

    // 验证个性域名
    public function domain($param)
    {
        // 测试 CONFIG 配置了 config 参数会直接追加到 config 最下面
        // $this->config['config']['var title'] = 'yes';
        //$this->config['template'] = '/login.html';
        //if($param == 'index') return TRUE;
        $this->config['config']['var is_domain'] = 'yes';
        $sql = 'SELECT domain,weid,plat_id,plat_user_id,is_brand,summary,background,share_image,qrcode_img,background_user
                 FROM we_pages WHERE plat_id=? AND domain=? ';
        $row = $this->db->queryOne($sql , array($this->weid , $param));

        if(!empty($row))
        {

            $wezchina_plats = $this->_domain_init($row);
            
            $this->config['config']['const pages_info'] = json_encode($wezchina_plats);

            $this->config['config']['var pages_index'] = $row['domain'];
            return TRUE;
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

        $user_info = $this->user_token();
        $this->_user_id = $user_info['weid'];
        if(empty($this->_user_id))
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
        $row = $this->db->queryOne($sql , array($this->weid , $this->_user_id));
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
        $row = $this->db->queryOne($sql , array($this->weid , $param));

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
        $row = $this->db->queryOne($sql , array($this->weid , $param));

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

        $row = $this->db->queryOne($sql , array($param));

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

