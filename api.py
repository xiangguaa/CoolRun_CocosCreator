import mysql.connector
 
mydb = mysql.connector.connect(
  host="localhost",       # 数据库主机地址
  user="cocos",    # 数据库用户名
  passwd="123456zs",   # 数据库密码
  database="cocos_game"
)

mycursor = mydb.cursor()
# insertSQL = "insert into musicgame (username,defendsuccesscount,missbarrelcount,alivetime) VALUES(%s,%s,%s,%s)"
# insertData = ("abcd",3,3,3)
# mycursor.execute("SELECT b.rownum FROM (SELECT t.*, @rownum := @rownum + 1 \
#     AS rownum FROM (SELECT @rownum := 0) r,(SELECT * FROM musicgame ORDER BY alivetime DESC) \
#     AS t) AS b WHERE b.username = 'TIAN'")
name = 'TIAN'
querySQL = "select b.rownum FROM (SELECT t.*, @rownum := @rownum + 1 AS rownum FROM (SELECT @rownum := 0) r,(SELECT * FROM musicgame ORDER BY alivetime DESC) AS t) AS b WHERE b.username = %s"
mycursor.execute(querySQL,(name,))
# mycursor.execute(insertSQL, insertData)
# mydb.commit()
i = 0
for x in mycursor:
    ranknum = x[0]

print(ranknum)
mycursor.close();
mydb.close();



# 获取全部排名
# SELECT t.*, @rownum := @rownum + 1 AS rownum FROM (SELECT @rownum := 0) r, (SELECT * FROM musicgame ORDER BY alivetime DESC) AS t;


# 获取个人排名
# SELECT b.rownum FROM
# (
# SELECT t.*, @rownum := @rownum + 1 AS rownum
# FROM (SELECT @rownum := 0) r,
# (SELECT * FROM musicgame ORDER BY alivetime DESC) AS t
# ) AS b WHERE b.username = "TIAN";


# CREATE TABLE IF NOT EXISTS `musicgame`(
#    `gameid` INT UNSIGNED AUTO_INCREMENT,
#    `username` CHAR(20) NOT NULL,
#    `defendsuccesscount` TINYINT NOT NULL,
#    `missbarrelcount` TINYINT NOT NULL,
#    `alivetime` SMALLINT NOT NULL,
#    PRIMARY KEY ( `gameid` )
# )ENGINE=InnoDB DEFAULT CHARSET=utf8;