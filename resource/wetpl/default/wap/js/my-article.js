/**
 * Created by Hongguang on 2017/11/8.
 */

function columnList(data, domain){
    var temp =
        '<a href="/' + domain + '/article/' + data.weid + '"><p><label><span>'+data.title+'</span><label><img src="'+data.cover+'" alt=""></label></label></p>';
    return temp;
}

function listsTemp(domId, data, domain){
    var temp =
        '<div id='+domId+'>'+

        '<div  class="time t_for_lists">'+
        '<span>昨天&nbsp;下午1:30</span>'+
        '</div>'+

        '<div class="lists">'+
        '<a href="/' + domain + '/article/' + data.weid + '">' +
        '<div>'+
        '<label>'+
        '<span>为什么在安静的环境下，你会听到不存在的声音？</span>'+
        '</label>'+
        '</div>' +
        '</a>'+
        /*'<p>'+
        '<label>'+
        '<span>为什么在安静的环境下，你会听到不存在的声音？</span>'+
        '<img src="img/slice.jpg" alt="">'+
        '</label>'+
        '</p>'+
        '<p>'+
        '<label>'+
        '<span>为什么在安静的环境下，你会听到不存在的声音？</span>'+
        '<img src="img/slice.jpg" alt="">'+
        '</label>'+
        '</p>'+
        '</div>'+*/


        '</div>'

    return temp;
}

function singleList(data,pdate,domId){
    var temp =
    '<div id='+domId+'>'+

        '<div  class="time t_for_single">'+
        '<span>下午1:30</span>'+
        '</div>'+
        '<a href="/' + domain + '/article/' + data.weid + '">' +
        '<div class="single"> '+
        '<p class="title">'+data.title+'</p>'+
        '<span class="pt">'+(pdate.getMonth()+1)+'月'+(pdate.getDate())+'号</span>'+
        '<img src="'+data.cover+'" alt="">'+
        '<span class="detail">'+data.summary+'</span>'+
        '<p>查看全文</p>'+
        '</div>' +
        '</a>'

    '</div>'


    return temp;

}

function getMin(arr){
    var min = arr[0];
    if(arr.length == 1){
        min = new Date(min)
    }else{
        for(var t=0;t<arr.length;t++){
            if(arr[t] < min){
                min = arr[t]
            }
        }
    }
    return min;
}

function getTime(timeList,tdom){
    var weeks = ["周日","周一","周二","周三","周四","周五","周六"]

    if(timeList.length){
        var minTime = getMin(timeList);
        var minYear = minTime.getFullYear();
        var minMonth = minTime.getMonth()+1;
        var minDate = minTime.getDate();
        var minHour = minTime.getHours();
        var minSecond = minTime.getSeconds();
        var minDay = minTime.getDay();
        var minMin = minTime.getMinutes() < 10 ? "0"+minTime.getMinutes() : minTime.getMinutes();

        //  gap为0代表当天 为1代表昨天
        var gap = parseInt((new Date() - new Date(minYear+"-"+minMonth+"-"+minDate))/1000/60/60/24)
        // 只计算周内的日期 七天内但是不包括上周
        var beforeSunday = new Date() - (new Date().getDay()*24*60*60*1000)
        if(gap == 1){
            if( 0 <= minHour && minHour <= 12){
                $(tdom).text("昨天 早上"+minHour+":"+minMin)
            }else{
                $(tdom).text("昨天 下午"+minHour+":"+minMin)
            }

        }else if( 1 < gap && gap <= 7 && (minTime > beforeSunday)){
            if( 0<= minHour && minHour <= 12){
                $(tdom).text(weeks[minDay]+" 早上"+minHour+":"+minMin)
            }else{
                $(tdom).text(weeks[minDay]+" 下午"+minHour+":"+minMin)
            }
        }else if(gap == 0){
            if(0 <= minHour && minHour <=12){
                $(tdom).text("早上"+minHour+":"+minMin)
            }else{
                $(tdom).text("下午"+minHour+":"+minMin)
            }
        }else{
            if(0 <= minHour && minHour <=12){
                $(tdom).text(minMonth+"月"+minDate+"日 早上"+minHour+":"+minMin)
            }else{
                $(tdom).text(minMonth+"月"+minDate+"日 下午"+minHour+":"+minMin)
            }

        }

    }
}

function handleResponse(data){
    if(data.code == 200){

        $('.my_container').children().remove();

        var artList = data.data.list;
        var sort = {};
        var num = 0;
        for(var i=0;i<artList.length;i++){
            var ind = artList[i].created_at.indexOf(" ")
            var format = artList[i].created_at.substring(0,ind)
            if(sort.hasOwnProperty(format)){
                sort[format].push(artList[i])
            }else{
                sort[format] = [artList[i]];
            }

        }
        console.log(sort)
        for(var key in sort){

            if(sort[key].length > 1 ){

                // 应用多个模板
                var timeList = [];
                $(".my_container").append(listsTemp(num, sort[key][0], 'index'))
                $('#'+num+' .lists div').siblings('p').remove();
                for(var i = 0; i < sort[key].length; i++){
                    if(i == 0){
                        var coverImg = sort[key][0].cover ? sort[key][0].cover : '/common/img/vote_front_cover.png';
                        $('#'+num+' .lists div').css('background-image','url('+coverImg+')');
                        $('#'+num+' .lists div label span').text(sort[key][0].title)
                    }else{
                        $('#'+num+' .lists').append(columnList(sort[key][i], 'index'))
                    }
                    timeList.push(new Date(sort[key][i].created_at))
                }

                getTime(timeList,"#"+num+" .t_for_lists span")


            }else if(sort[key].length == 1){
                // 应用单个模板
                var timeList = [];
                var pDate = new Date(sort[key][0].created_at);
                $(".my_container").append(singleList(sort[key][0], pDate,num))

                timeList.push(sort[key][0].created_at)
                getTime(timeList,"#"+num+" .t_for_single span")

            }

            num++;

        }

    }
}