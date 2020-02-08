# --- 不是严格意义上的restful风格API，因为get/post方法中存在数据插入等操作 ------

# cocos数据库中的musicgame表结构如下图所示：
# +--------------------+------------------+------+-----+---------+----------------+
# | Field              | Type             | Null | Key | Default | Extra          |
# +--------------------+------------------+------+-----+---------+----------------+
# | gameid             | int(10) unsigned | NO   | PRI | NULL    | auto_increment |
# | username           | char(20)         | NO   |     | NULL    |                |
# | defendsuccesscount | tinyint(4)       | NO   |     | NULL    |                |
# | missbarrelcount    | tinyint(4)       | NO   |     | NULL    |                |
# | alivetime          | smallint(6)      | NO   |     | NULL    |                |
# +--------------------+------------------+------+-----+---------+----------------+


from flask import Flask, g
from flask_restful import reqparse, Api, Resource
from flask_httpauth import HTTPTokenAuth
from flask_cors import *
import mysql.connector



# Flask相关变量声明
app = Flask(__name__)
CORS(app, supports_credentials=True)
api = Api(app)

# RESTfulAPI的参数解析 -- put / post参数解析
parser_put = reqparse.RequestParser()
parser_put.add_argument("name", type=str, required=True, help="need user name")
parser_put.add_argument("missBarrelCount", type=str, required=True, help="need missBarrelCount data")
parser_put.add_argument("defendSuccessCount", type=str, required=True, help="need defendSuccessCount data")
parser_put.add_argument("aliveTime", type=str, required=True, help="need aliveTime data")

# 链接数据库
def COON():
    mydb = mysql.connector.connect(
        host="localhost",       # 数据库主机地址
        user="cocos",    # 数据库用户名
        passwd="xxxxxxx",   # 数据库密码
        database="cocos_game"
    )
    return mydb

# 插入数据操作
def INSERT(name, missBarrelCount,defendSuccessCount,aliveTime):
    mydb = COON()
    mycursor = mydb.cursor()
    insertSQL = "insert into musicgame (username,defendsuccesscount,missbarrelcount,alivetime) VALUES(%s,%s,%s,%s)"
    insertData = (name,missBarrelCount,defendSuccessCount,aliveTime)
    mycursor.execute(insertSQL, insertData)
    mydb.commit()
    mycursor.close();
    mydb.close();
    return 1

# 查询数据操作
def QUERY(name):
    mydb = COON()
    mycursor = mydb.cursor()
    querySQL = "select b.rownum FROM (SELECT t.*, @rownum := @rownum + 1 AS rownum FROM (SELECT @rownum := 0) r,(SELECT * FROM musicgame ORDER BY alivetime DESC) AS t) AS b WHERE b.username = %s"
    mycursor.execute(querySQL,(name,))
    ranknum = 0
    for x in mycursor:
        ranknum = x[0]
    mycursor.close();
    mydb.close();
    return ranknum



# 操作（post / get）资源列表
class TodoList(Resource):

    def get(self):
        args = parser_put.parse_args()

        # 构建新参数
        name = args['name']
        missBarrelCount = args['missBarrelCount']
        defendSuccessCount = args['defendSuccessCount']
        aliveTime = args['aliveTime']
        # 数据库写入
        INSERT(name, missBarrelCount,defendSuccessCount,aliveTime)
        ranknum = QUERY(name)
	    # 资源添加成功，返回201
        return ranknum, 201

    def post(self):
        args = parser_put.parse_args()

        # 构建新参数
        name = args['name']
        missBarrelCount = args['missBarrelCount']
        defendSuccessCount = args['defendSuccessCount']
        aliveTime = args['aliveTime']
        # 数据库写入
        INSERT(name, missBarrelCount,defendSuccessCount,aliveTime)
        ranknum = QUERY(name)
        # 调用方法获得返回值
        # info = {"ranknum":ranknum }
        

        # 资源添加成功，返回201
        return ranknum, 201

# 设置路由，即路由地址为http://127.0.0.1:5000/users
api.add_resource(TodoList, "/users")

if __name__ == "__main__":
    app.run(debug=True)