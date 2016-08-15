from stock.algorithm.select_money_flow import get_score
from pyalgotrade import strategy
import datetime
import time


class MoneyFlowStrategy(strategy.BacktestingStrategy):

    def __init__(self, feed):
        strategy.BacktestingStrategy.__init__(self, feed)

    def onBars(self, bars):
        # using one year data to backtest the strategy
        print ""
