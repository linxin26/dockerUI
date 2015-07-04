define(function(require ,exports ,module){
    var $ = require('jqueryMin');
	require('kendoWeb');
	var dateUtility = require('../js/DateUtility');
	var g ={ }, helper, process, event;


   g.node = {	  
		simInfoStartTime : $("#txt_simInfo_startTime"),
		simInfoEndTime : $("#txt_simInfo_endTime"),
		simInfoGrid : $("#simInfo_grid"),
		simInfoExport : $("#a_simInfo_Export"),
		simInfoCode : $("#txt_simInfo_Code"),
		simInfoQuery : $("#btn_simInfo_Query"),
		validator : $("#simInfoForm").kendoValidator().data("kendoValidator"),
		hasQuery : $("#txt_simInfo_query")
   };
	 process = {
   
         init: function(){
		     event.listener();
		 },
		 initDate: function(){
		  
		   //中文化
		    kendo.culture("zh-CN");
		    	// 开始时间
			g.node.simInfoStartTime.kendoDateTimePicker({
				animation : false,
				format : "yyyy-MM-dd HH:mm:ss",
				value : dateUtility.dateFormat(new Date(), "yyyy-MM-dd hh:mm:ss")
			});
			// 结束时间
			g.node.simInfoEndTime.kendoDateTimePicker({
				animation : false,
				format : "yyyy-MM-dd HH:mm:ss",
				value : dateUtility.dateFormat(new Date(), "yyyy-MM-dd hh:mm:ss")
			});   
		 },
		//查询
	    query : function() {  
		    g.node.hasQuery.val("1");
		    if (process.validate()) {
				var startTime = g.node.simInfoStartTime.val();
				var endTime = g.node.simInfoEndTime.val();
				var vendorCode = g.node.simInfoCode.val();
				var where = vendorCode + "_" + startTime + "_" + endTime;

				g.node.simInfoGrid.data("kendoGrid").dataSource.filter({
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
		       	var startTime = g.node.simInfoStartTime.val();
				var endTime = g.node.simInfoEndTime.val();
				var vendorCode = g.node.simInfoCode.val();
				var where = vendorCode + "_" + startTime + "_" + endTime;

				var url = "http://120.24.52.131:8080/GDCP-QT/simInfoServlet?export=true&where='" + where
						+ "'";
				g.node.simInfoExport.attr('href', url);
		   } else {
				return false;
			}
		},
		//清空Dialog数据
		reload : function(){
		    
		    g.node.simInfoStartTime.val('');
			g.node.simInfoEndTime.val('');
			g.node.simInfoCode.val('');
			g.node.hasQuery.val('');
			g.node.validator.hideMessages();
		    var dataSource = new kendo.data.DataSource({
                  data: [
                      {}
                     ]
             });
			var grid = g.node.simInfoGrid.data("kendoGrid");
			grid.setDataSource(dataSource);
		},
		 simInfoGridData : function(){
		    g.node.simInfoGrid.kendoGrid({
				dataSource : {
					type : "odata",
					transport : {
						read : "http://120.24.52.131:8080/GDCP-QT/simInfoServlet"
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
								CCID : {
									type : "string"
								},
								IMSI : {
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
					field : "CCID",
					title : "CCID",
					width : 180
				}, {
					field : "IMSI",
					title : "IMSI",
					width : 180
				} ],
				dataBinding : function(e) { 
				}
			});
		 }
	};
	event = {
        listener: function(){ 
		    g.node.simInfoQuery.on("click",process.query);
			g.node.simInfoExport.on("click", process.aexport);
		}
    }; 
   //导出对外接口
   module.exports = { 
        bindGridData : function(){
		    process.simInfoGridData();
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