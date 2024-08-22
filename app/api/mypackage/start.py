import pymysql

# 此文件用于创建数据表，包括user_data和user_stock,在新建时运行

def create_connection():
    return pymysql.connect(
        host="localhost",
        user="yx",
        password="zyxzyx123",
        database="demo"
    )

# 创建数据表，在这之前请更改create_connection的参数
def create_user_data():
    db = create_connection()
    cursor = db.cursor() 
    cursor.execute("DROP TABLE IF EXISTS user_data")

    sql = """CREATE TABLE user_data (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    password VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    money DECIMAL(10,2) NOT NULL DEFAULT 1000,
    gender VARCHAR(10) NOT NULL DEFAULT '',
    phone VARCHAR(100) NOT NULL DEFAULT '',
    registration_date DATE 
    );"""
 
    cursor.execute(sql)
    
    db.commit()
    db.close()

def create_stock_data():
    db = create_connection()
    cursor = db.cursor() 
    cursor.execute("DROP TABLE IF EXISTS user_stock")
    sql = """
    CREATE TABLE user_stock (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(100),
        stockcode VARCHAR(10),
        stockname VARCHAR(255),
        stockprice DECIMAL(10, 2),
        stockquantity INT,
        buytime DATE
    )
    """
    cursor.executeisql)
    db.commit()
    db.close()

if __name__=='__main__':
    create_user_data()
    create_stock_data()