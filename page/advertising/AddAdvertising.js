layui.use(['form', 'layer', 'table'], function () {
    var form = layui.form,
        layer = parent.layer === undefined ? layui.layer : top.layer,
        $ = layui.jquery,
        table = layui.table;

    //获取广告分组
    $.ajax({
        url: $.cookie("tempUrl") + "adgroup/get_group.do?token=" + $.cookie("token"),
        type: "POST",
        success: function (result) {
            $.each(result.data,
                function (index, item) {
                    $("#advertisingGroup").append($('<option value=' + item.id + '>' + item.name + '</option>'));
                });
            form.render();
        }
    });

    //素材列表
    var tableIns = table.render({
        elem: '#materialList',
        url: $.cookie("tempUrl") + '/material/get_list.do',
        method: 'post',
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
            {type: "checkbox", fixed: "left", width: 50},
            {field: 'id', title: 'ID', width: 100, align: "center"},
            {field: 'name', title: '文件名', minWidth: 150, width: 180, align: "center"},
            {field: 'type', title: '类型', width: 100, align: 'center'},
            {
                field: 'path', title: '地址', minWidth: 200, templet: function (d) {
                    return '<a data-info=' + d.type + ' data-info2=' + d.path + ' class="layui-btn layui-btn-xs material" style="margin-right: 10px">预览</a>' + '<span style="color: #c00">' + d.path + '</span>'
                }
            },
            {field: 'groupName', title: '分组名称', minWidth: 180, width: 230, align: "center"}
        ]]
    });
    $.ajax({
        url: $.cookie("tempUrl") + "/materialgroup/get_group.do?token=" + $.cookie("token"),
        type: "POST",
        success: function (result) {
            var data = result.data;
            for (var i = 0; i < data.length; i++) {
                var option = $("<option value='" + data[i].id + "'>" + data[i].name + "</option>");
                $("#materialGroup").append(option)
                form.render('select');
            }
        }
    });
    //素材列表搜索
    form.on("submit(search_btn)", function (data) {
        table.reload("userListTable", {
            url: $.cookie("tempUrl") + '/material/search.do',
            method: 'post',
            where: {
                groupId: $("#materialGroup").val(),
                keyword: $("#materialName").val(),
                token: $.cookie("token")
            }
        })
    });
    //点击预览按钮事件
    $(document).on('click', '.material', function () {
        var data = $(this).attr("data-info2");
        var type = $(this).attr("data-info");
        var type2 = 0;
        var area = "";
        var redirect = "";
        if (type === "图片") {
            redirect = '<div style="display: flex;justify-content: center;width: 100%;height: 100%;align-items: center;">' +
                '<img class="layui-upload-img thumbImg" id="perivew" src="' + data + '"></div>';
            type2 = 1;
            area = ['600px', '450px'];
        } else if (type === "视频") {
            redirect = '<div style="display: flex;justify-content: center;width: 100%;height: 100%;align-items: center;">' +
                '<util class="layui-upload-img thumbImg" src="' + data + '" controls="controls" id="perivew" width="600" height="400"></util></div>';
            type2 = 1;
            area = ['650px', '500px'];
        } else if (type === "直播") {
            redirect = "./page/advertising/util.html";
            sessionStorage.setItem("url", data);
            type2 = 2;
            area = ['600px', '600px'];
        } else {
            redirect = '<audio class="layui-upload-img thumbImg" controls="controls" id="perivew" src="' + data + '"></audio>';
            type2 = 1;
            area = 'auto';
        }
        var index = layer.open({
            title: "预览",
            type: type2,
            offset: ['100px', '300px'],
            area: area,
            resize: true,
            content: redirect,
            shade: 0.5,
            shadeClose: true,
            success: function (layero, index) {
                setTimeout(function () {
                    layui.layer.tips('点击此处关闭', '.layui-layer-setwin .layui-layer-close', {
                        tips: 3
                    });
                }, 500)
            }
        })
    });

    /////////////////////////////////////////////////////////////////////////
    var adId = new Array();
    var displayTime = new Array();
    var loadStep = new Array();
    var materialId = new Array();
    var musicPath = new Array();
    var orderIndex = new Array();
    var _list = new Array();

    // //设置媒体素材
    // form.on("submit(setMaterial)", function (data) {
    //     for (var i = 0; i < materialId.length; i++) {
    //         var obj = {
    //             "adId": adId[i],
    //             "displayTime": displayTime[i],
    //             "loadStep": loadStep[i],
    //             "materialId": materialId[i],
    //             "musicPath": musicPath[i],
    //             "orderIndex": orderIndex[i],
    //         };
    //         _list.push(obj);
    //     }
    //     alert(_list);
    //     console.log(_list);
    //     //弹出loading
    //     var index = top.layer.msg('数据提交中，请稍候', {icon: 16, time: false, shade: 0.8});
    //     $.ajax({
    //         url: $.cookie("tempUrl") + "admaterial/batch_add_admaterial.do?token=" + $.cookie("token"),
    //         type: "POST",
    //         datatype: "application/json",
    //         contentType: "application/json;charset=utf-8",
    //         data: JSON.stringify(_list),
    //         traditional: true,//这里设置为true
    //         success: function (result) {
    //             if (result.httpStatus == 200) {
    //                 setTimeout(function () {
    //                     top.layer.close(index);
    //                     top.layer.msg("设置成功！");
    //                     layer.closeAll("iframe");
    //                     //刷新父页面
    //                     parent.location.reload();
    //                 }, 2000);
    //             } else {
    //                 layer.alert(result.exception, {icon: 7, anim: 6});
    //             }
    //         },
    //         error: function (e) {
    //             alert("error")
    //         }
    //     });
    //     return false;
    // });
    /////////////////////////////////////////////////////////////////////////
    //点击添加到广告素材车按钮
    $("#setAd").click(function (e) {
        e.preventDefault();
        var checkStatus = table.checkStatus('userListTable'),
            data = checkStatus.data,
            newsId = [];
        if (data.length > 0) {
            for (var i in data) {
                newsId.push(data[i].id);
            }
            $.ajax({
                url: $.cookie("tempUrl") + "material/get_list_ids.do?token=" + $.cookie("token") + "&ids=" + newsId,
                type: "POST",
                success: function (result) {
                    $("#temp").attr("hidden", "hidden");
                    layer.msg("成功添加到广告素材车");
                    $.each(result.content,
                        function (index, item) {
                            materialId[index] = item.id + "";
                            musicPath[index] = "";
                            if (item.type == "视频") {
                                $(".main").append($('<hr><div class=""><ul class="list-group"><li class="list-group-item borderNone">类型：' + item.type + '</li>'))
                                    .append($('<li class="list-group-item borderNone">ID：' + item.id + '</li>'))
                                    .append($('<li class="list-group-item borderNone">文件名：' + item.name + '</li>'))
                                    .append($('<li class="list-group-item borderNone">地址：' + item.path + '</li>'))
                                    .append($('<li class="list-group-item borderNone">间隔：<input class="loadStep" type="number" value="1" style="width: 50px">秒 <input class="displayTime" type="hidden" value="0" style="width: 50px"> 顺序：<input class="orderIndex" type="number" value="" style="width: 50px"></li>'))
                                    .append($('</ul></div>'));
                            } else {
                                $(".main").append($('<hr><div class=""><ul class="list-group"><li class="list-group-item borderNone">类型：' + item.type + '</li>'))
                                    .append($('<li class="list-group-item borderNone">ID：' + item.id + '</li>'))
                                    .append($('<li class="list-group-item borderNone">文件名：' + item.name + '</li>'))
                                    .append($('<li class="list-group-item borderNone">地址：' + item.path + '</li>'))
                                    .append($('<li class="list-group-item borderNone">间隔：<input class="loadStep" type="number" value="1" style="width: 50px">秒 显示：<input class="displayTime" type="number" value="0" style="width: 50px">秒 顺序：<input class="orderIndex" type="number" value="" style="width: 50px"></li>'))
                                    .append($('</ul></div>'));
                            }
                        });
                }
            });
        } else {
            layer.msg("请选择素材");
        }
    });

    //点击确认添加按钮
    form.on("submit(addGroup)", function (data) {
        //弹出loading
        var index = top.layer.msg('数据提交中，请稍候', {icon: 16, time: false, shade: 0.8});
        $.ajax({
            url: $.cookie("tempUrl") + "ad/add_ad.do?token=" + $.cookie("token"),
            type: "POST",
            datatype: "application/json",
            contentType: "application/json;charset=utf-8",
            data: JSON.stringify({
                name: $(".adName").val(),
                groupid: $("#advertisingGroup").val()
            }),
            success: function (result) {
                if (result.httpStatus == 200) {
                    var tempAdId = result.data.ad.id;
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                    $.each($('.loadStep'), function (index, element) {
                        loadStep[index] = $(this).val();
                    });
                    $.each($('.displayTime'), function (index, element) {
                        displayTime[index] = $(this).val();
                    });
                    $.each($('.orderIndex'), function (index, element) {
                        orderIndex[index] = $(this).val();
                    });
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                    for (var i = 0; i < materialId.length; i++) {
                        var obj = {
                            "adId": tempAdId,
                            "displayTime": displayTime[i],
                            "loadStep": loadStep[i],
                            "materialId": materialId[i],
                            "musicPath": musicPath[i],
                            "orderIndex": orderIndex[i],
                        };
                        _list.push(obj);
                    }
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                    $.ajax({
                        url: $.cookie("tempUrl") + "admaterial/batch_add_admaterial.do?token=" + $.cookie("token"),
                        type: "POST",
                        datatype: "application/json",
                        contentType: "application/json;charset=utf-8",
                        data: JSON.stringify(_list),
                        traditional: true,//这里设置为true
                        success: function (result) {
                            if (result.httpStatus == 200) {
                                top.layer.close(index);
                                top.layer.msg("设置成功！");
                                layer.closeAll("iframe");
                                //刷新父页面
                                parent.location.reload();
                            } else {
                                layer.alert(result.exception, {icon: 7, anim: 6});
                            }
                        },
                        error: function (e) {
                            layer.alert("error，不能输入小数", {icon: 7, anim: 6});
                        }
                    });
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                } else {
                    layer.alert(result.exception, {icon: 7, anim: 6});
                }
            }
        });
        return false;
    });
});