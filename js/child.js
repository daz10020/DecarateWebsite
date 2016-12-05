//���������
var childApp = angular.module('childApp', [])
    .controller('childCtrl', ['$scope', '$stateParams', '$rootScope', function ($scope, $stateParams, $rootScope) {
        $rootScope.pageIndex = $stateParams.id;

        var urlId = $stateParams.id; // ��ò���
        var container = $('.container'); // ������
        var fixBtnGroup = $('.fixBtnGroup');
        var title = $('.jumbotron .container'); // ������
        var breadcrumb = title.find('ol'); // ���⵼��·��
        var leftNavHeader = $('.aside-header'); // ��ߵ�����
        var rightHeader = $('.pull-right .page-header'); // �Ҳ����ݱ���
        var leftnavhtml = ''; // ��̬��Ӳ�ߵ�������
        var metAsideList = $('.met_aside_list');

        childleft(urlId, title, breadcrumb, leftNavHeader, rightHeader, leftnavhtml, metAsideList);

        // ��һ������¼�
        $('.rechange').click(function (event) {
            // ��ѯ����
            $.getJSON('json/news.txt', function (json, textStatus) {

                // ������Ѷ
                $('.post_item').empty();
                var newshtml = '';
                // ����4λ����ȵ������
                var romarr = makeRandom(4, json.length);
                // ����json����
                $.each(json, function (index, el) {
                    // ���������
                    $.each(romarr, function (i, val) {

                        if (index == romarr[i])
                            newshtml += '<li>' + el.newsTime + '<a href="javascript:;">' + el.newsTitle + '</a></li>';
                    });
                });
                $('.post_item').html(newshtml);
            })
                .error(function () {
                    layer.msg('�������Ӵ���');
                });
        });
        $('.rechange').click();
        // �Ҳ���ʾ�б�
        var rightList = container.find('.right-list');
        //	��������ʾ
        var search = $('.search input').eq(0);
        // ��ҳҳ��
        var pageList = $('.page-list');
        var filterCon = 1;//��ʼɸѡ����
        var pageNum = 1;//��ʼҳ��
        var pageCount;//��ҳ��
        var recordCount = 0;//�ܼ�¼��
        var jsonarr = [0, 'product', 'product', 'news']
        var oldStr = 0;
        // ɸѡ����������ͼƬ
        function addimgfilter() {
            var classifyhtml = '';
            recordCount = 0;
            $.getJSON('json/' + jsonarr[urlId] + '.txt', function (json, textStatus) {
                $.each(json, function (index, el) {
                    if (eval(filterCon)) {
                        // ����Ϣ���ۼ�
                        recordCount++;
                        if (urlId == 1) {
                            // ��ҳ����
                            if (recordCount > 12 * (pageNum - 1) && recordCount <= 12 * pageNum) {
                                classifyhtml += '<li class="col-md-4 col-xs-6" img-type="' + el.classType + '">';
                                classifyhtml += '<div class="img-box"><img src="images/' + el.imgname + '.jpg" alt=""></div>';
                                classifyhtml += '<a href="javascript:;">' + el.imgtypename + '</a></li>';
                            }
                        } else if (urlId == 3) {
                            // ��ҳ����
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
                // ��ӽڵ�
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
                // �ж��Ƿ���ʾ��ҳ��ť
                if (pageNum == 1){
                    filteredCount();
                }
                pagenumHl();
            })
                .error(function () {
                    alert('�������Ӵ���');
                });
        }

        // ҳ���������
        function pagenumHl() {
            $.each(pageList.find('li'), function (index, el) {
                if (pageNum + 1 == index) {
                    $(el).addClass(' active');
                } else {
                    $(el).removeClass(' active');
                }
            });
        }

        // ���˺��ҳ��
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

//	ɸѡ��ʾ��Ϣ
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
        //ֹͣ����0.5s����ɸѡ
        search.keyup(function (event) {
            searchTimeId = setTimeout(searchStart, 500);
        });
        //��������
        search.keydown(function () {
            clearTimeout(searchTimeId);
        });
        (function () {
            //ɸѡִ���б�־λ
            var addAnimateFlag = 0;
            // �������
            metAsideList.on('click', 'li', function (event) {
                fixBtnGroup.removeClass('fixed');
                if (addAnimateFlag)
                    return
                var classType = $(this).attr('class-type');
                filterCon = 'el.classType == ' + classType;
                pageNum = 1;
                //���������
                search.val('');
                //�ظ�����൱�ڵ��������
                if ($(this).hasClass('active')) {
                    leftNavHeader.click();
                    return
                }
                //�����ѡ������
                removeFilter(metAsideList);

                //��ѡ�����¼�
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

            // ��ർ��������
            leftNavHeader.click(function (event) {
                fixBtnGroup.removeClass('fixed');

                filterCon = 1;
                pageNum = 1;
                //���������
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
        // ��βҳ��ť��̬��ʾ����
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
        //�����ҳ��������ص�����
        $('.pager').click(function (event) {

            $('html').animate({scrollTop: $('.right-list').parent('.pull-right').offset().top - 59}, 1000, 'swing', function () {

                addimgfilter();
                btnShowHid();
            });

        })
        // ��ҳ��ť�¼�
        pageList.on('click', 'a.page-num', function (event) {
            pageNum = $(this).text();
        });
        // ��һҳ
        prevBtn.click(function (event) {
            pageNum--;
        });
        // ��һҳ
        nextBtn.click(function (event) {
            pageNum++;
        });
        // ��ҳ
        firstBtn.click(function (event) {
            pageNum = 1;
        });
        // βҳ
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
            //topƫ����
            function fixTop(index) {
                if (index >= size * size)
                    index -= (size * size);
                return Math.floor(index / size) * (450 / size);
            }

            //leftƫ����
            function fixLeft(index) {
                return index % size * (100 / size) + '%';
            }

            //���
            function fixW(index) {
                if (index >= size * size)
                    index -= (size * size);
                return '-' + index % size * (825 / size) + 'px';
            }

            //�߶�
            function fixH(index) {
                if (index >= size * size)
                    index -= (size * size);
                return '-' + Math.floor(index / size) * (450 / size) + 'px';
            }

            //����ۺϷ�ɢ
            rightList.on('click', 'li', function () {
                //����Ѿ��ۺϽ��仹ԭ
                if ($(this).hasClass('fixed')) {
                    filteredCount();
                    rightList.find('li').each(function (index, el) {

                        $(el).removeClass('fixed');
                        //���ط�ҳ��ť
                        fixBtnGroup.removeClass('fixed');
                        //������ʽ
                        $(el).attr('style', '');
                        $(el).css({
                            position: 'absolute',
                            top: Math.floor(index / 3) * 205,
                            left: (index % 3) * 33.33 + '%'
                        });
                    })
                } else {
                    //�����������������λ��
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
            //    ͼƬ��ҳ
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