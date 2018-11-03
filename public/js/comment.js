var comments='';
var page = 2;
var pages = 0;
var limit = 5;
$('.comment').find('button').on('click',function () {
  $.ajax({
    type:'post',
    url:'/api/view/comment',
    data:{
      content:$('#comment').val(),
      contentId:$('#contentId').val()
    },
    success:function (responedData) {
      if(!responedData.code) {
        $('#comment').val('');
        comments = responedData.data.comments.reverse();
        showComment();
      }
    }
  })
})
$.ajax({
  url:'/api/view',
  data:{
  contentId:$('#contentId').val()
  },
  success:function (result) {
    comments = result.data.comments;
    showComment();
  }
})
$('.pageNum').delegate('a','click',function () {
  if ($(this).parent().hasClass('span1')){
    page--;
  } else {
    page++;
  }
  showComment();
})
function showComment() {
    if(comments.length==0){
      $('.total').html('还没有评论');
    }else {
      $('.total').html('一共'+comments.length+'条评论');
    }
    var html = '';
    pages = Math.max(Math.ceil(comments.length/limit),1);
    start = Math.max(0,(page-1)*limit);
    end = Math.min(start+limit,comments.length);
    if(page<=1){
      page=1;
      $('.span1').html('没有上一页😪')
    }else{
      $('.span1').html('<a href="javascript:;">上一页</a>')
    }
  if(page>=pages){
      page=pages;
    $('.span3').html('没有下一页😪')
  }else{
    $('.span3').html('<a href="javascript:;">下一页</a>')
  }
  // console.log(comments)
    $('.span2').html(page+'/'+pages);
    for(var i=start;i<end;i++){
       html += '<div class="messageBox">'+
         '<p class="name clear"><span class="fl">'+comments[i].username+'</span><span class="fr">'+ formatDate(comments[i].postTime) +'</span>'+'</p><p>'+comments[i].content+'</p>'+
        '</div>';
    }
    $('.comment-list').html(html);
}
function formatDate(d) {
  var date1 = new Date(d);
  return date1.getFullYear()+'年'+(date1.getMonth()+1)+'月'+date1.getDate()+'日'+date1.getHours()+':'+date1.getMinutes()+':'+date1.getSeconds();
}
