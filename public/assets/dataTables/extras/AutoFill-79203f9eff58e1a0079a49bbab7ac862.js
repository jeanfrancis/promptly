/*
 * File:        AutoFill.js
 * Version:     1.1.2
 * CVS:         $Id$
 * Description: AutoFill for DataTables
 * Author:      Allan Jardine (www.sprymedia.co.uk)
 * Created:     Mon  6 Sep 2010 16:54:41 BST
 * Modified:    $Date$ by $Author$
 * Language:    Javascript
 * License:     GPL v2 or BSD 3 point
 * Project:     DataTables
 * Contact:     www.sprymedia.co.uk/contact
 *
 * Copyright 2010-2011 Allan Jardine, all rights reserved.
 *
 * This source file is free software, under either the GPL v2 license or a
 * BSD style license, available at:
 *   http://datatables.net/license_gpl2
 *   http://datatables.net/license_bsd
 *
 */
/* Global scope for AutoFill */
var AutoFill;(function(a){AutoFill=function(b,c){if(!this.CLASS||this.CLASS!="AutoFill"){alert("Warning: AutoFill must be initialised with the keyword 'new'");return}if(!a.fn.dataTableExt.fnVersionCheck("1.7.0")){alert("Warning: AutoFill requires DataTables 1.7 or greater - www.datatables.net/download");return}return this.s={filler:{height:0,width:0},border:{width:2},drag:{startX:-1,startY:-1,startTd:null,endTd:null,dragging:!1},screen:{interval:null,y:0,height:0,scrollTop:0},scroller:{top:0,bottom:0},columns:[]},this.dom={table:null,filler:null,borderTop:null,borderRight:null,borderBottom:null,borderLeft:null,currentTarget:null},this.fnSettings=function(){return this.s},this._fnInit(b,c),this},AutoFill.prototype={_fnInit:function(b,c){var d=this,e,f;this.s.dt=b.fnSettings(),this.dom.table=this.s.dt.nTable;for(e=0,f=this.s.dt.aoColumns.length;e<f;e++)this._fnAddColumn(e);typeof c!="undefined"&&typeof c.aoColumnDefs!="undefined"&&this._fnColumnDefs(c.aoColumnDefs),typeof c!="undefined"&&typeof c.aoColumns!="undefined"&&this._fnColumnsAll(c.aoColumns);var g=document.createElement("div");g.className="AutoFill_filler",document.body.appendChild(g),this.dom.filler=g,g.style.display="block",this.s.filler.height=a(g).height(),this.s.filler.width=a(g).width(),g.style.display="none";var h,i=document.body;d.s.dt.oScroll.sY!==""&&(d.s.dt.nTable.parentNode.style.position="relative",i=d.s.dt.nTable.parentNode),h=document.createElement("div"),h.className="AutoFill_border",i.appendChild(h),this.dom.borderTop=h,h=document.createElement("div"),h.className="AutoFill_border",i.appendChild(h),this.dom.borderRight=h,h=document.createElement("div"),h.className="AutoFill_border",i.appendChild(h),this.dom.borderBottom=h,h=document.createElement("div"),h.className="AutoFill_border",i.appendChild(h),this.dom.borderLeft=h,a(g).mousedown(function(a){return this.onselectstart=function(){return!1},d._fnFillerDragStart.call(d,a),!1}),a("tbody>tr>td",this.dom.table).live("mouseover mouseout",function(a){d._fnFillerDisplay.call(d,a)})},_fnColumnDefs:function(a){var b,c,d,e,f,g,h;for(b=a.length-1;b>=0;b--){h=a[b].aTargets;for(c=0,f=h.length;c<f;c++)if(typeof h[c]=="number"&&h[c]>=0)this._fnColumnOptions(h[c],a[b]);else if(typeof h[c]=="number"&&h[c]<0)this._fnColumnOptions(this.s.dt.aoColumns.length+h[c],a[b]);else if(typeof h[c]=="string")for(d=0,g=this.s.dt.aoColumns.length;d<g;d++)(h[c]=="_all"||this.s.dt.aoColumns[d].nTh.className.indexOf(h[c])!=-1)&&this._fnColumnOptions(d,a[b])}},_fnColumnsAll:function(a){for(var b=0,c=this.s.dt.aoColumns.length;b<c;b++)this._fnColumnOptions(b,a[b])},_fnAddColumn:function(a){this.s.columns[a]={enable:!0,read:this._fnReadCell,write:this._fnWriteCell,step:this._fnStep,complete:null}},_fnColumnOptions:function(a,b){typeof b.bEnable!="undefined"&&(this.s.columns[a].enable=b.bEnable),typeof b.fnRead!="undefined"&&(this.s.columns[a].read=b.fnRead),typeof b.fnWrite!="undefined"&&(this.s.columns[a].write=b.fnWrite),typeof b.fnStep!="undefined"&&(this.s.columns[a].step=b.fnStep),typeof b.fnCallback!="undefined"&&(this.s.columns[a].complete=b.fnCallback)},_fnTargetCoords:function(b){var c=a(b).parents("tr")[0];return{x:a("td",c).index(b),y:a("tr",c.parentNode).index(c)}},_fnUpdateBorder:function(b,c){var d=this.s.border.width,e=a(b).offset(),f=a(c).offset(),g=e.left-d,h=f.left+a(c).outerWidth(),i=e.top-d,j=f.top+a(c).outerHeight(),k=f.left+a(c).outerWidth()-e.left+2*d,l=f.top+a(c).outerHeight()-e.top+2*d,m;if(this.s.dt.oScroll.sY!==""){var n=a(this.s.dt.nTable.parentNode).offset(),o=a(this.s.dt.nTable.parentNode).scrollTop(),p=a(this.s.dt.nTable.parentNode).scrollLeft();g-=n.left-p,h-=n.left-p,i-=n.top-o,j-=n.top-o}m=this.dom.borderTop.style,m.top=i+"px",m.left=g+"px",m.height=this.s.border.width+"px",m.width=k+"px",m=this.dom.borderBottom.style,m.top=j+"px",m.left=g+"px",m.height=this.s.border.width+"px",m.width=k+"px",m=this.dom.borderLeft.style,m.top=i+"px",m.left=g+"px",m.height=l+"px",m.width=this.s.border.width+"px",m=this.dom.borderRight.style,m.top=i+"px",m.left=h+"px",m.height=l+"px",m.width=this.s.border.width+"px"},_fnFillerDragStart:function(b){var c=this,d=this.dom.currentTarget;this.s.drag.dragging=!0,c.dom.borderTop.style.display="block",c.dom.borderRight.style.display="block",c.dom.borderBottom.style.display="block",c.dom.borderLeft.style.display="block";var e=this._fnTargetCoords(d);this.s.drag.startX=e.x,this.s.drag.startY=e.y,this.s.drag.startTd=d,this.s.drag.endTd=d,this._fnUpdateBorder(d,d),a(document).bind("mousemove.AutoFill",function(a){c._fnFillerDragMove.call(c,a)}),a(document).bind("mouseup.AutoFill",function(a){c._fnFillerFinish.call(c,a)}),this.s.screen.y=b.pageY,this.s.screen.height=a(window).height(),this.s.screen.scrollTop=a(document).scrollTop(),this.s.dt.oScroll.sY!==""&&(this.s.scroller.top=a(this.s.dt.nTable.parentNode).offset().top,this.s.scroller.bottom=this.s.scroller.top+a(this.s.dt.nTable.parentNode).height()),this.s.screen.interval=setInterval(function(){var b=a(document).scrollTop(),d=b-c.s.screen.scrollTop;c.s.screen.y+=d,c.s.screen.height-c.s.screen.y+b<50?a("html, body").animate({scrollTop:b+50},240,"linear"):c.s.screen.y-b<50&&a("html, body").animate({scrollTop:b-50},240,"linear"),c.s.dt.oScroll.sY!==""&&(c.s.screen.y>c.s.scroller.bottom-50?a(c.s.dt.nTable.parentNode).animate({scrollTop:a(c.s.dt.nTable.parentNode).scrollTop()+50},240,"linear"):c.s.screen.y<c.s.scroller.top+50&&a(c.s.dt.nTable.parentNode).animate({scrollTop:a(c.s.dt.nTable.parentNode).scrollTop()-50},240,"linear"))},250)},_fnFillerDragMove:function(b){if(b.target&&b.target.nodeName.toUpperCase()=="TD"&&b.target!=this.s.drag.endTd){var c=this._fnTargetCoords(b.target);c.x!=this.s.drag.startX&&(b.target=a("tbody>tr:eq("+c.y+")>td:eq("+this.s.drag.startX+")",this.dom.table)[0],c=this._fnTargetCoords(b.target));if(c.x==this.s.drag.startX){var d=this.s.drag;d.endTd=b.target,c.y>=this.s.drag.startY?this._fnUpdateBorder(d.startTd,d.endTd):this._fnUpdateBorder(d.endTd,d.startTd),this._fnFillerPosition(b.target)}}this.s.screen.y=b.pageY,this.s.screen.scrollTop=a(document).scrollTop(),this.s.dt.oScroll.sY!==""&&(this.s.scroller.scrollTop=a(this.s.dt.nTable.parentNode).scrollTop(),this.s.scroller.top=a(this.s.dt.nTable.parentNode).offset().top,this.s.scroller.bottom=this.s.scroller.top+a(this.s.dt.nTable.parentNode).height())},_fnFillerFinish:function(b){var c=this;a(document).unbind("mousemove.AutoFill"),a(document).unbind("mouseup.AutoFill"),this.dom.borderTop.style.display="none",this.dom.borderRight.style.display="none",this.dom.borderBottom.style.display="none",this.dom.borderLeft.style.display="none",this.s.drag.dragging=!1,clearInterval(this.s.screen.interval);var d=this._fnTargetCoords(this.s.drag.startTd),e=this._fnTargetCoords(this.s.drag.endTd),f=[],g;if(d.y<=e.y){g=!0;for(i=d.y;i<=e.y;i++)f.push(a("tbody>tr:eq("+i+")>td:eq("+d.x+")",this.dom.table)[0])}else{g=!1;for(i=d.y;i>=e.y;i--)f.push(a("tbody>tr:eq("+i+")>td:eq("+d.x+")",this.dom.table)[0])}var h=d.x,j=!1,k=[],l=this.s.columns[h].read.call(this,this.s.drag.startTd),m=this._fnPrep(l);for(i=0,iLen=f.length;i<iLen;i++){i==iLen-1&&(j=!0);var n=this.s.columns[h].read.call(this,f[i]),o=this.s.columns[h].step.call(this,f[i],m,i,g,"SPRYMEDIA_AUTOFILL_STEPPER");this.s.columns[h].write.call(this,f[i],o,j),k.push({td:f[i],newValue:o,oldValue:n})}this.s.columns[h].complete!==null&&this.s.columns[h].complete.call(this,k)},_fnPrep:function(a){var b=a.match(/[\d\.]+/g);if(!b||b.length===0)return{iStart:0,sStr:a,sPostFix:""};var c=b[b.length-1],d=parseInt(c,10),e=new RegExp("^(.*)"+c+"(.*?)$"),f=c.match(/\./)?"."+c.split(".")[1]:"";return{iStart:d,sStr:a.replace(e,"$1SPRYMEDIA_AUTOFILL_STEPPER$2"),sPostFix:f}},_fnStep:function(a,b,c,d,e){var f=d?b.iStart+c:b.iStart-c;return isNaN(f)&&(f=""),b.sStr.replace(e,f+b.sPostFix)},_fnReadCell:function(b){var c=a("input",b);return c.length>0?a(c).val():(c=a("select",b),c.length>0?a(c).val():b.innerHTML)},_fnWriteCell:function(b,c,d){var e=a("input",b);if(e.length>0){a(e).val(c);return}e=a("select",b);if(e.length>0){a(e).val(c);return}var f=this.s.dt.oInstance.fnGetPosition(b);this.s.dt.oInstance.fnUpdate(c,f[0],f[2],d)},_fnFillerDisplay:function(b){if(this.s.drag.dragging)return;var c=b.target.nodeName.toLowerCase()=="td"?b.target:a(b.target).parents("td")[0],d=this._fnTargetCoords(c).x;if(!this.s.columns[d].enable)return;var e=this.dom.filler;if(b.type=="mouseover")this.dom.currentTarget=c,this._fnFillerPosition(c),e.style.display="block";else if(!b.relatedTarget||!b.relatedTarget.className.match(/AutoFill/))e.style.display="none"},_fnFillerPosition:function(b){var c=a(b).offset(),d=this.dom.filler;d.style.top=c.top-this.s.filler.height/2-1+a(b).outerHeight()+"px",d.style.left=c.left-this.s.filler.width/2-1+a(b).outerWidth()+"px"}},AutoFill.prototype.CLASS="AutoFill",AutoFill.VERSION="1.1.2",AutoFill.prototype.VERSION=AutoFill.VERSION})(jQuery);