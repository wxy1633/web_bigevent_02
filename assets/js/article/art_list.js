$(function () {
    // 3.定义过滤器  优化时间
    template.defaults.imports.dataFormat = function (dtStr) {
        var dt = new Date(dtStr)
        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())
        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())
        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }
    // 4.补0函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }
    // 1.定义提交参数  文档规定的获取数据
    var p = {
        pagenum: 1, //页码值
        pagesize: 2, //每页显示多少条数据
        cate_id: '', //文章分类的Id
        state: '' //文章的状态，可选值有：已发布、草稿
    }
    // 提示信息
    var layer = layui.layer
    //2 初始化文档  多次使用 封装一个函数
    initTable()

    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: p,
            success: function (res) {
                if (res.status !== 0) return layer.msg(res.message)
                layer.msg('获取信息成功！')
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
                // 分页是在表格渲染完后出现所以在这里添加
                renderPage(res.total)
            }
        })
    }

    // 5.初始化分类
    var form = layui.form //导入form
    initCate() //调用函数
    // 封装
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) return layer.msg(res.message)
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                // 需要让layui的js监听到发生了变化
                form.render()
            }
        })
    }

    // 6筛选功能
    $('#form-search').on('submit', function (e) {
        e.preventDefault()
        console.log(1);
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()
        p.state = state
        p.cate_id = cate_id
        // 初始化文章列表
        initTable()
    })

    // 7.分页
    var laypage = layui.laypage

    function renderPage(num) {
        laypage.render({
            elem: 'pageBox' //注意，这里的 test1 是 ID，不用加 # 号
                ,
            count: num, //数据总数，从服务端得到
            limit: p.pagesize, //每行几条
            curr: p.pagenum, //第几页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            jump: function (obj, first) {
                p.pagenum = obj.curr
                p.pagesize = obj.limit
                if (!first) {
                    initTable()
                }
            }
        })
    }

    // 删除文章内容
    $('tbody').on('click', '.btn-delete', function () {
        // 获取到当前点击按钮的 Id  等等发送请求用
        var Id = $(this).attr('data-id')
        layer.confirm('确认删除?', {
            icon: 3,
            title: '提示'
        }, function (index) {
            //do something
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + Id,
                success: function (res) {
                    if (res.status !== 0) return layer.msg(res.status)
                    console.log(p.pagenum);
                    layer.msg('恭喜您删除文章成功！')
                    if ($('.btn-delete').length == 1 && p.pagenum > 1) p.pagenum--
                    
                    // 重新渲染数据  有问题
                    initTable()
                }
            })
            layer.close(index);
        })



    })
})