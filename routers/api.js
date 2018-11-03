var express = require('express');
var router = express.Router();
var User = require('../models/User');
var Content = require('../models/Content')
var responedData;
router.use(function (req,res,next) {
  responedData = {
    code:0,
    message:''
  }
  next();
})
//注册
router.post('/user/register',function (req,res,next) {
  var username = req.body.username;
  var password = req.body.password;
  var repassword = req.body.repassword;
  if(username==''){
    responedData.code = 1;
    responedData.message = '用户名不能为空';
    res.json(responedData);
    return;
  }
  if(password==''){
    responedData.code = 2;
    responedData.message = '密码不能为空';
    res.json(responedData);
    return;
  }
  if(password!=repassword){
    responedData.code = 3;
    responedData.message = '两次输入的密码不一致';
    res.json(responedData);
    return;
  }
  User.findOne({
    username:username
  }).then(function (userInfo) {
    if(userInfo){
      responedData.code = 4;
      responedData.message = "该用户名已经被注册";
      res.json(responedData);
      return;
    }
    var user = new User({
      username:username,
      password:password
    })
    return user.save();
  }).then(function (userInfo) {
    if(userInfo) {
      responedData.message = '注册成功';
      req.cookies.set('userInfo', JSON.stringify({
        _id: userInfo._id,
        username: userInfo.username
      }))

      res.json(responedData);
      return;
    }
  })


})
//登录
router.post('/user/login',function (req,res,next) {
  var username = req.body.username;
  var password = req.body.password;
  if (username==''||password==''){
    responedData.code = 1;
    responedData.message = '用户名或密码不能为空';
    res.json(responedData);
    return;
  }
  User.findOne({
    username:username,
    password:password
  }).then(function (userInfo) {
    if(!userInfo){
      responedData.code = 2;
      responedData.message = '用户名或密码不存在';
      res.json(responedData);
      return;
    }
    responedData.message = '登陆成功';
    responedData.userInfo = {
      _id:userInfo._id,
      username:userInfo.username
    }
    req.cookies.set('userInfo',JSON.stringify({
      _id:userInfo._id,
      username:userInfo.username,
      isAdmin:userInfo.isAdmin
    }))
    res.json(responedData);
    return;
  })
})
//退出
router.get('/user/logout',function (req,res) {
  req.cookies.set('userInfo',null);
  res.json(responedData);
})
//评论
router.get('/comment',function (req,res,next) {
  // console.log(req.query);
  var contentId = req.query.contentId;
  Content.findOne({
    _id:contentId
  }).then(function (content) {
    responedData.data = content.comments;
    res.json(responedData);
  })

})
router.post('/view/comment',function (req,res,next) {
  var contentid = req.body.contentId||'';
  var postData = {
    username:req.userInfo.username,
    postTime :new Date(),
    content:req.body.content
  };
   Content.findOne({
     _id:contentid
   }).then(function (content) {
    // console.log(content);
     console.log(postData);
     if(postData.content==''){
       responedData.code = 1;
       responedData.message = '评论不能为空';
       res.json(responedData);
       return;
     }else {
     content.comments.push(postData);
     return content.save();
     }
   }).then(function (newContent) {
     responedData.message = '评论成功';
     responedData.data = newContent;
      res.json(responedData);
   })
})
router.get('/view',function (req,res,next) {
  // console.log(req.query);
  var contentId = req.query.contentId;
  Content.findOne({
    _id:contentId
  }).then(function (content) {
    responedData.data = content;
     console.log(responedData);
    res.json(responedData);
    return;
  })
})
module.exports = router;
