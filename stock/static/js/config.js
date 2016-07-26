/**
 * Created by inksmallfrog on 2016/7/26.
 */

//主页面内容
var container_content = {
    market: "<div class='title'>行情资讯</div> <div class='echart' id='candlestick'></div> <div class='echart' id='volume'></div>",
    strategies : ""
};

//选股策略
var strategies = {
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
//策略选择图标
var UNCHECKED_ICON = "assets/icons/strategy_unchecked.png";
var CHECKED_ICON = "assets/icons/strategy_checked.png";
//最大选择策略数
var MAX_STRATEGIES_COUNT = 3;


//定位栏内容
var position_bar_data = {
    market: {
        '顶部': 0,
        'A股行情': 120,
        '期货行情': 330,
        '底部' : $(".scrollable")[0].scrollHeight - $(window).height()
    },  //Just for test
    strategies: {
        '顶部': 0,
        '策略A': 120,
        '策略B': 330,
        '底部' : $(".scrollable")[0].scrollHeight - $(window).height()
    }  //Just for test
};


//定位栏固定前的下移高度
var fixed_position_bar_pos = 400;