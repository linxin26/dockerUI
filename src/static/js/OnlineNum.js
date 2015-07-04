define(function(require, exports,module){
    var $ = require('jqueryMin'); 
	require('aceElements');
	require('ace');
	require('jqueryUI');
	require('jqueryUiTouch');
	require('bootbox');
	require('jqueryEasy');
	require('jqueryGritter'); 
	require('bootstrap');
	require('typeaheadBS'); 
	require('kendoWeb');
	var dateUtility = require('../js/DateUtility');
    var g ={ }, helper, process, event;
   
   g.node = {	 
       	onlineChart : $("#sc_flow"),
		queryDate : $("#txtdate"),
		queryBtn : $("#btnquery"),
		startOnlineTime : $("#txt_online_startTime"),
		endOnlineTime : $("#txt_online_endTime"),
		navigator : "#alink_navigator",
		onlineTrendChart : "#onlineTrendChart",
		selInterval : $("#sel_interval"),
		selDataType:$("#sel_dataType"),
		menu : "#menu a",
		intervalId : ''
   };
   
   helper = { 
   };
   
   process = {
   
         init: function(){
		    //初始化控件
            process.initControl(); 
			// 初始报表数据
			process.initData();
			// 绑定事件
			event.listener();
		 },
		 initControl: function(){
			kendo.culture("zh-CN");
			g.node.startOnlineTime.kendoDateTimePicker({
				animation : false,
				format : "yyyy-MM-dd HH:mm:ss",
				value : dateUtility.dateOldFormat(new Date(), "yyyy-MM-dd hh:mm:00",2)
			});
			g.node.endOnlineTime.kendoDateTimePicker({
				animation : false,
				format : "yyyy-MM-dd HH:mm:ss",
				value : dateUtility.dateOldFormat(new Date(), "yyyy-MM-dd hh:mm:00",0)
			});
			
			 g.node.selInterval.kendoDropDownList({
                 dataTextField: "text",
                 dataValueField: "value"
             });
			 
			 g.node.selDataType.kendoDropDownList({
                 dataTextField: "text",
                 dataValueField: "value"
             });
		}, 
		/**
		 * 初始化报表
		 */
		initChart : function(data) {
			scChart = echarts.init(g.node.onlineChart[0]);
			// 组装数据
			var resCurrent = [];
			for (i = data.length - 1; i >= 0; i--) {
				resCurrent.push(data[i].current);
			}
			if (data.length == 0) {
				resCurrent.push(0);
			}
			var option = {
				title : {
					text : '车机在线趋势',
					subtext : '非实时数据'
				},
				tooltip : {
					trigger : 'axis'
				},
				legend : {
					data : [ '在线数' ]
				},
				toolbox : {
					show : true,
					feature : {
						mark : {
							show : true
						},
						dataView : {
							show : true,
							readOnly : false
						},
						magicType : {
							show : false,
							type : [ 'stack', 'tiled' ]
						},
						restore : {
							show : false
						},
						saveAsImage : {
							show : true
						}
					}
				},
				calculable : true,
				xAxis : [ {
					type : 'category',
					boundaryGap : true,
					data : (function() {
						var res = [];
						for (i = data.length - 1; i >= 0; i--) {
							res.push(data[i].time);
						}
						if (data.length == 0) {
							res.push(" ");
						}
						return res;
					})()
				} ],
				yAxis : [ {
					type : 'value'
				} ],
				series : [ {
					name : '在线数',
					type : 'line',
					smooth : true,
					itemStyle : {
						normal : {
							areaStyle : {
								type : 'default'
							}
						}
					},
					data : resCurrent
				} ]
			};
			scChart.setOption(option);
			// 设置定时器
//			process.setTimer(date, scChart);
			// console.log("初始化");
		},
		/**
		 * 初始化数据
		 * 
		 * @param date
		 */
		initData : function( ) {  
			var startTime = g.node.startOnlineTime.val();
			var endTime = g.node.endOnlineTime.val();
			var selInterval = g.node.selInterval.find("option:selected").val();
			var dataType = g.node.selDataType.find("option:selected").val();
			// init时取得开始五个点的数据
			$.ajax({
				type : "get",
				dataType : "json", 
				url : "http://192.168.1.106:8080/GDCP-Monitor-Web/onlineTrendChartServlet?query=all&startTime="+startTime+"&endTime="
					+ endTime+"&interval=" + selInterval+"&dataType="+dataType,
				success : function(result) {
					process.initChart(result);
				},
				error : function(msg) {
					// console.log(msg);
//					alert("服务器异常" + msg);
				},
				complete : function(msg) {
					// console.log(msg.responseText);
				}
			});
		},
		/**
		 * 定时器
		 * 
		 * @param date
		 * @param scChart
		 */
		setTimer : function(date, scChart) {
			// dateType为function（初始化时）或日期为当天则开启定时器
			if (date == ""
					|| process.dateFormat(new Date(), "yyyy-MM-dd") == date) {
				g.node.intervalId = setInterval(function() {
					$.ajax({
						type : "get",
						dataType : "json",
						url : "http://192.168.1.106:8080/GDCP-Monitor-Web/onlineTrendChartServlet?date=" + date,
						success : function(result) {
							// 10秒刷新数据
							process.updateData(scChart, result);
						},
						error : function(msg) {
							// console.log(msg);
						},
						complete : function(msg) {
							// console.log(msg.responseText);
						}
					});

				}, 1000 * 60 * 5);
			}
		},
		/**
		 * 定时更新数据
		 * 
		 * @param scChart
		 * @param data
		 */
		updateData : function(scChart, data) {
			// 动态数据接口 addData
			scChart.addData([ [ 0, // 系列索引
			data.current, // 新增数据
			false, // 新增数据是否从队列头部插入
			true, // 是否增加队列长度，false则自定删除原有数据，队头插入删队尾，队尾插入删队头,
			data.time ] ]);
		},
		/**
		 * 查询
		 */
		query : function() {
			// console.log("query");
			window.clearInterval(g.node.intervalId);
			var date = g.node.queryDate.val();
			process.initData(date);
		}
   
   };
   
   event = {
        //绑定事件
        listener: function(){ 
		    g.node.queryBtn.on("click", function() {
				process.query();
			});
		}
   };

   window.$ = $;
   module.exports = {
   
        init : function(){
		    process.init();
		}
		
   };
});