define(function(require ,exports ,module){
    var $ = require('jqueryMin');
	require('kendoWeb');
	require('kendoCulture');
	var dateUtility = require('../js/DateUtility');
	
	var g ={ }, helper, process, event;


   g.node = {	  
		obdStartTime : $("#txt_obd_startTime"),
		obdEndTime : $("#txt_obd_endTime"),
		obdCode : $("#txt_obd_code"),
		btnObdQuery : $("#btn_obd_query"),
		aObdExport : $("#a_obd_Export"),
		validator : $("#obdForm").kendoValidator().data("kendoValidator"),
		obdGrid :$("#grid"),
		hasQuery : $("#txt_obd_query")
   };
	 process = {
   
         init: function(){
		     event.listener();
		 },
		 initDate: function(){
		  
		   //中文化
		    kendo.culture("zh-CN");
		    	// 开始时间
			g.node.obdStartTime.kendoDateTimePicker({
				animation : false,
				format : "yyyy-MM-dd HH:mm:ss",
				value : dateUtility.dateFormat(new Date(), "yyyy-MM-dd hh:mm:ss")
			});
			// 结束时间
			g.node.obdEndTime.kendoDateTimePicker({
				animation : false,
				format : "yyyy-MM-dd HH:mm:ss",
				value : dateUtility.dateFormat(new Date(), "yyyy-MM-dd hh:mm:ss")
			});  
			//g.node.obdStartTime.parent().parent().css("width","185px");
			//g.node.obdEndTime.parent().parent().css("width","185px"); 
		 },
		//查询
	    query : function() {  
		    g.node.hasQuery.val("1");
		    if (process.validate()) {
				var startTime = g.node.obdStartTime.val();
				var endTime = g.node.obdEndTime.val();
				var vendorCode = g.node.obdCode.val();
				var where = vendorCode + "_" + startTime + "_" + endTime;

				g.node.obdGrid.data("kendoGrid").dataSource.filter({
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
		       	var startTime = g.node.obdStartTime.val();
				var endTime = g.node.obdEndTime.val();
				var vendorCode = g.node.obdCode.val();
				var where = vendorCode + "_" + startTime + "_" + endTime;

				var url = "http://120.24.52.131:8080/GDCP-QT/obdDataServlet?export=true&where='" + where
						+ "'";
				g.node.aObdExport.attr('href', url);
		   } else {
				return false;
			}
		},
		//清空Dialog数据
		reload : function(){
		
		    g.node.obdStartTime.val('');
			g.node.obdEndTime.val('');
			g.node.obdCode.val('');
			g.node.hasQuery.val('');
			g.node.validator.hideMessages();
		    var dataSource = new kendo.data.DataSource({
                  data: [
                      {}
                     ]
             });
			var grid = g.node.obdGrid.data("kendoGrid");
			grid.setDataSource(dataSource);
		},
		  /**
		    OBD数据
		 **/
		 obdGridData : function(){  
		    g.node.obdGrid.kendoGrid({
			   dataSource : {
						type : "odata",
						transport : {
							read : "http://120.24.52.131:8080/GDCP-QT/obdDataServlet"
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
									carSpeed : {
										type : "number"
									},
									coolantTemperature : {
										type : "number"
									},
									intakeAirTemperature : {
										type : "number"
									},
									mask : {
										type : "string"
									},
									runTotalTime : {
										type : "number"
									},
									troubleCodeNum : {
										type : "number"
									},
									engineLoad : {
										type : "number"
									},
									manifoldPressure : {
										type : "number"
									},
									totalDistance : {
										type : "number"
									},
									averageFuel : {
										type : "number"
									},
									fuelPressure : {
										type : "number"
									},
									atmosphericPressure : {
										type : "number"
									},
									airFlow : {
										type : "number"
									},
									totalFuel : {
										type : "number"
									},
									pedalPosition : {
										type : "number"
									},
									carEnvirnTemperature : {
										type : "number"
									},
									throttlePosition : {
										type : "number"
									},
									ifcKm : {
										type : "number"
									},
									batVol : {
										type : "number"
									},
									engineSpeed : {
										type : "number"
									},
									TroubleLight : {
										type : "number"
									},
									TroubleDistance : {
										type : "number"
									},
									remainlingFuelPer : {
										type : "number"
									},
									canProtocol : {
										type : "string"
									},
									motormeterDistance : {
										type : "number"
									},
									tripMark : {
										type : "number"
									},
									advanceAngleOfIgnition : {
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
					columns : [{
							field : "vendorCode",
							title : "车机ID",
							width : 130
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
							field : "canProtocol",
							title : "协议类型",
							width : 180
						}, {
							field : "carSpeed",
							title : "车辆速度",
							width : 130
						}, {
							field : "coolantTemperature",
							title : "冷却液温度",
							width : 150
						}, {
							field : "intakeAirTemperature",
							title : "进气口温度",
							filterable : false
						}, {
							field : "mask",
							title : "掩码",
							filterable : false,
							width : 100
						}, {
							field : "runTotalTime",
							title : "运行时间",
							filterable : false,
							width : 130
						}, {
							field : "engineLoad",
							title : "发动机负荷",
							width : 140
						}, {
							field : "manifoldPressure",
							title : "进气歧管压力",
							width : 160
						}, {
							field : "totalDistance",
							title : "总里程",
							width : 150
						}, {
							field : "averageFuel",
							title : "平均油耗",
							width : 140
						}, {
							field : "fuelPressure",
							title : "燃油压力",
							width : 150
						}, {
							field : "atmosphericPressure",
							title : "大气压力",
							width : 135
						}, {
							field : "airFlow",
							title : "空气流量",
							width : 135
						}, {
							field : "troubleCodeNum",
							title : "故障码个数",
							width : 140
						}, {
							field : "totalFuel",
							title : "总耗油",
							width : 120
						}, {
							field : "pedalPosition",
							title : "油门踏板位置",
							width : 130
						}, {
							field : "carEnvirnTemperature",
							title : "车辆环境温度",
							width : 160
						}, {
							field : "throttlePosition",
							title : "节气门位置",
							width : 150
						}, {
							field : "ifcKm",
							title : "百里油耗",
							width : 140
						}, {
							field : "batVol",
							title : "电瓶电压",
							width : 130
						}, {
							field : "engineSpeed",
							title : "发动机转速",
							width : 140
						}, {
							field : "troubleLight",
							title : "故障灯状态",
							width : 140
						}, {
							field : "troubleDistance",
							title : "故障行驶里程",
							width : 160
						}, {
							field : "remainlingFuelPer",
							title : "剩余油量%",
							width : 140
						}, {
							field : "remainlingFuel",
							title : "剩余油量L",
							width : 140
						}, {
							field : "motormeterDistance",
							title : "仪表里程",
							width : 140
						}, {
							field : "tripMark",
							title : "驾驶循环标签 ",
							width : 160
						}, {
							field : "advanceAngleOfIgnition",
							title : "点火提前角",
							width : 140
						}
					],
					dataBinding : function (e) {}
			});
		 
		 }
	};
	event = {
        listener: function(){ 
		     g.node.btnObdQuery.on("click",process.query);
			 g.node.aObdExport.on("click", process.aexport);
		}
    }; 
   module.exports = {  
        bindGridData : function(){  
		    process.obdGridData();
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