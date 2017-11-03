/*
*     组织部分数据覆盖
*/

$(function() {

    var channels = window.location.pathname.split('/').slice(1,3);
    // var ApiMaterPlatQiniuDomain = 'http://oty3r3tmi.bkt.clouddn.com/';

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

                    result.thumb_image = imgSet(result.thumb_image, 960, 481, 3);
                    $(".zuzhi-top").css({ "background-image": "url(" + result.thumb_image + ")","background-size": "100% 100%","background-repeat": "no-repeat","background-position": "center" });

                } else if(result.thumb_image.indexOf('http') == 0 && result.thumb_image != "") {

                    $(".zuzhi-top").css({ "background-image": "url(" + result.thumb_image + ")","background-size": "100% 100%","background-repeat": "no-repeat","background-position": "center" });
                }

                if(!result.back_image) {
                    $("#org_bottom_big_img").css({ "background-image": "url('http://images.new.wezchina.com/plat/cert/1505289973450.png')" });

                } else if (result.back_image.indexOf('http') != 0 && result.back_image != "") {

                    result.back_image = imgSet(result.back_image, 960, 380, 3);
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
            // console.log("所有频道文章", data.data);
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

            $.map(data.data, function(item, index) {
                if(item.title == '入会申请') {
                    $(".dier").append(`
                        <p class="title">`+item.title+`</p>
                        <ul id="ruhuishenqing" name="`+item.weid+`"></ul>`
                    );
                    column_rhsq(item.weid, item.thumb_image);
                } else if(item.title == "发展报告") {
                    $(".diyi .title").text(item.title);
                    report(item.weid, item.thumb_image);
                } else if(item.title == "光彩事业") {
                    $(".disan .title").text(item.title);
                    lunbo(item.weid, item.thumb_image);
                } else {
                    if(index <= 8) {
                        $(".shanghuijieshao").append(column_list(item));
                    }
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
                if((!data.data.list || data.data.list.length == 0) && thumb_imgs) {
                    thumb_imgs = imgSet(thumb_imgs, 45, 40, 3);
                    $(".dier #ruhuishenqing").css({"background-image": "url("+ thumb_imgs +")"});
                }

                $.map(data.data.list, function(item, index) {
                    if(index <= 5) {
                        var thumb_image = item.thumb_image;
                        if (thumb_image.indexOf('http') != 0 && thumb_image != "") {
                            thumb_image = imgSet(thumb_image, 34, 34, 3);
                        }
                        var template = `
                        <li>
                            <a href="/org/`+item.weid+`">`
                                if(thumb_image != "") {
                                    template = template + `<img class="iconfont" src="` + thumb_image + `" alt="">`;
                                }
                                template = template + `
                                <p>`+item.title.substr(0, 6)+`</p>
                            </a>
                        </li>`
                        $("#ruhuishenqing").append(template);
                    }
                });
            },
            error: function(xhr){
                console.log(xhr);
            }
        });
    }

    var report = function(bg_weid, thumb_imgs) {
        $.ajax({
            url: apiUrl + "/cms/contents?cate_id=" + bg_weid,
            dataType: 'json',
            success: function(data){
                if((!data.data.list || data.data.list.length == 0) && thumb_imgs) {
                    thumb_imgs = imgSet(thumb_imgs, 45, 40, 3);
                    $(".diyi .report").css({"background-image": "url("+ thumb_imgs +")"});
                }

                $.map(data.data.list, function(item) {
                    var thumb_image = item.thumb_image;
                    if (thumb_image.indexOf('http') != 0 && thumb_image != "") {
                        thumb_image = imgSet(thumb_image, 280, 164, 3);
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
                if((!data.data.list || data.data.list.length == 0) && thumb_imgs) {
                    thumb_imgs = imgSet(thumb_imgs, 45, 40, 3);
                    $(".disan .lunbo").css({"background-image": "url("+ thumb_imgs +")"});
                }

                $.map(data.data.list, function(item) {
                    var thumb_image = item.thumb_image;
                    if (thumb_image.indexOf('http') != 0 && thumb_image != "") {
                        thumb_image = imgSet(thumb_image, 280, 164, 3);
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
            thumb_image = imgSet(thumb_image, 45, 40, 3);
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