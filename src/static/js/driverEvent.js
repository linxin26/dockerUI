define(function(require ,exports ,module){
    var $ = require('jqueryMin');
	require('kendoWeb');
	var dateUtility = require('../js/DateUtility');
	var g ={ }, helper, process, event;


   g.node = {	 
		driverEventCode : $("#txt_driverEvent_Code"),
		driverEventStartTime : $("#txt_driverEvent_startTime"),
		driverEventEndTime : $("#txt_driverEvent_endTime"),
		driverEventGrid : $("#driverEvent_grid"),
		driverEventExport : $("#a_driverEvent_Export"),
		driverEventQuery : $("#btn_driverEvent_Query"),
		validator : $("#driverEventForm").kendoValidator().data("kendoValidator"),
		hasQuery : $("#txt_driverEvent_query")
   };
	 process = {
   
         init: function(){
		     event.listener();
		 },
		initDate: function(){
		  
		   //中文化
		    kendo.culture("zh-CN");
		    	// 开始时间
			g.node.driverEventStartTime.kendoDateTimePicker({
				animation : false,
				format : "yyyy-MM-dd HH:mm:ss",
				value : dateUtility.dateFormat(new Date(), "yyyy-MM-dd hh:mm:ss")
			});
			// 结束时间
			g.node.driverEventEndTime.kendoDateTimePicker({
				animation : false,
				format : "yyyy-MM-dd HH:mm:ss",
				value : dateUtility.dateFormat(new Date(), "yyyy-MM-dd hh:mm:ss")
			});   
		 },
		//查询
	    query : function() {  
		    g.node.hasQuery.val("1");
		    if (process.validate()) {
				var startTime = g.node.driverEventStartTime.val();
				var endTime = g.node.driverEventEndTime.val();
				var vendorCode = g.node.driverEventCode.val();
				var where = vendorCode + "_" + startTime + "_" + endTime;

				g.node.driverEventGrid.data("kendoGrid").dataSource.filter({
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
		       	var startTime = g.node.driverEventStartTime.val();
				var endTime = g.node.driverEventEndTime.val();
				var vendorCode = g.node.driverEventCode.val();
				var where = vendorCode + "_" + startTime + "_" + endTime;

				var url = "http://120.24.52.131:8080/GDCP-QT/driveEventServlet?export=true&where='" + where
						+ "'";
				g.node.driverEventExport.attr('href', url);
		   } else {
				return false;
			}
		},
		//清空Dialog数据
		reload : function(){
		    
		    g.node.driverEventStartTime.val('');
			g.node.driverEventEndTime.val('');
			g.node.driverEventCode.val('');
			g.node.hasQuery.val('');
			g.node.validator.hideMessages();
		    var dataSource = new kendo.data.DataSource({
                  data: [
                      {}
                     ]
             });
			var grid = g.node.driverEventGrid.data("kendoGrid");
			grid.setDataSource(dataSource);
		}, 
		driverGridData : function(){
		  g.node.driverEventGrid.kendoGrid({
				dataSource : {
					type : "odata",
					transport : {
						read : "http://120.24.52.131:8080/GDCP-QT/driveEventServlet"
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
								altitude : {
									type : "number"
								},
								direction : {
									type : "number"
								},
								GPSSpeed : {
									type : "number"
								},
								longitude : {
									type : "number"
								},
								latitude : {
									type : "number"
								},
								satellites : {
									type : "number"
								},
								actType : {
									type : "number"
								},
								accTotalTimes : {
									type : "number"
								},
								decTotalTimes : {
									type : "number"
								},
								sharpTotalTimes : {
									type : "number"
								}
							}
						}
					},
					pageSize :20,
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
					width : 120
				}, {
					field : "RTDataType",
					title : "RT数据类型",
					width : 120
				}, {
					field : "recvTime",
					title : "接收时间",
					width : 180
				}, {
					field : "obdTime",
					title : "OBD时间",
					width : 180
				}, {
					field : "altitude",
					title : "海拔高度",
					width : 120
				}, {
					field : "direction",
					title : "方向",
					width : 120
				}, {
					field : "GPSSpeed",
					title : "GPS速度",
					filterable : false,
					width : 120
				}, {
					field : "longitude",
					title : "经度",
					width : 180
				}, {
					field : "latitude",
					title : "纬度",
					width : 180
				}, {
					field : "satellites",
					title : "卫星数",
					width : 180
				}, {
					field : "actType",
					title : "驾驶行为类别",
					width : 180
				}, {
					field : "accTotalTimes",
					title : "急加速总次数",
					width : 180
				}, {
					field : "decTotalTimes",
					title : "急减速总次数",
					width : 180
				}, {
					field : "sharpTotalTimes",
					title : "急转弯总次数",
					width : 180
				} ],
				dataBinding : function(e) { 
				}
			}); 
		 }
	};
	event = {
        listener: function(){ 
		    g.node.driverEventQuery.on("click",process.query);
			g.node.driverEventExport.on("click", process.aexport);
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