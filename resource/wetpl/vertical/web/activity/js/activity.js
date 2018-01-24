$(function(){
    // 分类列表点击
    $(".cate-list>li").click(function(){
        $(this).addClass("list").siblings().removeClass("list");
        show_con()
    })
    // 时间列表点击
    $(".time-list>li").click(function(){
        $(this).addClass("list").siblings().removeClass("list");
        show_con()
    })
    // 热门点击
    $(".hot-list>li").click(function(){
        $(this).addClass("hot").siblings().removeClass("hot");
        show_con()
    })

    // 内容展示
    function show_con(){
        $(".cont-list").html("");
        var template=`
         <li>
            <a href="">
                <img src="/resource/wetpl/vertical/web/activity/img/01.png" alt="">
            </a>
            <div class="abstract">
                <a href="">
                    <h3>互联网运营50堂必修课，如何玩转产品、用户、渠道、数据？</h3>
                    <p>50节系统化实战课程、是面向0到3年得互联网从业者和爱好者学习的内容，从零基础打造运营思维体系，深度学习互联网运营、产品、用户、渠道、营销的实操，具体怎么做，通过运营模型及实例让你快速进阶...</p>
                </a>
                <div class="abst-info">
                     <div class="info-son">
                         <img src="{{PATH_TML}}activity/img/时间.png" alt="">
                         本周五<span>12:30</span>开始
                     </div>
                    <div class="info-son">
                        <img src="{{PATH_TML}}activity/img/地点.png" alt="">
                        <span>高新区</span>
                    </div>
                    <div class="info-son">
                        <img src="{{PATH_TML}}activity/img/人员.png" alt="">
                        <span>145</span>人已报名
                    </div>
                </div>
            </div>
            <div class="attend">
                  <span>免费</span>
                  <button>立即报名</button>
            </div>
        </li>
             `
        $(".cont-list").append(template)
    }
})