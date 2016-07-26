/**
 * Created by inksmallfrog on 2016/7/26.
 */

var user_id = $.cookie("user_id");
var user_name;
var user_accounds = ["bilibili", "aabbox"];
var user_logged = false;

if(typeof user_id != 'undefined'){
    user_logged = true;
    user_name = $.cookie("user_name");
}

function logout(){
    $.cookie('user_id', '', {expires: -1});
    location.reload();
}



