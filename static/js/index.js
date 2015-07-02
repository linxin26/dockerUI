define(function(require, exports,module){
    var $ = require('jqueryMin'); 
	require('aceElements');
	require('ace');
	require('jqueryUI');
	require('jqueryUiTouch');
	require('bootbox');
	require('jqueryEasy');
	require('jqueryGritter'); 
	require('bootstrap');
	require('typeaheadBS'); 
    var g ={ }, helper, process, event;
   
   g.node = {	 
   };
   
   helper = {
         /**
		  数据窗口
		 **/
		 openWindow : function(window,dialog,dataBind,title){
		     dialog.show(); 
			  var undo = window.bind("click",function(){
			      dialog.data("kendoWindow").open();
				 //undo.hide();
			 });
			 var onClose = function(){
			    //undo.show();
			 };
			 if (!dialog.data("kendoWindow")) {
					dialog.kendoWindow({
						width : "870px",
						title : title,
						actions : [
							"Pin",
							"Minimize",
							"Maximize",
							"Close"
						],
						close : onClose
					});
			};
            //绑定数据 			
			dataBind(); 
		 }
   };
   
   process = {
   
         init: function(){
		     event.listener();
			 process.loadData();
		 },
	   loadData : function(){
		   $.ajax({
			  url:"http://192.168.140.151:9000/dockerapi/images/json?all=0",
			   success:function(){
				   console.log("ajax");
			   },
			   dataType:"jsonp"
		   });
	   },
         format : function(date, fmt) {
			var o = {
				"M+" : date.getMonth() + 1, // 月份
				"d+" : date.getDate(), // 日
				"h+" : date.getHours(), // 小时
				"m+" : date.getMinutes(), // 分
				"s+" : date.getSeconds(), // 秒
				"q+" : Math.floor((date.getMonth() + 3) / 3), // 季度
				"S" : date.getMilliseconds()
			// 毫秒
			};
			if (/(y+)/.test(fmt))
				fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "")
						.substr(4 - RegExp.$1.length));
			for ( var k in o)
				if (new RegExp("(" + k + ")").test(fmt))
					fmt = fmt.replace(RegExp.$1,
							(RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k])
									.substr(("" + o[k]).length)));
			return fmt;
		}
   
   };
   
   event = {
        //绑定事件
        listener: function(){ 
		}
   };

   window.$ = $;
   module.exports = {
   
        init : function(){
		    process.init();
		}
   };
});