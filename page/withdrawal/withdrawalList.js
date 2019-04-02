layui.use(['form', 'layer', 'table', 'element'], function () {
    const form = layui.form,
        layer = parent.layer === undefined ? layui.layer : top.layer,
        $ = layui.jquery,
        util = layui.util,
        element = layui.element,
        table = layui.table;

    //列表
    const tableIns = table.render({
        elem: '#list',
        url: $.cookie("tempUrl") + 'withdrawal/selectList',
        where: {token: $.cookie("token")},
        method: "GET",
        request: {
            pageName: 'pageNum' //页码的参数名称，默认：page
            , limitName: 'pageSize' //每页数据量的参数名，默认：limit
        },
        response: {
            statusName: 'code' //数据状态的字段名称，默认：code
            , statusCode: 0 //成功的状态码，默认：0
            , msgName: 'httpStatus' //状态信息的字段名称，默认：msg
            , countName: 'totalElements' //数据总数的字段名称，默认：count
            , dataName: 'content' //数据列表的字段名称，默认：data
        },
        cellMinWidth: 95,
        page: true,
        height: "full-25",
        limits: [5, 10, 15, 20, 25],
        limit: 15,
        id: "dataTable",
        toolbar: '#toolbarDemo',
        defaultToolbar: ['exports', 'print'],
        cols: [[
            {field: 'id', title: 'ID', width: 90, align: 'center'},
            {
                field: 'username', title: '用户姓名', minWidth: 130, align: "center", templet: function (d) {
                    if (d.username == null || d.username == "") {
                        return '未填写';
                    } else {
                        return '<a lay-event="userId" style="cursor:pointer;color: #01AAED">' + d.username + '</a>';
                    }
                }
            },
            {
                field: 'money', title: '贷款金额', minWidth: 130, align: "center", templet: function (d) {
                    return '<a lay-event="money" style="cursor:pointer;">￥' + d.money + '</a>';
                }
            },
            {
                field: 'createBy', title: '提现手机号', minWidth: 130, align: "center", templet: function (d) {
                    if (d.createBy == null || d.createBy == "") {
                        return '未填写';
                    } else {
                        return '<a lay-event="userId" style="cursor:pointer;">' + d.createBy + '</a>';
                    }
                }
            },
            {
                field: 'createDate', title: '创建时间', minWidth: 200, align: "center", templet: function (d) {
                    return util.toDateString(d.createDate);
                }
            },
            {
                field: 'jd', title: '进度', minWidth: 200, align: 'center', templet: function (d) {
                    if (d.status == 0) {
                        return '<div class="layui-progress" lay-showPercent="yes" style="margin-top: 13px"> <div class="layui-progress-bar" lay-percent="0%"></div> </div>';
                    } else if (d.status == 1) {
                        return '<div class="layui-progress" lay-showPercent="yes" style="margin-top: 13px"> <div class="layui-progress-bar layui-bg-orange" lay-percent="50%"></div> </div>';
                    } else if (d.status == 2) {
                        return '<div class="layui-progress" lay-showPercent="yes" style="margin-top: 13px"> <div class="layui-progress-bar layui-bg-green" lay-percent="100%"></div> </div>';
                    }
                }
            },
            {
                field: 'status', title: '状态', width: 110, align: 'center', templet: function (d) {
                    if (d.status == 0) {
                        return '违规记录';
                    } else if (d.status == 1) {
                        return '<input type="checkbox" lay-filter="status" lay-skin="switch" value=' + d.id + ' lay-text="已打款|待打款">';
                    } else if (d.status == 2) {
                        return '<input type="checkbox" lay-filter="status" lay-skin="switch" value=' + d.id + ' lay-text="已打款|待打款" checked>';
                    }
                }
            }
        ]],
        done: function () {
            element.render();
        }
    });

    //头工具栏事件
    table.on('toolbar(test)', function (obj) {
        const checkStatus = table.checkStatus(obj.config.id);
        switch (obj.event) {
            case 'search_btn':
                table.reload("dataTable", {
                    url: $.cookie("tempUrl") + 'withdrawal/selectListByUserId',
                    where: {
                        userId: $(".searchVal").val(),
                        token: $.cookie("token")
                    }
                });
                break;
            case 'flash_btn':
                window.location.reload();
                break;
        }
    });

    // 修改状态开关
    form.on('switch(status)', function (data) {
        // console.log(data.elem.checked); //开关是否开启，true或者false
        // console.log(data.value); //开关value值，也可以通过data.elem.value得到
        $.ajax({
            url: $.cookie("tempUrl") + "withdrawal/updateByStatus?token=" + $.cookie("token"),
            type: "PUT",
            datatype: "application/json",
            contentType: "application/json;charset=utf-8",
            data: JSON.stringify({
                "id": data.value,
                "status": data.elem.checked ? "2" : "1"
            }),
            success: function (result) {
                if (result.httpStatus == 200) {
                    layer.msg("状态修改成功");
                } else {
                    layer.alert(result.exception, {icon: 7, anim: 6});
                }
            }
        });
    });

    //列表操作
    table.on('tool(test)', function (obj) {
        const layEvent = obj.event,
            data = obj.data;
        switch (layEvent) {
            case 'userId':
                const index = layui.layer.open({
                    title: "用户详情",
                    type: 2,
                    maxmin: true, //开启最大化最小化按钮
                    area: ["700px", "500px"],
                    content: "../member/memberInfo.html",
                    shadeClose: true,
                    success: function (layero, index) {
                        var body = layui.layer.getChildFrame('body', index);
                        body.find(".id").val(data.userId);
                        form.render();
                    }
                });
                break;
        }
    });
});
