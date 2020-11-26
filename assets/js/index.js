$(function () {
    // 获取 用户信息 来判断图片的使用
    getUserInof()
    // 3. 退出功能
    $('#btnLogout').on('click',function () {
        // 用到  layui 的弹出层中的提示框
        layer.confirm('是否确认退出?', {icon: 3, title:'提示'}, function(index){
            // 3.1 清空本地的token
            localStorage.removeItem('token')
            // 3.2页面跳转
            location.href = '/login.html'
            // 退出提示框
            layer.close(index);
          })
    })
})
// 1.获取用户信息
function getUserInof(params) {
     $.ajax({
         method:'GET',
         url:'/my/userinfo',
        //  headers:{
        //     Authorization:localStorage.getItem('token')
        //  },
         success:function (res) {
            if(res.status !== 0) return layui.layer.msg(res.message)
            // 渲染函数
            // console.log(res);
            renderAvatar(res.data)
        
         }
     })
}

// 2渲染
function renderAvatar(user) {
    // 2.1  渲染文字
    var name = user.nickname || user.username
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name)
    // 2.2 渲染图片
    if(user.user_pic !== null){
        $('.layui-nav-img').attr('src',user.user_pic).show()
        $('.text-avatar').hide()
    }else{
        var text = name[0].toUpperCase()
        $('.text-avatar').html(text).show()
        $('.layui-nav-img').hide()
    }
}