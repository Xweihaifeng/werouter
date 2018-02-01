$(document).ready(function () {
    function req() {
        $.ajax({
            url: ApiUrl + 'plats/pages/setting',
            success: function (data) {
                if (data.code === 200) {
                    for (let i = 0; i < data.data.length; i++) {
                        if (data.data[i].title === 'pageMall') {
                            $("#os1").val('pageMall')
                            if (data.data[i].status == 1) {
                                $(".shop").removeClass('switch-close').addClass('switch-open')
                            } else {
                                $(".shop").removeClass('switch-open').addClass('switch-close')
                            }
                        }
                        if (data.data[i].title === 'pageArticle') {
                            $("#os2").val('pageArticle')
                            if (data.data[i].status == 1) {
                                $(".test").removeClass('switch-close').addClass('switch-open')
                            } else {
                                $(".test").removeClass('switch-close').addClass('switch-close')
                            }
                        }
                    }
                }
            }
        });
    }

    req();
    $(document).on('click', '.online_cert .switch', function () {
        var that = this;
        var status = $(that).hasClass('switch-open') ? 2 : 1;
        var title = $(that).children("div").children("input").val();
        console.log(that)
        $.ajax({
            url: ApiUrl + 'plats/pages/setting_status',
            type: "POST",
            dataType: 'json',
            data: {status: status, title: title},
            success: function (text) {
                if ($(that).hasClass('switch-open')) {
                    $(that).removeClass('switch-open').addClass('switch-close');
                } else {
                    $(that).removeClass('switch-close').addClass('switch-open');
                }
            }
        })
    })

});