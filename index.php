<?php
/* 
 *  微众项目路由路由
 */
define('WWW_PATH',str_replace('\\','/',realpath(dirname(__FILE__).'/../')));
include('./init.php');
$router = new router_index();

// 执行方法
$router->index();



 