/**
 * 附件上传
 * zhushuha<zhushuha@gmail.com>
 */
CKEDITOR.plugins.add("fileaddon", {
    requires: ["dialog"],
    init: function(a) {
        a.addCommand("fileaddon", new CKEDITOR.dialogCommand("fileaddon"));
        a.ui.addButton("fileaddon", {
            label: "上传附件",
            command: "fileaddon",
            icon: this.path + "fileaddon.png"
        });
        CKEDITOR.dialog.add("fileaddon", this.path + "dialogs/fileaddon.js");
    }

});