function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}

var weid = GetQueryString('weid');
var set = {
    all: [],
    token: sessionStorage.getItem('token')
};

var authority = (select, weid, res, title) => {
    var reqUrl = ApiUrl + 'admins/get_' + select + '?role_id=' + weid;
    var req = (reqUrl) => {
        return new Promise((resolve, reject) => {
            $.ajax({
            url: reqUrl,
            headers: {
                'Token': set.token
            },
            success: function(data) {
                resolve(data);
            },
            error: function(xhr) {
                console.log(xhr)
            }
        })
    })
    }

    req(reqUrl).then((resp) => {
        d = new dTree('d');
    d.add(0, -1, title);
    var rem = [];
    var send = [];
    var depth = 'i';
    var process = function(data, depth){
        data.map((e, i) => {
            rem.push({id: e.id, value: depth + i, pid: e.parent_id, name: e.name , checked: e.checked, url: e.url, mark: e.mark});
        set.all.push(e);
        if (e.children != undefined && e.children != '' && e.children != 'undefined') {
            process(e.children, depth + 'i');
        }
    })
    }

    var genTree = data => data.map(e => d.add(e.id, e.pid, 'm', e.pid, e.name, e.checked, false))

    process(resp, depth);
    genTree(rem);

    var id = document.getElementById(res);
    id.innerHTML = d;
    d.openAll();
})
}

// 频道弹框
function c_alert() {
    authority('channel', weid, 'res1', '频道管理');
    $("#alert").css({"display":"block"});
}
