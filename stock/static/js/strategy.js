/**
 * Created by inksmallfrog on 2016/7/22.
 */
function init_strategies_page(){
    $(".strategy-checker").click(function(){
        var strategy = $(this).parents().parents(".strategy");
        var factor_box = strategy.children(".factors-dropdown");
        var form_checkbox = $("#checkbox-" + $(this).attr("data"));

        if(strategy.hasClass("checked")){
            form_checkbox.attr("checked", false);
            factor_box.slideUp("slow");
            strategy.removeClass("checked");
            $(this).children().children("img").attr("src", UNCHECKED_ICON);
            if(current_select_count == MAX_STRATEGIES_COUNT){
                $(".strategy").each(function(){
                    $(this).removeClass("disable");
                })
            }
            --current_select_count;
        }
        else{
            if(current_select_count == MAX_STRATEGIES_COUNT){
                return;
            }
            form_checkbox.attr("checked", true);
            strategy.addClass("checked");
            $(this).children().children("img").attr("src", CHECKED_ICON);
            factor_box.slideDown("slow");
            ++current_select_count;
            if(current_select_count == MAX_STRATEGIES_COUNT){
                $(".strategy").each(function(){
                    if(!($(this).hasClass("checked"))){
                        $(this).addClass("disable");
                    }
                })
            }
        }
    });

    $(".strategy-slider").click(function(){
        var strategy = $(this).parents().parents(".strategy");
        var factor_box = strategy.children(".factors-dropdown");
        factor_box.slideToggle("slow");
    });
    $(".factor-selector").click(function(){
        var factor_value = $(this).children().children(".factor-value");
        var factor_input = $(this).children().children("input");
        if(!factor_input.hasClass("hide")){
            return;
        }
        factor_value.addClass("hide");
        factor_input.removeClass("hide");
        factor_input.val(factor_value.html());
        factor_input.focus();
    });
    $(".factor-input").keydown(function(e){
        if(e.keyCode == 13){
            $(this).addClass("hide");
            var factor_value = $(this).parent().children(".factor-value");
            factor_value.html($(this).val());
            factor_value.removeClass("hide");
        }
    });
    $(".factor-input").keydown(function(e){
        if(e.keyCode == 13){
            $(this).addClass("hide");
            var factor_value = $(this).parent().children(".factor-value");
            factor_value.html($(this).val());
            factor_value.removeClass("hide");
        }
    });
    $(".factor-input").focusout(function(){
        $(this).addClass("hide");
        var factor_value = $(this).parent().children(".factor-value");
        factor_value.html($(this).val());
        factor_value.removeClass("hide");
    });

    $(".factor-value").change(function(){
        console.log("#formfactor-" + $(this).attr("data"));
        var formfactor_value = $("#formfactor-" + $(this).attr("data"));
        console.log($(this).html());
        formfactor_value.value = $(this).html();
    });
}

function build_strategies_page(){
    var content = strategies_start;
    for(var id in strategies){
        content += strategy_start;
        var s = strategies[id];
        var double = true;
        for(var f in s.factors){
            if(double) content += "<tr>";
            content += factor.replace(/\{factor_id}/g, f).replace(/\{factor_name}/g, s.factors[f]);
            double = !double;
            if(double) content += "</tr>";
        }
        if(!double){
            content +=      "<td></td>" +
                        "</tr>";
            double = true;
        }
        content += strategy_end;
        content = content.replace(/\{id}/g, id).replace(/\{name}/g, s["name"]);
    }
    content += strategies_end;
    return content;
}
