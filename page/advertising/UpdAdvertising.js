layui.use(['form', 'layer'], function () {
    var form = layui.form,
        layer = parent.layer === undefined ? layui.layer : top.layer,
        $ = layui.jquery;

    //获取广告分组
    $.ajax({
        url: $.cookie("tempUrl") + "adgroup/get_group.do?token=" + $.cookie("token"),
        type: "POST",
        success: function (result) {
            $.each(result.data,
                function (index, item) {
                    if ($(".adName").attr("data-groupid") == item.id) {
                        $("#advertisingGroup").append($('<option value=' + item.id + ' selected>' + item.name + '</option>'));
                    } else {
                        $("#advertisingGroup").append($('<option value=' + item.id + '>' + item.name + '</option>'));
                    }
                });
            form.render();
        }
    });
////////////////////////////////////////////////////////////////////////////////////////////
    var adId = new Array();
    var displayTime = new Array();
    var loadStep = new Array();
    var materialId = new Array();
    var musicPath = new Array();
    var orderIndex = new Array();
    var _list2 = new Array();
    //更新
    form.on("submit(addGroup)", function (data) {
        //弹出loading
        var index = top.layer.msg('数据提交中，请稍候', {icon: 16, time: false, shade: 0.8});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        $.each($('.adId'), function (index, element) {
            adId[index] = $(this).val();
            musicPath[index] = "";
        });
        $.each($('.displayTime'), function (index, element) {
            displayTime[index] = $(this).val();
        });
        $.each($('.loadStep'), function (index, element) {
            loadStep[index] = $(this).val();
        });
        $.each($('.materialId'), function (index, element) {
            materialId[index] = $(this).val();
        });
        $.each($('.orderIndex'), function (index, element) {
            orderIndex[index] = $(this).val();
        });
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        for (var i = 0; i < materialId.length; i++) {
            var obj = {
                "adId": adId[index],
                "displayTime": displayTime[i],
                "loadStep": loadStep[i],
                "materialId": materialId[i],
                "musicPath": musicPath[i],
                "orderIndex": orderIndex[i],
            };
            _list2.push(obj);
        }
        console.log(_list2);
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        $.ajax({
            url: $.cookie("tempUrl") + "ad/update_ad.do?token=" + $.cookie("token"),
            type: "post",
            datatype: "application/json",
            contentType: "application/json;charset=utf-8",
            data: JSON.stringify({
                adData: _list2,
                groupid: $("#advertisingGroup").val(),
                id: $(".adName").attr("data-id"),
                name: $(".adName").val(),
            }),
            async: false, // 使用同步操作
            timeout: 50000, //超时时间：50秒
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
            }
            ,
            error: function (result) {
                layer.alert("error，不能输入小数", {icon: 7, anim: 6});
            }
        });
    });


    // form.on("submit(addGroup)", function (data) {
    //     //弹出loading
    //     var index = top.layer.msg('数据提交中，请稍候', {icon: 16, time: false, shade: 0.8});
    //     $.ajax({
    //         url: $.cookie("tempUrl") + "ad/update_ad_name.do?token=" + $.cookie("token"),
    //         type: "POST",
    //         datatype: "application/json",
    //         contentType: "application/json;charset=utf-8",
    //         data: JSON.stringify({
    //             id: $(".adName").attr("data-id"),
    //             name: $(".adName").val()
    //         }),
    //         success: function (result) {
    //             if (result.httpStatus == 200) {
    //                 setTimeout(function () {
    //                     top.layer.close(index);
    //                     top.layer.msg("更新成功！");
    //                     layer.closeAll("iframe");
    //                     //刷新父页面
    //                     parent.location.reload();
    //                 }, 2000);
    //             } else {
    //                 layer.alert(result.exception, {icon: 7, anim: 6});
    //             }
    //         }
    //     });
    //     return false;
    // });
});