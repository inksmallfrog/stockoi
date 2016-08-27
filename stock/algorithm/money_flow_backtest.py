from stock.algorithm.select_money_flow import get_score, get_valid_codes
from pyalgotrade import strategy
from math import ceil
import datetime
import time
import os
from pyalgotrade.barfeed import yahoofeed


class MoneyFlowStrategy(strategy.BacktestingStrategy):

    def __init__(self, feed, instrument_list, start, end):
        strategy.BacktestingStrategy.__init__(self, feed)
        self.__instrument_list = instrument_list
        self.__position = None
        sd = time.strptime(start, '%Y-%m-%d')
        ed = time.strptime(end, '%Y-%m-%d')
        start_date = datetime.datetime(sd.tm_year, sd.tm_mon, sd.tm_mday)
        end_date = datetime.datetime(ed.tm_year, ed.tm_mon, ed.tm_mday)
        self.__start_date = start_date
        self.__end_date = end_date

    def onEnterOk(self, position):
        execInfo = position.getEntryOrder().getExecutionInfo()
        self.info("BUY at $%.2f" % (execInfo.getPrice()))

    def onEnterCanceled(self, position):
        self.__position = None

    def onExitOk(self, position):
        execInfo = position.getExitOrder().getExecutionInfo()
        self.info("SELL at $%.2f" % (execInfo.getPrice()))
        self.__position = None

    def onExitCanceled(self, position):
        # If the exit was canceled, re-submit it.
        self.__position.exitMarket()

    def onBars(self, bars):
        # using one week data, a week after the week used to
        # calculate the to back-test the strategy
        for i in range(len(self.__instrument_list)):
            instrument = self.__instrument_list[i]
            if bars.__contains__(instrument):
                bar = bars[instrument]
                if self.__position is None:
                    if self.__end_date >= bar.getDateTime(
                    ) >= self.__start_date:
                        self.__position = self.enterLong(instrument, 1000, True,
                                                         True)
                elif not self.__position.exitActive():
                    self.__position.exitMarket()
            else:
                return


def run_strategy():
    # Load the feed from the CSV file
    feed = yahoofeed.Feed()
    scores = get_score('2015-01-01', '2015-01-07')
    top_codes = []
    for i in range(int((len(scores) * 0.005))):
        top_codes.append(scores[i][0])
    print(top_codes)
    to_buy = []
    for code in top_codes:
        if os.path.exists('data/2015-01-01-to-2015-12-31-' + code + '.csv'):
            feed.addBarsFromCSV(
                code, 'data/2015-01-01-to-2015-12-31-' + code + '.csv')
            to_buy.append(code)
    print feed.getRegisteredInstruments()
    # Evaluate the strategy with the feed.
    myStrategy = MoneyFlowStrategy(
        feed, to_buy, start='2015-01-08', end='2015-12-31')
    myStrategy.run()
    print("Final portfolio value: $%.2f" % myStrategy.getBroker().getEquity())


run_strategy()
