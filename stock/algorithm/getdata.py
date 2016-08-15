import tushare as ts
import os
from stock.algorithm.select_money_flow import get_valid_codes

# 下载每只股票指定年份内的历史数据，并以CSV格式保存


def DownLoadHistory(start_date, end_date):
    start = start_date
    end = end_date
    codes = get_valid_codes()
    for i in range(len(codes)):
        path = '../algorithm/data/' + start + \
            '-to-' + end + '-' + codes[i] + '.csv'
        if os.path.exists(path):
            print "File exits!"
        else:
            raw_data = ts.get_hist_data(
                codes[i], start=start, end=end, ktype='D')
            raw_data.to_csv(
                '../algorithm/data/' + start + '-to-' + end + '-' + codes[i] +
                '.csv',
                columns=[
                    'open', 'close', 'volume'
                ])
            print "Done!"
