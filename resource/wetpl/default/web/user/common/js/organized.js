/*
*     组织部分数据覆盖
*/

$(function() {

    var pindao = window.location.pathname.split('/').slice(1,2)[0];
    var pindao = window.location.pathname.split('/').slice(2,3)[0];
    var ApiMaterPlatQiniuDomain = 'http://oty3r3tmi.bkt.clouddn.com/';

    // 查询频道
    $.ajax({
        url: "http://apitest.wezchina.com/cms/channels",
        dataType: 'json',
        success: function(data){
            // console.log("所有频道");
            console.log(data.data);
        },
        error: function(xhr){
            console.log(xhr);
        }
    });

    // 查询组织频道下面所有文章
    $.ajax({
        url: "http://apitest.wezchina.com/cms/contents?channel_id=9fa0bea0-7d7f-11e7-92a8-6585efb9cefe",
        dataType: 'json',
        success: function(data){
            // console.log("所有频道文章");
            console.log(data.data);
        },
        error: function(xhr){
            console.log(xhr);
        }
    });

    // 查询组织栏目分类
    $.ajax({
        url: "http://apitest.wezchina.com/cms/channel_categories?channel=9fa0bea0-7d7f-11e7-92a8-6585efb9cefe",
        dataType: 'json',
        success: function(data){
            // console.log("所有栏目");
            console.log(data.data);
            $.map(data.data, function(item) {
                if(item.title == '入会申请') {
                    $(".dier").append(`
                        <p class="title">`+item.title+`</p>
                        <ul class="row" name="`+item.weid+`"></ul>`
                    );
                    column_rhsq(item.weid);
                } else if(item.title == "发展报告") {
                    $(".diyi").append(`
                        <p class="title">`+item.title+`</p>
                        <img src="/common/img/zuzhi-img.png" alt="">
                        <button class="btn-look">点击查看</button>`
                    );
                } else if(item.title == "光彩事业") {
                    $(".disan .title").text(item.title);
                } else {
                    $(".shanghuijieshao").append(column_list(item));
                }
            });

            background = ["rgba(42,104,149,.9)", "rgba(41, 122, 137, 0.9)", "rgba(84,137,174,.9)", "rgba(113,166,81,.9)"]

            $(".list:even").each(function(index, doms) {
                // console.log("偶数");
            })

            $(".list:odd").each(function(index, doms) {
                // console.log("奇数");
            })

            // 移入加载栏目分类
            $(".list").hover(function() {
                $(this).find(".sub").addClass("list_selected").fadeIn(100);
                var name = $(this).attr("name");
                $(".list_selected").html("");
                list_name(name);

            },function() {
                $(this).find(".sub").removeClass("list_selected").fadeOut(500);
            });

        },
        error: function(xhr){
            console.log(xhr);
        }
    });

    // 查询栏目分类所有文章
    function list_name(name) {
        $.ajax({
            url: "http://apitest.wezchina.com/cms/contents?cate_id=" + name,
            dataType: 'json',
            success: function(data){
                $.map(data.data.list, function(item) {
                    $(".list_selected").append(`
                        <a href="/org/`+item.weid+`">
                            <i class="iconfont">&#xe61a;</i>`+item.title+`
                        </a>`);
                });
            },
            error: function(xhr){
                console.log(xhr);
            }
        });
    }

    var column_rhsq = function(data) {
        $.ajax({
            url: "http://apitest.wezchina.com/cms/contents?cate_id=" + data,
            dataType: 'json',
            success: function(data){
                $.map(data.data.list, function(item) {
                    var thumb_image = item.thumb_image;
                    if (thumb_image.indexOf('http') != 0 && thumb_image != "") {
                        thumb_image = ApiMaterPlatQiniuDomain + thumb_image;
                    }
                    var template = `
                        <li>
                            <a href="/org/`+item.weid+`">`
                                if(thumb_image != "") {
                                    template = template + `<img class="iconfont" src="` + thumb_image + `" alt="">`;
                                }
                                template = template + `
                                <p>`+item.title+`</p>
                            </a>
                        </li>`
                    $(".row").append(template);
                });
            },
            error: function(xhr){
                console.log(xhr);
            }
        });
    }

    var column_list = function(data) {
        var thumb_image = data.thumb_image;
        if (thumb_image.indexOf('http') != 0 && thumb_image != "") {
            thumb_image = ApiMaterPlatQiniuDomain + thumb_image;
        }
        var template = `
        <div class="list diyidier" name="`+data.domain+`">
            <a href="/org/`+data.domain+`">
                <p>`+data.title+`</p>`;
                if(thumb_image != "") {
                    template = template + `<img class="iconfont" src="` + thumb_image + `" alt="">`;
                }
                template = template + `

            </a>
            <div class="sub">
                <a href="/org/`+data.weid+`">
                    <i class="iconfont">&#xe61a;</i>`+data.title+`
                </a>
            </div>
        </div>`
        return template;
    };

});
