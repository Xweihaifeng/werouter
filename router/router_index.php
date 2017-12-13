<?php
class router_index 
{
    //路由配置信息
    public $params;
    //cofing 配置文件
    public $config;
    // 验证正则表达式,以后从数据库取
    public $rule;
    // 网站数据集合
    public $data ;
    // 网站域名
    private $_domain = '';
    //网站参数
    private $_request_uri = '';
    //网站类型 API  M手机版  PC 电脑版
    private $_mark_domain = '';
    // 访问类型
    private $_method = '';
    // 网站显示域名
    private $_domain_config = '';
    // 网站目录集合
    private $_directory = [
        'm' => 'wap',
        'pc' => 'web'
    ];
    
    // 重定向的链接
    private $_rest_url = '';
    
    public function __construct()
    {	

        $this->_domain = $_SERVER['HTTP_HOST'];
        //$this->_domain = 'new.wezchina.com';
        
        $this->_request_uri = $_SERVER['REQUEST_URI'];
        
        $this->_method = $_SERVER['REQUEST_METHOD'];
        
        $this->_domain_config = $this->_domain_init();
    }
    
    // 分解域名标识 手机版 PC版 API
    private function _domain_init()
    {
        $mark_array = ['m'];
        $domain_array = explode('.' , $this->_domain);
        
        $count_domain_array = count($domain_array);
        $mark_domain = current($domain_array);
        
        if($count_domain_array == 4 || $count_domain_array == 3 )
        {
        	if($mark_domain == 'www')
        	{
        		$this->_domain = substr( $this->_domain , 4);
        		$this->_rest_url = $this->_domain;
        	}

        }
        
        $domain_config = $this->_domain;
        if($mark_domain == 'm') 
        {
            $domain_config = str_replace("m.","", $this->_domain );
        }        
        $this->_mark_domain = (in_array($mark_domain, $mark_array)) ? $mark_domain : 'pc' ;

        // $this->_is_wap($domain_config);
        return $domain_config;
    }

    private function _is_wap($domain_config)
    {

        $protocol = empty($_SERVER['HTTPS']) ? 'http' : 'https';
        if(!empty($this->_rest_url))
    	{
    		header("Location: ".$protocol."://".$this->_rest_url.$this->_request_uri); 
            exit;
    	}

        if($this->_mark_domain == 'pc' && is_mobile() == TRUE){
            header("Location: {$protocol}://m.".$domain_config.$this->_request_uri);
            exit;
        }elseif ($this->_mark_domain == 'm' && is_mobile() == FALSE) {
            header("Location: {$protocol}://".$domain_config.$this->_request_uri);
            exit;
        }
        if($this->http != $protocol)
        {
        	header("Location: {$this->http}://".$domain_config.$this->_request_uri);
            exit;
        }
    }

    // 获取网站信息路由信息
    private function _get_domain()
    {
        $domain_router_file = './config/domain/'.md5($this->_domain_config);

        if(!file_exists($domain_router_file))
        {

            // 获取路由信息和路由正则信息
            $data_stirng = curl_action(config::$config_api_url.$this->_domain_config);

            $data = json_decode($data_stirng , TRUE);

            if($data['code'] !== 200)
            {
                error(404);
            }
            file_put_contents($domain_router_file, $data_stirng);
        }
        else
        {
            $data = file_get_contents($domain_router_file);
            $data = json_decode($data , TRUE);
        }

        return $data;
    }
    
    public  function  index()
    {
        //路由内置验证
        include('./router/router_verify.php');

        // 获取路由信息和路由正则信息
        $this->data = $this->_get_domain();

        if($this->data['code'] !== 200 )
        {
            error(404);
        }

        $this->data = $this->data['data'];

        $this->http = ($this->data['http_type'] == 1) ? 'http' : 'https';

        if(empty($this->data['router'])) error (404);

         // 手机版 && 电脑版相互跳转
        $this->_is_wap($this->_domain_config);

        (new main($this->data))->index($this->_directory[$this->_mark_domain] , $this->data['weid'] , $this->_domain_config, $this->_mark_domain);
        
    }
}

