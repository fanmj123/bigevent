// 注意：每次调用$.get() $.post() $.ajax()的时候，会先调用ajaxPrefilter这个函数 在这个函数中，可以拿拿到我们给Ajax提供的配置对象
$.ajaxPrefilter(function (options) {
    // 统一拼接请求的根路径
    options.url = 'http://ajax.frontend.itheima.net' + options.url
    console.log(options.url);

    // 有权限的需要headers
    options.headers = {
        Authorization: localStorage.getItem('token') || ''
    }
})