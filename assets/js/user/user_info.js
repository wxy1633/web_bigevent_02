$(function () {
    // 1.自定义验证规则
    var form = layui.form
    // 4.提示信息
    var layer = layui.layer
    form.verify({
        nickname: function (value) {
            if (value.length > 6) return '昵称长度为1~6位之间！'
        }
    })
    // 这里错了  把结构写错了  
    // 2.用户渲染
    initUserInfo()
    // 渲染函数  获取  和新方法 渲染
    function initUserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function (res) {
                // 状态码判断  失败结束
                if (res.status !== 0) return layui.layer.msg('获取用户信息失败！')
                // 成功渲染   layui的表单渲染
                console.log(res.data);
                form.val('formUserInfo', res.data)
            }
        })
    }

    // 3.表单重置
    $('#btnReset').on('click', function (e) {
        // 阻止表单默认行为  不阻止回到开始状态 不是用户名
        e.preventDefault()
        // 再次渲染数据
        initUserInfo()
    })

    // 4修改用户信息   
    $('.layui-form').on('submit', function (e) {
        // 阻止表单事件
        e.preventDefault()
         var data1 = $(this).serialize()
        //    发送ajax
        $.ajax({
            method:'POST',
            url:'/my/userinfo',
            data:$(this).serialize(),
            success:function (res) {
                console.log(res);
                if(res.status !== 0) return layer.msg(res.status)
                console.log(data1);
                layer.msg(res.status)
                // 调用父页面中的更新用户信息和头像
                window.parent.getUserInof()
            }
        })
    })

    // 少写了 id
})