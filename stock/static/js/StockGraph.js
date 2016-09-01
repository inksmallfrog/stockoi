/**
 * Created by inksmallfrog on 2016/8/11.
 * 功能：描述股票图表
 */
function StockGraph(){
    this.stock_chart = echarts.init(document.getElementById("stock-graph"));        //股票图表
}

StockGraph.prototype.init = function(){

};

StockGraph.prototype.update = function(){

};

//绘制图表
StockGraph.prototype.drawGraph = function(){
    var option={
        title: {
            text: '',
            left: 0
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'line'
            },
            formatter: function (_param) {
                var param = _param[0];
                return [
                    '日期: ' + param.name + '<hr size=1 style="margin: 3px 0">',
                    '开盘: ' + param.data[0] + '<br/>',
                    '收盘: ' + param.data[1] + '<br/>',
                    '最低: ' + param.data[2] + '<br/>',
                    '最高: ' + param.data[3] + '<br/>',
                    'MA5: ' + Number(_param[1].data).toFixed(2) + '<br/>',
                    'MA10: ' + Number(_param[2].data).toFixed(2) + '<br/>',
                    'MA20: ' + Number(_param[3].data).toFixed(2) + '<br/>',
                    'MA30: ' + Number(_param[4].data).toFixed(2) + '<br/>'
                ].join('');
            }
        },
        legend: {
            bottom: 0,
            padding: 10,
            data: [stock.name, 'MA5', 'MA10', 'MA20', 'MA30']
        },
        grid: {
            top: '2%',
            left: '40px',
            right: '2%',
            bottom: '18%',
            height: '75%'
        },
        xAxis: {
            type: 'category',
            data: stock.current_data.categoryData,
            scale: true,
            boundaryGap : false,
            axisLine: {onZero: false},
            splitLine: {show: false},
            splitNumber: 20,
            min: 'dataMin',
            max: 'dataMax'
        },
        yAxis: {
            scale: true,
            splitArea: {
                show: true
            }
        },
        dataZoom: [
            {
                type: 'inside',
                start: 50,
                end: 100
            },
            {
                show: true,
                type: 'slider',
                y: '84%',
                height: '6%',
                start: 50,
                end: 100
            }
        ],
        series: [
            {
                name: stock.name,
                type: 'candlestick',
                data: stock.current_data.values
            },
            {
                name: 'MA5',
                type: 'line',
                data: stock.calculateMA(5),
                smooth: true,
                lineStyle: {
                    normal: {opacity: 0.5}
                }
            },
            {
                name: 'MA10',
                type: 'line',
                data: stock.calculateMA(10),
                smooth: true,
                lineStyle: {
                    normal: {opacity: 0.5}
                }
            },
            {
                name: 'MA20',
                type: 'line',
                data: stock.calculateMA(20),
                smooth: true,
                lineStyle: {
                    normal: {opacity: 0.5}
                }
            },
            {
                name: 'MA30',
                type: 'line',
                data: stock.calculateMA(30),
                smooth: true,
                lineStyle: {
                    normal: {opacity: 0.5}
                }
            }
        ]
    };

    this.stock_chart.setOption(option);
};

