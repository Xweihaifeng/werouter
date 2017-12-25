/**
 * Created by Hongguang on 2017/8/29.
 */

$(document).ready(function(){
    var currWidth = $(window).height() - 90;
    var currHeight = $(window).height() - 90;
    setHeight(currHeight + 90);
    $("#middle, #right").height(currHeight);

    $(window).resize(function () {
        currWidth = $(window).height() - 90;
        currHeight = $(window).height() - 90;
        setHeight(currHeight + 90);
        $("#middle, #right").height(currHeight);
    })

    $("#add").hover(function () {
        $(".add").show();
    }, function () {
        $(".add").hide();
    })

    $("#avatar, #dropdown").hover(function () {
        $(".avatar").show();
    }, function () {
        $(".avatar").hide();
    })

    $("#avatar-logout span").click(function () {
        localStorage.removeItem('token');
        localStorage.removeItem('weid');
    })
})

//页面渲染接口
			var lists = "";
			var status1 = "";
			var weids = "";
			var status_one, status_one_telophone;

			function we_iph() {
				if(status_one.status == 1) {
					$("#" + status_one_telophone).append("<i>默认地址</i>")
					console.log("++++++++++++++", status_one);
				}
			}
			var wElist = function() {
				$.ajax({
					type: "GET",
					headers: {
						'Token': docCookies.getItem("token")
					},
					url: "http://apitest.wezchina.com/users/address/list",
					dataType: "json",
					success: function(data) {
						if(data.code === 200) {
							//							console.log(data.data.list.length);
							for(var i = 0; i < data.data.list.length; i++) {
								console.log(data.data.list[i]);

								lists +=
									'<div class="sh-address1" style="height: 70px;margin-left:60px;" id=' + data.data.list[i].weid + '>' +
									'<div class="media">' +
									'<div class="media-left">' +
									'<a href="#">' +
									'<img class="media-object" src="img/address-img.png" alt="...">' +
									'</a>' +
									'</div>' +
									'<div class="media-body">' +
									'<h4 class="media-heading">' +
									'<span class="we-name">' + data.data.list[i].name + '</span>' +
									'<span class="we-iph" id=' + data.data.list[i].telophone + '>' + data.data.list[i].telophone + '</span>' +
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

								if(data.data.list[i].status == 1) {
									status_one = data.data.list[i]
									status_one_telophone = data.data.list[i].telophone
								}

							}

							$("#form_group_add").append(lists);
							//							$(".sh-address1").find(".we-iph").children().remove();
							//							$(".sh-address1:first").find(".we-iph").append("<i>默认地址</i>");

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
										'<img src="img/Notice.png" style="display:block;margin:0 auto;"/>' +
										'<div style="width:150px;margin:20px auto;"><button class="btn btn-default" type="button" id="add_btn">确认</button><button class="btn btn-default" type="button" style="float:right;" id="cancel">取消</button></div>' +
										'</div>',
									success: function() {
										$("#add_btn").on("click", function() {
												console.log($that.parents(".sh-address1")[0].getAttribute("id"));
												weid = $that.parents(".sh-address1")[0].getAttribute("id")
												$.ajax({
													type: "GET",
													headers: {
														'Token': docCookies.getItem("token")
													},
													url: "http://apitest.wezchina.com/users/address/destroy/" + weid,
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
										'Token': docCookies.getItem("token")
									},
									url: "http://apitest.wezchina.com/users/address/list",
									dataType: "json",
									success: function(data) {
										console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
										console.log("data", data);
										console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
										var as = data.data.list;

										var newDatali = as.map(function(item) {
											if(item.weid == index1[0].getAttribute("id")) {
												console.log(item);
												$("#add_Consignee").val(item.name);
												$("#add_address1").val(item.detail);
												$("#add_iphone1").val(item.telophone);
												$("#add_Code").val(item.zipcode);
											}

										})
										//										
									}

								})
								console.log(index1);
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
										' <div class="city-picker-select" style="margin-top:10px;"></div>' +
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

										var select = $('.city-picker-select').cityPicker({
											dataJson: cityData,
											renderMode: false,
											autoSelected: true
										});

										//设置城市
										select.setCityVal([{
											'id': '610000',
											'name': '陕西省'
										}, {
											'id': '610100',
											'name': '西安市'
										}, {
											'id': '610113',
											'name': '雁塔区'
										}]);
										//
										$("#add_receipt").on("click", function() {
											var add_Consignee = $("#add_Consignee").val();
											var add_address1 = $("#add_address1").val();
											var add_iphone1 = $("#add_iphone1").val();
											var add_Code = $("#add_Code").val();
											var province = $(".province").val();
											var city = $(".city").val();
											$.ajax({
												type: "POST",
												headers: {
													'Token': docCookies.getItem("token")
												},
												url: "http://apitest.wezchina.com/users/address/store",
												data: {
													name: add_Consignee,
													province_id: province,
													area_id: city,
													detail: add_address1,
													telophone: add_iphone1,
													zipcode: add_Code,

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
																'Token': docCookies.getItem("token")
															},
															url: "http://apitest.wezchina.com/users/address/destroy/" + index1[0].getAttribute("id"),
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
							});
							// 设为默认

							$(".default1").on("click", function() {
								//								var status1=0;
								var weI = "<i>默认地址</i>";
								$(".default1").parents(".we-meri").siblings(".media-heading").find(".we-iph").children().remove();
								$(this).parents(".we-meri").siblings(".media-heading").find(".we-iph").append(weI);
								weids = $(this).parents(".sh-address1")[0].getAttribute("id");
								console.log(weids);
								//								status1=1;
								$.ajax({
									type: "POST",
									headers: {
										'Token': docCookies.getItem("token")
									},
									url: "http://apitest.wezchina.com/users/address/update",
									data: {
										status: 1,
										weid: weids
									},
									dataType: "json",
									success: function(data) {
										//													if(data.code === 200) {
										console.log(data);
										//														status1=0;
										//													}
									},
									error: function() {
										console.log("出错了");
									}
								});
							});
						}

						we_iph();
					},
					error: function() {
						console.log("出错了");
					}
				});
			}
			wElist(); //调用
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
						' <div class="city-picker-select" style="margin-top:10px;"></div>' +
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
						//原生城市-无联动
						var select = $('.city-picker-select').cityPicker({
							dataJson: cityData,
							renderMode: false,
							autoSelected: true
						});

						//设置城市
						select.setCityVal([{
							'id': '610000',
							'name': '陕西省'
						}, {
							'id': '610100',
							'name': '西安市'
						}, {
							'id': '610113',
							'name': '雁塔区'
						}]);
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
										'Token': docCookies.getItem("token")
									},
									url: "http://apitest.wezchina.com/users/address/store",
									data: {
										name: Consignee,
										province_id: Code1,
										area_id: Code2,
										detail: address1,
										telophone: iphone1,
										zipcode: Code,
										status: 2
										//添加地址默认为1
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
					}
				});
			});
			//删除