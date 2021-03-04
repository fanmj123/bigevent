$(function () {
    // 校验密码
    layui.form.verify({
        pwd: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],
        // 原密码和新密码的校验 两次输入不能相同
        newpwd: function (value) {
            // 获取原密码
            if (value === $("[name=oldPwd]").val()) {
                return '新旧密码不能相同哦'
            }
        },
        // 新密码和确认新密码的校验
        repwd: function (value) {
            if (value !== $("[name=newPwd]").val()) {
                return '两次输入不一致哟！'
            }
        }
    })
    // 给修改密码注册提交监听事件
    $('.layui-form').on('submit', function (e) {
        // console.log("111");
        e.preventDefault()
        $.ajax({
            type: 'POST',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function (res) {
                console.log(res);
                if (res.status !== 0) {
                    return layui.layer.msg("修改密码失败");
                }
                // 重置密码
                $(".layui-form")[0].reset();
                // 弹出框修改成功
                layer.alert('修改用户信息成功，请重新登录', function (index) {
                    //清空token
                    localStorage.removeItem('token');
                    window.parent.location.href = '/login.html'
                    layer.close(index);
                });
            }
        })
    })

})
