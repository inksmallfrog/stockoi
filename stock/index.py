# coding:utf-8

# import time
import pinyin
import datetime
import tushare as ts
import pandas as pd
from functools import wraps
from flask_login import LoginManager, login_required, login_user
# from flask import Flask, render_template, redirect, url_for, flash
# from flask_sqlalchemy import SQLAlchemy
from model.model_admin import DBSession
from flask_socketio import emit, SocketIO
from model.models import *
from stock import *
from decimal import *
# from conf import OPENTIME

socket_io = SocketIO(app)
login_manager = LoginManager()
login_manager.init_app(app)


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


@login_manager.user_loader
def load_user(user_id):
    db_session = DBSession()
    res = db_session.query(User).get(int(user_id))
    db_session.close()
    return res


@app.route("/")
def hello():
    return render_template("index.html")


@app.route("/addaccount", methods=['POST'])
@allow_cross_domain
def add_account():
    form = request.form
    user_id = form.get('user_id')
    account_type = form.get('type')
    brokerage = form.get('brokerage')
    account_id = form.get('id')
    pwd = form.get('pwd')
    db_session = DBSession()
    user = db_session.query(User).filter_by(username=user_id).first()
    if user is not None:
        new_account = Account(account_id, user_id, 10000.00, 0, 0, 10000.00, 0,
                              pwd, brokerage, account_type)
        db_session.add(new_account)
        db_session.commit()
        db_session.close()
    return None


@app.route("/getaccountdata", methods=['POST'])
@allow_cross_domain
def get_account_data():
    form = request.form

    user_id = form.get('user_id')
    a_type = form.get('type')
    account_id = form.get('account')

    db_session = DBSession()
    user = db_session.query(User).filter_by(username=user_id).first()

    if user is not None:
        account = db_session.query(Account).filter_by(
            associate_id=user_id, account_type=a_type).first()
        stock_list = []
        stock_origin = None
        if account is not None:
            stock_origin = db_session.query(Stock).filter_by(
                associate_account=account.account_id).all()
        else:
            return jsonify({
                'error': 'Account error!'
            })
        for record in stock_origin:
            row = {
                'code': record.code,
                'name': record.name,
                'price': str(record.market_price),
                'cost': str(record.cost_price),
                'market': str(record.market_value),
                'vol': str(record.amount),
                'profit': str(record.profit)
            }
            stock_list.append(row)
        if account is not None and account.account_id == account_id:
            return jsonify({
                "balance": str(account.remain),
                "freezing": str(account.frozen),
                "market": str(account.market_value),
                "total": str(account.total),
                "profit": str(account.profit_loss),
                "detail": stock_list
            })
        else:
            return None


@app.route("/getstockdata", methods=['POST'])
@allow_cross_domain
def get_stock_data():
    code = (request.form.get('id', '600000'))[0:6]
    df = ts.get_realtime_quotes(code)
    abbr = ""
    name = (df.loc[:, ['name']]).to_records()[0][1]
    for i in range(len(name)):
        abbr += pinyin.get_initial(name[i]).upper()
    res = {
        'id': code + abbr,
        "code": code,
        "name": name,
        "abbr": abbr,
        "price": str(Decimal((df.loc[:, ['price']]).to_records()[0][1])),
        "open": str(Decimal((df.loc[:, ['open']]).to_records()[0][1])),
        "close": str(Decimal((df.loc[:, ['pre_close']]).to_records()[0][1])),
        "high": str(Decimal((df.loc[:, ['high']]).to_records()[0][1])),
        "low": str(Decimal((df.loc[:, ['low']]).to_records()[0][1])),
        "max": 0,
        "min": 0,
        "vol": int((df.loc[:, ['volume']]).to_records()[0][1]),
        "value": str(int((df.loc[:, ['volume']]).to_records()[0][1]) *
                        Decimal((df.loc[:, ['price']]).to_records()[0][1])),
    }
    return jsonify(res)


