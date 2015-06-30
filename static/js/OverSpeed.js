define(function(require ,exports ,module){
    var $ = require('jqueryMin');
	require('kendoWeb');
	var dateUtility = require('../js/DateUtility');
	var g ={ }, helper, process, event;


   g.node = {	  
		overSpeedStartTime : $("#txt_overSpeed_startTime"),
		overSpeedEndTime : $("#txt_overSpeed_endTime"),
		overSpeedGrid : $("#overSpeed_grid"),
		overspeedExport : $("#a_overSpeed_Export"),
		overSpeedCode : $("#txt_overSpeed_Code"),
		overSpeedQuery : $("#btn_overSpeed_Query"),
		validator : $("#overSpeedForm").kendoValidator().data("kendoValidator"),
		hasQuery : $("#txt_overSpeed_query")
   };
	 process = {
   
         init: function(){
		     event.listener();
		 },
		 initDate: function(){
		  
		   //中文化
		    kendo.culture("zh-CN");
		    	// 开始时间
			g.node.overSpeedStartTime.kendoDateTimePicker({
				animation : false,
				format : "yyyy-MM-dd HH:mm:ss",
				value : dateUtility.dateFormat(new Date(), "yyyy-MM-dd hh:mm:ss")
			});
			// 结束时间
			g.node.overSpeedEndTime.kendoDateTimePicker({
				animation : false,
				format : "yyyy-MM-dd HH:mm:ss",
				value : dateUtility.dateFormat(new Date(), "yyyy-MM-dd hh:mm:ss")
			});   
		 },
		//查询
	    query : function() {  
		    g.node.hasQuery.val("1");
		    if (process.validate()) {
				var startTime = g.node.overSpeedStartTime.val();
				var endTime = g.node.overSpeedEndTime.val();
				var vendorCode = g.node.overSpeedCode.val();
				var where = vendorCode + "_" + startTime + "_" + endTime;

				g.node.overSpeedGrid.data("kendoGrid").dataSource.filter({
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
		       	var startTime = g.node.overSpeedStartTime.val();
				var endTime = g.node.overSpeedEndTime.val();
				var vendorCode = g.node.overSpeedCode.val();
				var where = vendorCode + "_" + startTime + "_" + endTime;

				var url = "http://120.24.52.131:8080/GDCP-QT/overSpeedServlet?export=true&where='" + where
						+ "'";
				g.node.overspeedExport.attr('href', url);
		   } else {
				return false;
			}
		},
		//清空Dialog数据
		reload : function(){
		    
		    g.node.overSpeedStartTime.val('');
			g.node.overSpeedEndTime.val('');
			g.node.overSpeedCode.val('');
			g.node.hasQuery.val('');
			g.node.validator.hideMessages();
		    var dataSource = new kendo.data.DataSource({
                  data: [
                      {}
                     ]
             });
			var grid = g.node.overSpeedGrid.data("kendoGrid");
			grid.setDataSource(dataSource);
		},
		 overSpeedGridData : function(){
		   g.node.overSpeedGrid.kendoGrid({
				dataSource : {
					type : "odata",
					transport : {
						read : "http://120.24.52.131:8080/GDCP-QT/overSpeedServlet"
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
								startTime : {
									type : "string"
								},
								endTime : {
									type : "string"
								},
								duration : {
									type : "string"
								},
								meter : {
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
					field : "startTime",
					title : "开始时间",
					width : 180
				}, {
					field : "endTime",
					title : "结束时间",
					width : 160
				}, {
					field : "duration",
					title : "时长",
					width : 100
				}, {
					field : "meter",
					title : "距离",
					width : 100
				} ],
				dataBinding : function(e) { 
				}
			});
		 }
	};
	event = {
        listener: function(){ 
		    g.node.overSpeedQuery.on("click",process.query);
			g.node.overspeedExport.on("click", process.aexport);
		}
    }; 
   module.exports = { 
        bindGridData : function(){
		    process.overSpeedGridData();
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