define(function(require ,exports ,module){
    var $ = require('jqueryMin');
	require('kendoWeb');
	var dateUtility = require('../js/DateUtility');
	var g ={ }, helper, process, event;


   g.node = {	  
		terminalStartTime : $("#txt_terminal_startTime"),
		terminalEndTime : $("#txt_terminal_endTime"),
		terminalGrid : $("#terminal_grid"),
		terminalExport : $("#a_terminal_Export"),
		terminalCode : $("#txt_terminal_Code"),
		terminalQuery : $("#btn_terminal_Query"),
		validator : $("#terminalForm").kendoValidator().data("kendoValidator"),
		hasQuery : $("#txt_terminal_query")
   };
	 process = {
   
         init: function(){
		     event.listener();
		 },
		 initDate: function(){
		  
		   //中文化
		    kendo.culture("zh-CN");
		    	// 开始时间
			g.node.terminalStartTime.kendoDateTimePicker({
				animation : false,
				format : "yyyy-MM-dd HH:mm:ss",
				value : dateUtility.dateFormat(new Date(), "yyyy-MM-dd hh:mm:ss")
			});
			// 结束时间
			g.node.terminalEndTime.kendoDateTimePicker({
				animation : false,
				format : "yyyy-MM-dd HH:mm:ss",
				value : dateUtility.dateFormat(new Date(), "yyyy-MM-dd hh:mm:ss")
			});   
		 },
		//查询
	    query : function() {  
		    g.node.hasQuery.val("1");
		    if (process.validate()) {
				var startTime = g.node.terminalStartTime.val();
				var endTime = g.node.terminalEndTime.val();
				var vendorCode = g.node.terminalCode.val();
				var where = vendorCode + "_" + startTime + "_" + endTime;

				g.node.terminalGrid.data("kendoGrid").dataSource.filter({
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
		       	var startTime = g.node.terminalStartTime.val();
				var endTime = g.node.terminalEndTime.val();
				var vendorCode = g.node.terminalCode.val();
				var where = vendorCode + "_" + startTime + "_" + endTime;

				var url = "http://120.24.52.131:8080/GDCP-QT/terminalVersionServlet?export=true&where='" + where
						+ "'";
				g.node.terminalExport.attr('href', url);
		   } else {
				return false;
			}
		},
		//清空Dialog数据
		reload : function(){
		    
		    g.node.terminalStartTime.val('');
			g.node.terminalEndTime.val('');
			g.node.terminalCode.val('');
			g.node.hasQuery.val('');
			g.node.validator.hideMessages();
		    var dataSource = new kendo.data.DataSource({
                  data: [
                      {}
                     ]
             });
			var grid = g.node.terminalGrid.data("kendoGrid");
			grid.setDataSource(dataSource);
		},
		 terminalGridData : function(){
		     g.node.terminalGrid.kendoGrid({
				dataSource : {
					type : "odata",
					transport : {
						read : "http://120.24.52.131:8080/GDCP-QT/terminalVersionServlet"
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
								},
								softVersion : {
									type : "string"
								},
								hardVersion : {
									type : "string"
								},
								SoftDate : {
									type : "string"
								},
								GSMType : {
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
				}, {
					field : "softVersion",
					title : "软件版本号",
					width : 180
				}, {
					field : "hardVersion",
					title : "硬件版本号",
					width : 180
				}, {
					field : "softDate",
					title : "软件日期",
					width : 180
				}, {
					field : "GSMType",
					title : "GSM类型",
					width : 180
				} ],
				dataBinding : function(e) { 
				}
			});
		 }
	};
	event = {
        listener: function(){ 
		   g.node.terminalQuery.on("click",process.query);
			g.node.terminalExport.on("click", process.aexport);
		}
    }; 
	//导出对外接口
   module.exports = { 
        bindGridData : function(){
		    process.terminalGridData();
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