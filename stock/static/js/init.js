/**
 * Created by inksmallfrog on 2016/7/26.
 */
//Header
var menu_active = $(".menu-item.active");
var last_li_open = null;
init_header();
underlineToActive();

//Main-container
var main_container = $("#main-container");
var current_page = 'strategies';
resetBorder("container");

//Strategies
var current_select_count = 0;
container_content["strategies"] = build_strategies_page();       //根据配置生成策略内容

//Position-bar
var position_bar_box = $(".position-bar-box");
var position_current;

init_global();
init_current_page();
