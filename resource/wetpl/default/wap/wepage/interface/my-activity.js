let resp;
const reqActData = (url, data) => {
    $.ajax({
        url: url,
        type: 'POST',
        async: false,
        success: function(data) {
            if (data.code == 200) {
                //console.log(data)
                resp = data.data.list;
            }
        },
        error: function(xhr) {
            console.log(xhr);
        }
    })
}

const reqUserId = (url, domain) => {
    $.ajax({
        url: url + domain,
        type: 'GET',
        async: false,
        success: function(data) {
            if (data.code == 200) {
                //console.log(data)
                let userid = data.data.plat_user_id;
                let info = {
                    user_id: userid
                }
                reqActData('http://new.wezchina.com/api/activity/listbyuser', info);
            }
        },
        error: function(xhr) {
            console.log(xhr);
        }
    })
}

reqUserId('http://new.wezchina.com/api/pages/page/getDetailByDomain/', 'index');

const my_activity = resp;

console.log(resp);
/*
const my_activity = [
    {
    avatar: "/common/img/activity.png",
    name: "倔强",
    summary: "自我情绪管理课程",
    title: "【一元】",
    date: "02/14 20:00",
    city: "西安",
    time: "14分钟前"
    },
    {
    avatar: "/common/img/activity.png",
    name: "倔强园丁",
    summary: "自我情绪管理课程",
    title: "【一元好课】",
    date: "02/14 20:00",
    city: "西安",
    time: "14分钟前"
    },
    {
    avatar: "/common/img/activity.png",
    name: "倔强园丁",
    summary: "自我情绪管理课程",
    title: "【一元好课】",
    date: "02/14 20:00",
    city: "西安",
    time: "14分钟前"
    },
    {
    avatar: "/common/img/activity.png",
    name: "倔强园丁",
    summary: "自我情绪管理课程",
    title: "【一元好课】",
    date: "02/14 20:00",
    city: "西安",
    time: "14分钟前"
    },
    {
    avatar: "/common/img/activity.png",
    name: "倔强园丁",
    summary: "自我情绪管理课程",
    title: "【一元好课】",
    date: "02/14 20:00",
    city: "西安",
    time: "14分钟前"
    }
]*/
