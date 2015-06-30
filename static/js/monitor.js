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
   		onlineChart : $("#main"),
		ScFlowChart : $("#sc_flow"),
		navigator : "#alink_navigator",
		waringLog : "#waringLog",
		menu : "#menu a",
		grid : $("#grid"),
		intervalId : ''
   };
   
   helper = { 
   };
   
   process = {
   
         init: function(){
		     event.listener();
			// 初始报表数据
			process.initData();
			process.initGrid();
			// 绑定事件
			event.listener();
		 }, 
		/**
		 * 初始化报表
		 */
		initOnlineChart : function(data, date) {
			scChart = echarts.init(g.node.onlineChart[0]);
			var option = {
				title : {
					text : '在线车机数',
					subtext : '实时数据'
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
				// X轴的数据
				xAxis : [ {
					type : 'category',
					boundaryGap : true,
					data : (function() {
						// 开始五个点时间
						var res = [ data[8].time, data[7].time, data[6].time,
								data[5].time, data[4].time, data[3].time,
								data[2].time, data[1].time, data[0].time ];
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
					// 开始五个点数据
					data : [ data[8].current, data[7].current, data[6].current,
							data[5].current, data[4].current, data[3].current,
							data[2].current, data[1].current, data[0].current ]
				} ]
			};
			scChart.setOption(option);
			// 设置定时器
			process.setTimer(scChart, "http://192.168.1.106:8080/GDCP-Monitor-Web/onlineDeviceServlet");
			// console.log("初始化");
		},
		/**
		 * 初始化报表
		 */
		initSChart : function(data) {
			scChart = echarts.init(g.node.ScFlowChart[0]);
			var option = {
				title : {
					text : 'SC整体流量图',
					subtext : '实时数据'
				},
				tooltip : {
					trigger : 'axis'
				},
				legend : {
					data : [ '流量(Kb)', '包数量' ]
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
						// 开始五个点时间
						var res = [ data[8].time, data[7].time, data[6].time,
								data[5].time, data[4].time, data[3].time,
								data[2].time, data[1].time, data[0].time ];
						return res;
					})()
				} ],
				yAxis : [ {
					type : 'value'
				} ],
				series : [
						{
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
							// 开始五个点数据
							data : [ data[8].current, data[7].current,
									data[6].current, data[5].current,
									data[4].current, data[3].current,
									data[2].current, data[1].current,
									data[0].current ]
						},
						{
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
							// 开始五个点数据
							data : [ data[8].packageSum, data[7].packageSum,
									data[6].packageSum, data[5].packageSum,
									data[4].packageSum, data[3].packageSum,
									data[2].packageSum, data[1].packageSum,
									data[0].packageSum ]
						} ]
			};
			scChart.setOption(option);
			// 设置定时器
			process.setTimer(scChart, "http://192.168.1.106:8080/GDCP-Monitor-Web/scDataFlowServlet");
		},
		/**
		 * 初始化数据
		 * 
		 * @param date
		 */
		initData : function( ) { 
			$.ajax({
				type : "get",
				dataType : "json",
				url : "http://192.168.1.106:8080/GDCP-Monitor-Web/onlineDeviceServlet?query=all",
				success : function(result) {
					process.initOnlineChart(result);
				},
				error : function(msg) {
					 console.log(msg);
					alert("服务器异常" + msg);
				},
				complete : function(msg) {
					// console.log(msg.responseText);
				}
			});

			// init时取得开始五个点的数据
			$.ajax({
				type : "get",
				dataType : "json",
				url : "http://192.168.1.106:8080/GDCP-Monitor-Web/scDataFlowServlet?query=all",
				success : function(result) {
					process.initSChart(result);
				},
				error : function(msg) {
					 console.log(msg);
					alert("服务器异常" + msg);
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
		setTimer : function(scChart, url) {
			g.node.intervalId = setInterval(function() {
				$.ajax({
					type : "get",
					dataType : "json",
					url : url,
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
			}, 1000 * 30);
		},
		/**
		 * 定时更新数据
		 * 
		 * @param scChart
		 * @param data
		 */
		updateData : function(scChart, data) {
			var datas;
			if (data.packageSum) {
				datas = [ [ 0, // 系列索引
				data.current, // 新增数据
				false, // 新增数据是否从队列头部插入
				false // 是否增加队列长度，false则自定删除原有数据，队头插入删队尾，队尾插入删队头,
				 ], [ 1,  
				data.packageSum, 
				false,  
				false,  
				data.time ] ];
			} else {
				datas = [ [ 0,  
				data.current,  
				false,  
				false,  
				data.time ] ];
			}

			// 动态数据接口 addData
			scChart.addData(datas);

		},
		initGrid : function() {
			g.node.grid.kendoGrid({
				dataSource : {
					type : "odata",
					transport : {
						read : "http://192.168.1.106:8080/GDCP-Monitor-Web/indexServlet"
					},
					schema : {
						model : {
							fields : {
								svrName : {
									type : "string"
								}, 
								svcUrl1 : {
									type : "string"
								},
								activeDevNum : {
									type : "string"
								},
								isOnLine : {
									type : "string"
								},
								load : {
									type : "string"
								},
								svcType : {
									type : "string"
								},
								id : {
									type : "string"
								},
								serverFlow : {
									type : "string"
								},
								stacking : {
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
				columnMenu : false,
				pageable : false,
				columns : [ {
					field : "id",
					title : "序号",
					width : 40
				}, {
					field : "svrName",
					title : "名称",
					width : 140
				}, {
					field : "svcType",
					title : "类型",
					width : 180
				},   {
					field : "serverFlow",
					title : "总流量",
					width : 180
				}, {
					field : "stacking",
					title : "队列堆积",
					width : 130
				}, {
					field : "isOnLine",
					title : "状态",
					width : 150
				} ],
				dataBinding : function(e) {
//					 console.log(e);
					if (e.items.length == 0) {
					} else {
					}
					var grid = g.node.grid.data("kendoGrid");
//					console.log(grid);
//					console.log(grid.dataItem);
					var data = grid.dataItem("tr:eq(1)");
					
					if (data) {
//						console.log(data.id);
						data.id = 123;
					} 
				},
				dataBound : function(e) {
					// console.log(e.sender);
//					console.log($("[role='grid']").find("tr"));
					$("[role='grid'] tr").find("td:nth-child(6)").each(function(i){
						if($(this).text()=="离线"){
//							console.log($(this));
//							console.log($(this).prev().prev().prev().prev().prev());
							$(this).html("<span style=\"color:red\">离线</span>");
						}else{ 
							var node=$(this).prev().prev().prev().prev();
							if(node.text().toLowerCase().indexOf("scollector")!=-1){
							    node.html("<a href='serverView.html?serverName="+node.text()+"'>"+node.text()+"</a>");
							}else{
								node.html("<a href='serverQueueView.html?serverName="+node.text()+"'>"+node.text()+"</a>");
							}
						} 
					});  
//					$("[role='grid'] tr").find("td:nth-child(2)").each(function(i){
//						$(this).html("<a href='serverView.html?serverName="+$(this).text()+"'>"+$(this).text()+"</a>");
//					});
					
				}
			}); 
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