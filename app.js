/*入口文件*/
var express = require('express');
var swig = require('swig');
var bodyParser = require('body-parser');
var Cookies = require('cookies');
var mongoose = require('mongoose');
var User = require('./models/User')
var app = express();

app.use('/public',express.static(__dirname+'/public'));
app.engine('html',swig.renderFile);
app.set('views','./views')
app.set('view engine','html')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(function (req,res,next) {
  req.cookies = new Cookies(req,res);
  req.userInfo  = {};
  if(req.cookies.get('userInfo')){
    try {
      req.userInfo = JSON.parse(req.cookies.get('userInfo'));
      User.findById(req.userInfo._id).then(function (userInfo) {
        req.userInfo.isAdmin = Boolean(userInfo.isAdmin);
      })
    }
    catch (e) {
      next()
    }
  }
  next();
})
/*首页路由绑定*/
app.use('/admin',require('./routers/admin'));
app.use('/api',require('./routers/api'));
app.use('/',require('./routers/main'));
swig.setDefaults({cache:false});//取消缓存
mongoose.connect('mongodb://localhost:27017/newdemo1',function (err) {
  if(err){
    console.log('数据库连接失败');
  }else {
    console.log('数据库连接成功');
    app.listen(8080);
  }
})

