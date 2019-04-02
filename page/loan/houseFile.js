layui.use(['form', 'layer', 'layedit'], function () {
    const form = layui.form,
        layer = parent.layer === undefined ? layui.layer : top.layer,
        layedit = layui.layedit,
        $ = layui.jquery;

    //创建一个编辑器
    const editIndex = layedit.build('content', {
        height: 500,
        tool: []
    });

    //用于同步编辑器内容到textarea
    // layedit.sync(editIndex);


    setTimeout(function () {
        $.ajax({
            url: $.cookie("tempUrl") + "loan/selectInfoByPrimaryKey?token=" + $.cookie("token") + "&id=" + $(".id").val(),
            type: "GET",
            success: function (result) {
                if (result.code == 0) {
                    layedit.setContent(editIndex, result.data.houseFile);
                } else {
                    layer.msg(result.exception, {icon: 7, anim: 6});
                }
            }
        });
    }, 500);
});