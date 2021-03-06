$(function() {
    //列表数据接口
    var ajaxUrl = $('#J_GetEntryListUrl').val();
    //通过请求接口
    var ajaxPassUrl = $('#J_PassUrl').val();
    //拒绝请求接口
    var ajaxRefuseUrl = $('#J_RefusetUrl').val();
    //搜索条件对象
    var searchObj = {
        page: 1,
        filter: 'name'
    };
    //搜索类型对象
    var typeObj = {
        name: '姓名',
        mobile: '手机'
    };
    var lastPage = searchObj.page;
    //防重复提交标志
    var repeatFlag = false;
    //通过数据
    var passData = {
        flag: 0,
        content: ''
    };
    //拒绝数据
    var refuseData = {
        flag: 0,
        content: ''
    };

    var NOTICE_ANIM_TIME = 500;

    var $pagination = $('.pagination ul');
    var entry = {
        init: function() {
            var _self = this;
            common.init();
            chart.init();
            this.initPaginator();
            template.config('openTag', '((');
            template.config('closeTag', '))');
            //绑定搜索按钮
            $('#J_BtnSearchEntry').click(function() {
                _self.search();
            });

            $('#J_SearchType').on('mouseover', function(){
                $(this).addClass('hover');
            });
            $('#J_SearchType').on('mouseleave', function(){
                $(this).removeClass('hover');
            });

            $('.J_SearchOtherType').click(function(){
                var other = $('.J_SearchSelectedType').data('type');
                var selected = $(this).data('type');
                //交换选中和未选中的值
                $('.J_SearchSelectedType').data('type', selected);
                $('.J_SearchSelectedType>span').text(typeObj[selected]);
                $(this).data('type', other);
                $(this).text(typeObj[other]);

                if(selected == 'mobile'){
                    $('#J_InputSearchCondition').attr('placeholder', '请输入手机号后4位');
                    $('#J_InputSearchCondition').val('');
                }else{
                    $('#J_InputSearchCondition').attr('placeholder', '请输入用户姓名');
                    $('#J_InputSearchCondition').val('');
                }
                //修改筛选条件
                searchObj.filter = selected;
                //隐藏
                $('#J_SearchType').removeClass('hover');
            });
            _self.bindRefuseDialogEvent();

            _self.getEntryList();
        },
        initPaginator: function() {
            var _self = this;
            var total = parseInt($('.pagination').data('total'), 10);
            var size = parseInt($('.pagination').data('size'), 10);
            $pagination.jqPaginator({
                totalCounts: total,
                pageSize: size,
                currentPage: searchObj.page,
                onPageChange: function(page, type) {
                    lastPage = searchObj.page;
                    searchObj.page = page;
                    if (type == 'change') {
                        _self.getEntryList();
                    }
                }
            });
        },
        //获取报名人员列表
        getEntryList: function() {
            var _self = this;
            $.ajax({
                url: ajaxUrl,
                data: searchObj,
                type: 'get',
                dataType: 'json',
                success: function (res) {
                    if (res.status) {
                        _self.createHtml(res.data);
                    } else {
                        notice.alert(res.msg, null, NOTICE_ANIM_TIME);
                        _self.resetPagination();
                    }

                    //add by wxz【用于融资活动】
                    $('.J_CkbAll').change(function() {
                        var chk = this.checked;
                        $('.J_CkbItem').each(function() {
                            if ($(this).attr('disabled') == undefined) {
                                this.checked = chk;
                                if(chk){
                                    $('.operation .del').css('color','#E85349');
                                    $('.operation .del').css('border','2px solid #E85349');
                                }else{
                                     $('.operation .del').css('color','#b4bbc2');
                                    $('.operation .del').css('border','2px solid #b4bbc2');
                                }
                            }
                        })
                    });
                    $('.J_CkbItem').bind('change',function() {
                        var chk = this.checked;
                           if(chk){
                                $('.operation .del').css('color','#E85349');
                                $('.operation .del').css('border','2px solid #E85349');
                           }else{
                                $('.operation .del').css('color','#b4bbc2');
                                $('.operation .del').css('border','2px solid #b4bbc2');
                           }
                        $('.J_CkbAll').get(0).checked = chk;
                    });
                },
                error: function (xhr, code, error) {
                    notice.alert(error, null, NOTICE_ANIM_TIME);
                    _self.resetPagination();
                },
                complete: function () {
                    $('.J_LoadList').hide();
                }
            });
        },
        resetPagination: function(){
            searchObj.page = lastPage;
            $pagination.jqPaginator('option', {currentPage:lastPage});
        },
        //创建节点数据
        createHtml: function(data) {
            var $html = $(template('J_TmplEntry', {
                list: data,
                page: searchObj.page,
                ticketType: $('#J_TicketType').val()
            }));
            this.bindPassEvent($html);
            this.bindRefuseEvent($html);
            $('.J_EntryList').html($html);
        },
        bindPassEvent:function($node){
            var _self = this;
            $node.find('.J_Pass').click(function() {
                _self.passEvent(this);
            });
        },
        //绑定拒绝按钮
        bindRefuseEvent: function($node) {
            var _self = this;
            $node.find('.J_Refuse').click(function() {
                _self.refuseEvent(this);
            });
        },
        //绑定拒绝弹窗里面的时间
        bindRefuseDialogEvent: function() {
            var _self = this;
            $('#J_BtnRefuseSure').click(function() {
                _self.refuse();
            });
            $('#J_CheckboxRefuse').change(function() {
                $('#J_RefuseMessage').slideToggle();
            });
        },
        //通过按钮事件
        passEvent: function(node) {
            var $tr = $(node).parents('tr');
            passData.id = $tr.data('id');
            common.loading('审核中...', function(hideLoading) {
                $.ajax({
                    url: ajaxPassUrl,
                    data: passData,
                    type: 'post',
                    dataType: 'json',
                    success: function(res) {
                        if (res.status==1000) {
                            $('tr[data-id="' + passData.id + '"]').children('.operate').html('<span>已通过</span>');
                        }else{
                             notice.alert(res.msg);
                        }
                    },
                    error: function(xhr, code, error) {
                        notice.alert(error);
                    },
                    complete: function() {
                        $('.backdrop').css('zIndex', 1000);
                        repeatFlag = false;
                        hideLoading();
                    }
                });
            });
        },
        //拒绝按钮事件
        refuseEvent: function(node) {
            var $tr = $(node).parents('tr');
            refuseData.id = $tr.data('id');
            refuseData.name = $tr.find('.username').text();
            refuseData.title = $('#J_ActivityTitle').text();
            refuseData.mobile = $tr.find('.mobile').text();
            $('.J_RefuseName').text(refuseData.name);
            $('#J_InputRefuseMessage').val('');
            $('#J_RefuseReason').html('<span style="line-height:20px;color:#555">当前理由为空，对方将会收到如下短信:<br/>'+$tr.find('.username').text()+'，你的【'+$('#J_ActivityTitle').text()+'】报名未通过审核</span>');
            dialog.show('#J_DialogRefuse');
        },
        //拒绝方法
        refuse: function() {
            if (repeatFlag) return false;
            repeatFlag = true;
            //refuseData.flag = $('#J_CheckboxRefuse').get(0).checked ? 1 : 0;
            refuseData.content = $('#J_InputRefuseMessage').val();
            // if (refuseData.flag && !refuseData.content) {
            //     notice.alert('拒绝内容不能为空');
            //     $('#J_InputRefuseMessage').focus();
            //     repeatFlag = false;
            //     return false;
            // }
            $('.backdrop').css('zIndex', 1002);
            common.loading('拒绝中...', function(hideLoading) {
                $.ajax({
                    url: ajaxRefuseUrl,
                    data: refuseData,
                    type: 'post',
                    dataType: 'json',
                    success: function(res) {
                        dialog.close($('#J_DialogRefuse'));
                        if (res.status==1000) {
                            $('tr[data-id="' + refuseData.id + '"]').children('.operate').html('<span>已拒绝</span>');
                        }else{
                            notice.alert(res.msg);
                        }

                    },
                    error: function(xhr, code, error) {
                        notice.alert(error);
                    },
                    complete: function() {
                        $('.backdrop').css('zIndex', 1000);
                        repeatFlag = false;
                        hideLoading();
                    }
                });
            });
        },
        //搜索手机号码
        search: function() {
            var _self = this;
            var condition = $('#J_InputSearchCondition').val();
            if(condition){
                $pagination.hide();
            }else{
                $('.J_EntryList').html('');
                $('.J_LoadList').show();
                $pagination.show();
            }
            if (searchObj.type == 'mobile' && isNaN(condition)){
                notice.alert('请输入正确的手机尾号数字', null, NOTICE_ANIM_TIME);
            }
            else if (searchObj.type == 'mobile' && condition.length != 4) {
                notice.alert('请输入手机号的最后四位数', null, NOTICE_ANIM_TIME);
            }
            else {
                searchObj.page = 1;
                searchObj.condition = condition;
                _self.getEntryList(function(data) {
                    $('.J_EntryList').html('');
                    _self.createHtml(data);
                });
            }
            $('#J_InputSearchCondition').focus();
        }
    };


    var chart = {
        init: function() {
            var _self = this;
            this.getData(function(data) {
                _self.createChartCity(data.city);
                _self.createChartPosition(data.position);
                _self.createChartTimeLine(data.timeline);
            });
        },
        getData: function(callback) {
            var _self = this;
            var url = $('#J_GetChartDataUrl').val();
            $.ajax({
                url: url,
                type: 'get',
                dataType: 'json',
                success: function(res) {
                    if (res.status) {
                        var data = _self.formatData(res.data);
                        callback && callback(data);
                    } else {
                        $('.data').hide();
                    }
                },
                error: function(xhr, code, error) {
                     // notice.alert(error);
                },
                complete: function() {}
            });
        },
        formatData: function(data) {
            var colors = ['#24aa98', '#65abd0', '#d9c26c', '#db7560', '#af6dd5', '#898e93', '#32b9e6', '#8cbe52', '#ffab27', '#c88b76'];
            var tmp = {
                city: [],
                position: [],
                timeline: {
                    labels: [],
                    datasets: [{
                        label: "报名数据",
                        fillColor: "rgba(151,187,205,0.2)",
                        strokeColor: "rgba(151,187,205,1)",
                        pointColor: "rgba(151,187,205,1)",
                        pointStrokeColor: "#fff",
                        pointHighlightFill: "#fff",
                        pointHighlightStroke: "rgba(151,187,205,1)",
                        data: []
                    }]
                }
            };
            for (var i = 0; i < data['city'].length; i++) {
                var city = data['city'][i];
                tmp.city.push({
                    value: city.value,
                    color: colors[i],
                    highlight: colors[i],
                    label: city.name
                });
            };
            for (var i = 0; i < data['position'].length; i++) {
                var position = data['position'][i];
                tmp.position.push({
                    value: position.value,
                    color: colors[i],
                    highlight: colors[i],
                    label: position.name
                });
            };
            for (var i = 0; i < data['timeline'].length; i++) {
                var time = data['timeline'][i];
                tmp.timeline.labels.push(time.name);
                tmp.timeline.datasets[0].data.push(time.value);
            }
            return tmp;
        },
        createChartCity: function(data) {
            this.createDoughnut('J_ChartCity', data);
            this.createList('J_ListCity', data);
        },
        createChartPosition: function(data) {
            this.createDoughnut('J_ChartPosition', data);
            this.createList('J_ListPosition', data);
        },
        createChartTimeLine: function(data) {
            var chart = this.getChart('J_ChartTimeLine');
            chart.Line(data);
        },
        createDoughnut: function(id, data, options) {
            if (!options) options = {};
            var chart = this.getChart(id);
            chart.Pie(data, options);
        },
        getChart: function(id) {
            var ctx = document.getElementById(id).getContext('2d');
            var chart = new Chart(ctx);
            return chart;
        },
        createList: function(id, list) {
            var html = '';
            var total = 0;
            for (var i = 0; i < list.length; i++) {
                total += parseInt(list[i].value);
            }
            for (var i = 0; i < list.length; i++) {
                var item = list[i];
                var percent = item.value / total * 100;
                html += '<li><span class="mark" style="background-color:' + item.color + '"></span>' + item.label + ' <label>' + percent.toFixed(1) + '%</label></li>';
            };
            $('#' + id).append(html);
        }
    }
    // window.onload = function(){
        entry.init();
    // };
    // 
    /*var res={
                "data":{
                    "city":[{"name":"北京","value":"1"},{"name":"西安","value":"1"}],
                    "position":[{"name":"其他","value":"2"}],
                    "timeline":[{"name":"2017-09-22","value":"2"}]
                },
                "msg":"success",
                "status":"1",
            };*/
});
