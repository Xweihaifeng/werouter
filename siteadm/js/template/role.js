$(document).ready(function(){
	start();
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

	// function test(select, weid) {
	// 	var sendUrl = ApiUrl + 'admins/set_' + select;
	// 	console.log(sendUrl)
	// 	var count = 0;
	// 	var obj = document.all.m;
	// 	var res = [];
	// 	var find = (ls, id) => ls.filter(x => x.id == id);
	// 	for(i=0;i<obj.length;i++){
	// 		if(obj[i].checked){
	// 			res.push(obj[i].id);
	// 			count ++;
	// 		}
	// 	}
	// 	res = res.map(x => find(set.all, x.substr(2))).map(x => x[0]);
	// 	for (let i = 0; i < res.length; i++) {
	// 		res[i]['checked'] = true;
	// 		delete res[i]['children'];
	// 	}
	// 	var sendData = transData(res, 'id', 'parent_id', 'children');
	// 	console.log(sendData);
	// 	var data = {};
	// 	data['role_id'] = weid;
	// 	data[select] = sendData;
    //
		// $.ajax({
		// 	url: sendUrl,
		// 	type: 'POST',
		// 	headers: {
		// 		'Token': set.token
		// 	},
		// 	data: data,
		// 	success: function(data) {
		// 		if (data.code === 200) {
    //                 swal('', '保存成功', 'success');
    //             } else {
    //                 swal('', data.message, 'error');
    //             }
		// 	},
		// 	error: function(xhr) {
		// 		console.log(xhr)
		// 	}
		// })
    // }


	// 默认菜单
	authority('config', weid, 'res', '后台管理');

	// 保存菜单
	$("#test").click(function(){
		test('config', weid);
	})

    // 保存频道
    $("#channel").click(function(){
        test('channel', weid);
    })
})