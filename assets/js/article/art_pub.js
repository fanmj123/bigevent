$(function () {
    initCate()
    // 初始化富文本编辑器
    initEditor()
    function initCate() {


        // 发送ajax获取文章类别数据
        $.ajax({
            type: "GET",
            url: "/my/article/cates",
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg("获取分类列表失败");
                }
                var htmlStr = template("tpl-cate", res);
                // 将获取的数据渲染到页面上
                $("[name=cate_id").html(htmlStr)
                // 需要layui 重新渲染form表单
                layui.form.render();
            }
        });
    }
    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)
    // 给选择封面按钮注册点击事件
    $("#btnChImg").on('click', function () {
        $("#coverFile").click();
    })
    // 监听文件选择框的change事件
    $("#coverFile").on('change', function (e) {
        // 获取文件的和长度
        var files = e.target.files
        // 判断图片的长度是否为0
        if (files === 0) {
            return
        }
        // 创建对应url路径
        var newImgURL = URL.createObjectURL(files[0]);
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })
    // 定义文章的发布状态
    var art_state = '已发布';
    // 存为草稿注册点击事件 当用户点击时将改变状态
    $("#btnSave2").on('click', function () {
        art_state = '草稿'
    })
    // 为表单注册提交监听事件
    $("#form-pub").on('submit', function (e) {
        // 1.阻止表单的默认提交行为
        e.preventDefault();
        // 2.利用form创建 FormData对象
        var fd = new FormData($(this)[0]);
        // 3.往fd里面添加状态
        fd.append("state", art_state);
        // 通过遍历可以得到formData里面的数据
        // fd.forEach(function (v, k) {
        //     console.log(k, v);
        // })
        // 4.将裁减过后的图片 输出为文件
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 添加到fd里面
                fd.append('cover_img', blob);
                // 调用publishArticle()函数 
                publishArticle(fd);
            })
    })
    function publishArticle(fd) {
        // 发送ajax请求 发表新文章
        $.ajax({
            type: "POST",
            url: "/my/article/add",
            data: fd,
            // 提交的是FormData格式的文件 一定要设置配置项
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg("发表新文章失败！");
                }
                layui.layer.msg("发表新文章成功");
                // 跳转到文章列表页面
                location.href = '/article/art_list.html'
            }
        });
    }


})