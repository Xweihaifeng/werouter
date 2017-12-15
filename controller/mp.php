<?php
class mp extends controller
{
	public function index()
	{
		echo file_get_contents('/api'.$_SERVER['REQUEST_URI']);
		exit();
	}
}	

