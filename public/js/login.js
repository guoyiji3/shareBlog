$(function () {
  var $loginBox = $('#loginbox');
  var $registerBox = $('#registerbox');
  var $home = $('#home');
  $registerBox.find('.tip').hide();
  $loginBox.find('.tip').hide();
  //注册
  $registerBox.find('button').on('click' , function () {
    $.ajax({
      type:'post',
      url:'/api/user/register',
      data:{
          username : $registerBox.find('[name="username"]').val(),
          password : $registerBox.find('[name="password"]').val(),
          repassword : $registerBox.find('[name="repassword"]').val()
      },
      dataType:'json',
      success:function (result) {
        $registerBox.find('.tip').show();
        $registerBox.find('.tip').html(result.message);
        if(!result.code){
          setTimeout(function () {
            window.location.href = '/';
          },1000)
        }
      }
    })
  })
  //登录
  $loginBox.find('button').on('click',function () {
    $.ajax({
      type:'post',
      url:'/api/user/login',
      data:{
        username:$loginBox.find('[name="username"]').val(),
        password:$loginBox.find('[name="password"]').val()
      },
      dataType:'json',
      success:function (result) {
        $loginBox.find('.tip').show();
        $loginBox.find('.tip').html(result.message);
        if(!result.code){
          setTimeout(function () {
            window.location.href = '/';
          },1000);
        }
      }
    })
  })
  //退出
  $home.find('.logout').on('click',function () {
    $.ajax({
      url:'/api/user/logout',
      success:function (result) {
        if(!result.code){
          window.location.reload();
        }
      }
    })
  })
  $

})
