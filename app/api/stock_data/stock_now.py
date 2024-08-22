from bs4 import BeautifulSoup
import requests
import re
import json
import time
import asyncio
import aiohttp
from datetime import datetime


#"f2":最新价 "f3":涨跌幅 "f4":涨跌额 "f5":成交手 "f6":成交额 "f7":振幅 "f8":换手率 "f9":市盈率
#"f10":量比 "f12":股票代码 "f14":股票名称 "f15":最高价 "f16":最低价 "f17":开盘价 "f18":昨日收盘价

pattern=r'{"f1":.*,"f2":.*,"f3":.*,"f4":.*,"f5":.*,"f6":.*,"f7":.*,"f8":.*,"f9":.*,"f10":.*,"f11":.*,"f12":.*,"f13":.*,"f14":.*,"f15":.*,"f16":.*,"f17":.*,"f18":.*,"f20":.*,"f21":.*,"f22":.*,"f23":.*,"f24":.*,"f25":.*,"f62":.*,"f115":.*,"f128":.*,"f140":.*,"f141":.*,"f136":.*,"f152":2}'

async def fetch_page(session, url):
    async with session.get(url) as response:
        return await response.text()

async def parse_page(html,data_useful,user_stocks):
    result=html.split("jQuery112405872191707284955_1718064715382")[1].split("(")[1].split(");")[0]
    result_json = json.loads(result)
    stock_data = result_json['data']['diff']
    extracted_data = [{'f2': item['f2'], 'f12': item['f12']} for item in stock_data]
    useful_dict={d['f12']: d['f2'] for d in extracted_data if d['f12'] in user_stocks}
    if useful_dict!={}:
        data_useful.update(useful_dict)
        print(data_useful)

async def main_spider(user_stocks):
    urls=[]
    for i in range(1, 281):
        url="https://6.push2.eastmoney.com/api/qt/clist/get?cb=jQuery112405872191707284955_1718064715382&pn=%s&pz=20&po=1&np=1&ut=bd1d9ddb04089700cf9c27f6f7426281&fltt=2&invt=2&dect=1&wbp2u=|0|0|0|web&fid=f3&fs=m:0+t:6,m:0+t:80,m:1+t:2,m:1+t:23,m:0+t:81+s:2048&fields=f1,f2,f3,f4,f5,f6,f7,f8,f9,f10,f12,f13,f14,f15,f16,f17,f18,f20,f21,f23,f24,f25,f22,f11,f62,f128,f136,f115,f152&_=1718064715383"%str(i)
        urls.append(url)
    
    data_useful={}

    async with aiohttp.ClientSession() as session:
        tasks = [fetch_page(session, url) for url in urls]
        pages = await asyncio.gather(*tasks)
        for page in pages:
            await parse_page(page,data_useful,user_stocks)
    print(data_useful)
    
    return data_useful
'''
if __name__ == '__main__':
    loop = asyncio.get_event_loop()  # 获取事件循环对象
    loop.run_until_complete(main_spider(['301036','600792']))
'''
    