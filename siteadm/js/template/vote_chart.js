Date.prototype.format = function(format) {
    var date = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "h+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3),
        "S+": this.getMilliseconds()
    };
    if (/(y+)/i.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    for (var k in date) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ?
                date[k] : ("00" + date[k]).substr(("" + date[k]).length));
        }
    }
    return format;
}
$(document).ready(function() {
    start();
    var weid = getUrlParam('vote_id');
    if (isNull(weid) == false) {
        //编辑
        $.ajax({
            url: ApiUrl + 'vote/vote_chart/' + weid,
            type: 'GET',
            success: function(rep) {
                var data = {
                    data: rep.data.statistics
                };

                if (rep.code == 200) {
                    //console.log(data.data);
                    //$('#statistics-time').text(new Date(parseInt(rep.data.time.toString() + '000')).format('yyyy-MM-dd hh:mm:ss'));
                    $('#vtitle').text(rep.data.statistics.info.title + ' —  投票统计');
                    var titleobj = $(".content-header").find('h3');
                    titleobj.each(function(index, element) {
                        if (index == 0) {
                            $(this).text("投票活动：" + data.data.info.title + "  —  投票统计");
                        }
                        if (index == 1) {
                            $(this).text("投票活动：" + data.data.info.title + "  —  访问统计");
                        }
                        if (index == 2) {
                            $(this).text("投票活动：" + data.data.info.title + "  —  用户统计");
                        }
                        if (index == 3) {
                            $(this).text("投票活动：" + data.data.info.title + "  —  用户新增曲线");
                        }
                    });


                    //计算条形图高度  
                    //$(".charts").css("height",200*data.data.votes.length);
                    function ses() {
                        $pages = $('#content-content').css('width');
                        if (data.data.voteView.length > 10) {
                            $height = data.data.voteView.length * 35;
                        } else if (data.data.voteView.length <= 10 && data.data.voteView.length > 3) {
                            $height = data.data.voteView.length * 85;
                        } else if (data.data.voteView.length <= 3 && data.data.voteView.length >= 1) {
                            $height = data.data.voteView.length * 135;
                        }
                        $('.charts').css({ width: $pages, height: $height + 'px' });
                        $('.charts-bar').css({ width: $pages });
                        ssse();
                        console.log($pages);
                    }
                    setTimeout(ses, 1000);

                    function ssse() {

                        //总用户统计
                        var data8 = [];
                        var data11 = [];
                        var num = data.data.num;
                        for (var i = 0, ien = num.length; i < ien; i++) {
                            data8.push(num[i].grow_date);
                            data11.push(num[i].user_num);
                        }
                        // for (var k in num) {
                        //     data8.push(k);
                        //     data11.push(num[k]);
                        // }
                        var barChart1 = echarts.init(document.getElementById('bar1'));
                        var option7 = {
                            title: {
                                text: ''
                            },
                            tooltip: {
                                trigger: 'axis'
                            },
                            legend: {
                                data: ['用户数'],
                            },
                            xAxis: {
                                data: data8
                            },
                            yAxis: {},
                            series: [{
                                name: '用户数',
                                type: 'line',
                                data: data11

                            }]
                        };
                        barChart1.setOption(option7);


                        //--------投票统计--start  
                        var data15 = [];
                        var data16 = [];
                        var data17 = [];
                        for (var i = 0, ien = data.data.voteNum.length; i < ien; i++) {
                            data15.push(data.data.voteNum[i].sort + '.' + data.data.voteNum[i].title);
                            data16.push(data.data.voteNum[i].nums);
                            data17.push({ value: data.data.voteNum[i].nums, name: data.data.voteNum[i].sort + '.' + data.data.voteNum[i].title });
                        }
                        // 投票统计
                        var circular0 = echarts.init(document.getElementById('circular0'));
                        var option4 = {
                            title: {
                                text: '投票总数：' + data.data.total.nums,
                                subtext: '',
                                padding: 20
                            },
                            tooltip: {
                                trigger: 'item',
                                formatter: "{a} <br/>{b}: {c}",
                                axisPointer: {
                                    type: 'shadow'
                                }
                            },
                            legend: {
                                orient: 'vertical',
                                x: 'left',
                                data: data15
                            },
                            grid: {
                                x: 190
                            },
                            xAxis: {
                                type: 'value',
                                boundaryGap: [0, 0.01]
                            },
                            yAxis: {
                                type: 'category',
                                data: data15
                            },
                            series: [{
                                name: '投票数',
                                type: 'bar',
                                itemStyle: {
                                    normal: {
                                        color: function(params) {
                                            // build a color map as your need.
                                            var colorList = [
                                                '#C1232B', '#B5C334', '#FCCE10', '#E87C25', '#27727B',
                                                '#FE8463', '#9BCA63', '#FAD860', '#F3A43B', '#60C0DD',
                                                '#D7504B', '#C6E579', '#F4E001', '#F0805A', '#26C0C0'
                                            ];
                                            return colorList[params.dataIndex]
                                        },
                                    }
                                },
                                radius: ['50%', '70%'],
                                avoidLabelOverlap: false,
                                label: {
                                    normal: {
                                        show: true,
                                        position: 'right'
                                    }
                                },
                                labelLine: {
                                    normal: {
                                        show: false
                                    }
                                },
                                data: data17
                            }],
                            width: '1000px'
                        };
                        circular0.setOption(option4);
                        var barChart0 = echarts.init(document.getElementById('bar3'));
                        var option8 = {
                            title: {
                                text: ''
                            },
                            tooltip: {
                                formatter: "{a} <br/>{b}: {c} ({d}%)",
                                orient: 'vertical',
                                left: 'left',
                                data: data15
                            },
                            series: [{
                                name: '投票量',
                                type: 'pie',
                                radius: '55%',
                                center: ['50%', '60%'],
                                data: data17

                            }]
                        };
                        barChart0.setOption(option8);

                        //--------投票统计--end


                        //--------访问统计--start
                        var data18 = [];
                        var data19 = [];
                        var data20 = [];
                        var views = 0;
                        for (var i = 0, ien = data.data.voteView.length; i < ien; i++) {
                            views = views + data.data.voteView[i].views;
                            data18.push(data.data.voteView[i].sort + '.' + data.data.voteView[i].title);
                            data19.push(data.data.voteView[i].views);
                            data20.push({ value: data.data.voteView[i].views, name: data.data.voteView[i].sort + '.' + data.data.voteView[i].title });
                        }
                        data18.push(data.data.info.title);
                        data19.push(data.data.info.views - views);
                        data20.push({ value: data.data.info.views - views, name: data.data.info.title });

                        var myChart = echarts.init(document.getElementById('circular'));
                        var option1 = {
                            title: {
                                text: '访问总数：' + data.data.total.views,
                                subtext: '',
                                padding: 20
                            },
                            tooltip: {
                                trigger: 'item',
                                formatter: "{a} <br/>{b}: {c}",
                                axisPointer: {
                                    type: 'shadow'
                                }
                            },
                            legend: {
                                orient: 'vertical',
                                x: 'left',
                                data: data18
                            },
                            grid: {
                                x: 190
                            },
                            xAxis: {
                                type: 'value',
                                boundaryGap: [0, 0.01]
                            },
                            yAxis: {
                                type: 'category',
                                data: data18
                            },
                            series: [{
                                name: '访问数',
                                type: 'bar',
                                itemStyle: {
                                    normal: {
                                        color: function(params) {
                                            // build a color map as your need.
                                            var colorList = [
                                                '#C1232B', '#B5C334', '#FCCE10', '#E87C25', '#27727B',
                                                '#FE8463', '#9BCA63', '#FAD860', '#F3A43B', '#60C0DD',
                                                '#D7504B', '#C6E579', '#F4E001', '#F0805A', '#26C0C0'
                                            ];
                                            return colorList[params.dataIndex]
                                        },
                                    }
                                },
                                radius: ['50%', '70%'],
                                avoidLabelOverlap: false,
                                label: {
                                    normal: {
                                        show: true,
                                        position: 'right'
                                    }
                                },
                                labelLine: {
                                    normal: {
                                        show: false
                                    }
                                },
                                data: data20
                            }]
                        };
                        myChart.setOption(option1);


                        var barChart = echarts.init(document.getElementById('bar'));
                        var option2 = {
                            title: {
                                text: ''
                            },
                            tooltip: {
                                formatter: "{a} <br/>{b}: {c} ({d}%)",
                                orient: 'vertical',
                                left: 'left',
                                data: data18
                            },
                            series: [{
                                name: '访问量',
                                type: 'pie',
                                radius: '55%',
                                center: ['50%', '60%'],
                                data: data20

                            }]
                        };
                        barChart.setOption(option2);
                        //--------访问统计--end

                        //--------用户统计--start 
                        var data21 = [];
                        var data22 = [];
                        var data23 = [];
                        var ucount = 0;
                        for (var i = 0, ien = data.data.user.length; i < ien; i++) {
                            ucount = ucount + data.data.user[i].count;
                            data21.push(data.data.user[i].sort + '.' + data.data.user[i].title);
                            data22.push(data.data.user[i].count);
                            data23.push({ value: data.data.user[i].count, name: data.data.user[i].sort + '.' + data.data.user[i].title });
                        }
                        data21.push(data.data.info.title);
                        data22.push(data.data.info.user_num - ucount);
                        data23.push({ value: data.data.info.user_num - ucount, name: data.data.info.title });

                        var myChart2 = echarts.init(document.getElementById('circular2'));
                        var option5 = {
                            title: {
                                text: '用户总数：' + data.data.total.users,
                                subtext: '',
                                padding: 20
                            },
                            tooltip: {
                                trigger: 'item',
                                formatter: "{a} <br/>{b}: {c}",
                                axisPointer: {
                                    type: 'shadow'
                                }
                            },
                            legend: {
                                orient: 'vertical',
                                x: 'left',
                                data: data21
                            },
                            grid: {
                                x: 190
                            },
                            xAxis: {
                                type: 'value',
                                boundaryGap: [0, 0.01]
                            },
                            yAxis: {
                                type: 'category',
                                data: data21
                            },
                            series: [{
                                name: '用户数',
                                type: 'bar',
                                itemStyle: {
                                    normal: {
                                        color: function(params) {
                                            // build a color map as your need.
                                            var colorList = [
                                                '#C1232B', '#B5C334', '#FCCE10', '#E87C25', '#27727B',
                                                '#FE8463', '#9BCA63', '#FAD860', '#F3A43B', '#60C0DD',
                                                '#D7504B', '#C6E579', '#F4E001', '#F0805A', '#26C0C0'
                                            ];
                                            return colorList[params.dataIndex]
                                        },
                                    }
                                },
                                radius: ['50%', '70%'],
                                avoidLabelOverlap: false,
                                label: {
                                    normal: {
                                        show: true,
                                        position: 'right'
                                    }
                                },
                                labelLine: {
                                    normal: {
                                        show: false
                                    }
                                },
                                data: data23
                            }]
                        };
                        myChart2.setOption(option5);
                        var barChart2 = echarts.init(document.getElementById('bar2'));
                        var option6 = {
                            title: {
                                text: ''
                            },
                            tooltip: {
                                formatter: "{a} <br/>{b}: {c} ({d}%)",
                                orient: 'vertical',
                                left: 'left',
                                data: data21
                            },
                            series: [{
                                name: '用户量',
                                type: 'pie',
                                radius: '55%',
                                center: ['50%', '60%'],
                                data: data23

                            }]
                        };
                        barChart2.setOption(option6);
                        //--------用户统计--end
                    }
                }
                //设置刚开始不显示
                $("#bar3").css("display", "none");
                $("#bar").css("display", "none");
                $("#bar2").css("display", "none");


            }
        })
    }
    //点击切换条形图和饼形图
    $("#controllerbar1").click(function() {
        $("#circular0").show(1000);
        $("#bar3").hide(1000);
    })
    $("#controllerbar2").click(function() {
        $("#circular").show(1000);
        $("#bar").hide(1000);
    })

    $("#controllerbar3").click(function() {
        $("#circular2").show(1000);
        $("#bar2").hide(1000);
    })
    $("#controllercircular1").click(function() {
        $("#circular0").hide(1000);
        $("#bar3").show(1000);
    })
    $("#controllercircular2").click(function() {
        $("#circular").hide(1000);
        $("#bar").show(1000);
    })
    $("#controllercircular3").click(function() {
        $("#circular2").hide(1000);
        $("#bar2").show(1000);
    })
    $('.btn-updated').click(function() {
        $('.btn-updated').text('更新中...');
        $('.btn-updated').attr('disabled', true);
        $.ajax({
            url: ApiUrl + 'vote/vote_statistics/' + weid,
            type: 'GET',
            success: function(rep) {
                if (rep.code == 200) {
                    location.reload();
                } else {
                    swal('提示', rep.message, 'error');
                    $('.btn-updated').removeAttr('disabled');
                }
            }
        });
    });

})