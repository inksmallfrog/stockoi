/**
 * Created by inksmallfrog on 2016/8/11.
 * 功能：描述股票
 */
function Stock(){
    this.id;        //股票id
    this.code;      //股票代码
    this.name;      //股票名称
    this.abbr;      //股票缩写

    this.price;     //当前价格
    this.open;      //开盘价
    this.close;     //收盘价
    this.high;      //最高价
    this.low;       //最低价
    this.max;       //涨停价
    this.min;       //跌停价
    this.vol;       //总量
    this.value;     //总额
    this.marketvalue;       //市值
    this.available_marketvalue;     //流动市值

    this.current_data;              //图表数据
}

Stock.prototype.init = function(){
};

Stock.prototype.update = function(){
    this.updateDetail();

    if(stock_detail.graph_type == "graph-time"){
        this.updateGraphData();
    }
};

Stock.prototype.changeStock = function(id, start_time){
    this.id = id;
    this.updateDetail();
    this.updateGraphData(start_time);
    stock_detail.show();
};

Stock.prototype.updateDetail = function(){
    /*
     * 发送股票详情请求
     * 发送目标：{root}/getstockdata
     * 发送方式：post
     * 发送内容：id => 股票id
     * 返回格式：json
     * 期待返回内容：id => 股票id
     *               code => 股票代码
     *               name => 股票名称
     *               abbr => 股票缩写
     *               price => 当前价格
     *               open => 开盘价
     *               close => 收盘价
     *               high => 最高价
     *               low => 最低价
     *               max => 涨停价
     *               min => 跌停价
     *               vol => 总量
     *               value => 总额
     *               marketvalue => 市值
     *               available_marketvalue => 流通市值
     */
    var stock = this;
    $.post("../getstockdata", {id: this.id}, function(data){
        stock.readDetail(data);
        stock_detail.update();
        trade.update();
    }, "json");
};

//从json数据中绑定数据
Stock.prototype.readDetail = function(data){
    this.code = data.code;
    this.name = data.name;
    this.abbr = data.abbr;

    this.price = Number(data.price);
    this.open = Number(data.open);
    this.close = Number(data.close);
    this.high = Number(data.high);
    this.low = Number(data.low);
    if(this.price == 0){
        this.price = this.close;
        this.open = this.close;
        this.high = this.close;
        this.low = this.close;
    }
    this.max = (Math.round(Number(data.close) * 1.1 * 100) / 100.0).toFixed(2);
    this.min = (Math.round(Number(data.close) * 0.9 * 100) / 100.0).toFixed(2);
    this.vol = data.vol;
    this.value = data.value;
    this.marketvalue = data.marketvalue;
    this.available_marketvalue = data.available_marketvalue;
    this.bid5 = data.bid5;
    this.bid5vol = data.bid5vol;
    this.bid4 = data.bid4;
    this.bid4vol = data.bid4vol;
    this.bid3 = data.bid3;
    this.bid3vol = data.bid3vol;
    this.bid2 = data.bid2;
    this.bid2vol = data.bid2vol;
    this.bid1 = data.bid1;
    this.bid1vol = data.bid1vol;
    this.buy1 = data.buy1;
    this.buy1vol = data.buy1vol;
    this.buy2 = data.buy2;
    this.buy2vol = data.buy2vol;
    this.buy3 = data.buy3;
    this.buy3vol = data.buy3vol;
    this.buy4 = data.buy4;
    this.buy4vol = data.buy4vol;
    this.buy5 = data.buy5;
    this.buy5vol = data.buy5vol;
};

Stock.prototype.updateGraphData = function(start_time){
    /*
     * 发送股票图表请求
     * 发送目标：{root}/getstockgraphdata
     * 发送方式：post
     * 发送内容：id => 股票id
     *           type => 图表类型('graph-daily' => 日线; 'graph-weekly' => 周线; 'graph-monthly' => 月线'; 'graph-time' => '分时图')
     *           start_time => 起始时间(格式"yyyy-MM-dd", 为空则代表默认时间)
     * 返回格式：二维数组
     * 期待返回内容：[时间，开盘，收盘，最低，最高]
     */
    var stock = this;
    $.post("../getstockgraphdata", {id: this.id, type: stock_detail.graph_type, start_time: start_time}, function(data){
        stock.readGraphData(data);
        stock_detail.updateGraph();
    });
};

//从数组中获取图表数据
Stock.prototype.readGraphData = function(raw_data){
    var data;
    eval("data = " + raw_data);

    var categoryData = [];
    var values = [];
    for (var i = 0; i < data.length; i++) {
        categoryData.push(data[i].splice(0, 1)[0]);//切除时间
        values.push(data[i]); //剩余属性
    }
    this.current_data = {
        categoryData: categoryData,
        values: values
    };
};

//计算均价
Stock.prototype.calculateMA = function(period){
    var result = [];
    for (var i = 0, len = this.current_data.values.length; i < len; i++) {
        if (i < period) {
            result.push('-');
            continue;
        }
        var sum = 0;
        for (var j = 0; j < period; j++) {
            sum += this.current_data.values[i - j][1];
        }
        result.push(sum / period);
    }
    return result;
};
