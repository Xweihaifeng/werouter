/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var business = {
    // business_order_list-获取订单列表
    order_list_api : '/china/order/business_order_list',
    // business_product_list-获取产品列表
    product_list_api : '/china/product/product_list',

    // business_product_add-获取全部可开通产品列表
    product_list_all_api : '/china/services/product',
    // business_product_add- 创建订单,并建立支付URL - POST 创建订单时如果是0元订单状态设置为2【已支付】
    product_order_create : '/china/order/create_product',
    // business_product_add- business_product_promotion  根据订单ID查询订单-GET['number']
    product_order_select : '/china/order/order_select',
    // business_product_add- 根据订单ID查询分配到那个被控端-GET['number']
    product_order_controlled : '/json/product_order_controlled.json',
    // business_product_add- 创建网站-POST['number'] , POST['domain'] , POST['plat_name']
    product_open : '/json/product_open.json',
    // business_product_add  business_product_promotion - 创建网站-GET['number'] 获取成功开通的网站
    product_web_info : '/china/product/product_web_info',


    // business_product_promotion - $GET['product_id']  $GET['edition_id'] - 获取可升级版本
    product_promotion_edition : '/china/product/product_promotion',
    // business_product_promotion - $GET['product_id']  $GET['edition_id'] - 创建升级版本订单
    product_promotion_order_create : '/china/order/create_product_promotion',

    //business_product_module - $GET['product_id']  $GET['edition_id'] - 获取可购买的模块
    product_module_list: '/china/product/module_list',
    //business_product_module - $POST['product_id']  $POST['edition_id'] $POST['module'] = [1,2] - 创建购买模块订单
    product_module_order_create: '/china/order/create_product_module',

    //business_solution 获取解决方案
    solution_list : '/china/solution/solution_list',

    //business_solution_add - 获取所有可以开通的解决方案
    solution_list_all_api :  '/china/services/solution',
    //business_solution_add - 解决方案订单查询
    solution_order_select : '/china/order/order_select',
    //business_solution_add- 创建订单,并建立支付URL $[解决方案ID ， 版本ID] - POST 创建订单时如果是0元订单状态设置为2【已支付】
    solution_order_create : '/china/order/create_solution',
    // 创建支付二维码
    solution_order_pay : '/wechatpay/china_business_pay',
    // business_solution_add- 根据订单ID查询分配到那个被控端-GET['number']
    solution_order_controlled : '/json/solution_order_controlled.json',
    // business_solution_add- 创建网站-POST['number'] , POST['domain'] , POST['plat_name']
    solution_open : '/json/solution_open.json',
    // business_solution_add  - 创建网站-GET['number'] 获取成功开通的网站
    solution_web_info : '/china/solution/solution_web_info',

    // business_solution_promotion - $GET['solution_id']  $GET['edition_id'] - 获取可升级版本
    solution_promotion_edition : '/china/solution/solution_promotion',
    // business_solution_promotion - $GET['solution_id']  $GET['edition_id'] - 创建升级版本订单
    solution_promotion_order_create : '/china/order/create_solution_promotion',

}; 
