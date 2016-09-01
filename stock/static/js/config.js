/**
 * Created by inksmallfrog on 2016/8/10.
 * 功能：用于设置配置信息
 */
var INIT_STOCK_ID = "000001SH";                                 //默认显示的股票id

var ICON_LOGGED = "../static/assets/icons/logged.png";          //登录后的头像
var ICON_UNLOGGED = "../static/assets/icons/unlogged.png";      //登录前的头像

var UPDATE_TIMEOUT = 5000;                                      //更新时间，单位:ms

//策略选择图标
var UNCHECKED_ICON = "../static/assets/icons/strategy_unchecked.png";
var CHECKED_ICON = "../static/assets/icons/strategy_checked.png";
var MAX_STRATEGIES_COUNT = 3;

//选股策略
var strategies_config = {
    "multifactor":{
        name: "多因子模型",
        factors:{
            "revenu": "盈利收益率",
            "market_value": "市值比",
            "roa": "ROA变动"
        }
    },
    "fundsflow":{
        name: "资金流模型",
        factors:{
            "revenu": "盈利收益率",
            "market_value": "市值比",
            "roa": "ROA变动"
        }
    },
    "bargainning":{
        name: "筹码选股模型",
        factors:{
            "revenu": "盈利收益率",
            "market_value": "市值比",
            "roa": "ROA变动"
        }
    },
    "inverse_momentum":{
        name: "动量反转模型",
        factors:{
            "revenu": "盈利收益率",
            "market_value": "市值比",
            "roa": "ROA变动"
        }
    },
    "style_wheeled":{
        name: "风格轮动模型",
        factors:{
            "revenu": "盈利收益率",
            "market_value": "市值比",
            "roa": "ROA变动"
        }
    }
};

//时间格式化函数
Date.prototype.format =function(format)
{
    var o = {
        "M+" : this.getMonth()+1, //month
        "d+" : this.getDate(), //day
        "h+" : this.getHours(), //hour
        "m+" : this.getMinutes(), //minute
        "s+" : this.getSeconds(), //second
        "q+" : Math.floor((this.getMonth()+3)/3), //quarter
        "S" : this.getMilliseconds() //millisecond
    }
    if(/(y+)/.test(format)) format=format.replace(RegExp.$1,
        (this.getFullYear()+"").substr(4- RegExp.$1.length));
    for(var k in o)if(new RegExp("("+ k +")").test(format))
        format = format.replace(RegExp.$1,
            RegExp.$1.length==1? o[k] :
                ("00"+ o[k]).substr((""+ o[k]).length));
    return format;
};

//设置颜色
setTextColor = function(node, price, close){
    var is_up = 0;
    if(Number(price) > Number(close)){
        is_up = 1;
    }
    else if(Number(price) < Number(close)){
        is_up = -1;
    }
    node.removeClass("price-up");
    node.removeClass("price-down");
    if(is_up == 1){
        node.addClass("price-up");
    }
    else if(is_up == -1){
        node.addClass("price-down");
    }
};

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}