@app.route("/getstockgraphdata", methods=['POST'])
@allow_cross_domain
def get_stock_graph_data():
    default_start = '2016-01-01'
    default_end = datetime.date.today().strftime('%Y-%m-%d')

    code = (request.form.get('id'))[0:6]
    user_type = request.form.get('type')
    start_date = request.form.get('start_time', default_start)

    if len(code) != 6 or len(user_type) == 0:
        return [['Error']]

    k_columns = ['open', 'close', 'low', 'high']

    # current_time = time.strftime("%H:%M:%S")
    # if current_time >= OPENTIME:
    #     df = ts.get_today_ticks(code)
    #     r_columns = ['time', 'price', 'volume', 'amount', 'pchange']
    #     df = df.loc[:, r_columns]
    #     df = df.to_records()
    #     length_f = len(df)
    #     list_f = [[] for i in range(0, length_f)]
    #     for x in range(0, length_f)[::-1]:
    #         temp = [df[x][y] for y in range(0, 6)]
    #         temp[1] = (pd.to_datetime(str(temp[1]))).strftime("%I:%M:%S")
    #         list_f[length_f - x - 1] = temp

    if user_type == 'graph-monthly':
        k_data_min_m = ts.get_hist_data(
            code=code, start=start_date, end=default_end, ktype='M')
        k_data_min_m = k_data_min_m.loc[:, k_columns]
        k_data_rec_m = k_data_min_m.to_records()
        length_m = len(k_data_rec_m)
        list_m = [[] for i in range(0, length_m)]

        for i in range(0, length_m):
            k_data_rec_m[i][0] = k_data_rec_m[i][0].encode("utf-8")
            list_m[i] = [k_data_rec_m[i][x] for x in range(0, 5)]
            list_m[i][0] = list_m[i][0].replace('-', '/')
        list_m.reverse()
        return jsonify({'data': list_m})
    elif user_type == 'graph-weekly':
        k_data_min_w = ts.get_hist_data(
            code=code, start=start_date, end=default_end, ktype='W')
        k_data_min_w = k_data_min_w.loc[:, k_columns]
        k_data_rec_w = k_data_min_w.to_records()
        length_w = len(k_data_rec_w)
        list_w = [[] for i in range(0, length_w)]
        for i in range(0, length_w):
            k_data_rec_w[i][0] = k_data_rec_w[i][0].encode("utf-8")
            list_w[i] = [k_data_rec_w[i][x] for x in range(0, 5)]
            list_w[i][0] = list_w[i][0].replace('-', '/')
        list_w.reverse()
        return jsonify({'data': list_w})
    else:
        k_data_min_d = ts.get_hist_data(
            code=code, start=start_date, end=default_end, ktype='D')
        k_data_min_d = k_data_min_d.loc[:, k_columns]
        k_data_rec_d = k_data_min_d.to_records()
        length_d = len(k_data_rec_d)
        list_d = [[] for i in range(0, length_d)]
        for i in range(0, length_d):
            k_data_rec_d[i][0] = k_data_rec_d[i][0].encode("utf-8")
            list_d[i] = [k_data_rec_d[i][x] for x in range(0, 5)]
            list_d[i][0] = list_d[i][0].replace('-', '/')
        list_d.reverse()
        return jsonify({'data': list_d})


@app.route("/getuseraccount", methods=['POST'])
@allow_cross_domain
def get_user_account():
    form = request.form
    user_id = form.get('user_id')
    a_type = form.get('type')
    db_session = DBSession()
    user = db_session.query(User).filter_by(username=user_id).first()
    if user is not None:
        account = db_session.query(Account).filter_by(
            associate_id=user_id, account_type=a_type).first()
        if account is not None:
            return jsonify({'id': account.account_id})
        else:
            return jsonify({
                'id': '',
                'error': 'Account error!'
            })


@app.route('/login', methods=['POST'])
def log_in():
    form = request.form
    if form is not None:
        db_session = DBSession()
        user = db_session.query(User).filter_by(username=form.get('id')).first()
        db_session.close()
        if user is not None and user.verify_password(form.get('pwd')):
            session['username'] = form.get('id')
            return jsonify({'user': form.get('id'), 'data': 'succeed'})
        flash('Invalid username or password')
    return jsonify({'data': 'fail'})


