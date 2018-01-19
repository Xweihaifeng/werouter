;(function(window, document) {
	function mobileMedia(options) {
		this.options = options;
	}
	mobileMedia.prototype.mm = function() {
		var minWidth = this.options.minWidth || 'min';
		var maxWidth = this.options.maxWidth || 'max';
		var rootSize = this.options.rootSize || 20;
		var designWidth = this.options.designWidth || 640;
		var windowSize = this.options.windowSize || true;
		var fontProportion = designWidth / rootSize;
		media();

		function media() {
			var winWidth = window.innerWidth;
			var body = document.getElementsByTagName("body")[0];
			var html = document.getElementsByTagName("html")[0];
			var fontSize;
			if(minWidth != 'min') {
				body.style.minWidth = minWidth + 'px';
			}
			if(maxWidth != 'max') {
				body.style.maxWidth = maxWidth + 'px';
				body.style.margin = '0 auto';
			}
			if(winWidth <= minWidth) {
				fontSize = minWidth / fontProportion;
			} else
			if(winWidth >= maxWidth) {
				fontSize = maxWidth / fontProportion;
			} else {
				fontSize = winWidth / fontProportion;
			}
			html.style.fontSize = fontSize + 'px';
		};
		if(windowSize) {
			window.onresize = function() { media(); }
		}
	};
	var mobile = new mobileMedia({
		minWidth: 320, //设置最小窗口 
		maxWidth: 750, //设置最大窗口
		rootSize: 100, //设置根字体大小
		designWidth: 750, //设计稿大小
		windowSize: true //是否开启窗口响应
	});
	mobile.mm();
}(window, document));