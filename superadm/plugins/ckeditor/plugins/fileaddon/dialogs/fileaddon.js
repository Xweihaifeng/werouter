/**
 * 弹出框配置
 * zhushuha<zhushuha@gmail.com>
 */
(function() {
    CKEDITOR.dialog.add("fileaddon",
        function(a) {
            return {
                title: "上传附件",
                minWidth: "500px",
                minHeight: "500px",
                width: "500px",
                contents: [{
                    id: "tab1",
                    label: "",
                    title: "",
                    expand: true,
                    style: "width:500px;height:150px;",
                    padding: 0,
                    elements: [{
                        type: "html",
                        style: "width:500px;height:500px",
                        html: `<style>
                                    .form-container .form-item {
                                        margin-top: 20px;
                                    }
                                    
                                    .form-container .form-label {
                                        display: inline-block;
                                        width: 50px;
                                        text-align: right;
                                    }
                                    .form-contaner input {
                                        border: #ccc 1px solid;
                                        height: 25px;
                                    }
                                </style>
                        <div class="form-container">
                                <div class="form-item" style="margin-top: 20px;">
                                    <span class="form-label" style="display: inline-block;width: 50px;text-align: right;">文件</span>
                                    <span><input id="file-container" type="text" value="" style="border: #ccc 1px solid;height: 25px;width:200px"></span>
                                    <input id="file-url" type="hidden" value="">
                                    <span><a id="file-browse" style="cursor:pointer;">选择文件</a></span>
                                </div>
                                <div class="form-item">
                                    <span class="form-label" style="display: inline-block;width: 50px;text-align: right;">展示名</span>
                                    <span><input id="link-title" type="text" style="border: #ccc 1px solid;height: 25px;width:200px"></span>
                                </div>
                            </div>`
                    }]
                }],
                onShow: function() {
                    var uploader = Qiniu.uploader({
                        runtimes: 'html5,flash,html4',
                        browse_button: 'file-browse',
                        uptoken_url: ApiUrl + 'file/qiniu_token',
                        get_new_uptoken: false,
                        domain: ApiMaterPlatQiniuDomain,
                        max_file_size: '100mb',
                        flash_swf_url: 'http://cdn.staticfile.org/plupload/2.1.8/Moxie.swf',
                        max_retries: 3,
                        chunk_size: '4mb',
                        auto_start: true,
                        filters: {
                            max_file_size: '5mb',
                            prevent_duplicates: true,
                            // Specify what files to browse for
                            mime_types: [{
                                title: "addons",
                                extensions: "docx,doc,xls,xlsx,ppt,pptx,png,jpg,jpeg,gif,bmp,rar,zip,txt,mp4,flv,avi"
                            }, ]
                        },
                        init: {
                            'FileUploaded': function(up, file, info) {
                                var domain = up.getOption('domain');
                                res = JSON.parse(info.response);
                                $("#file-container").val(res.key);
                                var sourceLink = domain + res.key;
                                $("#file-url").val(sourceLink);
                            },
                            'Key': function(up, file) {
                                var key = "addons/";
                                key += new Date().valueOf() + '.' + file.name.substring(file.name.indexOf('.') + 1);
                                return key;
                            }
                        }
                    });
                },
                onOk: function() {
                    if ($("#file-url").val().length === 0) {
                        alert('请选择文件');
                        return false;
                    }
                    if ($("#link-title").val().length === 0) {
                        alert('请填写链接展示文本');
                        return false;
                    }
                    a.insertHtml('<a href="' + $("#file-url").val() + '" target="_blank" title="' + $("#link-title").val() + '">' + $("#link-title").val() + '</a>');
                }
            }
        })
})();