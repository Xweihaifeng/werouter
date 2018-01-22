CKEDITOR.editorConfig = function(config) {
    config.plugins = 'dialogui,dialog,a11yhelp,autogrow,dialogadvtab,basicstyles,blockquote,clipboard,button,panelbutton,panel,floatpanel,colorbutton,templates,menu,contextmenu,resize,toolbar,elementspath,enterkey,entities,popup,filebrowser,find,floatingspace,listblock,richcombo,font,format,htmlwriter,wysiwygarea,image,imagepaste,indent,indentblock,indentlist,justify,fakeobjects,link,list,maximize,pastetext,pastefromword,removeformat,sourcearea,table,tabletools,undo,notification,liststyle,lineutils,widget,filetools,notificationaggregator,uploadwidget,uploadimage,markdown,codesnippet,fileaddon';
    config.skin = 'moono';
    config.uiColor = '#F1F5F2';
    config.filebrowserImageBrowseUrl = "";
    config.filebrowserFlashBrowseUrl = "";
    config.filebrowserImageUploadUrl = "";
    config.autoParagraph = false;
    config.enterMode = CKEDITOR.ENTER_BR;
    config.shiftEnterMode = CKEDITOR.ENTER_P;
    config.removeButtons = 'Cut,Copy,Paste,Italic,Underline,Strike,CreateDiv,JustifyBlock,Anchor,Styles,Font,BGColor';
    config.autoGrow_onStartup = true;
    config.autoGrow_minHeight = 300;
    config.autoGrow_maxHeight = 450;
    config.autoGrow_bottomSpace = 50;
    //config.allowedContent = true;

    // self plugins
    config.extraPlugins = 'haoVideo';

};