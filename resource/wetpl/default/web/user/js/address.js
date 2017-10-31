/**
 * Created by Hongguang on 2017/8/29.
 */
//判断为空
function isNull(data) {
    return (data == "" || data == undefined || data == null|| data == 'null') ? true: false;
}
// 判断 sessionStorage
if(sessionStorage.lastname == "we_title_1") {
	$("#we_title_1").find(".we-cont").show().parents().siblings().find(".we-cont").hide();
	$("#we_title_1").find(".title-img").css("transform", "rotate(90deg)");
}

	var favicon = ApiMaterPlatQiniuDomain + localStorage.getItem('fav');
	console.log('logo:',favicon);
	$('#favicon').attr('href', favicon);



$(document).ready(function() {
	var currWidth = $(window).height() - 90;
	var currHeight = $(window).height() - 90;
	setHeight(currHeight + 90);
	$("#middle, #right").height(currHeight);

	$(window).resize(function() {
		currWidth = $(window).height() - 90;
		currHeight = $(window).height() - 90;
		setHeight(currHeight + 90);
		$("#middle, #right").height(currHeight);
	})

	$("#add").hover(function() {
		$(".add").show();
	}, function() {
		$(".add").hide();
	})

	$("#avatar, #dropdown").hover(function() {
		$(".avatar").show();
	}, function() {
		$(".avatar").hide();
	})

	$("#avatar-logout span").click(function() {
		localStorage.removeItem('token');
		localStorage.removeItem('weid');
	})
})

//页面渲染接口
var lists = "";
var status1 = "";
var weids = "";
var status_one, status_one_telophone;

