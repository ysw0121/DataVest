#!/usr/bin/python3
from mypackage.send_email import send_verification_email
import datetime
import pymysql

# 此文件夹用于连接数据库

# 这个用于创建连接，你们只需要修改这个代码就可以
def create_connection():
    return pymysql.connect(
        host="localhost",
        user="yx",
        password="zyxzyx123",
        database="demo"
    )

# 这个用于封装查询执行语句，简化函数
def execute_query(conn, query, params=None):
    cursor = conn.cursor()
    cursor.execute(query, params)
    result = cursor.fetchone()
    conn.commit()
    cursor.close()
    return result

# 用于判断用户登录时是否有这个用户，有则返回True
def law_login(user_name, email, password):
    conn = create_connection()
    sql = "SELECT * FROM user_data WHERE name = %s AND password = %s AND email = %s"
    result = execute_query(conn, sql, (user_name, password, email))
    conn.close()
    return result is not None

# 用于判断用户注册时是否有重复的email
def same_email(email):
    conn = create_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM user_data WHERE email = %s", (email,))
    existing_user = cursor.fetchone()
    if existing_user:
        conn.close()
        return 'same'
    else:
        verificationcode = send_verification_email(email)
        conn.close()
        return verificationcode

# 用于注册成功时插入数据
def insert_into(user_name, email, password):
    conn = create_connection()
    try:
        cursor = conn.cursor()
        sql = "INSERT INTO user_data (name, email, password,registration_date) VALUES (%s, %s, %s,%s)"
        current_date = datetime.datetime.now()
        cursor.execute(sql, (user_name, email, password,current_date))
        conn.commit()
        cursor.close()
        conn.close()
        return 'successful'
    except Exception as e:
        print("An error occurred:", str(e))
        return 'other error'

# 通过email返回用户信息
def user_information_by_email(email):
    conn = create_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM user_data WHERE email = %s", (email,))
    existing_user = cursor.fetchone()
    print(existing_user)
    return existing_user

# 改变用户性别
def setgender(email,user_gender):
    try:
        conn = create_connection()
        cursor = conn.cursor()
        cursor.execute("UPDATE user_data SET gender = %s WHERE email = %s", (user_gender,email))
        print('成功更改性别为',user_gender)
        conn.commit()
        cursor.close()
        conn.close()
        return True
    except:
        print('更改性别出现错误')
        return False

# 改变用户的手机号
def try_update_phone(phone,email):
    try:
        conn = create_connection()
        cursor = conn.cursor()
        cursor.execute("UPDATE user_data SET phone = %s WHERE email = %s", (phone,email))
        print('成功更改电话为',phone)
        conn.commit()
        cursor.close()
        conn.close()
        return True
    except:
        print('更改电话出现错误')
        return False

# 用于插入交易记录，包括买股票和买股票
def insert_stock(email,stockcode,stockname,stockprice,stockquantity):
    conn = create_connection()
    try:
        cursor = conn.cursor()
        sql = "INSERT INTO user_stock (email, stockcode,stockname,stockprice,stockquantity,buytime) VALUES (%s, %s, %s,%s,%s,%s)"
        current_date = datetime.datetime.now()
        cursor.execute(sql, (email, stockcode, stockname,stockprice,stockquantity,current_date))
        
        sql = "UPDATE user_data SET money = money - (%s * %s) WHERE email = %s"
        cursor.execute(sql, (stockprice, stockquantity, email))
        
        conn.commit()
        cursor.close()
        conn.close()
        return 'successful'
    except Exception as e:
        print("An error occurred:", str(e))
        return 'other error'

# 用于卖出股票
def sell_stock(email,stockcode,stockname,stockprice,stockquantity):
    conn = create_connection()
    try:
        cursor = conn.cursor()
        sql = "INSERT INTO user_stock (email, stockcode,stockname,stockprice,stockquantity,buytime) VALUES (%s, %s, %s,%s,%s,%s)"
        current_date = datetime.datetime.now()
        cursor.execute(sql, (email, stockcode, stockname,stockprice,-stockquantity,current_date))
        
        sql = "UPDATE user_data SET money = money + (%s * %s) WHERE email = %s"
        cursor.execute(sql, (stockprice, stockquantity, email))
        
        conn.commit()
        cursor.close()
        conn.close()
        return 'successful'
    except Exception as e:
        print("An error occurred:", str(e))
        return 'other error'

# 用于寻找特定用户的股票交易记录
def search_stock(email):
    conn = create_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM user_stock WHERE email = %s", (email,))
    result = cursor.fetchall()
    records = []
    for row in result:
        record = {
            "stockcode": row[2],
            "stockname": row[3],
            "stockprice": row[4],
            "stockquantity": row[5],
            "buytime": row[6]
        }
        records.append(record)
    return records

# 用于寻找特定用户的股票资产
def stocknum_by_email(email):
    conn = create_connection()
    cursor = conn.cursor()
    query = "SELECT stockcode, SUM(stockquantity) as total_quantity FROM user_stock WHERE email = %s GROUP BY stockcode"
    cursor.execute(query, (email,))
    result = cursor.fetchall()
    stock_dict = {}
    for row in result:
        stockcode = row[0]
        total_quantity = row[1]
        stock_dict[stockcode] = total_quantity
    return stock_dict

def stockcode_by_email(email):
    conn = create_connection()
    cursor = conn.cursor()
    query = "SELECT DISTINCT stockcode FROM user_stock WHERE email = %s"
    cursor.execute(query, (email,))
    result = cursor.fetchall()
    stockcode_list = [row[0] for row in result]
    return stockcode_list

def stockname_by_email(email):
    conn = create_connection()
    cursor = conn.cursor()
    query = "SELECT DISTINCT stockcode,stockname FROM user_stock WHERE email = %s"
    cursor.execute(query, (email,))
    result = cursor.fetchall()
    stock_dict = {}
    for row in result:
        stockcode = row[0]
        stockname = row[1]
        stock_dict[stockcode] = stockname
    return stock_dict
