/**
 * Created by inksmallfrog on 2016/8/14.
 * 功能：描述交易模块
 */
function Trade(){
    this.trade_target = "";
    this.stockid = "000001SH";
    this.futureid = "IF1608";
}

Trade.prototype.init = function(){
    var trade_price_input = $("#trade-" + this.trade_target + "-price-input");
    $(".trade-stock-price-select").click(function(){
        $("#trade-stock-price-input").val($(this).children(".price").html());
    });
    $(".trade-future-price-select").click(function(){
        $("#trade-future-price-input").val($(this).children(".price").html());
    });
    $(".trade-future-price-icon").click(function(){
        var trade_price_input = $("#trade-future-price-input");
        trade_price_input.val((Number(trade_price_input.val()) + Number($(this).attr("data"))).toFixed(2));
    });
    $(".trade-stock-price-icon").click(function(){
        var trade_price_input = $("#trade-stock-price-input");
        trade_price_input.val(Math.max(Number(trade_price_input.val()) + Number($(this).attr("data")), 0).toFixed(2));
    });

    var trade = this;
    $("#trade-target-future").click(function(){
        if(trade.trade_target != "future"){
            trade.toFuture();
            $("#trade-target-stock").removeClass("focus");
            $(this).addClass("focus");
            trade.trade_target = "future";
        }
    });
    $("#trade-target-stock").click(function(){
        if(trade.trade_target != "stock"){
            trade.toStock();
        }
    });
    if(!user.logged){
        var trade_button_buy = $(".trade-button-buy");
        trade_button_buy.attr("data-toggle", "modal");
        trade_button_buy.attr("data-target", "#login-register");
        var trade_button_bid = $(".trade-button-bid");
        trade_button_bid.attr("data-toggle", "modal");
        trade_button_bid.attr("data-target", "#login-register");
    }
    var trade_future_input = $("#trade-future-input");
    trade_future_input.focus(function(){
       $("#trade-future-code").hide();
       $("#trade-future-name").hide();
    });
    trade_future_input.change(function(){
        trade.futureid = $(this).val();
        trade.update();
    });
    trade_future_input.focusout(function(){
        $(this).val("");
        $("#trade-future-code").show();
        $("#trade-future-name").show();
    });

    var trade_stock_input = $("#trade-stock-input");
    trade_stock_input.focus(function(){
        $("#trade-stock-code").hide();
        $("#trade-stock-name").hide();
    });
    trade_stock_input.change(function(){
        trade.stockid = $(this).val();
        trade.update();
    });
    trade_stock_input.focusout(function(){
        $(this).val("");
        $("#trade-stock-code").show();
        $("#trade-stock-name").show();
    });
    $(".future-trade-button").click(function(){
        $(this).parents(".trade-container-right").children(".focus").removeClass("focus");
        $(this).addClass("focus");
    });

    this.toStock();
};

Trade.prototype.tradeAvailable = function(type){
    var trade_button_buy = $("#" + type + "-trade-button-buy");
    trade_button_buy.attr("data-toggle", "");
    trade_button_buy.unbind("click");
    trade_button_buy.click(function(){
        trade.buy();
    });
    var trade_button_bid = $("#" + type + "-trade-button-bid");
    trade_button_bid.attr("data-toggle", "");
    trade_button_bid.unbind("click");
    trade_button_bid.click(function(){
        trade.bid();
    });
};

Trade.prototype.tradeDisavailable = function(type){
    var trade_button_buy = $("#" + type + "-trade-button-buy");
    trade_button_buy.attr("data-toggle", "modal");
    trade_button_buy.attr("data-target", "#account-add");
    trade_button_buy.unbind("click");
    trade_button_buy.click(function(){
       account.changeAddType(type);
    });
    var trade_button_bid = $("#" + type + "-trade-button-bid");
    trade_button_bid.attr("data-toggle", "modal");
    trade_button_bid.attr("data-target", "#account-add");
    trade_button_bid.unbind("click");
    trade_button_bid.click(function(){
        account.changeAddType(type);
    });

};

