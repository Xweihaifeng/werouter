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

reqDynamicList('http://new.wezchina.com/api/circel/dynamic');

const my_dynamic = resp;