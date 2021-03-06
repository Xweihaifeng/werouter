let resp;
const reqActData = (url, data) => {
    $.ajax({
        url: url,
        type: 'POST',
        data: data,
        async: false,
        success: function(data) {
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

const reqUserId = (url, domain) => {
    $.ajax({
        url: url + domain,
        type: 'GET',
        async: false,
        success: function(data) {
            if (data.code == 200) {
                //console.log(data)
                let weid = data.data.weid;
                let userid = data.data.plat_user_id;
                let info = {
                    user_id: userid
                }
                reqActData(apiUrl + 'activity/listbyuser', info);
            }
        },
        error: function(xhr) {
            console.log(xhr);
        }
    })
}

let domain = window.location.pathname.split('/')[1];
reqUserId(apiUrl + 'pages/page/getDetailByDomain/', domain);

const my_activity = resp;
