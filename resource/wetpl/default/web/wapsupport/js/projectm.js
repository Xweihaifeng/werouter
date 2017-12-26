/*
* @Author: Marte
* @Date:   2017-10-14 09:58:45
* @Last Modified by:   Marte
* @Last Modified time: 2017-10-14 19:38:32
*/

'use strict';

var url = window.location.pathname.split('/');
var projectid = url.pop();
var domain = url.slice(1, 2)[0];
var weid = docCookies.getItem("weid");
var repay_su=function(data){

        var html=
        '<a href="/user/project/projectm_pay/'+projectid+'" class="gyl-btn-support">'+

           '<span >我要支持</span>'+
        '</a>'

        return html;

}

$(function(){
    //项目详情
    var project_detail=function(projectid){
        $.ajax({
            url: PROJECT_DETAIL+'/' + projectid,
            type: 'get',
            success: function(data){
                console.log(data);
                if(data.code==200){
                    $(".swiper-slide").append(imagelisttemplate(data.data));
                    $('.gyl-pi-tit h1').text(data.data.title);
                    $('.view-body').text(data.data.content);
                    $(".gyl-pi-tit").empty();
                    $(".gyl-pi-tit").append(amounttemplate(data.data));
                    $("footer").append(repay_su(data.data));
                    /*
                    $("#projectMsg").html(data.data.content);
                    $(".title").html(data.data.title);
                    $("#gyl-detail").empty();
                    $("#gyl-detail").append(amounttemplate(data.data));
                    $(".project-show-right").find(".prject-right-user").empty();
                    $("#footerMC").append(usertemplate(data.data));//关注
                    $(".project-show-project-box-top").find(".project_p").empty();
                    if(data.data.images!=null && data.data.images!=""){


                    $('.gyl-pi-green').css('width',widthFun(data))


                    }
                    //$(".project-rightinfo-right-box").find(".top").append(detailtemplate(detail_data));
                    //绑定关注点击事件
                    collectionClick();
                    */

                }
            },
            error: function(xhr){
                console.log(xhr);
            }
        })
    }
    //banner图
     var imagelisttemplate=function(data){

        var imagelist='';
        var imagesArr= new Array(); //定义一数组
        imagesArr=data.images.split(","); //字符分割
        console.log(data.images)
        for (var i=0;i<imagesArr.length ;i++ )
        {
            imagelist+=`
                 <div style="width: 470px; height: 250px; background: url(`+ApiMaterPlatQiniuDomain+imagesArr[i]+`) no-repeat center; background-size: 100% 100%">
                 </div>
            `;

        }
        return imagelist;
    }
    // 计算筹款比例
var widthFun=function(data){
                     var data_width=data.raise_amount/data.amount;
                     return data_width
     }
    //添加关注
    var addCollection=function(projectid){
        var sendData={
            project_id:projectid,
        }
        $.ajax({
            url: PROJECT_COLLECTION_STORE,
            type: 'post',
            data:sendData,
            success: function(data){
                if(data.code==200){
                    //已经关注
                    $(".collection").text("已关注");
                    $(".collection").attr("collection_id",data.data);
                    layer.msg('关注成功！');
                }else{
                    layer.msg(data.message);
                }
            },
            error: function(xhr){
                console.log(xhr);
            }
        })
    }
     // var usertemplate=function(data){
        //日期处理
        // var date=data.created_at.substring(0, 10);
        // date = date.replace(/-/g,'/');
        // var html=`
        // <div class="collection" style="cursor:pointer;" >立即关注</div>
        // `
        // return html;
    // }



    var amounttemplate=function(data){
        console.log(data)
        console.log(data.offtime)
        // banner及详情

        var reporhtml=`
            <div class="gyl-mod gyl-pro-info">
               <div class="gyl-pi-tit">

                <span>剩余<strong>`+data.offtime+`</strong>天</span>
               </div>
               <div class="gyl-pi-schedule">
                <div class="gyl-pi-green" style="width:87.2%"></div>
               </div>
               <div class="gyl-pi-statistics hairline bottom">
                <ul>
                 <li> <h3>目标金额</h3> <p>`+data.amount+`<span>元</span></p> <i class="gyl-right-sline hairline right"></i> </li>
                 <li> <h3>已筹金额</h3> <p>`+data.raise_amount+`<span>元</span></p> <i class="gyl-right-sline hairline right"></i> </li>
                 <li> <h3>支持次数</h3> <p><span>`+data.suport_num+`次</span></p> </li>
                </ul>
               </div>
               <!-- <div class="gyl-pi-jump">
                <a href="/project/content.html?uuid=28a30a86-1b3c-420c-9115-029d9182702c" style="text-align: center;color:#43AC43;font-size: 16px;"><span class="gyl-bot-zy-big">项目详情</span></a>
                 </div> -->
              </div>
        `
        return reporhtml
    }





//项目支持
 var project_suport_list=function(projectid){
        var sendData={
            project_id:projectid,
            limit:1000,
            page:1,
        }
        $.ajax({
            url: PROJECT_SUPORT_LIST,
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

                            $(".gyl-psup-list").append(project_suport_listtemplate(x));
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

             <div class="gyl-psup-info " data-orderid="689631857">
              <div class="gyl-psup-head">
               <img class="lazy-load" src=`+ApiMaterPlatQiniuDomain+data.avatar+`  style="display: inline;" />
              </div>
              <div class="gyl-psup-article hairline bottom">
               <div class="gyl-psup-art-info">
                <div class="gyl-psup-art-left">
                 <div class="gyl-psup-artl-top">
                  <h3>`+data.nickname+`</h3>
                  <span style="color:">支持了 </span>
                  <span style="color:#F25B4B">`+data.amount+`</span>
                 </div>
                </div>
                <div class="gyl-psup-art-right">
                 <span>8小时前</span>
                 <i class="gyl-sage-chat" data-orderid="689631857"></i>
                </div>
               </div>
               <div class="gyl-psup-art-eva " style="">
                <i class="icon-triangle"></i>
                <p class="feed_comment " data-reciver="74504c3b-3397-4185-a46a-8ab67166a34e" data-uuid="d8a1706a-a4c9-11e7-811d-00163e13115c" data-name="小林萨" data-commentid="13356471348"> <span>`+data.nickname+`</span> :`+data.note+` </p>
               </div>
              </div>
             </div>
            `
            return supportersHtml
        }



    //项目动态
        var project_new_list=function(projectid){
        var sendData={
            project_id:projectid,
            limit:1000,
            page:1,
        }
        $.ajax({
            url: PROJECT_NEWS_LIST,
            type: 'post',
            data:sendData,
            success: function(data){
                console.log(data);
                if(data.code==200){
                    var datalist=data.data.list;
                    $(".gyl-trends-list").empty();
                    datalist.map(x =>{
                        $(".gyl-trends-list").append(new_listtemplate(x));

                    })
                }
            },
            error: function(xhr){
                console.log(xhr);
            }
        })
    }
    project_new_list(projectid);
   var new_listtemplate=function(data){
     console.log(data)
        var date=data.created_at.substring(0, 10);
        var imagelist='';
        var imagesArr= new Array(); //定义一数组
        imagesArr=data.images.split(","); //字符分割
        for (var i=0;i<imagesArr.length ;i++ )
        {
            imagelist+='<img class="" src="'+ApiMaterPlatQiniuDomain+imagesArr[i]+'">';
        }
        var html=`
                <div class="gyl-trends-info" data-topicid="4624874">
     <div class="gyl-trends-head">
      <img class="lazy-load" src=`+ApiMaterPlatQiniuDomain+data.avatar+` data-original="" style="display: inline;" />
     </div>
     <div class="gyl-trends-article hairline bottom">
      <div class="gyl-trends-art-info">
       <div class="gyl-trends-art-left">
        <div class="gyl-trends-artl-top">
         <h3>`+data.nickname+`</h3>
        </div>

       </div>

      </div>
      <div class="gyl-trends-art">
       <p> <span style="color:#999999">目标金额：</span> <span style="color:#38a43b">`+data.amount+`</span> <span style="color:#999999">元</span> <br /> </p>
      </div>
      <div class="gyl-trends-pic">
      </div>
      <div class="gyl-trends-art-info gyl-trends-date-tiem">
       <span class="times">`+date+`</span>
       <p> <span style="color:#43AC43">项目发起</span> </p>
       <div class="gyl-trends-art-right">
        <i class="gyl-sage-chat" data-topicid="4624874"></i>
       </div>
      </div>
      <div class="gyl-trends-art-eva" style="">
      <div class="project-img">`+imagelist+`</div>

      </div>
     </div>
    </div>
        `
        return html;
    }
    //<a class="gyl-trends-art-more" href="javascript:void(0)" data-topicid="4624874"> <strong>查看更多评论</strong> </a>
    //
    //项目回报
        var repay_list=function(projectid){
        var sendData={
            project_id:projectid,
            limit:5,
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
                    // $(".project-right-item-lists").find(".chan-ping-hui-bao-box").empty();
                    // $(".project-right-item-lists").find(".chan-ping-hui-bao-box").append('<p style="padding-left: 0;padding-top: 0 ;margin-bottom: 20px" class="right-box-title-style">项目回报</p>');
                    datalist.map(x =>{
                        $(".repay_con").append(repay_listtemplate(x));
                    })

                }
            },
            error: function(xhr){
                console.log(xhr);
            }
        })
    }
    repay_list(projectid);
    var repay_listtemplate=function(data){
        var html=`
        <div class="gyl-repay-info hairline bottom">
   <a href="#" class="fancybox" rel="fancybox" data-group_id="huibao">
    <div class="gyl-repay-head">
     <img class="lazy-load" src=`+ApiMaterPlatQiniuDomain+data.images+`  />
    </div> </a>
   <div class="gyl-repay-article">
    <div class="gyl-repay-art-info">
     <div class="gyl-repay-art-left">
      <div class="gyl-repay-artl-top">
       <p>支持 <span>`+data.repay_date+`</span> 元</p>
      </div>
     </div>
     <div class="gyl-repay-art-right">

     </div>
     <div class="gyl-repay-art">
      <p>`+data.title+`</p>
     </div>
    </div>
   </div>
  </div>
        `
        return html;

    }

   var Init=function(){
        project_detail(projectid);
   }
    Init();


    })