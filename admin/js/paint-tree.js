$(function () {
    function aa() {
        $.ajax({
            url: 'http://new.wezchina.com/api/backend/admins/get_config?role_id=b4209b80-775e-11e7-a88a-0771558f58b6',
            // url: ApiUrl + 'admins/get_channel' + '?role_id=' + 'b4209b80-775e-11e7-a88a-0771558f58b6',
            async: false,
            headers: {
                'Token': 'eyJpdiI6InR5SEdaYTJibHZueTFaRUx2VUd2MlE9PSIsInZhbHVlIjoiZWdyMFwvOFdtSnJpd2pKVUZsb0VvaGZ3MVFcL1dESXd1OFRkSHVmbldHRmJPZ0hUeGRlK3RnYVFXRkVDNTF1Z0JcL0RNc1ZoVmV0UEFuVHZiVlBSUkdMQzZ1bFF5aUJNRnNvMzFJWFFhOGpcLzEwPSIsIm1hYyI6IjI0MmRjZGRkMDU5NGUxNDQ2MjcyN2RjMjRkYzJhYjRkZGIzZThiNmE5M2YyZGViMjdjOGE2ZTM1MDY2ZWU2YTEifQ==',
            },
            success: function (data) {
                let str = '';
                $(data).each((i,v)=>{
                    if(v.name !== undefined){
                        str += `
                             <tr class=" my_pid_menu odd gradeX" id="${v.id}">
                                <td class="myselect">
                                    <label class="mt-table mt-checkbox mt-checkbox-single mt-checkbox-outline">
                                        <input type="checkbox" class="checkboxes group-checkable menu" data-set=".menu${v.id}" name="data[mark][]" checked="" value="home">
                                        <span></span>
                                    </label>
                                </td>
                                <td style="text-align:center">
                                    ${v.id}                           </td>
                                <td>
                                    <i class="fa"></i> ${v.name}                           </td>
                                <td style="text-align:center" class="myselect">
                                </td>
                                <td style="text-align:center" class="myselect">
                                </td>
                                <td style="text-align:center" class="myselect">
                                </td>
                            </tr>

                            `;
                        if(v.children.length > 0){
                            $(v.children).each((j,k)=>{
                                str += `
                               <tr class=" odd gradeX" id="row${k.id}">
                                <td class="myselect">
                                    <label class="mt-table mt-checkbox mt-checkbox-single mt-checkbox-outline">
                                        <input type="checkbox" class="checkboxes group-checkable menu${v.id}  menu" data-set=".menu${k.id}" name="data[mark][]" checked="" value="home">
                                        <span></span>
                                    </label>
                                </td>
                                <td style="text-align:center">
                                    ${k.id}                           </td>
                                <td>
                                    &nbsp;└&nbsp;&nbsp;<i class="fa"></i> ${k.name}                           </td>
                                <td style="text-align:center" class="myselect">
                                </td>
                                <td style="text-align:center" class="myselect">
                                </td>
                                <td style="text-align:center" class="myselect">
                                </td>
                            </tr>
                            `;
                                if(k.children.length>0){
                                    $(k.children).each((p,l)=>{
                                        str += `
                                    <tr class="odd gradeX">
                                        <td class="myselect">
                                            <label class="mt-table mt-checkbox mt-checkbox-single mt-checkbox-outline">
                                                <input type="checkbox" id="${l.id}" bid="${k.id}" cid="${v.id}"  class="checkboxes group-checkable menu${v.id}  menu${k.id}" data-set=".zsg${l.id}" name="data[mark][]" checked="" value="home/main">
                                                <span></span>
                                            </label>
                                        </td>
                                        <td style="text-align:center">
                                            ${l.id}                            </td>
                                        <td>
                                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├&nbsp;&nbsp; <i class="fa"></i> ${l.name}                           </td>
                                        <td style="text-align:center" class="myselect">
                                            <label class="mt-table mt-checkbox mt-checkbox-single mt-checkbox-outline">
                                                <input type="checkbox" id="${l.id}z" aid="${l.id}" bid="${v.id}" cid="${k.id}" class="checkboxes zsg${l.id}  menu${v.id} menu${k.id}" checked="" name="data[auth][home/main][]" value="add">
                                                <span></span>
                                            </label>
                                        </td>
                                        <td style="text-align:center" class="myselect">
                                            <label class="mt-table mt-checkbox mt-checkbox-single mt-checkbox-outline">
                                                <input type="checkbox" id="${l.id}s" aid="${l.id}" bid="${v.id}" cid="${k.id}" class="checkboxes zsg${l.id}  menu${v.id} menu${k.id}" checked="" name="data[auth][home/main][]" value="edit">
                                                <span></span>
                                            </label>
                                        </td>
                                        <td style="text-align:center" class="myselect">
                                            <label class="mt-table mt-checkbox mt-checkbox-single mt-checkbox-outline">
                                                <input type="checkbox" id="${l.id}c" aid="${l.id}" bid="${v.id}" cid="${k.id}" class="checkboxes zsg${l.id}  menu${v.id} menu${k.id}" checked="" name="data[auth][home/main][]" value="del">
                                                <span></span>
                                            </label>
                                        </td>
                                    </tr>
                                `;
                                    })

                                }
                            })

                        }
                    }
                })
                $("#tab_0 > table > tbody").append(str);
                $("#test").click(()=>{
                    let crr = [];
                    $("input[type='checkbox']").each((i,v)=>{
                        if($(v).is(':checked')){
                            if(v.id){
                                crr.push(v.id);
                            };
                            if($(v).attr("aid")){
                                crr.push($(v).attr("aid"));
                            };
                            if($(v).attr("bid")){
                                crr.push($(v).attr("bid"));
                            };
                            if($(v).attr("cid")){
                                crr.push($(v).attr("cid"));
                            }
                        }
                    })
                    let datas = data;
                    $(data).each((x,y) =>{
                        let index = $.inArray(`${y.id}`,crr);
                        if ( index >= 0){
                            $(y).attr({checked:true})
                            // datas.push(y)
                            if(y.children.length > 0){
                                $(y.children).each((l,k)=>{
                                    let inde = $.inArray(`${k.id}`,crr);
                                    if( inde >= 0){
                                        $(k).attr({checked:true})
                                        // datas.push(k)
                                        if(k.children.length > 0){
                                            $(k.children).each((m,n)=> {
                                                let ind = $.inArray(`${n.id}`, crr);
                                                if (ind >= 0) {
                                                    $(n).attr({checked:true})
                                                    // datas.push(n)
                                                }else {
                                                    $(n).attr({checked:false})
                                                }
                                            })
                                        }
                                    }else {
                                        $(k).attr({checked:false})
                                        if(k.children.length > 0){
                                            $(k.children).each((m,n)=>{
                                                $(n).attr({checked:false})
                                            })
                                        }
                                    }
                                })
                            }
                        }else {
                            $(y).attr({checked:false})
                            if(y.children.length > 0){
                                $(y.children).each((l,k)=>{
                                    $(k).attr({checked:false})
                                    if(k.children.length > 0){
                                        $(k.children).each((m,n)=>{
                                            $(n).attr({checked:false})
                                        })
                                    }

                                })
                            }
                        }
                    })
                    console.log(data)
                    $


                })

            },
            error: function (xhr) {
                console.log(xhr)
            }
        })
    }
    aa()
})

