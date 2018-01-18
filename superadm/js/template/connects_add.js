$(document).ready(function () {
    start();
//  var init = function () {
//      $.ajax({
//          url: ApiUrl + "roles",
//          type: 'get',
//          dataType: 'JSON',
//          success: function (result) {
//              if (result.code === 200) {
//                  var html = '';
//                  $.each(result.data.list, function (key, val) {
//                      html += '<option name="options" value='+val.weid+' selected=\"selected\">' + val.display_name + '</option>';
//                  });
//                  $('input:radio[name="list"]').get(0).checked=true; 
//                  $("#role_id").html(html);
//              } else {
//                  parent.layer.msg(result.message);
//
//                  return false;
//              }
//          }
//      });
//  };

    $('#updateSet').click(function(){
        var con_name = $('#con_name').val();
        var formList = {
            'domain_custom'   :$('#domain_custom').val(),
            'domain_default'  :$('#domain_default').val(),
            'domain_https'    :$('#domain_https').val(),
            'notify_url'      :$('#notify_url').val(),
            'secret_key'      :$('#secret_key').val()
        };
    	 $.ajax({
            url: ApiUrl + 'setting',
            type: 'post',
            dataType: 'json',
            data:  {
            	name  :con_name,
            	config  :formList
            },
            success: function(data){
                console.log(data);
                if (data.code === 200){
                	console.log('ok');
                } else {
                    console.log('error: -200');
                }
            },
            error: function(xhr){
                console.log(xhr);
            }
        })
    })
//  init();
});