layui.use(['form', 'layer', 'table', 'laydate', 'laytpl'], function () {
    var form = layui.form,
        layer = parent.layer === undefined ? layui.layer : top.layer,
        $ = layui.jquery,
        laytpl = layui.laytpl,
        laydate = layui.laydate,
        table = layui.table;

    //点击flash按钮事件
    $(document).on("click", "#flash", function () {
        window.location.reload();
    });

    //获取广告分组
    $.ajax({
        url: $.cookie("tempUrl") + "AdGroup/selectList?token=" + $.cookie("token") + "&pageNum=1&pageSize=99",
        type: "get",
        success: function (result) {
            $.each(result.content,
                function (index, item) {
                    $("#advertisingGroup").append($('<option value=' + item.id + '>' + item.name + '</option>'));
                });
            form.render();
        }
    });

    //列表
    var tableIns = table.render({
        elem: '#userList',
        url: $.cookie("tempUrl") + 'Ad/selectList',
        method: 'get',
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
        height: "full-125",
        limits: [5, 10, 15, 20, 25],
        limit: 10,
        id: "userListTable",
        cols: [[
            {field: 'id', title: '广告编号', width: 100, align: "center"},
            {field: 'name', title: '广告名称', minWidth: 120, align: "center"},
            {
                field: 'adMaterialVos', title: '预览', minWidth: 120, align: 'center', templet: function (d) {
                    return "我是按钮";
                }
            },
            {
                field: 'adGroupName', title: '分组名称', minWidth: 120, align: 'center', templet: function (d) {
                    return d.adGroup.name;
                }
            },
            {title: '操作', minWidth: 100, templet: '#userListBar', fixed: "right", align: "center"}
        ]]
    });

    //点击material按钮事件
    $(document).on("click", ".material", function () {
        var photoReg = /\.jpg$|\.jpeg$|\.gif$/i;
        var videoReg = /\.avi$|\.mkv$|\.mp4$|\.mov$|\.flv$/i;
        var musicReg = /\.mp3$|\.wma$|\.flac$|\.aac$|\.wav$/i;
        var directReg = /\.m3u8$/i;

        var data = $(this).attr("data-url");
        var type = 0;
        var area = "";
        var redirect = "";
        if (photoReg.test(data.substring(data.lastIndexOf(".")))) {
            redirect = '<div style="display: flex;justify-content: center;width: 100%;height: 100%;align-items: center;">' +
                '<img class="layui-upload-img thumbImg" id="perivew" src="' + data + '"></div>'
            type = 1;
            area = ['800px', '600px'];
        } else if (videoReg.test(data.substring(data.lastIndexOf(".")))) {
            redirect = '<div style="display: flex;justify-content: center;width: 100%;height: 100%;align-items: center;">' +
                '<util class="layui-upload-img thumbImg" src="' + data + '" controls="controls" id="perivew" width="600" height="400"></util></div>';
            type = 1;
            area = ['650px', '500px'];
        } else if (directReg.test(data.substring(data.lastIndexOf(".")))) {
            redirect = "./page/advertising/util.html";
            sessionStorage.setItem("url", data);
            type = 2;
            area = ['600px', '600px'];
        } else if (musicReg.test(data.substring(data.lastIndexOf(".")))) {
            redirect = '<audio class="layui-upload-img thumbImg" controls="controls" id="perivew" src="' + data + '"></audio>';
            type = 1;
            area = 'auto';
        }

        var index = layer.open({
            title: $(this).attr("data-name"),
            type: type,
            shade: 0.5,
            shadeClose: true,
            offset: ['100px', '300px'],
            area: area,
            content: redirect,
            success: function (layero, index) {
                var body = layui.layer.getChildFrame('body', index);
                setTimeout(function () {
                    layui.layer.tips('点击此处关闭', '.layui-layer-setwin .layui-layer-close', {
                        tips: 3
                    });
                }, 500)
            }
        });
    });


    //搜索
    form.on("submit(search_btn)", function (data) {
        table.reload("userListTable", {
            url: $.cookie("tempUrl") + 'Ad/selectListBySearch',
            where: {
                name: $(".searchVal").val(),
                groupid: $("#advertisingGroup").val(),
                token: $.cookie("token")
            }
        })
    });

    //点击新增按钮事件
    $(".addNews_btn").click(function () {
        var index = layui.layer.open({
            title: "制作新广告",
            type: 2,
            // area: ["600px", "500px"],
            // offset: ['30px', '270px'],
            content: "AddAdvertising.html",
            success: function (layero, index) {
                var body = layui.layer.getChildFrame('body', index);
                setTimeout(function () {
                    layui.layer.tips('点击此处返回列表', '.layui-layer-setwin .layui-layer-close', {
                        tips: 3
                    });
                }, 500)
            }
        });
        layui.layer.full(index);
        window.sessionStorage.setItem("index", index);
        //改变窗口大小时，重置弹窗的宽高，防止超出可视区域（如F12调出debug的操作）
        $(window).on("resize", function () {
            layui.layer.full(window.sessionStorage.getItem("index"));
        })
    });

    //编辑按钮
    function adUpd(edit) {
        var index = layui.layer.open({
            title: "编辑广告分组",
            type: 2,
            area: ["600px", "500px"],
            offset: ['30px', '270px'],
            content: "UpdAdvertising.html",
            success: function (layero, index) {
                var body = layui.layer.getChildFrame('body', index);
                if (edit) {
                    body.find(".adName").attr("data-id", edit.id);  //传id
                    body.find(".adName").val(edit.name);  //标题
                    body.find(".adName").attr("data-groupid", edit.groupid);  //广告分组

                    $.ajax({
                        url: $.cookie("tempUrl") + "admaterial/get_list_adId.do?token=" + $.cookie("token") + "&adId=" + edit.id + "&pageNum=1&PageSize=99",
                        type: "POST",
                        success: function (result) {
                            $.each(result.content,
                                function (index, item) {
                                    // materialId[index] = item.id + "";
                                    // musicPath[index] = "";
                                    if (item.materialType == "视频") {
                                        body.find(".main").append($('<div class=""><ul class="list-group"><li class="list-group-item borderNone">类型：<input class="adId" type="hidden" value="' + item.adId + '">' + item.materialType + '</li>'))
                                            .append($('<li class="list-group-item borderNone">素材Id：<input class="materialId" type="hidden" value="' + item.materialId + '" disabled>' + item.materialId + '</li>'))
                                            .append($('<li class="list-group-item borderNone">素材名称：' + item.materialName + '</li>'))
                                            .append($('<li class="list-group-item borderNone">地址：' + item.materialPath + '</li>'))
                                            .append($('<li class="list-group-item borderNone">间隔：<input class="loadStep" type="number" value="' + item.loadStep + '" style="width: 50px">秒 <input class="displayTime" type="hidden" value="0" style="width: 50px"> 顺序：<input class="orderIndex" type="number" value="' + item.orderIndex + '" style="width: 50px"></li>'))
                                            .append($('</ul></div><hr>'));
                                    } else {
                                        body.find(".main").append($('<div class=""><ul class="list-group"><li class="list-group-item borderNone">类型：<input class="adId" type="hidden" value="' + item.adId + '">' + item.materialType + '</input></li>'))
                                            .append($('<li class="list-group-item borderNone">素材Id：<input class="materialId" type="hidden" value="' + item.materialId + '" disabled>' + item.materialId + '</li>'))
                                            .append($('<li class="list-group-item borderNone">素材名称：' + item.materialName + '</li>'))
                                            .append($('<li class="list-group-item borderNone">地址：' + item.materialPath + '</li>'))
                                            .append($('<li class="list-group-item borderNone">间隔：<input class="loadStep" type="number" value="' + item.loadStep + '" style="width: 50px">秒 显示：<input class="displayTime" type="number" value="' + item.displayTime + '" style="width: 50px">秒 顺序：<input class="orderIndex" type="number" value="' + item.orderIndex + '" style="width: 50px"></li>'))
                                            .append($('</ul></div><hr>'));
                                    }
                                });
                        }
                    });

                    form.render();
                }
                setTimeout(function () {
                    layui.layer.tips('点击此处返回广告列表', '.layui-layer-setwin .layui-layer-close', {
                        tips: 3
                    });
                }, 500)
            }
        });
    }

    //列表操作
    table.on('tool(userList)', function (obj) {
        var layEvent = obj.event,
            data = obj.data;

        if (layEvent === 'edit') { //编辑
            adUpd(data)
        } else if (layEvent === 'del') { //删除
            layer.confirm('确定删除此广告？', {icon: 3, title: '提示信息'}, function (index) {
                $.ajax({
                    url: $.cookie("tempUrl") + "ad/del_ad.do?token=" + $.cookie("token") + "&adId=" + data.id,
                    type: "POST",
                    success: function (result) {
                        layer.msg("删除成功");
                        window.location.href = "ListAdvertising.html";
                    }
                });
                tableIns.reload();
                layer.close(index);
            });
        }
    });
});
