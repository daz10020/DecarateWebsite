//案例控制器
var caseApp = angular.module('caseApp',[])
.controller('caseController', ['$scope', '$http', '$filter', '$rootScope', '$window', '$timeout','caseService', function ($scope, $http, $filter, $rootScope, $window, $timeout,caseService) {
    $rootScope.pageIndex = 2;
    angular.element(document).ready(function () {

        var head = $('head');
        if (head.find('link').length < 6) {
            head.find('link:gt(2)').remove();
            head.append('<link rel="stylesheet" type="text/css" href="js/bootstrap/css/bootstrap.css"><link rel="stylesheet" type="text/css" href="css/child-router.css">')
        }

        $scope.rightTitle = '经典案例';
        //导航路径标志位
        $scope.breadcrumbFlag = 0;
        //搜索框内容
        $scope.searchCon = '';
        //搜索类别
        $scope.searchNum = '';
        $scope.hidli = 0;
        //记录上一次点击数据
        var oldleft = -1;

        // 右侧标题显示
        $scope.rightTitleShow = function (index) {
            $scope.searchCon = '';
            $scope.searchNum = '';
            $scope.hidli = 0;
            $scope.searchTipsFlag = false;
            // 如果为-1判断出为左侧父标题点击
            if (index == -1 || oldleft == index) {
                $scope.rightTitle = $scope.childData[1].name;
                $scope.breadcrumbFlag = 0;

                if (oldleft == index)
                    oldleft = -1;
                return;
            }

            // 右侧显示左侧点击的子标题
            $scope.rightTitle = $scope.childData[0].child[index];
            function filDel() {
                $scope.hidli = 1;
                $scope.searchNum = index;
            }

            $timeout(filDel, 100);
            $scope.breadcrumbFlag = 1;
            oldleft = index;
        }

        //左侧导航ajax
        var promise = caseService.leftTitle();
        promise
            .success(function (data) {
                $scope.childData = data;

            })
            .error(function () {
                layer.msg('网络连接错误');
            })

        // 分页页码
        var pageNum = 0;//初始页数
        var pageCount;//总页数
        var recordCount = 0;//总记录数
        $scope.product = [];
        $scope.fixNum = -1;
        $scope.handler = function () {

            var sTop = $window.scrollTop();
            if (sTop > 400 + 415 * (pageNum)) {
                pageNum++;
                $scope.getProduct();
            }

            $scope.fixNum = -1;
            if (sTop > 400 && sTop < 680) {
                var i = 0;
                while (sTop > 465 + 60 * i) {
                    $scope.$apply(function () {

                        if (i >= 3) {
                            $scope.fixNum = 3;
                        }else {
                            $scope.fixNum = i;
                        }
                        i++;
                    })
                }
            }else if (sTop > 680) {
                $scope.$apply(function () {

                    $scope.fixNum = 3;
                })
            }else if (sTop < 465) {
                $scope.$apply(function () {
                    $scope.fixNum = -1;
                })
            }
        }
        $window = angular.element($window);
        $window.on('scroll', $scope.handler);

        // 右侧内容ajax
        $scope.getProduct = function () {

            var promise =  $http.get('json/product.txt');

            promise
                .success(function (data) {

                    recordCount = data.length;
                    angular.forEach(data, function (item, index) {
                        if (index >= 9 * pageNum && index < 9 * (pageNum + 1)) {
                            $scope.product.push(item);
                        }
                    });
                })
                .error(function () {
                    layer.msg('网络连接失败');
                });
        }
        $scope.getProduct();

        //动态设置位置
        $scope.lileft = function (index) {
            return Math.ceil(index % 3) * $('.right-list').width() / 3 + 'px;';
        }
        $scope.litop = function (index) {
            return Math.floor(index / 3) * 205 + 'px;';
        }

        //获取随机数
        $scope.makeRandom = function (num) {
            var ranflag = 0;
            $scope.ranArr = [];
            var againflag = 1;
            while (ranflag < num) {
                var r = parseInt(($scope.newslength) * Math.random());
                for (var i = 0; i < $scope.ranArr.length; i++) {
                    if (r == $scope.ranArr[i]) {
                        againflag = 0;
                        break;
                    }
                    if (i == $scope.ranArr.length - 1) {
                        againflag = 1;
                    }
                }
                if (againflag) {
                    $scope.ranArr[ranflag] = r;
                    ranflag++;
                }
            }
        }

//    左侧资讯
        $scope.getNews = function (num) {
            var promise = caseService.leftnews();

            promise
                .success(function (data) {

                    var news = data;
                    $scope.newslength = data.length;
                    $scope.leftNews = [];
                    $scope.makeRandom(num);
                    angular.forEach($scope.ranArr, function (data, index) {
                        $scope.leftNews[index] = news[data];
                    })
                })
                .error(function () {
                    layer.msg('网络连接失败');
                })
        }
        $scope.getNews(4);
        $scope.keySelNum = -1;
        //$scope.selDefault = $filter('filter')($scope.product,{imgtypename:$scope.searchCon})[0].imgtypename;
//    键盘事件
        $scope.keySelect = function (e) {
            var keycode = window.event ? e.keyCode : e.which;
            var result = $filter('filter')($scope.product, {imgtypename: $scope.searchCon});
            var selLength = result.length;
            if ($scope.keySelNum < 0 && selLength)
                $scope.selDefault = result[0].imgtypename;
            else if (selLength)
                $scope.selDefault = result[$scope.keySelNum].imgtypename;
            $scope.searchTipsFlag = false;
            if ($scope.searchCon == '') {
                $scope.rightTitle = $scope.childData[1].name;
                $scope.hidli = 0;
                $scope.breadcrumbFlag = 0;
            }
            if ($scope.searchCon && selLength) {
                $scope.searchNum = '';
                $scope.searchTipsFlag = true;
                $scope.hidli = 1;

                if (keycode == 40) {
                    $scope.keySelNum++;
                    if ($scope.keySelNum >= selLength) {
                        $scope.keySelNum = 0;
                    }
                } else if (keycode == 38) {
                    $scope.keySelNum--;
                    if ($scope.keySelNum < 0) {
                        $scope.keySelNum = selLength - 1;
                    }
                } else if (keycode == 13) {
                    if ($scope.keySelNum < 0) {
                        $scope.keySelNum = 0;
                    }

                    $scope.searchCon = result[$scope.keySelNum].imgtypename;
                    $scope.rightTitle = $scope.searchCon;
                    $scope.breadcrumbFlag = 1;
                    $scope.searchTipsFlag = false;
                    $scope.keySelNum = -1;
                }
            }
        }
//      鼠标点击选择
        $scope.mouseCliSel = function (index) {
            var result = $filter('filter')($scope.product, {imgtypename: $scope.searchCon});
            $scope.hidli = 1;
            $scope.searchCon = result[index].imgtypename;
            $scope.searchTipsFlag = false;
            $scope.keySelNum = -1;
        }
//      鼠标移上选择
        $scope.mouseEntSel = function (index) {
            var result = $filter('filter')($scope.product, {imgtypename: $scope.searchCon});
            $scope.keySelNum = index;
            $scope.selDefault = result[$scope.keySelNum].imgtypename;
        }
    })

}])
    .service('caseService',['$http', function ($http) {
    return {
        leftTitle: function () {
            var promise =  $http.get('json/child.txt');
            return promise;
        },
        rightProduct: function () {
            var promise = $http.get('json/product.txt');
            return promise;
        },
        leftnews: function () {
            var promise = $http.get('json/news.txt');
            return promise;
        }
    }
}])