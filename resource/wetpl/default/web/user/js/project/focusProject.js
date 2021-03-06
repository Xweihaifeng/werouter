// 判断 sessionStorage
if(sessionStorage.lastname=="we_title_4"){
    $("#we_title_4").find(".we-cont").show().parents().siblings().find(".we-cont").hide();
    $("#we_title_4").find(".title-img").css("transform","rotate(90deg)");
}

$(document).ready(function(){
   // const ApiMaterPlatQiniuDomain       = 'http://images.new.wezchina.com/';

    var favicon = ApiMaterPlatQiniuDomain + localStorage.getItem('fav');
    console.log('logo:',favicon);
    $('#favicon').attr('href', favicon);

    var logo = ApiMaterPlatQiniuDomain + localStorage.getItem('logo');
    console.log('logo:',logo);
    $('#home img').attr('src', logo);




    // 列表模板
    var listtemplate=function(data,type=0){
        var disabled=btn_cancle_pub="";
        var btn_active='btn-active';
        var ing='进行中';
        type=data.status;
        // if(type==0){
            // 全部
             btn_cancle_pub=`

            <a href="/user/admin/project/init" >
            <button  id="update_p" type="button"  '+disabled+' class="btn  btn-active "  >更新动态</button>
            </a>
             `

            ;


        var listhtml='<li class="activity" data-id="'+data.weid+'">'+
                        '<div class="status status-process">'+
                            '<div class="up">'+data.onStatus+'</div>'+
                            '<div class="down"></div>'+
                        '</div>'+
                        '<div class="poster">'+
                            '<img src="'+ApiMaterPlatQiniuDomain+data.cover+'" class="pic">'+
                        '</div>'+
                        '<div class="detail">'+
                            '<h3 class="title">'+
                                '<a href="/'+data.domain+'/project/'+data.weid+'"  target="_blank">'+data.title+'</a>'+
                            '</h3>'+
                                '<div class="property">'+

                                    '<div class="time">'+
                                        '<label>时间：</label><span>'+data.date_start+'</span> <span> ( '+data.start_week+' ) </span> <span>'+data.date_end+'</span><span> ( '+data.end_week+' ) </span> '+
                                    '</div>'+
                                    '<div class="addr">'+
                                        '<label>项目类型：</label>'+data.cate_name+'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+
                                        '<label>目标：</label>'+data.amount+''+'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+
                                        '<label>已筹：</label>'+data.raise_amount+''+
                                    '</div>'+


                                    '<div class="display-ib coll">'+
                                        '<label>关注：</label>'+data.collection_num+'人'+
                                    '</div>'+
                                                                    '<div class="display-ib sign">'+
                                        '<label>支持：</label>'+data.suport_num+'人'+
                                    '</div>'+
                                   //  '<div class="display-ib mark">'+
                                   //      '<label>签到：</label>0人'+
                                   // ' </div>'+
                                    '<div class="clearfix"></div>'+
                                '</div>'+


                                '<div class="flow">'+

                                    '<a href="/'+data.domain+'/project/'+data.weid+'" class="btn btn-active">查看详情</a>'+
                                '</div>'+

                        '</div>'+
                        '<div class="operation">'+
                           ' <ul>'+

                               //  '<li>'+
                                    // '<a href="/user/admin/project/init" >'+
                                    //     '<span class="fa fa-share-alt"></span>更新'+
                                    // '</a>'+
                               // ' </li>'+
                            '</ul>'+
                        '</div>'+
                    '</li>';
        return listhtml;
    }
    var weid=docCookies.getItem("weid");

    var project_info=function(weid){

         $.ajax({
            url:PROJECT_INFO+'/'+weid,
            type:'get',
            headers: {
                    'Token': docCookies.getItem("token")
                },
            success:function(data){
                console.log(data);
                if(data.code == 200){

                    // $(".all_total").text(data.data.count);
                    $(".no_total").text(data.data.suportcount);
                    // $(".ing_total").text(data.data.oncount);
                    $(".end_total").text(data.data.collectioncount);
                }
            },
            error: function(xhr){
                console.log(xhr);
            }
        })


    }
    project_info(weid)
    // 关注项目列表
    var focusproject=function(user_id){
        var limit="";
        var page=1;
        var sendData={
            user_id:user_id,
            limit:limit,
            page:page
        }
        $.ajax({
            // url: ACTIVITY_LIST,
            url: PROJECT_COLLECTION_LIST,
            type: 'post',
            data:sendData,
            success: function(data){
                console.log(data);
                if (data.code == 200) {
                    if(data.data!=null){
                        if(data.data.total>0){
                        $('.ing_total').text(data.data.total);
                      }else{
                        $('.ing_total').text(0);
                      }
                  }else{
                        $('.ing_total').text(0);
                  }

                    var focuslist = data.data.list;
                    $("#J_ActivityList").children().remove();
                    focuslist.map(x =>{
                        $("#J_ActivityList").append(listtemplate(x));
                    })




                }
            },
            error: function(xhr){
                console.log(xhr);
            }
        })
    }

focusproject(weid);





/*

    //获取通用用户信息
    var getUserInfo = function(){
        $.ajax({
            url: FOUNDER,
            type: 'get',
            success: function(data){
                //console.log(data);
                if (data.code == 200){
                    var info = data.data;
                    var weid = info.weid;
                    if (info.avatar != "") {
                        $("#head-icon, .user-head").css({
                            "background": "url(" + info.avatar + ") no-repeat center",
                            "background-size": "100%"
                        });
                    } else {
                        $("#head-icon, .user-head").css({
                            "background": "url(/common/img/avatar.png) no-repeat center",
                            "background-size": "110%"
                        });
                    }

                    $(".line-0").html(
                        info.nickname + '<img src="/common/img/vrenzheng.png" alt="">'
                    );
                    $(".line-1").text(info.motto);
                    $(".user-cnt").text(info.nickname);
                    // artCount(weid);
                    // artTypeList(weid);

                    // catesfun(weid);


                }
            },
            error: function(xhr){
                console.log(xhr);
            }
        })
    }

    //getUserInfo();

    var artCount = function(weid){
        $.ajax({
            url: ARTICLES_LISTCOUNT+"?userId=" + weid,
            type: 'get',
            success: function(data){
                //console.log(data);
                if (data.code == 200){
                    $(".user-art").children('div:eq(0)').text(data.data);
                }
            },
            error: function(xhr){
                console.log(xhr);
            }
        })
    }

*/



})
