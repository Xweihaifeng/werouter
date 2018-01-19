/**
 * 线形图数据返回
 * @returns {{title: {text: string, subtext: string, subtextStyle: {fontSize: number}}, tooltip: {trigger: string}, legend: {data: [string,string]}, toolbox: {show: boolean, feature: {dataZoom: {yAxisIndex: string}, dataView: {readOnly: boolean}, magicType: {type: [string,string]}, restore: {}, saveAsImage: {}}}, xAxis: {type: string, boundaryGap: boolean, data}, yAxis: {type: string, axisLabel: {formatter: string}, boundaryGap: boolean}, series: [*,*]}}
 */
function makeLineOption() {
    var option = {
        title: {
            text: '',
            subtext: '微友数',
            subtextStyle: {
                fontSize: 14,
            },
        },
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            show: false,
            data: ['新增微友数', '活跃微友数']
        },
        toolbox: {
            show: false,
            feature: {
                dataZoom: {
                    yAxisIndex: 'none'
                },
                dataView: {readOnly: false},
                magicType: {type: ['line', 'bar']},
                restore: {},
                saveAsImage: {}
            }
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: xTitle
        },
        yAxis: {
            type: 'value',
            axisLabel: {
                formatter: '{value}'
            },
            boundaryGap: false,
        },
        series: [
            {
                name: '新增微友数',
                type: 'line',
                itemStyle: {
                    normal: {
                        lineStyle: {
                            color: '#FF8C8E'
                        }
                    }
                },

                data: newlyAdded,
                markPoint: {
                    data: [
                        {type: 'max', name: '最大值'},
                        {type: 'min', name: '最小值'}
                    ]
                },
                hoverAnimation: false,
            },
            {
                name: '活跃微友数',
                type: 'line',
                itemStyle: {
                    normal: {
                        lineStyle: {
                            color: '#85E855'
                        }
                    }
                },
                data: Active,
                markPoint: {
                    data: [
                        {
                            type: 'max',
                            name: '最大值',
                            itemStyle: {
                                normal: {
                                    color: '#17C295'
                                }
                            }
                        },
                        {
                            type: 'min',
                            name: '最小值',
                            itemStyle: {
                                normal: {
                                    color: '#17C295'
                                }
                            }
                        }
                    ]
                },
                markLine: {
                    data: [
                        [{
                            symbol: 'none',
                            x: '100%',
                            yAxis: 'auto'
                        }, {
                            symbol: 'circle',
                            label: {
                                normal: {
                                    position: 'start',
                                }
                            },
                            type: 'max',
                            name: '最高点'
                        }]
                    ]
                }
            }
        ]
    };
    return option;
}
/**
 * 地图数据返回
 * @returns {{tooltip: {trigger: string}, legend: {orient: string, left: string, data: [string]}, dataRange: {show: boolean, x: string, y: string, splitList: [*,*,*,*,*,*]}, toolbox: {show: boolean, orient: string, left: string, top: string, feature: {mark: {show: boolean}, dataView: {show: boolean, readOnly: boolean}, restore: {show: boolean}, saveAsImage: {show: boolean}}}, roamController: {show: boolean, x: string, mapTypeControl: {china: boolean}}, series: [*]}}
 */
function makeMapOption() {
    var option = {
        tooltip: {
            trigger: 'item'
        },
        legend:{
            orient: 'vertical',
            left: 'left',
            data:['']
        },
        dataRange: {
            show: false,
            //orient:'horizontal',
            left: '80%',
            top: 'bottom',
            splitList: [
                {start: 10000, color: '#FF0000'},
                {start: 5000, end: 10000, color: '#FFAC37'},
                {start: 1000, end: 5000, color: '#C1E461'},
                {start: 100, end: 1000, color: '#F4F77D'},
                {start: 1, end: 100, color: '#CCCCCC'},
                {start:0, end: 0, color: '#EEEEEE'}
            ]
        },
        layoutCenter: ['45%', '50%'],
        layoutSize: 450,

        series: [
            {
                name: 'Ta的微友',
                type: 'map',
                mapType: 'china',
                roam: false,
                label: {
                    normal: {
                        show: true
                    },
                    emphasis: {
                        show: true
                    }
                },
                itemStyle: {
                    normal: {
                        show: true,
                        label: {show: true},
                        borderWidth: 1,//省份的边框宽度
                        borderColor: '#fff',//省份边框颜色
                    },
                    emphasis: {
                        areaColor: '#EABA5D',            // 也是选中样式
                        borderWidth: 1,
                        borderColor: '#FDEC1C',
                        label: {
                            show: true,
                        }
                    }
                },
                data: mapData
            }
        ]
    };
    return option;
}


/**
 * 绘图
 */
function makeChart() {
    lineChart.setOption(makeLineOption());
    mapChart.setOption(makeMapOption());
}

/**
 * 时间切换
 * @param timeType
 */
function changeTime(timeType, fromUrl) {
    /*请求参数分析*/
    var requestData;
    switch (timeType) {
        case 1:
            requestData = ['year'];
            break;
        case 2:
            requestData = ['year'];
            break;
        case 3:
            requestData = ['month'];
            break;
        case 4:
            requestData = ['month', getPreMonth()];
            break;
    }
    sendRequest(requestData, timeType, fromUrl);
}


/**
 * 发送请求
 * @param requestData
 */
function sendRequest(requestData, timeType, fromUrl) {
    $.post(requestUrl, {titleData:requestData, timeType:timeType, fromUrl:fromUrl}, function (data) {
        eval(" var data = " + data);
        var resopnse = data.data;
        eval(" xTitle =" + resopnse.xTitle);
        eval(" newlyAdded =" + resopnse.newlyAdded);
        eval(" Active =" + resopnse.active);
        eval(" mapData =" + resopnse.mapData);
        friendNum = resopnse.friendNum;
        makeChart();
    })
}

/**
 * 获取上月第一天
 * @returns {string}
 */
function getPreMonth() {
    var nowdays = new Date();
    var year = nowdays.getFullYear();
    var month = nowdays.getMonth();
    if(month == 0)
    {
        month=12;
        year=year-1;
    }
    if (month < 10) {
        month = "0" + month;
    }
    return year + "/" + month + "/" + "01";
}