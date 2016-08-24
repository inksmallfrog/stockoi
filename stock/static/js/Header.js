/**
 * Created by inksmallfrog on 2016/7/18.
 * 功能：描述导航头对象
 */
function Header(){
    this.date = null;       //日期容器
    this.time = null;       //时间容器
}

Header.prototype.init = function(){
    this.date = $(".date");
    this.time = $(".time");

    this.resizeUnderline();
    this.changeLoggedIcon();
    this.update();

    $(".user-status").click(this.statusClicked());

    $("#market-panel-button").click(function(){
       stock_detail.show();
    });
    $("#account-panel-button").click(function(){
        account.show();
    });
    $("#strategies-panel-button").click(function(){
        strategies.show();
    });
    $("#logout-button").click(function(){
        user.quit();
    })
};

Header.prototype.resizeUnderline = function(){
    var time_show = $(".time-show");
    var header_line = $(".header-underline");
    header_line.css("left", time_show.offset().left);
    header_line.css("width", time_show.outerWidth());
};

Header.prototype.changeLoggedIcon = function(){
    if(user.logged) {
        $(".user-avator").attr("src", ICON_LOGGED);
        $(".user-status").attr("data-toggle", "dropdown");
        $(".user-status").attr("data-target", "#");
    }
    else {
        $(".user-avator").attr("src", ICON_UNLOGGED);
        $(".user-status").attr("data-toggle", "modal");
        $(".user-status").attr("data-target", "#login-register");
    }
};

//更新当前的时间
Header.prototype.update = function(){
    var current_time = new Date();
    this.date.html(current_time.format('yyyy/MM/dd'));
    this.time.html(current_time.format('hh:mm'));
};

Header.prototype.statusClicked = function(){

};