/**
 * Created by inksmallfrog on 2016/8/16.
 * 功能：描述账户管理模块
 */

function Account(){
    this.has_account = {"stock": false, "future": false};
}

Account.prototype.init = function(){
    this.loadAccount("stock");
    this.loadAccount("future");

    $(".account-id-add").click(function(){
        account.changeAddType($(this).attr("data"));
    });

    $(".account-type-button").click(function(){
        account.changeAddType($(this).attr("data"));
    });

    $(".account-add-button").click(function(){
        account.addAccount();
    });

    $(".account-quit-button").click(function(){
        account.quitAccount($(this).attr("data"));
    })
};

Account.prototype.update = function(){
    if(this.has_account["stock"]){
        this.loadAccountData("stock");
    }
    if(this.has_account["future"]){
        this.loadAccountData("future");
    }
};

//获取用户绑定的账户
Account.prototype.loadAccount = function(type){
    if(user.logged){
        /*
         * 获取用户绑定的账户
         * 发送目标：{root}/getuseraccount
         * 发送方式：post
         * 发送内容：user_id => 用户id
         *           type => 账户类型("stock" => 股票账号, "future" => 期货账号)
         * 返回格式：字符串
         * 期待返回内容：对应的账号id
         */
        $.post("../getuseraccount", {user_id: user.id, type: type}, function(data){
               if(typeof data.error == "undefined"){
                    account.has_account[type] = true;
                   $("#account-" + type + "-id").html(data.id);
                   $(".has-account-" + type).show();
                   $(".has-no-account-" + type).hide();
                   $("#account-type-" + type).addClass("disable");
                   if(user.logged){
                       trade.tradeAvailable(type);
                   }
               }
               else{
                   $(".has-no-account-" + type).show();
                   $(".has-account-" + type).hide();
                   if(user.logged){
                       trade.tradeDisavailable(type);
                   }
               }
               account.loadAccountData(type);
        }, "json")
    }
};

Account.prototype.loadAccountData = function(type){
    if(this.has_account[type]){
        /*
         * 获取用户账号详细数据
         * 发送目标：{root}/getaccountdata
         * 发送方式：post
         * 发送内容：user_id => 用户id
         *           type => 账户类型("stock" => 股票账号, "future" => 期货账号)
         *           account => 账号id
         * 返回格式：json
         * 期待返回内容：balance => 可用资金
          *              freezing => 冻结资金
          *              market => 总市值
          *              total => 总资金
          *              profit => 盈利
          *              detail[] => 持有股票状态数组: code => 持有股票的代码
          *                                             name => 持有股票的名称
          *                                             price => 持有股票的价格
          *                                             cost => 持有股票的成本
          *                        vol => 持有股票的数量
         */
        $.post("../getaccountdata", {user_id: user.id, type: type, account: $("#account-" + type + "-id").html()}, function(data){
            account.bindData(data, type);
        }, "json");
    }
    else{
        this.bindEmptyData(type);
    }
};

Account.prototype.bindEmptyData = function(type){
    $("#account-detail-" + type + "-balance").html(0);
    $("#account-detail-" + type + "-freezing").html(0);
    $("#account-detail-" + type + "-market").html(0);
    $("#account-detail-" + type + "-total").html(0);
    $("#account-detail-" + type + "-profit").html(0);

    var content = "";
    var count = 0;
    for(; count < 12; ++count){
        content += account_market_item.replace(/\{code}/g, "")
            .replace(/\{name}/g, "")
            .replace(/\{price}/g, "")
            .replace(/\{cost}/g, "")
            .replace(/\{market}/g, "")
            .replace(/\{vol}/g, "")
            .replace(/\{profit}/g, "");
    }

    $("#account-market-" + type + "-box").html(content);
};

Account.prototype.bindData = function(data, type){
    $("#account-detail-" + type + "-balance").html(numberWithCommas(data.balance));
    $("#account-detail-" + type + "-freezing").html(numberWithCommas(data.freezing));
    $("#account-detail-" + type + "-market").html(numberWithCommas(data.vol * data.price));
    $("#account-detail-" + type + "-total").html(numberWithCommas(data.total));
    $("#account-detail-" + type + "-profit").html(numberWithCommas(data.vol * (data.price - data.cost)));

    var content = "";
    var count = 0;
    var detail = data.detail;

    for(; count < detail.length; ++count){
        content += account_market_item.replace(/\{code}/g, detail[count].code)
            .replace(/\{name}/g, detail[count].name)
            .replace(/\{price}/g, (detail[count].price).toFixed(2))
            .replace(/\{cost}/g, (detail[count].cost).toFixed(2))
            .replace(/\{market}/g, detail[count].market)
            .replace(/\{vol}/g, detail[count].vol)
            .replace(/\{profit}/g, (detail[count].profit).toFixed(2));
    }
    for(; count < 12; ++count){
        content += account_market_item.replace(/\{code}/g, "")
            .replace(/\{name}/g, "")
            .replace(/\{price}/g, "")
            .replace(/\{cost}/g, "")
            .replace(/\{market}/g, "")
            .replace(/\{vol}/g, "")
            .replace(/\{profit}/g, "");
    }

    $("#account-market-" + type + "-box").html(content);
};

Account.prototype.changeAddType = function(type){
    if(!this.has_account[type]){
        $(".account-add-type").children(".focus").removeClass("focus");
        $("#account-type-" + type).addClass("focus");
    }
};

Account.prototype.addAccount = function(){
    var type = $(".account-add-type").children(".focus").attr("data");
    /*
     * 为用户绑定账号
     * 发送目标：{root}/addaccount
     * 发送方式：post
     * 发送内容：user_id => 用户id
     *           type => 账户类型("stock" => 股票账号, "future" => 期货账号)
     *           brokerage => 券商
     *           id => 账号
     *           pwd => 密码
     * 返回：无
     */
    $.post("../addaccount", {user_id: user.id,
        type: type,
        brokerage: $("#account-add-brokerage").val(),
        id: $("#account-add-id").val(),
        pwd: $("#account-add-pwd").val()},
        function(){
            account.loadAccount(type);
    });
};

Account.prototype.quitAccount = function(type){
    /*
     * 解除用户和账号的绑定
     * 发送目标：{root}/quitaccount
     * 发送方式：post
     * 发送内容：user_id => 用户id
     *           type => 账户类型("stock" => 股票账号, "future" => 期货账号)
     *           id => 账号
     * 返回：无
     */
    $.post("../quitaccount", {user_id: user.id, type: type, id: $("#account-" + type + "-id").html()}, function(){
        $("#account-type-" + type).removeClass("disable");
        $(".has-no-account-" + type).show();
        $(".has-account-" + type).hide();
        account.bindEmptyData(type);
        account.has_account[type] = false;
        trade.tradeDisavailable(type);
    });
};

Account.prototype.show = function(){
    strategies.hide();
    $(".accounts-panel").removeClass("hide-right");
};

Account.prototype.hide = function(){
    $(".accounts-panel").addClass("hide-right");
};