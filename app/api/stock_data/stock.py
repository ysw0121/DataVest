from bs4 import BeautifulSoup
import requests
import re
import pandas as pd
import json
import time
from datetime import datetime

#"f2":最新价 "f3":涨跌幅 "f4":涨跌额 "f5":成交手 "f6":成交额 "f7":振幅 "f8":换手率 "f9":市盈率
#"f10":量比 "f12":股票代码 "f14":股票名称 "f15":最高价 "f16":最低价 "f17":开盘价 "f18":昨日收盘价

pattern=r'{"f1":.*,"f2":.*,"f3":.*,"f4":.*,"f5":.*,"f6":.*,"f7":.*,"f8":.*,"f9":.*,"f10":.*,"f11":.*,"f12":.*,"f13":.*,"f14":.*,"f15":.*,"f16":.*,"f17":.*,"f18":.*,"f20":.*,"f21":.*,"f22":.*,"f23":.*,"f24":.*,"f25":.*,"f62":.*,"f115":.*,"f128":.*,"f140":.*,"f141":.*,"f136":.*,"f152":2}'

# 输入数字类型的page
# 返回这样形式的列表,每一个列表都是一个字典
# [{'f2': 6.13, 'f12': '002633', 'f14': '申科股份'}, {'f2': 6.68, 'f12': '000504', 'f14': '南华生物'}, {'f2': 4.49, 'f12': '688701', 'f14': '卓锦股份'}, {'f2': 2.63, 'f12': '002620', 'f14': '瑞和股份'}]
# 如果想要其他数据，你们可以直接修改extracted_data

def find_stock_data(page):
    try:
        url="https://42.push2.eastmoney.com/api/qt/clist/get?cb=jQuery11240021515409233019867_1711509557967&pn=%s&pz=20&po=1&np=1&ut=bd1d9ddb04089700cf9c27f6f7426281&fltt=2&invt=2&wbp2u=|0|0|0|web&fid=f3&fs=m:0+t:6,m:0+t:80,m:1+t:2,m:1+t:23,m:0+t:81+s:2048&fields=f1,f2,f3,f4,f5,f6,f7,f8,f9,f10,f12,f13,f14,f15,f16,f17,f18,f20,f21,f23,f24,f25,f22,f11,f62,f128,f136,f115,f152&_=1711509557968"%str(page)
        res = requests.get(url)
        result = res.text.split("jQuery11240021515409233019867_1711509557967")[1].split("(")[1].split(");")[0] 
    except:
        # 备用API，如果find_stock_data失效使用
        #url="https://46.push2.eastmoney.com/api/qt/clist/get?cb=jQuery112408410265176675529_1718185470446&pn=%s&pz=20&po=1&np=1&ut=bd1d9ddb04089700cf9c27f6f7426281&fltt=2&invt=2&dect=1&wbp2u=|0|0|0|web&fid=f3&fs=m:0+t:6,m:0+t:80,m:1+t:2,m:1+t:23,m:0+t:81+s:2048&fields=f1,f2,f3,f4,f5,f6,f7,f8,f9,f10,f12,f13,f14,f15,f16,f17,f18,f20,f21,f23,f24,f25,f22,f11,f62,f128,f136,f115,f152&_=1718185470447"%str(page)
        url="https://62.push2.eastmoney.com/api/qt/clist/get?cb=jQuery112408031653299998689_1717509750297&pn=%s&pz=20&po=1&np=1&ut=bd1d9ddb04089700cf9c27f6f7426281&fltt=2&invt=2&dect=1&wbp2u=|0|0|0|web&fid=f3&fs=m:0+t:6,m:0+t:80,m:1+t:2,m:1+t:23,m:0+t:81+s:2048&fields=f1,f2,f3,f4,f5,f6,f7,f8,f9,f10,f12,f13,f14,f15,f16,f17,f18,f20,f21,f23,f24,f25,f22,f11,f62,f128,f136,f115,f152&_=1717509750298"%str(page)
        res = requests.get(url)
        result = res.text.split("jQuery112408031653299998689_1717509750297")[1].split("(")[1].split(");")[0]
    result_json = json.loads(result)
    stock_data = result_json['data']['diff']
    extracted_data = [{'f2': item['f2'], 'f12': item['f12'], 'f14': item['f14'], 'f3': item['f3']} for item in stock_data]
    print(extracted_data)
    return extracted_data 


if __name__=='__main__':
    find_stock_data(2)    