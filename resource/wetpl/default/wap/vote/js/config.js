const host = 'http://' + window.location.host + '/api';
const globalHost = host;

var qiniu;
$.ajax({
	url: host + '/settings',
	type: 'get',
	async: false,
	success: function(data) {
		// console.log(data.data);
		qiniu = 'http://' + data.data.qiniu.domain_custom + '/'; 
	},
	error: function(xhr) {
		console.log(xhr);
	}
})

const ApiMaterPlatQiniuDomain = qiniu;
// const ApiMaterPlatQiniuDomain = 'http://images.new.wezchina.com/';
