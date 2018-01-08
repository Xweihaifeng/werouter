// $(function(){
//     // 浙商风采开始
//     var b=setInterval(bb,20);
//     function bb(){
//           var speed=1;
//           var Lefts=$(".fc1").position().left-speed;
//           var Lefts2=$(".fc2").position().left-speed;
//           if(Lefts<-1230){
//               $(".fc1").css({left:1230,zIndex:1})
//           }else{
//               $(".fc1").css({left:Lefts,zIndex:4})
//           }
//           if(Lefts2<-1230){
//                 $(".fc2").css({left:1230,zIndex:1})
//           }else{
//                 $(".fc2").css({left:Lefts2,zIndex:4})
//           }
//       }
//     $(".fc-right").mouseenter(function(){
//           clearInterval(b)
//     })
//     $(".fc-right").mouseleave(function(){
//         b=setInterval(bb,20)
//     })
//     // 浙商风采结束

//     // 企业和产品展示开始
//     var c=setInterval(cc,4000);
//     function cc(){
//         var speed1=299;
//          var zleft=$(".zs1").position().left-speed1;
//          var zleft2=$(".zs2").position().left-speed1;
//          if(zleft<=-1595){
//              $(".zs1").css({left:1196,zIndex:1, opacity:0})
//          }else{
//              $(".zs1").animate({left:zleft,zIndex:88,opacity:1},"slow")
//          }
//          if(zleft2<=-1595){
//              $(".zs2").css({left:1196,zIndex:1,opacity:0})
//          }else{
//              $(".zs2").animate({left:zleft2,zIndex:88,opacity:1},"slow")
//          }

//      }
//     $(".s2-bR").click(function(){
//         cc()
//     });
//     $(".s2-bL").click(function(){
//         if($(".zs2").position().left>1300){
//             $(".zs2").css({left:-1495});
//         }
//         var speed1=-299;
//         var zleft=$(".zs1").position().left-speed1;
//         var zleft2=$(".zs2").position().left-speed1;
//         if(zleft>1490){
//             $(".zs1").css({left:-1495,zIndex:1, opacity:0})
//         }else{
//             $(".zs1").animate({left:zleft,zIndex:4,opacity:1},"slow")
//         }
//         if(zleft2>1300){
//             $(".zs2").css({left:-1495,zIndex:1,opacity:0})
//         }else{
//             $(".zs2").animate({left:zleft2,zIndex:4,opacity:1},"slow")
//         }
//     });
//     $(".qy").mouseenter(function(){
//         clearInterval(c)
//     })
//     $(".qy").mouseleave(function(){
//         c=setInterval(cc,4000);
//     })
//     // 企业和产品展示结束
// })