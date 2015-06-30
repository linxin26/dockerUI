define(function(require ,exports ,module){
    var $ = require('jqueryMin');
	require('kendoWeb');
	var dateUtility = require('../js/DateUtility');
	var g ={ }, helper, process, event;


   g.node = {	 
        behaviorWindow : $("#behavior_window"),
		behaviorDialog : $("#behavior_dialog"),
		behaviorStartTime : $("#txt_behavior_startTime"),
		behaviorEndTime : $("#txt_behavior_endTime"),
		behaviorGrid : $("#behavior_grid"),
		behaviorCode : $("#txt_behavior_Code"),
		behaviorExport : $("#a_behavior_Export"),
		behaviorQuery : $("#btn_behavior_Query"),
		validator : $("#behaviorForm").kendoValidator().data("kendoValidator"),
		hasQuery : $("#txt_behavior_query")
   };
	 process = {
   
         init: function(){
		     event.listener();
		 },
		 initDate: function(){
		  
		   //中文化
		    kendo.culture("zh-CN");
		    	// 开始时间
			g.node.behaviorStartTime.kendoDateTimePicker({
				animation : false,
				format : "yyyy-MM-dd HH:mm:ss",
				value : dateUtility.dateFormat(new Date(), "yyyy-MM-dd hh:mm:ss")
			});
			// 结束时间
			g.node.behaviorEndTime.kendoDateTimePicker({
				animation : false,
				format : "yyyy-MM-dd HH:mm:ss",
				value : dateUtility.dateFormat(new Date(), "yyyy-MM-dd hh:mm:ss")
			});   
		 },
		//查询
	    query : function() {  
		    g.node.hasQuery.val("1");
		    if (process.validate()) {
				var startTime = g.node.behaviorStartTime.val();
				var endTime = g.node.behaviorEndTime.val();
				var vendorCode = g.node.behaviorCode.val();
				var where = vendorCode + "_" + startTime + "_" + endTime;

				g.node.behaviorGrid.data("kendoGrid").dataSource.filter({
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
		       	var startTime = g.node.behaviorStartTime.val();
				var endTime = g.node.behaviorEndTime.val();
				var vendorCode = g.node.behaviorCode.val();
				var where = vendorCode + "_" + startTime + "_" + endTime;

				var url = "http://120.24.52.131:8080/GDCP-QT/behaviorDataServlet?export=true&where='" + where
						+ "'";
				g.node.behaviorExport.attr('href', url);
		   } else {
				return false;
			}
		},
		//清空Dialog数据
		reload : function(){
		    
		    g.node.behaviorStartTime.val('');
			g.node.behaviorEndTime.val('');
			g.node.behaviorCode.val('');
			g.node.hasQuery.val('');
			g.node.validator.hideMessages();
		    var dataSource = new kendo.data.DataSource({
                  data: [
                      {}
                     ]
             });
			var grid = g.node.behaviorGrid.data("kendoGrid");
			grid.setDataSource(dataSource);
		},
		  behaviorGridData : function(){
        	g.node.behaviorGrid.kendoGrid({
				dataSource : {
					type : "odata",
					transport : {
						read : "http://120.24.52.131:8080/GDCP-QT/behaviorDataServlet"
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
								powerOnTime : {
									type : "string"
								},
								powerOffTime : {
									type : "string"
								},
								tripDistance : {
									type : "number"
								},
								tripAverageSpeed : {
									type : "number"
								},
								tripFuelConsum : {
									type : "number"
								},
								tripAverageFuel : {
									type : "number"
								},
								tripAccTimes : {
									type : "number"
								},
								tripDccTimes : {
									type : "number"
								},
								tripSharpTimes : {
									type : "number"
								},
								tripTotalAccTimes : {
									type : "number"
								},
								tripTotalDccTimes : {
									type : "number"
								},
								tripTotalSharpTimes : {
									type : "number"
								},
								tripDriveTime : {
									type : "number"
								},
								tripMark : {
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
					field : "powerOnTime",
					title : "ACC ON时间",
					width : 180
				}, {
					field : "powerOffTime",
					title : "ACC OFF时间",
					width : 180
				}, {
					field : "tripDistance",
					title : "驾驶循环总里程",
					filterable : false,
					width : 180
				}, {
					field : "tripAverageSpeed",
					title : "驾驶循环平均车速",
					width : 180
				}, {
					field : "tripFuelConsum",
					title : "驾驶行程总耗油量",
					width : 180
				}, {
					field : "tripAverageFuel",
					title : "驾驶行程平均油耗",
					width : 180
				}, {
					field : "tripAccTimes",
					title : "驾驶循环急加速次数",
					width : 180
				}, {
					field : "tripDccTimes",
					title : "驾驶循环急减速次数",
					width : 180
				}, {
					field : "tripSharpTimes",
					title : "驾驶循环急转弯次数",
					width : 180
				}, {
					field : "tripTotalAccTimes",
					title : "急加速总次数",
					width : 180
				}, {
					field : "tripTotalDccTimes",
					title : "急减速总次数",
					width : 180
				}, {
					field : "tripTotalSharpTimes",
					title : "急转弯总次数",
					width : 180
				}, {
					field : "tripDriveTime",
					title : "驾驶时长",
					width : 180
				}, {
					field : "tripMark",
					title : "驾驶循环标签",
					width : 180
				} ],
				dataBinding : function(e) { 
				}
			}); 
		 }
	};
	event = {
        listener: function(){ 
		    g.node.behaviorQuery.on("click",process.query);
			g.node.behaviorExport.on("click", process.aexport);
		}
    }; 
	//导出对外接口
   module.exports = { 
        bindGridData : function(){
		    process.behaviorGridData();
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