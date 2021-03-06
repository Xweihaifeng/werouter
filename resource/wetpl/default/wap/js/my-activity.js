/**
 * Created by Hongguang on 2017/11/9.
 */

var oneDay = (item, list) => list.filter(x => x.created_at.substr(0, 10) == item.created_at.substr(0, 10));
var remove = (item, list) => list.filter(x => x.created_at.substr(0, 10) != item.created_at.substr(0, 10));

//myactivity
var single = function(list){
    var cover = '';
    if (list[0].cover != '') {
        cover = list[0].cover;
    } else {
        cover = 'img/cover.png';
    }
    var template = `
                <div class="part">
                    <div class="date"><span>` + list[0].created_at + `</span></div>
                <div class="article">
                    <div class="art-title">` + list[0].title + `</div>
                <div class="art-date">` + list[0].created_at.substr(0, 10) + `</div>
                <div class="art-cover">
                    <img class="list-cover" src="` + cover + `" style="width: 100%; height: 100%;"/>
                </div>
                    <div class="art-summary">` + list[0].summary.substr(0,50) + `</div>
                    <div class="art-read"><a href="">查看全文</a></div>
                </div>
                </div>`;
    return template;
}

var multiBody = function(list){
    var template = `
            <div class="lists">
                <div class="list-title">` + list.title + `</div>
                <img class="list-cover" src="` + list.cover + `" />
            </div>`;
    return template;
}

var multiHead = function(list){
    let res = [];
    for (var i = 1; i < list.length; i++) {
        res.push(list[i]);
    }
    var template = `
            <div class="part">
                <div class="date"><span>` + list[0].created_at + `</span></div>
            <div class="art-list">
                <div class="cover">
                    <img class="list-cover" src="` + list[0].cover + `" style="width: 100%; height: 100%;"/>
                </div>
                <div class="title"><span>` + list[0].title + `</span></div>
                ` + res.map(x => multiBody(x)).join('') + `
            </div>
            </div>`;
    return template;
}

//myactivity init
var genTpl = (list) => {
    var ls = oneDay(list[0], list);
    if (list == '') {
        return ;
    }
    if (ls.length == 1) {
        $("#container").append(single(ls));
    } else {
        $("#container").append(multiHead(ls));
    }
    return genTpl(remove(list[0], list));
}