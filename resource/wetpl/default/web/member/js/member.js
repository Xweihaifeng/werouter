/*
 *     组织部分数据覆盖
 */
var column_list = function(data) {
    if(data.title == '入会申请') {
        var template = `<a class="chan_li cate-active-on" id="`+ data.domain +`" href="/member/apply"> `+ data.title +` </a>`
    } else {
        var template = `<a class="chan_li" id="`+ data.domain +`" href="/org/`+ data.domain +`"> `+ data.title +` </a>`;
    }
    return template;
}

// 根据别名获取频道详情
var options = $.get(CMS_CHANNELS_DOMAIN_QUERY + "org");
options.done(function(data) {
    if(data.code === 200) {
        domain_weid = data.data.weid;
        var thumb_image = data.data.big_image;

        if(!thumb_image) {
            thumb_image = "/common/img/org_banner01.jpg";

        } else if (thumb_image.indexOf('http') != 0 && thumb_image != "") {
            thumb_image = imgSet(thumb_image, 1100, 320, 3);
        }
        $(".weizhuye-title").css("background-image", `url(`+ thumb_image + `)`);

    } else {
        console.error(data.message);
    }
});
options.fail(function(error) {
    console.error(error);
});

// 查询组织栏目分类
$.ajax({
    url: apiUrl + "/cms/channel_categories?channel=org",
    dataType: 'json',
    success: function(data){
        console.log(data.data);
        $.map(data.data, function(item, index) {
            $("#menuX").append(column_list(item));
        });
    },
    error: function(xhr){
        console.log(xhr);
    }
});

function member_issue(result, result2, result3) {

    var title_info = window.localStorage.getItem("title");
    if(!title_info) {
        document.title = result2.plat_name+``+result2.level_name+``+result3.real_name;
    } else {
        document.title = result2.plat_name+``+result2.level_name+``+result3.real_name + " — " + window.localStorage.getItem("title");
    }

    console.log(result2, result3);
    var result_weid = "http://" + window.location.host +"/cert/"+ result;
    var template12;
    if(!result2.page_domain) {
        template12 = ""
    } else {
        template12 = "http://" + window.location.host +"/"+ result2.page_domain;
    }
    var template = `
        <li class="member_title">
            <img src="`+ result2.avatar +`" class="member_header" />
            <div>`+ result2.plat_name+``+result2.level_name+`    `+result3.real_name+`</div>
            <p> <b>`+ result3.real_name +`</b> , `+ result2.cert_info +`。 </p>
        </li>
        <li class="member_content">
            <h3> 个人简介 </h3>
            <table cellpadding="0" cellspacing="0" rules="all" class="member-table">
                <tbody>
                    <tr>
                        <td>姓&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;名</td>
                        <td>`+ result3.real_name +`</td>
                    </tr>
                    <tr>
                        <td>性&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;别</td>
                        <td>`+ result2.sex +`</td>
                    </tr>
                    <tr>
                        <td>籍&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;贯</td>
                        <td>`+ result2.origo +`</td>
                    </tr>
                    <tr>
                        <td>现&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;住</td>
                        <td>`+ result2.residential +`</td>
                    </tr>
                    <tr>
                        <td>认证信息</td>
                        <td>
                            <span class="vip-icon-1"><img src="/common/img/vrenzheng.png">&nbsp;官方认证</span>
                            |<span class="vip-icon-span1"><img class="vip-icon-2" src="/common/img/shiming.png"></span>
                            |<span class="vip-icon-span2"><a href="`+ result_weid +`" target="_blank"><img class="vip-icon-3" src="/common/img/authentication.png"></a></span>
                            <br> `+ result2.cert_info +`
                        </td>
                    </tr>
                    <tr>
                        <td>个人主页</td>
                        <td>
                            <a href="`+ template12 +`" target="_blank">`+ template12 +`</a>
                        </td>
                    </tr>
                
                    <tr>
                        <td>业务范围</td>
                        <td>`+ result3.business +`</td>
                    </tr>
                    <tr>
                        <td>社会职务</td>
                        <td>
                            <p>`+ result3.position +`</p>
                        </td>
                    </tr>
                    <tr>
                        <td>个人荣誉</td>
                        <td>
                            <p>`+ result3.honor +`</p>
                        </td>
                    </tr>
                    <tr>
                        <td>个人履历</td>
                        <td>
                            <p>`+ result3.resume +`</p>
                        </td>
                    </tr>
                </tbody>
            </table>
        </li>`
    return template;
}

// 登录状态下显示操作
// if(token != null || token != undefined) {
    // 是否为会员
    var url=apiUrl+'member/u/profile?weid='+window.location.href.split("/").pop();
    var member_options = $.get(url);
    member_options.done(function(data) {
        if(data.code == 200) {
            var result = data.data;

            if(!result) {
                window.location.href = "/404";
            } else {
                console.log("会员！", result);
                if(!result.avatar) {
                    console.log("个人头像：", result.avatar);
                } else if (result.avatar.indexOf('http') != 0 && result.avatar != "") {
                    result.avatar = ApiMaterPlatQiniuDomain + result.avatar;
                }

                $(".member_header").attr("src", result.avatar)
                if(result.is_info == 2) {
                    console.log("信息未完善!");
                } else if(result.is_info == 1) {
                    console.log("信息已经完善!");
                    var options19 = $.get(MEMBER_MIEN +"/"+ result.weid);
                    options19.done(function(body) {
                        if(body.code == -200) {
                            window.location.href = "/404";
                        }
                        if(body.code == 200) {
                            var result2 = body.data.baseInfo;
                            var result3 = body.data.memberInfo;
                            if(result2.avatar) {
                                if(result2.avatar.indexOf('http') != 0 && result.avatar != "") {
                                    result2.avatar = imgSet(result2.avatar, 300, 375, 3);
                                }
                            } else {
                                result2.avatar = "/common/img/my.png"
                            }

                            if(result3.photo) {
                                if(result3.photo.indexOf('http') != 0 && result.photo != "") {
                                    result3.photo = ApiMaterPlatQiniuDomain + result3.photo;
                                }
                            }

                            if(!result2.sex || result2.sex == 1) {
                                result2.sex = "中性";
                            } else if(result2.sex == 2) {
                                result2.sex = "女"
                            } else if(result2.sex == 3) {
                                result2.sex = "男";
                            }

                            $(".list-member-ul").html(member_issue(result.weid, result2, result3));
                        }
                    });
                    options19.fail(function(error) {
                        window.location.href = "/404";
                    });
                }
            }
        }
    });
    member_options.fail(function(error) {
        console.error(error);
    });
// }