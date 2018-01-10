$(document).ready(function(){
    start();

    function GetQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    }
    var weid = GetQueryString('weid');
    function aa() {
        $.ajax({
            url: ApiUrl + 'admins/get_config?role_id=' + weid,
            async: false,
            success: function (data) {
                console.log(data)
                let str = '';
                $(data).each((i,v)=>{
                    if(v.children.length > 0){
                        if(v.name !== undefined){
                            if(v.checked == true){
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
                                    <i class="fa"></i> ${v.name}</td>
                                <td style="text-align:center" class="myselect">
                                </td>
                                <td style="text-align:center" class="myselect">
                                </td>
                                <td style="text-align:center" class="myselect">
                                </td>
                            </tr>
                            `;
                            }else {
                                str += `
                             <tr class=" my_pid_menu odd gradeX" id="${v.id}">
                                <td class="myselect">
                                    <label class="mt-table mt-checkbox mt-checkbox-single mt-checkbox-outline">
                                        <input type="checkbox" class="checkboxes group-checkable menu" data-set=".menu${v.id}" name="data[mark][]" value="home">
                                        <span></span>
                                    </label>
                                </td>
                                <td style="text-align:center">
                                    ${v.id}                           </td>
                                <td>
                                    <i class="fa"></i> ${v.name}</td>
                                <td style="text-align:center" class="myselect">
                                </td>
                                <td style="text-align:center" class="myselect">
                                </td>
                                <td style="text-align:center" class="myselect">
                                </td>
                            </tr>
                            `;
                            }
                            $(v.children).each((j,k) => {
                                    if(k.children.length > 0){
                                        if(k.checked == true){
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
                                    &nbsp;└&nbsp;&nbsp;<i class="fa"></i> ${k.name}</td>
                                <td style="text-align:center" class="myselect">
                                </td>
                                <td style="text-align:center" class="myselect">
                                </td>
                                <td style="text-align:center" class="myselect">
                                </td>
                            </tr>
                            `;
                                        }else {
                                            str += `
                               <tr class=" odd gradeX" id="row${k.id}">
                                <td class="myselect">
                                    <label class="mt-table mt-checkbox mt-checkbox-single mt-checkbox-outline">
                                        <input type="checkbox" class="checkboxes group-checkable menu${v.id}  menu" data-set=".menu${k.id}" name="data[mark][]" value="home">
                                        <span></span>
                                    </label>
                                </td>
                                <td style="text-align:center">
                                    ${k.id}                           </td>
                                <td>
                                    &nbsp;└&nbsp;&nbsp;<i class="fa"></i> ${k.name}</td>
                                <td style="text-align:center" class="myselect">
                                </td>
                                <td style="text-align:center" class="myselect">
                                </td>
                                <td style="text-align:center" class="myselect">
                                </td>
                            </tr>
                            `;
                                        }
                                        $(k.children).each((p,l)=>{
                                                if(l.children.length > 0){
                                                    if(l.checked == true){
                                                        str += `
                               <tr class=" odd gradeX" id="row${l.id}">
                                <td class="myselect">
                                    <label class="mt-table mt-checkbox mt-checkbox-single mt-checkbox-outline">
                                        <input type="checkbox" class="checkboxes group-checkable menu${k.id} menu${v.id} menu" data-set=".menu${l.id}" name="data[mark][]" checked="" value="home">
                                        <span></span>
                                    </label>
                                </td>
                                <td style="text-align:center">
                                    ${l.id}                           </td>
                                <td>
                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;└&nbsp;&nbsp;<i class="fa"></i> ${l.name}</td>
                                <td style="text-align:center" class="myselect">
                                </td>
                                <td style="text-align:center" class="myselect">
                                </td>
                                <td style="text-align:center" class="myselect">
                                </td>
                            </tr>
                            `;
                                                    }else {
                                                        str += `
                               <tr class=" odd gradeX" id="row${l.id}">
                                <td class="myselect">
                                    <label class="mt-table mt-checkbox mt-checkbox-single mt-checkbox-outline">
                                        <input type="checkbox" class="checkboxes group-checkable menu${k.id} menu${v.id} menu" data-set=".menu${l.id}" name="data[mark][]" value="home">
                                        <span></span>
                                    </label>
                                </td>
                                <td style="text-align:center">
                                    ${l.id}                           </td>
                                <td>
                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;└&nbsp;&nbsp;<i class="fa"></i> ${l.name}</td>
                                <td style="text-align:center" class="myselect">
                                </td>
                                <td style="text-align:center" class="myselect">
                                </td>
                                <td style="text-align:center" class="myselect">
                                </td>
                            </tr>
                            `;
                                                    }
                                                    $(l.children).each((f,g)=>{
                                                        if(g.children.length > 0){
                                                            if(g.checked == true){
                                                                str += `
                               <tr class=" odd gradeX" id="row${g.id}">
                                <td class="myselect">
                                    <label class="mt-table mt-checkbox mt-checkbox-single mt-checkbox-outline">
                                        <input type="checkbox" class="checkboxes group-checkable menu${k.id} menu${l.id} menu${v.id} menu" data-set=".menu${g.id}" name="data[mark][]" checked="" value="home">
                                        <span></span>
                                    </label>
                                </td>
                                <td style="text-align:center">
                                    ${g.id}                           </td>
                                <td>
                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;└&nbsp;&nbsp;&nbsp;<i class="fa"></i> ${g.name}</td>
                                <td style="text-align:center" class="myselect">
                                </td>
                                <td style="text-align:center" class="myselect">
                                </td>
                                <td style="text-align:center" class="myselect">
                                </td>
                            </tr>
                            `;
                                                            }else {
                                                                str += `
                               <tr class=" odd gradeX" id="row${g.id}">
                                <td class="myselect">
                                    <label class="mt-table mt-checkbox mt-checkbox-single mt-checkbox-outline">
                                        <input type="checkbox" class="checkboxes group-checkable menu${k.id} menu${l.id} menu${v.id} menu" data-set=".menu${g.id}" name="data[mark][]" value="home">
                                        <span></span>
                                    </label>
                                </td>
                                <td style="text-align:center">
                                    ${g.id}                           </td>
                                <td>
                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;└&nbsp;&nbsp;&nbsp;<i class="fa"></i> ${g.name}</td>
                                <td style="text-align:center" class="myselect">
                                </td>
                                <td style="text-align:center" class="myselect">
                                </td>
                                <td style="text-align:center" class="myselect">
                                </td>
                            </tr>
                            `;
                                                            }
                                                            $(g.children).each((w,s)=>{
                                                                if(s.checked == true){
                                                                    str += `
                                    <tr class="odd gradeX">
                                        <td class="myselect">
                                            <label class="mt-table mt-checkbox mt-checkbox-single mt-checkbox-outline">
                                                <input type="checkbox" id="${s.id}" aid="${g.id}" bid="${l.id}" cid="${k.id}" did="${v.id}"  class="checkboxes group-checkable menu${v.id}  menu${k.id} menu${g.id} menu${l.id}" data-set=".zsg${s.id}" name="data[mark][]" checked="" value="home/main">
                                                <span></span>
                                            </label>
                                        </td>
                                        <td style="text-align:center">
                                            ${s.id}                            </td>
                                        <td>
                                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├&nbsp;&nbsp; <i class="fa"></i> ${s.name}</td>
                                        <td style="text-align:center" class="myselect">
                                            <label class="mt-table mt-checkbox mt-checkbox-single mt-checkbox-outline">
                                                <input type="checkbox" id="${s.id}z" aid="${s.id}" bid="${g.id}" cid="${l.id}" did="${k.id}" eid="${v.id}" disabled="disabled" class="checkboxes zsg${s.id} menu${g.id} menu${l.id} menu${v.id} menu${k.id}" checked="" name="data[auth][home/main][]" value="add">
                                                <span></span>
                                            </label>
                                        </td>
                                        <td style="text-align:center" class="myselect">
                                            <label class="mt-table mt-checkbox mt-checkbox-single mt-checkbox-outline">
                                                <input type="checkbox" id="${s.id}s" aid="${s.id}" bid="${g.id}" cid="${l.id}" did="${k.id}" eid="${v.id}" disabled="disabled" class="checkboxes zsg${s.id} menu${g.id} menu${l.id} menu${v.id} menu${k.id}" checked="" name="data[auth][home/main][]" value="edit">
                                                <span></span>
                                            </label>
                                        </td>
                                        <td style="text-align:center" class="myselect">
                                            <label class="mt-table mt-checkbox mt-checkbox-single mt-checkbox-outline">
                                                <input type="checkbox" id="${s.id}c" aid="${s.id}" bid="${g.id}" cid="${l.id}" did="${k.id}" eid="${v.id}" disabled="disabled" class="checkboxes zsg${s.id} menu${g.id} menu${l.id} menu${v.id} menu${k.id}" checked="" name="data[auth][home/main][]" value="del">
                                                <span></span>
                                            </label>
                                        </td>
                                    </tr>
                                `;
                                                                }else {
                                                                    str += `
                                    <tr class="odd gradeX">
                                        <td class="myselect">
                                            <label class="mt-table mt-checkbox mt-checkbox-single mt-checkbox-outline">
                                                <input type="checkbox" id="${s.id}" aid="${g.id}" bid="${l.id}" cid="${k.id}" did="${v.id}"  class="checkboxes group-checkable menu${v.id}  menu${k.id} menu${g.id} menu${l.id}" data-set=".zsg${s.id}" name="data[mark][]" value="home/main">
                                                <span></span>
                                            </label>
                                        </td>
                                        <td style="text-align:center">
                                            ${s.id}                            </td>
                                        <td>
                                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├&nbsp;&nbsp; <i class="fa"></i> ${s.name}</td>
                                        <td style="text-align:center" class="myselect">
                                            <label class="mt-table mt-checkbox mt-checkbox-single mt-checkbox-outline">
                                                <input type="checkbox" id="${s.id}z" aid="${s.id}" bid="${g.id}" cid="${l.id}" did="${k.id}" eid="${v.id}" disabled="disabled" class="checkboxes zsg${s.id} menu${g.id} menu${l.id} menu${v.id} menu${k.id}"  name="data[auth][home/main][]" value="add">
                                                <span></span>
                                            </label>
                                        </td>
                                        <td style="text-align:center" class="myselect">
                                            <label class="mt-table mt-checkbox mt-checkbox-single mt-checkbox-outline">
                                                <input type="checkbox" id="${s.id}s" aid="${s.id}" bid="${g.id}" cid="${l.id}" did="${k.id}" eid="${v.id}" disabled="disabled" class="checkboxes zsg${s.id} menu${g.id} menu${l.id} menu${v.id} menu${k.id}"  name="data[auth][home/main][]" value="edit">
                                                <span></span>
                                            </label>
                                        </td>
                                        <td style="text-align:center" class="myselect">
                                            <label class="mt-table mt-checkbox mt-checkbox-single mt-checkbox-outline">
                                                <input type="checkbox" id="${s.id}c" aid="${s.id}" bid="${g.id}" cid="${l.id}" did="${k.id}" eid="${v.id}" disabled="disabled" class="checkboxes zsg${s.id} menu${g.id} menu${l.id} menu${v.id} menu${k.id}"  name="data[auth][home/main][]" value="del">
                                                <span></span>
                                            </label>
                                        </td>
                                    </tr>
                                `;
                                                                }
                                                            })
                                                        }else {
                                                            if(g.checked == true){
                                                                str += `
                                    <tr class="odd gradeX">
                                        <td class="myselect">
                                            <label class="mt-table mt-checkbox mt-checkbox-single mt-checkbox-outline">
                                                <input type="checkbox" id="${g.id}" aid="${l.id}" bid="${k.id}" cid="${v.id}"  class="checkboxes group-checkable menu${v.id} menu${l.id} menu${k.id}" data-set=".zsg${g.id}" name="data[mark][]" checked="" value="home/main">
                                                <span></span>
                                            </label>
                                        </td>
                                        <td style="text-align:center">
                                            ${g.id}                            </td>
                                        <td>
                                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├&nbsp;&nbsp; <i class="fa"></i> ${g.name}                          </td>
                                        <td style="text-align:center" class="myselect">
                                            <label class="mt-table mt-checkbox mt-checkbox-single mt-checkbox-outline">
                                                <input type="checkbox" id="${l.id}z" aid="${g.id}" bid="${l.id}" cid="${k.id}" did="${v.id}" disabled="disabled"  class="checkboxes zsg${l.id}  menu${v.id} menu${k.id}" checked="" name="data[auth][home/main][]" value="add">
                                                <span></span>
                                            </label>
                                        </td>
                                        <td style="text-align:center" class="myselect">
                                            <label class="mt-table mt-checkbox mt-checkbox-single mt-checkbox-outline">
                                                <input type="checkbox" id="${l.id}s" aid="${g.id}" bid="${l.id}" cid="${k.id}" did="${v.id}" disabled="disabled" class="checkboxes zsg${l.id}   menu${v.id} menu${k.id}" checked="" name="data[auth][home/main][]" value="edit">
                                                <span></span>
                                            </label>
                                        </td>
                                        <td style="text-align:center" class="myselect">
                                            <label class="mt-table mt-checkbox mt-checkbox-single mt-checkbox-outline">
                                                <input type="checkbox" id="${l.id}c" aid="${g.id}" bid="${l.id}" cid="${k.id}" did="${v.id}" disabled="disabled" class="checkboxes zsg${l.id}  menu${v.id} menu${k.id}" checked="" name="data[auth][home/main][]" value="del">
                                                <span></span>
                                            </label>
                                        </td>
                                    </tr>
                                `;
                                                            } else {
                                                                str += `
                                    <tr class="odd gradeX">
                                        <td class="myselect">
                                            <label class="mt-table mt-checkbox mt-checkbox-single mt-checkbox-outline">
                                                <input type="checkbox" id="${g.id}" aid="${l.id}" bid="${k.id}" cid="${v.id}"  class="checkboxes group-checkable menu${v.id} menu${l.id} menu${k.id}" data-set=".zsg${g.id}" name="data[mark][]" value="home/main">
                                                <span></span>
                                            </label>
                                        </td>
                                        <td style="text-align:center">
                                            ${g.id}                            </td>
                                        <td>
                                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├&nbsp;&nbsp; <i class="fa"></i> ${g.name}                          </td>
                                        <td style="text-align:center" class="myselect">
                                            <label class="mt-table mt-checkbox mt-checkbox-single mt-checkbox-outline">
                                                <input type="checkbox" id="${l.id}z" aid="${g.id}" bid="${l.id}" cid="${k.id}" did="${v.id}" disabled="disabled"  class="checkboxes zsg${l.id}  menu${v.id} menu${k.id}" name="data[auth][home/main][]" value="add">
                                                <span></span>
                                            </label>
                                        </td>
                                        <td style="text-align:center" class="myselect">
                                            <label class="mt-table mt-checkbox mt-checkbox-single mt-checkbox-outline">
                                                <input type="checkbox" id="${l.id}s" aid="${g.id}" bid="${l.id}" cid="${k.id}" did="${v.id}" disabled="disabled" class="checkboxes zsg${l.id}   menu${v.id} menu${k.id}"  name="data[auth][home/main][]" value="edit">
                                                <span></span>
                                            </label>
                                        </td>
                                        <td style="text-align:center" class="myselect">
                                            <label class="mt-table mt-checkbox mt-checkbox-single mt-checkbox-outline">
                                                <input type="checkbox" id="${l.id}c" aid="${g.id}" bid="${l.id}" cid="${k.id}" did="${v.id}" disabled="disabled" class="checkboxes zsg${l.id}  menu${v.id} menu${k.id}"  name="data[auth][home/main][]" value="del">
                                                <span></span>
                                            </label>
                                        </td>
                                    </tr>
                                `;
                                                            }
                                                        }
                                                    })
                                                }else {
                                                    if(l.checked == true){
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
                                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├&nbsp;&nbsp; <i class="fa"></i> ${l.name} </td>
                                        <td style="text-align:center" class="myselect">
                                            <label class="mt-table mt-checkbox mt-checkbox-single mt-checkbox-outline">
                                                <input type="checkbox" id="${l.id}z" aid="${l.id}" bid="${v.id}" cid="${k.id}" class="checkboxes zsg${l.id}  menu${v.id} d menu${k.id}" disabled="disabled" checked="" name="data[auth][home/main][]" value="add">
                                                <span></span>
                                            </label>
                                        </td>
                                        <td style="text-align:center" class="myselect">
                                            <label class="mt-table mt-checkbox mt-checkbox-single mt-checkbox-outline">
                                                <input type="checkbox" id="${l.id}s" aid="${l.id}" bid="${v.id}" cid="${k.id}" class="checkboxes zsg${l.id}  menu${v.id} menu${k.id}" disabled="disabled" checked="" name="data[auth][home/main][]" value="edit">
                                                <span></span>
                                            </label>
                                        </td>
                                        <td style="text-align:center" class="myselect">
                                            <label class="mt-table mt-checkbox mt-checkbox-single mt-checkbox-outline">
                                                <input type="checkbox" id="${l.id}c" aid="${l.id}" bid="${v.id}" cid="${k.id}" class="checkboxes zsg${l.id}  menu${v.id} menu${k.id}" disabled="disabled" checked="" name="data[auth][home/main][]" value="del">
                                                <span></span>
                                            </label>
                                        </td>
                                    </tr>
                                `;
                                                    }else {
                                                        str += `
                                    <tr class="odd gradeX">
                                        <td class="myselect">
                                            <label class="mt-table mt-checkbox mt-checkbox-single mt-checkbox-outline">
                                                <input type="checkbox" id="${l.id}" bid="${k.id}" cid="${v.id}"  class="checkboxes group-checkable menu${v.id}  menu${k.id}" data-set=".zsg${l.id}" name="data[mark][]" value="home/main">
                                                <span></span>
                                            </label>
                                        </td>
                                        <td style="text-align:center">
                                            ${l.id}                            </td>
                                        <td>
                                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├&nbsp;&nbsp; <i class="fa"></i> ${l.name} </td>
                                        <td style="text-align:center" class="myselect">
                                            <label class="mt-table mt-checkbox mt-checkbox-single mt-checkbox-outline">
                                                <input type="checkbox" id="${l.id}z" aid="${l.id}" bid="${v.id}" cid="${k.id}" class="checkboxes zsg${l.id}  menu${v.id} d menu${k.id}" disabled="disabled"  name="data[auth][home/main][]" value="add">
                                                <span></span>
                                            </label>
                                        </td>
                                        <td style="text-align:center" class="myselect">
                                            <label class="mt-table mt-checkbox mt-checkbox-single mt-checkbox-outline">
                                                <input type="checkbox" id="${l.id}s" aid="${l.id}" bid="${v.id}" cid="${k.id}" class="checkboxes zsg${l.id}  menu${v.id} menu${k.id}" disabled="disabled"  name="data[auth][home/main][]" value="edit">
                                                <span></span>
                                            </label>
                                        </td>
                                        <td style="text-align:center" class="myselect">
                                            <label class="mt-table mt-checkbox mt-checkbox-single mt-checkbox-outline">
                                                <input type="checkbox" id="${l.id}c" aid="${l.id}" bid="${v.id}" cid="${k.id}" class="checkboxes zsg${l.id}  menu${v.id} menu${k.id}" disabled="disabled" name="data[auth][home/main][]" value="del">
                                                <span></span>
                                            </label>
                                        </td>
                                    </tr>
                                `;
                                                    }
                                                }
                                            })
                                    }else {
                                        if(k.checked == true ){
                                            str += `
                                    <tr class="odd gradeX">
                                        <td class="myselect">
                                            <label class="mt-table mt-checkbox mt-checkbox-single mt-checkbox-outline">
                                                <input type="checkbox" id="${k.id}" bid="${v.id}" cid=""  class="checkboxes group-checkable menu${v.id}  menu${k.id}" data-set=".zsg${l.id}" name="data[mark][]" checked="" value="home/main">
                                                <span></span>
                                            </label>
                                        </td>
                                        <td style="text-align:center">
                                            ${k.id}                            </td>
                                        <td>
                                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├&nbsp;&nbsp; <i class="fa"></i> ${k.name}   </td>
                                        <td style="text-align:center" class="myselect">
                                            <label class="mt-table mt-checkbox mt-checkbox-single mt-checkbox-outline">
                                                <input type="checkbox" id="${k.id}z" aid="${k.id}" bid="${v.id}" cid="" disabled="disabled"  class="checkboxes zsg${l.id}  menu${v.id} menu${k.id}" checked="" name="data[auth][home/main][]" value="add">
                                                <span></span>
                                            </label>
                                        </td>
                                        <td style="text-align:center" class="myselect">
                                            <label class="mt-table mt-checkbox mt-checkbox-single mt-checkbox-outline">
                                                <input type="checkbox" id="${k.id}s" aid="${k.id}" bid="${v.id}" cid="" disabled="disabled"  class="checkboxes zsg${l.id}  menu${v.id} menu${k.id}" checked="" name="data[auth][home/main][]" value="edit">
                                                <span></span>
                                            </label>
                                        </td>
                                        <td style="text-align:center" class="myselect">
                                            <label class="mt-table mt-checkbox mt-checkbox-single mt-checkbox-outline">
                                                <input type="checkbox" id="${k.id}c" aid="${k.id}" bid="${v.id}" cid="" disabled="disabled"  class="checkboxes zsg${l.id}  menu${v.id} menu${k.id}" checked="" name="data[auth][home/main][]" value="del">
                                                <span></span>
                                            </label>
                                        </td>
                                    </tr>
                                `;
                                        }else {
                                            str += `
                                    <tr class="odd gradeX">
                                        <td class="myselect">
                                            <label class="mt-table mt-checkbox mt-checkbox-single mt-checkbox-outline">
                                                <input type="checkbox" id="${k.id}" bid="${v.id}" cid=""  class="checkboxes group-checkable menu${v.id}  menu${k.id}" data-set=".zsg${l.id}" name="data[mark][]" value="home/main">
                                                <span></span>
                                            </label>
                                        </td>
                                        <td style="text-align:center">
                                            ${k.id}                            </td>
                                        <td>
                                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├&nbsp;&nbsp; <i class="fa"></i> ${k.name}   </td>
                                        <td style="text-align:center" class="myselect">
                                            <label class="mt-table mt-checkbox mt-checkbox-single mt-checkbox-outline">
                                                <input type="checkbox" id="${k.id}z" aid="${k.id}" bid="${v.id}" cid="" disabled="disabled"  class="checkboxes zsg${l.id}  menu${v.id} menu${k.id}"  name="data[auth][home/main][]" value="add">
                                                <span></span>
                                            </label>
                                        </td>
                                        <td style="text-align:center" class="myselect">
                                            <label class="mt-table mt-checkbox mt-checkbox-single mt-checkbox-outline">
                                                <input type="checkbox" id="${k.id}s" aid="${k.id}" bid="${v.id}" cid="" disabled="disabled"  class="checkboxes zsg${l.id}  menu${v.id} menu${k.id}"  name="data[auth][home/main][]" value="edit">
                                                <span></span>
                                            </label>
                                        </td>
                                        <td style="text-align:center" class="myselect">
                                            <label class="mt-table mt-checkbox mt-checkbox-single mt-checkbox-outline">
                                                <input type="checkbox" id="${k.id}c" aid="${k.id}" bid="${v.id}" cid="" disabled="disabled"  class="checkboxes zsg${l.id}  menu${v.id} menu${k.id}"  name="data[auth][home/main][]" value="del">
                                                <span></span>
                                            </label>
                                        </td>
                                    </tr>
                                `;
                                        }
                                    }
                                })
                        }
                    }else {
                        if(v.checked == true){
                            str += `
                                    <tr class="odd gradeX">
                                        <td class="myselect">
                                            <label class="mt-table mt-checkbox mt-checkbox-single mt-checkbox-outline">
                                                <input type="checkbox" id="${v.id}" bid="" cid=""  class="checkboxes group-checkable menu" data-set=".zsg${v.id}" name="data[mark][]" checked="" value="home/main">
                                                <span></span>
                                            </label>
                                        </td>
                                        <td style="text-align:center">
                                            ${v.id}                            </td>
                                        <td>
                                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├&nbsp;&nbsp; <i class="fa"></i> ${v.name} </td>
                                        <td style="text-align:center" class="myselect">
                                            <label class="mt-table mt-checkbox mt-checkbox-single mt-checkbox-outline">
                                                <input type="checkbox" id="${v.id}z" aid="${v.id}" bid="" cid="" disabled="disabled"  class="checkboxes" checked="" name="data[auth][home/main][]" value="add">
                                                <span></span>
                                            </label>
                                        </td>
                                        <td style="text-align:center" class="myselect">
                                            <label class="mt-table mt-checkbox mt-checkbox-single mt-checkbox-outline">
                                                <input type="checkbox" id="${v.id}s" aid="${v.id}" bid="" cid="" disabled="disabled"  class="checkboxes" checked="" name="data[auth][home/main][]" value="edit">
                                                <span></span>
                                            </label>
                                        </td>
                                        <td style="text-align:center" class="myselect">
                                            <label class="mt-table mt-checkbox mt-checkbox-single mt-checkbox-outline">
                                                <input type="checkbox" id="${v.id}c" aid="${v.id}" bid="" cid="" disabled="disabled"  class="checkboxes" checked="" name="data[auth][home/main][]" value="del">
                                                <span></span>
                                            </label>
                                        </td>
                                    </tr>
                                `;
                        }else {
                            str += `
                                    <tr class="odd gradeX">
                                        <td class="myselect">
                                            <label class="mt-table mt-checkbox mt-checkbox-single mt-checkbox-outline">
                                                <input type="checkbox" id="${v.id}" bid="" cid=""  class="checkboxes group-checkable menu" data-set=".zsg${v.id}" name="data[mark][]" value="home/main">
                                                <span></span>
                                            </label>
                                        </td>
                                        <td style="text-align:center">
                                            ${v.id}                            </td>
                                        <td>
                                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├&nbsp;&nbsp; <i class="fa"></i> ${v.name} </td>
                                        <td style="text-align:center" class="myselect">
                                            <label class="mt-table mt-checkbox mt-checkbox-single mt-checkbox-outline">
                                                <input type="checkbox" id="${v.id}z" aid="${v.id}" bid="" cid="" disabled="disabled"  class="checkboxes" name="data[auth][home/main][]" value="add">
                                                <span></span>
                                            </label>
                                        </td>
                                        <td style="text-align:center" class="myselect">
                                            <label class="mt-table mt-checkbox mt-checkbox-single mt-checkbox-outline">
                                                <input type="checkbox" id="${v.id}s" aid="${v.id}" bid="" cid="" disabled="disabled"  class="checkboxes" name="data[auth][home/main][]" value="edit">
                                                <span></span>
                                            </label>
                                        </td>
                                        <td style="text-align:center" class="myselect">
                                            <label class="mt-table mt-checkbox mt-checkbox-single mt-checkbox-outline">
                                                <input type="checkbox" id="${v.id}c" aid="${v.id}" bid="" cid="" disabled="disabled"  class="checkboxes"  name="data[auth][home/main][]" value="del">
                                                <span></span>
                                            </label>
                                        </td>
                                    </tr>
                                `;
                        }

                    }
                })
                $("#tab_0 > table > tbody").append(str);
                $("#submit").click(()=>{
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
                            if(y.children.length > 0){
                                $(y.children).each((l,k)=>{
                                    let inde = $.inArray(`${k.id}`,crr);
                                    if( inde >= 0){
                                        $(k).attr({checked:true})
                                        if(k.children.length > 0){
                                            $(k.children).each((m,n)=> {
                                                let ind = $.inArray(`${n.id}`, crr);
                                                if (ind >= 0) {
                                                    $(n).attr({checked:true})
                                                    if(n.children.length > 0){
                                                        $(n.children).each((s,f)=>{
                                                            let ss = $.inArray(`${f.id}`, crr);
                                                            if(ss >= 0){
                                                                $(f).attr({checked:true})
                                                                if(f.children.length > 0){
                                                                    $(f.children).each((u,o)=>{
                                                                        let ww = $.inArray(`${o.id}`, crr);
                                                                        if(ww >= 0){
                                                                            $(o).attr({checked:true})
                                                                        }else {
                                                                            $(o).attr({checked:false})
                                                                        }
                                                                    })
                                                                }
                                                            }else {
                                                                $(f).attr({checked:false})
                                                                if(f.children.length > 0){
                                                                    $(f.children).each((u,o)=>{
                                                                        $(o).attr({checked:false})
                                                                    })
                                                                }
                                                            }

                                                        })
                                                    }
                                                }else {
                                                    $(n).attr({checked:false})
                                                    if(n.children.length > 0){
                                                       $(n.children).each((s,f)=>{
                                                           $(f).attr({checked:false})
                                                           if(f.children.length > 0){
                                                               $(f.children).each((u,o)=>{
                                                                   $(o).attr({checked:false})
                                                               })
                                                           }
                                                       })
                                                    }
                                                }
                                            })
                                        }
                                    }else {
                                        $(k).attr({checked:false})
                                        if(k.children.length > 0){
                                            $(k.children).each((m,n)=>{
                                                $(n).attr({checked:false})
                                                if(n.children.length > 0){
                                                    $(n.children.length > 0).each((z,c)=>{
                                                        $(c).attr({checked:false})
                                                        if(c.children.length > 0){
                                                            $(c.children).each((t,r)=>{
                                                                $(r).attr({checked:false})
                                                            })
                                                        }
                                                    })
                                                }
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
                                            if(n.children.length > 0){
                                                $(n.children).each((e,r)=>{
                                                    $(r).attr({checked:false})
                                                    if(r.children.length > 0){
                                                        $(r.children).each((x,y)=>{
                                                            $(y).attr({checked:false})
                                                        })
                                                    }
                                                })
                                            }
                                        })
                                    }

                                })
                            }
                        }
                    })
                    console.log(data);
                    var sendData = {};
                    sendData['role_id'] = weid;
                    sendData['config'] = data;
                    $.ajax({
                        url: ApiUrl + 'admins/set_config',
                        type: 'POST',
                        data: sendData,
                        success: function(data) {
                            if (data.code === 200) {
                                swal('', '保存成功', 'success');
                            } else {
                                swal('', data.message, 'error');
                            }
                        },
                        error: function(xhr) {
                            console.log(xhr)
                        }
                    })
                })
            },
            error: function (xhr) {
                console.log(xhr)
            }
        })
    }
    aa();
})

