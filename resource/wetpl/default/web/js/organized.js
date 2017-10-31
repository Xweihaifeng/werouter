/*
*     组织部分数据覆盖
*/

$(function() {
    var apiUrl = 'http://api.' + window.location.host + "/";
    var channels = window.location.pathname.split('/').slice(1,3);
    var ApiMaterPlatQiniuDomain = 'http://oty3r3tmi.bkt.clouddn.com/';

    // 查询频道
    $.ajax({
        url: apiUrl + "cms/channels/domain_query/org",
        dataType: 'json',
        success: function(data){
            if(data.code == 200) {
                var result = data.data;
                if(!result.thumb_image) {
                    $(".zuzhi-top").css({ "background-image": "url('http://images.new.wezchina.com/plat/cert/1505289973450.png')","background-size": "100% 100%","background-repeat": "no-repeat","background-position": "center" });

                } else if (result.thumb_image.indexOf('http') != 0 && result.thumb_image != "") {

                    result.thumb_image = ApiMaterPlatQiniuDomain + result.thumb_image;
                    $(".zuzhi-top").css({ "background-image": "url(" + result.thumb_image + ")","background-size": "100% 100%","background-repeat": "no-repeat","background-position": "center" });

                } else if(result.thumb_image.indexOf('http') == 0 && result.thumb_image != "") {

                    $(".zuzhi-top").css({ "background-image": "url(" + result.thumb_image + ")","background-size": "100% 100%","background-repeat": "no-repeat","background-position": "center" });
                }

                if(!result.back_image) {
                    $("#org_bottom_big_img").css({ "background-image": "url('http://images.new.wezchina.com/plat/cert/1505289973450.png')" });

                } else if (result.back_image.indexOf('http') != 0 && result.back_image != "") {

                    result.back_image = ApiMaterPlatQiniuDomain + result.back_image;
                    $("#org_bottom_big_img").css({ "background-image": "url(" + result.back_image + ")" });

                } else if(result.back_image.indexOf('http') == 0 && result.back_image != "") {

                    $("#org_bottom_big_img").css({ "background-image": "url(" + result.back_image + ")" });
                }
            }
        },
        error: function(xhr){
            console.log(xhr);
        }
    });

    // 查询组织频道下面所有文章
    $.ajax({
        url: apiUrl + "/cms/contents?channel_id=org",
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
        url: apiUrl + "/cms/channel_categories?channel=org",
        dataType: 'json',
        success: function(data){
            // console.log("所有栏目");
            
            console.log(data.data);
            $.map(data.data, function(item, index) {
                if(item.title == '入会申请') {
                    $(".dier").append(`
                        <p class="title">`+item.title+`</p>
                        <ul class="row" name="`+item.weid+`"></ul>`
                    );
                    column_rhsq(item.weid);
                } else if(item.title == "发展报告") {
                    $(".diyi .title").text(item.title);
                    report(item.weid);
                } else if(item.title == "光彩事业") {
                    $(".disan .title").text(item.title);
                    lunbo(item.weid);
                } else {
                    if(index <= 8) {
                        console.log("data=", item +", "+ index)
                        $(".shanghuijieshao").append(column_list(item));
                    }
                    // debugger;
                }
            });

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
            url: apiUrl + "/cms/contents?cate_id=" + name,
            dataType: 'json',
            success: function(data){
                $.map(data.data.list, function(item) {
                    $(".list_selected").append(`
                        <a href="/org/`+item.weid+`">
                            <i class="iconfont">&#xe61a;</i>`+item.title.substr(0, 4)+`
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
            url: apiUrl + "/cms/contents?cate_id=" + data,
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

    var report = function(bg_weid) {
        $.ajax({
            url: apiUrl + "/cms/contents?cate_id=" + bg_weid,
            dataType: 'json',
            success: function(data){

                $.map(data.data.list, function(item) {
                    var thumb_image = item.thumb_image;
                    if (thumb_image.indexOf('http') != 0 && thumb_image != "") {
                        thumb_image = ApiMaterPlatQiniuDomain + thumb_image;
                    }
                    var template = `
                    <div class="swiper-slide">`
                        if(thumb_image != "") {
                            template = template + `<img class="iconfont" src="` + thumb_image + `" alt="">`;
                        }
                        template = template + `
                        <a href="/org/`+item.weid+`" class="a btn-look">点击查看</a>
                    </div>`;
                    $(".report_swiper").append(template);
                })

                var mySwiper10 = new Swiper (".swiper-report", {
                    pagination: '.pagination-report',
                    direction: 'vertical',
                    autoplay: 3000,
                    speed: 1000,
                    loop : true,
                    paginationClickable: true,
                    autoplayDisableOnInteraction : false
                })
            },
            error: function(xhr){
                console.log(xhr);
            }
        })
    }

    var lunbo = function(gc_weid) {
        $.ajax({
            url: apiUrl + "/cms/contents?cate_id=" + gc_weid,
            dataType: 'json',
            success: function(data){

                $.map(data.data.list, function(item) {
                    var thumb_image = item.thumb_image;
                    if (thumb_image.indexOf('http') != 0 && thumb_image != "") {
                        thumb_image = ApiMaterPlatQiniuDomain + thumb_image;
                    }
                    var template = `
                    <div class="swiper-slide">`
                        if(thumb_image != "") {
                            template = template + `<img class="iconfont" src="` + thumb_image + `" alt="">`;
                        }
                        template = template + `
                        <a href="/org/`+item.weid+`" class="a btn-info">点击查看</a>
                    </div>`;
                    $(".lunbo_swiper").append(template);
                })

                var mySwiper9 = new Swiper (".swiper-nested", {
                    pagination: '.pagination-nested',
                    direction: 'horizontal',
                    autoplay: 3000,
                    speed: 1000,
                    loop : true,
                    paginationClickable: true,
                    autoplayDisableOnInteraction : false
                })
            },
            error: function(xhr){
                console.log(xhr);
            }
        })
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