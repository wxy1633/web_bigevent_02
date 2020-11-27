$(function () {
  // 1定义规则
  var form = layui.form
  // 2.提示信息
  var layer = layui.layer
  form.verify({
    //1.1 密码6-12匹配
    pwd: [
      /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
    ],
    //   1.2
    newpwd: function (value) {
      var pwd = $('[name=oldPwd]').val()
      console.log(pwd);
      if (pwd === value) return '新旧密码不能相同'
    },
    repwd: function (value) {
      var repwd = $('[name=newPwd]').val()
      if (repwd !== value) return '两次输入密码不一致'
    }
  })


  //2 表单提交
  $('.layui-form').on('submit', function (e) {
    // 阻止表单提交
    e.preventDefault()
    // ajax传值
    $.ajax({
      method: 'POST',
      url: "/my/updatepwd",
      data: {
        oldPwd: $('[name=oldPwd]').val(),
        newPwd: $('[name=newPwd]').val()
      },
      success: function (res) {
        console.log(res)
        // 状态码判断
        if(res.status !== 0) return layer.msg(res.status)
        layer.msg("修改密码成功！")
        // 重置表单
        $('.layui-form')[0].reset()
      }
    })
  })
})