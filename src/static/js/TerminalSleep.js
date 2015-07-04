define(function(require ,exports ,module){
    var $ = require('jqueryMin');
	require('kendoWeb');
	var dateUtility = require('../js/DateUtility');
	var g ={ }, helper, process, event;


   g.node = {	  
		sleepStartTime : $("#txt_sleep_startTime"),
		sleepEndTime : $("#txt_sleep_endTime"),
		sleepGrid : $("#sleep_grid"),
		sleepExport : $("#a_sleep_Export"),
		sleepCode : $("#txt_sleep_Code"),
		sleepQuery : $("#btn_sleep_Query"),
		validator : $("#sleepForm").kendoValidator().data("kendoValidator"),
		hasQuery : $("#txt_sleep_query")
   };
	 process = {
   
         init: function(){
		     event.listener();
		 },
		 initDate: function(){
		  
		   //中文化
		    kendo.culture("zh-CN");
		    	// 开始时间
			g.node.sleepStartTime.kendoDateTimePicker({
				animation : false,
				format : "yyyy-MM-dd HH:mm:ss",
				value : dateUtility.dateFormat(new Date(), "yyyy-MM-dd hh:mm:ss")
			});
			// 结束时间
			g.node.sleepEndTime.kendoDateTimePicker({
				animation : false,
				format : "yyyy-MM-dd HH:mm:ss",
				value : dateUtility.dateFormat(new Date(), "yyyy-MM-dd hh:mm:ss")
			});   
		 },
		//查询
	    query : function() {  
		    g.node.hasQuery.val("1");
		    if (process.validate()) {
				var startTime = g.node.sleepStartTime.val();
				var endTime = g.node.sleepEndTime.val();
				var vendorCode = g.node.sleepCode.val();
				var where = vendorCode + "_" + startTime + "_" + endTime;

				g.node.sleepGrid.data("kendoGrid").dataSource.filter({
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
		       	var startTime = g.node.sleepStartTime.val();
				var endTime = g.node.sleepEndTime.val();
				var vendorCode = g.node.sleepCode.val();
				var where = vendorCode + "_" + startTime + "_" + endTime;

				var url = "http://120.24.52.131:8080/GDCP-QT/terminalSleepServlet?export=true&where='" + where
						+ "'";
				g.node.sleepExport.attr('href', url);
		   } else {
				return false;
			}
		},
		//清空Dialog数据
		reload : function(){
		    
		    g.node.sleepStartTime.val('');
			g.node.sleepEndTime.val('');
			g.node.sleepCode.val('');
			g.node.hasQuery.val('');
			g.node.validator.hideMessages();
		    var dataSource = new kendo.data.DataSource({
                  data: [
                      {}
                     ]
             });
			var grid = g.node.sleepGrid.data("kendoGrid");
			grid.setDataSource(dataSource);
		},
		 sleepGridData : function(){
		   g.node.sleepGrid.kendoGrid({
				dataSource : {
					type : "odata",
					transport : {
						read : "http://120.24.52.131:8080/GDCP-QT/terminalSleepServlet"
					},
					schema : {
						model : {
							fields : {
								vendorCode : {
									type : "string"
								},
								RTDataType : {
									type : "number"
								},
								obdTime : {
									type : "string"
								},
								recvTime : {
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
				height : 500,
				columns : [ {
					field : "vendorCode",
					title : "车机ID",
					width : 180
				}, {
					field : "RTDataType",
					title : "RT数据类型",
					width : 140
				}, {
					field : "recvTime",
					title : "接收时间",
					width : 180
				}, {
					field : "obdTime",
					title : "OBD时间",
					width : 180
				} ],
				dataBinding : function(e) { 
				}
			});
		 }
	};
	event = {
        listener: function(){ 
		    g.node.sleepQuery.on("click",process.query);
			g.node.sleepExport.on("click", process.aexport); 
		}
    }; 
   module.exports = { 
        bindGridData : function(){
		    process.sleepGridData();
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