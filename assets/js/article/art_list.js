$(function () {
    // 定义一个查询的参数对象，将来请求数据的时候，需要将请求参数对象提交到服务器
    var q = {
        pagenum: 1,// 页码值，默认请求第一页的数据
        pagesize: 2,// 每页显示几条数据，默认每页显示2条
        cate_id: '', // 文章分类的Id
        state: '', // 文章的发布状态
    }
    // 定义补0函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }
    // 定义时间过滤器
    template.defaults.imports.dataFormat = function (date) {
        const dt = new Date(date);

        var y = dt.getFullYear();
        var m = padZero(dt.getMonth() + 1);
        var d = padZero(dt.getDate());

        var hh = padZero(dt.getHours());
        var mm = padZero(dt.getMinutes());
        var ss = padZero(dt.getSeconds());
        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }
    initTable()
    initCate()
    // 获取文章的列表数据
    function initTable() {
        // 发送ajax请求获取数据
        $.ajax({
            type: "GET",
            url: "/my/article/list",
            data: q,
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layui.layer.msg("获取文章列表失败");
                }
                // 调用模板引擎 添加到页面中
                var htmlStr = template('tpl-table', res);
                $("tbody").html(htmlStr);
                // console.log(res);
                randerPage(res.total)
            }
        });
    }

    // 获取文章分类列表
    function initCate() {
        // 发送ajax请求获取 所有分类的下拉框内容
        $.ajax({
            type: "GET",
            url: "/my/article/cates",
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg("获取文章分类列表失败");
                }
                // 调用模板引擎
                var htmlStr = template('tpl-cate', res);
                // console.log(htmlStr);
                $("[name=cate_id]").html(htmlStr);
                // 通过layui重新渲染表单区域的ui结构
                layui.form.render();
            }
        });
    }
    // 给筛选按钮注册表单提交监听事件
    $("#form-search").on('submit', function (e) {
        e.preventDefault();
        // 获取 所有分类和所有状态的值
        var cate_id = $('[name=cate_id]').val();
        var state = $('[name=state').val();
        // 将获取的选中的选项赋值给q对象里面对应的参数
        q.cate_id = cate_id;
        q.state = state;
        // 重新渲染页面
        initTable();
    })
    // 定义选择按钮
    function randerPage(total) {
        layui.laypage.render({
            elem: 'pageBox', //注意，这里的 test1 是 ID，不用加 # 号
            count: total, //数据总数，从服务端得到
            limit: q.pagesize, // 每页显示几条数据
            curr: q.pagenum, // 默认被选的分页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            // jump 切换分页的回调 
            // 两种方式触发
            // 1. 点击页码是触发jump回调函数  first为undefined
            // 2. 初始化页面是自动触发 first 为 true 当为true时再初始化页面会死循环
            jump: function (obj, first) {
                // 当前选中的页码
                // console.log(obj.curr);
                // 将当前选中的页码 赋值给q里面的页码 实现页面的切换
                q.pagenum = obj.curr;
                // console.log(obj.limit);
                // 将选择的最新条目 赋值给q里面的显示几条数目
                q.pagesize = obj.limit;
                // 当first不为ture时 第一种方式触发 调用获取文章数据
                if (!first) {
                    initTable();
                }

            }
        });
    }

    // 给删除按钮使用事件委托的方式 注册点击事件
    $("tbody").on('click', '.del', function () {
        // 获取当前页面删除按钮的长度
        var del = $(".del").length;
        // console.log(del);
        // 获取删除按钮所在行的id
        var id = $(this).attr("data-id");
        // console.log(id);
        // 弹出确认删除框
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {

            // 发送ajax请求 通过id删除文章
            $.ajax({
                type: "GET",
                url: "/my/article/delete/" + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layui.layer.msg("删除文章失败");
                    }
                    layui.layer.msg("删除文章成功");
                    // 判断当前页面删除按钮的长度 当为1时说明当前没有文章行了
                    if (del === 1) {
                        // 如果del== 1说明删除完毕后就没有要删除的文章了
                        // 把当前的页码 赋值给q里面对应的页面 页码最小=1
                        // 若页码为1时 不能-1了
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1;
                    }
                    // 重新获取文章列表
                    initTable();
                }
            });
            layer.close(index);
        });

    })

    // 给编辑按钮注册点击事件
    $("tbody").on('click', ".btnchange", function () {
        // 获取编辑按钮所在的id
        var id = $(this).attr("data-id")
        // console.log(id);
        // 将获取的id存放到localStorage里面
        localStorage.setItem("id", id)
        // 跳转到修改文章页面
        location.href = "/article/art_edit.html"


    })
})