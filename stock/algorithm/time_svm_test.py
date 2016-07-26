#coding:utf-8
import tushare as ts
from svmutil import *


def splitData(rawData,length):
    type = []
    values = []
    for x in range(0,len(rawData)):
        values.append([rawData[x][i] for i in range(0,length-1)])
        type.extend([rawData[x][length-1]])
    return {
        'type':type,
        'values':values
    }

# 获取历史数据 open close volume price_change pchange
default_code = '600848'
default_start = '2016-07-01'
default_end = '2016-07-25'
columns = ['p_change','volume', 'ma5','ma10','ma20','v_ma5','v_ma10','v_ma20','turnover']
indexers = len(columns)
predict_days = 3
eval_days = 30

raw_data = ts.get_hist_data(code=default_code,start=default_start,end=default_end)
before_data = (raw_data.loc[:,columns])[predict_days+1:predict_days+eval_days+1]
after_data = (raw_data.loc[:,columns]).head(predict_days)
before_data = before_data.to_records()
after_data = after_data.to_records()
train_data_01 = []
train_data_02 = []

for x in range(0, len(before_data)):

    temp = [before_data[x][y] for y in range(1, indexers+1)]
    if before_data[x][1] >= 0:
        temp.extend([1])
        train_data_01.append(temp)
    else:
        temp.extend([-1])
        train_data_01.append(temp)


for x in range(0, len(after_data)):

    temp = [after_data[x][y] for y in range(1, indexers+1)]
    if after_data[x][1] >= 0:
        temp.extend([1])
        train_data_02.append(temp)
    else:
        temp.extend([-1])
        train_data_02.append(temp)


splited_data = splitData(train_data_01,indexers+1)
test_data = splitData(train_data_02,indexers+1)

labels = splited_data.get('type')
data = splited_data.get('values')
model = svm_train(labels,data)

predict_labels = test_data.get('type')
values = test_data.get('values')
res = svm_predict(predict_labels,values,model)




