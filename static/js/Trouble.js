define(function(require ,exports ,module){
    var $ = require('jqueryMin');
	require('kendoWeb');
	var dateUtility = require('../js/DateUtility');
	var g ={ }, helper, process, event;


   g.node = {	  
		troubleStartTime : $("#txt_trouble_startTime"),
		troubleEndTime : $("#txt_trouble_endTime"),
		troubleGrid : $("#trouble_grid"),
		troubleCode : $("#txt_trouble_Code"),
		troubleExport : $("#a_trouble_Export"),
		troubleQuery : $("#btn_trouble_Query"), 
		validator : $("#troubleForm").kendoValidator().data("kendoValidator"),
		hasQuery : $("#txt_trouble_query")
   };
	 process = {
   
         init: function(){
		     event.listener();
		 },
		 initDate: function(){
		  
		   //中文化
		    kendo.culture("zh-CN");
		    	// 开始时间
			g.node.troubleStartTime.kendoDateTimePicker({
				animation : false,
				format : "yyyy-MM-dd HH:mm:ss",
				value : dateUtility.dateFormat(new Date(), "yyyy-MM-dd hh:mm:ss")
			});
			// 结束时间
			g.node.troubleEndTime.kendoDateTimePicker({
				animation : false,
				format : "yyyy-MM-dd HH:mm:ss",
				value : dateUtility.dateFormat(new Date(), "yyyy-MM-dd hh:mm:ss")
			});   
		 },
		//查询
	    query : function() {  
		    g.node.hasQuery.val("1");
		    if (process.validate()) {
				var startTime = g.node.troubleStartTime.val();
				var endTime = g.node.troubleEndTime.val();
				var vendorCode = g.node.troubleCode.val();
				var where = vendorCode + "_" + startTime + "_" + endTime;

				g.node.troubleGrid.data("kendoGrid").dataSource.filter({
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
		       	var startTime = g.node.troubleStartTime.val();
				var endTime = g.node.troubleEndTime.val();
				var vendorCode = g.node.troubleCode.val();
				var where = vendorCode + "_" + startTime + "_" + endTime;

				var url = "http://120.24.52.131:8080/GDCP-QT/troubleCodeDataServlet?export=true&where='" + where
						+ "'";
				g.node.troubleExport.attr('href', url);
		   } else {
				return false;
			}
		},
		//清空Dialog数据
		reload : function(){
		    
		    g.node.troubleStartTime.val('');
			g.node.troubleEndTime.val('');
			g.node.troubleCode.val('');
			g.node.hasQuery.val('');
			g.node.validator.hideMessages();
		    var dataSource = new kendo.data.DataSource({
                  data: [
                      {}
                     ]
             });
			var grid = g.node.troubleGrid.data("kendoGrid");
			grid.setDataSource(dataSource);
		},
		  troubleGridData : function(){
        	 g.node.troubleGrid.kendoGrid({
				dataSource : {
					type : "odata",
					transport : {
						read : "http://120.24.52.131:8080/GDCP-QT/troubleCodeDataServlet"
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
								allFaultCode : {
									type : "string"
								},
								engineFaultCode : {
									type : "string"
								},
								chassisFaultCode : {
									type : "string"
								},
								networkFaultCode : {
									type : "string"
								},
								carBodyFaultCode : {
									type : "string"
								},
								troubleCodeNum : {
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
					field : "allFaultCode",
					title : "所有类型类型故障码",
					width : 180
				}, {
					field : "engineFaultCode",
					title : "引擎类故障码",
					width : 160
				}, {
					field : "chassisFaultCode",
					title : "底盘类故障码",
					width : 160
				}, {
					field : "networkFaultCode",
					title : "网路类故障码",
					filterable : false,
					width : 160
				}, {
					field : "carBodyFaultCode",
					title : "车身类故障码",
					width : 160
				}, {
					field : "troubleCodeNum",
					title : "故障码个数",
					width : 160
				} ],
				dataBinding : function(e) { 
				}
			});
		 }
	};
	event = {
        listener: function(){ 
		    g.node.troubleQuery.on("click",process.query);
			g.node.troubleExport.on("click", process.aexport);
		}
    }; 
	//导出对外接口
   module.exports = { 
        bindGridData : function(){
		    process.troubleGridData();
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