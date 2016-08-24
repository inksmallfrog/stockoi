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
    this.id = $.session.get("user_id");
    if(typeof this.id != 'undefined'){
        this.logged = true;
    }
    this.toLogin();
    $("#pwd_input").val('');
    $("#signup_pwd_input").val('');

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
        login();
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
        login();
    });
};

/*//用户登录
User.prototype.login = function(){
    var user = this;
    var id = $("#user_id_input").val();
    /!*
     * 发送登录信息
     * 发送目标：{root}/login
     * 发送方式：post
     * 发送内容：id => 用户id
     *           pwd => 用户密码
     * 返回格式：字符串
     * 期待返回内容："succeed" => 登录成功
     *             ："user_id_error" => 用户名错误
     *             ："pwd_error" => 密码错误
     *!/
    console.log("aaa");
    $.post("../login", {id: id, pwd: $("#pwd_input").val()},
        function (data, status) {
            console.log(data);
            console.log(data['data'] == 'succeed');
            if(data['data'] == 'succeed'){
                console.log(data['data']);
                $.cookie("user_id", id, {expires: 8000});
                console.log(id);
                user.id = id;
                window.location.reload();
            }
            else{
                $("#" + data).slideDown();
            }
        });
    return false;
};*/

/*User.prototype.signup = function(){
    var user = this;
    var id = $("#signup_user_id_input").val();
    /!*
     * 发送注册信息
     * 发送目标：{root}/signup
     * 发送方式：post
     * 发送内容：id => 用户id
     *           pwd => 用户密码
     * 返回格式：字符串
     * 期待返回内容："succeed" => 注册成功
     *             ："signup_user_id_error" => 用户名已存在
     *             ："signup_pwd_error" => ？
     *!/
    $.post("../signup", {id: id, pwd: $("#singup_pwd_input").val()},
        function (data, status) {
            if(data == 'succeed'){
                $.cookie("user_id", id, {expires: 80});
                user.id = id;
                // window.location.reload();
            }
            else{
                $("#" + data).slideDown();
            }
        });
    return false;
};*/

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
    $.session.remove("user_id");
    window.location.reload();
};

//用户登陆或注册
function login(){
    var login_id = $("#user_id_input").val();
    var signup_id = $("#signup_user_id_input").val();
    if(login_id != '' && $("#pwd_input").val() != ''){
        $.post("../login", {id: login_id, pwd: $("#pwd_input").val()},
        function (data, status) {
            if(data['data'] == 'succeed'){
                user.id = login_id;
                $.session.set("user_id", data['user']);
                window.location.reload();
            }
            else{
                $("#" + data).slideDown();
            }
        });
        return false;
    }else{
        console.log($("#signup_pwd_input").val());
        $.post("../signup", {id: signup_id, pwd: $("#signup_pwd_input").val()},
        function (data, status) {
            console.log(data['data']);
            if(data['data'] == 'succeed'){
                user.id = signup_id;
                $.session.set("user_id", data['user']);
                window.location.reload();
            }
            else{
                $("#" + data).slideDown();
            }
        });
    return false;
    }

}