define(function(require ,exports ,module){
    var $ = require('jqueryMin');
	require('kendoWeb');
	var dateUtility = require('../js/DateUtility');
	var g ={ }, helper, process, event;


   g.node = {	  
		idlingStartTime : $("#txt_idling_startTime"),
		idlingEndTime : $("#txt_idling_endTime"),
		idlingGrid : $("#idling_grid"),
		idlingExport : $("#a_idling_Export"),
		idlingCode : $("#txt_idling_Code"),
		idlingQuery : $("#btn_idling_Query"),
		validator : $("#idlingForm").kendoValidator().data("kendoValidator"),
		hasQuery : $("#txt_idling_query")
   };
	 process = {
   
         init: function(){
		     event.listener();
		 },
		 initDate: function(){
		  
		   //中文化
		    kendo.culture("zh-CN");
		    	// 开始时间
			g.node.idlingStartTime.kendoDateTimePicker({
				animation : false,
				format : "yyyy-MM-dd HH:mm:ss",
				value : dateUtility.dateFormat(new Date(), "yyyy-MM-dd hh:mm:ss")
			});
			// 结束时间
			g.node.idlingEndTime.kendoDateTimePicker({
				animation : false,
				format : "yyyy-MM-dd HH:mm:ss",
				value : dateUtility.dateFormat(new Date(), "yyyy-MM-dd hh:mm:ss")
			});   
		 },
		//查询
	    query : function() {  
		    g.node.hasQuery.val("1");
		    if (process.validate()) {
				var startTime = g.node.idlingStartTime.val();
				var endTime = g.node.idlingEndTime.val();
				var vendorCode = g.node.idlingCode.val();
				var where = vendorCode + "_" + startTime + "_" + endTime;

				g.node.idlingGrid.data("kendoGrid").dataSource.filter({
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
		       	var startTime = g.node.idlingStartTime.val();
				var endTime = g.node.idlingEndTime.val();
				var vendorCode = g.node.idlingCode.val();
				var where = vendorCode + "_" + startTime + "_" + endTime;

				var url = "http://120.24.52.131:8080/GDCP-QT/idlingEventServlet?export=true&where='" + where
						+ "'";
				g.node.idlingExport.attr('href', url);
		   } else {
				return false;
			}
		},
		//清空Dialog数据
		reload : function(){
		    
		    g.node.idlingStartTime.val('');
			g.node.idlingEndTime.val('');
			g.node.idlingCode.val('');
			g.node.hasQuery.val('');
			g.node.validator.hideMessages();
		    var dataSource = new kendo.data.DataSource({
                  data: [
                      {}
                     ]
             });
			var grid = g.node.idlingGrid.data("kendoGrid");
			grid.setDataSource(dataSource);
		},
		 idlingGridData : function(){
		   g.node.idlingGrid.kendoGrid({
				dataSource : {
					type : "odata",
					transport : {
						read : "http://120.24.52.131:8080/GDCP-QT/idlingEventServlet"
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
								totalDuration : {
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
					field : "totalDuration",
					title : "总怠速时长",
					width : 100
				} ],
				dataBinding : function(e) { 
				}
			});
		 }
	};
	event = {
        listener: function(){ 
		      g.node.idlingQuery.on("click",process.query);
			g.node.idlingExport.on("click", process.aexport);
		}
    }; 
   //导出对外接口
   module.exports = { 
        bindGridData : function(){
		    process.idlingGridData();
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