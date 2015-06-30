define(function(require ,exports ,module){
    var $ = require('jqueryMin');
	require('kendoWeb');
	var dateUtility = require('../js/DateUtility');
	var g ={ }, helper, process, event;


   g.node = {	  
		eventLogStartTime : $("#txt_eventLog_startTime"),
		eventLogEndTime : $("#txt_eventLog_endTime"),
		eventLogGrid : $("#eventLog_grid"),
		eventLogExport : $("#a_eventLog_Export"),
		eventLogCode : $("#txt_eventLog_Code"),
		eventLogQuery : $("#btn_eventLog_Query"),
		validator : $("#eventLogForm").kendoValidator().data("kendoValidator"),
		hasQuery : $("#txt_eventLog_query")
   };
	 process = {
   
         init: function(){
		     event.listener();
		 },
		 initDate: function(){
		  
		   //中文化
		    kendo.culture("zh-CN");
		    	// 开始时间
			g.node.eventLogStartTime.kendoDateTimePicker({
				animation : false,
				format : "yyyy-MM-dd HH:mm:ss",
				value : dateUtility.dateFormat(new Date(), "yyyy-MM-dd hh:mm:ss")
			});
			// 结束时间
			g.node.eventLogEndTime.kendoDateTimePicker({
				animation : false,
				format : "yyyy-MM-dd HH:mm:ss",
				value : dateUtility.dateFormat(new Date(), "yyyy-MM-dd hh:mm:ss")
			});   
		 },
		//查询
	    query : function() {  
		    g.node.hasQuery.val("1");
		    if (process.validate()) {
				var startTime = g.node.eventLogStartTime.val();
				var endTime = g.node.eventLogEndTime.val();
				var vendorCode = g.node.eventLogCode.val();
				var where = vendorCode + "_" + startTime + "_" + endTime;

				g.node.eventLogGrid.data("kendoGrid").dataSource.filter({
					field : "vendorCode,startTime,endTime",
					operator : "eq",
					value : where
				}); 
		    } else {
				g.node.hasQuery.val("");
			}
		},
		validate : function() {
			var retVal = g.node.validator.validate(); 
			return retVal;
		},
		//导出
		aexport : function(){
		 if (process.validate()) {
		       	var startTime = g.node.eventLogStartTime.val();
				var endTime = g.node.eventLogEndTime.val();
				var vendorCode = g.node.eventLogCode.val();
				var where = vendorCode + "_" + startTime + "_" + endTime;

				var url = "http://120.24.52.131:8080/GDCP-QT/eventLogServlet?export=true&where='" + where
						+ "'";
				g.node.eventLogExport.attr('href', url);
		   } else {
				return false;
			}
		},
		//清空Dialog数据
		reload : function(){
		    
		    g.node.eventLogStartTime.val('');
			g.node.eventLogEndTime.val('');
			g.node.eventLogCode.val('');
			g.node.hasQuery.val('');
			g.node.validator.hideMessages();
		    var dataSource = new kendo.data.DataSource({
                  data: [
                      {}
                     ]
             });
			var grid = g.node.eventLogGrid.data("kendoGrid");
			grid.setDataSource(dataSource);
		},
		 eventLogGridData : function(){
	         g.node.eventLogGrid.kendoGrid({
				dataSource : {
					type : "odata",
					transport : {
						read : "http://120.24.52.131:8080/GDCP-QT/eventLogServlet"
					},
					schema : {
						model : {
							fields : {
								devcode : {
									type : "string"
								},
								connecttime : {
									type : "string"
								},
								serverid : {
									type : "string"
								},
								eventtype : {
									type : "string"
								}
							}
						}
					},
					pageSize : 20,
					serverPaging : true,
					serverFiltering : true,
					serverSorting : true
				},
				sortable : false,
				filterable : false,
				columnMenu : true,
				pageable : true,
				height : 700,
				columns : [ {
					field : "devcode",
					title : "车机ID",
					width : 180
				}, {
					field : "connecttime",
					title : "接入时间",
					width : 140
				}, {
					field : "serverid",
					title : "服务器名称",
					width : 180
				}, {
					field : "eventtype",
					title : "事件类型",
					width : 180
				} ],
				dataBinding : function(e) { 
				}
			});
		 }
	};
	event = {
        listener: function(){ 
		    g.node.eventLogQuery.on("click",process.query);
			g.node.eventLogExport.on("click", process.aexport);
		}
    }; 
   module.exports = { 
        bindGridData : function(){
		    process.eventLogGridData();
		},
		init : function(){
		    process.initDate();
		    process.init();
		},
		reload : function(){
		    process.reload();
		}
   };
})