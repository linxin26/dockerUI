define(function(require ,exports ,module){
    var $ = require('jqueryMin');
	require('kendoWeb');
	var dateUtility = require('../js/DateUtility');
	var g ={ }, helper, process, event;


   g.node = {	 
		alertGrid : $("#alert_grid"),
		alertDialog : $("#alert_dialog"),
		alertCode : $("#txt_alert_Code"),
		alertWindow : $("#alert_window"),
		alertStartTime :$("#txt_alert_startTime"),
		alertEndTime :$("#txt_alert_endTime"),
		aAlertExport : $("#a_alert_Export"),
		alertQuery : $("#btn_alert_query"),
		validator : $("#alertForm").kendoValidator().data("kendoValidator"),
		hasQuery : $("#txt_alert_query")
   };
	 process = {
   
         init: function(){
		     event.listener();
		 },
		 initDate: function(){
		  
		   //中文化
		    kendo.culture("zh-CN");
		    	// 开始时间
			g.node.alertStartTime.kendoDateTimePicker({
				animation : false,
				format : "yyyy-MM-dd HH:mm:ss",
				value : dateUtility.dateFormat(new Date(), "yyyy-MM-dd hh:mm:ss")
			});
			// 结束时间
			g.node.alertEndTime.kendoDateTimePicker({
				animation : false,
				format : "yyyy-MM-dd HH:mm:ss",
				value : dateUtility.dateFormat(new Date(), "yyyy-MM-dd hh:mm:ss")
			});   
		 },
		//查询
	    query : function() {  
		    g.node.hasQuery.val("1");
		    if (process.validate()) {
				var startTime = g.node.alertStartTime.val();
				var endTime = g.node.alertEndTime.val();
				var vendorCode = g.node.alertCode.val();
				var where = vendorCode + "_" + startTime + "_" + endTime;

				g.node.alertGrid.data("kendoGrid").dataSource.filter({
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
		       	var startTime = g.node.alertStartTime.val();
				var endTime = g.node.alertEndTime.val();
				var vendorCode = g.node.alertCode.val();
				var where = vendorCode + "_" + startTime + "_" + endTime;

				var url = "http://120.24.52.131:8080/GDCP-QT/alarmDataGridServlet?export=true&where='" + where
						+ "'";
				g.node.aAlertExport.attr('href', url);
		   } else {
				return false;
			}
		},
		//清空Dialog数据
		reload : function(){
		    
		    g.node.alertStartTime.val('');
			g.node.alertEndTime.val('');
			g.node.alertCode.val('');
			g.node.hasQuery.val('');
			g.node.validator.hideMessages();
		    var dataSource = new kendo.data.DataSource({
                  data: [
                      {}
                     ]
             });
			var grid = g.node.alertGrid.data("kendoGrid");
			grid.setDataSource(dataSource);
		},
		 //告警数据
		 alertGridData : function(){
		    g.node.alertGrid.kendoGrid({
				dataSource : {
					type : "odata",
					transport : {
						read : "http://120.24.52.131:8080/GDCP-QT/alarmDataGridServlet"
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
								troubleCode : {
									type : "string"
								},
								occurTime : {
									type : "string"
								},
								alarmType : {
									type : "string"
								},
								recvTime : {
									type : "string"
								},
								longitude : {
									type : "string"
								},
								latitude : {
									type : "string"
								},
								satellites : {
									type : "number"
								},
								direction : {
									type : "string"
								},
								GPSSpeed : {
									type : "number"
								},
								batvol : {
									type : "number"
								},
								altitude : {
									type : "number"
								},
								totalAccelerate : {
									type : "number"
								},
								XAccelerate : {
									type : "number"
								},
								YAccelerate : {
									type : "number"
								},
								ZAccelerate : {
									type : "number"
								},
								valid : {
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
					width : 130
				}, {
					field : "RTDataType",
					title : "RT数据类型",
					width : 140
				}, {
					field : "obdTime",
					title : "OBD时间",
					width : 200
				}, {
					field : "troubleCode",
					title : "故障码",
					width : 120
				}, {
					field : "occurTime",
					title : "故障产生时间",
					width : 200
				}, {
					field : "alarmType",
					title : "告警类型",
					filterable : false,
					width : 200
				}, {
					field : "recvTime",
					title : "接收时间",
					width : 200
				}, {
					field : "longitude",
					title : "经度",
					width : 120
				}, {
					field : "latitude",
					title : "纬度",
					width : 120
				}, {
					field : "satellites",
					title : "卫星数",
					width : 90
				}, {
					field : "direction",
					title : "方向",
					filterable : false,
					width : 120
				}, {
					field : "GPSSpeed",
					title : "GPS速度",
					filterable : false,
					width : 130
				}, {
					field : "batvol",
					title : "电瓶电压",
					filterable : false,
					width : 130
				}, {
					field : "altitude",
					title : "海拔高度",
					filterable : false,
					width : 140
				}, {
					field : "totalAccelerate",
					title : "碰撞总加速度值",
					filterable : false,
					width : 180
				}, {
					field : "XAccelerate",
					title : "碰撞X轴加速度值",
					filterable : false,
					width : 180
				}, {
					field : "YAccelerate",
					title : "碰撞Y轴加速度值",
					filterable : false,
					width : 180
				}, {
					field : "ZAccelerate",
					title : "碰撞z轴加速度值",
					filterable : false,
					width : 180
				}, {
					field : "valid",
					title : "是否有效",
					filterable : false,
					width : 140
				} ],
				dataBinding : function(e) { 
				}
			});
		 }
	};
	event = {
        listener: function(){ 
		    g.node.alertQuery.on("click",process.query);
			g.node.aAlertExport.on("click", process.aexport);
		}
    }; 
	//导出对外接口
   module.exports = { 
        bindGridData : function(){
		    process.alertGridData();
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