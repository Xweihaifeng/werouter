let resp;
const reqArtList = (url, userid) => {
	$.ajax({
		url: url + userid,
		type: 'GET',
		async: false,
		success: function(data){
			if (data.code == 200) {
				//console.log(data)
				resp = data;
			}
		},
		error: function(xhr) {
			console.log(xhr);
		}
	})
}

const reqUserId = (url, domain) => {
	$.ajax({
		url: url + domain,
		type: 'GET',
		async: false,
		success: function(data) {
			if (data.code == 200) {
				//console.log(data)
				let userid = data.data.plat_user_id;
				let info = {
					user_id: userid
				}
				reqArtList(ARTICLE_LIST + '?userId=', userid);
			}
		},
		error: function(xhr) {
			console.log(xhr);
		}
	})
}

let domain = window.location.pathname.split('/')[1];
reqUserId('http://new.wezchina.com/api/pages/page/getDetailByDomain/', domain);

const my_article = resp;


/*let resp;
const reqDynamicList = (url) => {
	$.ajax({
		url: url,
		type: 'GET',
		async: false,
		success: function(data){
			if (data.code == 200) {
				resp = data.data.list;
				console.log(resp)
			}
		},
		error: function(xhr) {
			console.log(xhr);
		}
	})
}

let type = 1;
let domain = window.location.pathname.split('/')[1];
let dynamic_type = 1;
reqDynamicList('http://new.wezchina.com/api/circel/dynamic?type=' + type + '&domain=' + domain + '&dynamic_type=' + dynamic_type);

const my_article = resp;*/
