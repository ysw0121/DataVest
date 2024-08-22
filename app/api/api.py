import time
import json
from flask import Flask, request, jsonify,send_from_directory
from datetime import datetime, timedelta, timezone
from flask_jwt_extended import create_access_token,get_jwt,get_jwt_identity, \
                               unset_jwt_cookies, jwt_required, JWTManager
from mypackage.database import (law_login,insert_into,same_email,user_information_by_email,setgender,try_update_phone,insert_stock,search_stock,
stockcode_by_email,stocknum_by_email,stockname_by_email,sell_stock)
from stock_data.stock import find_stock_data
from stock_data.stock_K import find_stock_data_K
from stock_data.stock_now import main_spider
from stock_data.quant_strategy import *
import asyncio
import aiohttp

#from mypackage.send_email import send_verification_email
from mypackage.database import same_email
app = Flask(__name__)

app.config["JWT_SECRET_KEY"] = "wxmzyx"
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=1)
jwt = JWTManager(app)

@app.route('/time')
def get_current_time():
    return {'time': time.time()}

# 登录如果有用户存在，那么分配token
@app.route('/token', methods=["POST","GET"])
def create_token():
    user_name=request.json.get("user_name", None)
    email = request.json.get("email", None)
    password = request.json.get("password", None)
    if law_login(user_name,email,password)==False:
        print(user_name,email,password)
        return {"msg": "Wrong email or password"}, 401
    access_token = create_access_token(identity=email)
    response = {"access_token":access_token}
    print(response)
    return response

# 注册时看email是否已经注册，如果已经注册返回错误，没有注册就发送验证码
@app.route('/yanzheng', methods=["POST"])
def yanzheng():
    data = request.get_json() 
    user_name=data.get("user_name", None)
    email = data.get("email", None)
    password = data.get("password", None)
    if_same=same_email(email)
    if if_same=='same':
        return {"msg": "already registered"}, 401
    else:
        print("验证码：",if_same)
        print(user_name,email,password)
        response = {"verificationcode": if_same}
        return response
    return {"msg": "unknown errors"}, 401

# 上面的验证通过后用于插入用户数据
@app.route('/insert_data', methods=["POST"])
def insert_data():
    data = request.get_json()
    user_name=data.get("user_name", None)
    email = data.get("email", None)
    password = data.get("password", None)
    try_insert=insert_into(user_name,email,password)
    if try_insert=='successful':
        print(user_name,email,password)
        access_token = create_access_token(identity=email)
        response = {"access_token":access_token,"msg":'successful'}
        return response
    return {"msg": "unknown errors"}, 401

# 登出函数，删掉token
@app.route("/logout", methods=["POST"])
def logout():
    response = jsonify({"msg": "logout successful"})
    unset_jwt_cookies(response)
    return response

# 用于获取股票的信息
@app.route('/stockdata',methods=['POST','GET'])
@jwt_required()
def stockdata():
    num = request.args.get('num')
    user_email = get_jwt_identity()
    print(user_email)
    return jsonify(find_stock_data(num))

# 用于获取股票K线图的信息
@app.route('/stockdata_K',methods=['POST','GET'])
def stockdata_K():
    # 得到股票代码
    stock_code = request.args.get('stock_code')
    stock_code=int(stock_code)
    return jsonify(find_stock_data_K(stock_code))

# 用于获取用户的个人信息
@app.route('/userinfo',methods=['POST','GET'])
@jwt_required()
def user_data():
    user_email = get_jwt_identity()
    print(user_email)
    information=user_information_by_email(user_email)
    print(type(information[4]))
    response = {"name":information[1],"email":information[3],"gender":information[5],"registrationDate":information[7]
                ,"status":information[4],'phone':information[6]}
    return response

# 用于更改用户的性别
@app.route('/set_gender',methods=['POST','GET'])
@jwt_required()
def setGender():
    data = request.json
    user_gender = data.get('user_gender')
    user_email = get_jwt_identity()
    print(user_email)
    print(user_gender)
    try_setgender=setgender(user_email, user_gender)
    if try_setgender==True:
        response= {'message': 'success'}
        return jsonify(response)
    else:
        response={'message':'fail'}
        return jsonify(response)

