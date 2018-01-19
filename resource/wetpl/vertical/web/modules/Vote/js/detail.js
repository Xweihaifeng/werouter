/**
 * Created by yangzi on 2017/8/1.
 */
//获取url中的参数
var paramdetailid=getUrlParam("detailid");

new Vue({
  el: '#detail-app',
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
    detail:'',
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
    $.ajax({
        url: 'http://'+globalHost+'/vote/itemdetail/'+paramdetailid,
        type:'GET',
        success: function (data) {
            if(data.code==200){
                _self.detail=data.data;
                console.log(_self.detail.title);
            }
        }
    })
    //增加子浏览量
    $.ajax({
        url: 'http://'+globalHost+'/vote/item_view/'+paramdetailid,
        type:'GET',
        success:function(data){
            
        }
    })
   }
})




