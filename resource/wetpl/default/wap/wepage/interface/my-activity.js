let resp;
const reqActData = (url, data) => {
    $.ajax({
        url: url,
        type: 'POST',
        data: data,
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
