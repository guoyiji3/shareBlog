# shareBlog
分享博客  
个人开发的一个关于分享音乐、旅游、阅读、电影等方面的文章的公开可交流平台。由于时间和能力有限，博客功能比较单一，以后会不断丰富完善, 
有错误的地方欢迎指正交流。
  
## 功能描述

分为管理员端和客户端：  
管理员端：主要负责管理用户信息、博文分类和定期更新文章内容。  
客户端：用户可以自行注册账号登陆系统，对文章进行浏览，并评论发布自己的体会。  

## 开发环境配置  
开发工具：在webstorm64工具上进行代码开发，需要先安装  
1.node.js8.11.4（下载地址：https://nodejs.org/en/download/ ）  
2.mongodb数据库（下载链接：https://www.mongodb.com/download-center?jmp=nav ）  
3.可视化查看mongodb数据库的工具studio 3T（下载链接：https://studio3t.com/download/ ）。   
4.安装依赖：用"npm install --save xxx "模式安装好以下依赖:  
 express、cookies、markdown、mongoose、swig.  
## 项目结构
-db-用于存储数据库文件  
-models-数据库模型文件  
-node_modules-node第三方模块目录  
-public-公共文件（css/js文件）  
-routers-路由文件  
-schemas-数据库结构文件  
-view-模板视图文件  
app.js-应用程序入口文件  
 ## 功能页面 
 登录界面  
![Image text](https://github.com/guoyiji3/shareBlog/blob/master/images-RM/login.png)  
管理员首页  
![Image text](https://github.com/guoyiji3/shareBlog/blob/master/images-RM/admin.png)  
管理列表页  
![Image text](https://github.com/guoyiji3/shareBlog/blob/master/images-RM/list.png)  
添加内容页  
![Image text](https://github.com/guoyiji3/shareBlog/blob/master/images-RM/add.png)  
博客首页  
![Image text](https://github.com/guoyiji3/shareBlog/blob/master/images-RM/index.png)  
文章浏览页面  
![Image text](https://github.com/guoyiji3/shareBlog/blob/master/images-RM/detail.png)
