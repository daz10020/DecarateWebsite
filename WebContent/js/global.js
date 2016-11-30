/**
 * Created by DZ on 2016/11/30.
 */
function childleft(urlId,title,breadcrumb,leftNavHeader,rightHeader,leftnavhtml,metAsideList) {
    var head = $('head');
    if (head.find('link').length < 6) {
        head.find('link:gt(2)').remove();
        head.append('<link rel="stylesheet" type="text/css" href="js/bootstrap/css/bootstrap.css"><link rel="stylesheet" type="text/css" href="css/child-router.css">')
    }
    // 发出ajax请求得到对应信息
    $.getJSON('json/child.txt', function (json, textStatus) {
        $.each(json,function (index, el) {
            if (el.id == urlId) {
                //子页标题
                title.find('h2').text(el.name);
                //导航路径
                breadcrumb.append('<li><a ui-sref="child({id:' + urlId + '})">' + el.name + '</a></li>');
                //左侧侧边栏标题
                leftNavHeader.text(el.name);
                //右侧区域标题
                rightHeader.text(el.name);
                //循环添加左侧侧边栏内容
                $.each(el.child, function (index, val) {
                    leftnavhtml += '<li class="col-sm-12 col-xs-6" class-type="' + index + '"><a ui-sref="child({id:' + urlId + '})" href="javascript:;">' + val + '</a></li>';
                });
                metAsideList.html(leftnavhtml);
            }
        });
    })
    .error(function () {
        alert('网络连接错误c..');
    });
}

// 生成各不相等的随机数
;function makeRandom(num, count) {
    var ranflag = 0;
    var ranArr = [];
    var againflag = 1;
    while (ranflag < num) {
        var r = parseInt((count) * Math.random());
        for (var i = 0; i < ranArr.length; i++) {
            if (r == ranArr[i]) {
                againflag = 0;
                break;
            }
            if (i == ranArr.length - 1) {
                againflag = 1;
            }
        }
        if (againflag) {
            ranArr[ranflag] = r;
            ranflag++;
        }
    }
    return ranArr;
}

// dom对象函数
;function $id(id) {
    return document.getElementById(id);
}

;function $tag(el, tagname) {

    return el.getElementsByTagName(tagname);
}
//左侧导航点击
function leftClick(urlId,leftNavHeader,breadcrumb,metAsideList,rightHeader,map) {
    metAsideList.on('click', 'li', function (event) {
        //重复点击相当于点击左侧标题

        if ($(this).hasClass('active')) {
            leftNavHeader.click();
            return
        }
        removeFilter(metAsideList)
        $(this).toggleClass('active');

        //单选开关事件
        var text = $(this).text();
        breadcrumb.find('li:gt(1)').remove();
        breadcrumb.append('<li style="display: none;"><a ui-sref="child({id:' + urlId + '})">' + text + '</a></li>');
        breadcrumb.find('li:gt(1)').fadeIn('slow');
        rightHeader.text(text);
    });
    leftNavHeader.click(function (event) {
        breadcrumb.find('li:gt(1)').remove();
        rightHeader.text($(this).text());
        removeFilter(metAsideList);
    })
}
//清理已选中条件
function removeFilter(metAsideList) {
    metAsideList.find('li').each(function (index, el) {
        if ($(el).hasClass('active')) {
            $(el).removeClass('active');
        }
    });
}