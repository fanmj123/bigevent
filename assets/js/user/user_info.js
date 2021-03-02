$(function () {
    // 对昵称进行校验
    layui.form.verify({
        nickname: function (value) {
            if (value.length > 6) {
                return '请输入1 ~ 6位字符！'
            }
        }
    })
})
initUserInfo();
// 发送ajax请求初始化基本信息
function initUserInfo() {
    $.ajax({
        type: 'GET',
        url: '/my/userinfo',
        success: function (res) {
            // console.log(res);
            if (res.status !== 0) {
                return layui.layer.msg(res.message);
            }
            // 将获取的数据赋值给form表单
            layui.form.val('userInfo_form', res.data);
        }
    })
}
// 表单重置按钮注册点击事件
$("#btnre").on('click', function (e) {
    // 阻止默认重置行为
    e.preventDefault();
    //重新获取当前的用户信息
    initUserInfo();
})

// 注册表单提交监听事件
$(".layui-form").on('submit', function (e) {
    e.preventDefault()
    // 发起ajax
    $.ajax({
        type: "POST",
        url: "/my/userinfo",
        data: $(this).serialize(),
        success: function (res) {
            // console.log(res);
            if (res.status !== 0) {
                return layui.layer.msg('修改用户信息失败');
            }
            layui.layer.msg('修改成功');
            // 更新用户信息 重新获取用户信息 修改昵称
            window.parent.getUserInfo();
        }
    });
})