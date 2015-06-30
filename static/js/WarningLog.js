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
	require('kendoCulture');
	require('kendoWeb');
	var dateUtility = require('../js/DateUtility');
    var g ={ }, helper, process, event;
   
   g.node = {
        startTime : $("#txtStartTime"),
		endTime : $("#txtEndTime"),
		queryBtn : $("#btnQuery"),
		selService : $("#sel_service"),
		waringLog : "#waringLog",
		menu : "#menu a",
		navigator: "#alink_navigator",
		grid : $("#grid")   
   };
   
   helper = {
   };
   
   process = {
   
         init: function(){
		     //初始控件
            process.initControl();
            process.initMenu();
			process.initGrid();
			// 绑定事件
		     event.listener();
		 },
         initControl: function(){
//			contents.find("#waringLog").addClass(".navigation a:hover");    
			
			kendo.culture("zh-CN");
			g.node.startTime.kendoDateTimePicker({
				animation : false,
				format : "yyyy-MM-dd HH:mm:ss"
			});
			// 结束时间
			g.node.endTime.kendoDateTimePicker({
				animation : false,
				format : "yyyy-MM-dd HH:mm:ss",
				value : dateUtility.dateFormat(new Date(), "yyyy-MM-dd hh:mm:ss")
			});
		},
		initMenu:function(){
			var contents = $(parent.document).contents(); 
			contents.find(g.node.navigator).text("》预警日志"); 
//			console.log(contents.find("#waringLog"));
			
			contents.find(g.node.menu).css("-webkit-box-shadow","");
			contents.find(g.node.menu).css("box-shadow","");
			contents.find(g.node.menu).css("color","");
			contents.find(g.node.waringLog).css("-webkit-box-shadow","-1px 0 0 #EF705B, 2px 0 0 #EF705B inset");
			contents.find(g.node.waringLog).css("box-shadow","-1px 0 0 #EF705B, 2px 0 0 #EF705B inset");
			contents.find(g.node.waringLog).css("color","red");
		},
		initGrid : function() {
			g.node.grid.kendoGrid({
				dataSource : {
					type : "odata",
					transport : {
						read : "http://192.168.1.106:8080/GDCP-Monitor-Web/alertMessagetServlet"
					},
					schema : {
						model : {
							fields : {

								id : {
									type : "string"
								},
								alertType : {
									type : "string"
								},
								receiver : {
									type : "string"
								},
								content : {
									type : "string"
								},
								alertTime : {
									type : "string"
								},
								success : {
									type : "string"
								}
							}
						}
					},
					pageSize : 10,
					serverPaging : true,
					serverFiltering : true,
					serverSorting : true
				},
				sortable : false,
				filterable : false,
				columnMenu : true,
				pageable : true,
				columns : [ {
					field : "id",
					title : "序列号",
					width : 80
				}, {
					field : "alertType",
					title : "预警类型",
					width : 80
				}, {
					field : "content",
					title : "详细信息",
					width : 180
				}, {
					field : "alertTime",
					title : "报警时间",
					width : 100
				}, {
					field : "receiver",
					title : "通知人",
					width : 100
				}, {
					field : "success",
					title : "是否成功",
					width : 100
				} ],
				dataBinding : function(e) {
					// if (e.items.length == 0) {
					// g.node.message.text("没有数据！");
					// } else {
					// g.node.message.text("");
					// }
				}
			});
		},
		/**
		 * 查询
		 */
		query : function() {

			var startTime = g.node.startTime.val();
			var endTime = g.node.endTime.val();
			var where = startTime + "_" + endTime;

			g.node.grid.data("kendoGrid").dataSource.filter({
				field : "startTime,endTime",
				operator : "eq",
				value : where
			});

		}
   };
   
   event = {
        //绑定事件
        listener: function(){ 
	     	g.node.queryBtn.on("click", function() {
				process.query();
			});
		}
   };

   window.$ = $;
   module.exports = {
   
        init : function(){
		    process.init();
		}
   };
});