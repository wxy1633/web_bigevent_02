$(function () {
    // 1点击事件
    $('#link_reg').on('click',function () {
        $('.login-box').hide()
        $('.reg-box').show()
    })
    $('#link_login').on('click',function () {
        $('.login-box').show()
        $('.reg-box').hide()
    })

    // 2自定义表单   HTML里面 一定是登录表单   先写的登录
    var form = layui.form
    // 5.  提示消息
    var layer = layui.layer
    
    form.verify({
        // 密码规则
        pwd: [
            /^[\S]{6,12}$/,
            '密码必须6到12位，且不能出现空格'
          ] ,
        //   确认密码规则
        repwd:function (value) {   
            // 错误：  把name的=写成了 ：  导致识别不了直接提交
              var pwd = $('.reg-box [name=password]').val()
              if(pwd !== value){
                  return '两次密码输入不一致'
              }
          }
    })
    
    // 3.表单提交 注册
     $('#form_reg').on('submit',function (e) {
        e.preventDefault()
        $.ajax({
            method:'POST',
            url:'/api/reguser',
            data:$(this).serialize(),
            success:function (res) {
                if(res.status !== 0){
                    console.log($(this).serialize());
                    return layer.msg(res.message)
                }
                layer.msg(res.message)
                // 手动跳转到登录页面
                $('#link_login').click()
                // 清空内容
                $('#form_reg')[0].reset()
            }
        })
     })


    //  4表单登录 
    $('#form_login').on('submit',function (e) {
        // 阻止表单默认提交
        e.preventDefault()
        $.ajax({
            method:'POST',
            url:'/api/login',
            data:$(this).serialize(),
            success:function (res) {
                // 状态码 判断
                if(res.status !==0) return layer.msg(res.message)
                // 状态码正确  
                layer.msg(res.message)
                // 保留token  存到本地  登录其他有权限的页面要用
                localStorage.setItem('token',res.token)
                // 手动跳转到后台主页
                location.href = '/index.html'

            }
        })
    })
})