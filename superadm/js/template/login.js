var hosts = window.location.protocol + '//' + window.location.host + '/api/';
var ApiUrl = hosts + 'backend/';

var init = function() {
    $(".btn-flat").click(function() {
        var username = $('#username').val();
        var password = $('#password').val();

        // validError.errorName();
        // validError.errorPassWord();
        if (username && password.length > 5) {
            $.ajax({
                url: ApiUrl + 'admins/login',
                type: 'post',
                dataType: 'json',
                data: { username: username, password: password },
                success: function(data) {
                    // console.log(data);
                    if (data.code === 200) {
                        var menuList = '';
                        var info = data.data.info;
                        var setting = JSON.stringify(data.data.setting);
                        var menu = JSON.stringify(JSON.parse(info.config).list);
                        sessionStorage.setItem('weId', info.weid);
                        sessionStorage.setItem('username', info.username);
                        sessionStorage.setItem('real_name', info.real_name);
                        sessionStorage.setItem('memo', info.memo);
                        sessionStorage.setItem('avatar', info.avatar);
                        sessionStorage.setItem('role_id', info.role_id);
                        sessionStorage.setItem('token', data.token);
                        sessionStorage.setItem('setting', setting);
                        //菜单修改
                        localStorage.setItem('cms_menulist', menu);
                        //console.log(localStorage.getItem('cms_menulist'));
                        window.location.replace('index.html');
                    } else {
                        //parent.layer.msg(data.message);
                        // swal('提示', data.message, 'error');
                        swal({text: data.message,type: 'error', timer: 20000});
                        console.log('error: -200');
                    }
                },
                error: function(xhr) {
                    console.log(xhr);
                }
            })
        }
    });
};

// function loginValid(name, password) {
//     this.name = name;
//     this.password = password;
//     this.num = 0;
//     return this;
// }
// loginValid.prototype = {
//     errorName: function() {
//         if (this.name) {
//             $('#error-name').html("");
//             return
//         } else {
//             $('#error-name').html('*用户名不能为空!');
//             return false;
//         }
//         return this;
//     },
//     errorPassWord: function() {
//         if (this.password.length > 5) {
//             console.log('1')
//             $('#error-password').html("");
//             return
//         } else if (this.password.length < 1) {
//             $('#error-password').html('*密码不能为空!');
//             return false;
//         } else {
//             $('#error-password').html('*密码不正确!');
//             return false;
//         }
//         return this;
//     }
// };
// var validError = new loginValid($('#username').val(), $('#password').val());

(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] ||
            window[vendors[x] + 'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
                timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());

init();

var login = angular.module('login', [])
    .controller('loginCtrl', function($scope, $rootScope, $http, $interval) {
        $scope.isShow = true;
        $scope.focusEye = function() {
            $scope.eyeClose = true;
        }
        $scope.blurEye = function() {
            $scope.eyeClose = false;
        }
        $scope.mySwiper = new Swiper('.swiper-container', {
            effect: 'flip',
            width: 400,
            height: 450,
            noSwiping: true
        });
    });