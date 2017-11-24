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
        'm' => 'wap/wepage',
        'pc' => 'web'
    ];
    
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
        $mark_domain = current($domain_array);
        
        $domain_config = $this->_domain;
        if($mark_domain == 'm') 
        {
            $domain_config = str_replace("m.","", $this->_domain );
        }        
        $this->_mark_domain = (in_array($mark_domain, $mark_array)) ? $mark_domain : 'pc' ;

        $this->_is_wap($domain_config);

        return $domain_config;
    }

    private function _is_wap($domain_config)
    {
        if($this->_mark_domain == 'pc' && is_mobile() == TRUE){
            header("Location: http://m.".$domain_config.$this->_request_uri); 
            exit;
        }elseif ($this->_mark_domain == 'm' && is_mobile() == FALSE) {
            header("Location: http://".$domain_config.$this->_request_uri); 
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

        if(empty($this->data['router'])) error (404);

        (new main($this->data))->index($this->_directory[$this->_mark_domain] , $this->data['weid'] , $this->_domain_config, $this->_mark_domain);
        
    }
}

class main
{ 
    //路由配置信息
    public $params;
    //获取data 数据
    public $data;
    // 获取项目文件FILE
    public $file;

    // 构造方法
    public function __construct($data) 
    {
        $this->data = $data;
    }
    
    public function  index( $directory , $weid , $domain , $mark_domain)
    {

		$router = $this->data['router'];

    	$rule = $this->data['match'];

    	$uri =current(explode('?', $_SERVER['REQUEST_URI']));

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

        $config_file = $this->_generate_config($additional_config , $domain , $mark_domain);

        if(!file_exists('.'.$this->file.$directory.$router_map))
        {
            error(404);
        }

        $content = file_get_contents('.'.$this->file.$directory.$router_map);

        echo $this->_get_str_replace_content($content , $config_file , $directory);

    }

    // 生成配置文件
    private function _generate_config($additional_config , $domain , $mark_domain)
    {
    	if($mark_domain == 'm')
    	{
    		$domain = 'm.'.$domain;
    	}
        $config = file_get_contents('configure.js');

        $config = str_replace('{{url}}', $domain , $config);

        $config .= "\n".'const WWW_PATH= "'.$this->file.'";';

        foreach ($additional_config as $key => $value) {
            if($value)
            {
                $config .= "\n".$key .'="'.$value.'";';
            }
            else
            {
                $config .= "\n".$key;
            }
        }
        $cache_config_file = '/config/web/'.md5($domain).'.js';

        $config_file = fopen( './'.$cache_config_file , "w");

        fwrite($config_file , $config);

        fclose($config_file);

        return $cache_config_file;
    }

    // 网站元素要替换规则
    private function _get_str_replace_content($content , $config_file , $directory)
    {
        return Wez_template::init($this->file ,  $content , $config_file , $directory);
    }

}