@app.route("/signup", methods=['POST'])
def sign_up():
    form = request.form
    if form is not None:
        db_session = DBSession()
        user = db_session.query(User).filter_by(username=form.get('id')).first()
        if user is not None:
            db_session.close()
            return jsonify({
                'user': None,
                'data': 'fail',
                'error': 'Invalid username!'
            })
        if user is None:
            new_user = User(form.get('id'), form.get('id'), form.get('pwd'), '')
            db_session.add(new_user)
            db_session.commit()
            db_session.close()
            session['username'] = form.get('id')
            return jsonify({'user': form.get('id'), 'data': 'succeed'})

    return jsonify({'data': 'fail'})


@app.route("/stocksearch", methods=['POST'])
def stock_search():
    pass


@app.route("/tradefutureinfo", methods=['POST'])
def tradefutureinfo():
    pass


@app.route("/tradestockinfo", methods=['POST'])
# @login_required
def trade_stock_info():
    form = request.form
    user_id = form.get('user_id')
    s_id = (form.get('id', '600000'))
    db_session = DBSession()
    user = db_session.query(User).filter_by(username=user_id).first()
    mystock = None
    if user is not None:
        account = db_session.query(Account).filter_by(
            associate_id=user_id, account_type='stock').first()
        if account is not None:
            mystock = db_session.query(Stock).filter_by(
                associate_account=account.account_id, code=s_id).first()
        else:
            return jsonify({
                'code': 'Null',
                'name': 'Null',
                'price': '0.00',
                'min': '0.00',
                'max': '0.00',
                'vol_has': '0.00',
                'bid5': '0.00',
                'bid5vol': '0.00',
                'bid4': '0.00',
                'bid4vol': '0.00',
                'bid3': '0.00',
                'bid3vol': '0.00',
                'bid2': '0.00',
                'bid2vol': '0.00',
                'bid1': '0.00',
                'bid1vol': '0.00',
                'buy5': '0.00',
                'buy5vol': '0.00',
                'buy4': '0.00',
                'buy4vol': '0.00',
                'buy3': '0.00',
                'buy3vol': '0.00',
                'buy2': '0.00',
                'buy2vol': '0.00',
                'buy1': '0.00',
                'buy1vol': '0.00',
            })
        if mystock is not None:
            data = ts.get_realtime_quotes(mystock.code)
            data = data.to_records()
            db_session.close()
            return jsonify({
                'code': data[0][1],
                'name': data[0][2],
                'price': data[0][3],
                'min': 0,
                'max': 0,
                'vol_has': mystock.amount,
                'bid5': data[0][30],
                'bid5vol': data[0][29],
                'bid4': data[0][28],
                'bid4vol': data[0][27],
                'bid3': data[0][26],
                'bid3vol': data[0][25],
                'bid2': data[0][24],
                'bid2vol': data[0][23],
                'bid1': data[0][22],
                'bid1vol': data[0][21],
                'buy5': data[0][20],
                'buy5vol': data[0][19],
                'buy4': data[0][18],
                'buy4vol': data[0][17],
                'buy3': data[0][16],
                'buy3vol': data[0][15],
                'buy2': data[0][14],
                'buy2vol': data[0][13],
                'buy1': data[0][12],
                'buy1vol': data[0][11],
            })

    data = ts.get_realtime_quotes(s_id[0:6])
    data = data.to_records()
    db_session.close()
    return jsonify({
        'code': data[0][1],
        'name': data[0][2],
        'price': data[0][3],
        'min': 0,
        'max': 0,
        'vol_has': 0,
        'bid5': data[0][30],
        'bid5vol': data[0][29],
        'bid4': data[0][28],
        'bid4vol': data[0][27],
        'bid3': data[0][26],
        'bid3vol': data[0][25],
        'bid2': data[0][24],
        'bid2vol': data[0][23],
        'bid1': data[0][22],
        'bid1vol': data[0][21],
        'buy5': data[0][20],
        'buy5vol': data[0][19],
        'buy4': data[0][18],
        'buy4vol': data[0][17],
        'buy3': data[0][16],
        'buy3vol': data[0][15],
        'buy2': data[0][14],
        'buy2vol': data[0][13],
        'buy1': data[0][12],
        'buy1vol': data[0][11],
    })


