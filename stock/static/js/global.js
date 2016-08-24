/**
 * Created by inksmallfrog on 2016/8/10.
 * 功能：处理初始化事件
 */

var user;            //用户对象
var stock;              //股票对象

var header;             //导航头模块对象
var selfstock;          //自选股模块对象
var stock_detail;       //股票详情模块对象
var trade;
var order_detail;
var account;
var strategies;

$(document).ready(function(){
    user = new User();
    stock = new Stock();

    header = new Header();
    selfstock = new SelfStock();
    stock_detail = new StockDetail();
    trade = new Trade();
    order_detail = new OrderDetail();
    account = new Account();
    strategies = new Strategies();

    user.init();
    stock.init();

    header.init();
    selfstock.init();
    stock_detail.init();
    trade.init();
    order_detail.init();
    account.init();
    strategies.init();

    stock_detail.show();

    $(window).resize(function(){
        header.resizeUnderline();
        stock_detail.stock_graph.stock_chart.resize();
    });

    stock.changeStock("000001SH");
    setInterval("update()", UPDATE_TIMEOUT);
});

//全局更新函数，调用间隔：UPDATE_TIMEOUT
function update(){
    stock.update();

    header.update();
    trade.update();
    account.update();
}
