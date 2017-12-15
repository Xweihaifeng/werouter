<?php
class mp extends controller
{
	public function index()
	{

		$protocol = empty($_SERVER['HTTPS']) ? 'http://' : 'https://';
		echo file_get_contents( $protocol.$_SERVER['HTTP_HOST'].'/api'.$_SERVER['REQUEST_URI']);
		exit();
	}
}	

