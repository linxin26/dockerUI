define(function(require ,exports ,module){
    var $ = require('jqueryMin');
	require('kendoWeb');
	var dateUtility = require('../js/DateUtility');
	var g ={ }, helper, process, event;


   g.node = {	  
		securityStartTime : $("#txt_security_startTime"),
		securityEndTime : $("#txt_security_endTime"),
		securityGrid : $("#security_grid"),
		securityExport : $("#a_security_Export"),
		securityCode : $("#txt_security_Code"),
		securityQuery : $("#btn_security_Query"),
		validator : $("#securityForm").kendoValidator().data("kendoValidator"),
		hasQuery : $("#txt_security_query")
   };
	 process = {
   
         init: function(){
		     event.listener();
		 },
		 initDate: function(){
		  
		   //中文化
		    kendo.culture("zh-CN");
		    	// 开始时间
			g.node.securityStartTime.kendoDateTimePicker({
				animation : false,
				format : "yyyy-MM-dd HH:mm:ss",
				value : dateUtility.dateFormat(new Date(), "yyyy-MM-dd hh:mm:ss")
			});
			// 结束时间
			g.node.securityEndTime.kendoDateTimePicker({
				animation : false,
				format : "yyyy-MM-dd HH:mm:ss",
				value : dateUtility.dateFormat(new Date(), "yyyy-MM-dd hh:mm:ss")
			});   
		 },
		//查询
	    query : function() {  
		    g.node.hasQuery.val("1");
		    if (process.validate()) {
				var startTime = g.node.securityStartTime.val();
				var endTime = g.node.securityEndTime.val();
				var vendorCode = g.node.securityCode.val();
				var where = vendorCode + "_" + startTime + "_" + endTime;

				g.node.securityGrid.data("kendoGrid").dataSource.filter({
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
		       	var startTime = g.node.securityStartTime.val();
				var endTime = g.node.securityEndTime.val();
				var vendorCode = g.node.securityCode.val();
				var where = vendorCode + "_" + startTime + "_" + endTime;

				var url = "http://120.24.52.131:8080/GDCP-QT/carSecurityDataServlet?export=true&where='" + where
						+ "'";
				g.node.securityExport.attr('href', url);
		   } else {
				return false;
			}
		},
		//清空Dialog数据
		reload : function(){
		    
		    g.node.securityStartTime.val('');
			g.node.securityEndTime.val('');
			g.node.securityCode.val('');
			g.node.hasQuery.val('');
			g.node.validator.hideMessages();
		    var dataSource = new kendo.data.DataSource({
                  data: [
                      {}
                     ]
             });
			var grid = g.node.securityGrid.data("kendoGrid");
			grid.setDataSource(dataSource);
		},
		 securityGridData : function(){
	        g.node.securityGrid.kendoGrid({
				dataSource : {
					type : "odata",
					transport : {
						read : "http://120.24.52.131:8080/GDCP-QT/carSecurityDataServlet"
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
								accStatus : {
									type : "string"
								},
								airCondition : {
									type : "string"
								},
								autoLight : {
									type : "string"
								},
								backFogLight : {
									type : "string"
								},
								devVersion : {
									type : "string"
								},
								dippedHeadLight : {
									type : "string"
								},
								footBrake : {
									type : "string"
								},
								frontFogLight : {
									type : "string"
								},
								fuelAlarm : {
									type : "string"
								},
								gear : {
									type : "string"
								},
								guardStatus : {
									type : "string"
								},
								handBrake : {
									type : "string"
								},
								hazardLight : {
									type : "string"
								},
								highHeadLight : {
									type : "string"
								},
								hood : {
									type : "string"
								},
								leftBackDoor : {
									type : "string"
								},
								leftBackLock : {
									type : "string"
								},
								leftBackWindow : {
									type : "string"
								},
								leftForntLock : {
									type : "string"
								},
								leftFrontDoor : {
									type : "string"
								},
								leftFrontWindow : {
									type : "string"
								},
								leftTurnSignal : {
									type : "string"
								},
								mainSaftyBelt : {
									type : "string"
								},
								mirrorStatus : {
									type : "string"
								},
								oilAlarm : {
									type : "string"
								},
								reversingLight : {
									type : "string"
								},
								rightBackDoor : {
									type : "string"
								},
								rightBackLock : {
									type : "string"
								},
								rightBackWindow : {
									type : "string"
								},
								rightForntDoor : {
									type : "string"
								},
								rightForntLock : {
									type : "string"
								},
								rightFrontWindow : {
									type : "string"
								},
								rightTurnSignal : {
									type : "string"
								},
								roofLight : {
									type : "string"
								},
								trunk : {
									type : "string"
								},
								viceSaftyBelt : {
									type : "string"
								},
								widthLight : {
									type : "string"
								},
								winWiper : {
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
					field : "accelerator",
					title : "油门状态",
					width : 180
				}, {
					field : "accStatus",
					title : "ACC状态",
					width : 180
				}, {
					field : "airCondition",
					title : "空调状态",
					width : 180
				}, {
					field : "autoLight",
					title : "AUTO灯",
					width : 180
				}, {
					field : "backFogLight",
					title : "后雾灯",
					width : 180
				}, {
					field : "devVersion",
					title : "设备版本",
					width : 180
				}, {
					field : "dippedHeadLight",
					title : "近光灯状态",
					width : 180
				}, {
					field : "footBrake",
					title : "脚刹状态",
					width : 180
				}, {
					field : "frontFogLight",
					title : "前雾灯",
					width : 180
				}, {
					field : "fuelAlarm",
					title : "示燃油报警",
					width : 180
				}, {
					field : "gear",
					title : "档位",
					width : 180
				}, {
					field : "guardStatus",
					title : "设防撤防状态",
					width : 180
				}, {
					field : "handBrake",
					title : "手刹状态",
					width : 180
				}, {
					field : "hazardLight",
					title : "危险灯",
					width : 180
				}, {
					field : "highHeadLight",
					title : "远光灯状态",
					width : 180
				}, {
					field : "hood",
					title : "发动机盖",
					width : 180
				}, {
					field : "leftBackDoor",
					title : "左后门状态",
					width : 180
				}, {
					field : "leftBackLock",
					title : "左后门锁状态",
					width : 180
				}, {
					field : "leftBackWindow",
					title : "左后窗状态",
					width : 180
				}, {
					field : "leftForntLock",
					title : "左前前门锁状态",
					width : 180
				}, {
					field : "leftFrontDoor",
					title : "左前门状态",
					width : 180
				}, {
					field : "leftFrontWindow",
					title : "左前窗状态",
					width : 180
				}, {
					field : "leftTurnSignal",
					title : "左转向灯",
					width : 180
				}, {
					field : "mainSaftyBelt",
					title : "主安全带",
					width : 180
				}, {
					field : "mirrorStatus",
					title : "后视镜状态",
					width : 180
				}, {
					field : "oilAlarm",
					title : "机油报警",
					width : 180
				}, {
					field : "reversingLight",
					title : "倒车灯",
					width : 180
				}, {
					field : "rightBackDoor",
					title : "右后门状态",
					width : 180
				}, {
					field : "rightBackLock",
					title : "右后门锁状态",
					width : 180
				}, {
					field : "rightBackWindow",
					title : "右后窗状态",
					width : 180
				}, {
					field : "rightForntDoor",
					title : "右前门状态",
					width : 180
				}, {
					field : "rightForntLock",
					title : "右前门锁状态",
					width : 180
				}, {
					field : "rightFrontWindow",
					title : "右前窗状态",
					width : 180
				}, {
					field : "rightTurnSignal",
					title : "右转向灯",
					width : 180
				}, {
					field : "roofLight",
					title : "天窗",
					width : 180
				}, {
					field : "trunk",
					title : "后备箱",
					width : 180
				}, {
					field : "viceSaftyBelt",
					title : "副安全带",
					width : 180
				}, {
					field : "widthLight",
					title : "示宽灯",
					width : 180
				}, {
					field : "winWiper",
					title : "雨刷",
					width : 180
				} ],
				dataBinding : function(e) {
			 
				}
			});
		 }
	};
	event = {
        listener: function(){ 
		    g.node.securityQuery.on("click",process.query);
			g.node.securityExport.on("click", process.aexport);
		}
    }; 
   //导出对外接口
   module.exports = { 
        bindGridData : function(){
		    process.securityGridData();
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