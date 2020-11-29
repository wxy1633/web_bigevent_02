$(function () {
    // 提示  form 监听
    var layer = layui.layer
    var form = layui.form
    // 1.获取文章类别
    initCate()

    // 封装
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) layer.msg(res.message)
                layer.msg('恭喜您,获取文章类别成功！')
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                form.render()
            }
        })
    }

    //2初始化富文本编辑器
    initEditor()

    //  3裁剪图片区域
    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    // 4.上传图片
    $('#btnChoose').on('click', function () {
        $('#file').click()
    })

    // 5.设置图片
    $('#file').on('change', function (e) {
        // 拿到用户选择的文件
        var file = e.target.files[0]
        // 非空校验
        if (file == undefined) {
            return;
        }
        // 根据选择的文件
        var newImgURL = URL.createObjectURL(file)
        // 先`销毁`旧的裁剪区域，再`重新设置图片路径`，之后再`创建新的裁剪区域`
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })

    // 6.设置状态
    var state = '已发布'
    $('#btnSave2').on('click', function () {
        state = '草稿'
    })

    // 7.添加文章
    $('#form-pub').on('submit', function (e) {
        e.preventDefault()
        // 创建formDat对象
        var fd = new FormData(this)
        // 放入状态
        fd.append('state', state)
        // 放入图片
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) { // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                fd.append('cover_img',blob)
                // ajax发起请求
                publishArticle(fd)
            })
    })

    // 封装添加文章的方法
    function  publishArticle(fd) {
        $.ajax({
            method:'POST',
            url:'/my/article/add',
            data:fd,
            contentType:false,
            processData:false,
            success:function (res) {
                if(res.status  !== 0) return layer.msg(res.message)
                layer.msg('恭喜您,发布文章成功!')
                // 跳转
                location.href = '/article/art_list.html'
            }
        })
    }
})