Trade.prototype.update = function(){
    if(this.trade_target == "future"){
        this.updateFuture();
    }
    else{
        this.updateStock();
    }
};

Trade.prototype.updateFuture = function(){
    /*
     * 获得期货数据
     * 发送目标：{root}/tradefutureinfo
     * 发送方式：post
     * 发送内容：user_id => 用户id
     *           id => 期货id
     * 返回格式： json
     * 期待返回内容：code => 期货代码
     *               name => 期货名称
     *               price => 期货现价
     *               buy => 买入价
     *               bid => 卖出价
     *               vol_max => 该用户最大交易量
     *               available_money => 用户期货账户可用资金
     *               trade_unit => 期货交易的单位(即xxx人民币/手中的xxx)
     */
    $.post("../tradefutureinfo", {user_id: user.id, id: this.futureid}, function(future){
        $("#trade-future-code").html(future.code);
        $("#trade-future-name").html(future.name);
        var trade_price_input = $("#trade-future-price-input");
        if(trade_price_input.val() == ""){
            trade_price_input.val((future.price).toFixed(2));
        };
        $("#trade-future-price-tip-buy").children().children(".price").html((future.buy).toFixed(2));
        $("#trade-future-price-tip-bid").children().children(".price").html((future.bid).toFixed(2));
        $("#trade-future-vol").html("最大" + future.vol_max + "手");

        $(".available-money-value").html(future.available_money);
        $(".trade-unit-value").html(future.trade_unit);
    }, "json");
};

Trade.prototype.updateStock = function(){
    /*
     * 获得股票数据
     * 发送目标：{root}/tradestockinfo
     * 发送方式：post
     * 发送内容：user_id => 用户id
     *           id => 股票id
     * 返回格式： json
     * 期待返回内容：code => 股票代码
     *               name => 股票名称
     *               price => 股票现价
     *               min => 跌停价
     *               max => 涨停价
     *               vol_has => 该用户当前持有量
     *               bid5 => 卖5价
     *               bid5vol => 卖5量
     *               bid4 => 卖4价
     *               bid4vol => 卖4量
     *               bid3 => 卖3价
     *               bid3vol => 卖3量
     *               bid2 => 卖2价
     *               bid2vol => 卖2量
     *               bid1 => 卖1价
     *               bid1vol => 卖1量
     *               buy5 => 买5价
     *               buy5vol => 买5量
     *               buy4 => 买4价
     *               buy4vol => 买4量
     *               buy3 => 买3价
     *               buy3vol => 买3量
     *               buy2 => 买2价
     *               buy2vol => 买2量
     *               buy1 => 买1价
     *               buy1vol => 买1量
     */
    $.post("../tradestockinfo", {user_id: user.id, id: this.stockid}, function(stock){
        $(".stock-info-code").html(stock.code);
        $(".stock-info-name").html(stock.name);
        var trade_price_input = $(".trade-price-input");
        if(trade_price_input.val() == ""){
            trade_price_input.val((stock.price).toFixed(2));
        };
        $(".trade-price-tip-min").children().children(".price").html((stock.min).toFixed(2));
        $(".trade-price-tip-max").children().children(".price").html((stock.max).toFixed(2));
        $(".trade-counts-has").html("持有" + stock.vol_has + "股");

        var bid5 = $("#bid5");
        var bid5_price = bid5.children(".price");
        bid5_price.html((stock.bid5).toFixed(2));
        setTextColor(bid5_price, stock.bid5, stock.price);
        bid5.children(".counts").html(stock.bid5vol);

        var bid4 = $("#bid4");
        var bid4_price = bid4.children(".price");
        bid4_price.html((stock.bid4).toFixed(2));
        setTextColor(bid4_price, stock.bid4, stock.price);
        bid4.children(".counts").html(stock.bid4vol);

        var bid3 = $("#bid3");
        var bid3_price = bid3.children(".price");
        bid3_price.html((stock.bid3).toFixed(2));
        setTextColor(bid3_price, stock.bid3, stock.price);
        bid3.children(".counts").html(stock.bid3vol);

        var bid2 = $("#bid2");
        var bid2_price = bid2.children(".price");
        bid2_price.html((stock.bid2).toFixed(2));
        setTextColor(bid2_price, stock.bid2, stock.price);
        bid2.children(".counts").html(stock.bid2vol);

        var bid1 = $("#bid1");
        var bid1_price = bid1.children(".price");
        bid1_price.html((stock.bid1).toFixed(2));
        setTextColor(bid1_price, stock.bid1, stock.price);
        bid1.children(".counts").html(stock.bid1vol);

        var buy5 = $("#buy5");
        var buy5_price = buy5.children(".price");
        buy5_price.html((stock.buy5).toFixed(2));
        setTextColor(buy5_price, stock.buy5, stock.price);
        buy5.children(".counts").html(stock.buy5vol);

        var buy4 = $("#buy4");
        var buy4_price = buy4.children(".price");
        buy4_price.html((stock.buy4).toFixed(2));
        setTextColor(buy4_price, stock.buy4, stock.price);
        buy4.children(".counts").html(stock.buy4vol);

        var buy3 = $("#buy3");
        var buy3_price = buy3.children(".price");
        buy3_price.html((stock.buy3).toFixed(2));
        setTextColor(buy3_price, stock.buy3, stock.price);
        buy3.children(".counts").html(stock.buy3vol);

        var buy2 = $("#buy2");
        var buy2_price = buy2.children(".price");
        buy2_price.html((stock.buy2).toFixed(2));
        setTextColor(buy2_price, stock.buy2, stock.price);
        buy2.children(".counts").html(stock.buy2vol);

        var buy1 = $("#buy1");
        var buy1_price = buy1.children(".price");
        buy1_price.html((stock.buy1).toFixed(2));
        setTextColor(buy1_price, stock.buy1, stock.price);
        buy1.children(".counts").html(stock.buy1vol);
    }, "json");
};

