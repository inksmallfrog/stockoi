#coding:utf-8
import datetime
import tushare as ts
import pandas as pd
import os
from stock.algorithm.select_money_flow import get_valid_codes

d = datetime.datetime.now()


def day_get(d):
    oneday = datetime.timedelta(days=1)
    day = d - oneday
    date_from = datetime.datetime(day.year, day.month, day.day, 0, 0, 0)
    date_to = datetime.datetime(day.year, day.month, day.day, 23, 59, 59)
    print '---'.join([str(date_from), str(date_to)])


def week_get(d):
    dayscount = datetime.timedelta(days=d.isoweekday())
    dayto = d - dayscount
    sixdays = datetime.timedelta(days=6)
    dayfrom = dayto - sixdays
    date_from = datetime.datetime(dayfrom.year, dayfrom.month, dayfrom.day, 0,
                                  0, 0)
    date_to = datetime.datetime(dayto.year, dayto.month, dayto.day, 23, 59, 59)
    print '---'.join([str(date_from), str(date_to)])


def month_get(d):
    dayscount = datetime.timedelta(days=d.day)
    dayto = d - dayscount
    date_from = datetime.datetime(dayto.year, dayto.month, 1, 0, 0, 0)
    date_to = datetime.datetime(dayto.year, dayto.month, dayto.day, 23, 59, 59)
    print '---'.join([str(date_from), str(date_to)])


# 下载每只股票指定年份内的历史数据，并以CSV格式保存
def DownLoadHistory(start_date, end_date):
    start = start_date
    end = end_date
    codes = get_valid_codes()
    print codes
    for i in range(len(codes)):
        path = '../algorithm/data/' + start + \
            '-to-' + end + '-' + codes[i] + '.csv'
        if os.path.exists(path):
            print "File exits!"
        else:
            raw_data = ts.get_hist_data(
                codes[i], start=start, end=end, ktype='D')
            raw_data = raw_data.loc[:, ['open', 'high', 'low', 'close', 'volume']]
            raw_data['Adj Close'] = pd.Series(0, index=raw_data.index)
            raw_data.columns = ['Open', 'High', 'Low', 'Close', 'Volume', 'Adj Close']
            raw_data.index = (pd.Series(raw_data.index.values, name='Date'))
            raw_data.to_csv(
                '../algorithm/data/' + start + '-to-' + end + '-' + codes[i] +
                '.csv',
                columns=[
                    'Open', 'High', 'Low', 'Close', 'Volume', 'Adj Close'
                ])
            print "Done!"


# DownLoadHistory('2015-01-01', '2015-12-31')