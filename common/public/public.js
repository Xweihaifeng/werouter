// 文件已经没有用了----
// 
// 
// 
// 
function GetQueryString(name) {
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null)return  unescape(r[2]); return null;
}

function empty(params)
{
    if(params !== null && params !== undefined && params !== '')
    {
        return true;
    }
    return false;
}