$(function () {
    getUserInfo()
})
// 获取用户信息
function getUserInfo() {
    // 发送ajax请求
    $.ajax({
        type: 'GET',
        url: '/my/userinfo',
        // headers: {
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function (res) {
            // console.log(res);
            if (res.status !== 0) {
                return layui.layer.msg(res.message);
            }
            randerAvatar(res.data);
        },
        // 无论获取成功还是失败都会执行
        // complete: function (res) {
        //     console.log(res);
        //     // 判断是否请求成功
        //     if (res.responseJSON.status === 1 && res.responseJSON.message === "身份认证失败！") {
        //         // 请求失败
        //         // 1. 强制清空token
        //         localStorage.removeItem('token');
        //         // 2.跳转登录页面
        //         location.href = "/login.html"
        //     }
        // }
    })
    //渲染头像
    function randerAvatar(user) {
        // 获取用户名
        var uname = user.nickname || user.username;
        $(".welcome").html("欢迎&nbsp;&nbsp;" + uname);
        // 按需渲染头像
        if (user.user_pic !== null) {
            $(".layui-nav-img").attr("src", user.user_pic).show();
            $(".text-avatar").hide();
        } else {
            $(".layui-nav-img").hide();
            var frist = uname[0].toUpperCase();
            $(".text-avatar").html(frist).show();
        }
    }
    $("#btnlogout").on('click', function () {
        // 提示用户是否退出
        layui.layer.confirm('确定退出登录？', { icon: 3, title: '提示' }, function (index) {
            //do something
            // 清空token
            localStorage.removeItem('token');
            // 跳转到登录页面
            location.href = '/login.html';
            layer.close(index);
        });
    })


}