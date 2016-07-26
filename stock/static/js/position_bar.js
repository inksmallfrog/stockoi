/**
 * Created by inksmallfrog on 2016/7/25.
 */
function init_position_bar(){
    buildPositionBarContent();
    position_bar_data[current_page]['底部'] = $(".scrollable")[0].scrollHeight - $(window).height();
    position_current = $(".position-point.position-current");
    calculate_current_pos($(".scrollable").scrollTop());
}

function buildPositionBarContent(){
    var bar_config = position_bar_data[current_page];

    var position_bar_content = position_bar_template_before;
    for(var key in bar_config){
        if(key == '顶部' || key == '底部') continue;
        position_bar_content += position_bar_template_loop.replace(/\{name}/g, key);
    }
    position_bar_content += position_bar_template_end;
    return position_bar_content;
}

function toPosition(pos) {
    $(".scrollable").animate({scrollTop:position_bar_data[current_page][pos]}, 500);
}

