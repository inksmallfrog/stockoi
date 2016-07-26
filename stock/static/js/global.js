/**
 * Created by inksmallfrog on 2016/7/19.
 */
function init_global(){
    $(window).resize(function(){
        $(".open").removeClass("open");
        underlineToActive();
        position_bar_data[current_page]['底部'] = $(".scrollable")[0].scrollHeight - $(window).height();
        calculate_current_pos($(".scrollable").scrollTop());
    });

    $("header").resize(function(){
        underlineToActive();
    });

    $(".scrollable").scroll(function(){
        var currentPos = $(".scrollable").scrollTop();
        if(currentPos > fixed_position_bar_pos && !position_bar_box.hasClass("fixed")){
            position_bar_box.addClass("fixed");
        }
        else if(currentPos < fixed_position_bar_pos && position_bar_box.hasClass("fixed")){
            position_bar_box.removeClass("fixed");
        }
        calculate_current_pos(currentPos);
    });
}

function calculate_current_pos(currentPos){
    var posbar_config = position_bar_data[current_page];
    var keys = Object.keys(posbar_config);
    for (var i = 0; i < keys.length - 1; ++i){
        if(currentPos > posbar_config[keys[i]] && currentPos <= posbar_config[keys[i + 1]]){
            var position_pos = (55.0 / (posbar_config[keys[i + 1]] - posbar_config[keys[i]])) * (currentPos - posbar_config[keys[i]]);
            position_current.css("top", 13 + i * 55 + position_pos);
            return;
        }
    }
}

function init_current_page(){
    main_container.html(container_content[current_page]);
    position_bar_box.html(buildPositionBarContent(current_page));
    if(current_page == "strategies"){
        init_strategies_page();
    }
    init_position_bar();
}

function resetBorder(border_name){
    var width = $("." + border_name + "-with-border").outerWidth();
    var height = $("." + border_name + "-with-border").outerHeight();

    $("svg#" + border_name + "-border").attr("width", width);
    $("svg#" + border_name + "-border").attr("height", height);

    var line_top = $("#" + border_name + "-line-top");
    var line_bottom = $("#" + border_name + "-line-bottom");
    var line_right = $("#" + border_name + "-line-right");

    line_top.attr("x1", "0");
    line_top.attr("x2", width / 3.667 + "px");

    line_bottom.attr("x1", width - 100 + "px");
    line_bottom.attr("x2", "100%");

    line_right.attr("y1", height - 100 + "px");
    line_right.attr("y2", "100%");
}
