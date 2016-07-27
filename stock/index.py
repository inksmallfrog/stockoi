#coding:utf-8
import tushare as ts
from stock import *
from stock.conf import TIMEFORMAT,OPENTIME,CLOSETIME
from flask_socketio import emit,SocketIO
from functools import wraps
import pandas as pd
import time


socketio = SocketIO(app)

def allow_cross_domain(fun):
    @wraps(fun)
    def wrapper_fun(*args, **kwargs):
        rst = make_response(fun(*args, **kwargs))
        rst.headers['Access-Control-Allow-Origin'] = '*'
        rst.headers['Access-Control-Allow-Methods'] = 'PUT,GET,POST,DELETE'
        allow_headers = "Referer,Accept,Origin,User-Agent"
        rst.headers['Access-Control-Allow-Headers'] = allow_headers
        return rst
    return wrapper_fun


@app.route("/")
def hello():
    default_code = '600848'
    default_start = '2016-01-01'
    default_end = '2016-05-31'

    #k线图
    k_data_min = ts.get_hist_data(code=default_code,start=default_start,end=default_end,ktype='D')
    k_columns = ['open','close','high','low']
    k_data_min_core = k_data_min.loc[:,k_columns]
    res = k_data_min_core.to_records()

    length = len(res)
    list = [[] for i in range(0,length)]

    for i in range(0,length):
        res[i][0] = res[i][0].encode("utf-8")
        list[i] = [res[i][x] for x in range(0,5)]

    list.reverse()

    #分时图
    #有效时间: 9:30-15:00
    current_time = time.strftime("%I:%M:%S")
    if current_time >= OPENTIME and current_time <= CLOSETIME:
        df = ts.get_today_ticks(default_code)
        r_columns = ['time','price','volume','amount','pchange']
        df = df.loc[:,r_columns]
        df = df.to_records()
        length2 = len(df)
        list2 = [[]for i in range(0,length2)]
        for x in range(0,length2)[::-1]:
            temp = [df[x][y] for y in range(0,6)]
            print type(temp[0])
            temp[1] = (pd.to_datetime(str(temp[1]))).strftime("%I:%M:%S")
            list2[length2-x-1] = temp

        return render_template("index.html",res = list,history_data = list2)
        # return render_template("index.html",history_data = list2)
    else:
        return render_template("index.html",res = list)


@app.route("/data/hours")
@allow_cross_domain
def hours():
    default_code = '600848'
    default_start = '2016-01-01'
    default_end = '2016-05-31'
    df = ts.get_today_ticks(default_code)
    r_columns = ['time','price','volume','amount','pchange']
    df = df.loc[:,r_columns]
    df = df.to_records()
    length2 = len(df)
    list2 = [[]for i in range(0,length2)]

    for x in range(0,length2)[::-1]:
        temp = [df[x][y] for y in range(0,6)]
        list2[length2-x-1] = temp

    return jsonify(list2)


@socketio.on('real_time')
def recv_message(message):
    data = ts.get_realtime_quotes(message['data'])
    current_columns =['time','price','volume','amount','code','name','bid','ask','date']
    raw_data = data.loc[:,current_columns]
    res = raw_data.to_records()
    list = []
    length = len(current_columns)
    for i in range(0,length+1):
        list.append(res[0][i])
    list[1] = (pd.to_datetime(str(list[1]))).strftime("%I:%M:%S")
    emit('res', {'data': list})


