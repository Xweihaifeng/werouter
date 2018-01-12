<?php

/**
 * @Author: lisheng
 * @DateTime: 2018/01/08 15:38
 *
 * @Description: 模版管理
 */

class TemplateManage{

    /**
     * @var string 来源根url
     */
    protected $from_dir;

    /**
     * @var string 目标根url
     */
    protected $to_dir;

    //构造函数
    public function __construct(){
        $this->from_dir=__dir__.'/../resource/wetpl/';
        $this->to_dir=__dir__.'/../resource/diytpl/';
    }

    //复制文件目录
    function copy_dir($src, $dst)
    {
        $dir = opendir($src);
        @mkdir($dst);
        while (false !== ($file = readdir($dir))) {
            if (($file != '.') && ($file != '..')) {
                if (is_dir($src . '/' . $file)) {
                    $this->copy_dir($src . '/' . $file, $dst . '/' . $file);
                    continue;
                } else {
                    copy($src . '/' . $file, $dst . '/' . $file);
                }
            }
        }
        closedir($dir);
    }
    //成功信息
    public function success($data){
        $arr=[];
        $arr['code']=200;
        $arr['data']=$data;
        $arr['message']='success';
        $json=json_encode($arr);
        echo $json;
    }
    //失败信息
    public function fail($message){
        $arr=[];
        $arr['code']=-200;
        $arr['data']='';
        $arr['message']=$message;
        $json=json_encode($arr);
        echo $json;
    }
    //创建模版
    function creatTemplate($from,$to){
        if(!empty($from)&&!empty($to)){
            if(!is_dir($this->from_dir.$from)){
                return $this->fail("原目录不存在！");
            }
            if(is_dir($this->to_dir.$to)){
                return $this->fail("目标目录已经存在！");
            }
            $this->copy_dir($this->from_dir.$from,$this->to_dir.$to);
            return $this->success(null);
        }else{
            return $this->fail("参数为空！");
        }
    }
    //模版文件列表
    public function templateList($url){
        if(!empty($url)){
            if(is_dir($this->to_dir.$url)){
                $arr=[];
                $arrback=[];
                $arrfolder=[];
                $arrfile=[];
                foreach(scandir($this->to_dir.$url) as $afile)
                    {
                        if($afile=='.'||$afile=='..'){
                            if($afile=='..'){
                                //返回上一及
                                $rest = substr($url,0,strrpos($url,'/'));
                                array_push($arrback,['name'=>$afile,'url'=>$rest,'style'=>'back']);
                            }
                            continue;
                        }
                        if(is_dir($this->to_dir.$url.'/'.$afile))
                        {
                            //文件夹类型
                            array_push($arrfolder,['name'=>$afile,'url'=>$url.'/'.$afile,'style'=>'folder']);
                        } else {
                            //文件类型
                            if(preg_match("/[.](html|css|js)$/",$afile)){
                                $size=filesize($this->to_dir.$url.'/'.$afile);
                                $size=round($size/1024,2);
                                $updated=filemtime($this->to_dir.$url.'/'.$afile);
                                $updated=date("Y-m-d H:i:s",$updated);
                                array_push($arrfile,['name'=>$afile,'url'=>$url.'/'.$afile,'style'=>'file','size'=>$size,'updated'=>$updated]);
                            }
                        }
                    }
                $arr=array_merge($arrback,$arrfolder,$arrfile);
                return $this->success($arr);
                }else{
                    return $this->fail("文件或文件夹不存在！");
                }
        }else{
            return $this->fail("参数有误！");
        }
    }
    //获取文件内容
    public function templateInfo($url){
        if(file_exists($this->to_dir.$url)){
            $arr=[];
            $countent=file_get_contents($this->to_dir.$url);
            $rest = substr($url,strrpos($url,'/')+1);
            $arr['name']=$rest;
            $arr['countent']=$countent;
            return $this->success($arr);
        }else{
            return $this->fail("文件不存在！");
        }
    }
    //保存文件
    public function templateSave($url,$content){
        if(file_exists($this->to_dir.$url)){
            $flag=file_put_contents($this->to_dir.$url,$content);
            if($flag){
                return $this->success(null);
            }else{
                return $this->fail("保存文件失败！");
            }
        }else{
            return $this->fail("文件不存在！");
        }
    }
    //删除模版
    public function templateDel($url='abc.com'){
        $url=$this->to_dir.$url;
        if(file_exists($url)){
            $this->del_dir($url);
            return $this->success(null);
        }else{
            return $this->fail("模版不存在！");
        }

        /*
        if(file_exists($this->to_dir.$url)){
            $this->deleteAll($this->to_dir.$url);
            return $this->success(null);
        }else{
            return $this->fail("模版不存在！");
        }
        */

    }
    //删除文件以及文件夹
    private function deleteAll($path) {
         $op = dir($path);
         while(false != ($item = $op->read())) {
             if($item == '.' || $item == '..') {
                 continue;
             }
             if(is_dir($op->path.'/'.$item)) {
                 $this->deleteAll($op->path.'/'.$item);
                 rmdir($op->path.'/'.$item);
             } else {
                 unlink($op->path.'/'.$item);
             }
         }
    }
    private function del_dir($dir)
    {
        if(strtoupper(substr(PHP_OS, 0, 3)) == 'WIN') {
            $str = "rmdir /s/q " . $dir;
        } else {
            $str = "rm -Rf " . $dir;
        }
        exec($str);
    }

}

$Tem=new TemplateManage();
$post=$_POST;
if(!empty($post['operation'])){
    switch ($post['operation'])
    {
        case 'creatTemplate':
            $Tem->creatTemplate($post['from'],$post['to']);
            break;
        case 'templateList':
            $Tem->templateList($post['url']);
            break;
        case 'templateInfo':
            $Tem->templateInfo($post['url']);
            break;
        case 'templateSave':
            $Tem->templateSave($post['url'],$post['content']);
            break;
        case 'templateDel':
            $Tem->templateDel($post['url']);
            break;
        default:
            return $Tem->fail("无操作！");
    }
}
?>