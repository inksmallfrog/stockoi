/**
 * Created by inksmallfrog on 2016/7/23.
 */
//Under class .navbar-header
var logged_for_small_start = '<a class="btn btn-link visible-xs dropdown-toggle" data-toggle="dropdown">' +
                                '<img src="../static/assets/icons/logged.png">' +
                            '</a>';
var unlogged_for_small = '<a class="btn btn-link visible-xs" data-toggle="modal" data-target="#login-register" onclick="dialog_open()">' +
                            '<img src="../static/assets/icons/unlogged.png">' +
                         '</a>';

//Under class li.dropdown
var logged_for_big_start = '<a href="#" class="dropdown-toggle dropdown-avatar" data-toggle="dropdown">' +
                                '<span class="thumb-sm avatar pull-left">' +
                                    '<img src="../static/assets/icons/logged.png">' +
                                '</span>' +
                            '</a>';
var unlogged_for_big = '<a href="#" class="dropdown-toggle dropdown-avatar" data-toggle="modal" data-target="#login-register" onclick="dialog_open()">' +
                            '<span class="thumb-sm avatar pull-left">' +
                                '<img src="../static/assets/icons/unlogged.png">' +
                            '</span>' +
                        '</a>';

var logged_menu_start =    '<ul class="dropdown-menu user-menu">' +
                                '<li> <a href="#">个人信息</a> </li>' +
                                '<li> <a href="#">系统通知</a> </li>' +
                                '<li> <a href="#">设置</a> </li>' +
                                '<li> <a href="#" onclick="logout()">登出</a> </li>';
var logged_accounts =           '<li class="account-item"><span class="account-id">{id}</span><a href="#"><img class="account-delete" src="../static/assets/icons/delete.png"></a></li>';
var logged_menu_end =                '<li class="account-add"> <a href="#"> <img src="../static/assets/icons/account_add.png"> </a></li>' +
                            '</ul>';


//Under class .main-container
var strategies_start = '<div class="title">选股策略</div>' +
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


//Under class .position-bar-box
var position_bar_template_before =     '<div class="position-point position-current"></div>' +
                                        '<div class="position-item position-top">' +
                                            '<div class="position-point"></div>' +
                                            '<a class="position-name" href="#" onclick="toPosition(\'顶部\')">顶部</a>' +
                                        '</div>';
var position_bar_template_loop =        '<div class="position-item">' +
                                            '<div class="position-point position-normal"></div>' +
                                            '<a class="position-name" href="#" onclick="toPosition(\'{name}\')">{name}</a>' +
                                        '</div>';
var position_bar_template_end =         '<div class="position-item position-bottom">' +
                                            '<div class="position-point"></div>' +
                                            '<a class="position-name" href="#" onclick="toPosition(\'底部\')">底部</a>' +
                                        '</div>';
