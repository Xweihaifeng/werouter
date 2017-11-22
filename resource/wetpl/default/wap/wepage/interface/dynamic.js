/**
 * Created by Hongguang on 2017/11/22.
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

let type = 2;
reqDynamicList('http://new.wezchina.com/api/circel/dynamic?type=' + type);

const dynamic = resp;