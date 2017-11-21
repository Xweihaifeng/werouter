/**
 * Created by Hongguang on 2017/11/21.
 */

let resp;
const reqArtList = (url, userid) => {
    $.ajax({
        url: url + userid,
        type: 'GET',
        async: false,
        success: function(data){
            if (data.code == 200) {
                //console.log(data)
                resp = data;
            }
        },
        error: function(xhr) {
            console.log(xhr);
        }
    })
}


const my_article = resp;