//获取通用用户信息
const showUserInfo = (data) => {

    let favicon = ApiMaterPlatQiniuDomain + localStorage.getItem('fav');
    $('#favicon').attr('href', favicon);

    let user = data.plats_domian;
    let domain = user.domain;
    let info = data.plats_user;
    let weid = user.plat_user_id;
    let imgUrl = info.avatar;
    if ((imgUrl != null && imgUrl != "") && imgUrl.indexOf('http') === -1){
        imgUrl = ApiMaterPlatQiniuDomain + imgUrl;
        $("#head-icon, .user-head").css({
            "background": "url(" + imgUrl + ") no-repeat center",
            "background-size": "100%"
        });
    } else {
        if (imgUrl != null && imgUrl != "") {
            $("#head-icon, .user-head").css({
                "background": "url(" + imgUrl + ") no-repeat center",
                "background-size": "110%"
            });
        } else {
            $("#head-icon, .user-head").css({
                "background": "url(/common/img/avatar.png) no-repeat center",
                "background-size": "110%"
            });
        }
    }

    let list = [{id: 'article', val: '文章'}, {id: 'project', val: '项目'}, {id: 'activity', val: '活动'}, {id: 'wemall', val: '商城'}, {id: 'quan', val: '圈子'}];
    let type = window.location.pathname.split('/').pop();
    let has = list.filter(x => x.id == type);
    let name;
    if (has != '') {
        name = list.filter(x => x.id == type)[0].val;
    } else {
        name = info.nickname;
    }

    if (info.nickname != null) {
        $(".line-0").html(
            info.nickname + '<img class="rz" src="/common/img/vrenzheng.png" alt="">' +
            '<div class="collection"><img class="ct" src="/common/img/collect.svg" alt=""/><span class="wd">关注</span></div>'
        );
        $('title').text(name + '-' + info.nickname + '的官方微主页');
    } else {
        if (info.real_name != null) {
            $(".line-0").html(
                info.nickname + '<img class="rz" src="/common/img/vrenzheng.png" alt="">' +
                '<div class="collection"><img class="ct" src="/common/img/collect.svg" alt=""/><span class="wd">关注</span></div>'
            );
            $('title').text(name + '-' + info.real_name + '的官方微主页');
        } else {
            $(".line-0").html(
                localStorage.getItem('title') + '官方微主页' + '<img src="/common/img/vrenzheng.png" alt="">'
            );
            $('title').text(name + '-' + localStorage.getItem('title') + '官方微主页');
        }
    }
    if(info.motto!=null && info.motto!=""){
        $(".oline-2").find("span").eq(1).text(info.motto);

    }else{
        $(".oline-2").find("span").eq(1).text("暂无介绍");
    }
    $(".line-1").text(info.motto);
    // $(".oline-2").find("span").eq(1).text(info.motto);
    $(".user-cnt").text(info.real_name);

    //TA的粉丝/TA他的关注
    var listTpl = function(cid, data) {
        //let avatar = apiUrl + data.avatar;
        let domain = data.domain;
        let member = data.member_weid;
        if (domain == null || domain == '') {
            if (member == null || member == '') {
                domain = '';
            } else {
                domain = '/u/' + member;
            }
        }
        let avatar = '';
        let nickname = ''
        if (data.nickname != null) {
            nickname = data.nickname;
        }
        if (data.avatar != null) {
            avatar = ApiMaterPlatQiniuDomain + data.avatar;
        } else {
            avatar = '/common/img/page.png';
        }
        let tpl = `
            <div class="${cid}" title="${nickname}">
                <img id="${domain}" style="border: 1px solid #ccc; border-radius: 50%; height: 100%;  width: 100%; " src="${avatar}" width="54" />
            </div>
        `
        return tpl;
    }

    var genFans = function(url, domain, page, limit, type) {
        $.ajax({
            url: url + '?domain=' + domain + '&page=' + page + '&limit=' + limit + '&type=' + type,
            type: 'GET',
            headers: {
                'Token': window.localStorage.getItem("token")
            },
            success: function (data) {
                console.log(data)
                $(".fans").html(`<a>Ta的粉丝(${data.data.list.length})</a>`);
                //$(".friends").html(`<a>Ta的关注(${data.data.gnums})</a>`);
                $("#fans").html('');
                //$("#friends").html('');
                data.data.list.map(x => $("#fans").append(listTpl('fans-head', x)));
                //data.data.glist.map(x => $("#friends").append(listTpl('friends-head', x)));
            }
        })
    }

    //关注
    var follow = function(url) {
        $.ajax({
            url: url,
            type: 'POST',
            data: {
                'domain': domain,
                'type': 2
            },
            headers: {
                'Token': window.localStorage.getItem("token")
            },
            success: function(data) {
                console.log(data)
                if (data.code == 200) {
                    $(".ct").attr('src', '/common/img/collected.svg');
                    $(".wd").text('已关注');
                    layer.msg("关注成功", {
                        time: 1500
                    });
                    genFans(apiUrl + 'circel/flist', domain, 1, 12, 1);
                } else {
                    layer.msg(data.message, {
                        time: 1500
                    })
                }
            },
            error: function(xhr) {
                console.log(xhr)
            }
        })
    }

    //取消关注
    var cancelFollow = function(url) {
        $.ajax({
            url: url,
            type: 'POST',
            data: {
                'domain': domain,
                'type': 2
            },
            headers: {
                'Token': window.localStorage.getItem("token")
            },
            success: function(data) {
                console.log(data)
                if (data.code == 200) {
                    $(".ct").attr('src', '/common/img/collect.svg');
                    $(".wd").text('关注');
                    layer.msg("取消关注成功", {
                        time: 1500
                    })
                    genFans(apiUrl + 'circel/flist', domain, 1, 12, 1);
                } else {
                    console.log(data.message)
                }
            },
            error: function(xhr) {
                console.log(xhr)
            }
        })
    }

    //数据分页
    var reqUrl = apiUrl + 'circel/flist';
    var pages = function(url, domain, type, page, limit) {
        $.ajax({
            url: url + '?domain=' + domain + '&page=' + page + '&type=' + type + '&limit=' + limit,
            type: 'GET',
            headers: {
                'Token': window.localStorage.getItem("token")
            },
            success: function (data) {
                let totalPage = data.data.params.pageCount;
                if (page <= totalPage) {
                    if (type == 1) {
                        sessionStorage.setItem('fansPages', page + 1);
                        data.data.list.map(x => $("#fans").append(listTpl('fans-head', x)));
                    } else {
                        sessionStorage.setItem('friendsPages', page + 1);
                        data.data.list.map(x => $("#friends").append(listTpl('friends-head', x)));
                    }
                } else {
                    $("#more").text("没有更多");
                }
            }
        })
    }

    $("#more").click(function(){
        let state = $(".fans").attr("class").indexOf('active');
        let domain = window.location.pathname.split('/').slice(1, 2)[0];
        if (state != -1) {
            //'fans' 请求fans分页
            let page = sessionStorage.getItem('fansPages')
            pages(reqUrl, domain, 1, page, 12);
        } else {
            //'friends'
            let page = sessionStorage.getItem('friendsPages')
            pages(reqUrl, domain, 2, page, 12);
        }
    })

    //写入圈子页面数据
    var genListTpl = function(url) {
        $.ajax({
            url: url,
            type: 'GET',
            headers: {
                'Token': window.localStorage.getItem("token")
            },
            success: function(data) {
                console.log(data)
                if (data.code == 200) {
                    var isLike;
                    var isFollow = data.data.if_follow;
                    if (isFollow == 0) {
                        isLike = false;
                    } else if (isFollow == 1) {
                        isLike = true;
                        $(".ct").attr('src', '/common/img/collected.svg');
                        $(".wd").text('已关注');
                    }
                    $(".user-art").children('div:eq(0)').text(data.data.article_count);
                    $(".user-proj").children('div:eq(0)').text(data.data.project_count);
                    $(".user-type").children('div:eq(0)').text(data.data.activity_count);
                    if (data.data.userPageInfo.province != null) {
                        $(".oline-1 p").text(data.data.userPageInfo.province + ' ' + data.data.userPageInfo.city);
                    }

                    let m = 1; //倍率
                    let n = 10; //时间
                    let i = 0;
                    let nums = data.data.wnums;
                    var computeTime = function(sum, time) {
                        if (sum > (time * 1000 / n)) {
                            m = parseInt(sum / (time * 1000 / n));
                        }
                    }

                    var numbers = setInterval(function(){
                        if (i < nums) {
                            /*if ((nums - i) < parseInt(nums / 30)) {
                                wefriends(i, []);
                                i += parseInt(m / 20);
                            } else {*/
                                wefriends(i, []);
                                i += m;
                            //}
                        } else {
                            wefriends(nums, []);
                            clearInterval(numbers);
                        }
                    }, n);

                    computeTime(nums, 4);
                    $(".fans").html(`<a>Ta的粉丝(${data.data.fnums})</a>`);
                    $(".friends").html(`<a>Ta的关注(${data.data.gnums})</a>`);
                    data.data.flist.map(x => $("#fans").append(listTpl('fans-head', x)));
                    data.data.glist.map(x => $("#friends").append(listTpl('friends-head', x)));
                    sessionStorage.setItem('fansPages', 2);
                    sessionStorage.setItem('friendsPages', 2);

                    $(".fans-head, .friends-head").click(function(e){
                        let domain = $(e.target).attr('id');
                        if (domain != '') {
                            window.location.href = '/' + domain;
                        }
                        //console.log(domain);
                    });

                    //关注
                    $(".line-0").click(function(e){
                        var ls = ['ct', 'wd', 'collection'];
                        var cid = $(e.target).attr('class');
                        if (ls.indexOf(cid) != -1) {
                            if(isFollow == -1) {
                                $("#modal_login").fadeIn(300);
                            } else {
                                if (!isLike) {
                                    isLike = true;
                                    follow(apiUrl + 'circel/relationship');
                                } else {
                                    isLike = false;
                                    cancelFollow(apiUrl + 'circel/quxiao');
                                }
                            }
                        }
                    })
                }
            },
            error: function(xhr) {
                console.log(xhr)
            }
        })
    }

    //微友
    var wefriends = function(nums, res) {
        let n = parseInt(nums);
        nums = nums + '';
        let len = nums.length;
        if (len == 0) {
            $(".red").html(res.reverse().join(''));
        } else {
            res.push(`<li>${n % 10}</li>`);
            wefriends(nums.substr(0, len - 1), res);
        }
    }

    genListTpl(apiUrl + 'circel/index?domain=' + domain);
}

showUserInfo(wezchina_plats)






