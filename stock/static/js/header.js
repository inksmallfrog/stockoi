/**
 * Created by inksmallfrog on 2016/7/18.
 */
function init_header(){
    if(user_logged){
        $(".navbar-header").html($(".navbar-header").html() + build_logged("small"));
        $("li.dropdown").html($("li.dropdown").html() + build_logged("big"));
    }
    else{
        $(".navbar-header").html($(".navbar-header").html() + build_unlogged("small"));
        $("li.dropdown").html($("li.dropdown").html() + build_unlogged("big"));
    }

    $(".menu-item").hover(function(){
        if(last_li_open != null){
            last_li_open.removeClass("open");
        }
        $("#header-line").css("left", $(this).offset().left);
        $("#header-line").css("width", $(this).outerWidth());
        last_li_open = $(this).parent(".hidden-xs");
        if(last_li_open.children(".dropdown-menu").length != 0){
            last_li_open.addClass("open");
        }
    });

    $(".menu-item").mouseleave(function(){
        if(!($(this).parent(".hidden-xs").hasClass("open"))){
            underlineToActive();
        }
    });

    $(".dropdown-menu").mouseleave(function(){
        if(last_li_open != null){
            last_li_open.removeClass("open");
        }
        underlineToActive();
    });

    $(".menu-item").click(function(){
        current_page = $(this).attr("data");

        init_current_page();
        init_position_bar();

        menu_active.removeClass("active");
        menu_active = $(this);
        menu_active.addClass("active");
    });

    $("#nav-xs-slider").click(function(){
        $("#nav-xs").slideToggle(500);
    });
}

function build_logged(type){
    var content;
    if(type == "small"){
        content = logged_for_small_start;
    }
    else if(type == "big"){
        content = logged_for_big_start;
    }

    content += logged_menu_start;
    for(var i = 0; i < user_accounds.length; ++i){
        content += logged_accounts.replace(/\{id}/, user_accounds[i]);
    }
    content += logged_menu_end;
    return content;
}

function build_unlogged(type) {
    if(type == "small") return unlogged_for_small;
    else if(type == "big") return unlogged_for_big;
}

function underlineToActive(){
    $("#header-line").css("left", menu_active.offset().left);
    $("#header-line").css("width", menu_active.outerWidth());
}