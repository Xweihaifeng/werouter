$(document).ready(function(){

	start();

	function GetQueryString(name) {
	    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	    var r = window.location.search.substr(1).match(reg);
	    if (r != null) return unescape(r[2]);
	    return null;
	}

	var set = {
		all: [],
		select: GetQueryString('type'),
		weid: GetQueryString('weid'),
		token: sessionStorage.getItem('token')
	};

	var authority = (select, weid) => {
		var reqUrl = ApiUrl + 'admins/get_' + select + '?role_id=' + weid;
		d = new dTree('d');
		d.add(0, -1, '后台管理');

		var req = (reqUrl) => {
			return new Promise((resolve, reject) => {
				$.ajax({
					url: reqUrl,
					headers: {
						'Token': set.token
					},
					success: function(data) {
						resolve(data);
					},
					error: function(xhr) {
						console.log(xhr)
					}
				})
			})
		}

		req(reqUrl).then((resp) => {
			d = new dTree('d');
			d.add(0, -1, '后台管理');
			var rem = [];
			var send = [];			
			var depth = 'i';
			var process = function(data, depth){
				data.map((e, i) => {
					rem.push({id: e.id, value: depth + i, pid: e.parent_id, name: e.name, checked: e.checked, url: e.url, mark: e.mark});
					set.all.push(e);
					if (e.children != undefined && e.children != '' && e.children != 'undefined') {
						process(e.children, depth + 'i');
					}
				})
			}

			var genTree = data => data.map(e => d.add(e.id, e.pid, 'm', e.pid, e.name, e.checked, false))

			process(resp, depth);
			genTree(rem);

			var id = document.getElementById("res");
			id.innerHTML = d;
			d.openAll();
		})
	}

	function transData(a, idStr, pidStr, childrenStr) {
	    var r = [], hash = {}, id = idStr, pid = pidStr, children = childrenStr, i = 0, j = 0, len = a.length;  
	    for(; i < len; i++){  
	        hash[a[i][id]] = a[i];  
	    }  
	    for(; j < len; j++){  
	        var aVal = a[j], hashVP = hash[aVal[pid]];  
	        if(hashVP){  
	            !hashVP[children] && (hashVP[children] = []);
	            hashVP[children].push(aVal);
	        }else{  
	            r.push(aVal);  
	        }
	    }  
	    return r;  
	}

	function test(select, weid) {
		var sendUrl = ApiUrl + 'admins/set_' + select;
		var count = 0;
		var obj = document.all.m;	
		var res = [];
		var find = (ls, id) => ls.filter(x => x.id == id);
		for(i=0;i<obj.length;i++){
			if(obj[i].checked){
				res.push(obj[i].id);
				count ++;
			}
		}
		res = res.map(x => find(set.all, x.substr(2))).map(x => x[0]);
		for (let i = 0; i < res.length; i++) {
			delete res[i]['children'];
		}

		var sendData = transData(res, 'id', 'parent_id', 'children');
		var data = {};
		data['role_id'] = weid;
		data[select] = sendData;
		console.log(data);
		$.ajax({
			url: sendUrl,
			type: 'POST',
			headers: {
				'Token': set.token
			},
			data: data,
			success: function(data) {
				if (data.code === 200) {
                    swal('提示', '保存成功', 'success');
                } else {
                    swal('提示', data.message, 'error');
                }
			},
			error: function(xhr) {
				console.log(xhr)
			}
		})
	}

	authority(set.select, set.weid);

	$("#test").click(function(){
		test(set.select, set.weid);
	})

})