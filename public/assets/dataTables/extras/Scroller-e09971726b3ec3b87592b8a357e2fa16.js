/**
 * @summary     Scroller
 * @description Virtual rendering for DataTables
 * @file        Scroller.js
 * @version     1.1.0
 * @author      Allan Jardine (www.sprymedia.co.uk)
 * @license     GPL v2 or BSD 3 point style
 * @contact     www.sprymedia.co.uk/contact
 *
 * @copyright Copyright 2011-2012 Allan Jardine, all rights reserved.
 *
 * This source file is free software, under either the GPL v2 license or a
 * BSD style license, available at:
 *   http://datatables.net/license_gpl2
 *   http://datatables.net/license_bsd
 */
(function(a,b,c){var d=function(b,e){if(!this instanceof d){alert("Scroller warning: Scroller must be initialised with the 'new' keyword.");return}typeof e=="undefined"&&(e={}),this.s={dt:b,tableTop:0,tableBottom:0,redrawTop:0,redrawBottom:0,rowHeight:null,autoHeight:!0,viewportHeight:0,viewportRows:0,stateTO:null,drawTO:null},this.s=a.extend(this.s,d.oDefaults,e),this.dom={force:c.createElement("div"),scroller:null,table:null},this.s.dt.oScroller=this,this._fnConstruct()};d.prototype={fnRowToPixels:function(a){return a*this.s.rowHeight},fnPixelsToRow:function(a){return parseInt(a/this.s.rowHeight,10)},fnScrollToRow:function(b,c){var d=this.fnRowToPixels(b);typeof c=="undefined"||c?a(this.dom.scroller).animate({scrollTop:d}):a(this.dom.scroller).scrollTop(d)},fnMeasure:function(b){this.s.autoHeight&&this._fnCalcRowHeight(),this.s.viewportHeight=a(this.dom.scroller).height(),this.s.viewportRows=parseInt(this.s.viewportHeight/this.s.rowHeight,10)+1,this.s.dt._iDisplayLength=this.s.viewportRows*this.s.displayBuffer,this.s.trace&&console.log("Row height: "+this.s.rowHeight+" "+"Viewport height: "+this.s.viewportHeight+" "+"Viewport rows: "+this.s.viewportRows+" "+"Display rows: "+this.s.dt._iDisplayLength),(typeof b=="undefined"||b)&&this.s.dt.oInstance.fnDraw()},_fnConstruct:function(){var b=this;this.dom.force.style.position="absolute",this.dom.force.style.top="0px",this.dom.force.style.left="0px",this.dom.force.style.width="1px",this.dom.scroller=a("div."+this.s.dt.oClasses.sScrollBody,this.s.dt.nTableWrapper)[0],this.dom.scroller.appendChild(this.dom.force),this.dom.scroller.style.position="relative",this.dom.table=a(">table",this.dom.scroller)[0],this.dom.table.style.position="absolute",this.dom.table.style.top="0px",this.dom.table.style.left="0px",a(this.s.dt.nTableWrapper).addClass("DTS"),this.s.loadingIndicator&&a(this.dom.scroller.parentNode).css("position","relative").append('<div class="DTS_Loading">'+this.s.dt.oLanguage.sLoadingRecords+"</div>"),this.s.rowHeight&&this.s.rowHeight!="auto"&&(this.s.autoHeight=!1),this.fnMeasure(!1),a(this.dom.scroller).scroll(function(){b._fnScroll.call(b)}),a(this.dom.scroller).bind("touchstart",function(){b._fnScroll.call(b)}),this.s.dt.aoDrawCallback.push({fn:function(){b.s.dt.bInitialised&&b._fnDrawCallback.call(b)},sName:"Scroller"}),this.s.dt.oApi._fnCallbackReg(this.s.dt,"aoStateSaveParams",function(a,c){c.iScroller=b.dom.scroller.scrollTop},"Scroller_State")},_fnScroll:function(){var b=this,c=this.dom.scroller.scrollTop,d;if(this.s.dt.bFiltered||this.s.dt.bSorted)return;this.s.trace&&console.log("Scroll: "+c+"px - boundaries: "+this.s.redrawTop+" / "+this.s.redrawBottom+". "+" Showing rows "+this.fnPixelsToRow(c)+" to "+this.fnPixelsToRow(c+a(this.dom.scroller).height())+" in the viewport, with rows "+this.s.dt._iDisplayStart+" to "+this.s.dt._iDisplayEnd+" rendered by the DataTable"),this._fnInfo(),clearTimeout(this.s.stateTO),this.s.stateTO=setTimeout(function(){b.s.dt.oApi._fnSaveState(b.s.dt)},250);if(c<this.s.redrawTop||c>this.s.redrawBottom){var e=(this.s.displayBuffer-1)/2*this.s.viewportRows;d=parseInt(c/this.s.rowHeight,10)-e,d<0?d=0:d+this.s.dt._iDisplayLength>this.s.dt.fnRecordsDisplay()?(d=this.s.dt.fnRecordsDisplay()-this.s.dt._iDisplayLength,d<0&&(d=0)):d%2!==0&&d++,d!=this.s.dt._iDisplayStart&&(this.s.tableTop=a(this.s.dt.nTable).offset().top,this.s.tableBottom=a(this.s.dt.nTable).height()+this.s.tableTop,this.s.dt.oFeatures.bServerSide?(clearTimeout(this.s.drawTO),this.s.drawTO=setTimeout(function(){b.s.dt._iDisplayStart=d,b.s.dt.oApi._fnCalculateEnd(b.s.dt),b.s.dt.oApi._fnDraw(b.s.dt)},this.s.serverWait)):(this.s.dt._iDisplayStart=d,this.s.dt.oApi._fnCalculateEnd(this.s.dt),this.s.dt.oApi._fnDraw(this.s.dt)),this.s.trace&&console.log("Scroll forcing redraw - top DT render row: "+d))}},_fnDrawCallback:function(){var b=this,c=this.dom.scroller.scrollTop,d=c+this.s.viewportHeight;this.dom.force.style.height=this.s.rowHeight*this.s.dt.fnRecordsDisplay()+"px";var e=this.s.rowHeight*this.s.dt._iDisplayStart;this.s.dt._iDisplayStart===0?e=0:this.s.dt._iDisplayStart===this.s.dt.fnRecordsDisplay()-this.s.dt._iDisplayLength&&(e=this.s.rowHeight*this.s.dt._iDisplayStart),this.dom.table.style.top=e+"px",this.s.tableTop=e,this.s.tableBottom=a(this.s.dt.nTable).height()+this.s.tableTop,this.s.redrawTop=c-(c-this.s.tableTop)*this.s.boundaryScale,this.s.redrawBottom=c+(this.s.tableBottom-d)*this.s.boundaryScale,this.s.trace&&console.log("Table redraw. Table top: "+e+"px "+"Table bottom: "+this.s.tableBottom+" "+"Scroll boundary top: "+this.s.redrawTop+" "+"Scroll boundary bottom: "+this.s.redrawBottom+" "+"Rows drawn: "+this.s.dt._iDisplayLength),setTimeout(function(){b._fnInfo.call(b)},0),this.s.dt.oFeatures.bStateSave&&this.s.dt.oLoadedState!==null&&typeof this.s.dt.oLoadedState.iScroller!="undefined"&&(this.s.dt.sAjaxSource!==null&&this.s.dt.iDraw==2||this.s.dt.sAjaxSource===null&&this.s.dt.iDraw==1)&&setTimeout(function(){a(b.dom.scroller).scrollTop(b.s.dt.oLoadedState.iScroller),b.s.redrawTop=b.s.dt.oLoadedState.iScroller-b.s.viewportHeight/2},0)},_fnCalcRowHeight:function(){var b=this.s.dt.nTable.cloneNode(!1),d=a('<div class="'+this.s.dt.oClasses.sWrapper+' DTS">'+'<div class="'+this.s.dt.oClasses.sScrollWrapper+'">'+'<div class="'+this.s.dt.oClasses.sScrollBody+'"></div>'+"</div>"+"</div>")[0];a(b).append("<tbody><tr><td>&nbsp;</td></tr></tbody>"),a("div."+this.s.dt.oClasses.sScrollBody,d).append(b),c.body.appendChild(d),this.s.rowHeight=a("tbody tr",b).outerHeight(),c.body.removeChild(d)},_fnInfo:function(){if(!this.s.dt.oFeatures.bInfo)return;var b=this.s.dt,c=this.dom.scroller.scrollTop,d=this.fnPixelsToRow(c)+1,e=b.fnRecordsTotal(),f=b.fnRecordsDisplay(),g=this.fnPixelsToRow(c+a(this.dom.scroller).height()),h=f<g?f:g,i=b.fnFormatNumber(d),j=b.fnFormatNumber(h),k=b.fnFormatNumber(e),l=b.fnFormatNumber(f),m;b.fnRecordsDisplay()===0&&b.fnRecordsDisplay()==b.fnRecordsTotal()?m=b.oLanguage.sInfoEmpty+b.oLanguage.sInfoPostFix:b.fnRecordsDisplay()===0?m=b.oLanguage.sInfoEmpty+" "+b.oLanguage.sInfoFiltered.replace("_MAX_",k)+b.oLanguage.sInfoPostFix:b.fnRecordsDisplay()==b.fnRecordsTotal()?m=b.oLanguage.sInfo.replace("_START_",i).replace("_END_",j).replace("_TOTAL_",l)+b.oLanguage.sInfoPostFix:m=b.oLanguage.sInfo.replace("_START_",i).replace("_END_",j).replace("_TOTAL_",l)+" "+b.oLanguage.sInfoFiltered.replace("_MAX_",b.fnFormatNumber(b.fnRecordsTotal()))+b.oLanguage.sInfoPostFix;var n=b.aanFeatures.i;if(typeof n!="undefined")for(var o=0,p=n.length;o<p;o++)a(n[o]).html(m)}},d.oDefaults={trace:!1,rowHeight:"auto",serverWait:200,displayBuffer:9,boundaryScale:.5,loadingIndicator:!1},d.prototype.CLASS="Scroller",d.VERSION="1.1.0",d.prototype.VERSION=d.VERSION,typeof a.fn.dataTable=="function"&&typeof a.fn.dataTableExt.fnVersionCheck=="function"&&a.fn.dataTableExt.fnVersionCheck("1.9.0")?a.fn.dataTableExt.aoFeatures.push({fnInit:function(a){var b=typeof a.oInit.oScroller=="undefined"?{}:a.oInit.oScroller,c=new d(a,b);return c.dom.wrapper},cFeature:"S",sFeature:"Scroller"}):alert("Warning: Scroller requires DataTables 1.9.0 or greater - www.datatables.net/download"),a.fn.dataTable.Scroller=d})(jQuery,window,document);