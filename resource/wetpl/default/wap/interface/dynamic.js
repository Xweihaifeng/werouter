/**
 * Created by Hongguang on 2017/11/22.
 */

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
                console.log(data)
                resp = data;
            }
        },
        error: function(xhr) {
            console.log(xhr);
        }
    })
}

//alert(localStorage.getItem('token'))
let type = 2;
reqDynamicList(apiUrl + 'circel/dynamic?type=' + type);

const dynamic = resp;