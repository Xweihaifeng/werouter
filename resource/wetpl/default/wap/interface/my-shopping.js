const my_wemall = {
    "type" : ["手机", "数码", "电脑", "办公", "家具", "家居", "家装", "厨具", "男装", "女装", "童装", "内衣", "宠物", "女鞋", "男鞋", "箱包", "钟表", "珠宝", "运动", "户外", "汽车", "母婴", "食品", "酒水", "生鲜", "特产", "鲜花", "保健", "情趣", "图书", "音影", "电子书"],
    "shop" : [
        {
            "thumb"  : "/common/img/img1.jpg",
            "title"  : "子牧棉麻2017秋季新款民族风绣花长袖前短后长开叉圆领连衣裙6273 黑色 XL",
            "name"   : "红樱桃",
            "price"  : "￥4178.00",
            "sold"   : "4564",
            "collect": "564635"
        },
        {
            "thumb"  : "/common/img/img2.jpg",
            "title"  : "纯钻2017秋冬季新款女装韩版中长款蕾丝性感包臀连衣裙秋装女格子两件套套装裙子 灰色 M",
            "name"   : "红樱桃",
            "price"  : "￥4178.00",
            "sold"   : "4564",
            "collect": "564635"
        },
        {
            "thumb"  : "/common/img/img3.jpg",
            "title"  : "子牧棉麻2017秋季新款民族风绣花长袖前短后长开叉圆领连衣裙6273 黑色 XL",
            "name"   : "红樱桃",
            "price"  : "￥4178.00",
            "sold"   : "4564",
            "collect": "564635"
        },
        {
            "thumb"  : "/common/img/img4.jpg",
            "title"  : "子牧棉麻2017秋季新款民族风绣花长袖前短后长开叉圆领连衣裙6273 黑色 XL",
            "name"   : "红樱桃",
            "price"  : "￥4178.00",
            "sold"   : "4564",
            "collect": "564635"
        },
        {
            "thumb"  : "/common/img/img5.jpg",
            "title"  : "子牧棉麻2017秋季新款民族风绣花长袖前短后长开叉圆领连衣裙6273 黑色 XL",
            "name"   : "红樱桃",
            "price"  : "￥4178.00",
            "sold"   : "4564",
            "collect": "564635"
        },
        {
            "thumb"  : "/common/img/img6.jpg",
            "title"  : "子牧棉麻2017秋季新款民族风绣花长袖前短后长开叉圆领连衣裙6273 黑色 XL",
            "name"   : "红樱桃",
            "price"  : "￥4178.00",
            "sold"   : "4564",
            "collect": "564635"
        },
        {
            "thumb"  : "/common/img/img7.jpg",
            "title"  : "子牧棉麻2017秋季新款民族风绣花长袖前短后长开叉圆领连衣裙6273 黑色 XL",
            "name"   : "红樱桃",
            "price"  : "￥4178.00",
            "sold"   : "4564",
            "collect": "564635"
        },
        {
            "thumb"  : "/common/img/img8.jpg",
            "title"  : "子牧棉麻2017秋季新款民族风绣花长袖前短后长开叉圆领连衣裙6273 黑色 XL",
            "name"   : "红樱桃",
            "price"  : "￥4178.00",
            "sold"   : "4564",
            "collect": "564635"
        }
    ]
}




// let resp;
// const reqArtList = (url, userid) => {
//     $.ajax({
//         url: url + userid,
//         type: 'GET',
//         async: false,
//         success: function(data){
//             if (data.code == 200) {
//                 //console.log(data)
//                 resp = data;
//             }
//         },
//         error: function(xhr) {
//             console.log(xhr);
//         }
//     })
// }

// const reqUserId = (url, domain) => {
//     $.ajax({
//         url: url + domain,
//         type: 'GET',
//         async: false,
//         success: function(data) {
//             if (data.code == 200) {
//                 //console.log(data)
//                 let userid = data.data.plat_user_id;
//                 let info = {
//                     user_id: userid
//                 }
//                 reqArtList(ARTICLE_LIST + '?userId=', userid);
//             }
//         },
//         error: function(xhr) {
//             console.log(xhr);
//         }
//     })
// }

// let domain = window.location.pathname.split('/')[1];
// reqUserId('http://new.wezchina.com/api/pages/page/getDetailByDomain/', domain);

// const my_wemall = resp;