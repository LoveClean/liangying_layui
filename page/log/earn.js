layui.use(['table'], function () {
    const table = layui.table,
        $ = layui.jquery;

    //系统日志
    table.render({
        elem: '#logs',
        url: $.cookie("tempUrl") + 'log/selectListForEarn',
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
            {field: 'superiorId', title: '上级用户id', minWidth: 100, align: "center"},
            {field: 'subordinateId', title: '下级用户id', minWidth: 100, align: "center"},
            {field: 'subordinatePhone', title: '下级手机号', minWidth: 100, align: "center"},
            {
                field: 'loanMoney', title: '下级贷款金额', minWidth: 100, align: "center", templet: function (d) {
                    return '￥' + d.loanMoney / 10000 + '万';
                }
            },
            {
                field: 'percentage', title: '收益百分比', minWidth: 100, align: "center", templet: function (d) {
                    return d.percentage * 100 + '%';
                }
            },
            {
                field: 'earnMoney', title: '收益金额', minWidth: 100, align: "center", templet: function (d) {
                    return '￥' + d.earnMoney;
                }
            },
            {field: 'createBy', title: '审核人', minWidth: 100, align: "center"},
            {
                field: 'createDate', title: '审核时间', minWidth: 200, align: "center", templet: function (d) {
                    return d.createDate;
                }
            }
        ]]
    });
});
