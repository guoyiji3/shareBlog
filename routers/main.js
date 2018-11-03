var express = require('express');
var router = express.Router();
var Category = require('../models/Category');
var Content = require('../models/Content');
var data;
/*存一些可以共用的数据*/
router.use(function (req,res,next) {
   data={
    userInfo:req.userInfo,
    categories:[]
  }
  Category.find().then(function (categories) {
    data.categories = categories;
    next();
  })
})
router.get('/',function (req,res,next) {
  Category.find().then(function (categories) {
    res.render('main/home',data)
  })

})
router.get('/login',function (req,res,next) {
  res.render('main/login')
})
router.get('/register',function (req,res,next) {
  res.render('main/register')
})
router.get('/index',function (req,res,next) {
    data.category = req.query.category||'',
    data.page = Number(req.query.page||1),
    data.limit = 3,
    data.pages = 0,
    data.count = 0
    var where={};
    if(data.category){
    where.category=data.category;
   }
  Category.find().then(function (categories) {
    return Content.where(where).count();
  }).then(function (count){
    data.count = count;
    data.pages = Math.ceil(data.count/data.limit);
    data.page = Math.min(data.page,data.pages);
    data.page = Math.max(1,data.page);
    var skip = (data.page-1)*data.limit;
    return Content.find().where(where).limit(data.limit).skip(skip).populate(['category','user']);
  }).then(function (contents) {
    data.content=contents;
    res.render('main/index',data)
  })
})

router.get('/view',function (req,res,next) {
   var contentid = req.query.contentid;
   Content.findOne({
     _id:contentid
   }).then(function (content) {
     data.content = content;
     content.views++;
     content.save();
     res.render('main/view',data);
   })

})
module.exports = router;
