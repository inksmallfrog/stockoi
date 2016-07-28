import tushare as ts

#config
scode = '600133'
start_date = '2016-07-20'
end_date = '2016-07-27'


def calculate_index(scode,start_date,end_date):

    # get basic information
    raw_basic_data = ts.get_stock_basics()
    basic_data_columns = ['code','name','outstanding','liquidAssets']
    raw_basic_data = raw_basic_data.loc[scode,basic_data_columns]
    basic_data = [raw_basic_data[1],raw_basic_data[2],raw_basic_data[3]]

    # get history data
    raw_data = ts.get_hist_data(scode,start=start_date,end=end_date,ktype='5')
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
    amount = raw_data_history.loc[:,['amount']]
    amount = amount.to_records()[0][1]
    total_mf = abs(total_ff)
    total_liquid_assets = basic_data[2]
    total_assets_change = basic_data[1]*(useful_data[0][2]-useful_data[l-1][1])
    r = (useful_data[0][2]-useful_data[l-1][1])/useful_data[l-1][1]

    return [scode,total_mf,total_mf/amount,total_mf/total_liquid_assets,total_assets_change/total_mf,r]


calculate_index(scode,start_date,end_date)