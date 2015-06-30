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
   		onlineChart : $("#chart_online"),
		scChart: $("#sc_flow"),
		startOnlineTime : $("#txt_online_startTime"),
		endOnlineTime : $("#txt_online_endTime"),
		queryBtn : $("#btnQuery"),
		selService : $("#sel_service"),
		waringLog : "#waringLog",
		selInterval : $("#sel_interval"),
		selDataType:$("#sel_dataType"),
		menu : "#menu a",
		service : $("#service"),
		navigator : "#alink_navigator",
		grid : $("#grid"),
		intervalId : [],
		serviceName : []
   };
   
   helper = { 
   };
   
   process = {
   
         init: function(){
		     event.listener();
			process.initControl();
			// 初始报表数据
			process.initData();
			process.initGrid();
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
		 * 查询
		 */
		query : function() {
			var name = process.getUrlParam("serverName");
			var startTime = g.node.startOnlineTime.val();
			var endTime = g.node.endOnlineTime.val();
			var selInterval = g.node.selInterval.find("option:selected").val();
			var dataType = g.node.selDataType.find("option:selected").val();
			$.ajax({
				type : "get",
				dataType : "json",
				url : "http://192.168.1.106:8080/GDCP-Monitor-Web/serverViewServlet?type=query&name=" + name
						+ "&interval=" + selInterval + "&startTime="
						+ startTime + "&endTime=" + endTime+"&dataType="+dataType,
				success : function(result) {
					for (i = 0; i < g.node.intervalId.length; i++) {
						window.clearInterval(g.node.intervalId[i]);
					}
					process.initOnlineChart(result, name); 
				},
				error : function(msg) { 
				},
				complete : function(msg) { 
				}
			});
			
			$.ajax({
				type : "get",
				dataType : "json",
				url : "http://192.168.1.106:8080/GDCP-Monitor-Web/serverViewServlet?type=querySc&name=" + name
						+ "&interval=" + selInterval + "&startTime="
						+ startTime + "&endTime=" + endTime+"&dataType="+dataType,
				success : function(result) {
					for (i = 0; i < g.node.intervalId.length; i++) {
						window.clearInterval(g.node.intervalId[i]);
					}
					process.initScChart(result, name); 
				},
				error : function(msg) { 
				},
				complete : function(msg) { 
				}
			});
			process.initQueue(); 

		},
		initServerDetails : function(name) {
			$.ajax({
				type : "get",
				dataType : "json",
				url : "http://192.168.1.106:8080/GDCP-Monitor-Web/serverViewServlet?type=details&name=" + name,
				success : function(result) {
					$("#spanOnlineNum").text(result.onlineNum);
					$("#spanCurrentFlow").text(result.flowData + "Kb");
					$("#spanflowDataSum").text(result.flowDataSum + "Kb"); 
				},
				error : function(msg) { 
				},
				complete : function(msg) { 
				}
			});
		},
		/**
		 * 初始化报表
		 */
		initOnlineChart : function(data, name) {
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
//			process.setTimer(name, scChart);
			// console.log("初始化");
		},
		/**
		 * 初始化报表
		 */
		initScChart : function(data, name) {
			scChart = echarts.init(g.node.scChart[0]);
			// 组装数据
			var resCurrent = [];
			var packageList=[];
			for (i = data.length - 1; i >= 0; i--) {
				resCurrent.push(data[i].current);
				packageList.push(data[i].package);
			}
			
			if (data.length == 0) {
				resCurrent.push(0);
			}
			var option = {
				title : {
					text : 'SC流量情况',
					subtext : '非实时数据'
				},
				tooltip : {
					trigger : 'axis'
				},
				legend : {
					data : [ '流量(Kb)','包数量' ]
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
					name : '流量(Kb)',
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
				},{
					name : '包数量',
					type : 'line',
					smooth : true,
					itemStyle : {
						normal : {
							areaStyle : {
								type : 'default'
							}
						}
					}, 
					data : packageList
				}  ]
			};
			scChart.setOption(option);
			// 设置定时器
//			process.setTimer(name, scChart);
			// console.log("初始化");
		},
		generate : function(data, startTime, endTime, selInterval) {
			var dataType=g.node.selDataType.find("option:selected").val();
			if (data.length == 0) {
				g.node.service.empty();
			}
			g.node.service.empty();
			for (i = 0; i < data.length; i++) {
				var id = data[i].serverName + "_" + data[i].queueName;
				var div = $("<div id='" + id
						+ "' style='height: 400px;'></div>");
				$("#service").append(div);
			}
			for (i = 0; i < data.length; i++) {
				var name = data[i];
				var node = $("#" + data[i].serverName + "_" + name.queueName);
				var url = "http://192.168.1.106:8080/GDCP-Monitor-Web/serverQueueViewServlet?type=initQueue&serviceName="
						+ name.serverName + "&queueName=" + name.queueName
						+ "&startTime=" + startTime + "&endTime=" + endTime
						+ "&interval=" + selInterval+"&queueSum="+name.queueSum+"&dataType="+dataType;

				process.initChartData(node, url, name.queueName, "非实时数据",
						name.queueSum);
			}
		},
		/**
		 * 初始化数据
		 * 
		 * @param date
		 */
		initChartData : function(obj, url, title, subTitle, lineNum) {  
				// init时取得开始五个点的数据
				$.ajax({
					type : "get",
					dataType : "json",
					url : url,
					success : function(result) {
//						console.log(result);
						process.initChart(result, obj, title, subTitle, lineNum);
					},
					error : function(msg) {
						// console.log(msg);
//						alert("服务器异常" + msg);
					},
					complete : function(msg) {
						// console.log(msg.responseText);
					}
				}); 
			
		},
		/**
		 * 初始化报表
		 */
		initChart : function(data, obj, title, subTitle, lineNum) {
			scChart = echarts.init(obj[0]);
			var legend = [];
			var seriesArr = [];
			var xAxisArr = [];
			for (i = 1; i <= lineNum; i++) {
				legend.push(title + i+"阻塞数");
				legend.push(title + i+"处理量");
				if(i==2){
					legend.push("");
				}
				var tempData = [];
				var processData=[];
				var y = 0;
				for (x = data.length - 1; x >= 0; x--) {
					if (data[x].queueIndex == i) {
						tempData[y] = data[x].current;
						processData[y]=data[x].processSize;
						y++;
					}
				}
				var temp = {
						name : title + i+"阻塞数",
						type : 'bar',
						smooth : true,
						itemStyle : {
							normal : {
								areaStyle : {
									type : 'default'
								}
							}
						},
						data : tempData
					};
					var process = {
							name : title + i+"处理量",
							type : 'line',
							smooth : true,
							itemStyle : {
								normal : {
									areaStyle : {
										type : 'default'
									}
								}
							},
							data : processData
						};
					
					seriesArr.push(temp);
					seriesArr.push(process);
			}
			for (i = 1; i <= 1; i++) {
				var tempAxis = {
					type : 'category',
					boundaryGap : true,
					data : (function() {
						var res = []; 
							for (j = data.length - 1; j >= 0; j--) {
							if (data[j].queueIndex == i) {
								res.push(data[j].time);
							}
						}
						if (data.length == 0) {
							res.push(" ");
						}
						return res;
					})()
				};
				xAxisArr.push(tempAxis);
			}

			var option = {
				title : {
					text : title + "队列阻塞",
					subtext : subTitle
				},
				tooltip : {
					trigger : 'axis'
				},
				legend : {
					data : legend
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
				xAxis : xAxisArr,
				yAxis : [ {
					type : 'value'
				} ],
				series : seriesArr
			};
			scChart.setOption(option);
		},
		initQueue : function() {
			var name = process.getUrlParam("serverName");
			var startTime = g.node.startOnlineTime.val();
			var endTime = g.node.endOnlineTime.val();
			var selInterval = g.node.selInterval.find("option:selected").val();
//			startTime="2014-12-30 13:48:22";
//			console.log("startTime:" + startTime);
//			console.log("endTime:" + endTime);
			$.ajax({
				type : "get",
				dataType : "json",
				url : "http://192.168.1.106:8080/GDCP-Monitor-Web/serverQueueViewServlet?type=initQueueName&serviceName="
						+ name + "&startTime="+startTime+"&endTime="
						+ endTime,
				success : function(result) {
					process.generate(result, startTime, endTime, selInterval);
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
		 * init服务器
		 */
		initGrid : function() {
			g.node.grid.kendoGrid({
				dataSource : {
					type : "odata",
					transport : {
						read : "http://192.168.1.106:8080/GDCP-Monitor-Web/serverViewServlet?type=server&serviceName="+process.getUrlParam("serverName")
					},
					schema : {
						model : {
							fields : {
								svcTyp : {
									type : "string"
								},
								inUseSvc : {
									type : "string"
								}, 
								id : {
									type : "string"
								}
							}
						}
					},
					pageSize : 20,
					serverPaging : false,
					serverFiltering : false,
					serverSorting : false
				},
				sortable : false,
				filterable : false,
				columnMenu : false,
				pageable : false,
				columns : [ {
					field : "id",
					title : "序号",
					width : 80
				},  {
					field : "svcTyp",
					title : "类型"
				}, {
					field : "inUseSvc",
					title : "当前连接串"
				} ],
				dataBinding : function(e) { 
					if (e.items.length == 0) {
					} else {
					} 
				},
				dataBound : function(e) {  
				}
			}); 
		},
		/**
		 * 初始化数据
		 * 
		 * @param date
		 */
		initData : function() {
			process.query(); 
		},
		initBody : function() {
			var serverName = process.getUrlParam("serverName");
			$("#serverName").text(
					"时间："
							+ dateUtility.dateFormat(new Date(),
									"yyyy-MM-dd hh:mm:ss"));
			process.initServerDetails(serverName);
		},
		getUrlParam : function(name) {
			var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); // 构造一个含有目标参数的正则表达式对象
			var r = window.location.search.substr(1).match(reg); // 匹配目标参数
			if (r != null)
				return unescape(r[2]);
			return null; // 返回参数值 .
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