var express = require('express');
var router = express.Router();
var User = require('../models/User')
var Category = require('../models/Category')
var Content = require('../models/Content')
router.use(function (req,res,next) {
  if(!req.userInfo.isAdmin){
    res.render('admin/error',{
      message:'非管理员不能进入此页面'

    })
    return;
  }
  next();
})
router.get('/',function (req,res,next) {
  res.render('admin/index',{
    userInfo:req.userInfo
  })
})
router.get('/user',function (req,res,next) {
  var page = Number(req.query.page||1);
  var limit = 4;
  var pages = 0;
  var skip = 0;
  User.count().then(function (count) {
    pages = Math.ceil(count/limit);//向上取整
    page = Math.max(1,page);
    page = Math.min(page,pages);
    skip = (page-1)*limit;
    User.find().limit(limit).skip(skip).then(function (users) {
      res.render('admin/user_index',{
        userInfo:req.userInfo,
        users:users,
        page:page,
        url:'/admin/user'
      })
    })
  })
})
router.get('/category',function (req,res,next) {
  var page = Number(req.query.page||1);
  var pages = 0;
  var skip = 0;
  var limit = 4;
  Category.count().then(function (count) {
    pages = Math.ceil(count/limit);
    page = Math.max(1,page);
    page = Math.min(page,pages);
    skip = (page-1)*limit;
    Category.find().limit(limit).skip(skip).then(function (categories) {
      res.render('admin/category_index',{
        categories:categories,
        page:page,
        url:'/admin/category'
      });
    })
  })
})
router.get('/category/add',function (req,res,next) {
  res.render('admin/category_add')
})
router.post('/category/add',function (req,res) {
  var name = req.body.name || '';
  if (name == '') {
    res.render('admin/error', {
      message: '名称不能为空',
      url:'/admin/category/add'
    });
    return;
  }
  Category.findOne({
    name: name
  }).then(function (nameInfo) {
    if (nameInfo) {
      res.render('admin/error', {
        message: '该名称已存在'
      })
     return Promise.reject();
    }else{
      return new Category({
        name:name
      }).save();
      return;
    }
}).then(function (newName) {
    res.render('admin/success',{
      message:'保存成功',
      url:'/admin/category'
    })
    return;
  })
})
router.get('/category/edit',function (req,res) {
  var id = req.query.id || '';
  Category.findOne({
    _id:id
  }).then(function (category) {
    if(!category){
      res.render('admin/error',{
        message:'分类名称不存在',
        url:'/admin/category'
      })
    }else{
      res.render('admin/category_edit',{
        category:category
      })
    }
  })
})
router.post('/category/edit',function (req,res) {
  var id = req.query.id||'';
  var name = req.body.name||'';
  Category.findOne({
    _id:id
  }).then(function (category) {
    if(!category){
      res.render('admin/error',{
        message:'分类名称不存在',
        url:'/admin/category'
      })
    } else{
      if(name==''){
        res.render('admin/error',{
          message:'分类名称不能为空',
          url:'/admin/category'
        })
        return Promise.reject();
      }
     else if(name==category.name){
       res.render('admin/success',{
         message:'修改成功',
         url:'/admin/category'
       })
       return Promise.reject();
     }else{
       return Category.findOne({
         _id:{$ne:id},
         name:name
       })
     }
    }
  }).then(function (sameCategory) {
    if(sameCategory){
      res.render('admin/error',{
        message:'已存在同名分类',
        url:'/admin/category'
      })
      return Promise.reject()
    }else{
      return Category.update({_id:id},{name:name})
    }
  }).then(function () {
    res.render('admin/success', {
      message: '修改成功',
      url:'/admin/category'
    })
  })
})
router.get('/category/delete',function (req,res) {
  var id = req.query.id;
  Category.findOne({
    _id:id
  }).then(function (category) {
    if(!category){
      res.render('admin/error',{
        message:'分类名称不存在',
        url:'/admin/category'
    })
      return Promise.reject();
  }else{
      return Category.remove({_id:id})
    }
  }).then(function () {
    res.render('admin/success', {
      message: '删除成功',
      url:'/admin/category'
    })
  })
})
router.get('/content',function (req,res,next) {
  var page = Number(req.query.page||1);
  var pages = 0;
  var skip = 0;
  var limit = 4;
  Content.count().then(function (count) {
    pages = Math.ceil(count/limit);
    page = Math.max(1,page);
    page = Math.min(page,pages);
    skip = (page-1)*limit;
    Content.find().limit(limit).skip(skip).populate(['category','user']).sort({addTime:-1}).then(function (contents) {
      console.log(contents)
      res.render('admin/content_index',{
        userInfo:req.userInfo,
        contents:contents,
        page:page,
        url:'/admin/content'
      });
    })
  })
})
router.get('/content/add',function (req,res,next) {
  Category.find().then(function (categories) {
    res.render('admin/content_add',{
      categories:categories
    })
  })
})
router.get('/content/edit',function (req,res) {
  var id = req.query.id||'';
  var categories = [];
  Category.find().sort({_id:1}).then(function (rs) {
    categories=rs;
    return Content.findOne({
      _id:id
    })
  }).then(function (content) {
    if(!content){
      res.render('admin/error',{
        userInfo:req.userInfo,
        message:'内容信息不存在'
      });
      return;
    }else {
      res.render('admin/content_edit',{
        userInfo:req.userInfo,
        content:content,
        categories:categories
      })
    }
  })

})
router.post('/content/edit', function(req, res) {
  var id = req.query.id || '';

  if ( req.body.category == '' ) {
    res.render('admin/error', {
      userInfo: req.userInfo,
      message: '内容分类不能为空'
    })
    return;
  }

  if ( req.body.title == '' ) {
    res.render('admin/error', {
      userInfo: req.userInfo,
      message: '内容标题不能为空'
    })
    return;
  }

  Content.update({
    _id: id
  }, {
    category: req.body.category,
    title: req.body.title,
    description: req.body.description,
    content: req.body.content
  }).then(function() {
    res.render('admin/success', {
      userInfo: req.userInfo,
      message: '内容保存成功',
      url: '/admin/content/edit?id=' + id
    })
  });

})
router.get('/content/delete',function (req,res) {
  var id = req.query.id||'';
  Content.remove({
    _id:id
  }).then(function () {
    res.render('admin/success',{
      userInfo:req.userInfo,
      message:'删除成功',
      url:'/admin/content'
    });
  });
})
router.post('/content/add',function (req,res,next) {
  var id = req.query.id;
  var category = req.body.category;
  var title = req.body.title;
  var description = req.body.description;
  var content = req.body.content;
  if(title==''){
    res.render('admin/error',{
      message:'内容标题不能为空'
    })
    return;
  }
  if(description==''){
    res.render('admin/error',{
      message:'内容简介不能为空'
    })
    return;
  }
  if(content==''){
    res.render('admin/error',{
      message:'内容不能为空'
    })
    return;
  }
  Content.findOne({
    _id:{$ne:id},
    category:category,
    title:title,
  }).then(function (sameTitle) {
    if(sameTitle){
      res.render('admin/error',{
        message:'同类标题不能相同'
      })
      return Promise.reject();
    }else{
      return new Content({
        category:category,
        title:title,
        description:description,
        content:content,
        user:req.userInfo._id.toString()
      }).save().then(function (newContent) {
        if(newContent){
          res.render('admin/success',{
            message:'保存成功',
            url:'/admin/content'
          })
          return;
        }
    })
  }
  })

})
module.exports = router;