@app.route("/trade", methods=['POST'])
def trade():
    form = request.form
    user_id = form.get('user_id')
    trade_id = form.get('id')
    price = Decimal(form.get('price'))
    trade_count = int(form.get('counts'))
    option = form.get('option')
    trade_type = form.get('type')
    action = form.get('action')
    db_session = DBSession()
    user = db_session.query(User).filter_by(username=user_id).first()
    if user is not None:
        if action == 'buy':
            if trade_type == 'stock':
                stock_account = db_session.query(Account).filter_by(
                    associate_id=user_id, account_type='stock').first()
                if (price * trade_count) < stock_account.remain:
                    data = ts.get_realtime_quotes(trade_id[0:6])
                    data = data[['name', 'price']]
                    data = data.to_records()
                    new_stock = Stock(trade_id, data[0][1], Decimal(data[0][2]), price,
                                      Decimal(data[0][2]) * trade_count, trade_count,
                                      (Decimal(data[0][2]) - price) * trade_count,
                                      stock_account.account_id)
                    db_session.add(new_stock)
                    new_remain = stock_account.remain - (price * trade_count)
                    db_session.query(Account).filter_by(
                        associate_id=user_id, account_type='stock').update(
                            {'remain': new_remain})
                    new_order = MyOrder(
                        trade_id, trade_id[0:6], data[0][1], 'stock', '买入',
                        price, trade_count, 'finished', Decimal(data[0][2]) * trade_count,
                        datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                        user_id)
                    db_session.add(new_order)
            elif trade_type == 'future':
                pass
        elif action == 'bid':
            if trade_type == 'stock':
                stock_account = db_session.query(Account).filter_by(
                    associate_id=user_id, account_type='stock').first()
                if (price * trade_count) > 0:
                    data = ts.get_realtime_quotes(trade_id)
                    data = data[['name', 'price']]
                    data = data.to_records()
                    origin_stock = db_session.query(Stock).filter_by(
                        associate_account=stock_account.account_id,
                        code=trade_id).first()
                    if origin_stock.amount >= trade_count:
                        db_session.query(Stock).filter_by(
                            associate_account=stock_account.account_id,
                            code=trade_id).update({
                                'amount': origin_stock.amount - trade_count
                            })
                        db_session.query(Account).filter_by(
                            associate_id=user_id, account_type='stock').update(
                                {'remain': stock_account.remain + (price * trade_count)})
                        new_order = MyOrder(trade_id, trade_id[0:6], data[0][1],
                                            'stock', '卖出', price, trade_count,
                                            'finished', Decimal(data[0][2]) * trade_count,
                                            datetime.datetime.now().strftime(
                                                "%Y-%m-%d %H:%M:%S"), user_id)
                        db_session.add(new_order)

            elif trade_type == 'future':
                pass
        db_session.commit()
        db_session.close()
        return jsonify({
            'result': 'succeed'
        })
    else:
        return jsonify({
            'error': 'Invalid user!'
        })


@app.route("/orders", methods=['POST'])
def orders():
    form = request.form
    user_id = form.get('user_id')
    start_date = form.get('date', '1990-01-01')
    if start_date == '':
        start_date = '1990-01-01 00:00:00'
    db_session = DBSession()
    user = db_session.query(User).filter_by(username=user_id).first()
    res = []
    if user is not None:
        order_list = db_session.query(MyOrder).filter(
            MyOrder.associate_id == user_id,
            MyOrder.date_time > start_date).all()
        res = []
        for order in order_list:
            res.append({
                'order_id': order.order_id,
                'id': order.id,
                'code': order.code,
                'name': order.name,
                'type': order.o_type,
                'status': order.status,
                'count': order.count,
                'price': str(order.price),
                'finished': order.finished
            })
    db_session.close()
    return jsonify({'orders': res})


