var win = {
    list : {
        'business_order': '/user/business/product',
        'business_product': '/user/business/product',
        'business_product_module': '/user/business/product/module',
        'business_product_add': '/user/business/product/add',
        'business_product_promotion': '/user/business/product/promotion',
        'business_solution': '/user/business/solution',
        'business_solution_add': '/user/business/solution/add',
        'business_solution_promotion': '/user/business/solution/promotion',
    },
    openWin: (val , params)=>{
        var dataJson = JSON.stringify(params);
        localStorage.setItem('params' , dataJson);
        window.location.href = win.list[val];
    },
    getParams: (val)=>{
        var dataString = localStorage.getItem('params');

        if (dataString == null || dataString == 'undefined')
        {
            return false;
        }
        var dataJson = JSON.parse(dataString);
        localStorage.removeItem('params');
        return dataJson;

    },
    hrefWin:(val , params)=>{
        var dataJson = JSON.stringify(params);
        localStorage.setItem('params' , dataJson);
        window.open(win.list[val]);
    },
    setStorage:(val , params)=>{
        var dataJson = JSON.stringify(params);
        localStorage.setItem(val , dataJson);
    },
    getStorage:(val)=>{
        var dataString = localStorage.getItem(val);
        if (dataString == null || dataString == 'undefined')
        {
            return false;
        }
        var dataJson = JSON.parse(dataString);
        return dataJson;
    }
}
