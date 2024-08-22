# 导入所需的库和模块
import pybroker as pb
from pybroker import Strategy, ExecContext
from pybroker.ext.data import AKShare
import akshare as ak
import pandas as pd
import time
import datetime
import numpy as np

# 定义全局参数 "stock_code"（股票代码）、"percent"（持仓百分比）和 "stop_profit_pct"（止盈百分比）

# 以下参数可能需要前端传输
stock_code="000001"
percent=10
stop_loss_pct=10
stop_profit_pct=10
start_date=""
end_date=""

stock_ls=[]  # molonca 选股用


def get_params(code, pct, stop_loss, stop_profit, start, end):
    global stock_code
    stock_code=code
    print(stock_code)  # 股票代码（字符串形式）
    print(type(stock_code))
    global percent
    percent=pct
    print(percent)  # 仓位占比， 单位 %
    print(type(percent))
    global stop_loss_pct
    stop_loss_pct=stop_loss
    print(stop_loss_pct)  # 止损位，单位 %
    print(type(stop_loss_pct))
    global stop_profit_pct
    stop_profit_pct=stop_profit
    print(stop_profit_pct)  # 止盈位，单位 %
    print(type(stop_profit_pct))
    global start_date
    start_date=start
    print(start_date)  # 回测起始日期， str, 格式示例 20220104
    print(type(start_date))
    global end_date
    end_date=end
    print(end_date)  # 回测结束日期， str, 格式示例 20220104
    print(type(end_date))

# 策略：如果当前没有持有该股票，则买入股票，并设置止盈点位
def buy_with_stop_loss(ctx: ExecContext):
    pos = ctx.long_pos()
    if not pos:
        # 计算目标股票数量，根据 "percent" 参数确定应购买的股票数量
        ctx.buy_shares = ctx.calc_target_shares(percent)
        ctx.hold_bars = 50
    else:
        ctx.sell_shares = pos.shares
        # 设置止盈点位，根据 "stop_profit_pct" 参数确定止盈点位
        ctx.stop_profit_pct = stop_loss_pct
        
def buy_low(ctx: ExecContext):
    # 如果当前已经持有仓位，则不再买入。
    if ctx.long_pos():
        return
    # 如果当前的收盘价小于前一天的最低价，则下单买入。
    if ctx.bars >= 49 and ctx.close[-1] < ctx.low[-2]:
        # 计算买入的股票数量，该数量为当前资金的 percent%。
        ctx.buy_shares = ctx.calc_target_shares(percent)
        # 设置买入的限价，该限价为当前收盘价减去 0.04。
        ctx.buy_limit_price = ctx.close[-1] - 0.04
        # 设置持有仓位的时间，该时间为 50 个交易日。
        ctx.hold_bars = 50

# MACD与HMA交叉策略
def ema(data, n):
    data=pd.Series(data,dtype=float)
    print("data========")
    print(data)
    return data.ewm(span=n, adjust=False).mean()

def MACD(data, n_fast=12, n_slow=26, n_signal=9):
    ema_fast = ema(data, n_fast)
    print("ema_fast========")
    print(ema_fast)
    ema_slow = ema(data, n_slow)
    dif = ema_fast - ema_slow
    dea = ema(dif, n_signal)
    print("dea========")
    print(dea)
    macd = 2 * (dif - dea)
    return dif,macd,dea

