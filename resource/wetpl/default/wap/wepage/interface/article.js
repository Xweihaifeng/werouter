let resp;
const reqDynamicList = (url) => {
    $.ajax({
        url: url,
        type: 'GET',
        async: false,
        success: function(data){
            if (data.code == 200) {
                console.log(data)
                resp = data.data.list;
            }
        },
        error: function(xhr) {
            console.log(xhr);
        }
    })
}

let type = 2;
let dynamic_type = 1; //article
reqDynamicList('http://new.wezchina.com/api/circel/dynamic?type=' + type + '&dynamic_type=' + dynamic_type);

const mock_art = resp;

/*
const mock_art = [
    {
        name: "电商达人",
        des: "众筹列车开通了",
        title: '全国首趟“众筹列车”在陕西省成功开行',
        cover: "/common/img/slice.jpg",
        summary: '什么是“众筹列车”？西安火车站售票车间副主任畅蕾告诉记者，就是通过网络平台，旅客可以自行选择需要乘坐列车的区段、日期和席别，只要人数达到列车总席位的50%，铁路部门就可决定开行该趟列车。 对于为什么开行“众筹列车”',
        time: "14分钟前"
    },
    {
        name: "电商达人",
        des: "棒棒哒",
        title: "党的十九大代表全部选出",
        cover: "/common/img/slice.jpg",
        summary: "当选代表总体上符合中央规定的条件，具有较高的思想政治素质、良好的作风品行和较强的议事能力，在各自岗位上做出了显著成绩，是共产党员中的优秀分子",
        time: "14分钟前"
    }
]*/