class main extends controller
{ 
    //路由配置信息
    public $params;
    //获取data 数据
    public $data;
    // 获取项目文件FILE
    public $file;
    // 七牛
    public $qiniu_cofing = [
        'access_key' => '3C18srWCsPzjl8sf_L-el16dBJ2EjH5U82wTH1d3',
        'secret_key' => 'C51Q1mBQBeOYwnVrmvCLg3FW5y2EV_8o-CYa_Cux',
        'domain_custom' => 'images.wezchina.com',
        'buckut' => 'wezc',
    ];
    // 构造方法
    public function __construct($data) 
    {
    	parent::__construct();
        $this->data = $data;
    }
    
    public function  index( $directory , $weid , $domain , $mark_domain)
    {

		$router = $this->data['router'];

    	$rule = $this->data['match'];

        config::$plats = $this->_domain_data($weid);
        //$this->data($this->_domain_data($weid));

    	$uri =current(explode('?', $_SERVER['REQUEST_URI']));

        $controller_varify = $this->_controller($uri , $this->data);

        $router_verify = new router_verify($router , $uri , $rule , $weid);

        if(empty($router_verify->router)) {

            error(404);
        }
        
        $router_map = $router_verify->router['router_map'];
        $controller_router_config = (!empty($router_verify->router['config'])) ? $router_verify->router['config']  : '' ;

        if(!empty($controller_router_config['template']))
        {
            $router_map = $controller_router_config['template'];
        }

        $additional_config = array();
        if(!empty($controller_router_config['config']))
        {
            $additional_config = $controller_router_config['config'];
        }

        $this->file = '/resource/wetpl/default/';

        $add_public_config = [];

        foreach (config::$plats as $key => $value) {
            if($key == 'qiniu')
            {
                $key = 'plats_qiniu';
                $value = ['domain_custom' => $value['domain_custom']];
            }

            if (strpos($key , " ")) 
            {
                $add_public_config[$key] = $value;
            }
            else
            {
                $add_public_config['const '.$key] = json_encode($value);
            }
        }
        
        if(!empty($additional_config))
        {
        	$additional_config = array_merge($add_public_config , $additional_config);
        }
        else
        {
            $additional_config = $add_public_config;
        }

        $config_file = $this->_generate_config($domain , $mark_domain);
        $additional_config = $this->_additional_config($additional_config);

        if(!file_exists('.'.$this->file.$directory.$router_map))
        {
            error(404);
        }

        $content = file_get_contents('.'.$this->file.$directory.$router_map);

        echo $this->_get_str_replace_content($content , $config_file , $directory , $additional_config);

    }

    //网站配置JS
    private function _additional_config($additional_config)
    {
        $config = '';
        foreach ($additional_config as $key => $value) {
            if($value)
            {
                $str_key = substr($key, 0 , 3);
                if($str_key == 'var')
                {

                    $config .= "\n".$key .'="'.$value.'";';
                }
                else
                {
                    $config .= "\n".$key .'='.$value.';';
                }
            }
            else
            {
                $config .= "\n".$key;
            }
        }

        return $config;
    }


    // 生成配置文件
    private function _generate_config($domain , $mark_domain)
    {
        if($mark_domain == 'm')
        {
            $domain = 'm.'.$domain;
        }
        $config = file_get_contents('configure.js');

        $config = str_replace('{{url}}', $domain , $config);

        $config .= "\n".'const WWW_PATH= "'.$this->file.'";';

        $cache_config_file = '/config/web/'.md5($domain).'.js';

        $config_file = fopen( './'.$cache_config_file , "w");

        fwrite($config_file , $config);

        fclose($config_file);

        return $cache_config_file;
    }

