

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
        var ss = this.state.carts.filter(function(item){
            return item.id ==id;
        })
        if(ss && ss[0].buy_num <= 1 ) return false
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
            <div>
                {this.state.empty  && <EmptyCart />}
                {!this.state.empty &&
                <div id="J_cartBox" className="">
                    <div className="cart-goods-list">
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
            <div className="cart-bar text-center">
                <div className="section-left">
                    <span className="cart-total">共 <i>{allNum}</i> 件商品，已选择 <i>{hasSelect}</i> 件</span>
                </div>
                <span className="money">合计：￥<em>{allMoney}</em>元</span>
                <a href="/wechat/indent/order" className="weui_btn weui_btn_warn">提交订单</a>
            </div>
        )
    }
})

var CartList = React.createClass({
    render:function(){
        var cart = this.props.cart;
        var href = 'wechat/goods/' + cart.goods_id;
        var cover = '/' + cart.good.cover;
        var check = cart.status > 0
            ? <i className="iconfont icon-checkbox icon-checkbox-selected J_itemCheckbox">√</i>
            : <i className="iconfont icon-checkbox icon-checkbox  J_itemCheckbox">√</i>
        var inputWidth={
            'width':'50px'
        };

        return (
            <div className="item-box">
                        <div className="avatar">
                            <a href={href} target="_blank">
                                <img alt=""  src={cover} /></a>
                        </div>
                <div className="center">
                    <p>  <a href={href} target="_blank"> {cart.good.title} </a>  </p>
                    <p className="money">  ￥{cart.good.money}元 </p>
                    <div className="change">
                        <a href="javascript:;" onClick={()=>this.props.down(cart.id)}  className="J_minus"><i className="fa fa-minus-circle"></i></a>
                        <input type="text" value={cart.buy_num}  />
                        <a href="javascript:;" onClick={()=>this.props.up(cart.id)} className="J_plus"><i className="fa fa-plus-circle"></i></a>
                    </div>

                </div>
                    <div className="del">
                            <a  href="javascript:;" onClick={()=>this.props.del(cart.id)} title="删除"><i className="weui_icon_cancel"></i></a>
                  </div>
            </div>
        )
    }
});

var EmptyCart = React.createClass({
    render:function(){
        return (
            <div className="cart-empty">
                <i className="fa fa-shopping-cart"></i>
                <p>您的购物车还是空的！</p>
                <a href="/wechat" className="weui_btn weui_btn_warn">马上去购物</a>
            </div>
        )
    }
})



ReactDOM.render(
    <CartApp />,
    document.getElementById('cart-list')
);