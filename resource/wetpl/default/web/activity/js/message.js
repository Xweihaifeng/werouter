$(function() {
    var repeatFlag = false;
    var ajaxSendMessageUrl = $('#J_SendMessageUrl').val();
    var isIdentifyFlag = 0;
    var ANIM_TIME = 2000;
    var type = '';
    var message = {
        init: function() {
            var _self = this;
            common.init();
            $('.J_TabMemu').on('click', function() {
                if ($(this).hasClass('active')) return false;
                type = $(this).data('type');
                $('.J_TabMemu').toggleClass('active');
                $('.J_TabLayout').toggle();
                if (type == 'custom') {
                    _self.initCustom();
                }
            });
            //绑定保存短信按钮
            $('.J_BtnSendMessage').click(function() {
                _self.sendMessage();
            });
            //计算短信字数
            $('.J_InputMessage').keyup(function() {
                var remain = 135 - this.value.length;
                remain = remain > 0 ? remain : 0;
                $('.J_InputCount').text(remain);
            });
        },
        initCustom: function() {
            var obj = $('.J_InputMessage').get(0);
            $('.J_InputMessage').focus();
            var len = $('.J_InputMessage').val().length;
            if (document.selection) {
                var sel = obj.createTextRange();
                sel.moveStart('character', len);
                sel.collapse();
            } else if (typeof obj.selectionStart == 'number' && typeof obj.selectionEnd == 'number') {
                obj.selectionStart = obj.selectionEnd = len;
            }
            var count = 135 - len;
            $('.J_InputCount').text(count);
        },
        // 保存短信内容
        sendMessage: function() {
            if (repeatFlag) return false;
            repeatFlag = true;
            var isCheck = true;
            var message = $('.J_InputMessage').val();
            if (isCheck && !message) {
                notice.alert('请填写自定义短信内容', false, 500);
                isCheck = false;
            }
            if (isCheck && message.indexOf('【') != -1 || message.indexOf('】') != -1) {
                notice.alert('由于短信运营商的限制，短信中不允许出现【】，请替换后再保存', null, 500);
                isCheck = false;
            }
            if (!isCheck) {
                repeatFlag = false;
                return false;
            }
            common.loading('正在保存', function(hideLoading) {
                $.ajax({
                    url: ACTIVITY_SMS_TEMPLATE_UPDATE,
                    data: {
                        template: message,
                        activity_id: id
                    },
                    type: 'post',
                    dataType: 'json',
                    success: function(res) {
                        if (res.code == 200) {
                            notice.alert('保存成功', function() {
                                window.location.reload();
                            }, ANIM_TIME);
                        } else {
                            notice.alert(res.message, false, ANIM_TIME);
                            repeatFlag = false;
                        }
                    },
                    error: function(xhr, code, error) {
                        notice.alert(error, false, ANIM_TIME);
                        repeatFlag = false;
                    },
                    complete: function() {
                        hideLoading();
                    }
                });
            });
            // notice.confirm('确定群发短信?', function() {

            // }, function() {
            //     repeatFlag = false;
            // });
        }
    };
    message.init();
})