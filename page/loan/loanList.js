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
        url: $.cookie("tempUrl") + 'loan/selectList',
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
                field: 'username', title: '贷款用户', minWidth: 130, align: "center", templet: function (d) {
                    switch (d.username) {
                        case '':
                        case null:
                            return '未填写';
                        default:
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
                field: 'houseType', title: '名下房产类型', minWidth: 130, align: 'center', templet: function (d) {
                    if (d.houseType === '未填写' || d.status <= 1) {
                        return d.houseType
                    } else {
                        return '<a lay-event="houseType" style="cursor:pointer;color: #01AAED">' + d.houseType + '</a>';
                    }
                    // switch (d.houseType) {
                    //     case '未填写':
                    //         return d.houseType;
                    //     default:
                    //         return '<a lay-event="houseType" style="cursor:pointer;color: #01AAED">' + d.houseType + '</a>';
                    // }
                }
            },
            {
                field: 'carType', title: '名下车产类型', minWidth: 130, align: 'center', templet: function (d) {
                    if (d.carType === '未填写' || d.carType === '无车' || d.status <= 1) {
                        return d.carType
                    } else {
                        return '<a lay-event="carType" style="cursor:pointer;color: #01AAED">' + d.carType + '</a>';
                    }
                    // switch (d.carType) {
                    //     case '未填写':
                    //     case '无车':
                    //         return d.carType;
                    //     default:
                    //         return '<a lay-event="carType" style="cursor:pointer;color: #01AAED">' + d.carType + '</a>';
                    // }
                }
            },
            {
                field: 'phone', title: '贷款手机号', minWidth: 100, align: "center", templet: function (d) {
                    return d.createBy;
                }
            },
            {
                field: 'createDate', title: '创建时间', minWidth: 170, align: "center", templet: function (d) {
                    return util.toDateString(d.createDate);
                }
            },
            {
                field: 'jd', title: '进度', minWidth: 200, align: 'center', templet: function (d) {
                    switch (d.status) {
                        case 0:
                            return '<div class="layui-progress" lay-showPercent="yes" style="margin-top: 13px"> <div class="layui-progress-bar layui-bg-red" lay-percent="100%"></div> </div>';
                        case 1:
                            return '<div class="layui-progress" lay-showPercent="yes" style="margin-top: 13px"> <div class="layui-progress-bar layui-bg-gray" lay-percent="20%"></div> </div>';
                        case 2:
                            return '<div class="layui-progress" lay-showPercent="yes" style="margin-top: 13px"> <div class="layui-progress-bar layui-bg-orange" lay-percent="50%"></div> </div>';
                        case 3:
                            return '<div class="layui-progress" lay-showPercent="yes" style="margin-top: 13px"> <div class="layui-progress-bar" lay-percent="100%"></div> </div>';
                        case 4:
                            return '<div class="layui-progress" lay-showPercent="yes" style="margin-top: 13px"> <div class="layui-progress-bar layui-bg-green" lay-percent="100%"></div> </div>';
                    }
                }
            },
            {
                field: 'status', title: '审核状态', width: 110, align: 'center', templet: function (d) {
                    switch (d.status) {
                        case 0:
                            return '<span style="color: red">审核不通过 </span>';
                        case 1:
                            return '凭证待上传';
                        case 2:
                            return '<input type="checkbox" lay-filter="status" lay-skin="switch" value=' + d.id + ' lay-text="已通过|审核中">';
                        case 3:
                            return '<input type="checkbox" lay-filter="status" lay-skin="switch" value=' + d.id + ' lay-text="已通过|审核中" checked>';
                        case 4:
                            return '资金已到账';
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
                    url: $.cookie("tempUrl") + 'loan/selectListBySearch',
                    where: {
                        search: $(".searchVal").val(),
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
            url: $.cookie("tempUrl") + "loan/updateByStatus?token=" + $.cookie("token"),
            type: "PUT",
            datatype: "application/json",
            contentType: "application/json;charset=utf-8",
            data: JSON.stringify({
                "id": data.value,
                "status": data.elem.checked ? "3" : "2"
            }),
            success: function (result) {
                if (result.httpStatus === 200) {
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
        let index;
        switch (layEvent) {
            case 'userId':
                index = layui.layer.open({
                    title: "用户详情",
                    type: 2,
                    maxmin: true, //开启最大化最小化按钮
                    area: ["700px", "500px"],
                    content: "../member/memberInfo.html",
                    shadeClose: true,
                    success: function (layero, index) {
                        const body = layui.layer.getChildFrame('body', index);
                        body.find(".id").val(data.userId);
                        form.render();
                    }
                });
                break;
            case 'houseType':
                index = layui.layer.open({
                    title: "房产证明文件",
                    type: 2,
                    maxmin: true, //开启最大化最小化按钮
                    area: ["700px", "500px"],
                    content: "houseFile.html",
                    shadeClose: true,
                    success: function (layero, index) {
                        const body = layui.layer.getChildFrame('body', index);
                        body.find(".id").val(data.id);
                        form.render();
                    }
                });
                // layui.layer.full(index);
                // window.sessionStorage.setItem("index", index);
                // //改变窗口大小时，重置弹窗的宽高，防止超出可视区域（如F12调出debug的操作）
                // $(window).on("resize", function () {
                //     layui.layer.full(window.sessionStorage.getItem("index"));
                // });
                break;
            case 'carType':
                index = layui.layer.open({
                    title: "车产证明文件",
                    type: 2,
                    maxmin: true, //开启最大化最小化按钮
                    area: ["700px", "500px"],
                    content: "carFile.html",
                    shadeClose: true,
                    success: function (layero, index) {
                        const body = layui.layer.getChildFrame('body', index);
                        body.find(".id").val(data.id);
                        form.render();
                    }
                });
                // layui.layer.full(index);
                // window.sessionStorage.setItem("index", index);
                // //改变窗口大小时，重置弹窗的宽高，防止超出可视区域（如F12调出debug的操作）
                // $(window).on("resize", function () {
                //     layui.layer.full(window.sessionStorage.getItem("index"));
                // });
                break;
        }
    });
});