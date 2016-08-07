from __future__ import division
import tushare as ts
import datetime
import math
import sys
import Queue
import time
from threading import Thread


#config
scode = '600133'
start_date = '2016-07-19'
end_date = '2016-07-27'
q = Queue.Queue()
basic_data_columns = ['code','name','outstanding','liquidAssets']
raw_basic_data = ts.get_stock_basics()
raw_basic_data = raw_basic_data.loc[scode,basic_data_columns]


def filter_codes():
    all = ts.get_stock_basics()
    all_codes = all.loc[:,['timeToMarket']]
    all_codes = all_codes.to_records();
    codes = []
    length = len(all_codes)
    # get the date and get rid of the codes if they came to the market within a month
    d = datetime.datetime.now()
    dayscount = datetime.timedelta(days = 31)
    dayto = d - dayscount
    date_to = datetime.date(dayto.year, dayto.month, dayto.day)
    month_before = date_to.year*10000 + date_to.month*100+date_to.day
    for i in range(0,length):
        if all_codes[i][1] <= month_before and all_codes[i][1] != 0:
            codes.append(all_codes[i][0])

    # get rid of the codes that are already stopped for any transaction
    current_data_columns = ['code','changepercent']
    current_data = ts.get_today_all()
    current_data = current_data.loc[:,current_data_columns]
    current_data = current_data.to_records()
    res = []
    filter_len = len(current_data)
    for i in range(0,filter_len):
        if current_data[i][2]<10 and current_data[i][2]>-10 and (current_data[i][1] in codes):
            res.append(current_data[i][1])
    return res


def calculate_index(scode,start_date,end_date):
    # get current basic information
    basic_data = [raw_basic_data[1],raw_basic_data[2],raw_basic_data[3]]

    # get daily history data
    raw_data = ts.get_hist_data(scode,start=start_date,end=end_date,ktype='D')
    columns = ['open','close','volume']
    useful_data = raw_data.loc[:,columns]
    useful_data = useful_data.to_records()
    l = len(useful_data)
    total_ff = 0

    # calculate the total money flow
    for i in range(0,l-1):
        curr_record = useful_data[i]
        pre_record  = useful_data[i+1]
        if curr_record[2] == pre_record[2]:
            curr_mf_factor = 0
        else:
            curr_mf_factor = ((curr_record[3]))*(curr_record[2])*((curr_record[2]-pre_record[2])/abs(curr_record[2]-pre_record[2]))
        total_ff += curr_mf_factor

    # calculate the rest of the indexes
    raw_data_history = ts.get_h_data(code=scode,start=start_date,end=end_date)
    if raw_data_history is not None:
        amount = raw_data_history.loc[:,['amount']]
        amount = amount.to_records()
        total_amount = 0

        for i in range(0,len(amount)):
            total_amount += amount[i][1]

        total_mf = abs(total_ff)
        total_liquid_assets = basic_data[2]
        total_assets_change = basic_data[1]*(useful_data[0][2]-useful_data[l-1][1])
        r = (useful_data[0][2]-useful_data[l-1][1])/useful_data[l-1][1]

        if total_mf == 0 or total_amount == 0 or total_liquid_assets == 0:
            return None
        else:
            result = [scode,total_mf,total_mf/total_amount,total_mf/total_liquid_assets,total_assets_change/total_mf,r]
            return result
    else:
        return None


def thread_func(codes,start_date,end_date,x):
    all_index = []
    print "\rBegin thread {0}".format(x)
    for i in xrange(len(codes)):
        index = calculate_index(codes[i],start_date,end_date)
        if index is not None:
            if index[2] >= 0.001:
                all_index.append(index)
    q.put(all_index)
    print "\rFinished thread {0}".format(x)


def get_score():
    ts = time.time()
    codes = filter_codes()
    length = len(codes)
    all_index = []
    remainder = length%20
    times = length//20
    threads = []
    if remainder > 0:
        times += 1
    for i in range(0,times):
        if i < times-1:
            thread = Thread(target=thread_func,args=(codes[i*20:(i+1)*20-1],start_date,end_date,i,))
        else:
            thread = Thread(target=thread_func,args=(codes[i*20:],start_date,end_date,i,))
        threads.append(thread)

    for i in range(0,len(threads)):
        threads[i].start()

    for i in range(0,len(threads)):
        threads[i].join()

    while not q.empty():
        all_index.extend(q.get())
    print all_index

    index_list_len = len(all_index)
    index_list_ic = [all_index[x][2] for x in range(0,index_list_len)]
    index_list_mfp = [all_index[x][3] for x in range(0,index_list_len)]
    index_list_mfl = [all_index[x][4] for x in range(0,index_list_len)]
    index_list_r = [all_index[x][5] for x in range(0,index_list_len)]

    ic_sorted_list = sorted(index_list_ic)
    mfp_sorted_list = sorted(index_list_mfp)
    mfl_sorted_list = sorted(index_list_mfl)
    r_sorted_list = sorted(index_list_r)

    for i in range(0,index_list_len):
        all_index[i][2] = math.ceil(100 * ((ic_sorted_list.index(all_index[i][2]))/index_list_len))
        all_index[i][3] = math.ceil(100 * ((mfp_sorted_list.index(all_index[i][3]))/index_list_len))
        all_index[i][4] = math.ceil(100 * ((mfl_sorted_list.index(all_index[i][4]))/index_list_len))
        all_index[i][5] = math.ceil(100 * ((r_sorted_list.index(all_index[i][5]))/index_list_len))
        all_index[i].extend([all_index[i][5]+all_index[i][4]+all_index[i][3]+all_index[i][2]])

    final = sorted(all_index,key=lambda index:index[6],reverse=True)
    print final
    print (time.time()-ts)

get_score()