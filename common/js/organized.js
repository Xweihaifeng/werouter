/*
*     组织部分数据覆盖
*/

    var token = window.localStorage.getItem('token');
    var channels = window.location.pathname.split('/').slice(1,3);
    var domain_weid = '';

    $.ajax({
        url: CMS_CHANNELS_DOMAIN_QUERY + 'org',
        dataType: 'json',
        async: false,
        success: function(data){
            if(data.code === 200) {
                console.log(data.data);
                domain_weid = data.data.weid;
            } else {
                console.error(data.message);
            }
        }
    });

    // 查询频道
    $.ajax({
        url: apiUrl + "cms/channels/domain_query/org",
        dataType: 'json',
        success: function(data){
            if(data.code == 200) {
                var result = data.data;
                if(!result.thumb_image) {
                    $(".zuzhi-top").css({ "background-image": "url('/common/img/1505289973450.png')","background-size": "100% 100%","background-repeat": "no-repeat","background-position": "center" });

                } else if (result.thumb_image.indexOf('http') != 0 && result.thumb_image != "") {

                    result.thumb_image = imgSet(result.thumb_image, 960, 481, 3);
                    $(".zuzhi-top").css({ "background-image": "url(" + result.thumb_image + ")","background-size": "100% 100%","background-repeat": "no-repeat","background-position": "center" });

                } else if(result.thumb_image.indexOf('http') == 0 && result.thumb_image != "") {

                    $(".zuzhi-top").css({ "background-image": "url(" + result.thumb_image + ")","background-size": "100% 100%","background-repeat": "no-repeat","background-position": "center" });
                }

                if(!result.back_image) {
                    $("#org_bottom_big_img").css({ "background-image": "url('/common/img/1505289973450.png')" });

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

    // 入会申请
    function column_rhsq(data, thumb_imgs) {
        if((!data || data.length == 0) && thumb_imgs) {
            thumb_imgs = imgSet(thumb_imgs, 45, 40, 3);
            $(".dier #ruhuishenqing").css({"background-image": "url("+ thumb_imgs +")"});
        }

        var thumb_image = data.thumb_image;
        if (thumb_image.indexOf('http') != 0 && thumb_image != "") {
            thumb_image = imgSet(thumb_image, 34, 34, 3);
        }
        var template = `
        <li>
            <a href="/org/`+ data.domain +`">`
                if(thumb_image != "") {
                    template = template + `<img class="iconfont" src="`+ thumb_image +`" alt="">`;
                }
                template = template + `
                <p>`+ data.title.substr(0, 6) +`</p>
            </a>
        </li>`
        $("#ruhuishenqing").append(template);
    }

    // 下方三模块筛选
    function cont_two(this_weid_two, name) {
        $.ajax({
            url: apiUrl + "cms/cate_categories?cate=" + this_weid_two,
            dataType: 'json',
            success: function(data){
                if(data.code == 200) {
                    var result = data.data;
                    result.forEach(function(value, index) {
                        column_rhsq(value, value.thumb_imgs)
                    });
                }
            },
            error: function(xhr){
                console.log(xhr);
            }
        })
    }

    var options12 = $.get(apiUrl + "cms/org_advs");
    options12.done(function(data) {
        if(data.code == 200) {
            if(!data.data.org_left) {
                return false
            } else {
                var resultx = data.data.org_left;
                var org_left = function(result) {
                    var template = '';
                    result.forEach(function(value, index) {
                        var image = value.image;
                        if (image.indexOf('http') != 0 && image != "") {
                            image = imgSet(image, 280, 164, 3);
                        }
                        template += `
                        <div title="`+ value.title +`">
                            <img class="iconfont" src="`+ image +`">
                            <a href="`+ value.url +`" class="a btn-info">点击查看</a>
                        </div>`;
                    });

                    return template;
                }

                $(".report").html(`
                    <div class="layui-carousel" id="test10" lay-filter="test10">
                        <div carousel-item="">`+ org_left(resultx) +`</div>
                    </div>
                `)
            }

            if(!data.data.org_right) {
                return false
            } else {
                var resulty = data.data.org_right;
                var org_right = function(result) {
                    var template = '';
                    result.forEach(function(value, index) {
                        var image = value.image;
                        if (image.indexOf('http') != 0 && image != "") {
                            image = imgSet(image, 280, 164, 3);
                        }
                        template += `
                        <div title="`+ value.title +`">
                            <img class="iconfont" src="`+ image +`">
                            <a href="`+ value.url +`" class="a btn-look">点击查看</a>
                        </div>`;
                    });

                    return template;
                }

                $(".lunbo").html(`
                    <div class="layui-carousel" id="test11" lay-filter="test11">
                        <div carousel-item="">`+ org_right(resulty) +`</div>
                    </div>
                `)
            }

            layui.use(['carousel', 'form'], function(){
                var carousel = layui.carousel,
                form = layui.form;
             
                //图片轮播
                carousel.render({
                    elem: '#test10',
                    width: '280px',
                    height: '164px',
                    interval: 4000,
                });

                carousel.render({
                    elem: '#test11',
                    width: '280px',
                    height: '164px',
                    interval: 4000,
                });

                carousel.on('change(test10)', function(obj){
                    // console.log(obj.index); //当前条目的索引
                    $(".diyi .title").text(obj.item[0].title)
                });

                carousel.on('change(test11)', function(obj){
                    // console.log(obj.index); //当前条目的索引
                    $(".disan .title").text(obj.item[0].title)
                });
            });
        }
    });
    options12.fail(function(error) {
        console.error(error);
    });

    // 组织一级分类
    var column_list = function(data) {
        var thumb_image = data.thumb_image;
        if (thumb_image.indexOf('http') != 0 && thumb_image != "") {
            thumb_image = imgSet(thumb_image, 45, 40, 3);
        }

        var template2 = function(children) {
            // children = children.reverse();
            var template21 = '';
            $.map(children, function(value, key) {
                if(value.index_show == 1) {
                    template21 += `<a href="/org/`+ value.domain +`"> <i class="iconfont">&#xe61a;</i>`+ value.title +` </a>`
                }
            });
            return template21;
        }

        var template = `
        <div class="list diyidier" name="`+ data.domain +`">
            <a href="/org/`+ data.domain +`">
                <p>`+ data.title +`</p>`;
                if(thumb_image != "") {
                    template = template + `<img class="iconfont" src="`+ thumb_image +`" alt="">`;
                }

                template = template + `
                
            </a>
            <div class="sub" id="`+ data.domain +`">`+ template2(data.children) +`</div>
        </div>`
        return template;
    };

    // 查询组织栏目分类
    $.ajax({
        url: apiUrl + "cms/cate_tree_by_channel?channel=" + domain_weid,
        dataType: 'json',
        success: function(data){
            console.log(data.data);
            data.data.forEach(function(item, index) {
                if(item.title == '入会申请') {
                    $(".dier").append(`
                        <p class="title">`+ item.title +`</p>
                        <ul id="ruhuishenqing" name="`+ item.weid +`"></ul>`
                    );
                    cont_two(item.weid, "rhsq");
                } else {
                    if(item.index_show == 1) {
                        var i = 0;
                        if(i <= 8) {
                            $(".shanghuijieshao").append(column_list(item));
                            i++;
                        }
                    }
                }
            });

            // 移入加载栏目分类
            $(".list").hover(function() {
                $(this).find(".sub").addClass("list_selected").show();
            },function() {
                $(this).find(".sub").removeClass("list_selected").hide();
            });
        },
        error: function(xhr){
            console.log(xhr);
        }
    });