/**
 * Created by yangzi on 2017/7/28.
 */


var vm=new Vue({
    el: '#index-app',
    data: {
        title: '',
        summary:'',
        cover:'',
        num:'',
        views:'',
        begin_time:'',
        end_time:'',
        only_wechat:'',
        status:'',
        remark:'',
        statistic:'',
        countitem:'',
        rule:'',
        adv:'',
        list:[],
        total:'',
        page:1,

    },
    created: function () {
        var _self=this;
        $.ajax({
            url: 'http://'+globalHost+'/vote/detail/'+globalWeid,
            type:'GET',
            success:function (data){
                if(data.code==200){
                    _self.title=data.data.title;
                    _self.countitem=data.data.countitem;
                    _self.num=data.data.num;
                    _self.views=data.data.views;
                    _self.cover=data.data.cover;
                    _self.summary=data.data.summary;
                    _self.begin_time=data.data.begin_time;
                    _self.end_time=data.data.end_time;
                    _self.rule=data.data.rule;
                    _self.adv=data.data.adv;
                    _self.only_wechat=data.data.only_wechat;
                }


            }
        })
        var voteid=globalWeid; 
        var keywords=getUrlParam('keywords');
        $.ajax({
            url: 'http://'+globalHost+'/vote/list',
            type:'POST',
            data:{ vote_id:voteid,limit:1,page:_self.page,keywords:keywords},
            success: function (data) {
                if(data.code==200){
                    _self.list=data.data.list;
                    _self.total=data.data.total;
                }
            }
        })
    },
    methods:{
        addAtLast: function(){
            var _self=this;
            _self.page=_self.page+1;
            var voteid=globalWeid;    
            var keywords=getUrlParam('keywords');
            $.ajax({
                url: 'http://'+globalHost+'/vote/list',
                type:'POST',
                data:{ vote_id:voteid,limit:1,page:_self.page,keywords:keywords},
                beforeSend: function () {
                    $('#more span').css('display','none');
                    $('#more i').css('display','block');
                    $('#more i').css('transform','rotete(180deg)');

                },
                complete: function () {
                    $('#more i').css('display','none');
                    $('#more span').css('display','block');
                },
                success: function (data) {
                    if(data.code==200){
                        _self.list.push(data.data.list[0]);
                        if(_self.total<=(_self.page*1)){
                            $("#more").text('没有更多了');
                        }
                    }
                }
            })
          
        }
    }
})

$(function () {
    $('.twoi').click(function(){
        $('#fiv').toggle();
    })
    //滚动加载数据
    $(window).scroll(function(){
        var distance=$("#more").offset().top - $(window).scrollTop();
        if(distance<0){
            vm.addAtLast();
        }
        
    });



    // $('.search_1 input').focus(function(){
    //     $('.search_1 input').css("border","1px solid rgba(0,0,0,0.2)")
    // })
})