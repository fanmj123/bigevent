// 注意：每次调用$.get() $.post() $.ajax()的时候，会先调用ajaxPrefilter这个函数 在这个函数中，可以拿拿到我们给Ajax提供的配置对象
$.ajaxPrefilter(function (options) {
    // 统一拼接请求的根路径
    options.url = 'http://api-breakingnews-web.itheima.net' + options.url
    console.log(options.url);
    // 无论获取成功还是失败都会执行
    options.complete = function (res) {
        // console.log(res);
        // 判断是否请求成功
        if (res.responseJSON.status === 1 && res.responseJSON.message === "身份认证失败！") {
            // 请求失败
            // 1. 强制清空token
            localStorage.removeItem('token');
            // 2.跳转登录页面
            location.href = "/login.html"
        }
    }

    // 有权限的需要headers
    options.headers = {
        Authorization: localStorage.getItem('token') || ''
    }
})
// 屏蔽enter键
document.onkeydown = function (e) {
    if (e.keyCode == 13) return false;
}