import csv
from bs4 import BeautifulSoup
import requests
import re
import pandas as pd
import json
import os
import time
from datetime import datetime
import matplotlib.pyplot as plt

# 15分钟K线数据
# 年月日 时间 开盘 收盘 最高 最低 成交量 成交额 振幅 涨跌幅 涨跌额 换手率
# 输入股票的代码，会返回类似这样的数据,数据的含义在上一行
# ['2024-06-07 14:45,27.77,26.93,27.88,26.82,13090,35751450.00,3.82,-3.06,-0.85,0.57', '2024-06-07 15:00,26.93,26.99,27.30,26.61,22486,60538399.00,2.56,0.22,0.06,0.97']

def fourth_K(stock_code):
    url="https://push2his.eastmoney.com/api/qt/stock/kline/get?cb=jQuery35105479267395192431_1717989868926&secid=0.{}&ut=fa5fd1943c7b386f172d6893dbfba10b&fields1=f1%2Cf2%2Cf3%2Cf4%2Cf5%2Cf6&fields2=f51%2Cf52%2Cf53%2Cf54%2Cf55%2Cf56%2Cf57%2Cf58%2Cf59%2Cf60%2Cf61&klt=15&fqt=1&beg=0&end=20500101&smplmt=460&lmt=1000000&_=1717989868980".format(stock_code)
    res = requests.get(url)
    result = res.text.split("jQuery35108329701540956318_1717947318216")[1].split("(")[1].split(");")[0]
    print('444444')
    result_json = json.loads(result)
    return result_json

def third_K(stock_code):
    url="https://push2his.eastmoney.com/api/qt/stock/kline/get?cb=jQuery35108329701540956318_1717947318216&secid=0.{}&ut=fa5fd1943c7b386f172d6893dbfba10b&fields1=f1%2Cf2%2Cf3%2Cf4%2Cf5%2Cf6&fields2=f51%2Cf52%2Cf53%2Cf54%2Cf55%2Cf56%2Cf57%2Cf58%2Cf59%2Cf60%2Cf61&klt=15&fqt=1&beg=0&end=20500101&smplmt=460&lmt=1000000&_=1717947318279".format(stock_code)
    res = requests.get(url)
    result = res.text.split("jQuery35108329701540956318_1717947318216")[1].split("(")[1].split(");")[0]
    print('333333')
    result_json = json.loads(result)
    if result_json['data']==None:
        return fourth_K(stock_code)
    return result_json

def second_K(stock_code):
    url="https://push2his.eastmoney.com/api/qt/stock/kline/get?cb=jQuery35108419604988731728_1717992214047&secid=1.{}&ut=fa5fd1943c7b386f172d6893dbfba10b&fields1=f1%2Cf2%2Cf3%2Cf4%2Cf5%2Cf6&fields2=f51%2Cf52%2Cf53%2Cf54%2Cf55%2Cf56%2Cf57%2Cf58%2Cf59%2Cf60%2Cf61&klt=15&fqt=1&end=20500101&lmt=286&_=1717992214082".format(stock_code)
    res = requests.get(url)
    result = res.text.split("jQuery35108419604988731728_1717992214047")[1].split("(")[1].split(");")[0]
    print('222222')
    result_json = json.loads(result)
    if result_json['data']==None:
        return third_K(stock_code)
    return result_json
    
def find_stock_data_K(stock_code):
    url="https://push2his.eastmoney.com/api/qt/stock/kline/get?cb=jQuery351014286830443532517_1717583932322&secid=0.{}&ut=fa5fd1943c7b386f172d6893dbfba10b&fields1=f1%2Cf2%2Cf3%2Cf4%2Cf5%2Cf6&fields2=f51%2Cf52%2Cf53%2Cf54%2Cf55%2Cf56%2Cf57%2Cf58%2Cf59%2Cf60%2Cf61&klt=15&fqt=1&beg=0&end=20500101&smplmt=460&lmt=1000000&_=1717583932457".format(stock_code)
    res = requests.get(url)
    result = res.text.split("jQuery351014286830443532517_1717583932322")[1].split("(")[1].split(");")[0]
    print('111111')
    result_json = json.loads(result)
    if result_json['data']==None: #所有的股票数据
        result_json=second_K(stock_code)
    stock_data = result_json['data']['klines'] #所有的股票数据
    stock_data= stock_data[-50:] #得到最近50条
    print(stock_data)
    
    times, prices_begin, prices_end, prices_highest, prices_lowest = zip(*[(data.split(',')[0], float(data.split(',')[1]), float(data.split(',')[2]), float(data.split(',')[3]), float(data.split(',')[4])) for data in stock_data])
    '''
    times = [data.split(',')[0] for data in stock_data]
    prices_begin = [float(data.split(',')[1]) for data in stock_data]
    prices_end=[float(data.split(',')[2]) for data in stock_data]
    prices_highest=[float(data.split(',')[3]) for data in stock_data]
    prices_lowest=[float(data.split(',')[4]) for data in stock_data]
    '''
    result = [{"时间": times[i], "开盘": prices_begin[i], "收盘": prices_end[i], "最高": prices_highest[i], "最低": prices_lowest[i]} for i in range(len(times))]
    print(result)
    return result

if __name__=='__main__':
    find_stock_data_K(300722)

