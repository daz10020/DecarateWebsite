//分类控制器
var childApp = angular.module('childApp', [])
    .controller('childCtrl', ['$scope', '$stateParams', '$rootScope', function ($scope, $stateParams, $rootScope) {
        $rootScope.pageIndex = $stateParams.id;

        var urlId = $stateParams.id; // 获得参数
        var container = $('.container'); // 内容区
        var fixBtnGroup = $('.fixBtnGroup');
        var title = $('.jumbotron .container'); // 标题栏
        var breadcrumb = title.find('ol'); // 标题导航路径
        var leftNavHeader = $('.aside-header'); // 侧边导航条
        var rightHeader = $('.pull-right .page-header'); // 右侧内容标题
        var leftnavhtml = ''; // 动态添加侧边导航内容
        var metAsideList = $('.met_aside_list');

        childleft(urlId, title, breadcrumb, leftNavHeader, rightHeader, leftnavhtml, metAsideList);

        // 换一批点击事件
        $('.rechange').click(function (event) {
            // 咨询对象
            $.getJSON('json/news.txt', function (json, textStatus) {

                // 最新资讯
                $('.post_item').empty();
                var newshtml = '';
                // 产生4位不相等的随机数
                var romarr = makeRandom(4, json.length);
                // 遍历json对象
                $.each(json, function (index, el) {
                    // 遍历随机数
                    $.each(romarr, function (i, val) {

                        if (index == romarr[i])
                            newshtml += '<li>' + el.newsTime + '<a href="javascript:;">' + el.newsTitle + '</a></li>';
                    });
                });
                $('.post_item').html(newshtml);
            })
                .error(function () {
                    layer.msg('网络连接错误！');
                });
        });
        $('.rechange').click();
        // 右侧显示列表
        var rightList = container.find('.right-list');
        //	搜索框提示
        var search = $('.search input').eq(0);
        // 分页页码
        var pageList = $('.page-list');
        var filterCon = 1;//初始筛选条件
        var pageNum = 1;//初始页数
        var pageCount;//总页数
        var recordCount = 0;//总记录数
        var jsonarr = [0, 'product', 'product', 'news']
        var oldStr = 0;
        // 筛选符合条件的图片
        function addimgfilter() {
            var classifyhtml = '';
            recordCount = 0;
            $.getJSON('json/' + jsonarr[urlId] + '.txt', function (json, textStatus) {
                $.each(json, function (index, el) {
                    if (eval(filterCon)) {
                        // 总信息数累加
                        recordCount++;
                        if (urlId == 1) {
                            // 分页处理
                            if (recordCount > 12 * (pageNum - 1) && recordCount <= 12 * pageNum) {
                                classifyhtml += '<li class="col-md-4 col-xs-6" img-type="' + el.classType + '">';
                                classifyhtml += '<div class="img-box"><img src="images/' + el.imgname + '.jpg" alt=""></div>';
                                classifyhtml += '<a href="javascript:;">' + el.imgtypename + '</a></li>';
                            }
                        } else if (urlId == 3) {
                            // 分页处理
                            if (recordCount > 6 * (pageNum - 1) && recordCount <= 6 * pageNum) {
                                classifyhtml += '<li class="col-xs-12" news-type="1">';
                                classifyhtml += '	<div class="panel panel-default">';
                                classifyhtml += '		<div class="panel-heading">' + el.newsTitle + '</div>';
                                classifyhtml += '		<div class="panel-body">' + el.newsCon + '</div>';
                                classifyhtml += '		<div class="panel-footer">' + el.newsTime;
                                classifyhtml += '<span>admin</span><span class="icon icon-eye text-right"></span>' + el.newsNum;
                                classifyhtml += '		</div>';
                                classifyhtml += '	</div>';
                                classifyhtml += '</li>';
                            }
                        }
                    }
                });
                // 添加节点
                rightList.html(classifyhtml);
                if (urlId == 1) {
                    var ulHeight = Math.ceil(rightList.find('li').length / 3);
                    if (ulHeight > 4)
                        ulHeight = 4;
                    rightList.css('height', ulHeight * 205);
                    if ($(window).width() > 1190) {
                        rightList.find('li').each(function (index, el) {
                            $(el).css({
                                position: 'absolute',
                                top: Math.floor(index / 3) * 205,
                                left: (index % 3) * 33.33 + '%'
                            });
                        });
                    }
                } else if (urlId == 3) {
                    var str = search.val();
                    rightList.find('.panel-heading').each(function (index, el) {
                        for (var i = 0; i < str.length; i++) {
                            var r = eval('/(' + str.charAt(i) + ')/g');
                            $(el).html($(el).html().replace(r, '<span style="background:#aaa;color:#fff">$1</span>'));
                        }
                    })
                    str = '';
                }
                oldStr = filterCon;
                // 判断是否显示分页按钮
                if (pageNum == 1){
                    filteredCount();
                }
                pagenumHl();
            })
                .error(function () {
                    alert('网络连接错误');
                });
        }

        // 页码高亮函数
        function pagenumHl() {
            $.each(pageList.find('li'), function (index, el) {
                if (pageNum + 1 == index) {
                    $(el).addClass(' active');
                } else {
                    $(el).removeClass(' active');
                }
            });
        }

        // 过滤后的页数
        function filteredCount() {
            pageCount = 0;
            pageList.find('a.page-num').parent('li').remove();

            while (recordCount > 12 * pageCount) {
                pageList.find('li').eq(pageCount + 1).after('<li><a href="javascript:;" class="page-num">' + (pageCount + 1) + '</a></li>');
                pageCount++;
            }
            ;

            if (pageCount > 1) {
                pageList.show();
            } else {
                pageList.hide();
            }
        }

        addimgfilter();

//	筛选提示信息
        function searchStart() {
            var str = search.val();
            fixBtnGroup.removeClass('fixed');

            pageNum = 1;
            if (str == '') {
                filterCon = 1;
            } else {
                if (urlId == 3) {
                    filterCon = '0';
                } else if (urlId == 1) {
                    filterCon = '1';
                }
                for (var i = 0; i < str.length; i++) {
                    if (urlId == 3) {
                        filterCon += ' || el.newsTitle.indexOf("' + str.charAt(i) + '") + 1';
                    } else if (urlId == 1) {
                        filterCon += ' && el.imgtypename.indexOf("' + str.charAt(i) + '") + 1';
                    }
                }
            }
            if (oldStr == filterCon)
                return
            rightList
                .slideUp('slow', function () {
                    addimgfilter();
                    btnShowHid();
                })
                .slideDown('slow');
            removeFilter(metAsideList);
        }

        var searchTimeId;
        //停止输入0.5s进行筛选
        search.keyup(function (event) {
            searchTimeId = setTimeout(searchStart, 500);
        });
        //连续输入
        search.keydown(function () {
            clearTimeout(searchTimeId);
        });
        (function () {
            //筛选执行中标志位
            var addAnimateFlag = 0;
            // 左侧侧边栏
            metAsideList.on('click', 'li', function (event) {
                fixBtnGroup.removeClass('fixed');
                if (addAnimateFlag)
                    return
                var classType = $(this).attr('class-type');
                filterCon = 'el.classType == ' + classType;
                pageNum = 1;
                //清空搜索框
                search.val('');
                //重复点击相当于点击左侧标题
                if ($(this).hasClass('active')) {
                    leftNavHeader.click();
                    return
                }
                //清空已选中条件
                removeFilter(metAsideList);

                //单选开关事件
                $(this).toggleClass('active');

                rightList
                    .slideUp('slow', function () {
                        rightList.css('opacity', 0);
                        addimgfilter();
                        rightList.css('opacity', 1);
                    })
                    .slideDown('slow', function () {
                        addAnimateFlag = 0;
                    });

                var text = $(this).text();
                breadcrumb.find('li:gt(1)').remove();
                breadcrumb.append('<li style="display: none;"><a href="child({id:' + urlId + '})">' + text + '</a></li>');
                breadcrumb.find('li:gt(1)').fadeIn('slow');
                rightHeader.text(text);
            });

            // 左侧导航标题点击
            leftNavHeader.click(function (event) {
                fixBtnGroup.removeClass('fixed');

                filterCon = 1;
                pageNum = 1;
                //清空搜索框
                search.val('');
                addAnimateFlag = 1;
                rightList
                    .slideUp('slow', function () {
                        rightList.css('opacity', 0);
                        addimgfilter();
                        rightList.css('opacity', 1);
                    })
                    .slideDown('slow', function () {
                        addAnimateFlag = 0;
                    });
                removeFilter(metAsideList);
                breadcrumb.find('li:gt(1)').remove();
                rightHeader.text($(this).text());
            });
        })();

        var firstBtn = $('.first-btn');
        var prevBtn = $('.prev-btn');
        var nextBtn = $('.next-btn');
        var lastBtn = $('.last-btn');
        // 首尾页按钮动态显示隐藏
        function btnShowHid() {

            firstBtn.show();
            prevBtn.show();
            nextBtn.show();
            lastBtn.show();
            if (pageNum == 1) {
                firstBtn.hide();
                prevBtn.hide();
            } else if (pageNum == pageCount) {
                nextBtn.hide();
                lastBtn.hide();
            }
        }

        btnShowHid();
        //点击翻页后滚动条回到顶部
        $('.pager').click(function (event) {

            $('html').animate({scrollTop: $('.right-list').parent('.pull-right').offset().top - 59}, 1000, 'swing', function () {

                addimgfilter();
                btnShowHid();
            });

        })
        // 翻页按钮事件
        pageList.on('click', 'a.page-num', function (event) {
            pageNum = $(this).text();
        });
        // 上一页
        prevBtn.click(function (event) {
            pageNum--;
        });
        // 下一页
        nextBtn.click(function (event) {
            pageNum++;
        });
        // 首页
        firstBtn.click(function (event) {
            pageNum = 1;
        });
        // 尾页
        lastBtn.click(function (event) {
            pageNum = pageCount;
        });
        if (urlId == 3) {
            $('.child').DDSort({
                target: 'li',
                floatStyle: {
                    'border': '1px solid #ccc',
                    'background-color': '#fff'
                }
            });
        }
        if ($(window).width() > 1190 && urlId == 1) {
            var initNum = 0;

            var size = 1;
            var imgBox = $('.img-box');
            //top偏移量
            function fixTop(index) {
                if (index >= size * size)
                    index -= (size * size);
                return Math.floor(index / size) * (450 / size);
            }

            //left偏移量
            function fixLeft(index) {
                return index % size * (100 / size) + '%';
            }

            //宽度
            function fixW(index) {
                if (index >= size * size)
                    index -= (size * size);
                return '-' + index % size * (825 / size) + 'px';
            }

            //高度
            function fixH(index) {
                if (index >= size * size)
                    index -= (size * size);
                return '-' + Math.floor(index / size) * (450 / size) + 'px';
            }

            //点击聚合分散
            rightList.on('click', 'li', function () {
                //如果已经聚合将其还原
                if ($(this).hasClass('fixed')) {
                    filteredCount();
                    rightList.find('li').each(function (index, el) {

                        $(el).removeClass('fixed');
                        //隐藏翻页按钮
                        fixBtnGroup.removeClass('fixed');
                        //重置样式
                        $(el).attr('style', '');
                        $(el).css({
                            position: 'absolute',
                            top: Math.floor(index / 3) * 205,
                            left: (index % 3) * 33.33 + '%'
                        });
                    })
                } else {
                    //将滚动条滚到最合适位置
                    window.scrollTo(0, 280);

                    pageList.hide();
                    var bgImg = $(this).find('img').eq(0).attr('src');
                    var rightCount = rightList.find('li').length;
                    size = 1;
                    while (rightCount >= (size + 1) * (size + 1)) {
                        size++;
                    }

                    fixBtnGroup.addClass('fixed');
                    rightList.find('li').each(function (index, el) {
                        if (bgImg == rightList.find('img').eq(index).attr('src')) {

                            initNum = index;
                        }
                        $(el).addClass('fixed');
                        $(el).css({
                            'top': fixTop(index),
                            'left': fixLeft(index),
                            'width': 822 / size,
                            'height': 447 / size,
                            'background': 'url(' + bgImg + ')',
                            'background-size': '825px 450px'
                        });

                        $(el).css({
                            'backgroundPosition': fixW(index) + ' ' + fixH(index)
                        })
                    });

                }
            })
            //    图片翻页
            function fixImgMove(num) {
                window.scrollTo(0, 280);

                var sizeArr = makeRandom(size * size, size * size);
                if ((initNum + num) < 0) {
                    initNum = rightList.find('li').length - 1;
                } else if ((initNum + num) >= rightList.find('li').length) {
                    initNum = 0;
                } else {
                    initNum += num;
                }
                var imgName = rightList.find('img').eq(initNum).attr('src');
                rightList.find('li').each(function (index, el) {
                    if (index >= size * size) {
                        index -= size * size;
                    }
                    setTimeout(function () {
                        $(el).css({
                            'background': 'url(' + imgName + ')',
                            'background-size': '825px 450px',
                            'backgroundPosition': fixW(index) + ' ' + fixH(index)
                        })
                    }, 100 * sizeArr[index]);

                })
            }

            $('.prevBtn').click(function () {
                fixImgMove(-1);
            });
            $('.nextBtn').click(function () {
                fixImgMove(1);
            })
        }

    }]);