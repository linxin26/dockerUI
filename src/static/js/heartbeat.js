define(function(require ,exports ,module){
    var $ = require('jqueryMin');
	require('kendoWeb');
	var dateUtility = require('../js/DateUtility');
	var g ={ }, helper, process, event;


   g.node = {	  
		heartbeatStartTime : $("#txt_heartbeat_startTime"),
		heartbeatEndTime : $("#txt_heartbeat_endTime"),
		heartbeatGrid : $("#heartbeat_grid"),
		heartbeatExport : $("#a_heartbeat_Export"),
		heartbeatCode : $("#txt_heartbeat_Code"),
		heartbeatQuery : $("#btn_heartbeat_Query"),
		validator : $("#heartbeatForm").kendoValidator().data("kendoValidator"),
		hasQuery : $("#txt_heartbeat_query")
   };
	 process = {
   
         init: function(){
		     event.listener();
		 },
		 initDate: function(){
		  
		   //中文化
		    kendo.culture("zh-CN");
		    	// 开始时间
			g.node.heartbeatStartTime.kendoDateTimePicker({
				animation : false,
				format : "yyyy-MM-dd HH:mm:ss",
				value : dateUtility.dateFormat(new Date(), "yyyy-MM-dd hh:mm:ss")
			});
			// 结束时间
			g.node.heartbeatEndTime.kendoDateTimePicker({
				animation : false,
				format : "yyyy-MM-dd HH:mm:ss",
				value : dateUtility.dateFormat(new Date(), "yyyy-MM-dd hh:mm:ss")
			});   
		 },
		//查询
	    query : function() {  
		    g.node.hasQuery.val("1");
		    if (process.validate()) {
				var startTime = g.node.heartbeatStartTime.val();
				var endTime = g.node.heartbeatEndTime.val();
				var vendorCode = g.node.heartbeatCode.val();
				var where = vendorCode + "_" + startTime + "_" + endTime;

				g.node.heartbeatGrid.data("kendoGrid").dataSource.filter({
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
		       	var startTime = g.node.heartbeatStartTime.val();
				var endTime = g.node.heartbeatEndTime.val();
				var vendorCode = g.node.heartbeatCode.val();
				var where = vendorCode + "_" + startTime + "_" + endTime;

				var url = "http://120.24.52.131:8080/GDCP-QT/heartbeatServlet?export=true&where='" + where
						+ "'";
				g.node.heartbeatExport.attr('href', url);
		   } else {
				return false;
			}
		},
		//清空Dialog数据
		reload : function(){
		    
		    g.node.heartbeatStartTime.val('');
			g.node.heartbeatEndTime.val('');
			g.node.heartbeatCode.val('');
			g.node.hasQuery.val('');
			g.node.validator.hideMessages();
		    var dataSource = new kendo.data.DataSource({
                  data: [
                      {}
                     ]
             });
			var grid = g.node.heartbeatGrid.data("kendoGrid");
			grid.setDataSource(dataSource);
		},
		 heartbeatGridData : function(){
		g.node.heartbeatGrid.kendoGrid({
				dataSource : {
					type : "odata",
					transport : {
						read : "http://120.24.52.131:8080/GDCP-QT/heartbeatServlet"
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
		     g.node.heartbeatQuery.on("click",process.query);
			g.node.heartbeatExport.on("click", process.aexport);
		}
    }; 
   //导出对外接口
   module.exports = { 
        bindGridData : function(){
		    process.heartbeatGridData();
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