/**
 * Created by smallfrogink on 7/16/16.
 */

var candlestick = echarts.init(document.getElementById('candlestick'));
var volume = echarts.init(document.getElementById('volume'));

function calculateMA(dayCount, data) {
    var result = [];
    for (var i = 0, len = data.values.length; i < len; i++) {
        if (i < dayCount) {
            result.push('-');
            continue;
        }
        var sum = 0;
        for (var j = 0; j < dayCount; j++) {
            sum += data.values[i - j][1];
        }
        result.push(+(sum / dayCount).toFixed(3));
    }
    return result;
}

function splitData(rawData){
    var categoryData = [];
    var values = [];
    var volumns = [];
    console.log(rawData);
    for(var i = 0; i < rawData.length; i++){
        categoryData.push(rawData[i]["DateTime"].substring(0, 10));
        values.push([rawData[i]["Open"], rawData[i]["Close"], rawData[i]["Low"], rawData[i]["High"]]);
        volumns.push(rawData[i]["Volume"]);
    }
    return {
        categoryData: categoryData,
        values: values,
        volumns: volumns
    };
}

$.get('data/000001SZ.json', function(rawData){
    var data = splitData(rawData);

    candlestick.setOption(option={
        legend: {
            top: 10,
            left: 'center',
            data: ['Index', 'MA5', 'MA10', 'MA20', 'MA30', 'Volume']
        },
        tooltip : {
            trigger: 'axis',
            showDelay: 0,             // 显示延迟，添加显示延迟可以避免频繁切换，单位ms
            formatter: function (params) {
                var res = params[0].name;
                res += '<br/>' + params[0].seriesName;
                res += '<br/>  开盘 : ' + params[0].value[0] + '  最高 : ' + params[0].value[3];
                res += '<br/>  收盘 : ' + params[0].value[1] + '  最低 : ' + params[0].value[2];
                return res;
            }
        },
        toolbox: {
            show : true,
            feature : {
                mark : {show: true},
                dataView : {show: true, readOnly: false},
                restore : {show: true},
                saveAsImage : {show: true}
            }
        },
        grid: [
            {
                left: '10%',
                right: '8%',
                height: '70%'
            }
        ],
        xAxis: [
            {
                type: 'category',
                data: data.categoryData,
                boundaryGap: false,
                axisLine: {onZero: false},
                splitLine: {show: false},
                splitNumber: 20,
                min: 'dataMin',
                max: 'dataMax'
            }
        ],
        yAxis: [
            {
                scale: true,
                splitArea: {
                    show: true
                },
                axisLabel: {
                    formatter: function (value, index){
                        return value.toFixed(2);
                    }
                }
            }
        ],
        dataZoom: [
            {
                type: 'inside',
                start: 98,
                end: 100
            },
            {
                show: true,
                type: 'slider',
                top: '200%',
                start: 98,
                end: 100
            }
        ],
        series: [
            {
                name: 'Index',
                type: 'candlestick',
                data: data.values,
                itemStyle: {
                    normal:{
                        borderColor: null,
                        borderColor0: null
                    }
                },
                tooltip: {
                    formatter: function(param){
                        var param = param[0];
                        return[
                            'Date: ' + param.name + '<hr size=1 style="margin: 3px 0">',
                            'Open: ' + param.data['Open'] + '<br/>',
                            'Close: ' + param.data['Close'] + '<br/>',
                            'Lowest: ' + param.data['Low'] + '<br/>',
                            'Highest: ' + param.data['High'] + '<br/>'
                        ].join('');
                    }
                }
            },
            {
                name: 'MA5',
                type: 'line',
                data:calculateMA(5, data),
                smooth:true,
                lineStyle: {
                    normal: {opacity: 0.5}
                }
            },
            {
                name: 'MA10',
                type: 'line',
                data:calculateMA(10, data),
                smooth:true,
                lineStyle: {
                    normal: {opacity: 0.5}
                }
            },
            {
                name: 'MA20',
                type: 'line',
                data:calculateMA(20, data),
                smooth:true,
                lineStyle: {
                    normal: {opacity: 0.5}
                }
            },
            {
                name: 'MA30',
                type: 'line',
                data:calculateMA(30, data),
                smooth:true,
                lineStyle: {
                    normal: {opacity: 0.5}
                }
            },
            {
                name: 'Volume',
                type: 'bar',
                data: []
            }
        ]
    }, true);

    volume.setOption(option={
        legend: {
            y : -30,
            left: 'center',
            data: ['Index', 'MA5', 'MA10', 'MA20', 'MA30', 'Volume']
        },
        tooltip : {
            trigger: 'axis',
            showDelay: 0             // 显示延迟，添加显示延迟可以避免频繁切换，单位ms
        },
        toolbox: {
            y : -30,
            show : true,
            feature : {
                mark : {show: true},
                dataView : {show: true, readOnly: false},
                restore : {show: true},
                saveAsImage : {show: true}
            }
        },
        grid: {
            y: 5,
            left: '10%',
            right: '8%',
            height: '60%'
        },
        xAxis : [
            {
                type: 'category',
                data: data.categoryData,
                boundaryGap: false,
                position: 'top',
                axisLabel: {show: false},
                axisLine: {onZero: false},
                splitLine: {show: false},
                splitNumber: 20,
            }
        ],
        yAxis : [
            {
                type : 'value',
                scale:true,
                splitNumber: 3,
                boundaryGap: [0.05, 0.05],
                axisLabel: {
                    formatter: function (v) {
                        return Math.round(v/10000) + ' 万'
                    }
                },
                splitArea : {show : true}
            }
        ],
        dataZoom : {
            type: 'inside',
            start: 98,
            end: 100
        },
        series : [
            {
                name:'Volume',
                type:'bar',
                data: data.volumns,
                markLine : {
                    symbol : 'none',
                    itemStyle : {
                        normal : {
                            color:'#1e90ff',
                            label : {
                                show:false
                            }
                        }
                    },
                    data : [
                        {type : 'average', name: '平均值'}
                    ]
                }
            }
        ]
    }, true);

    echarts.connect([candlestick, volume]);
});

$(window).resize(function() {
    candlestick.resize();
    volume.resize();
});