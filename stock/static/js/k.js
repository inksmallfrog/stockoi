// 数据意义：开盘(open)，收盘(close)，最低(lowest)，最高(highest)

function splitData(rawData) {
    var categoryData = [];
    var values = []
    for (var i = 0; i < rawData.length; i++) {
        categoryData.push(rawData[i].splice(0, 1)[0]);//切除时间
        values.push(rawData[i]); //剩余属性
    }
    return {
        categoryData: categoryData,
        values: values
    };
}
function splitHistoryData(rawData) {
    var categoryData = [];
    var values = [];
    for (var i = 0; i < rawData.length; i++) {
        categoryData.push(rawData[i].slice(1, 2)[0]); //获取当前时间
        values.push(rawData[i].slice(2, 3)[0]); //获取当前价格
    }
    return {
        categoryData: categoryData,
        values: values
    };
}

function calculateMA(dayCount) {
    var result = [];
    for (var i = 0, len = data0.values.length; i < len; i++) {
        if (i < dayCount) {
            result.push('-');
            continue;
        }
        var sum = 0;
        for (var j = 0; j < dayCount; j++) {
            sum += data0.values[i - j][1];
        }
        result.push(sum / dayCount);
    }
    return result;
}