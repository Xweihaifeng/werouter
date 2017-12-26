/**
 * Created by Hongguang on 2017/11/21.
 */

let resp;
const reqDynamicList = (url) => {
    $.ajax({
        url: url,
        type: 'GET',
        async: false,
        success: function(data){
            if (data.code == 200) {
                //console.log(data.data.list)
                resp = data;
            }
        },
        error: function(xhr) {
            console.log(xhr);
        }
    })
}

let type = 1;
let domain = window.location.pathname.split('/')[1];
reqDynamicList(apiUrl + 'circel/dynamic?type=' + type + '&domain=' + domain);

const my_dynamic = resp;