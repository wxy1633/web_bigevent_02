$(function () {
    // 1.渲染页面
    initArtCateLisr()

    // 引入提示信息
    var layer = layui.layer
    // 表单赋值
    var form = layui.form

    function initArtCateLisr() {
        $.ajax({
            url: '/my/article/cates',
            success: function (res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.status)
                }
                // 模板引擎
                var htmlStr = template('tpl-list', res)
                $('tbody').html(htmlStr)
            }
        })
    }
    // 全局变量控制弹出框的关闭
    var indexAdd = null
    // 2.点击按钮
    $('#btnAdd').on('click', function () {
        // 利用框架代码，显示提示添加文章类别区域
        indexAdd = layer.open({
            // 页面层 去除确定按钮
            type: 1,
            // 弹出框的大小
            area: ['500px', '260px'],
            // 弹出框标题
            title: '在线调试'
                // 弹出框内容   由于在内容使用标签不能识别所以利用jq获取内容
                ,
            content: $('#dialog-add').html()
        });
    })


    // 3.获取文章类别信息  点击按钮时赋值
    $('body').on('submit', '#form-add', function (e) {
        // 阻止表单默=默认提交行为
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) return layui.layer.msg(res.message)
                layui.layer.msg('恭喜您，增加分类成功！')
                // 从新渲染页面
                initArtCateLisr()
                layer.close(indexAdd)
            }
        })
    })

    // 4，文章类别的编辑功能
    var indexEdit = null
    $('tbody').on('click', '.btn-edit', function () {
        // 4.1 提示框的构建
        indexEdit = layer.open({
            type: 1,
            title: '修改文章分类',
            area: ['500px', '260px'],
            content: $('#dialog-edit').html()
        })

        // 根据id来获取文章类别   文档要求
        var id = $(this).attr('data-id')
        // 4.2获取信息并渲染
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function (res) {
                if (res.status !== 0) return layer.msg(res.message)
                // layer.msg('恭喜您获取数据成功！')
                form.val('form-edit', res.data)
            }
        })


    })

    // 不是给tbody加
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault()
        // ajax发起请求
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                // 添加成功重新渲染页面
                initArtCateLisr()
                // 提示
                layer.msg('恭喜您，文章类别更新成功')
                // 关闭提示框
                layer.close(indexEdit)
            }
        })
    })

    // 5删除文章类别
    $('tbody').on('click', '.btn-delete', function () {
        // 5.1先获取Id,进入到函数中的this指向就变了
        var Id = $(this).attr('data-id')
        // 5.2显示对话框
        layer.confirm('是否可以删除?', {
            icon: 3,
            title: '提示'
        }, function (index) {
            $.ajax({
                url: '/my/article/deletecate/' + Id,
                success: function (res) {
                    if (res.status !== 0) layer.msg(res.message)
                    layer.msg('恭喜您，删除文章类别成功！')
                    //重新渲染页面
                    initArtCateLisr()
                    //  关闭对话框
                    layer.close(index);
                }
            })

        })
    })
})