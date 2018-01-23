<?php
class cache extends controller
{
	public function index()
	{
		$host = $_SERVER['HTTP_HOST'];
		$file = './config/domain/'.md5($host);
		if(is_file($file))
		{
			unlink($file);
		}
		
		$file = './config/web/'.md5($host).'.js';
		unlink($file);
		if(is_file($file))
		{
			unlink($file);
		}
		echo 'ok-ok';
	}
}	

