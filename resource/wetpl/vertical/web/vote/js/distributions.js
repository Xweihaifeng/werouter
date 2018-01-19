/**
 * Created by hg on 17-1-13.
 */
$(function(){
    var requestAjax = function(params, type, url, callback, async) {
        $.ajax({
            url: url,
            async: !async,
            type: type,
            data: params,
            dataType: 'json',
            success: function(data){
                callback(data);
            },
            error:function(){
                if(window.console){
                    console.error('*******************************************************************');
                    console.error('on  '+url+'  error');
                }
            }
        });
    };
    //添加商品页面---添加修改配送范围
    //添加配送范围
    $(".set_adr").click(function(){
        floadbox(".roadiomode",{
            width:500,
            height:340
        })
    })
    //设置配送范围模板
    $(".add_mode").click(function(){
        modesetInt();
        floadbox(".modeset",{
            width:500,
            height:390,
            type:1
        })
    });
    //选择模版
    $(document).on("change",".roadiomode input[type = radio][name = distribution ]",function(){
        if ($(this).prop("checked")){
            var str = $.trim($(this).next().next().text());
            if ($("#pro_ship_address").find("p").length>0){
                $("#pro_ship_address").find("p").html(str);
            }else{
                $("#pro_ship_address").prepend("<p>"+str+"</p>");
            }
            if ($("#pro_ship_address").find("input[name='distribution_id']").length>0){
                $("#pro_ship_address").find("input[name='distribution_id']").val($(this).data("val"));
            }else{
                $("#pro_ship_address").find("p").after('<input type="hidden" name="distribution_id" value="'+$(this).data("val")+'"/>');
            }
            $(this).parents(".roadiomode").find("a.close").trigger("click");
        }
    })
    //区域管理页面
    //删除
    $(document).on("click","a.del-dist",function(){
        var id = $(this).parents("dl").data("id");
        var params = {id:id};
        layer.confirm('确认删除模板吗？', {
            btn: ['确认','取消'] //按钮
        },function(){
            var cmd_index = layer.load();
            var callback = function(msg){
                layer.close(cmd_index);
                if(msg.status == 200){
                    layer.msg("删除成功",{shift: -1},function(){
                        window.location.reload();
                    });
                }else{
                    layer.msg(msg.msg,{shift: -1},function(){
                        if(msg.data){
                            window.location.href = msg.data;
                        }
                    });
                }
            }
            requestAjax(params, 'get',del_distributionURL, callback, true);
        },function(){
            layer.close();
        });
    })
    //编辑
    $(document).on("click","a.eidt-dist",function(){
        var id = $(this).parents("dl").data("id");
        $(".setmode_btn").data("id",id);
        var params = {id:id};
        var c_ar = [];
        var get_distributionCallback = function(msg){
            console.log(msg)
            if(msg.result == 0){
                var area = "";
                modesetInt();
                floadbox(".modeset",{
                    width:500,
                    height:390
                })
                $("#modeName").val(msg.data.name)
                address = {};
                for (var x in msg.data.area_ids ){
                    var c_ar = new Array;
                    var pid = x;
                    var evalStr="regionConf.r"+pid+".c";
                    var regionConfs=eval(evalStr);
                    evalStr+=".";
                    for(var key in regionConfs){
                        var name = eval(evalStr+key+".n");
                        var id = eval(evalStr+key+".i");
                        var chkids = msg.data.area_ids[x];
                        if($.inArray(""+id,chkids) != -1){
                            var $li = '<li><span>'+name+'</span><input type="checkbox" checked = true data-pid="'+pid+'" data-id="'+id+'" /></li>';
                            $(".cityul").append($li)
                            c_ar.push(id);
                        }else{
                            var $li = '<li><span>'+name+'</span><input type="checkbox" data-pid="'+pid+'" data-id="'+id+'" /></li>';
                            $(".cityul").append($li)
                        }
                    }
                    allset();
                    address[pid] = c_ar;

                    $(".province input[type=checkbox]").each(function(){
                        if ($(this).data('id') == pid){
                            $(this).attr("checked",true)
                        }
                    })
                }
            }else{
                $.showErr(msg.description,function(){
                    if(msg.data){
                        window.location.href = msg.data;
                    }
                });
            }
        }
        requestAjax(params,'get', get_distributionURL,get_distributionCallback, true);
    })
    //新建模版
    $(".add_mode_btn").click(function(){
        modesetInt();
        floadbox(".modeset",{
            width:500,
            height:390
        })
    });
    //配送范围方法
    //初始
    function modesetInt(){
        $("#modeName").val("");
        $(".province input").attr("checked",false)
        $(".city input[type=checkbox]").attr("checked",false)
        $(".cityul").html("")
    }
    //全选
    function allset(){
        var b = false;
        var allch = $(".cityul").find("input[type=checkbox]");
        allch.each(function(){
            if (!$(this).prop("checked")){
                b = true;
                return false;
            }
        })
        if (b){
            $(".ci_check").prop("checked",false)
        }else{
            $(".ci_check").prop("checked",true)
        }
    }
    $(".ci_check").change(function(){
        $(".cityul").find("input[type=checkbox]").prop("checked",true)
    });

    //保存配送范围模版
    $(".userdist-save-btn").click(function(){
        var page = $(this).data("page")
        var id = $(this).data("id")
        var _this = $(this);
        var modeName = $("#modeName").val()
        if ($.trim(modeName) == ""){
            layer.msg("请填写模板名称");
            return false;
        }
        var address = {};
        $(".city_check:checked").each(function(index,item){
            var pid = $(this).data("pid");
            var id = $(this).val();
            var name = $(this).prev().text();
            if(!address[pid] || address[pid].length == 0){
                address[pid] = [];
            }
            address[pid].push(id);
        })
        if (jQuery.isEmptyObject(address)){
            layer.msg("请选择区域");
            return false;
        }
        var area = "";
        for(var i in address){
            var pid = i;
            var pname = $(".province_check[data-id='"+pid+"']").prev().text();
            var snames = [];
            $(address[pid]).each(function(index,item){
                var name = $(".city_check[value='"+item+"']").prev().text();
                snames.push(name);
            })
            area += pname+"("+snames.join(",")+")";
        }
        //提交服务器
        var params = {name:modeName,area:area,area_ids:address,id:id,_token:$(this).closest(".modal").find("input[name='_token']").val()};
        var save_distributionCallback = function(msg){
            address = {};
            if(msg.status == 200){
                $(".setmode_btn").data("id","");
                _this.prev().trigger("click");
                layer.msg("保存成功",{shift: -1},function(){
                    if(page){
                        window.location.reload();
                    }else{
                        var modeDiv ='<div class="sa_cum">'+
                            '<input type="radio" data-val="'+msg.data+'" name="distribution"/>'+
                            '<h4>'+modeName+'</h4>'+
                            '<div class="address">'+area
                            +'</div></div>';
                        $(".roadiomode .adressall").prepend(modeDiv);
                    }
                });
            }else{
                layer.msg(msg.msg,{shift: -1},function(){
                    if(msg.data){
                        window.location.href = msg.data;
                    }
                });
            }
        }
        requestAjax(params, 'post', save_distributionURL, save_distributionCallback, true);
    });

    //配送范围弹层
    function floadbox(id,set){
        var box = $(id);
        var Dw = $(window).width();
        var Dh = $(window).height();
        if ($(".floadbg").length<=0){
            var bg = $("<div class='floadbg'></div>");
            $("body").append(bg);
            bg.css({"width":Dw + "px","height":Dh + "px"});
        }else{
            $(".floadbg").show();
        }
        box.show();
        box.css({"width":set.width+"px","height":set.height + "px","top":(Dh-set.height)/2 + "px","left":(Dw - set.width)/2 + "px"});
        box.find("a.close").on("click",function(){
            address = {};
            box.hide();
            $(".setmode_btn").data("id","");
            if (set.type != 1){
                $(".floadbg").hide();
            }
        })
    };

    //删除json对像
    function deleteData(json,name) {
        for (var x in json ){
            if (x == name){
                delete json[x];
            }
        }
    }

})
