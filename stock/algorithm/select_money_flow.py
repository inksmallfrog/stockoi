# coding:utf-8
# author: Mou Chenghao
# Last modification: 2016年08月14日

# This script is used to do the money flow strategy analysis
# Output:
#   code and its correspondent indexes(scores) in csv file(s) in score directory

from __future__ import division
import tushare as ts
import datetime
import time
import math
import Queue  # In python 3, you should change it to queue instead
import csv
import os
from threading import Thread

# Config
q = Queue.Queue()
stock_basics = ts.get_stock_basics()
basic_data_columns = ['outstanding', 'liquidAssets', 'timeToMarket']
stock_basics = stock_basics.loc[:, basic_data_columns]
stock_basics = stock_basics.to_records()


# Stdout redirection
class NullOut:

    def __init__(self):
        self.str = ''

    def write(self, s):
        self.str = ''

    def flush(self):
        self.str = ''


# Get the valid codes for today's market
def get_valid_codes():
    codes = []
    res = []
    length = len(stock_basics)

    month_ago_date = datetime.datetime.now() - datetime.timedelta(days=31)
    date_to = datetime.date(month_ago_date.year, month_ago_date.month, month_ago_date.day)
    month_ago_digit = date_to.year * 10000 + date_to.month * 100 + date_to.day

    for i in range(0, length):
        if stock_basics[i][3] <= month_ago_digit and stock_basics[i][1] != 0:
            codes.append(stock_basics[i][0])

    current_data_columns = ['code', 'changepercent']
    today_all = ts.get_today_all()
    today_all = today_all.loc[:, current_data_columns]
    today_all = today_all.to_records()
    filter_len = len(today_all)
    for i in range(0, filter_len):
        if -10 < today_all[i][2] < 10 and (today_all[i][1] in codes):
            res.append(today_all[i][1])
    return res


# calculate the index for each code for certain time range
def calculate_index(scode, start_date, end_date):
    basic_data = []
    for i in range(0, len(stock_basics)):
        if stock_basics[i][0] == scode:
            basic_data = [stock_basics[i][1], stock_basics[i][2]]

    columns = ['open', 'close', 'volume']
    useful_data = ts.get_hist_data(scode, start=start_date, end=end_date)
    useful_data = useful_data.loc[:, columns]
    useful_data = useful_data.to_records()
    l = len(useful_data)
    total_ff = 0

    for i in range(0, l - 1):
        curr_record = useful_data[i]
        prev_record = useful_data[i + 1]
        if curr_record[2] == prev_record[2]:
            curr_mf_factor = 0
        else:
            curr_mf_factor = (curr_record[3] * 100) * (curr_record[2]) * (
                (curr_record[2] - prev_record[2]) / abs(curr_record[2] - prev_record[2]))
        total_ff += curr_mf_factor

    raw_data_history = ts.get_h_data(code=scode, start=start_date, end=end_date, retry_count=3)

    if raw_data_history is not None:
        amount = raw_data_history.loc[:, ['amount']]
        amount = amount.to_records()
        total_amount = 0
        for i in range(0, len(amount)):
            total_amount += amount[i][1]
        total_mf = abs(total_ff)
        total_liquid_assets = basic_data[1]
        total_assets_change = basic_data[0] \
            * (useful_data[0][2] - useful_data[l - 1][1])
        r = (useful_data[0][2] - useful_data[l - 1][1]) / useful_data[l - 1][1]
        if total_mf == 0 or total_amount == 0 or total_liquid_assets == 0:
            return None
        else:
            result = [
                scode, total_mf, total_mf / total_amount, total_mf /
                total_liquid_assets, total_assets_change / total_mf, r
            ]
            return result
    else:
        return None


# Define a thread function to calculate the score for a piece of codes
def thread_func(codes, start_date, end_date):
    all_index = []
    for i in range(len(codes)):
        index = calculate_index(codes[i], start_date, end_date)
        if index is not None:
            if index[2] >= 0.1:
                all_index.append(index)
    q.put(all_index)


# Deploy the thread function to calculate all the score
def get_score(start_date, end_date):

    if os.path.exists('./score/' + start_date + '-' + end_date + '.csv'):
        csv_file = open('./score/' + start_date + '-' + end_date + '.csv', 'rb')
        reader = csv.reader(csv_file)
        final = []
        for line in reader:
            final.append(list(line))
        csv_file.close()
        return final

    codes = get_valid_codes()
    length = len(codes)
    all_index = []
    remainder = length % 20
    times = length // 20
    threads = []
    if remainder > 0:
        times += 1
    for i in range(0, times):
        if i < times - 1:
            thread = Thread(
                target=thread_func,
                args=(codes[i * 20:(i + 1) * 20 - 1], start_date, end_date))
        else:
            thread = Thread(
                target=thread_func,
                args=(codes[i * 20:],
                      start_date,
                      end_date,))
        threads.append(thread)
    for i in range(0, len(threads)):
        threads[i].start()
    for i in range(0, len(threads)):
        threads[i].join()
    while not q.empty():
        all_index.extend(q.get())

    index_list_len = len(all_index)
    index_list_ic = [all_index[x][2] for x in range(0, index_list_len)]
    index_list_mfp = [all_index[x][3] for x in range(0, index_list_len)]
    index_list_mfl = [all_index[x][4] for x in range(0, index_list_len)]
    index_list_r = [all_index[x][5] for x in range(0, index_list_len)]

    ic_sorted_list = sorted(index_list_ic)
    mfp_sorted_list = sorted(index_list_mfp)
    mfl_sorted_list = sorted(index_list_mfl)
    r_sorted_list = sorted(index_list_r)

    for i in range(0, index_list_len):
        all_index[i][2] = math.ceil(100 * (
            (ic_sorted_list.index(all_index[i][2])) / index_list_len))
        all_index[i][3] = math.ceil(100 * (
            (mfp_sorted_list.index(all_index[i][3])) / index_list_len))
        all_index[i][4] = math.ceil(100 * (
            (mfl_sorted_list.index(all_index[i][4])) / index_list_len))
        all_index[i][5] = math.ceil(100 * (
            (r_sorted_list.index(all_index[i][5])) / index_list_len))
        all_index[i].extend([all_index[i][5] + all_index[i][4] + all_index[i][3]
                             + all_index[i][2]])

    final = sorted(all_index, key=lambda index: index[6], reverse=True)

    csv_file = open('./score/' + start_date + '-' + end_date + '.csv', 'wb')
    writer = csv.writer(csv_file)
    writer.writerows(final)
    csv_file.close()


# Calculate all the score for all the codes with the one-year time slot
# Prepare for the back-test
def get_all_scores(start='2015-01-01', end='2015-12-31'):
    sd = time.strptime(start, '%Y-%m-%d')
    ed = time.strptime(end, '%Y-%m-%d')
    start_date = datetime.date(sd.tm_year, sd.tm_mon, sd.tm_mday)
    end_date = datetime.date(ed.tm_year, ed.tm_mon, ed.tm_mday)
    for i in range(0, (end_date - start_date).days + 1, 7):
        rend = start_date + datetime.timedelta(days=(i + 7))
        rstart = start_date + datetime.timedelta(days=i)
        print(rstart, rend)
        get_score(rstart.strftime('%Y-%m-%d'), rend.strftime('%Y-%m-%d'))
        print("Finished for {0} to {1}".format(
            rstart.strftime('%Y-%m-%d'), rend.strftime('%Y-%m-%d')))


# get_all_scores('2015-01-01', '2015-12-31')
get_score('2015-01-01', '2015-01-07')
