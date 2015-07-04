define(function(require ,exports ,module){
    var $ = require('jqueryMin');
	require('kendoWeb');
	var dateUtility = require('../js/DateUtility');
	var g ={ }, helper, process, event;


   g.node = {	 
        gpsWindow : $("#gps_window"),
		gpsDialog : $("#gps_dialog"),
		gpsCode : $("#txt_gps_Code"),
		gpsStartTime : $("#txt_gps_startTime"),
		gpsEndTime : $("#txt_gps_endTime"),
		gpsGrid : $("#gps_grid"),
		aGpsExport : $("#a_gps_Export"),
		gpsQuery : $("#btn_gps_query"),
		validator : $("#gpsForm").kendoValidator().data("kendoValidator"),
		hasQuery : $("#txt_gps_query")
   };
	 process = {
   
         init: function(){
		     event.listener();
		 },
		 initDate: function(){
		  
		   //中文化
		    kendo.culture("zh-CN");
		    	// 开始时间
			g.node.gpsStartTime.kendoDateTimePicker({
				animation : false,
				format : "yyyy-MM-dd HH:mm:ss",
				value : dateUtility.dateFormat(new Date(), "yyyy-MM-dd hh:mm:ss")
			});
			// 结束时间
			g.node.gpsEndTime.kendoDateTimePicker({
				animation : false,
				format : "yyyy-MM-dd HH:mm:ss",
				value : dateUtility.dateFormat(new Date(), "yyyy-MM-dd hh:mm:ss")
			});   
		 },
		//查询
	    query : function() {  
		    g.node.hasQuery.val("1");
		    if (process.validate()) {
				var startTime = g.node.gpsStartTime.val();
				var endTime = g.node.gpsEndTime.val();
				var vendorCode = g.node.gpsCode.val();
				var where = vendorCode + "_" + startTime + "_" + endTime;

				g.node.gpsGrid.data("kendoGrid").dataSource.filter({
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
		       	var startTime = g.node.gpsStartTime.val();
				var endTime = g.node.gpsEndTime.val();
				var vendorCode = g.node.gpsCode.val();
				var where = vendorCode + "_" + startTime + "_" + endTime;

				var url = "http://120.24.52.131:8080/GDCP-QT/gpsDataServlet?export=true&where='" + where
						+ "'";
				g.node.aGpsExport.attr('href', url);
		   } else {
				return false;
			}
		},
		//清空Dialog数据
		reload : function(){
		    
		    g.node.gpsStartTime.val('');
			g.node.gpsEndTime.val('');
			g.node.gpsCode.val('');
			g.node.hasQuery.val('');
			g.node.validator.hideMessages();
		    var dataSource = new kendo.data.DataSource({
                  data: [
                      {}
                     ]
             });
			var grid = g.node.gpsGrid.data("kendoGrid");
			grid.setDataSource(dataSource);
		},
		gpsGridData : function(){
		    g.node.gpsGrid.kendoGrid({
				dataSource : {
					type : "odata",
					transport : {
						read : "http://120.24.52.131:8080/GDCP-QT/gpsDataServlet"
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
								accStatus : {
									type : "number"
								},
								obdSpeed : {
									type : "string"
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
					width : 180
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
					width : 180
				}, {
					field : "direction",
					title : "方向",
					width : 180
				}, {
					field : "accStatus",
					title : "ACC状态",
					filterable : false,
					width : 100
				}, {
					field : "obdSpeed",
					title : "obd速度",
					filterable : false,
					width : 100
				}, {
					field : "GPSSpeed",
					title : "GPS速度",
					filterable : false,
					width : 100
				}, {
					field : "longitude",
					title : "经度",
					width : 100
				}, {
					field : "latitude",
					title : "纬度",
					width : 100
				}, {
					field : "satellites",
					title : "卫星数",
					width : 100
				} ],
				dataBinding : function(e) { 
				}
			}); 
		 }
	};
	event = {
        listener: function(){ 
			g.node.gpsQuery.on("click",process.query);
			g.node.aGpsExport.on("click", process.aexport);
		}
    }; 
   //导出对外接口
   module.exports = { 
        bindGridData : function(){
		    process.gpsGridData();
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