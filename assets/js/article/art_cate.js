$(function () {
    initArtcateList();
    // 获取文章分类列表
    function initArtcateList() {
        // 发送Ajax请求
        $.ajax({
            type: "GET",
            url: "/my/article/cates",
            success: function (res) {
                // console.log(res);
                var htmlStr = template('tpl-table', res);
                $('tbody').html(htmlStr);
            }
        });
    }
    // 为添加类别按钮注册点击事件
    var indexAdd = null;
    $('#btnAddCate').on('click', function () {
        // 弹出层
        indexAdd = layui.layer.open({
            // 去掉确认按钮
            type: 1,
            // 设置宽高
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $("#dialog-add").html()
        });

    })
    //给点击之后生成的弹出框表单注册提交监听事件 事件委托
    $('body').on('submit', '#form_add', function (e) {
        e.preventDefault();
        // 发送ajax请求 添加文章分类
        $.ajax({
            type: "POST",
            url: "/my/article/addcates",
            data: $("#form_add").serialize(),
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layui.layer.msg('新增文章失败');
                }
                // 新增成功 重新获取文章列表
                initArtcateList();
                layui.layer.msg("新增文章成功");
                // 用索引号关闭弹出层
                layui.layer.close(indexAdd)
            }
        });
    })

    // 给编辑按钮注册点击事件 事件委托
    var indexEdit = null;
    $("tbody").on("click", "#btnEdit", function () {
        // 弹出层
        indexEdit = layui.layer.open({
            // 去掉确认按钮
            type: 1,
            // 设置宽高
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $("#dialog-edit").html()
        });

        // 获取点击的编辑所在行的id
        var id = $(this).attr('data-id');
        // console.log(id);
        // 发送ajax根据id获取列表的值
        $.ajax({
            type: "GET",
            url: "/my/article/cates/" + id,
            success: function (res) {
                // console.log(res);
                layui.form.val('form-edit', res.data)
            }
        });

    })
    // 给编辑按钮的表单注册表单提交监听事件
    $('body').on('submit', '#form_edit', function (e) {
        e.preventDefault();
        // 发送ajax提交修改的数据
        $.ajax({
            type: "POST",
            url: "/my/article/updatecate",
            data: $(this).serialize(),
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layui.layer.msg("数据信息更新失败");
                }
                // 数据信息更新成功 关闭弹出框
                layui.layer.close(indexEdit);
                // 重新获取文章列表
                initArtcateList();
            }
        });
    })
    //给删除按钮注册点击事件
    $('tbody').on('click', '#btnDel', function () {
        var id = $(this).attr("data-id")
        // console.log(id);
        layui.layer.confirm('确定删除?', function (index) {
            // 发送ajax请求删除文章列表
            $.ajax({
                type: "GET",
                url: "/my/article/deletecate/" + id,
                success: function (res) {
                    // console.log(res);
                    if (res.status !== 0) {
                        return layui.layer.msg("删除文章分类失败");
                    }
                    // 删除文章分类成功
                    layui.layer.msg("删除文章分类成功");
                    layui.layer.close(index);
                    // 重新获取文章列表
                    initArtcateList();

                }
            });
        });
    })
})