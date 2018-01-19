

var CartApp = React.createClass({
    getInitialState : function(){
        return {carts:[],allMoney:0,score:0,now_score:'',empty:false}
    },
    handleFetchcarts : function(){
        $.ajax({
            url:'/cart/ajaxCarts',
            type:'get',
            dataType : 'json',
            success : this.handleSetDatas
        });

    },
    handleSetDatas : function(json) {
        console.log(json);
        if(json.state=='404') {
            return false;
        }else{
            var empty = json.carts.length<1 ? true :false;

            this.setState({carts : json.carts,allMoney:json.allMoney,empty:empty});
        }
    },
    handelDel : function(id) {
        $.ajax({
            url :'/cart/'+ id,
            type:'delete',
            dataType : 'json',
            success : this.handleSetDatas
        });
    },
    handleUp : function(id) {
        $.ajax({
            url :'/cart/ajaxUp/'+ id,
            type:'get',
            dataType : 'json',
            success : this.handleSetDatas
        });
    },
    handleDown:function(id) {
        $.ajax({
            url :'/cart/ajaxDown/'+ id,
            type:'get',
            dataType : 'json',
            success : this.handleSetDatas
        });
    },
    handleSelect:function(id) {
        $.ajax({
            url :'/cart/ajaxSelect/'+ id,
            type:'get',
            dataType : 'json',
            success : this.handleSetDatas
        });
    },

    componentWillMount : function(){
        this.handleFetchcarts();
    },
    render:function(){
        var lists = this.state.carts.map(function(item,index){
             return <CartList cart = {item} key = {index} up = {this.handleUp} down = {this.handleDown} del = {this.handelDel} sel ={this.handleSelect}/>
        },this);
        return (
            <div className="container">
                {this.state.empty  && <EmptyCart />}
                {!this.state.empty &&
                <div id="J_cartBox" className="">
                    <div className="cart-goods-list">
                        <CartHeader />
                        <div className="list-body">
                            {lists}
                        </div>

                    </div>
                    <CartFooter allMoney = {this.state.allMoney} carts = {this.state.carts}/>
                </div>

                    }
            </div>
        );
    }

});
var CartHeader = React.createClass({
    render:function(){
        return (
            <div className="list-head clearfix">
                <div className="col col-check text-center">选择</div>
                <div className="col col-img">商品图片</div>
                <div className="col col-name">商品名称</div>
                <div className="col col-price">单价</div>
                <div className="col col-num">数量</div>
                <div className="col col-total">小计</div>
                <div className="col col-action">操作</div>
            </div>
        )
    }
});


var CartFooter = React.createClass({
    render:function(){
        var allMoney = this.props.allMoney;
        var carts = this.props.carts;

        var btnCss = allMoney > 0
                    ? 'btn-mi btn-mi-a btn-mi btn-mi-primary'
                    : 'btn-mi btn-mi-a btn-mi btn-mi-disabled';

        var showTip = allMoney > 0 ? 'no-select-tip hide' : 'no-select-tip';
        var allNum = carts.length;
        var hasSelect = carts.filter(function(item){
                    return item.status == 1;
        }).length;
        return (
            <div className="cart-bar clearfix">
                <div className="section-left">
                    <a href="/" className="back-shopping J_goShoping">继续购物</a>
                    <span className="cart-total">共 <i>{allNum}</i> 件商品，已选择 <i>{hasSelect}</i> 件</span>
                </div>
                <span className="total-price">合计：<em>{allMoney}</em>元</span>
                <a href="/indent/order" className={btnCss}>去结算</a>

                <div className={showTip}>
                    请勾选需要结算的商品
                    <i className="arrow arrow-a"></i>
                    <i className="arrow arrow-b"></i>
                </div>
            </div>
        )
    }
})

var CartList = React.createClass({
    render:function(){
        var cart = this.props.cart;
        var href = 'goods/' + cart.goods_id;
        var cover = '/' + cart.good.cover;
        var check = cart.status > 0
                ? <i className="iconfont icon-checkbox icon-checkbox-selected J_itemCheckbox">√</i>
                : <i className="iconfont icon-checkbox icon-checkbox  J_itemCheckbox">√</i>


        return (
            <div className="item-box">
                <div className="item-table J_cartGoods">
                    <div className="item-row clearfix">
                        <div className="col col-check"  onClick={()=>this.props.sel(cart.id)} >{check}</div>
                        <div className="col col-img">
                            <a href={href} target="_blank">
                                <img alt=""  src={cover} /></a>
                        </div>
                        <div className="col col-name">
                            <div className="tags">   </div>
                            <h3 className="name">  <a href={href} target="_blank"> {cart.good.title} </a>  </h3>
                            <p className="desc"> {cart.good.summary} </p>
                        </div>
                        <div className="col col-price">  {cart.good.money}元 </div>
                        <div className="col col-num">
                            <div className="change-goods-num clearfix J_changeGoodsNum">
                                <a href="javascript:;" onClick={()=>this.props.down(cart.id)}  className="J_minus"><i className="iconfont"></i></a>
                                <input tyep="text" value={cart.buy_num} className="goods-num J_goodsNum" />
                                    <a href="javascript:;" onClick={()=>this.props.up(cart.id)} className="J_plus"><i className="iconfont"></i></a>
                            </div>
                        </div>
                        <div className="col col-total">  {cart.good.money * cart.buy_num}元 <p className="pre-info">  </p> </div>
                        <div className="col col-action">
                            <a  href="javascript:;" onClick={()=>this.props.del(cart.id)} title="删除" className="del J_delGoods"><i className="iconfont"></i></a>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
});

var EmptyCart = React.createClass({
    render:function(){
        return (
            <div className="cart-empty">
                <h2>您的购物车还是空的！</h2>
                <a href="/" className="btn-mi btn-mi-primary btn-mi-shoping J_goShoping">马上去购物</a>
            </div>
        )
    }
})



ReactDOM.render(
    <CartApp />,
    document.getElementById('cart-list')
);