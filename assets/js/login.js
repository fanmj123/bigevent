$(function () {
    // 给“去注册账号” 注册点击事件
    $("#reg-link").on('click', function () {
        // 点击去注册 让注册页面显示 登录页面隐藏
        $(".login-box").hide();
        $(".reg-box").show();
    })
    // 给“去登陆”注册点击事件
    $("#login-link").on('click', function () {
        $(".login-box").show();
        $(".reg-box").hide();
    })

    // 自定义表单的校验规则
    // 1.使用layui 获取form表单
    var form = layui.form;
    // 使用layui 获取自动提示信息
    var layer = layui.layer
    // 2.调用form.verify自定义表单规则
    form.verify({
        pwd: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],
        repwd: function (value) {
            // 获取确认密码的值
            var pwd = $(".reg-box [name=password]").val();
            // console.log(pwd);
            // 判断输入的传进来的形参和获取确认密码的值是否相等
            if (pwd !== value) {
                return '两次输入不一致'
            }
        }
    })
    // 监听注册表单的提交事件
    $('#form_reg').on('submit', function (e) {
        // 阻止默认跳转行为
        e.preventDefault();
        // 发送ajax请求
        var data = {
            username: $('#form_reg [name=username]').val(),
            password: $('#form_reg [name=password]').val()
        }
        $.post('/api/reguser', data,
            function (res) {
                if (res.status !== 0) {
                    // return console.log(res.message);
                    return layer.msg(res.message)
                }
                layer.msg('注册成功，请登录！');
                // 注册成功自动跳转到登录页面
                $('#login-link').click();
            })
    })

    // 监听登录表单的提交事件
    $("#form_login").submit(function (e) {
        e.preventDefault();
        // 发送ajax请求
        $.ajax({
            type: 'post',
            url: '/api/login',
            data: $(this).serialize(),
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                // 发送请求成功
                layer.msg("登录成功");
                //将登陆成功得到的token字符串，保存到localStorage中
                localStorage.setItem('token', res.token)
                // 跳转到后台页面
                location.href = '/index.html'
            }
        })
    })
})