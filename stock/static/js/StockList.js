/**
 * Created by inksmallfrog on 2016/8/30.
 */
function loadStockList(){
    /*
     * 加载今日有效股票列表
     * 发送目标：{root}/stocklist
     * 发送方式：post
     * 返回格式：json数组
     * 期待返回内容：[] => 存放股票列表的数组
     *                  id => 唯一标示股票的代号（例：000001SH）
     *                  code => 股票代码
     *                  name => 股票名
     */
    $.post("../stocklist", {}, function(data){
        stock_list = data.data;
        initPage();
    });
    /*stock_list = [
    {
        "id": "000001SH",
        "code": "000001",
        "name": "上证指数"
    },
    {
        "id": "600000SH",
        "code": "600000",
        "name": "浦东机场"
    },
    {
        "id": "88888888SH",
        "code": "88888888",
        "name": "小蛙制杖"
    }
];
    initPage();*/
}
