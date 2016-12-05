//首页控制器
var indexApp = angular.module('indexApp',[])
.controller('indexCtrl', ['$scope', '$rootScope', '$stateParams', function ($scope, $rootScope, $stateParams) {
    $rootScope.pageIndex = 0;
    window.scrollTo(0, 0);

    var head = $('head');
    if (head.find('link').length != 4) {
        head.find('link:gt(2)').remove();
        head.append('<link rel="stylesheet" type="text/css" href="css/index.css">');
    }
    angular.element(document).ready(function () {
        // dom对象函数
        function $id(id) {
            return document.getElementById(id);
        }

        function $tag(el, tagname) {

            return el.getElementsByTagName(tagname);
        }


        var bannerList = $id('banner-list'),// banner图片ul
            bannerli = $tag(bannerList, 'li'),
            btnList = $id('banner-btn'),// banner切换按钮ul
            bannerBtnli = $tag(btnList, 'li'),
            pnbtng = $id('pnbtn-g'),// banner前后按钮ul
            pnbtn = $tag(pnbtng, 'li'),
            bannerWrap = $id('banner-wrapper'),// banner外部盒子
            clientW;// 视口宽度
        var clientH = document.documentElement.clientHeight;//视口宽度
        var jiyi = 2;// 记忆顺序

        // 翻页按钮
        var pdiv = $id('prevdiv'),
            ndiv = $id('nextdiv'),
            fybtn = $id('fybtn');

        // banner前一页按钮
        pdiv.onclick = function () {
            clearInterval(bannerTimeId);
            clearTimeout(pnTimeId);
            zidong(ots(jiyi - 1));
        }
        // banner后一页按钮
        ndiv.onclick = function () {
            clearInterval(bannerTimeId);
            clearTimeout(pnTimeId);
            zidong(ots(jiyi + 1));
        }

        // banner切换按钮
        for (var k = 0; k < 3; k++) {
            (function (btnNum) {
                bannerBtnli[btnNum].onclick = function () {
                    clearInterval(bannerTimeId);
                    zidong(btnNum);
                }
            })(k);
        }
        // 轮播顺序函数
        function ots(a) {
            if (a < 0)
                a = 2;
            if (a > 2)
                a = 0;
            return a;
        }

        // banner轮播运动函数
        function banner(num) {
            clientW = document.documentElement.clientWidth;//视口宽度
            if (clientW > 1680)
                clientW = 1680;
            // 新建外部背景盒子
            var divsum = document.createElement('div');
            divsum.className = 'divsum';
            // 两侧多余部分宽度
            var bannerleft = (1680 - clientW) / 2;
            // 产生小切换模块数量
            var numArr = [4, 8, 10];
            // 小模块高宽
            var divw = clientW / numArr[num];
            var divH = clientH * 0.8 / numArr[num];
            // 记忆顺序 背景图
            ots(jiyi);
            divsum.style.background = 'url(images/banner' + jiyi + '.jpg) no-repeat center/auto ' + clientH * 0.8 + 'px';

            pdiv.style.background = 'url(images/banner' + ots(num - 1) + '.jpg) round';
            ndiv.style.background = 'url(images/banner' + ots(jiyi - 1) + '.jpg) round';
            // 缩略图显示及延时
            function pnbtnAct() {
                pnbtn[0].className += ' active';
                pnbtn[1].className += ' active';
            }

            setTimeout(pnbtnAct, 500);
            // 缩略图隐藏
            function pnbtnDau() {
                pnbtn[0].className = 'pnbtn';
                pnbtn[1].className = 'pnbtn';
            }

            // 小模块放大
            function kuoda() {
                var cutdivli = $tag(divsum, 'div');
                for (var i = 0; i < cutdivli.length; i++) {
                    cutdivli[i].className = 'cutdiv';
                }
            }

            pnTimeId = setTimeout(pnbtnDau, 2500);
            // 循环创建i*j个小div实现背景图替换效果
            for (var j = 0; j < numArr[num]; j++) {
                for (var i = 0; i < numArr[num]; i++) {
                    var bgdiv = document.createElement('div');
                    bgdiv.style.left = 100 / numArr[num] * i + '%';
                    bgdiv.style.top = 100 / numArr[num] * j + '%';
                    bgdiv.style.background = 'url(images/banner' + num + '.jpg) -' + (divw * i + bannerleft) + 'px ' + (-(divH * j)) + 'px/auto ' + clientH * 0.8 + 'px';
                    divsum.appendChild(bgdiv);
                }
            }

            bannerli[num].appendChild(divsum);
            // 记录前一张图
            jiyi = num;
            // 小div扩大函数及延时
            setTimeout(kuoda, 10);

            // 便利清空高亮
            for (var i = 0; i < 3; i++) {
                bannerli[i].className = '';
                bannerBtnli[i].className = '';
                bannerli[i].style.background = '';
            }

            bannerli[num].className += ' hl active';
            bannerBtnli[num].className += 'active';
            // 替换背景图
            function bannerbg() {
                bannerli[num].style.background = 'url(images/banner' + num + '.jpg) no-repeat center/auto ' + clientH * 0.8 + 'px';
                bannerli[num].removeChild(divsum);
            }

            setTimeout(bannerbg, 3000);
        }

// 自动循环banner图
        var bannerTimeId;
        var pnTimeId;

        function zidong(btnNum) {
            function baZidong() {
                if (btnNum < 2) {
                    btnNum++;
                } else {
                    btnNum = 0;
                }
                banner(btnNum);
            }

            banner(btnNum);
            bannerTimeId = setInterval(baZidong, 3000);
        }

        zidong(0);

        // 导航条
        var nav = $tag(document, 'nav')[0];
        var navbtn = $id('navbtn');
        var navmenu = $tag(nav, 'ul')[0];
        var navli = $tag(nav, 'li');
        var navliarr = [0, 1, 6, 7, 10, 11];
        var navchild = $tag(navmenu, 'ul');


        // 分类轮播按钮
        var flBtnG = $id('fl-pbtn-g'),
            flPbtn = $tag(flBtnG, 'li')[0],
            flNbtn = $tag(flBtnG, 'li')[1],
            flList = $id('fenlei-list'),
            flwrapper = $id('fenlei-wrapper'),
            flwFlag = 1,
            aboutFlag = 1,
            fybtnflag = 1;
        var about = $id('about');

        // 分类轮播
        flList.innerHTML += flList.innerHTML;
        var fenleiTimeId,
            left,
            newLeft,
            fenleiflag = 0;

        function fenlei(num) {
            // 动画执行中则返回
            if (fenleiflag)
                return;
            var liW = flList.getElementsByTagName('li')[0].clientWidth;
            for (var i = 1; i < 9; i++) {
                if (parseInt(flList.style.left) > -liW * i) {
                    newLeft = -liW * (i - 1 + num);
                    break;
                }
            }
            // 第1张往前滚动直接跳转至第5图
            if (newLeft > -liW) {
                flList.style.left = (-liW * 4) + 'px';
                newLeft = -liW * 3;
            }
            // 第6张往后滚动直接跳转至第1图
            if (newLeft < -5 * liW) {
                flList.style.left = -liW + 'px';
                newLeft = -liW * 2;
            }
            // 分类翻页动画
            function fenleiGo() {
                flList.parentNode.style.border = 'none';
                // 动画执行中
                fenleiflag = 1;
                left = parseInt(flList.style.left);

                if (num + 1 && left <= newLeft || !(num + 1) && left >= newLeft) {
                    // 避免误差
                    flList.style.left = newLeft + 'px';
                    // 清理定时器
                    clearInterval(fenleiTimeId);
                    // 动画执行标志清空
                    fenleiflag = 0;
                } else {
                    // 动画执行程序
                    flList.style.left = (left - 5 * num) + 'px';
                }
            }

            // 建立定时器
            fenleiTimeId = setInterval(fenleiGo, 10);
        }
        if (clientW > 784) {
            // 分类前一页按钮
            flPbtn.onclick = function () {
                fenlei(-1);
            }
            // 分类后一页按钮
            flNbtn.onclick = function () {
                fenlei(1);
            }
        }

        var navhlflag = 1;
        navliHl();

        var childflag = 0;// 子页标记
        // 导航高亮函数
        function navliHl() {
            if (childflag)
                return;
            for (var i = 0; i < navliarr.length + 2; i++) {
                // 记录处于第几部分
                if (sTop < 670 * i - 10) {
                    navhlflag = i;
                    break;
                }
            }
            for (var c = 0; c < navliarr.length; c++) {
                navli[navliarr[c]].className = '';
            }
            if (navhlflag > 0) {
                navli[navliarr[navhlflag - 1]].className += ' hl';
            }
        }

        //子页点击高亮
        for (var i = 1; i < navliarr.length; i++) {
            ;
            (function (i) {
                navli[navliarr[i]].onclick = function () {

                    for (var c = 0; c < navliarr.length; c++) {
                        navli[navliarr[c]].className = '';
                    }
                    navli[navliarr[i]].className += ' hl';
                    childflag = 1;
                    nav.className = 'fixed';

                    if (i == 0) {
                        nav.className = '';
                        childflag = 0;
                    }
                }
            })(i);
        }


        var fyflag = 0;// 下次预显示的部分
        var sTop;// 距网页原点的距离
        var gdflag = 0;// 滚动过程中判断标志
        var newsFlag = 0;// 新闻背景开始
        var news = $id('new-wrapper');// 背景差
        var anliWrapper = $id('anli-wrapper');//案例盒子
        var callWrapper = $id('call-wrap');//联系盒子
        function eleHeight (clientH) {
            if (clientW > 787) {
                var eleHeight = clientH - 65;
                news.style.height = eleHeight + 'px';
                about.style.height = eleHeight + 'px';
                bannerWrap.style.height = clientH + 'px';
                flwrapper.style.height = eleHeight + 'px';
                anliWrapper.style.height = eleHeight + 'px';
                callWrapper.style.height = eleHeight + 'px';
            }
        }

        eleHeight(clientH);
        // 滚屏控制
        function gdtmove(index) {
            // 如果正在滚动 不继续执行
            if (gdflag)
                return;
            //获得视口高度
            clientH = document.documentElement.clientHeight;
            if (bannerWrap.style.height != clientH) {
                eleHeight(clientH);
            }
            // 获得滚动条卷去的距离
            sTop = document.documentElement.scrollTop || document.body.scrollTop;
            // 得到当前所处位置
            for (var i = 0; ; i++) {
                if (sTop < (clientH - 70) * i) {
                    fyflag = i + index;
                    break;
                }
            }
            if (clientW > (clientH + 70)) {
                // 回到顶部按钮显示隐藏
                if (fybtnflag) {
                    fybtn.style.opacity = 0.7;
                    fybtnflag = 0;
                }
            }
            if (fyflag <= 1) {
                fybtn.style.opacity = 0;
                fybtnflag = 1;
            }
            // 解锁导航条
            if (fyflag == 1) {
                nav.className = '';
                bannerWrap.className = '';
                navliHl();
            } else if (fyflag > 1) {
                bannerWrap.className = ' fixed';
                nav.className = 'fixed';
            }
            if (fyflag == 4) {
                newsFlag = 1;
            }
            var fyTimeId;
            // pc端执行一滚一屏
            if (clientW > 784 && index && fyflag < 7) {
                gdflag = 1;
                fyTimeId = setInterval(fyani, 10);
                function fyani() {
                    // 向下滚动
                    if (index == 1) {
                        window.scrollTo(0, sTop += 5);

                        if (sTop >= (clientH - 60) * i - 6 || sTop <= 1) {
                            window.scrollTo(0, (clientH - 60) * i);
                            navliHl();
                            clearInterval(fyTimeId);
                            gdflag = 0;
                        }
                        // 向上滚动
                    } else if (index == -1) {

                        window.scrollTo(0, sTop -= 5);

                        if (sTop <= (clientH - 60) * (fyflag - 1) + 5 || sTop < 6) {
                            window.scrollTo(0, (clientH - 60) * (fyflag - 1))
                            navliHl();
                            clearInterval(fyTimeId);
                            gdflag = 0;
                        }
                    }
                }
            }
        }

        gdtmove(0);

        // 滚动监听
        window.onscroll = function (e) {
            if ($rootScope.pageIndex != 0)
                return
            // 分类显示动画
            if (flwFlag && sTop > 475) {
                flList.parentNode.className += ' visible';
                flwFlag = 0;
            } else if (!flwFlag && sTop <= 50) {
                flList.parentNode.className = 'fenlei-window';
                flwFlag = 1;
            }
            // 关于显示动画
            if (aboutFlag && sTop > 2500) {
                about.className += ' active';
                aboutFlag = 0;
            } else if (!aboutFlag && sTop <= 1850) {
                about.className = 'content-wrapper';
                aboutFlag = 1;
            }

            if (newsFlag) {
                // 获得滚动条卷去的距离
                sTop = document.documentElement.scrollTop || document.body.scrollTop;
                news.style.backgroundPosition = 'center ' + (sTop - clientH * 2.3) / 4 + 'px';
            }
        }

        // 回到顶部按钮
        fybtn.onclick = function () {
            // 获得滚动条卷去的距离
            sTop = document.documentElement.scrollTop || document.body.scrollTop;
            gdflag = 1;

            var topTimeId = setInterval(returnTop, 10);

            function returnTop() {
                window.scrollTo(0, sTop -= 20);
                if (sTop <= 0) {
                    clearInterval(topTimeId);
                    navliHl();
                    gdflag = 0;
                    gdtmove(0);
                }
            }
        }

        // 非火狐滚轴事件
        document.onmousewheel = scrollFun;

        // 火狐滚轴事件
        if (document.addEventListener)
            document.addEventListener('DOMMouseScroll', scrollFun);

        /*滚轮事件回调函数*/
        function scrollFun(e) {
            e = e || window.event;
            if (motaiflag || gdflag || $rootScope.pageIndex != 0)
                return;

            // 兼容滚轮的状态值
            var i = e.wheelDelta ? e.wheelDelta : -e.detail;

            if (i >= 0)
                gdtmove(-1);
            else
                gdtmove(1);
        }


        // 手机端导航按钮展开隐藏
        navbtn.onclick = function () {
            if (navbtn.className.indexOf('hl') != -1) {
                navbtn.className = '';
                navmenu.className = '';
            } else {
                navmenu.className += 'active';
                navbtn.className += 'hl active';
            }
        }

        for (var i = 0; i < navli.length; i++) {
            ;
            (function (i) {
                // 每个子导航高亮以及次级导航显示隐藏
                navli[i].ontouchstart = function () {
                    for (var j = 0; j < navli.length; j++) {
                        navli[j].className = '';
                    }
                    navli[i].className += ' active';
                }
            })(i);
        }

        // 模态层
        var dialog = $id('dialog');
        var log = $id('log');
        var logImg = $id('log-img');
        var anliWrap = $id('anli-wrapper');
        var anliImg = $tag(anliWrap, 'img');
        var diaClose = $id('diaClose');
        var motaiflag = 0;

        // 模态层
        dialog.onclick = function () {
            this.style.display = 'none';
            motaiflag = 0;
        }
        // 阻止点击图片事件默认行为
        log.onclick = function (e) {
            e = e || window.event;
            e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true;
        }
        // ESC关闭模态层
        document.onkeyup = function (e) {
            e = e || window.event;
            if (e.keyCode == 27) {
                dialog.style.display = 'none';
                motaiflag = 0;
            }
        }
        // 关闭按钮关闭模态层
        diaClose.onclick = function () {
            dialog.style.display = 'none';
            log.style.display = 'none';
            logImg.style.display = 'none';
            motaiflag = 0;
        }
        // 案例展示图片点击出现模态层
        for (var i = 0; i < anliImg.length; i++) {
            ;
            (function (i) {
                anliImg[i].onclick = function (e) {
                    dialog.style.display = 'block';
                    log.style.display = 'block';
                    logImg.style.display = 'block';
                    logImg.style.background = 'url(images/al' + (i + 1) + '.jpg) no-repeat center';
                    logImg.style.backgroundSize = '100% 100%';
                    motaiflag = 1;
                }
            })(i);
        }
        //鼠标移上放大
        log.onmouseenter = function () {

            logImg.style.backgroundSize = '150% 150%';
        }
        log.onmousemove = function (e) {
            e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true;

            e = e || window.event;
            var imgleft = e.offsetX;
            var imgtop = e.offsetY;
            logImg.style.backgroundPosition = -0.5 * imgleft + 'px -' + 0.5 * imgtop + 'px';
        }
        log.onmouseleave = function () {
            logImg.style.backgroundPosition = 'center';

            logImg.style.backgroundSize = '100% 100%';
        }


    ////    表单获得焦点提示登录
    //    var form = $id('form1');
    //    var formchild = $tag(form,'div');
    //    console.log(formchild);
    //    for (var i = 0;i < formchild.length;i ++) {
    //        formchild[i].onclick = function () {
    //            if (!sessionStorage.getItem('logined')) {
    //
    //            }
    //        }
    //    }
    })

}]);
