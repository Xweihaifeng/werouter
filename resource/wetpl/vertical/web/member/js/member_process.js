
const PROCESS = `
    <div class="member_login_auth_cert_process">
        <ul class="member_process">
            <li class="member_login"> 登录 </li>
            <li class="member_real_auth"> 实名认证 </li>
            <li class="member_off_cert"> 官方认证 </li>
            <li class="member_app_sub"> 会员申请 </li>
            <li class="member_first_trial"> 初审 </li>
            <li class="member_pay"> 缴费 </li>
            <li class="member_sec"> 复审 </li>
            <li class="member_member"> 正式会员 </li>
        </ul>
    </div>`
$(".member_authentication_process").append(PROCESS);


// 登录
if(token != null || token != undefined) {
    $(".member_login").addClass("process_active");

    // 实名认证详情功能显示(是否开通实名认证)
    var options = $.get(CERT_REALNAME_DETAIL);
    options.done(function(data) {
        if(data.code == 200) {
            var result = data.data;
            if(!result || result.is_authenticated == 2) {
                return false;
            } else if(result.is_authenticated == 1 && result.operation_status == 2) {
            	$(".member_real_auth").addClass("process_active");

                // 官方认证详情功能显示(是否开通官方认证)
                var options1 = $.get(CERT_OFCCERTS);
                options1.done(function(body) {
                    if(body.code == 200) {
                        var results = body.data;
                        if(!results) {
                            return false;
                        } else if(results.type == 1 || results.type == 2) {
                            if(results.is_authenticated == 1 && results.operation_status == 2) {
                                $(".member_off_cert").addClass("process_active");
                            } else {
                            	return false;
                            }
                        }
                    } else {
                        return false;
                    }
                });
                options1.fail(function(error) {
                    console.error(error);
                });
            }
        }
    });
    options.fail(function(error) {
        console.error(error);
    });

    var member_options = $.get(MEMBER_PROFILE);
    member_options.done(function(data) {
        if(data.code == 200) {
            var result = data.data;

            if(!result) {
    			var options0 = $.get(MEMBER_APPLY);
    		    options0.done(function(data) {
    		        if(data.code == 200) {	
    		            result1 = data.data;
                        if (!result1) {
                            return false;
                        }
                        if(result1.state == 1) {
                            if(result1.first_audit_is_done == 1) {
                                $(".member_app_sub").addClass("process_active");
                            }
                        } else if(result1.state == 2) {
                            $(".member_app_sub, .member_first_trial").addClass("process_active");
                        } else if(result1.state == 3) {
                            if(result1.sec_audit == 1) {
                                $(".member_app_sub, .member_first_trial, .member_pay, .member_sec").addClass("process_active");
                            } else if(result1.sec_audit == 2 && result1.sec_audit_operation == 3) {
                                $(".member_app_sub, .member_first_trial, .member_pay").addClass("process_active");
                            } else if(result1.sec_audit == 2 && result1.sec_audit_operation == 1) {
                                $(".member_app_sub, .member_first_trial, .member_pay").addClass("process_active");
                            }
                        }
    		        }
    		    });
    		    options0.fail(function(error) {
    		    	console.error(error);
    		    });
            } else {
                $(".member_process > li").addClass("process_active");
                // window.location.href = '/applicationsuccess';
            }
        }
    });
    member_options.fail(function(error) {
        console.error(error);
    });
}