    // 获取网站基本信息
    private function _domain_data($weid)
    {
        $plats['var root_domian'] = $this->_get_domain($_SERVER['HTTP_HOST']);
        $plats['var is_domain'] = 'no';
        $plats['var plats_token'] = false;
    	//七牛相关信息
    	$sql = 'SELECT name , config FROM we_plats_setting
				WHERE plat_id=? AND name = "qiNiuConfig"';
		$row = $this->db->queryOne($sql , array($weid));

		$config = json_decode($row['config'] , TRUE);
		
		$plats['qiniu'] = $config;
		if(empty($config['domain_custom']))
		{
			$plats['qiniu']['domain_custom'] = $this->qiniu_cofing['domain_custom'];
            $plats['qiniu']['access_key'] = $this->qiniu_cofing['access_key'];
            $plats['qiniu']['secret_key'] = $this->qiniu_cofing['secret_key'];
            $plats['qiniu']['buckut'] = $this->qiniu_cofing['buckut'];
		}

        //平台信息相关
        $plats_sql = 'SELECT plat_name FROM we_plats
                WHERE weid=? ';
        $plats_row = $this->db->queryOne($plats_sql , array($weid));
        if(empty($plats_row)) error(404);

		$plats_cms_sql = 'SELECT title , description , key_word
						 , icp , favicon , logo , background , weibo_show 
						 , background_up , bar1 , bar2 , bar3 , background_right
						 ,bar4 , block FROM we_plat_cms WHERE plat_id=?';
		$plats['plats_info'] = $this->db->queryOne($plats_cms_sql , array($weid));
        $plats['plats_info']['plat_name'] = $plats_row['plat_name'];

        if(empty($_COOKIE['token']))
        {
            $plats['var pages_index'] = 'index';
        }
        else
        {
            $user_info = $this->user_token();
            $plats['plats_user_info'] = FALSE;
            if(!empty($user_info['weid']))
            {
                $plats['var plats_token'] = $_COOKIE['token'];
                $plats['plats_user_info'] = $user_info;
                $sql = 'SELECT domain FROM we_pages WHERE plat_id=? AND plat_user_id=? ';
                $row = $this->db->queryOne($sql , array($weid , $user_info['weid']));

                $plats['var pages_index'] = 'index';
                $plats['var is_login'] = 'yes';
                if(!empty($row))
                {
                    $plats['plats_user_info']['domian'] = $row['domain'];
                    $plats['var pages_index'] = $row['domain'];
                }       
            }
            else
            {
                $plats['var is_login'] = 'no';
                $plats['var pages_index'] = 'index';
            }
        }
		return $plats;
    }

    // 网站元素要替换规则
    private function _get_str_replace_content($content , $config_file , $directory ,$additional_config)
    {
        return Wez_template::init($this->file ,  $content , $config_file , $directory ,$additional_config);
    }

    // 判断是否加载控制器
    private function _controller($uri , $data)
    {

        $controller_uri = explode('/', $uri);

        $controller_uri = next($controller_uri);

        $file = "$controller_uri";

        $controller_file = "./controller/$file.php";

        if(is_file($controller_file) == FALSE)
        {
            return TRUE;
        } 

        $action = 'index';
        if(count($controller_uri) >= 2 )
        {
            $action = next($controller_uri);
        }
        
        include $controller_file;  $c = new $file(); $c->public_data = $data; $c->{$action}(); exit();
     
    }

    /**
     * 取得根域名
     * @param type $domain 域名
     * @return string 返回根域名
     */
    private function _get_domain($domain) {
        $re_domain = '';
        $domain_postfix_cn_array = array("com", "net", "org", "gov", "edu", "com.cn", "cn");
        $array_domain = explode(".", $domain);
        $array_num = count($array_domain) - 1;
        if ($array_domain[$array_num] == 'cn') {
            if (in_array($array_domain[$array_num - 1], $domain_postfix_cn_array)) {
                $re_domain = $array_domain[$array_num - 2] . "." . $array_domain[$array_num - 1] . "." . $array_domain[$array_num];
            } else {
                $re_domain = $array_domain[$array_num - 1] . "." . $array_domain[$array_num];
            }
        } else {
            $re_domain = $array_domain[$array_num - 1] . "." . $array_domain[$array_num];
        }
        return $re_domain;
    }

}

