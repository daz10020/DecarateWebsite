//关于控制器
var aboutApp = angular.module('aboutApp', ['childApp'])
    .controller('aboutCtrl', ['$scope', '$stateParams', '$rootScope','$state', function ($scope, $stateParams, $rootScope,$state) {
        $rootScope.pageIndex = $stateParams.id;
        angular.element(document).ready(function () {
            $('.header>nav').eq(0).addClass('fixed');


            var urlId = $stateParams.id; // 获得参数
            var container = $('.container'); // 内容区
            var title = $('.jumbotron .container'); // 标题栏
            var breadcrumb = title.find('ol'); // 标题导航路径
            var leftNavHeader = $('.aside-header'); // 侧边导航条
            var rightHeader = $('.pull-right .page-header'); // 右侧内容标题
            var leftnavhtml = ''; // 动态添加侧边导航内容
            var metAsideList = $('.met_aside_list');
            childleft(urlId,title,breadcrumb,leftNavHeader,rightHeader,leftnavhtml,metAsideList);

            $('.met_aside_list').on('click','li:last', function () {
                $state.go('about.map');
            });
            var map = $('#map');
            leftClick(urlId,leftNavHeader,breadcrumb,metAsideList,rightHeader,map)
        })
    }]);
var mapApp = angular.module('mapApp',[])
    .controller('mapCtrl',['$scope', function ($scope) {
        /*获得地理位置成功*/
        function showMap(position) {
            //获得用户的经纬度
            //var longitude = 121.522943;
            //var latitude = 38.867714;//大连坐标
            var longitude = 116.450765;
            var latitude = 39.928547;//北京朝阳坐标
            // var longitude = 121.550089;
            // var latitude = 31.227906;//上海浦东新区

            //调用百度地图API
            var map = new BMap.Map('map');
            var point = new BMap.Point(longitude,latitude);//创建坐标点
            map.centerAndZoom(point,15);//设置中心点和缩放级别

            var marker = new BMap.Marker(point);//创建标记
            map.addOverlay(marker);//在地图上加上标记


            // 添加地图类型控件,默认位于地图右上方
            map.addControl(new BMap.MapTypeControl());
            // 地图平移缩放控件,PC端默认位于地图左上方，它包含控制地图的平移和缩放的功能。移动端提供缩放控件，默认位于地图右下方
            map.addControl(new BMap.NavigationControl());
            // 比例尺控件 ,默认位于地图左下方，显示地图的比例关系
            map.addControl(new BMap.ScaleControl());
            // 缩略地图控件，默认位于地图右下方，是一个可折叠的缩略地图。
            map.addControl(new BMap.OverviewMapControl());
            // 定位控件，针对移动端开发，默认位于地图左下方
            map.addControl(new BMap.GeolocationControl());
            // 开启鼠标滚轮缩放
            map.enableScrollWheelZoom(true);

            //坐标转换完之后的回调函数
            translateCallback = function (data) {
                if(data.status === 0) {
                    var marker = new BMap.Marker(data.points[0]);
                    map.addOverlay(marker);

                    map.setCenter(data.points[0]);//设置中心点
                }
            }

            // 转换gps坐标为百度坐标，延迟3000毫秒不是必须的，只是能够看出两个点的不同
            setTimeout(function(){
                var convertor = new BMap.Convertor();
                var pointArr = [];
                pointArr.push(point);
                convertor.translate(pointArr, 1, 5, translateCallback)
            }, 3000);

        }
        showMap();
    }])