var wElist = function() {
	$.ajax({
		type: "GET",
		headers: {
			'Token': localStorage.getItem('token')
		},
		url: apiUrl + "users/address/list",
		dataType: "json",
		success: function(data) {
			if(data.code === 200) {
				console.log(data.data.list.length);
				for(var i = 0; i < data.data.list.length; i++) {
					console.log(data.data.list[i]);

					lists +=
						'<div class="sh-address1" id=' + data.data.list[i].weid + '>' +
						'<div class="media">' +
						'<div class="media-left">' +
						'<a href="#">' +
						'<img class="media-object" src="/common/img/address-img.png" alt="...">' +
						'</a>' +
						'</div>' +
						'<div class="media-body">' +
						'<h4 class="media-heading">' +
						'<span class="we-name">' + data.data.list[i].name + '</span>' +
						'<span class="we-iph">' + data.data.list[i].telophone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2') + '</span>' +
						'</h4>' +
						'<p>' + data.data.list[i].detail + '</p>' +
						'<div class="we-meri">' +
						'<ul>' +
						'<li>' +
						'<a href="#" style="margin-right:5px;" class="default1">设为默认</a>' +
						'<a href="#" class="edit" style="margin-right:5px;">编辑</a>' +
						'<a href="#" class="we-delete" style="margin-right:5px;">删除</a>' +
						'</li>' +
						'</ul>' +
						'</div>' +
						'</div>' +
						'</div>' +
						'</div>';
				}
				$("#form_group_add").append(lists);
				console.log($(".we-iph").length);

				for(var i = 0; i < $(document.getElementsByClassName("sh-address1")).length; i++) {
					console.log($(document.getElementsByClassName("sh-address1"))[i]);
					//					$(".we-iph").eq(i).children().remove();
					if(data.data.list[i].status == 1) {
						$(".we-iph").eq(i).append("<i>默认地址</i>");
					}

				}
				//判断默认地址

				//首次创建默认地址
				//	$(".sh-address1").find(".we-iph").children().remove();
				//	$(".sh-address1:first").find(".we-iph").append("<i>默认地址</i>");

				// 删 除
				$("#form_group_add .sh-address1 .we-delete").on("click", function() {
					var $that = $(this);
					console.log($(this).index());
					var weid = '';
					layer.open({
						type: 1,
						title: "删除",
						skin: '', //加上边框
						area: ['300px', '200px'], //宽高
						content: '<div style="margin-top:30px;">' +
							'<img src="/common/img/Notice.png" style="display:block;margin:0 auto;"/>' +
							'<div style="width:150px;margin:20px auto;"><button class="btn btn-default" type="button" id="add_btn">确认</button><button class="btn btn-default" type="button" style="float:right;" id="cancel">取消</button></div>' +
							'</div>',
						success: function() {
							$("#add_btn").on("click", function() {
									console.log($that.parents(".sh-address1")[0].getAttribute("id"));
									weid = $that.parents(".sh-address1")[0].getAttribute("id");
									$.ajax({
										type: "GET",
										headers: {
											'Token': localStorage.getItem('token')
										},
										url: apiUrl+"users/address/destroy/" + weid,
										dataType: "json",
										success: function(data) {
											console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
											console.log("data", data);

										}

									})
									$that.parents(".sh-address1").remove();
									layer.closeAll();
								}),
								$("#cancel").on("click", function() {
									layer.closeAll();
								})
						}
					});
				});

				//编辑
				$("#form_group_add .sh-address1 .edit").on("click", function() {
					var index1 = $(this).parents(".sh-address1");
					console.log("index1", index1);
					$.ajax({
						type: "GET",
						headers: {
							'Token': localStorage.getItem('token')
						},
						url: apiUrl+"users/address/list",
						dataType: "json",
						success: function(data) {
							console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
							console.log("data", data);
							console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
							var as = data.data.list;

							var newDatali = as.map(function(item) {

								if(item.weid == index1[0].getAttribute("id")) {
                                   prov(item);
									$("#add_Consignee").val(item.name);
									$("#add_address1").val(item.detail);
									$("#add_iphone1").val(item.telophone);
									$("#add_Code").val(item.zipcode);
									$("#add_receipt").attr('data-item-weid',item.weid);





								}

							})
							//
						}

					})

					console.log(index1);

					var prov=function(dataitem){
					//页面层
					layer.open({
						type: 1,
						title: "修改收货地址",
						skin: '', //加上边框
						area: ['800px', '600px'], //宽高
						content: '<div class="we-contai"><form>' +
							'<div class="form-group">' +
							'<label for="exampleInputEmail1" class="we-xing">收货人：</label>' +
							' <input type="text" class="form-control" id="add_Consignee" placeholder="" style="margin-top:10px;width:250px;">' +
							'</div>' +
							'<div class="form-group">' +
							' <label for="exampleInputPassword1" class="we-xing">所在地区：</label>' +
							' <div id="Bitchy"><select class="form-control" id="we_province2"></select><select class="form-control" id="we_city3"></select><select class="form-control" id="we_area5"></select></div>' +
							'</div>' +
							'<div class="form-group">' +
							'<label for="exampleInputEmail1" class="we-xing">详细地址：</label>' +
							' <input type="text" class="form-control" id="add_address1" placeholder="" style="margin-top:10px;width:500px;">' +
							'</div>' +
							'<div class="form-group">' +
							'<label for="exampleInputEmail1" class="we-xing">手机号码：</label>' +
							' <input type="text" class="form-control" id="add_iphone1" placeholder="" style="margin-top:10px;width:500px;">' +
							'</div>' +
							'<div class="form-group">' +
							'<label for="exampleInputEmail1" class="we-xing">邮政编码：</label>' +
							' <input type="text" class="form-control" id="add_Code" placeholder="" style="margin-top:10px;width:500px;">' +
							'</div>' +
							'<button type="button" class="btn btn-danger" id="add_receipt">保存收货地址</button>' +
							'</form></div>',
						success: function(layero, index) {

							//省
							var item_id;
							$.ajax({
								type: "GET",
								headers: {
									'Token': localStorage.getItem('token')
								},
								url: apiUrl+"province/list",
								dataType: "json",
								success: function(data) {
									console.log(data);
									if(data.code === 200) {
										//拿到省的id
										Province = data.data.list;
										Province.map(function(item) {
											item_id = item.id
											console.warn(item_id);

										});
										var we_province11 = "";
										data.data.list.forEach(function(value, index) {
											if(dataitem.province_id==data.data.list[index].id){
												we_province11 += "<option id=" + data.data.list[index].id + " selected='selected'>" + data.data.list[index].name + "</option>"
                                            }else{
                                           		we_province11 += "<option id=" + data.data.list[index].id + ">" + data.data.list[index].name + "</option>"
                                            }
										})
										$("#we_province2").append(we_province11);
										//						console.log();
											if(isNull(dataitem.province_id)){
												var weHaH = $("#we_province2").children().attr("id");
											}else{
		                                        var weHaH =dataitem.province_id;
											}
										//
										console.log(weHaH);
										//市
										$.ajax({
											type: "GET",
											headers: {
												'Token': localStorage.getItem('token')
											},
											url: apiUrl+"area/list/" + weHaH,
											dataType: "json",
											success: function(data) {
												console.log(data);
												if(data.code === 200) {
													var we_city11 = "";
													data.data.list.forEach(function(value, index) {
														if(dataitem.area_id==data.data.list[index].id){

														we_city11 += "<option id=" + data.data.list[index].id + " selected='selected'>" + data.data.list[index].name + "</option>";
													}else{
														we_city11 += "<option id=" + data.data.list[index].id + ">" + data.data.list[index].name + "</option>";
													}
													})
													$("#we_city3").append(we_city11);
													 if(isNull(dataitem.area_id)){
	                                                     var countyid=$('#we_city3 option:selected').attr('id')
	                                                 }else{
	                                                 	var countyid=dataitem.area_id;
	                                                 }
													// 区
													$.ajax({
														type: "GET",
														headers: {
															'Token': localStorage.getItem('token')
														},
														url: apiUrl+"county/list/" + countyid,
														dataType: "json",
														success: function(data) {

															if(data.code === 200) {
																var we_area_p112 = "";
																data.data.list.forEach(function(value, index) {
																	if(dataitem.county_id==data.data.list[index].id){
                                                                      we_area_p112 += "<option id=" + data.data.list[index].id + " selected='selected' >" + data.data.list[index].name + "</option>";
																	}else{
																		we_area_p112 += "<option id=" + data.data.list[index].id + ">" + data.data.list[index].name + "</option>";
																	}

																})
																$("#we_area5").html(we_area_p112);
															}
														},
														error: function() {
															console.log("出错了");
														}
													});
												}
											},
											error: function() {
												console.log("出错了");
											}
										});
									}
								},
								error: function() {
									console.log("出错了");
								}
							});

							//触发省级变更市级
							$("#we_province2").on("change", function(e) {
								$("#we_area5").find("option").remove();
								$.ajax({
									type: "GET",
									headers: {
										'Token': localStorage.getItem('token')
									},
									url: apiUrl+"area/list/" + $('#we_province2 option:selected').attr('id'),
									dataType: "json",
									success: function(data) {
										//				console.log(data);
										if(data.code === 200) {
											var we_city_oo = "";
											data.data.list.forEach(function(value, index) {
												console.warn(data.data.list[index])
												we_city_oo += "<option id=" + data.data.list[index].id + ">" + data.data.list[index].name + "</option>";
											})
											$("#we_city3").html(we_city_oo);
										}
									},
									error: function() {
										console.log("出错了");
									}
								});
							});

							// 市级触发
							$("#we_city3").on("change", function() {
								$.ajax({
									type: "GET",
									headers: {
										'Token': localStorage.getItem('token')
									},
									url: apiUrl+"county/list/" + $('#we_city3 option:selected').attr('id'),
									dataType: "json",
									success: function(data) {
										console.log(data);
										if(data.code === 200) {
											var we_area_p11 = "";
											data.data.list.forEach(function(value, index) {
												we_area_p11 += "<option id=" + data.data.list[index].id + ">" + data.data.list[index].name + "</option>";
											})
											$("#we_area5").html(we_area_p11);
										}
									},
									error: function() {
										console.log("出错了");
									}
								});
							});

							$("#add_receipt").on("click", function() {
								var add_Consignee = $("#add_Consignee").val();
								var add_address1 = $("#add_address1").val();
								var add_iphone1 = $("#add_iphone1").val();
								var add_Code = $("#add_Code").val();
								var province = $("#we_province2 option:selected").attr('id');
								// console.log($("#we_province2 option:selected").attr('id'))
								var city = $("#we_city3 option:selected").attr('id');
								var county = $("#we_area5 option:selected").attr('id');
								var weid=$(this).attr('data-item-weid');
								console.log(city)

								$.ajax({
									type: "POST",
									headers: {
										'Token': localStorage.getItem('token')
									},
									url: apiUrl+"users/address/update",
									data: {
										weid:weid,
										name: add_Consignee,
										province_id: province,
										area_id: city,
										county_id:county,
										detail: add_address1,
										telophone: add_iphone1,
										zipcode: add_Code,
										status: 2
									},
									dataType: "json",
									success: function(data) {
										if(data.code === 200) {
											layer.closeAll();
											layer.msg('保存成功', {
												time: 2000
											});

											$.ajax({
												type: "GET",
												headers: {
													'Token': localStorage.getItem('token')
												},
												url: apiUrl+"users/address/destroy/" + index1[0].getAttribute("id"),
												dataType: "json",
												success: function(data) {
													console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
													console.log("data", data);
													$(document.getElementById(index1[0].getAttribute("id"))).remove();
													window.history.go(0);
												}

											})

										}
									},
									error: function() {
										console.log("出错了");
									}
								});
							})
						}
					});
 }
				});
				// 设为默认

				$(".default1").on("click", function() {
					//								var status1=0;
					//					var weI = "<i>默认地址</i>";
					//					$(".default1").parents(".we-meri").siblings(".media-heading").find(".we-iph").children().remove();
					//					$(this).parents(".we-meri").siblings(".media-heading").find(".we-iph").append(weI);
					weids = $(this).parents(".sh-address1")[0].getAttribute("id");
					console.log(weids);
					//								status1=1;
					$.ajax({
						type: "POST",
						headers: {
							'Token': localStorage.getItem('token')
						},
						url: apiUrl+"users/address/update",
						data: {
							status: 1,
							weid: weids
						},
						dataType: "json",
						success: function(data) {

							console.log(data);
							window.history.go(0);

						},
						error: function() {
							console.log("出错了");
						}
					});
				});
			}

			//			we_iph();
		},
		error: function() {
			console.log("出错了");
		}
	});
}
wElist(); //调用
var we_province = "";
var we_city = "";
var we_city_o = "";
var Province;
$("#sh_address").on("click", function() {
	//				alert(1);
	//页面层
	layer.open({
		type: 1,
		title: "新建收货地址",
		skin: '', //加上边框
		area: ['800px', '600px'], //宽高
		content: '<div class="we-contai"><form>' +
			'<div class="form-group">' +
			'<label for="exampleInputEmail1" class="we-xing">收货人：</label>' +
			' <input type="text" class="form-control" id="Consignee" placeholder="" style="margin-top:10px;width:250px;">' +
			'</div>' +
			'<div class="form-group">' +
			' <label for="exampleInputPassword1" class="we-xing">所在地区：</label>' +
			' <div id="Bitchy"><select class="form-control" id="we_province"></select><select class="form-control" id="we_city"></select><select class="form-control" id="we_area"></select></div>' +
			'</div>' +
			'<div class="form-group">' +
			'<label for="exampleInputEmail1" class="we-xing">详细地址：</label>' +
			' <input type="text" class="form-control" id="address1" placeholder="" style="margin-top:10px;width:500px;">' +
			'</div>' +
			'<div class="form-group">' +
			'<label for="exampleInputEmail1" class="we-xing">手机号码：</label>' +
			' <input type="text" class="form-control" id="iphone1" placeholder="" style="margin-top:10px;width:500px;">' +
			'</div>' +
			'<div class="form-group">' +
			'<label for="exampleInputEmail1" class="we-xing">邮政编码：</label>' +
			' <input type="text" class="form-control" id="Code" placeholder="" style="margin-top:10px;width:500px;">' +
			'</div>' +
			'<button type="button" class="btn btn-danger">保存收货地址</button>' +
			'</form></div>',
		success: function(layero, index) {
			//			//原生城市-联动
			//			var select = $('.city-picker-select').cityPicker({
			//				dataJson: cityData,
			//				renderMode: false,
			//				autoSelected: true
			//			});
			//
			//			//设置城市
			//			select.setCityVal([{
			//				'id': '610000',
			//				'name': '陕西省'
			//			}, {
			//				'id': '610100',
			//				'name': '西安市'
			//			}, {
			//				'id': '610113',
			//				'name': '雁塔区'
			//			}]);
			$(".btn-danger").on("click", function() {
				var Consignee = $("#Consignee").val();
				var address1 = $("#address1").val();
				var iphone1 = $("#iphone1").val();
				var Code = $("#Code").val();
				var Code1 = $(".province").val();
				var Code2 = $(".city").val();
				if(Consignee.length == 0) {
					layer.msg('收货人不能为空', {
						time: 1500
					});
					return;
				} else if(address1.length == 0) {
					layer.msg('地址不能为空', {
						time: 1500
					});
					return;
				} else if(iphone1.length == 0) {
					layer.msg('手机号不能为空', {
						time: 1500
					});
					return;
				} else if(Code.length == 0) {
					layer.msg('邮政编码不能为空', {
						time: 1500
					});
					return;
				}
				if(!(/^1[34578]\d{9}$/.test(iphone1))) {
					layer.msg('请输入合法的手机号', {
						time: 1500
					});
				} else {
					$.ajax({
						type: "POST",
						headers: {
							'Token': localStorage.getItem('token')
						},
						url: apiUrl+"users/address/store",
						data: {
							name: Consignee,
							province_id: $("#we_province option:selected").attr("id"),
							area_id: $("#we_city option:selected").attr("id"),
							county_id: $("#we_area option:selected").attr("id"),
							detail: address1,
							telophone: iphone1,
							zipcode: Code,
							status: 2
						},
						dataType: "json",
						success: function(data) {
							if(data.code === 200) {
								layer.close(index);
								window.history.go(0);
								layer.msg('保存成功', {
									time: 2000
								});
								console.log(data);
							}
						},
						error: function() {
							console.log("出错了");
						}
					});
				}
			})
			//省
			var item_id;
			$.ajax({
				type: "GET",
				headers: {
					'Token': localStorage.getItem('token')
				},
				url: apiUrl+"province/list",
				dataType: "json",
				success: function(data) {
					console.log(data);
					if(data.code === 200) {
						//拿到省的id
						Province = data.data.list;
						Province.map(function(item) {
							item_id = item.id
							console.warn(item_id);
						});
						var we_province = "";
						data.data.list.forEach(function(value, index) {
							we_province += "<option id=" + data.data.list[index].id + ">" + data.data.list[index].name + "</option>"
						})
						$("#we_province").append(we_province);
						//						console.log();
						var weHaH = $("#we_province").children().attr("id");
						console.log(weHaH);
						//	市
						$.ajax({
							type: "GET",
							headers: {
								'Token': localStorage.getItem('token')
							},
							url: apiUrl+"area/list/" + weHaH,
							dataType: "json",
							success: function(data) {
								console.log(data);
								if(data.code === 200) {
									var we_city = "";
									data.data.list.forEach(function(value, index) {
										we_city += "<option id=" + data.data.list[index].id + ">" + data.data.list[index].name + "</option>";
									})
									$("#we_city").append(we_city);
									//	区
									$.ajax({
										type: "GET",
										headers: {
											'Token': localStorage.getItem('token')
										},
										url: apiUrl+"county/list/" + $('#we_city option:selected').attr('id'),
										dataType: "json",
										success: function(data) {
											console.log(data);
											var we_area = "";
											console.log(data);
											if(data.code === 200) {
												var we_area = "";
												data.data.list.forEach(function(value, index) {
													we_area += "<option id=" + data.data.list[index].id + ">" + data.data.list[index].name + "</option>";
												})
												$("#we_area").append(we_area);
											}
										},
										error: function() {
											console.log("出错了");
										}
									});
								}
							},
							error: function() {
								console.log("出错了");
							}
						});
					}
				},
				error: function() {
					console.log("出错了");
				}
			});
		}
	});
	//触发省级变更市级
	$("#we_province").on("change", function(e) {
		$("#we_area").find("option").remove();
		//		we_city_o = ''
		$.ajax({
			type: "GET",
			headers: {
				'Token': localStorage.getItem('token')
			},
			url: apiUrl+"area/list/" + $('#we_province option:selected').attr('id'),
			dataType: "json",
			success: function(data) {
				if(data.code === 200) {
					we_city_o = '';
					data.data.list.forEach(function(value, index) {
						console.warn(data.data.list[index])
						we_city_o += "<option id=" + data.data.list[index].id + ">" + data.data.list[index].name + "</option>";
					})
					$("#we_city").html(we_city_o);
				}
			},
			error: function() {
				console.log("出错了");
			}
		});
	});

	//市级触发
	$("#we_city").on("change", function() {
		$.ajax({
			type: "GET",
			headers: {
				'Token': localStorage.getItem('token')
			},
			url: apiUrl+"county/list/" + $('#we_city option:selected').attr('id'),
			dataType: "json",
			success: function(data) {
				//				var we_area_p = "";
				if(data.code === 200) {
					var we_area_p = "";
					data.data.list.forEach(function(value, index) {
						we_area_p += "<option id=" + data.data.list[index].id + ">" + data.data.list[index].name + "</option>";
					})
					$("#we_area").html(we_area_p);
				}
			},
			error: function() {
				console.log("出错了");
			}
		});
	});
});

//删除