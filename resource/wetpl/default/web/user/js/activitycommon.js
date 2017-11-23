$(function() {
            //图片上传接口
            var ajaxImageUploadUrl = $('#J_ImageUploadUrl').val();
            //抓取嘉宾接口
            var ajaxGetGuestListUrl = $('#J_GetGuestListUrl').val();
            //抓取主办方接口
            var ajaxGetSponorListUrl = $('#J_GetSponorListUrl').val();
            //是否填写账户信息
            var isFillAcccountInfo = $('#J_IsFillAccountInfo').val();
            //编辑器控制中心链接
            var editorContorllerUrl = $('#J_EditorControllerUrl').val();

            var imageUrl = $("#J_ImageUrl").val();
            //活动ID
            var activityId = parseInt($('#J_ActivityId').val(), 10);
            //最大字段数
            var MAX_FIELD_NUM = 4;
            //动画时间
            var ANIM_TIME = 200;
            //TAG添加按钮的动画时间
            var TAG_BUTTON_ANIM_TIME = 500;
            //本地存储key
            var KEY_DATA_ACTIVITY = 'activityData';
            var interval = '';
            //缓存时间间隔
            var CACHE_TIME = 5000;
            //编辑器对象
            var um = null;
            //重复提交开关
            var repeatFlag = false;
            //ajax是否保存
            var isSave = false;
            //自动清理初始化内容
            var autoClearinitialContent = true;
            //海报上传参数
            var posterOptions = null;
            //头像上传参数
            var avatarOptions = null;
            var isShowMap = false;
            //封面图片后缀
            var suffixPoster = "@750w_558h_1e_1c|250w";
            //头像图片后缀
            var suffixAvatar = "@80w_80h_2e";
            //证件图片后缀
            var suffixPapers = "@155w_100h_1e_1c";
            //活动数据
            var data = {};
            //活动编辑
            var activity = {
                init: function() {
                    console.log("abcd");
                    $('.J_IsAnnounce').val() == 0 && dialog.show('.J_DialogAnnounceActivity');
                    //初始化通用控件
                    common.init();
                    //加载图片
                    common.imagesloaded();
                    //表单元素绑定事件
                    this.bindEvent();
                    //海报图片
                    poster.init();
                    //城市选择
                    citySelect.init();
                    //票务
                    ticket.init();
                    //嘉宾
                    guest.init();

                    if (isFillAcccountInfo == 0) {
                        account.init();
                    }
                    //初始化上传模块
                    uploader.init();
                    //初始化时间控件
                    calader.init();
                    //初始化其他控件
                    other.init();
                    //编辑活动时的初始化
                    if (activityId) {
                        this.initEdit();
                        autoClearinitialContent = false;
                    } else {
                        setTimeout(function() {
                            //初始化缓存
                            cache.init();
                        }, 10)
                    }

                    $('.J_SortableList').sortable({
                        axis: "y",
                        cursor: 'move',
                        opacity: 0.5
                    });
                    //初始化编辑器
                    /* um = UE.getEditor('J_ActivityDetail', {
                         serverUrl: editorContorllerUrl,
                         autoClearinitialContent: autoClearinitialContent
                     });*/
                    template.config('openTag', '((');
                    template.config('closeTag', '))');
                },
                initEdit: function() {
                    var type = $('input[name=type]:checked').val();
                    if (type == 1) {
                        $('.J_LayoutFree').hide();
                        $('.J_LayoutFee').show();
                        $('.J_FeeTips').show();
                        $('.J_audit').show();
                    }
                },
                bindEvent: function() {
                    var _self = this;
                    //绑定高级属性点击事件
                    $('#J_HighProperty').click(function() {
                        $('#J_HighInfo').slideToggle();
                    });
                    //点击城市输入框显示城市选择插件
                    $('#J_ActivityCity').click(function() {
                        $('.J_CitySelectWeidgt').fadeIn(ANIM_TIME);
                    });
                    //活动历史地址选择
                    $('#J_ActivityAddr').focus(function() {
                        //判断是否选择城市
                        var city = $('#J_ActivityCity').val();
                        if (city == '城市') {
                            city = '';
                        }
                        if (city) {
                            $(this).removeAttr("readonly");
                            if (this.value) {
                                // $('#J_ActivityAddressMap').fadeIn(ANIM_TIME);
                                // map.loadMap();
                            } else {
                                $('#J_ActivityAddressHistory').fadeIn(ANIM_TIME);
                            }
                        } else {
                            $(this).attr("readonly", "");
                            notice.alert('请选择城市');
                        }
                    });
                    //活动地址
                    $('#J_ActivityAddr').keyup($.debounce(250, function() {
                        var address = $.trim($('#J_ActivityAddr').val());
                        if (address) {
                            // map.loadMap();
                            $('#J_ActivityAddressHistory').hide();
                            // $('#J_ActivityAddressMap').fadeIn(ANIM_TIME);
                        } else {
                            // $('#J_ActivityAddressMap').hide();
                            $('#J_ActivityAddressHistory').fadeIn(ANIM_TIME);
                        }

                    }));
                    //失去活动地址输入框的焦点时隐藏活动历史地址
                    $('#J_ActivityAddr').blur(function() {
                        $('#J_ActivityAddressHistory').fadeOut(ANIM_TIME);
                        //$('#J_ActivityAddressMap').fadeOut(ANIM_TIME);
                    });
                    //选择城市列表
                    $('.J_ActivityAddressHistoryItem').click(function() {
                        var city = $('#J_ActivityCity').val();
                        var address = $(this).text();
                        $('#J_ActivityAddr').val(address);
                        $('#J_ActivityAddressHistory').hide();
                        $('#J_ActivityAddr').focus();
                    });
                    //活动保存和发布按钮
                    /* $('.J_BtnActivitySave').click(function() {
                         
                         if (formObj.init(this)) {
                             if (isFillAcccountInfo == 0 && data.type == 1) {
                                 dialog.show('#J_DialogAccount');
                             } else {
                                 _self.submitData();
                             }
                         }
                     });*/
                    //添加主办方输入框获得焦点是显示历史列表
                    $('#J_InputSponor').focus(function() {
                        $('#J_SponorHistoryList').slideDown(ANIM_TIME);
                    });
                    $('#J_InputSponor').blur(function() {
                        $('#J_SponorHistoryList').fadeOut(ANIM_TIME);
                    });
                    //选择主办方
                    $('#J_SponorHistoryList>ul>li').click(function() {
                        $('#J_InputSponor').val($(this).text());
                        $('#J_SponorHistoryList').fadeOut(ANIM_TIME);
                    });
                    //预览按钮事件
                    $('#J_BtnPreview').click(function() {
                        if (formObj.init()) {
                            _self.showPreview();
                        }
                    });
                    //收费和免费切换事件
                    $('input[name=type]').change(function() {
                        var type = $('input[name=type]:checked').val();
                        //alert(type);
                        if (type == 1) {
                            $('.J_LayoutFree').hide();
                            $('.J_FeeTips').hide();
                            $('.J_audit').hide();
                        } else {
                            $('.J_LayoutFree').show();
                            $('.J_FeeTips').show();
                            $('.J_audit').show();
                        }

                    });
                    //捕获地图节点和输入框节点事件，防止点击后地图消失
                    function showMap() {
                        isShowMap = true;
                    }

                    this.captureClickEvent(document.getElementById('J_ActivityAddressMap'), showMap);
                    this.captureClickEvent($('.form-group-address').get(0), showMap);
                    //隐藏各种浮层
                    $(document).click(function(e) {
                        var $target = $(e.target);
                        //如果没有点击城市输入框和城市选择控件，则隐藏城市控件
                        if (!$target.hasClass('J_CitySelectWeidgt') && !$target.hasClass('input-control-city')) {
                            $('.J_CitySelectWeidgt').fadeOut(ANIM_TIME);
                        }
                        //如果没点击添加字段，则恢复添加按钮
                        if (!$target.hasClass('J_SponorInputTag') && !$target.hasClass('J_BtnAddTag')) {
                            _self.resetTagAddButton($('.J_TagAddField'));
                        }
                        //如果没点击添加主办方，则恢复添加按钮 J_SponorListItem
                        var ignoreSponorClasses = ['J_SponorInputTag', 'J_BtnAddTag', 'J_SponorListItem', 'J_BtnAddTagIcon', 'ui-menu-item'];
                        if (!_self.classInArray(e.target, ignoreSponorClasses)) {
                            _self.resetTagAddButton($('.J_TagAddSponor'));
                        }

                        if (!isShowMap) {
                            // $('#J_ActivityAddressMap').fadeOut(ANIM_TIME);
                        } else {
                            isShowMap = false;
                        }
                    });
                },
                //检测节点时候还有class数组的class
                classInArray: function(target, classes) {
                    var flag = false;
                    for (var i = 0; i < classes.length; i++) {
                        var cls = classes[i];
                        if ($(target).hasClass(cls)) {
                            flag = true;
                        }
                    }
                    return flag;
                },
                resetTagAddButton: function(node) {
                    var $input = node.children('input');
                    $input.val('');
                    $input.hide(TAG_BUTTON_ANIM_TIME);
                    $(node).children('span').html('添加<i class="fa fa-plus J_BtnAddTagIcon"></i>');
                },
                showPreview: function() {
                    $iframe = $('#previewIFrame');
                    $iframe.attr('src', $iframe.data('src') + '?t=' + (new Date()).getTime());
                    window.iframeData = data;
                    dialog.show('#J_DialogPreview');
                },
                //捕获事件
                captureClickEvent: function(ele, fn) {
                    if (!ele) {
                        return false;
                    }
                    if (ele.attachEvent) {
                        ele.attachEvent('onclick', fn);
                    } else {
                        ele.addEventListener('click', fn, true);
                    }
                },
                submitData: function() {
                    var url = $('#J_FormActivity').attr('action');
                    var msg = '正在发布中...';
                    if (data.status == 2) {
                        msg = '正在保存中...';
                    }
                    common.loading(msg, function(hideLoading) {
                        $.ajax({
                            url: url,
                            data: {
                                data: JsonObj.encode(data)
                            },
                            type: 'post',
                            dataType: 'json',
                            success: function(res) {
                                hideLoading();
                                notice.alert(res.msg, function() {
                                    if (res.status == 1) {
                                        clearInterval(interval); //清除定时器
                                        cache.clean(); //清除缓存
                                        isSave = true;
                                        setTimeout(function() {
                                            document.location.href = res.data.url;
                                        }, 500);
                                    } else if (res.status == 2) {
                                        setTimeout(function() {
                                            window.location.href = res.data.url;
                                        }, 500);
                                    }
                                }, 1000);
                            },
                            error: function(xhr, code, error) {
                                hideLoading();
                                location.href = location.href;
                                console.log("系统忙，请刷新后重试。");
                            }
                        });
                    });
                }
            };
            //海报
            var poster = {
                init: function() {
                    this.bindEvent();
                    //海报弹窗关闭事件
                    dialog.on($('#J_DialogPoster'), 'close', function() {
                        $('.J_Thumb').removeClass('selected');
                    });
                },
                bindEvent: function() {
                    var _self = this;
                    $('.J_Thumb').click(function() {
                        $('.J_Thumb').removeClass('selected');
                        $(this).addClass('selected');
                    });
                    $('#J_BtnSelectPosterSure').click(function() {
                        var flag = $('.J_Thumb').hasClass('selected');
                        //判断是否被选中
                        if (flag) {
                            _self.select();
                            dialog.close($('#J_DialogPoster'));
                        } else {
                            notice.alert('请选择一张图片', null, 500);
                        }
                    });
                },
                select: function() {
                    var $img = $('.J_Thumb.selected img');
                    $('#J_ActivityPoster').val($img.data('name'));
                    $('.J_PosterUploader .upload-result').html($img.clone());
                }
            };
            //时间控件
            var calader = {
                init: function() {
                    var _self = this;
                    var options = {
                        dateFormat: "yy-mm-dd",
                        monthNames: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
                        dayNamesMin: ["日", "一", "二", "三", "四", "五", "六"],
                        timeText: '时间',
                        hourText: '时钟',
                        minuteText: '分钟',
                        minDate: new Date(),
                        showButtonPanel: false
                    };
                    //初始化开始时间控件
                    var beginOptions = $.extend({
                        onSelect: function(e) {
                            _self.beginDataSelectHandle(e);
                        }
                    }, options);
                    $('#J_ActivityStartDate').datepicker(beginOptions);
                    //初始化结束时间控件
                    $('#J_ActivityOverDate').datepicker(options);
                    //初始化报名截止时间控件
                    $('#J_ActivityEntryOverDate').datepicker(options);
                },
                beginDataSelectHandle: function(e) {
                    //设置结束时间
                    var endTime = $('#J_ActivityOverDate').val();
                    if (endTime == '' || endTime == '点击选择结束时间') {
                        $('#J_ActivityOverDate').val(e);
                    }
                    $('#J_ActivityOverDate').datepicker('option', 'minDate', e);
                    //设置报名截止时间
                    var entryEndTime = $('#J_ActivityEntryOverDate').val();
                    if (entryEndTime == '' || entryEndTime == '点击选择截止时间') {
                        entryEndTime = this.minusDay(e, 1);
                        $('#J_ActivityEntryOverDate').val(e);
                    }
                    $('#J_ActivityEntryOverDate').datepicker('option', 'maxDate', e);
                },
                minusDay: function(dateStr, day) {
                    var result = '';
                    try {
                        var dateTime = new Date(dateStr).getTime() - day * 24 * 3600 * 1000;
                        return new Date(dateTime).format('yyyy-MM-dd');
                    } catch (e) {
                        result = new Date().format('yyyy-MM-dd');
                    }
                    return result;
                }
            };
            //城市选择
            var citySelect = {
                init: function() {
                    var _self = this;
                    $('[data-toggle="tab"]').click(function() {
                        $('#J_CityTab li').removeClass('active');
                        $(this).parent().addClass('active');
                        var id = $(this).attr('href');
                        _self.showTab(id);
                        return false;
                    });

                    $('.J_CityItem').click(function() {
                        $('#J_ActivityCity').val($(this).text());
                        $('#J_ActivityCityId').val($(this).data('id'));
                        $('.J_CitySelectWeidgt').fadeOut(ANIM_TIME);
                        $('#J_ActivityAddr').removeAttr('readonly');
                    });
                },
                showTab: function(id) {
                    $('.J_CitySelectWeidgt .tab-pane').removeClass('active');
                    $(id).addClass('active');
                }
            };
            //上传图片
            var uploader = {
                init: function() {
                    //上传配置
                    var options = {
                        // 选完文件后，是否自动上传。
                        auto: true,
                        swf: 'js/webuploader/Uploader.swf?t=' + new Date().getTime(),
                        // 文件接收服务端。
                        server: ajaxImageUploadUrl,
                        // 不压缩image, 默认如果是jpeg，文件上传前会压缩一把再上传！
                        resize: false,
                        multiple: false,
                        accept: {
                            title: 'Images',
                            extensions: 'jpg,jpeg,png',
                            mimeTypes: 'image/png,image/jpeg'
                        },
                        fileNumLimit: 1,
                        compress: null
                    };

                    //海报上传配置
                    posterOptions = $.extend({
                        pick: {
                            id: '#J_PosterPicker'
                        },
                        formData: {
                            t: 'poster'
                        }
                    }, options);

                    //海报上传对象
                    var posterUploader = new WebUploader.Uploader(posterOptions);
                    posterUploader.on('uploadStart', function() {
                        $('.J_PosterUploader .upload-mask').fadeIn();
                    });
                    this.setEvent(posterUploader);

                    //头像上传设置
                    avatarOptions = $.extend({
                        pick: {
                            id: '#J_AvatarPicker'
                        },
                        formData: {
                            t: 'avatar'
                        }
                    }, options);
                    //头像上传设置
                    var avatarUploader = new WebUploader.Uploader(avatarOptions);
                    avatarUploader.on('uploadStart', function() {
                        $('#J_AvatarPicker .upload-mask').fadeIn();
                    });
                    this.setEvent(avatarUploader);

                    //身份证上传设置
                    //身份证上传配置
                    idcardOptions = $.extend({
                        pick: {
                            id: '#J_IdcardPicker'
                        },
                        formData: {
                            t: 'idcard'
                        }
                    }, options);

                    //身份证上传对象
                    var idcardUploader = new WebUploader.Uploader(idcardOptions);
                    idcardUploader.on('uploadStart', function() {
                        $('#J_IdcardPicker .upload-mask').fadeIn();
                    });
                    this.setEvent(idcardUploader);

                    //营业执照上传设置
                    licenseOptions = $.extend({
                        pick: {
                            id: '#J_LicensePicker'
                        },
                        formData: {
                            t: 'license'
                        }
                    }, options);
                    //营业执照上传设置
                    var licenseUploader = new WebUploader.Uploader(licenseOptions);
                    licenseUploader.on('uploadStart', function() {
                        $('#J_LicensePicker .upload-mask').fadeIn();
                    });
                    this.setEvent(licenseUploader);
                },
                //设置上传事件
                setEvent: function(uploader) {
                    uploader.on('beforeFileQueued', this.beforeFileQueuedEvent);
                    uploader.on('uploadSuccess', this.uploadSuccessEvent);
                    uploader.on('uploadError', this.uploadErrorEvent);
                    uploader.on('uploadComplete', this.uploadCompleteEvent);
                },
                beforeFileQueuedEvent: function(file) {
                    if (file.size > 5 * 1024 * 1024) {
                        notice.alert('文件大小超过5M，请处理后重新上传', null, 1000);
                        return false;
                    }
                },
                //上传成功事件
                uploadSuccessEvent: function(file, response) {
                    if (response['state'] == 'SUCCESS') {
                        var id = this.options.pick.id;
                        if (id == '#J_PosterPicker') {
                            uploader.posterUploadSuccess(response['url'], response['name']);
                        } else if (id == '#J_AvatarPicker') {
                            uploader.avatarUploadSuccess(response['url'], response['name']);
                        } else if (id == '#J_IdcardPicker') {
                            uploader.idcardUploadSuccess(response['url'], response['name']);
                        } else if (id == '#J_LicensePicker') {
                            uploader.licenseUploadSuccess(response['url'], response['name']);
                        }
                    } else {
                        notice.alert(response['state'], null, 1000);
                    }
                },
                //上传错误事件
                uploadErrorEvent: function(file, reason) {
                    notice.alert('上传错误:' + reason);
                },
                //上传完成事件
                uploadCompleteEvent: function(file) {
                    this.reset();
                    $('.upload-mask').fadeOut();
                },
                //海报上传成功处理方法
                posterUploadSuccess: function(url, name) {
                    url = url + suffixPoster;
                    var imgHtml = '<img src="' + url + '">';
                    $('.J_PosterUploader .upload-result').html(imgHtml);
                    $('#J_ActivityPoster').val(name);
                },
                //头像上传成功处理方法
                avatarUploadSuccess: function(url, name) {
                    url = url + suffixPoster;
                    $('#J_AvatarPicker .webuploader-pick').children('i').hide();
                    $('#J_AvatarPicker .webuploader-pick').children('p').hide();
                    $('#J_GuestAvatar').val(name);
                    $('#J_GuestAvatarPic').remove();
                    $('#J_AvatarPicker').append('<img  id="J_GuestAvatarPic"  src="' + url + '" class="guest-avatar-pic">');
                },
                //身份证上传成功处理方法
                idcardUploadSuccess: function(url, name) {
                    url = url + suffixPapers;
                    var imgHtml = '<img src="' + url + '">';
                    $('#J_IdcardPicker .upload-result').html(imgHtml);
                    $('#J_AccountIdcard').val(name);
                },
                //营业执照上传成功处理方法
                licenseUploadSuccess: function(url, name) {
                    url = url + suffixPapers;
                    var imgHtml = '<img src="' + url + '">';
                    $('#J_LicensePicker .upload-result').html(imgHtml);
                    $('#J_AccountLicense').val(name);
                },
                //取cookies函数
                getCookie: function(name) {
                    var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
                    if (arr != null) return unescape(arr[2]);
                    return null;
                }
            };
            //门票
            var ticket = {
                _editNode: null,
                _isNew: true,
                tickets: {},
                init: function() {
                    var _self = this;
                    _self.saveTicket();
                    $('#J_BtnSaveTicket').click(function() {
                        $('.J_TicketForm').submit();
                    });
                    this.bindEvent($('.J_ActivityTicket'));

                    //门票弹窗的关闭事件
                    dialog.on($('#J_DialogTicket'), 'close', function() {
                        repeatFlag = false;
                        _self.validate.resetForm();
                        _self._isNew = true;
                        _self._editNode = null;
                        $('#J_TicketPrice').removeAttr('readonly');
                        $('#J_TicketPrice').removeClass('readonly');
                        $('.J_TicketForm').find('input').removeClass('error');
                        $('.J_TicketForm').get(0).reset();
                        $('#J_TicketId').val(0); //新增 清除上次打开的id
                    });
                },
                //保存门票并验证
                saveTicket: function() {
                    var _self = this;
                    _self.validate = $('.J_TicketForm').validate({
                        //验证字段
                        rules: {
                            name: "required",
                            price: {
                                required: true,
                                number: true,
                                min: 0
                            },
                            num: {
                                required: true,
                                digits: true
                            }
                        },
                        //验证提示
                        messages: {
                            name: "门票名称不能为空",
                            price: {
                                required: "单价不能为空",
                                number: "单价必须为数字",
                                min: "单价不能小于0"
                            },
                            num: {
                                required: "数量不能为空",
                                digits: "数量必须为数字"
                            }
                        },
                        //验证完毕后提交事件
                        submitHandler: function(form) {
                            if (repeatFlag) {
                                return;
                            }
                            repeatFlag = true;
                            var id = parseInt($('#J_TicketId').val(), 10);
                            //判断是否是编辑 0是新增 1是修改
                            var data = {};
                            //组合门票信息
                            if (id) {
                                data.id = id;
                            } else {
                                data.id = -1;
                            }
                            data.name = $.trim($('#J_TicketName').val());
                            data.intro = $.trim($('#J_TicketIntro').val());
                            data.price = parseFloat($('#J_TicketPrice').val());
                            data.num = parseInt($('#J_TicketNum').val(), 10);
                            var reg = /^\d+(\.\d{1,2})?$/;
                            if (!reg.test(data.price)) {
                                repeatFlag = false;
                                notice.alert('活动票价格不允许超过两位小数');
                                return;
                            }
                            data.result = JsonObj.encode(data);
                            if (_self._isNew) //将门票添加到表单信息中
                                _self.createTicket(data);
                            else //修改门票信息
                                _self.modifyTicket(data);
                            dialog.close($('#J_DialogTicket'));
                        }
                    });
                },
                //创建门票
                createTicket: function(data) {
                    //获取模板
                    var $html = $(template('J_TmplTicket', data));
                    this.bindEvent($html);
                    $html.hide();
                    $('.J_TicketList').append($html);
                    $html.slideDown(ANIM_TIME);
                    $('.J_SortableList').sortable('refresh');
                },
                //修改门票
                modifyTicket: function(data) {
                    this._editNode.data('result', data.result);
                    this._editNode.find('.name').text(data.name);
                    this._editNode.find('.info').text(data.intro);
                    this._editNode.find('.price>span').text(data.price);
                    this._editNode.find('.num>span').text(data.num);
                },
                //绑定门票操作事件
                bindEvent: function($node) {
                    var _self = this;
                    var $edit = $node.find('.J_TicketEdit');
                    var $del = $node.find('.J_TicketDelete');
                    $edit.click(function() {
                        var $p = $(this).parent().parent();
                        var data = $p.data('result');
                        if (typeof data == 'string') {
                            data = JsonObj.decode(data);
                        }
                        _self._isNew = false;
                        _self._editNode = $p;
                        _self.edit(data);
                    });
                    $del.click(function() {
                        var $p = $(this).parent().parent();
                        var joined = parseInt($p.data('joined'), 10);
                        if (joined > 0) {
                            notice.alert('此票种已经有人报名，不可删除');
                            return;
                        }
                        $p.slideUp(ANIM_TIME, function() {
                            //删除表单数据中的门票
                            $p.remove();
                        });
                    });
                },
                //编辑门票
                edit: function(data) {
                    var joined = this._editNode.data('joined');
                    if (joined) {
                        $('#J_TicketPrice').attr('readonly', '');
                        $('#J_TicketPrice').addClass('readonly');
                    } else {
                        $('#J_TicketPrice').removeAttr('readonly');
                        $('#J_TicketPrice').removeClass('readonly');
                    }
                    $('#J_TicketId').val(data.id);
                    $('#J_TicketName').val(data.name);
                    $('#J_TicketIntro').val(data.intro);
                    $('#J_TicketPrice').val(data.price);
                    $('#J_TicketNum').val(data.num);
                    dialog.show('#J_DialogTicket');
                }
            };
            //嘉宾
            var guest = {
                state: 0,
                editNode: null,
                validate: null,
                init: function() {
                    var _self = this;
                    _self.autoComplate();
                    _self.saveGuest();
                    $('#J_BtnSaveGuest').click(function() {
                        // $('.J_GuestForm').submit();
                    });
                    this.bindEvent($('.J_ActivityGuest'));
                    //门票弹窗的关闭事件
                    dialog.on($('#J_DialogGuest'), 'close', function() {
                        repeatFlag = false;
                        _self.state = 0;
                        _self.editNode = null;
                        _self.validate.resetForm();
                        $('.J_GuestForm').find('input').removeClass('error');
                        $('#J_GuestAvatarPic').remove();
                        $('#J_GuestAvatar').val('');
                        $('.J_GuestForm').get(0).reset();
                        $('#J_AvatarPicker .webuploader-pick').children('i').show();
                        $('#J_AvatarPicker .webuploader-pick').children('p').show();
                    });
                },
                saveGuest: function() {
                    var _self = this;
                    _self.validate = $('.J_GuestForm').validate({
                        //验证字段
                        rules: {
                            name: "required",
                            company: "required",
                            position: "required"
                        },
                        //验证提示
                        messages: {
                            name: "姓名不能为空",
                            company: "公司不能为空",
                            position: "职位不能为空"
                        },
                        //验证完毕后提交事件
                        submitHandler: function() {
                            if (repeatFlag) {
                                return;
                            }
                            repeatFlag = true;
                            var data = {};
                            data.id = $('#J_GuestId').val();
                            data.name = $.trim($('#J_GuestName').val());
                            data.company = $.trim($('#J_GuestCompany').val());
                            data.position = $.trim($('#J_GuestPosition').val());
                            data.avatar = $.trim($('#J_GuestAvatar').val());
                            data.result = JsonObj.encode(data);
                            if (!data.avatar) {
                                notice.alert('请上传头像', null, 500);
                                repeatFlag = false;
                            } else {
                                if (guest.state == 0)
                                    _self.createGuest(data);
                                else
                                    _self.modifyGuest(data);
                                dialog.close($('#J_DialogGuest'));
                            }
                        }
                    });
                },
                //创建嘉宾
                createGuest: function(data) {
                    data.avatarUrl = imageUrl + data.avatar + suffixAvatar;
                    //获取模板
                    var $html = $(template('J_TmplGuest', data));
                    //绑定事件
                    this.bindEvent($html);
                    $html.hide();
                    $('.J_GuestList').append($html);
                    $html.slideDown(ANIM_TIME);
                    $('.J_SortableList').sortable('refresh');
                },
                modifyGuest: function(data) {
                    var url = imageUrl + data.avatar + suffixAvatar;
                    this.editNode.data('result', data.result);
                    this.editNode.find('.avatar img').attr('src', url);
                    this.editNode.find('.name').text(data.name);
                    this.editNode.find('.company').text(data.company);
                    this.editNode.find('.position').text(data.position);
                },
                //绑定删除事件
                bindEvent: function($node) {
                    var _self = this;
                    var $edit = $node.find('.J_GuestEdit');
                    var $del = $node.find('.J_GuestDelete');
                    $edit.click(function() {
                        var $p = $(this).parent().parent();
                        var data = $p.data('result');
                        if (typeof data == 'string') {
                            data = JsonObj.decode(data);
                        }
                        _self.state = 1;
                        _self.editNode = $p;
                        _self.edit(data);
                    });
                    $del.click(function() {
                        var $p = $(this).parent().parent();
                        $p.slideUp(ANIM_TIME, function() {
                            //删除表单数据中的门票
                            $p.remove();
                        });
                    });
                },
                edit: function(item) {
                    var url = imageUrl + item.avatar + suffixAvatar;
                    $('#J_GuestAvatarPic').remove();
                    $('#J_AvatarPicker').append('<img  id="J_GuestAvatarPic"  src="' + url + '" class="guest-avatar-pic">');
                    $('#J_GuestName').val(item.name);
                    $('#J_GuestAvatar').val(item.avatar);
                    $('#J_GuestCompany').val(item.company);
                    $('#J_GuestPosition').val(item.position);
                    $('#J_GuestId').val(item.id);
                    dialog.show('#J_DialogGuest');
                },
                autoComplate: function() {
                    //嘉宾选择自动填充
                    $('#J_GuestName').autocomplete({
                        source: function(request, response) {
                            $.ajax({
                                url: ajaxGetGuestListUrl,
                                dataType: "json",
                                data: {
                                    search: request.term
                                },
                                success: function(res) {
                                    if (res.status === 1) {
                                        response($.map(res.data, function(item) {
                                            return {
                                                id: item.id,
                                                name: item.name,
                                                company: item.unit,
                                                position: item.position,
                                                avatar: item.avatar,
                                                avatarUrl: imageUrl + item.avatar + suffixAvatar,
                                                value: item.name
                                            }
                                        }));
                                    }
                                }
                            });
                        },
                        select: function(event, ui) {
                            var item = ui.item;
                            $('#J_GuestAvatarPic').remove();
                            $('#J_AvatarPicker').append('<img  id="J_GuestAvatarPic"  src="' + item.avatarUrl + '" class="guest-avatar-pic">');
                            $('#J_GuestAvatar').val(item.avatar);
                            $('#J_GuestCompany').val(item.company);
                            $('#J_GuestPosition').val(item.position);
                            $('#J_GuestId').val(0);
                            $('#J_AvatarPicker .webuploader-pick').children('i').hide();
                            $('#J_AvatarPicker .webuploader-pick').children('p').hide();
                        }
                    });
                }
            };
            //主办方以及字段
            var other = {
                init: function() {
                    this.sponorAutoComplete();
                    this.initAddTag();
                    this.bindDeleteTag($('.tag'));
                },
                initAddTag: function() {
                    var _self = this;
                    $('.J_BtnAddTag').click(function() {
                        try {
                            console.log("aaaa");
                            var $input = $(this).prev();
                            var type = $(this).data('type');
                            if ($(this).prev().css('display') == 'none') {
                                if (type == 'field' && $('.tag[data-type="field"]').length >= 4) {
                                    notice.alert('最多只能添加' + MAX_FIELD_NUM + '个字段');
                                    return false;
                                }
                                $(this).html('确定');
                                //显示输入框
                                $input.show(TAG_BUTTON_ANIM_TIME, function() {
                                    $input.focus();
                                });
                            } else {
                                if (!$.trim($input.val())) {
                                    notice.alert('请输入有效的主办方', null, 500);
                                    return false;
                                }
                                if ($input.val()) {
                                    _self.createTag($(this), type, $input.val());
                                    $(this).html('添加<i class="fa fa-plus J_BtnAddTagIcon"></i>');
                                    //重置输入框
                                    $input.val('');
                                    //还原按钮
                                    $input.hide(TAG_BUTTON_ANIM_TIME);
                                } else {
                                    if (type == 'sponor') {
                                        notice.alert('请填写主办方');
                                    } else {
                                        notice.alert('请填写字段');
                                    }
                                    $input.focus();
                                }
                            }
                        } catch (e) {}
                    });
                },
                createTag: function($node, type, name) {
                    var tag = {
                        type: type,
                        ctime: new Date().getTime(),
                        name: name
                    };
                    var $html = $(template('J_TmplTag', tag));
                    //绑定删除事件
                    this.bindDeleteTag($html);
                    //添加tag节点
                    $node.parent().before($html);
                },
                bindDeleteTag: function(node) {
                    var _self = this;
                    node.children('.fa').click(function() {
                        var parentNode = $(this).parent();
                        //删除表单数据中的门票
                        parentNode.fadeOut(ANIM_TIME, function() {
                            parentNode.remove();
                        });
                    });
                },
                sponorAutoComplete: function() {
                    $('#J_InputSponor').autocomplete({
                        source: function(request, response) {
                            $.ajax({
                                url: ajaxGetSponorListUrl,
                                dataType: "json",
                                data: {
                                    search: request.term
                                },
                                success: function(res) {
                                    if (res.status === 1) {
                                        response($.map(res.data, function(item) {
                                            return {
                                                name: item.name,
                                                value: item.name
                                            }
                                        }));
                                    }
                                }
                            });
                        },
                        open: function(event, ui) {
                            $('#J_SponorHistoryList').hide();
                        },
                        close: function(event, ui) {
                            if ($('#J_InputSponor').val() == '')
                                $('#J_SponorHistoryList').slideDown(ANIM_TIME);
                        }
                    });
                }
            };

            //表单验证
            var formObj = {
                init: function(node) {
                    data = this.formatData($(node).data('status'));
                    return this.validate();
                },
                validate: function() {
                    if (!data.poster) {
                        notice.alert('请上传活动封面');
                        $('.J_PosterUploader').focus();
                    } else if (!data.title) {
                        notice.alert('请填写活动标题');
                        $('#J_ActivityTitle').focus();
                    } else if (data.title.length < 5) {
                        notice.alert('活动标题必须大于5个字');
                        $('#J_ActivityTitle').focus();
                    } else if (data.title.length > 100) {
                        notice.alert('活动标题太长');
                        $('#J_ActivityTitle').focus();
                    } else if (!data.cityId) {
                        notice.alert('请选择城市');
                        $('#J_ActivityCity').focus();
                    } else if (!data.address) {
                        notice.alert('请填写活动地址');
                        $('#J_ActivityAddr').focus();
                    } else if (!data.beginTime) {
                        notice.alert('请选择活动开始时间');
                        $('#J_ActivityStartDate').focus();
                    } else if (!data.endTime) {
                        notice.alert('请选择活动结束时间');
                        $('#J_ActivityOverDate').focus();
                    } else if (!data.entryEndTime) {
                        notice.alert('请选择活动报名截止时间');
                        $('#J_ActivityEntryOverDate').focus();
                    } else if (data.beginTime >= data.endTime) {
                        notice.alert('活动结束时间不能早于活动开始时间');
                        $('#J_ActivityOverTime').focus();
                    } else if (data.entryEndTime > data.endTime) {
                        notice.alert('报名截止时间不能晚于活动结束时间');
                        $('#J_ActivityEntryOverTime').focus();
                    } else if (data.sponors.length < 1) {
                        notice.alert('请填写主办方');
                        $('.form-group-sponors').focus();
                    } else if (!data.content) {
                        notice.alert('请填写活动详情');
                        $('.form-group-detail').focus();
                    } else if (data.type == 1 && data.limit && isNaN(data.limit)) {
                        notice.alert('人数限制必须为数字');
                        $('#J_ActivityLimit').focus();
                    } else if (data.type == 2 && !data.price {
                            notice.alert('票价必须为数字');
                            $('#J_ActivityPrice').focus();
                            // } else if (data.type == 1 && data.tickets.length <= 0) {
                            //     notice.alert('请添加门票');
                            //     $('.form-group-type').focus();
                        } else if (!data.isAgreeProtocal) {
                            notice.alert('请阅读活动协议并同意');
                        } else {
                            return true;
                        }
                        return false;
                    },
                    formatData: function(status) {
                            var PLACEHOLDER_TITLE = '活动标题不少于5个字';
                            var PLACEHOLDER_ADDRESS = '例如：文二路118号';
                            var PLACEHOLDER_LIMIT = '输入限制人数（不填或0表示不限人数）';
                            var PLACEHOLDER_CONTENT = '请尽量完善活动内容，优质的活动会被微链推荐到微链app活动中，让所有微链用户看到您发布的活动。!';

                            var beginDate = this.parseDate($('#J_ActivityStartDate').val(), $('#J_ActivityStartTime').val());
                            var endDate = this.parseDate($('#J_ActivityOverDate').val(), $('#J_ActivityOverTime').val());
                            var entryEndDate = this.parseDate($('#J_ActivityEntryOverDate').val(), $('#J_ActivityEntryOverTime').val());

                            var ticketArr = [];
                            var guestArr = [];
                            var sponorArr = [];
                            var fieldArr = [];
                            var title = $('#J_ActivityTitle').val();
                            var address = $('#J_ActivityAddr').val();
                            var limit = $('#J_ActivityLimit').val();
                            var content = '';
                            var groupChart = 0;
                            var isPrivacy = 0;
                            //抓取票务信息
                            $('.J_ActivityTicket').each(function(i, item) {
                                var t = $(item).data('result');
                                if (typeof t == 'string') {
                                    t = JsonObj.decode(t);
                                }
                                ticketArr.push(t);
                            });
                            //抓取嘉宾信息
                            $('.J_ActivityGuest').each(function(i, item) {
                                var g = $(item).data('result');
                                if (typeof g == 'string') {
                                    g = JsonObj.decode(g);
                                }
                                guestArr.push(g);
                            });
                            //抓取主办方信息
                            $('.tag[data-type="sponor"]').each(function(i, item) {
                                sponorArr.push($.trim($(item).text()) + '_' + $.trim($(item).data('id')));
                            });
                            //抓取字段信息
                            $('.tag[data-type="field"]').each(function(i, item) {
                                fieldArr.push($.trim($(item).text()));
                            });
                            /*********兼容IE*********/
                            if (title == PLACEHOLDER_TITLE) {
                                title = '';
                            }
                            if (address == PLACEHOLDER_ADDRESS) {
                                address = '';
                            }
                            if (limit == PLACEHOLDER_LIMIT) {
                                limit = 0;
                            }
                            /*********end*********/
                            //判断编辑器是否是提示内容
                            /*  if (um.getContentTxt() != PLACEHOLDER_CONTENT) {
                                  content = um.getContent();
                              }*/
                            //获取是否公开活动
                            /*if ($('#J_ActivityProperty').get(0).checked) {
                                isPrivacy = 1;
                            }*/
                            /* //获取是否配置群聊
                             if ($('#J_GroupChat').get(0).checked) {
                                 groupChart = 1;
                             }*/
                            //数据对象
                            return {
                                id: $('#J_ActivityId').val(),
                                title: $.trim(title),
                                poster: $('#J_ActivityPoster').val(),
                                cityId: $('#J_ActivityCityId').val(),
                                cityName: $('#J_ActivityCity').val(),
                                address: $.trim(address),
                                lng: $('#J_ActivityMapLng').val(),
                                lat: $('#J_ActivityMapLat').val(),
                                beginTime: beginDate.getTime(),
                                endTime: endDate.getTime(),
                                entryEndTime: entryEndDate.getTime(),
                                content: content,
                                type: $('input[name=type]:checked').val(),
                                limit: limit,
                                tickets: ticketArr,
                                guests: guestArr,
                                sponors: sponorArr,
                                fields: fieldArr,
                                groupChart: groupChart,
                                isPrivacy: isPrivacy,
                                isAgreeProtocal: $('#J_ActivityProtocal').get(0).checked ? 1 : 0,
                                status: status,
                                audit: $('input[name=audit]:checked').val(),
                            };
                        },
                        /* //格式化时间对象
                         parseDate: function(yearStr, hourStr) {
                             yearStr = yearStr.split('-');
                             hourStr = hourStr.split(':');
                             var date = new Date();
                             date.setFullYear(yearStr[0], yearStr[1] - 1, yearStr[2]);
                             date.setHours(hourStr[0], hourStr[1], 0, 0);
                             return date;
                         },*/
                        formatDate: function(time) {
                            var oDate = new Date(time);
                            return {
                                day: oDate.getFullYear() + '-' + (oDate.getMonth() + 1).fill() + '-' + oDate.getDate().fill(),
                                hour: oDate.getHours().fill() + ':' + oDate.getMinutes().fill()
                            }
                        },
                        //填充表单
                        fill: function(data) {
                            //海报内容
                            if (data.poster) {
                                var url = data.poster;
                                $('#J_ActivityPoster').val(data.poster);
                                if (data.poster.indexOf('http') === -1) {
                                    url = imageUrl + data.poster + suffixPoster;
                                }
                                $('.J_PosterUploader .upload-result').html('<img src="' + url + '">');
                            }
                            //活动标题
                            $('#J_ActivityTitle').val(data.title);
                            //城市
                            $('#J_ActivityCityId').val(data.cityId);
                            $('#J_ActivityCity').val(data.cityName);
                            //地址
                            $('#J_ActivityAddr').val(data.address);
                            if (data.address) {
                                $('#J_ActivityAddr').removeAttr('readonly');
                            }
                            $('#J_ActivityMapLng').val(data.lng);
                            $('#J_ActivityMapLat').val(data.lat);
                            //开始时间
                            if (data.beginTime) {
                                var bDate = this.formatDate(data.beginTime);
                                $('#J_ActivityStartDate').val(bDate.day);
                                $('#J_ActivityStartTime').val(bDate.hour);
                            }
                            //结束时间
                            if (data.endTime) {
                                var eDate = this.formatDate(data.endTime);
                                $('#J_ActivityOverDate').val(eDate.day);
                                $('#J_ActivityOverTime').val(eDate.hour);
                            }
                            //截止时间
                            if (data.entryEndTime) {
                                var entDate = this.formatDate(data.entryEndTime);
                                $('#J_ActivityEntryOverDate').val(entDate.day);
                                $('#J_ActivityEntryOverTime').val(entDate.hour);
                            }
                            //主办方
                            for (var i = 0, len = data.sponors.length; i < len; i++) {
                                var item = data.sponors[i];
                                other.createTag($('.J_BtnAddTag[data-type="sponor"]'), 'sponor', item);
                            }
                            //活动详情
                            if (um) um.setContent(data.content);
                            //活动类型
                            if (data.type == 1) { //收费
                                $('#J_RadioFree').removeAttr('checked');
                                $('#J_RadioFee').attr('checked', '');
                                $('.J_LayoutFree').hide();
                                $('.J_LayoutFee').show();
                                $('.J_FeeTips').show();
                                for (var i = 0, len = data.tickets.length; i < len; i++) {
                                    var item = data.tickets[i];
                                    item.result = JsonObj.encode(item);
                                    ticket.createTicket(item);
                                }
                                //审核
                                $('.J_audit').hide();
                            } else { //免费
                                $('#J_RadioFree').attr('checked', '');
                                $('#J_RadioFee').removeAttr('checked');
                                $('.J_LayoutFree').show();
                                $('.J_LayoutFee').hide();
                                $('.J_FeeTips').hide();
                                //人数限制
                                $('#J_ActivityLimit').val(data.limit);
                                //审核
                                $('.J_audit').show();
                            }
                            //嘉宾
                            for (var i = 0, len = data.guests.length; i < len; i++) {
                                var item = data.guests[i];
                                item.result = JsonObj.encode(item);
                                guest.createGuest(item);
                            }
                            //自定义报名表单
                            for (var i = 0, len = data.fields.length; i < len; i++) {
                                var item = data.fields[i];
                                other.createTag($('.J_BtnAddTag[data-type="field"]'), 'field', item);
                            }
                            //配置群聊
                            if (data.groupChart) {
                                $('#J_GroupChat').attr('checked', 'true');
                            } else {
                                $('#J_GroupChat').removeAttr('checked');
                            }
                            //属性
                            if (data.isPrivacy) {
                                $('#J_ActivityProperty').attr('checked', 'true');
                            } else {
                                $('#J_ActivityProperty').removeAttr('checked');
                            }

                            //if (data.guests.length || data.fields.length || data.isPrivacy) $('#J_HighInfo').show();
                        },
                        //清除表单
                        reset: function() {
                            //海报内容
                            $('#J_ActivityPoster').val('');
                            $('.J_PosterUploader .upload-result').html('封面');
                            //活动标题
                            $('#J_ActivityTitle').val('');
                            //城市
                            $('#J_ActivityCityId').val('');
                            $('#J_ActivityCity').val('');
                            //地址
                            $('#J_ActivityAddr').val('');
                            $('#J_ActivityMapLng').val('');
                            $('#J_ActivityMapLat').val('');
                            //开始时间
                            $('#J_ActivityStartDate').val('');
                            //结束时间
                            $('#J_ActivityOverDate').val('');
                            //截止时间
                            $('#J_ActivityEntryOverDate').val('');
                            //主办方
                            $('.tag[data-type="sponor"]').remove();
                            //活动详情
                            if (um) um.setContent('');
                            //活动类型
                            $('#J_RadioFree').attr('checked');
                            $('#J_RadioFee').removeAttr('checked');
                            $('#J_RadioA0').attr('checked');
                            $('#J_RadioA1').removeAttr('checked');
                            $('.J_LayoutFree').show();
                            $('.J_LayoutFee').hide();
                            $('.J_FeeTips').hide();
                            //票种
                            $('.J_ActivityTicket').remove();
                            //人数限制
                            $('#J_ActivityLimit').val('');
                            //嘉宾
                            $('.J_ActivityGuest').remove();
                            //自定义报名表单
                            $('.tag[data-type="field"]').remove();
                            //配置群聊
                            $('#J_GroupChat').attr('checked');
                            //属性
                            $('#J_ActivityProperty').removeAttr('checked');
                        }
                };

                var type = 0;
                var validate = null;
                var account = {
                    init: function() {
                        var _self = this;
                        $('input[name="payType"]').on('click', function() {
                            if (this.value != type) {
                                validate.resetForm();
                                type = this.value;
                                if (this.value == 3) {
                                    $('.J_BankInfo').slideDown();
                                    $('#J_Bank').rules("add", {
                                        required: true,
                                        messages: {
                                            required: "请填写银行名称"
                                        }
                                    });
                                    $('#J_Deposit').rules("add", {
                                        required: true,
                                        messages: {
                                            required: "请填写开户行名称"
                                        }
                                    });
                                    $('#J_DialogAccount').find('.dialog-body').css('overflow', 'auto');
                                } else {
                                    $('.J_BankInfo').slideUp();
                                    $('#J_Bank').rules("remove", 'required');
                                    $('#J_Deposit').rules("remove", 'required');
                                }
                            }
                        });
                        this.validate(function() {
                            _self.save();
                        });
                        $('#J_BtnSaveAccount').on('click', function() {
                            $('.J_FormAccount').submit();
                        });
                    },
                    save: function() {
                        if (repeatFlag) return false;
                        repeatFlag = true;
                        var arr = $('.J_FormAccount').serializeArray();
                        var data = {};
                        for (var i = 0; i < arr.length; i++) {
                            var item = arr[i];
                            data[item['name']] = item['value'];
                        }
                        common.loading('保存中...', function(hide) {
                            $.ajax({
                                url: $('.J_FormAccount').attr('action'),
                                dataType: "json",
                                data: data,
                                success: function(res) {
                                    //console.log(res);return false;
                                    if (res.status) {
                                        notice.alert(res.msg, function() {
                                            activity.submitData();
                                        }, 500);
                                    } else {
                                        notice.alert(res.msg);
                                    }
                                },
                                error: function(xhr, code, error) {
                                    notice.alert(error);
                                },
                                complete: function() {
                                    dialog.close($('#J_DialogAccount'));
                                    hide();
                                    repeatFlag = false;
                                }
                            });
                        });
                    },
                    validate: function(callback) {
                        validate = $('.J_FormAccount').validate({
                            //验证字段
                            rules: {
                                name: "required",
                                tel: "required",
                                company: "required",
                                account: "required"
                            },
                            //验证提示
                            messages: {
                                name: "联系人姓名不能为空",
                                tel: "联系人电话不能为空",
                                company: "收款人/公司名称不能为空",
                                account: "收款账号不能为空"
                            },
                            //验证完毕后提交事件
                            submitHandler: function(form) {
                                if ($('input[name="payType"]:checked').val() == null) {
                                    notice.alert('收款方式不能为空');
                                    return false;
                                }
                                if (!$('#J_AccountIdcard').val() && !$('#J_AccountLicense').val()) {
                                    notice.alert('请上传证件');
                                    return false;
                                }
                                callback && callback();
                            }
                        });
                    }
                };
                var cache = {
                    _defaultData: null,
                    init: function() {
                        var _self = this;
                        $('.J_ClearCache').on('click', function() {
                            _self.clean();
                            formObj.reset();
                            $('.J_CacheTips').fadeOut();
                        });
                        $('.J_SaveCache').on('click', function() {
                            $('.J_CacheTips').fadeOut();
                        });
                        if (window.localStorage) {
                            /* um.ready(function() {
                                 _self._defaultData = JsonObj.encode(formObj.formatData(2));
                                 var activityData = localStorage.getItem(KEY_DATA_ACTIVITY);
                                 if (activityData != null && activityData != _self._defaultData) {
                                     $('.J_CacheTips').fadeIn();
                                     activityData = JsonObj.decode(activityData);
                                     formObj.fill(activityData);
                                 } else {
                                     $('#J_GroupChat').attr('checked', 'true');
                                 }
                                 interval = setInterval(function() {
                                     _self.save();
                                 }, CACHE_TIME);
                             });*/
                        }
                    },
                    save: function() {
                        var data = formObj.formatData(2);
                        data = JsonObj.encode(data);
                        var _cache = localStorage.getItem(KEY_DATA_ACTIVITY);
                        if (data != _cache) {
                            localStorage.setItem(KEY_DATA_ACTIVITY, data);
                        }
                    },
                    clean: function() {
                        if (window.localStorage) {
                            localStorage.setItem(KEY_DATA_ACTIVITY, '');
                            localStorage.removeItem(KEY_DATA_ACTIVITY);
                            localStorage.clear();
                        }
                    }
                };

                /* var map = {
                     _init: 0,
                     city: "",
                     point: null,
                     init: function() {
                         this.city = $.trim($('#J_ActivityCity').val());
                         if (window.baiduMap == undefined) {
                             // 百度地图API功能
                             var baiduMap = new BMap.Map("J_ActivityAddressMap");
                             baiduMap.centerAndZoom(this.city, 16);
                             baiduMap.setCurrentCity(this.city);
                             baiduMap.addControl(new BMap.OverviewMapControl());
                             baiduMap.addControl(new BMap.NavigationControl());
                             baiduMap.enableScrollWheelZoom(true);
                             window.baiduMap = baiduMap;
                         }
                         window.baiduMap.clearOverlays();
                     },
                     loadMap: function() {
                         var _self = this;
                         _self.init()
                         try {
                             var city = $('#J_ActivityCity').val();
                             var address = $.trim($('#J_ActivityAddr').val());
                             //创建地址解析器实例
                             var geocoder = new BMap.Geocoder();
                             //将地址解析结果显示在地图上，并调整地图视野
                             geocoder.getPoint(city + address, function(point) {
                                 if (point) {
                                     _self.point = point;
                                 }
                                 if (null == _self.point || (_self.point.lng == 0 && _self.point.lat == 0)) {
                                     _self.point = window.baiduMap.getCenter();
                                 }
                                 var excuTime = 10;
                                 if (_self._init == 0) {
                                     _self._init = 1;
                                     excuTime = 500;
                                 }
                                 setTimeout(function() {
                                     _self.setMapEvent();
                                 }, excuTime);
                                 if (_self.point != null) {
                                     $('#J_ActivityMapLng').val(_self.point.lng);
                                     $('#J_ActivityMapLat').val(_self.point.lat);
                                 }
                             }, _self.city);
                         } catch (e) {}
                     },
                     setMapEvent: function() {
                         var _self = this;
                         if (null == _self.point || (_self.point.lng == 0 && _self.point.lat == 0)) {
                             setTimeout(function() {
                                 _self.loadMap();
                             }, 1000)
                             return false;
                         }
                         window.baiduMap.centerAndZoom(_self.point, 16);
                         var options = {
                             "anchor": new BMap.Size(12, 38)
                         };
                         var size = new BMap.Size(24, 38);
                         var mark1 = "http://fed.welian.com/common/mark1.png";
                         var mark2 = "http://fed.welian.com/common/mark2.png";
                         var icon1 = new BMap.Icon(mark1, size, options);
                         var icon2 = new BMap.Icon(mark2, size, options);
                         var baiduMapMarker = new BMap.Marker(_self.point, {
                             icon: icon1
                         });
                         baiduMapMarker.enableDragging();
                         baiduMapMarker.addEventListener("dragend", function(e) {
                             $('#J_ActivityMapLng').val(e.point.lng);
                             $('#J_ActivityMapLat').val(e.point.lat);
                             //创建地址解析器实例
                             var geocoder = new BMap.Geocoder();
                             //将地址解析结果显示在地图上，并调整地图视野
                             geocoder.getLocation(e.point, function(data) {
                                 var address = data.addressComponents;
                                 $('#J_ActivityAddr').val(address.district + address.street + address.streetNumber);
                             });
                         });
                         baiduMapMarker.addEventListener("onmouseover", function() {
                             baiduMapMarker.setIcon(icon2);
                         });
                         baiduMapMarker.addEventListener("onmouseout", function() {
                             baiduMapMarker.setIcon(icon1);
                         });
                         window.baiduMap.addOverlay(baiduMapMarker);
                     }
                 };*/

                /*window.onload = function() {
                    console.log("ccbbaa");
                    activity.init();
                }*/
                activity.init();

            });