# 用于更改用户的手机号
@app.route('/update-phone-number',methods=['POST','GET'])
@jwt_required()
def setphone():
    data = request.json
    phone = data.get('phone', None)
    user_email = get_jwt_identity()
    try_setphone=try_update_phone(phone, user_email)
    if try_setphone==True:
        response= {'message': 'success'}
        return jsonify(response)
    else:
        response={'message':'fail'}
        return jsonify(response)

# 交易记录的数据表的创建在mypackage.start.py里面，那个与user_data关系不大。
@app.route('/buystock', methods=["POST"])
@jwt_required() #注意
def buystock():
    data = request.get_json()
    stock_code=data.get('stock_code',None)
    stock_name=data.get('stock_name',None)
    stock_price=data.get('stock_price',None)
    stock_quantity=data.get('stock_quantity',None)
    print(stock_code,stock_name,stock_price,stock_quantity)
    
    user_email = get_jwt_identity() # 注意
    
    try_insert=insert_stock(user_email,stock_code,stock_name,stock_price,stock_quantity)
    if try_insert=='successful':
        response = {"msg":'successful'}
        return response
    return {"msg": "unknown errors"}, 401

# 用于卖出股票
@app.route('/sellstock', methods=["POST"])
@jwt_required() #注意
def sellstock():
    data = request.get_json()
    stock_code=data.get('stock_code',None)
    stock_name=data.get('stock_name',None)
    stock_price=data.get('stock_price',None)
    stock_quantity=data.get('stock_quantity',None)
    print(stock_code,stock_name,stock_price,stock_quantity)
    
    user_email = get_jwt_identity() # 注意
    
    try_sell=sell_stock(user_email,stock_code,stock_name,stock_price,stock_quantity)
    if try_sell=='successful':
        response = {"msg":'successful'}
        return response
    return {"msg": "unknown errors"}, 401

# 获取交易记录
@app.route('/search_buy', methods=["POST","GET"])
@jwt_required()
def search_buy():
    user_email = get_jwt_identity()
    records=search_stock(user_email)
    return jsonify(records)

# 用于显示股票资产
@app.route('/search_newprice', methods=["POST","GET"])
@jwt_required() #注意
def searchnewprice():
    print('123456')
    user_email = get_jwt_identity()
    user_stockcode=stockcode_by_email(user_email)
    
    user_stocknum=stocknum_by_email(user_email)
    user_stockname=stockname_by_email(user_email)
    
    # 该循环用于实时爬取股票的最新价
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    
    stock_price = loop.run_until_complete(main_spider(user_stockcode))
    
    response=[]
    
    print(user_stockcode,user_stocknum,user_stockname,stock_price)
    
    for item in user_stockcode:
        if item in user_stocknum and item in user_stockname and item in stock_price and user_stocknum[item]>0:
            response.append({
                "stock_code": item,
                "stock_num": user_stocknum[item],
                "stock_name": user_stockname[item],
                "stock_price": stock_price[item]
            })
            
    return jsonify(response)

   
@app.route('/strategy',methods=['POST','GET'])
def strategy():
    
    data = request.get_json()
    print(data)
    strategy_name=data.get('strategy_name')
    print(strategy_name)
    initial_cash=data.get('initial_cash')
    print(initial_cash)
    initial_cash=float(initial_cash)

    param = data.get('param', {})
    stock_code = param.get('stock_code')
    print(stock_code)

    percent = param.get('percent')
    print(percent)
    percent = float(percent)
    
    stop_loss_pct = param.get('stop_loss_pct')
    print(stop_loss_pct)
    stop_loss_pct = float(stop_loss_pct)
    
    stop_profit_pct = param.get('stop_profit_pct')
    print(stop_profit_pct)
    stop_profit_pct = float(stop_profit_pct)
    
    start_date = param.get('start_date')
    print(start_date)
    
    end_date = param.get('end_date')
    print(end_date)

    get_params(stock_code, percent, stop_loss_pct, stop_profit_pct, start_date, end_date)
    if strategy_name=="molonca":
        res=run(initial_cash, strategy_name)
        json_str = json.dumps(res)
        return jsonify(json_str)
    res=run(initial_cash, strategy_name).to_json(orient="split",force_ascii=False)

    # get_params("000001",10,10,10,"19910403","20240611") # for backend test
    # res=run(100000,"buy_with_stop_loss").to_json(orient="split",force_ascii=False)  # test ok, has output
    
    return jsonify(res)

if __name__=='__main__':
    app.run()