Trade.prototype.toFuture = function(){
    if(this.trade_target != "future"){
        $("#trade-stock").hide();
        $("#trade-future").show();
        this.trade_target = "future";
        $("#trade-target-stock").removeClass("focus");
        $("#trade-target-future").addClass("focus");
        this.update();
    }
};

Trade.prototype.toStock = function(){
    if(this.trade_target != "stock"){
        $("#trade-future").hide();
        $("#trade-stock").show();
        this.trade_target = "stock";
        $("#trade-target-future").removeClass("focus");
        $("#trade-target-stock").addClass("focus");
        this.update();
    }
};

Trade.prototype.trade = function(action){
    /*
     * 发送交易请求
     * 发送目标：{root}/trade
     * 发送方式：post
     * 发送内容：user_id => 用户id
     *           id => 股票/期货id
     *           price => 价格
     *           counts => 数量
     *           option => 期货交易类型(仅当交易期货时有数据，"limited_price" => 限价， "market_price" => 市价， "stop_price" => 止损价)
     *           type => 类型("future" => 期货, "stock" => 股票)
     *           action => 执行动作("buy" => 买入, "bid" => 卖出)
     * 返回：无
     */
    var option = "";
    if(this.trade_target == "future"){
        option = $("#trade-future-container-right").children("focus").attr("data");
    }
    $.post("../trade", {user_id: user.id, id: stock.id, price: $(".trade-price-input").val(), counts: $(".trade-counts-input").val(), action: action, type: trade.trade_target, option: option});
};

Trade.prototype.buy = function(){
    this.trade("buy");
};

Trade.prototype.bid = function(){
    this.trade("bid");
};