def hma(data, n): # Hull Moving Average, n is period
    data=pd.Series(data,dtype=float)
    wma1 = 2*data.rolling(window=n//2).mean() - data.rolling(window=n).mean()
    hma = wma1.rolling(window=int(n**0.5)).mean()
    return hma

def macd_hma_cross(ctx: ExecContext):  # 推荐时间跨度长一些的，尽量超过2年

    # MACD 和赫尔移动平均线 (HMA)的混合旨在通过减少滞后和提高响应能力来完善基本 MACD 移动平均线策略。
    # 这种组合经常被认为是最好的 MACD 交易策略之一，充分利用了这两个指标的优势。
    # 这里使用的赫尔移动平均线是 10 周期和 20 周期 HMA。
    # 就像 MACD 一样，交易者寻找交叉事件，但在这种情况下，交叉事件来自 MACD 和 HMA，并且最好彼此非常接近。
    
    # 入口: 
    # 对于看涨前景，交易者可能会在 10 周期 HMA 穿越 20 周期 HMA 的同时，寻找 MACD 线穿越信号线上方。
    # 相反，在看跌头寸中，MACD 线应该在接近 10 周期 HMA 穿过 20 周期 HMA 时低于信号线。
    # 止损: （但没用这个）
    # 交易者经常将止损设置在附近波动点之上或之下。
    # 另一种方法可能是将止损设置在 20 周期 HMA 上方。
    # 从中受益: （但没用这个）
    # 交易者通常考虑在附近的支撑位（空头）或阻力位（多头）处获利了结。
    # 另一种方法可能是当 HMA 中发生相反的交叉事件时平仓。

    data=ctx.close
    print("data========")
    print(data)

    hma_21=hma(data, 10)
    print("hma_21========")
    print(hma_21)
    hma_50=hma(data, 20)
    print("hma_50========")
    print(hma_50)
    dif,macd,dea=MACD(data, 12, 26, 9) #dea is signal

    print("macd========")
    print(macd)
    print("dea========")
    print(dea)
    print("hma_21========")
    print(hma_21)
    
    macd_size=macd.size
    hma_21_size=hma_21.size
    hma_50_size=hma_50.size
    dea_size=dea.size
    dif_size=dif.size
    
    if dif_size > 2 and dea_size>2 and hma_21_size > 2 and hma_50_size > 2:
        print("flag2")
        if (dif[dif_size-1]>=dea[dea_size-1])&(dif[dif_size-2]<=dea[dea_size-2]) & (hma_21[hma_21_size-2] <= hma_50[hma_50_size-2]) and (hma_21[hma_21_size-1] >= hma_50[hma_50_size-1]):
            ctx.buy_shares = ctx.calc_target_shares(percent)
            ctx.buy_limit_price = ctx.close[-1] - 0.04
            ctx.hold_bars = 1
        elif (dif[dif_size-1]<=dea[dea_size-1]) & (hma_21[hma_21_size-1] >= hma_50[hma_50_size-1]) & (hma_21[hma_21_size-2] <= hma_50[hma_50_size-2]) and ctx.long_pos():
            ctx.sell_shares = ctx.long_pos().shares

def macd_cross(ctx: ExecContext):  #金叉+死叉
    data=ctx.close

    dif,macd,dea=MACD(data, 12, 26, 9)

    print("macd========")
    print(macd)
    # if ctx.long_pos():
    #     return
    if dif.size > 2 and dea.size > 2:
        print("flag1")
        if dif[dif.size-1] >= dea[dea.size-1] and dif[dif.size-2] < dea[dea.size-2]:
            ctx.buy_shares = ctx.calc_target_shares(percent)
            ctx.buy_limit_price = ctx.close[-1] - 0.04
            ctx.hold_bars = 6
        if dif[dif.size-1] < dea[dea.size-1] and dif[dif.size-2] >= dea[dea.size-2] and ctx.long_pos():
            ctx.sell_shares = ctx.long_pos().shares

def molonka(): # 莫伦卡选股策略
    ## A 股上市公司的实时行情数据
    stock_zh_a_spot_df = ak.stock_zh_a_spot()
    #print(stock_zh_a_spot_df)
    ##取前300测试
    ##取前300测试
    df_stock = stock_zh_a_spot_df[['代码','名称']][:20]
    anyData = {'stock':'00','name':'name_test','指标1':'var1','指标1':'var1','指标2':'var2','指标3':'var3','指标4':'var4','综合评估':'varAll'}
    dfResult = pd.DataFrame(anyData,index=[0])
    
    
    for row_index, row in df_stock.iterrows():
        try:
        # print(row['code'])
        # print(row['name'])
            r_code = row['代码'][2:]
            r_name = row['名称']
    
            print(r_code)
            ##指标1 - 过去5年来平均净资产收益率高于14%
            df = ak.stock_financial_analysis_indicator(r_code)# 财务指标数据 工行财报
            # print(df.head())
            df = df.set_index(df['日期'])
            print(df.head())
            df1 = df[df.index>'2015-01-01']['净资产收益率(%)']
            df1_sum = df1.replace('--',0).astype(float).sum(axis = 0, skipna = True)
            df1_count = df1.count()
            var1 = (df1_sum / df1_count)>14
    
            ##指标2- 市盈率低于30 并且大于 0 
            day = (datetime.datetime.now()- datetime.timedelta(days=30))
            dateStart = datetime.datetime(day.year, day.month, day.day, 0, 0, 0)##过去30天的数据
            dateStart = datetime.datetime.strptime(str(dateStart),'%Y-%m-%d %H:%M:%S')
            dateStart = datetime.datetime.date(dateStart) 
            df2 = ak.stock_a_lg_indicator("601398")
            df2_mean = df2[df2.trade_date >dateStart ].pe.mean()
            var2 = df2_mean >0 and df2_mean < 30
    
    
            #指标3：经营现金流为正
    
            df3 = df#财务指标数据
            var3 = float( df3['每股经营性现金流(元)'].iat[1] ) > 0
            # print(var3)
    
            #指标4：新期的净利润大于前5年的净利润 取万元
    
            var4_1 = float(df3['扣除非经常性损益后的净利润(元)'].iat[1])/ 10000 
            var4_2 =  df3['扣除非经常性损益后的净利润(元)'].iloc[2:8].astype(np.float).max()/10000 
    
            var4 = var4_1 > var4_2
            
            ##综合评估
            
            varAll = var1 and var2 and var3 and var4
            if varAll == True:
                print(row)
                global stock_ls
                stock_ls.append(r_code)
            anyData = {'stock':r_code,'name':r_name,'指标1':var1,'指标1':var1,'指标2':var2,'指标3':var3,'指标4':var4,'综合评估':varAll}
            df_idex = row_index+1
            dfResult.loc[df_idex] = anyData
            print(dfResult)
            print("stock list =====")
            print(stock_ls)
            
        except:
            continue
        #time.sleep(7)
    return stock_ls

def run(initial_cash, strategy_name): # 参数：用户的金额, 策略名称
    # 创建策略名称到函数的映射
    strategy_map = {
        "buy_with_stop_loss": buy_with_stop_loss,
        "buy_low": buy_low,
        "molonka": molonka,
        "macd_hma_cross": macd_hma_cross,
        "macd_cross": macd_cross
    }
    global stock_code
    global percent
    global stop_loss_pct
    global stop_profit_pct
    global start_date
    global end_date
    # print(stock_code)
    # print(percent)
    # print(stop_loss_pct)
    
    ak_history=ak.stock_zh_a_hist(symbol=stock_code, start_date=start_date, end_date=end_date)
    ak_history=ak_history.rename(columns={'股票代码':'symbol','日期':'date','开盘':'open','最高':'high','最低':'low','收盘':'close'})
    print(ak_history)
    
    if strategy_name == "molonka":
        return molonka()
    
    my_config = pb.StrategyConfig(initial_cash=initial_cash*percent/100)
    start_date = pd.to_datetime(start_date)
    end_date = pd.to_datetime(end_date)
    strategy = Strategy(data_source=ak_history, start_date=start_date, end_date=end_date, config=my_config)
    
    # 从映射中获取策略函数
    strategy_func = strategy_map.get(strategy_name)
    if strategy_func is None:
        raise ValueError(f"Unknown strategy: {strategy_name}")
    
    strategy.add_execution(fn=strategy_func, symbols=stock_code)
    
    ak_history['date'] = pd.to_datetime(ak_history['date'])
    result = strategy.backtest()
    
    print(result.metrics_df.round(4)) # 查看绩效  
    print(type(result.metrics_df))
    print(result.orders) # 查看订单
    print(result.positions) # 查看持仓
    print(result.portfolio) # 查看投资组合
    print(result.trades) # 查看交易
    start_date = start_date.strftime("%Y%m%d")
    end_date = end_date.strftime("%Y%m%d")
    
    # 选择 name==total_return_pct, max_drawdown_pct, avg_return_pct, sharpe, sortino, upi的行  
    #pct is percent
    df = result.metrics_df.round(4)
    selected_row=df.iloc[[5,10,16,32,33,36],:]
   
    print(selected_row)
    
    # rename into chinese
    
    # sortino: 索提诺比率是一种衡量投资组合相对表现的方法。与夏普比率(Sharpe Ratio)有相似之处，
    # 但索提诺比率运用下偏标准差而不是总标准差，以区别不利和有利的波动。和夏普比率类似，
    # 这一比率越高，表明基金承担相同单位下行风险能获得更高的超额回报率。
    
    # max draw down :最大回撤率是指在选定周期内任一历史时点往后推，产品净值走到最低点时的收益率回撤幅度的最大值。
    # 最大回撤用来描述买入产品后可能出现的最糟糕的情况
    
    # ulcer performance index ----upi是一种用于衡量投资策略回报与风险调整的指标。
    # UPI结合了Ulcer指数（Ulcer Index，UI）和投资组合的总收益来度量投资策略的绩效。
    
    
    return selected_row

# test
# get_params("000001",10,10,10,"20190601","20200611")
# print(stock_code)
# print(percent)
# print(stop_loss_pct)
# print(stop_profit_pct) # ok

# run(100000,"macd_hma_cross") # ok
# run(100000,"macd_cross")   # ok
# run(100000,"buy_with_stop_loss") # ok

# run(100000,"molonka") # ok
# run(100000,"buy_low") # ok

# molonka()    # ok