layui.use(['table'], function () {
    const table = layui.table,
        $ = layui.jquery;

    //系统日志
    table.render({
        elem: '#logs',
        url: $.cookie("tempUrl") + 'log/selectListForLogAdmin',
        method: 'GET',
        where: {token: $.cookie("token")},
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
        limit: 15,
        limits: [5, 10, 15, 20, 25],
        id: "systemLog",
        cols: [[
            {field: 'id', title: 'ID', width: 90, align: "center"},
            {
                field: 'method', title: '请求方式', width: 100, align: 'center', templet: function (d) {
                    if (d.method.toUpperCase() === "GET") {
                        return '<span class="layui-blue">' + d.method + '</span>'
                    } else {
                        return '<span class="layui-red">' + d.method + '</span>'
                    }
                }
            },
            {field: 'requestUri', title: '请求URI', minWidth: 210, align: 'left'},
            {
                field: 'exception', title: '是否异常', align: 'center', templet: function (d) {
                    if (d.exception === "") {
                        return '<span class="layui-btn layui-btn-green layui-btn-xs">正常</span>'
                    } else {
                        return '<span class="layui-btn layui-btn-danger layui-btn-xs">' + d.exception + '</span>'
                    }
                }
            },
            {field: 'remoteAddress', title: '请求IP地址', minWidth: 130, align: "left"},
            {field: 'createBy', title: '操作人', minWidth: 100, align: "center"},
            {
                field: 'createDate', title: '操作时间', minWidth: 200, align: "center", templet: function (d) {
                    return d.createDate;
                }
            }
        ]]
    });
});
