### 最终效果：
![](https://raw.githubusercontent.com/xiangguaa/FigsBed/master/imgs/CoolRun.png)

### 使用语言
js+python(flask-restful库)+mysql</br>

### 目录结构说明
assets:</br>
  ——>Animation:存放角色动画，部分未使用</br>
  ——>Audio:存放背景音乐和UI声音</br>
  ——>DB:存放python写的API，用于与数据库的信息交互</br>
  ——>Fonts:存放字体文件</br>
  ——>Prefab:存放预制体，主要是障碍物和子弹</br>
  ——>Scene:存放场景，主要是HallBaseView主场景，BaseView游戏场景</br>
  ——>Script:存放脚本</br>
  ——>Texture:存放图片资源</br>
  
### 注意事项
链接数据库的API在asset/DB文件夹下,需要修改配置信息，成功链接数据库后运行程序

### LatestChange：
1、基本架构已经完成，跳跃存在连跳n次的bug，排名未连接数据库——2019-10-05</br>
2、加入rankUI，待完善。数据库未建立——2019-10-07</br>
3、加入选关UI——2019-10-07</br>
4、添加点击音效——2019-10-08</br>
5、添加背景音乐——2019-10-08</br>
6、添加文字故事情节——2019-10-11</br>
7、添加敌人和子弹——2019-10-20</br>
8、修改不规范变量名——2019-11-10</br>
9、添加故事情节跳过按钮，添加子弹轨迹——2019-11-13</br>
10、修改主界面UI——2019-10-20</br>
11、修改游戏界面UI——2019-10-27</br>
12、优化部分UI设计——2019-11-02</br>
