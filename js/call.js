//联系控制器
var callApp = angular.module('callApp', [])
    .controller('callCtrl', ['$scope', '$stateParams', '$rootScope', function ($scope, $stateParams, $rootScope) {
        $rootScope.pageIndex = $stateParams.id;
        angular.element(document).ready(function () {
            var urlId = $stateParams.id; // 获得参数
            var container = $('.container'); // 内容区
            var title = $('.jumbotron .container'); // 标题栏
            var breadcrumb = title.find('ol'); // 标题导航路径
            var leftNavHeader = $('.aside-header'); // 侧边导航条
            var rightHeader = $('.pull-right .page-header'); // 右侧内容标题
            var leftnavhtml = ''; // 动态添加侧边导航内容
            var metAsideList = $('.met_aside_list');
            childleft(urlId,title,breadcrumb,leftNavHeader,rightHeader,leftnavhtml,metAsideList);
            var userList = [
                {
                    username:'tom111',
                    userpsw:'123456'
                },
                {
                    username:'jack',
                    userpsw: '111111'
                }
            ]
            localStorage.setItem('userList',JSON.stringify(userList));
            var loginUsername = $('#loginUsername'),//登录框
                loginUserpsw = $('#loginUserpsw'),
                registerUsername = $('#registerUsername'),//注册框
                registerUserpsw = $('#registerUserpsw'),
                registerEnterpsw = $('#registerEnterpsw'),
                redisterAgree = $('#redisterAgree'),//同意协议
                loginForm = $('.login-form'),//登录表单
                registerForm = $('.register-form'),//注册表单
                loginShow = $('.login-show'),//登录显示按钮
                registerShow = $('.register-show'),//注册显示按钮
                exit = $('.exit'),//注销按钮
                userinfo = $('.userinfo'),//用户信息
                logintip = $('.logintip');//未登录提示
            loginForm.hide();
            registerForm.hide();

            var hasLogin = sessionStorage.getItem('hasLogin');
            if (hasLogin == 1) {

                loginForm.hide();
                loginShow.hide();
                registerShow.hide();
                logintip.hide();
                exit.show();
                userinfo.text(sessionStorage.getItem('hasloginuser')).show();
            }

            //    登录
            $('.login-btn').click(function () {
                // 当前用户名 密码
                var lname = loginUsername.val();
                var lpsw = loginUserpsw.val();
                var hasName = 0;

                if (lname == '') {
                    layer.msg('用户名不能为空');
                } else if (lpsw == '') {
                    layer.msg('请输入密码');
                }else {
                    // 获取本地存储的用户名密码
                    var obj = JSON.parse(localStorage.getItem('userList'));
                    $.each(obj, function(index, el) {
                        if (el.username == lname ) {
                            // 如果有对应的用户名说明用户名存在
                            hasName ++;
                            // 如果密码正确
                            if (el.userpsw == lpsw) {

                                layer.msg('登陆成功！');
                                // 隐藏登陆框
                                loginForm.hide();
                                loginShow.hide();
                                registerShow.hide();
                                logintip.hide();
                                exit.show();
                                userinfo.text(lname).show();

                                // 在会话级缓存中设置登陆标志位为1
                                sessionStorage.setItem('hasLogin',1);
                                sessionStorage.setItem('hasloginuser',lname);
                                loginUsername.val('');
                                loginUserpsw.val('');

                            } else {
                                layer.msg('密码错误！');
                                loginUserpsw.focus();
                            }
                        }
                    });
                    if (hasName == 0) {
                        layer.msg('用户名不存在，先去注册一个吧！');
                        loginUsername.focus();
                    }
                }
            });

        //    注册
            $('.register-btn').click(function () {

                if (!redisterAgree.prop('checked')) {
                    layer.msg('请先阅读协议');
                } else if (registerName() && registerPsw() && enterPsw()) {
                    var obj = JSON.parse(localStorage.getItem('userList'));
                    var dbname = 0;
                    console.log(obj);
                    $.each(obj, function(index, el) {
                        if(el.username == registerUsername.val()) {
                            layer.msg('本用户名已被使用，请更换');
                            dbname ++;
                            return;
                        }
                    });
                    if (!dbname) {
                        layer.msg('注册成功！');
                        var newobj = {
                            username:registerUsername.val(),
                            userpsw:registerUserpsw.val()
                        }
                        obj.push(newobj);
                        localStorage.setItem('userList',JSON.stringify(obj));
                        // 隐藏注册框
                        registerForm.hide();
                        loginShow.hide();
                        registerShow.hide();
                        logintip.hide();
                        exit.show();
                        userinfo.text(registerUsername.val()).show();
                        sessionStorage.setItem('hasLogin', 1);
                        sessionStorage.setItem('hasloginuser',registerUsername.val());
                        //清空输入框
                        registerUsername.val('');
                        registerUserpsw.val('');
                        registerEnterpsw.val('');
                    }
                }
            })
            //用户名验证
            function registerName() {
                // 正则表达式对象
                var r = /^[a-z][a-z0-9_]{5,11}$/;

                if (!r.test(registerUsername.val())) {
                    layer.msg('用户名不合法！');
                    registerUsername.focus();
                    return false;
                }
                return true;
            }
            registerUsername.blur(function () {
                registerName();
            })
        //    密码验证
            function registerPsw() {

                var r = /^\d{6,8}$/;

                if (!r.test(registerUserpsw.val())) {
                    layer.msg('密码格式不正确！');
                    registerUserpsw.focus();
                    return false;
                }
                return true;
            }
            registerUserpsw.blur(function () {
                registerPsw();
            })
        //    确认密码
            function enterPsw() {
                if (registerUserpsw.val() != registerEnterpsw.val()) {
                    layer.msg('两次密码输入不一致！');
                    registerEnterpsw.focus();
                    return false;
                }
                return true;
            }
            registerEnterpsw.blur(function () {
                enterPsw();
            })
        //    登录按钮
            loginShow.click(function () {
                loginForm.show();
                registerForm.hide();
                logintip.hide();
            });
        //    注册按钮
            registerShow.click(function () {
                loginForm.hide();
                registerForm.show();
                logintip.hide();
            });
        //    注销按钮
            exit.click(function () {
                if(confirm('确定要注销么？')) {
                    userinfo.text('').hide();
                    exit.hide();
                    loginForm.hide();
                    loginShow.show();
                    registerShow.show();
                    logintip.show();
                    sessionStorage.setItem('hasLogin',0);
                    sessionStorage.setItem('hasloginuser',0);
                }
            })
        })
    }]);