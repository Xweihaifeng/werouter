<?php
/**
 * 路由内置验证
 *
 * @author Guanz
 */
class router_verify{
    	
    private $_rouert_match;
    private $_rule;
    
    public $router = FALSE;
    public $controllerRouter;
    public function __construct($router = array() , $uri = array() , $rule = array() , $weid = '') 
    {
        foreach ($rule as $key => $value) {
            $this->_rule[$value['mark']] = $value['match'];
        }
        $this->controllerRouter = new controllerRouter($weid);
        return $this->_init($router, $uri , $rule ,$weid);
    }
    
    // 初始化验证
    private function _init($router , $uri , $rule)
    {
        // URI数据
        $uri = array_filter(explode('/', $uri));
        
        $additional_router = array();
        $basics_router = array();
        foreach ($router as $key => $value) {
        	if(strpos($value['router'] , ':') !== FALSE)
        	{
        		$additional_router[] = $value;
        	}
        	else
        	{
        		$basics_router[] = $value;
        	}
        }

        $rouert_match = $this->_router_count($basics_router , $uri);

        $is_router = $this->_router_match($rouert_match , $uri);
        if(empty($is_router))
        {
        	$rouert_match = $this->_router_count($additional_router , $uri);

        	$is_router = $this->_router_match($rouert_match , $uri);
        }

        $this->router = $is_router;

        if(empty($this->router))
        {
        	return FALSE;
        }

        if(!empty($this->controllerRouter->config)){
        	$this->router['config'] = $this->controllerRouter->config;

        }


        return TRUE;
    }

    // 计算路由长度与路由配置是否相等
    private function _router_count($router , $uri)
    {
        $i = 1;
        foreach ($router as $key => $value) {
            
            $router_config_count = array_filter(explode('/', $value['router']));
            if(count($router_config_count) == count($uri)){
                $rouert_match[$i]['router'] = $router_config_count;
                $rouert_match[$i]['router_map'] = $value['router_map'];
                $i++;
            }
        }
        if(empty($rouert_match)) return FALSE;
        return $rouert_match;
    }

    // 计算相对路由匹配度
    private function _router_match($router_match , $uri)
    {
        if(empty($router_match)) return FALSE;
        $count_match = count($uri);

        // 匹配条数
        foreach ($router_match as $key => $value) {

            $do_match = $this->_router_one_match($uri , $value);

            if($do_match >= $count_match)
            {
                return $value;
            }
            else
            {
                $this->controllerRouter->clear();
            }
        }
        return FALSE;
    }


    // 计算单条路由与配置匹配度
    private function _router_one_match($uri , $router_one_match)
    {
        $value = $router_one_match['router'];
        $do_match = 0;
        for($i = 1; $i <= count($uri) ; $i++){

        	$do_match_state = FALSE;
            $router_stirng = $value[$i];

            $uri_string = $uri[$i];

            if(strpos($router_stirng , ':') !== false){
                $method = ltrim($router_stirng , ':');
                $match = '';
                // 当有设置正则验证事 需要做验证
                if(!empty($match = $this->_rule[$method]))
                {
  
                    //var_dump(preg_match("/^$match$/" , $uri_string));
                    if(preg_match("/^$match$/" , $uri_string))
                    {
                        $do_match_state = TRUE;
                    }
                    else
                    {
                        return FALSE;
                    }
                }
                // 是否有额外条件
                if(method_exists($this->controllerRouter , $method) !== FALSE)
                {
                    $method_params['current'] = $i;
                    $method_params['total'] = count($uri);
                    $method_params['uri'] = $uri;

                	if($this->controllerRouter->{$method}($uri_string , $method_params) !== FALSE)
                    {
                        $do_match++;
                    }
                    else
                    {
                        return FALSE;
                    }
                }
                elseif ($do_match_state == TRUE) {
                	$do_match++;
                }
            }
            else
            {
                if($router_stirng == $uri_string) $do_match++;
            }
        }
        return $do_match;
    }
}
