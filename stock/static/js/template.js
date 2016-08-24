/**
 * Created by inksmallfrog on 2016/8/11.
 * 功能：模板
 */
var selfstock_unlogged = '<li class="selfstock-item"><a href="#" data-toggle="modal" data-target="#login-register"><span class="stock-login">您尚未登录</span></a></li>';

var selfstock_eachstock = '<li class="selfstock-item"><a href="#" class="selfstock-item-detail" id="selfstock-{id}" data="{id}"><span class="stock-id">{code}</span><span class="stock-name">{name}</span></a><a href="#" class="delete-icon" data="{id}"><img src="../static/assets/icons/delete.png"></a></li>';

var selfstock_addstock = '<li class="selfstock-item selfstock-last-item"><a href="#" id="selfstock-add"><span class="stock-add">添加自选股</span></a></li>' +
                          '<select class="selfstock-select"><option value="" disabled selected>请输入股票名称或代码</option>';

var stocklist_select = '<select class="stocklist-select"><option value="" disabled selected>请输入股票名称或代码</option>';


var price_img = '<img id="price-arrow" src="../static/assets/icons/{price_status}.png">';

var order_top = '<li class="orderdetail-top"><span class="order-code">代码</span><span class="order-name">名称</span><span class="order-type">类别</span><span class="order-status">状态</span><span class="order-count">数量</span><span class="order-price">价格</span><span class="order-value">市值</span></li>';
var order_item = '<li class="orderdetail-item">' +
                '<a href="#" data-toggle="dropdown">' +
                    '<span class="order-code">{code}</span>' +
                    '<span class="order-name">{name}</span>' +
                    '<span class="order-type">{type}</span>' +
                    '<span class="order-status">{status}</span>' +
                    '<span class="order-count">{count}</span>' +
                    '<span class="order-price">{price}</span>' +
                    '<span class="order-value">{value}</span>' +
                '</a>' +
                '<ul class="dropdown-menu order-option-menu" role="menu">' +
                    '<div class="up-triangle"></div>' +
                    '<li><a href="#" class="order-stock" data="{id}">查看</a></li>' +
                    '<li><a href="#" class="order-undo {finished}" data="{order_id}">撤销</a></li>' +
                '</ul></li>';

var account_market_item = '<li class="account-market-item">' +
                            '<span class="account-market-code">{code}</span>' +
                            '<span class="account-market-name">{name}</span>' +
                            '<span class="account-market-price">{price}</span>' +
                            '<span class="account-market-cost">{cost}</span>' +
                            '<span class="account-market-market">{market}</span>' +
                            '<span class="account-market-vol">{vol}</span>' +
                            '<span class="account-market-profit">{profit}</span>' +
                            '</li>';

//Under class .main-container
var strategies_start = '<div class="strategy-titleline"></div>' +
    '<div class="strategy-title">选股策略</div>' +
    '<form class="strategy-form" onkeydown="if(event.keyCode==13) return false;">';

var strategy_start = '<div class="strategy">' +
    '<div class="strategy-box">'+
    '<a class="strategy-checker" href="javascript:void(0)" data="{id}">' +
    '<div class="check-box">' +
    '<img src="../static/assets/icons/strategy_unchecked.png">' +
    '</div>' +
    '</a>' +
    '<input class="hide" type="checkbox" name="{id}" id="checkbox-{id}">' +
    '<a class="strategy-slider" href="javascript:void(0)">' +
    '<div class="text-box">{name}</div>' +
    '</a>' +
    '</div>' +
    '<div class="factors-dropdown dropdown-hide">' +
    '<table class="factors-table" border="1">' +
    '<tbody>';

var factor =                        '<td>' +
    '<div class="factor">' +
    '<a class="factor-selector" href="javascript:void(0)">' +
    '<img src="../static/assets/icons/icon_{factor_id}.png">' +
    '<div class="factor-info">' +
    '<div class="factor-name">{factor_name}</div>' +
    '<div class="factor-value">16.32%</div>' +
    '<input class="hide factor-input" type="text" name="{id}-{factor_id}" id="formfactor-{id}-{factor_id}">' +
    '</div>' +
    '</a>' +
    '</div>' +
    '</td>';
var strategy_end =          '</tbody>' +
    '</table>' +
    '<div class="border-line left_corner"></div>' +
    '<div class="border-line right_corner"></div>' +
    '</div>' +
    '</div>';
var strategies_end = '<button type="submit">提交</button>' +
    '</form>';
