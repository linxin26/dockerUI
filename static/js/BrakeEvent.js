define(function(require ,exports ,module){
    var $ = require('jqueryMin');
	require('kendoWeb');
	var dateUtility = require('../js/DateUtility');
	var g ={ }, helper, process, event;


   g.node = {	  
		brakeStartTime : $("#txt_brake_startTime"),
		brakeEndTime : $("#txt_brake_endTime"),
		brakeGrid : $("#brake_grid"),
		brakeExport : $("#a_brake_Export"),
		brakeCode : $("#txt_brake_Code"),
		brakeQuery : $("#btn_brake_Query"),
		validator : $("#brakeForm").kendoValidator().data("kendoValidator"),
		hasQuery : $("#txt_brake_query")
   };
	 process = {
   
         init: function(){
		     event.listener();
		 },
		 initDate: function(){
		  
		   //中文化
		    kendo.culture("zh-CN");
		    	// 开始时间
			g.node.brakeStartTime.kendoDateTimePicker({
				animation : false,
				format : "yyyy-MM-dd HH:mm:ss",
				value : dateUtility.dateFormat(new Date(), "yyyy-MM-dd hh:mm:ss")
			});
			// 结束时间
			g.node.brakeEndTime.kendoDateTimePicker({
				animation : false,
				format : "yyyy-MM-dd HH:mm:ss",
				value : dateUtility.dateFormat(new Date(), "yyyy-MM-dd hh:mm:ss")
			});   
		 },
		//查询
	    query : function() {  
		    g.node.hasQuery.val("1");
		    if (process.validate()) {
				var startTime = g.node.brakeStartTime.val();
				var endTime = g.node.brakeEndTime.val();
				var vendorCode = g.node.brakeCode.val();
				var where = vendorCode + "_" + startTime + "_" + endTime;

				g.node.brakeGrid.data("kendoGrid").dataSource.filter({
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
		       	var startTime = g.node.brakeStartTime.val();
				var endTime = g.node.brakeEndTime.val();
				var vendorCode = g.node.brakeCode.val();
				var where = vendorCode + "_" + startTime + "_" + endTime;

				var url = "http://120.24.52.131:8080/GDCP-QT/brakeEventServlet?export=true&where='" + where
						+ "'";
				g.node.brakeExport.attr('href', url);
		   } else {
				return false;
			}
		},
		//清空Dialog数据
		reload : function(){
		    
		    g.node.brakeStartTime.val('');
			g.node.brakeEndTime.val('');
			g.node.brakeCode.val('');
			g.node.hasQuery.val('');
			g.node.validator.hideMessages();
		    var dataSource = new kendo.data.DataSource({
                  data: [
                      {}
                     ]
             });
			var grid = g.node.brakeGrid.data("kendoGrid");
			grid.setDataSource(dataSource);
		},
		  brakeGridData : function(){
		     g.node.brakeGrid.kendoGrid({
				dataSource : {
					type : "odata",
					transport : {
						read : "http://120.24.52.131:8080/GDCP-QT/brakeEventServlet"
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
									type : "number"
								},
								distance : {
									type : "number"
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
					title : "刹车开始时间",
					width : 180
				}, {
					field : "endTime",
					title : "刹车结束时间",
					width : 180
				}, {
					field : "duration",
					title : "时长",
					width : 180
				}, {
					field : "distance",
					title : "距离",
					width : 180
				} ],
				dataBinding : function(e) { 
				}
			}); 
		 }
	};
	event = {
        listener: function(){ 
		    g.node.brakeQuery.on("click",process.query);
			g.node.brakeExport.on("click", process.aexport);
		}
    }; 
		//导出对外接口
   module.exports = { 
        bindGridData : function(){
		    process.brakeGridData();
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