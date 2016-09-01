/**
 * Created by inksmallfrog on 2016/7/29.
 * 功能：管理当前登录的用户
 */

function User(){
    this.id = -1;                   //用户id
    this.logged = false;           //是否登录
}

//初始化登录情况
User.prototype.init = function(){
    this.id = $.cookie("user_id");
    if(typeof this.id != 'undefined'){
        this.logged = true;
        $(".trade").show();
    }
    this.toLogin();

    $("#show-pwd-button").click(function(){
        $("#signup_pwd_input").attr("type", $(this).attr("data"));
        if($(this).attr("data") == "text"){
            $(this).attr("data", "password");
            $(this).html("隐藏密码");
        }
        else{
            $(this).attr("data", "text");
            $(this).html("显示密码");
        }
    })
};

User.prototype.toLogin = function(){
    $("#login-signup-title").html("登录");
    $(".signup-tips").removeClass("login");
    var login_button = $("#login-button");
    login_button.unbind("click");
    login_button.click(function(){
        user.login();
    });
    var signup_button = $("#signup-button");
    signup_button.unbind("click");
    signup_button.click(function(){
        user.toSignup();
    });
};

User.prototype.toSignup = function(){
    $("#login-signup-title").html("注册");
    $(".signup-tips").addClass("login");
    var login_button = $("#login-button");
    login_button.unbind("click");
    login_button.click(function(){
        user.toLogin();
    });
    var signup_button = $("#signup-button");
    signup_button.unbind("click");
    signup_button.click(function(){
        user.signup();
    });
};

//用户登录
User.prototype.login = function(){
    var user = this;
    var id = $("#user_id_input").val();
    /*
     * 发送登录信息
     * 发送目标：{root}/login
     * 发送方式：post
     * 发送内容：id => 用户id
     *           pwd => 用户密码
     * 返回格式：字符串
     * 期待返回内容："succeed" => 登录成功
     *             ："user_id_error" => 用户名错误
     *             ："pwd_error" => 密码错误
     */
    $.post("../login", {id: id, pwd: $("#pwd_input").val()},
        function (data, status) {
            if(data.data == 'succeed'){
                $.cookie("user_id", id, {expires: 14});
                user.id = id;
                window.location.reload();
            }
            else{
                $("#" + data).slideDown();
            }
        });
    return false;
};

User.prototype.signup = function(){
    var user = this;
    var id = $("#signup_user_id_input").val();
    /*
     * 发送注册信息
     * 发送目标：{root}/signup
     * 发送方式：post
     * 发送内容：id => 用户id
     *           pwd => 用户密码
     * 返回格式：字符串
     * 期待返回内容："succeed" => 注册成功
     *             ："signup_user_id_error" => 用户名已存在
     *             ："signup_pwd_error" => ？
     */
    $.post("../signup", {id: id, pwd: $("#signup_pwd_input").val()},
        function (data) {
            if(data.data == 'succeed'){
                $.cookie("user_id", id, {expires: 14});
                user.id = id;
                window.location.reload();
            }
            else if(data.error == "Invalid username!"){
                $("#signup_user_id_error").slideDown();
            }
        }, "json");
    return false;
};

//用户登出
User.prototype.quit = function(){
    /*
     * 发送登出信息
     * 发送目标：{root}/logout
     * 发送方式：post
     * 发送内容：user_id => 用户id
     * 返回：无
     */
    $.post("../logout", {user_id: user.id});
    $.cookie("user_id", '', {expires: -1});
    window.location.reload();
};