<?php 
/**
*  模板解析
*/
class Wez_template
{
	private static $variable;

	public static function init($file ,  $content , $config_file , $directory ,$additional_config)
	{
		$content = self::_replace($content , $file , $directory);
		$content = str_replace('{{PATH_CONFIG}}', $config_file.'?t='.time() , $content);
		$content = str_replace('{{PATH_TML}}', $file.$directory.'/' , $content);
		$content = str_replace('</body>', '<script src="//captcha.luosimao.com/static/js/api.js"></script></body>' , $content);
		$content = str_replace('<html>', '<html><script>'.$additional_config.'</script>' , $content);

		return self::_compress_html($content);
	}
	
	public static function _compress_html($string) {
    	return ltrim(rtrim(preg_replace(array("/> *([^ ]*) *</","//","'/\*[^*]*\*/'","/\r\n/","/\n/","/\t/",'/>[ ]+</'),array(">\\1<",'','','','','','><'),$string)));
	}

	//解析模板
	private static function _replace($content , $file , $directory)
	{
		return self::_analysis($content , $file , $directory);
	}

	// 加载文件
	private static function _include($value , $file , $directory)
	{

		$value_array = explode('?', $value);

		$file_name = current($value_array);

		$params = next($value_array);
		if(!empty($params)){
			self::$variable['script_variable'][] = $params;
		}
		
		$tml_get_file = '.'.$file.$directory.'/'.$file_name;

		$tml_content = file_get_contents($tml_get_file);

		return $tml_content;
	}

	// 加载母版页
	private static function _extend($value , $file , $directory , $content , $lable)
	{
		$value_array = explode('?', $value);

		$file_name = current($value_array);

		$params = next($value_array);
		if(!empty($params)){
			self::$variable['script_variable'][] = $params;
		}

		$tml_get_file = '.'.$file.$directory.'/'.$file_name;

		$tml_content = file_get_contents($tml_get_file);

		$tml_content = self::_analysis($tml_content , $file , $directory);

		$tml_content = str_replace('{{extend-content}}', $content , $tml_content);

		$tml_content = str_replace( $lable , '' , $tml_content);
		
		return $tml_content;
	}

	// 解析模板标签
	private static function _analysis($content , $file , $directory)
	{
		$preg = "%<#(.*?)#>(.*?)</#(.*?)#>%si";
		preg_match_all($preg, $content, $replace);

		if(empty($replace))
		{
			return $content;
		}

		$replace_key = current($replace);
		$replace_label = next($replace);
		$replace_value = next($replace);

		foreach ($replace_label as $key => $value) {
			if($value !== 'extend')
			{
				$replace_content = self::{'_'.$value}($replace_value[$key] , $file , $directory);
				$content = str_replace($replace_key[$key], $replace_content , $content);
			}
			else
			{
				$last['lable'] =  $replace_key[$key];
				$last['key'] =  $value;
				$last['value'] =  $replace_value[$key];
			}
		}
		if(!empty($last))
		{
			$content = self::{'_'.$last['key']}($last['value'] , $file , $directory , $content , $last['lable']);
		}
		return $content;
	}

	// // 加载script 文件
	// private static function _script($value , $file , $directory)
	// {
	// 	$script_array = explode(',', $value);	
	// 	return FALSE;	
	// }

	// // 加载link 文件
	// private static function _link($value , $file , $directory)
	// {
	// 	$script_array = explode(',', $value);	
	// 	return FALSE;	
	// }
}