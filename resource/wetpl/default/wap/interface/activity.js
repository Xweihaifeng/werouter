let resp;
const reqDynamicList = (url) => {
    $.ajax({
        url: url,
        type: 'GET',
        async: false,
        headers: {
            'Token': localStorage.getItem('token')
        },
        success: function(data){
            if (data.code == 200) {
                resp = data.data.list;
                console.log(resp)
            }
        },
        error: function(xhr) {
            console.log(xhr);
        }
    })
}

//alert(localStorage.getItem('token'))
let type = 2;
let dynamic_type = 3; //activity
reqDynamicList(apiUrl + 'circel/dynamic?type=' + type + '&dynamic_type=' + dynamic_type);

const mock_act = resp;

/*
const mock_act = [
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
