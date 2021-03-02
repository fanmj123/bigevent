$(function () {
    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options)
    // 
    $("#btnChoose").on('click', function () {
        $("#file").click();
    })
    // 为图片文件注册change事件
    $("#file").on('change', function (e) {
        var fileList = e.target.files;
        if (fileList.length === 0) {
            return layui.layer.msg('请选择图片');
        }
        // 1. 拿到用户选择的文件
        var file = e.target.files[0]
        // 2. 将文件，转化为路径
        var imgURL = URL.createObjectURL(file)
        // 3. 重新初始化裁剪区域
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', imgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })
    // 给确定按钮注册点击事件
    $("#btnR").on('click', function () {
        // 1.获取裁剪好的图片
        var dataURL = $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png')       // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
        // 2.发送ajax请求
        $.ajax({
            type: "POST",
            url: "/my/update/avatar",
            data: {
                avatar: dataURL
            },
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layui.layer.msg("上传头像失败");
                }
                layui.layer.msg("上传头像成功");
                // 更新用户信息 重新获取主页面的用户信息
                window.parent.getUserInfo();
            }
        });
    })
})