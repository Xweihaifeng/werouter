﻿/*
 Copyright (c) 2003-2017, CKSource - Frederico Knabben. All rights reserved.
 For licensing, see LICENSE.md or http://ckeditor.com/license
*/
(function(){function x(a){return CKEDITOR.env.ie?a.$.clientWidth:parseInt(a.getComputedStyle("width"),10)}function q(a,g){var b=a.getComputedStyle("border-"+g+"-width"),k={thin:"0px",medium:"1px",thick:"2px"};0>b.indexOf("px")&&(b=b in k&&"none"!=a.getComputedStyle("border-style")?k[b]:0);return parseInt(b,10)}function z(a){var g=[],b=-1,k="rtl"==a.getComputedStyle("direction"),e;e=a.$.rows;for(var l=0,d,f,c,h=0,t=e.length;h<t;h++)c=e[h],d=c.cells.length,d>l&&(l=d,f=c);e=f;d=new CKEDITOR.dom.element(a.$.tBodies[0]);
l=d.getDocumentPosition();d=d.$.offsetHeight;a.$.tHead&&(f=new CKEDITOR.dom.element(a.$.tHead),l=f.getDocumentPosition(),d+=f.$.offsetHeight);a.$.tFoot&&(d+=a.$.tFoot.offsetHeight);f=0;for(c=e.cells.length;f<c;f++){var h=new CKEDITOR.dom.element(e.cells[f]),t=e.cells[f+1]&&new CKEDITOR.dom.element(e.cells[f+1]),b=b+(h.$.colSpan||1),n,m,p=h.getDocumentPosition().x;k?m=p+q(h,"left"):n=p+h.$.offsetWidth-q(h,"right");t?(p=t.getDocumentPosition().x,k?n=p+t.$.offsetWidth-q(t,"right"):m=p+q(t,"left")):(p=
a.getDocumentPosition().x,k?n=p:m=p+a.$.offsetWidth);h=Math.max(m-n,3);g.push({table:a,index:b,x:n,y:l.y,width:h,height:d,rtl:k})}return g}function y(a){(a.data||a).preventDefault()}function F(a){function g(){h=0;c.setOpacity(0);n&&b();var a=d.table;setTimeout(function(){a.removeCustomData("_cke_table_pillars")},0);f.removeListener("dragstart",y)}function b(){for(var E=d.rtl,e=E?A.length:p.length,f=0,b=0;b<e;b++){var c=p[b],k=A[b],h=d.table;CKEDITOR.tools.setTimeout(function(b,d,c,k,g,l){b&&b.setStyle("width",
m(Math.max(d+l,1)));c&&c.setStyle("width",m(Math.max(k-l,1)));g&&h.setStyle("width",m(g+l*(E?-1:1)));++f==e&&a.fire("saveSnapshot")},0,this,[c,c&&x(c),k,k&&x(k),(!c||!k)&&x(h)+q(h,"left")+q(h,"right"),n])}}function k(b){y(b);a.fire("saveSnapshot");b=d.index;for(var k=CKEDITOR.tools.buildTableMap(d.table),g=[],m=[],q=Number.MAX_VALUE,u=q,w=d.rtl,B=0,z=k.length;B<z;B++){var r=k[B],v=r[b+(w?1:0)],r=r[b+(w?0:1)],v=v&&new CKEDITOR.dom.element(v),r=r&&new CKEDITOR.dom.element(r);v&&r&&v.equals(r)||(v&&
(q=Math.min(q,x(v))),r&&(u=Math.min(u,x(r))),g.push(v),m.push(r))}p=g;A=m;C=d.x-q;D=d.x+u;c.setOpacity(.5);t=parseInt(c.getStyle("left"),10);n=0;h=1;c.on("mousemove",l);f.on("dragstart",y);f.on("mouseup",e,this)}function e(a){a.removeListener();g()}function l(a){u(a.data.getPageOffset().x)}var d,f,c,h,t,n,u,p,A,C,D;f=a.document;c=CKEDITOR.dom.element.createFromHtml('\x3cdiv data-cke-temp\x3d1 contenteditable\x3dfalse unselectable\x3don style\x3d"position:absolute;cursor:col-resize;filter:alpha(opacity\x3d0);opacity:0;padding:0;background-color:#004;background-image:none;border:0px none;z-index:10"\x3e\x3c/div\x3e',
f);a.on("destroy",function(){c.remove()});w||f.getDocumentElement().append(c);this.attachTo=function(a){h||(w&&(f.getBody().append(c),n=0),d=a,c.setStyles({width:m(a.width),height:m(a.height),left:m(a.x),top:m(a.y)}),w&&c.setOpacity(.25),c.on("mousedown",k,this),f.getBody().setStyle("cursor","col-resize"),c.show())};u=this.move=function(a){if(!d)return 0;if(!h&&(a<d.x||a>d.x+d.width))return d=null,h=n=0,f.removeListener("mouseup",e),c.removeListener("mousedown",k),c.removeListener("mousemove",l),
f.getBody().setStyle("cursor","auto"),w?c.remove():c.hide(),0;a-=Math.round(c.$.offsetWidth/2);if(h){if(a==C||a==D)return 1;a=Math.max(a,C);a=Math.min(a,D);n=a-t}c.setStyle("left",m(a));return 1}}function u(a){var g=a.data.getTarget();if("mouseout"==a.name){if(!g.is("table"))return;for(var b=new CKEDITOR.dom.element(a.data.$.relatedTarget||a.data.$.toElement);b&&b.$&&!b.equals(g)&&!b.is("body");)b=b.getParent();if(!b||b.equals(g))return}g.getAscendant("table",1).removeCustomData("_cke_table_pillars");
a.removeListener()}var m=CKEDITOR.tools.cssLength,w=CKEDITOR.env.ie&&(CKEDITOR.env.ie7Compat||CKEDITOR.env.quirks);CKEDITOR.plugins.add("tableresize",{requires:"tabletools",init:function(a){a.on("contentDom",function(){var g,b=a.editable();b.attachListener(b.isInline()?b:a.document,"mousemove",function(b){b=b.data;var e=b.getTarget();if(e.type==CKEDITOR.NODE_ELEMENT){var l=b.getPageOffset().x;if(g&&g.move(l))y(b);else if(e.is("table")||e.getAscendant({thead:1,tbody:1,tfoot:1},1))if(e=e.getAscendant("table",
1),a.editable().contains(e)){(b=e.getCustomData("_cke_table_pillars"))||(e.setCustomData("_cke_table_pillars",b=z(e)),e.on("mouseout",u),e.on("mousedown",u));a:{for(var e=0,d=b.length;e<d;e++){var f=b[e];if(l>=f.x&&l<=f.x+f.width){l=f;break a}}l=null}l&&(!g&&(g=new F(a)),g.attachTo(l))}}})})}})})();