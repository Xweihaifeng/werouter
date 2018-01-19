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
                resp = data.data.list;
                console.log(resp)
            }
        },
        error: function(xhr) {
            console.log(xhr);
        }
    })
}

//alert(localStorage.getItem('token'))
let type = 2;
let dynamic_type = 4; //shopping
reqDynamicList(apiUrl + 'circel/dynamic?type=' + type + '&dynamic_type=' + dynamic_type);

const mock_shop = resp;


/*
var mock_shop = [
    {
        avatar: "/common/img/img1.jpg",
        name: "红樱桃",
        intro: "jegesiman2017秋冬季女装新款中长款韩版长袖连衣裙女 樱桃红 XL",
        show: ["/common/img/img2.jpg", "/common/img/img3.jpg", "/common/img/img4.jpg"],
        cover: "/common/img/img5.jpg",
        title: "子牧棉麻2017秋季新款民族风绣花长袖前短后长开叉圆领连衣裙6273 黑色 XL",
        price: "4178.00",
        sold: "999",
        like: "5150",
        time: "24分钟前"
    },{
        avatar: "/common/img/img6.jpg",
        name: "红樱桃",
        intro: "jegesiman2017秋冬季女装新款中长款韩版长袖连衣裙女 樱桃红 XL",
        show: ["/common/img/img7.jpg", "/common/img/img8.jpg", "/common/img/img9.jpg"],
        cover: "/common/img/img10.jpg",
        title: "子牧棉麻2017秋季新款民族风绣花长袖前短后长开叉圆领连衣裙6273 黑色 XL",
        price: "4178.00",
        sold: "999",
        like: "5150",
        time: "24分钟前"
    }
]*/
