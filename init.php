<?php
include('./config.php');
// DB
include('./db/mysqlDb.php');
//阉割版函数包未做任何处理
include('./helper/common_helper.php');
//控制器加载入口
include('./controller/controllerRouter.php');
//路由入口
include('./router/router_index.php');