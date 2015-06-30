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
		onlineChart : $("#sc_allflow"),
		startDate : $("#txt_online_startTime"),
		endDate : $("#txt_online_endTime"),
		queryBtn : $("#btnquery"),
		selService : $("#sel_service"),
		navigator: "#alink_navigator",
		service : $("#service"),
		queueTrendChart : "#queueTrendChart",
		selInterval:$("#sel_interval"),
		selDataType:$("#sel_dataType"),
		menu : "#menu a",
		intervalId : [],
		serviceName : []
   };
   
   helper = { 
   };
   
   process = {
   
         init: function(){
		    //初始化空间
			process.initControl(); 
			process.initServiceDiv(""); 
			// 绑定事件
			event.listener();
			 
		 },
        initControl:function(){ 
			kendo.culture("zh-CN");
			g.node.startDate.kendoDateTimePicker({
				animation : false,
				format : "yyyy-MM-dd HH:mm:ss",
				value : dateUtility.dateOldFormat(new Date(), "yyyy-MM-dd hh:mm:00",2)
			});
			g.node.endDate.kendoDateTimePicker({
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
//			 g.node.selService.kendoComboBox({
//	                dataTextField: "text",
//	                dataValueField: "value"
//	            });
		}, 
		/**
		 * 初始化报表
		 */
		initChart : function(data,obj, title, subTitle, timerUrl,
				lineNum) {
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
				for (x = data.length-1; x >=0; x--) {
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
						for (j =data.length-1; j >=0; j--) {
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
		/**
		 * 初始化数据
		 * 
		 * @param date
		 */
		initData : function(obj, url, title, subTitle, timerUrl, lineNum) {
			// init时取得开始五个点的数据
			$.ajax({
				type : "get",
				dataType : "json",
				url : url,
				success : function(result) {
					process.initChart(result, obj, title, subTitle,
							timerUrl, lineNum);
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
		initSelectService : function(data, date) {
			g.node.selService.empty();
			for (i = 0; i < data.length; i++) {
				var temp;
				if (i == 0) {
					temp = "<option value='" + data[i].name + "' selected>"
							+ data[i].name + "</option>";
				} else {
					temp = "<option value='" + data[i].name + "'>"
							+ data[i].name + "</option>";
				}
				g.node.selService.append(temp);
			}
			if (data.length > 0) {
				var service = [ {
					name : g.node.selService.find("option:selected").text()
				} ];
				process.generateDiv(service, date);
			} else {
				g.node.service.empty();
			}
		},
		initServiceDiv : function(item) {
			
			var startTime = g.node.startDate.val();
			var endTime = g.node.endDate.val();
			
			if (item == "") {
				// init 根据ServiceName生成Div
				$.ajax({
					type : "get",
					dataType : "json",
					url : "http://192.168.1.106:8080/GDCP-Monitor-Web/queueTrendChartServlet?type=initServiceName&startTime="
							+ startTime+"&endTime="+endTime,
					success : function(result) {
						g.node.serviceName = result;
						process.initSelectService(result);
					},
					error : function(msg) {
						// console.log(msg);
//						alert("服务器异常" + msg);
					},
					complete : function(msg) {
						// console.log(msg.responseText);
					}
				});
			} else {
				var service = [ {
					name : item
				} ];
				process.generateDiv(service);
			}
		},
		ajaxRequest : function(url, obj) {
			$.ajax({
				type : "get",
				dataType : "json",
				url : url,
				success : function(result) {
					return result;
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
		generate : function(data) {
			
			var startTime = g.node.startDate.val();
			var endTime = g.node.endDate.val();
			var selInterval = g.node.selInterval.find("option:selected").val();
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
				var url = "http://192.168.1.106:8080/GDCP-Monitor-Web/queueTrendChartServlet?type=initQueue&serviceName="
						+ name.serverName + "&queueName=" + name.queueName
						+ "&startTime="+ startTime+"&endTime="+endTime+"&interval="+selInterval+"&queueSum="+name.queueNum+"&dataType="+dataType;
				var timerUrl = "http://192.168.1.106:8080/GDCP-Monitor-Web/queueTrendChartServlet?query=initQueueTimer&timerQuery=query&serviceName="
						+ name.serverName
						+ "&queueName="
						+ name.queueName
						+ "&date=";
				process.initData(node, url, name.queueName, "非实时数据",
						timerUrl, name.queueNum);
			}
		},
		generateDiv : function(data) {
			
			var startTime = g.node.startDate.val();
			var endTime = g.node.endDate.val();
			for (i = 0; i < data.length; i++) {
				var name = data[i];
				$.ajax({
					type : "get",
					dataType : "json",
					url : "http://192.168.1.106:8080/GDCP-Monitor-Web/queueTrendChartServlet?type=initQueueName&startTime="
							+ startTime+"&endTime="+endTime + "&serviceName=" + name.name,
					success : function(result) {
						process.generate(result);
					},
					error : function(msg) {
						// console.log(msg);
//						alert("服务器异常" + msg);
					},
					complete : function(msg) {
						// console.log(msg.responseText);
					}
				});
			}

		},  
		/**
		 * 查询
		 */
		query : function() { 
			process.initServiceDiv(g.node.selService.find(
					"option:selected").text());
		}		 
   
   };
   
   event = {
        //绑定事件
        listener: function(){ 
		}
		
   };

   window.$ = $;
   module.exports = {
   
        init : function(){
		    process.init();
		}
   };
});