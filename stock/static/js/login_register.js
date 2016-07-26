/**
 * Created by inksmallfrog on 2016/7/20.
 */

function dialog_open(){
    $(".scrollable").animate({scrollTop:0}, 500);
}

$(".login-register-dialog").on('shown.bs.modal', function(){
    resetBorder("dialog");
});

$(".login-register-dialog").resize(function(){
    resetBorder("dialog");
});

function setAction(action){
    $("#action_type").val(action);
}