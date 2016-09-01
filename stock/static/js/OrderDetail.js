/**
 * Created by inksmallfrog on 2016/8/15.
 * 功能：描述订单管理模块
 */
function OrderDetail(){
}

OrderDetail.prototype.init = function(){
    this.toToday();

    $("#order-time-search-input").attr("placeholder", new Date().format("yyyy-MM-dd"));

    if(user.logged){
        $("#order-time-search-button").click(function(){
            order_detail.searchOrdersAtTime($("#order-time-search-input").val());
        });
    }

    $("#today-order-button").click(function(){
        $("#history-order-button").parents("li").removeClass("focus");
        $(this).parents("li").addClass("focus");

        order_detail.toToday();
    });

    $("#history-order-button").click(function(){
        $("#today-order-button").parents("li").removeClass("focus");
        $(this).parents("li").addClass("focus");

        order_detail.toHistory();
    })
};

OrderDetail.prototype.toToday = function(){
    if(user.logged){
        this.loadTodayOrders();
    }
    $(".order-time-search").hide();
};

OrderDetail.prototype.toHistory = function(){
    if(user.logged){
        this.loadHistoryOrders();
    }
    $(".order-time-search").show();
};

OrderDetail.prototype.loadOrders = function(date){
    var order_detail = this;
    /*
     * 读取订单信息
     * 发送目标：{root}/orders
     * 发送方式：post
     * 发送内容：user_id => 用户id
     *           date => 起始日期(为空代表加载所有订单)
     * 返回格式："json"
     * 期待返回内容：orders[] => 订单数组：order_id => 订单唯一id（用于撤销订单）
     *                                     id => 股票id（用于查询股票数据）
     *                                     code => 股票代码
     *                                     name => 股票名称
     *                                     type => 类型("股票" => 股票, "股指期货" => 股指期货)
     *                                     status => 订单指令("买入" => 买入, "卖出" => 卖出)
     *                                     count => 数量
     *                                     price => 订单价格
     *                                     finished => 完成状态("finished" => 已完成订单, "unfinished" => 未完成订单)
     */
    $.post("../orders", {user_id: user.id, date: date}, function(data){order_detail.bindData(data)}, "json");
};

OrderDetail.prototype.loadTodayOrders = function(){
    this.loadOrders(new Date().format("yyyy-MM-dd"));
};

OrderDetail.prototype.loadHistoryOrders = function(){
    this.loadOrders("");
};

OrderDetail.prototype.searchOrdersAtTime = function(time){
    this.loadOrders(time);
};

OrderDetail.prototype.bindData = function(data){
    var orders = data.orders;
    var content = order_top;
    for(var i = 0; i < orders.length; ++i){
        content += order_item.replace(/\{id}/g, orders[i].id)
                             .replace(/\{code}/g, orders[i].code)
                             .replace(/\{name}/g, orders[i].name)
                             .replace(/\{type}/g, orders[i].type)
                             .replace(/\{status}/g, orders[i].status)
                             .replace(/\{count}/g, orders[i].count)
                             .replace(/\{price}/g, (orders[i].price).toFixed(2))
                             .replace(/\{value}/g, (orders[i].price * orders[i].count).toFixed(2))
                             .replace(/\{order_id}/g, orders[i].order_id)
                             .replace(/\{finished}/g, orders[i].finished);
    }
    $(".orderdetail-container").html(content);

    $(".order-stock").click(function(){
       stock.changeStock($(this).attr("data"));
    });
    $(".order-undo").click(function(){
        if($(this).hasClass("unfinished")){
            order_detail.undo($(this).attr("data"));
            $(this).parents("li").remove();
        }
    });
};

OrderDetail.prototype.undo = function(order_id){
    /*
     * 撤销订单
     * 发送目标：{root}/orderundo
     * 发送方式：post
     * 发送内容：user_id => 用户id
     *           order_id => 订单id
     * 返回：无
     */
    $.post("../orderundo", {user_id: user.id, order_id: order_id});
};
