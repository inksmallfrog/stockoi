# coding:utf-8
import tushare as ts
from svmutil import *

# 因子选择：流通市值 市净率 市销率 PE 当周换手率/前一周换手率 主营业务同比增长率 ROE 现金流量/营业收入
# 流通市值：流通股本×当前股票价格
# 市净率
# pe 市盈率
# 市销率 股价/每股销售额 ？？
# 当周平均换手率/前一周平均换手率
# 主营业务增长率【同比】
# 净资产收益率 ps = eps*totalAssets

raw_data = ts.get_stock_basics()
# code,代码
# name,名称
# industry,所属行业
# area,地区
# pe,市盈率
# outstanding,流通股本 1
# totals,总股本(万)
# totalAssets,总资产(万)
# liquidAssets,流动资产
# fixedAssets,固定资产
# reserved,公积金
# reservedPerShare,每股公积金
# eps,每股收益
# bvps,每股净资
# pb,市净率 2
# timeToMarket,上市日期
raw_data_today = ts.get_today_all()

# code：代码
# name:名称
# changepercent:涨跌幅
# trade:现价 1
# open:开盘价
# high:最高价
# low:最低价
# settlement:昨日收盘价
# volume:成交量
# turnoverratio:换手率

raw_data_history = ts.get_hist_data()

# date：日期
# open：开盘价
# high：最高价
# close：收盘价
# low：最低价
# volume：成交量
# price_change：价格变动
# p_change：涨跌幅
# ma5：5日均价
# ma10：10日均价
# ma20:20日均价
# v_ma5:5日均量
# v_ma10:10日均量
# v_ma20:20日均量
# turnover:换手率[注：指数无此项] 4/4

raw_data_profit = ts.get_profit_data()
# code,代码
# name,名称
# roe,净资产收益率(%) 7
# net_profit_ratio,净利率(%)
# gross_profit_rate,毛利率(%)
# net_profits,净利润(万元)
# eps,每股收益
# business_income,营业收入(百万元)
# bips,每股主营业务收入(元)

raw_data_report = ts.get_report_data()

# code,代码
# name,名称
# eps,每股收益
# eps_yoy,每股收益同比(%)
# bvps,每股净资产
# roe,净资产收益率(%)
# epcf,每股现金流量(元)
# net_profits,净利润(万元)
# profits_yoy,净利润同比(%)
# distrib,分配方案
# report_date,发布日期

raw_data_growth = ts.get_growth_data()

# code,代码
# name,名称
# mbrg,主营业务收入增长率(%) 6
# nprg,净利润增长率(%)
# nav,净资产增长率
# targ,总资产增长率
# epsg,每股收益增长率
# seg,股东权益增长率
