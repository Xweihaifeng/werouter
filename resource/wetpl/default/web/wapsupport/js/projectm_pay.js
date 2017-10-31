/*
* @Author: Marte
* @Date:   2017-10-14 09:58:45
* @Last Modified by:   Marte
* @Last Modified time: 2017-10-14 18:49:15
*/

'use strict';

var url = window.location.pathname.split('/');
var projectid = url.pop();
var domain = url.slice(1, 2)[0];
var weid = localStorage.getItem('weid');
var repay_su=function(data){

        var html=
        '<a href="/user/project/projectm_pay/'+projectid+'" class="gyl-btn-support">'+

           '<span >我要支持</span>'+
        '</a>'

        return html;

}

$(function(){





//项目支持
 var project_suport_list=function(projectid){
        var sendData={
            project_id:projectid,
            limit:1000,
            page:1,
        }
        $.ajax({
            url: PROJECT_REPAY_LIST,
            type: 'post',
            data:sendData,
            success: function(data){
                console.log(data);
                if(data.code==200){
                    var datalist=data.data.list;
                    $(".gyl-psup-list").empty();

                     // $(".gyl-psup-tit").append('<div class="trends_title_h" id="project-supporter">Ta的支持者</div>');
                    if(data.data.total>0){
                        datalist.map(x =>{

                            $(".repay_rep").append(project_suport_listtemplate(x));
                            $('#footerMC').append(footer_btn(x))
                            // $('.gyl-psup-tit').append('<p><span>`+data.suport_num+`</span>人支持</p>')
                        })
                    }else{
                            $(".gyl-psup-list").append("<div>暂无支持者</div>");

                    }
                }
            },
            error: function(xhr){
                console.log(xhr);
            }
        })
    }
    project_suport_list(projectid);
        var project_suport_listtemplate=function(data){
            var supportersHtml=`
            <div class="gyl-repay-info hairline bottom">
    <a href="#" class="fancybox" rel="fancybox" data-group_id="huibao">
      <div class="text-center">
        <img class="lazy-load" src=`+data.images+` >

      </div>
    </a>
    <div class="gyl-repay-article">
      <div class="gyl-repay-art-info">
        <div class="gyl-repay-art-left">
          <div class="gyl-repay-artl-top">
            <p>支持
              <span>`+data.limit+`</span>元</p></div>
        </div>
        <div class="gyl-repay-art-right">
          <span>已有
            <strong>`+data.repay_num+`</strong>人支持</span></div>
        <div class="gyl-repay-art">
          <p>`+data.title+`</p>
        </div>
      </div>
    </div>
  </div>
            `
            return supportersHtml
        }


var footer_btn=function(data){
  var footer_btn_html=`
      <span class="bar-item" style=" margin-top: 13px;font-size: 18px;margin-left: 8px;" id="btn-follow">
        <small>`+data.limit+`</small>元</span>
      <a href="javascript:void(0)" class="gyl-btn-support">
        <span>支持</span></a>
  `
  return footer_btn_html;
}



    })