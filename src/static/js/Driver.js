define(function(require ,exports ,module){
    var $ = require('jqueryMin');
	require('kendoWeb');
	var dateUtility = require('../js/DateUtility');
	var g ={ }, helper, process, event;


   g.node = {	  
		driverStartTime : $("#txt_driver_startTime"),
		driverEndTime : $("#txt_driver_endTime"),
		driverGrid : $("#driver_grid"),
		driverExport : $("#a_driver_Export"),
		driverCode : $("#txt_driver_Code"),
		driverQuery : $("#btn_driver_Query"),
		validator : $("#driverForm").kendoValidator().data("kendoValidator"),
		hasQuery : $("#txt_driver_query")
   };
	 process = {
   
         init: function(){
		     event.listener();
		 },
		 initDate: function(){
		  
		   //中文化
		    kendo.culture("zh-CN");
		    	// 开始时间
			g.node.driverStartTime.kendoDateTimePicker({
				animation : false,
				format : "yyyy-MM-dd HH:mm:ss",
				value : dateUtility.dateFormat(new Date(), "yyyy-MM-dd hh:mm:ss")
			});
			// 结束时间
			g.node.driverEndTime.kendoDateTimePicker({
				animation : false,
				format : "yyyy-MM-dd HH:mm:ss",
				value : dateUtility.dateFormat(new Date(), "yyyy-MM-dd hh:mm:ss")
			});   
		 },
		//查询
	    query : function() {  
		    g.node.hasQuery.val("1");
		    if (process.validate()) {
				var startTime = g.node.driverStartTime.val();
				var endTime = g.node.driverEndTime.val();
				var vendorCode = g.node.driverCode.val();
				var where = vendorCode + "_" + startTime + "_" + endTime;

				g.node.driverGrid.data("kendoGrid").dataSource.filter({
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
		       	var startTime = g.node.driverStartTime.val();
				var endTime = g.node.driverEndTime.val();
				var vendorCode = g.node.driverCode.val();
				var where = vendorCode + "_" + startTime + "_" + endTime;

				var url = "http://120.24.52.131:8080/GDCP-QT/driverInfoServlet?export=true&where='" + where
						+ "'";
				g.node.driverExport.attr('href', url);
		   } else {
				return false;
			}
		},
		//清空Dialog数据
		reload : function(){
		    
		    g.node.driverStartTime.val('');
			g.node.driverEndTime.val('');
			g.node.driverCode.val('');
			g.node.hasQuery.val('');
			g.node.validator.hideMessages();
		    var dataSource = new kendo.data.DataSource({
                  data: [
                      {}
                     ]
             });
			var grid = g.node.driverGrid.data("kendoGrid");
			grid.setDataSource(dataSource);
		},
		 driverGridData : function(){
		     g.node.driverGrid.kendoGrid({
				dataSource : {
					type : "odata",
					transport : {
						read : "http://120.24.52.131:8080/GDCP-QT/driverInfoServlet"
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
								time : {
									type : "string"
								},
								cardNumber : {
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
					field : "time",
					title : "时间",
					width : 180
				}, {
					field : "cardNumber",
					title : "卡号",
					width : 160
				} ],
				dataBinding : function(e) { 
				}
			});
		 }
	};
	event = {
        listener: function(){ 
		    g.node.driverQuery.on("click",process.query);
			g.node.driverExport.on("click", process.aexport);
		}
    }; 
//导出对外接口
   module.exports = { 
        bindGridData : function(){
		    process.driverGridData();
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