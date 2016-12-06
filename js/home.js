// 创建模块
var homeApp = angular.module('homeApp', ['ui.router','indexApp','caseApp','childApp','callApp','aboutApp','mapApp']);

//在config中配置路由，注入$stateProvider,$urlRouterProvider两个服务
homeApp.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {

//		配置路由对应的页面url地址
    $stateProvider
        .state('index', {
            url: '/?id', //默认页
            templateUrl: 'index-router.html',
            controller: 'indexCtrl'
        })
        .state('child', {
            url: '/child?id',  //必须要声明要传递的参数
            templateUrl: 'child-router.html',
            controller: 'childCtrl'
        })
        .state('case', {
            url: '/case?id',
            templateUrl: 'case-router.html',
            controller: 'caseController'
        })
        .state('about', {
            url: '/about/:id',
            templateUrl: 'about-router.html',
            controller: 'aboutCtrl'
        })
        .state('about.map', {
            url: '/map',
            //views: {
            //'aboutview@about': {
            templateUrl: 'about.map.html',
            controller: 'mapCtrl'
                //}
            //}
        })
        .state('call', {
            url: '/call?id',
            templateUrl: 'call-router.html',
            controller: 'callCtrl'
        });

//		配置默认路由跳转地址（如果路由url不存在）
    $urlRouterProvider.otherwise('/');

}]);
//主页控制器
homeApp.controller('homeCtrl', ['$stateParams','$rootScope','$window','$scope', function ($stateParams,$rootScope,$window,$scope) {

    $rootScope.$on('$stateChangeStart', function(){
        $window = angular.element($window);
        return $window.off('scroll',$scope.handler);
    });
    // 传入参数名，返回请求参数值
    function getParams(name) {
        // 带参数的url
        var url = location.href;
        url = url.substring(url.indexOf('?') + 1);
        var params = url.split('&');
        for (var i = 0; i < params.length; i++) {
            var str = params[i].split('=');
            if (str[0] == name)
                return str[1];
        }
    }

    // 获得参数
    var urlId = getParams('id');
    $('.header>nav>ul').children('ul').eq(0).children('li').eq(urlId).addClass('hl');
    if (urlId) {
        $('.header>nav').eq(0).addClass('fixed');
    }

    //导航
    var nav = $tag(document, 'nav')[0];
    var navbtn = $id('navbtn');
    var navmenu = $tag(nav, 'ul')[0];
    var navli = $tag(nav, 'li');
    var navliarr = [0, 1, 6, 7, 10, 11];
    var navchild = $tag(navmenu, 'ul');

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

}])




// 过滤器，参数1：过滤器名称，参数2：过滤器代码
homeApp.filter('imgName', function () {

    return function (obj, val) {

        // 临时数组，存放满足条件的数据
        var newObj = [];
        // 遍历数据
        angular.forEach(obj, function (item) {

            // 自定义过滤条件，满足条件的放到新数组中
            if (item.imgtypename.indexOf(val) != -1) {
                newObj.push(item);
            }
        });

        // 返回过滤之后的结果数组
        return newObj;
    }

});