@app.route("/orderundo", methods=['POST'])
def order_undo():
    form = request.form
    user_id = form.get('user_id')
    order_id = form.get('order_id')
    db_session = DBSession()
    user = db_session.query(User).filter_by(username=user_id).first()
    if user is not None:
        order = db_session.query(MyOrder).filter(
            MyOrder.associate_id == user_id,
            MyOrder.order_id == order_id).first()
        if order.finished != 'finished':
            db_session.delete(order)
            db_session.commit()
            db_session.close()
            return jsonify({'res': 'succeed'})
        else:
            db_session.close()
            return jsonify({'res': 'fail'})


@app.route("/quitaccount", methods=['POST'])
def quit_account():
    form = request.form
    user_id = form.get('user_id')
    a_type = form.get('type')
    a_id = form.get('id')
    db_session = DBSession()
    user = db_session.query(User).filter_by(username=user_id).first()
    if user is not None:
        account = db_session.query(Account).filter_by(
            account_id=a_id, account_type=a_type).first()
        db_session.delete(account)
        db_session.commit()
        db_session.close()
    return None


@app.route("/selfstock", methods=['POST'])
def self_stock():
    form = request.form
    result = []
    if form is not None:
        db_session = DBSession()
        user = db_session.query(User).filter_by(username=form.get('id')).first()
        db_session.close()
        stock_list = user.get_stock_list()
        for code in stock_list:
            data = ts.get_realtime_quotes(code)
            data = data[['name']]
            data = data.to_records()
            name = data[0][1]
            initial = ""
            for i in range(len(name)):
                initial += pinyin.get_initial(name[i])
            result.append([code + initial, code, name])
    return jsonify({'selfstock': result})


@app.route("/selfstockadd", methods=['POST'])
def self_stock_add():
    form = request.form
    user_id = form.get('user_id')
    id = form.get('id')[0:6]
    db_session = DBSession()
    user = db_session.query(User).filter_by(username=user_id).first()
    if user is not None:
        stock_list = user.get_stock_list()
        if id in stock_list:
            db_session.close()
        else:
            user.stock_list += id
            db_session.query(User).filter_by(username=user_id).update(
                {'stock_list': user.stock_list})
            db_session.close()
    return None


@app.route("/selfstockdelete", methods=['POST'])
def self_stock_delete():
    form = request.form
    user_id = form.get('user_id')
    id = form.get('id')[0:6]
    db_session = DBSession()
    user = db_session.query(User).filter_by(username=user_id).first()
    if user is not None:
        stock_list = user.get_stock_list()
        if id in stock_list:
            new_stock_list = ''
            for i in range(len(stock_list)):
                if id != stock_list[i]:
                    new_stock_list += stock_list[i]
            db_session.query(User).filter_by(username=user_id).update(
                {'stock_list': new_stock_list})
            db_session.close()
    return None


@app.route("/data/hours")
@allow_cross_domain
def hours():
    default_code = '600848'
    default_start = '2016-01-01'
    default_end = '2016-05-31'
    df = ts.get_today_ticks(default_code)
    r_columns = ['time', 'price', 'volume', 'amount', 'pchange']
    df = df.loc[:, r_columns]
    df = df.to_records()
    length2 = len(df)
    list2 = [[] for i in range(0, length2)]
    for x in range(0, length2)[::-1]:
        temp = [df[x][y] for y in range(0, 6)]
        list2[length2 - x - 1] = temp
    return jsonify(list2)


@socket_io.on('request')
def recv_message(message):
    data = ts.get_realtime_quotes(message['data'])
    current_columns = [
        'time', 'price', 'volume', 'amount', 'code', 'name', 'bid', 'ask',
        'date'
    ]
    raw_data = data.loc[:, current_columns]
    res = raw_data.to_records()
    list = []
    length = len(current_columns)
    for i in range(0, length + 1):
        list.append(res[0][i])
    list[1] = (pd.to_datetime(str(list[1]))).strftime("%H:%M:%S")
    if list is not None:
        emit('response', {'data': list})
