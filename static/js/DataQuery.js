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
	var alertData = require('../js/alertGrid');
	var obdData = require('../js/ObdGrid');
	var gpsData = require('../js/GpsGrid');
	var driverData = require('../js/driverEvent');
	var behavior = require('../js/Behavior');
	var trouble = require('../js/Trouble');
	var brake = require('../js/BrakeEvent');
	var terminal = require('../js/Terminal');
	var simInfo = require('../js/SIMInfo');
	var beartbeat = require('../js/heartbeat');
	var terminalSleep = require('../js/TerminalSleep');
	var driver = require('../js/Driver');
	var overSpeed = require('../js/OverSpeed');
	var idling = require('../js/IdlingEvent');
	var economic = require('../js/economic');
	var security = require('../js/security');
	var eventLog = require('../js/EventLog');
    var g ={ }, helper, process, event;
   
   g.node = {	
        gpsWindow : $("#gps_window"),
		gpsDialog : $("#gps_dialog"),  
		obdWindow : $("#obd_window"),
		obdDialog : $("#obd_dialog"),   
		alertDialog : $("#alert_dialog"),
		alertWindow : $("#alert_window"),  
		driverEventDialog : $("#driverEvent_dialog"),
		driverEventWindow : $("#driverEvent_window"), 
		behaviorWindow : $("#behavior_window"),
		behaviorDialog : $("#behavior_dialog"),   
	    troubleWindow : $("#trouble_window"),
		troubleDialog : $("#trouble_dialog"),
		brakeWindow : $("#brake_window"),
		brakeDialog : $("#brake_dialog"),
		terminalWindow : $("#terminal_window"),
		terminalDialog : $("#terminal_dialog"),
		simInfoWindow : $("#simInfo_window"),
		simInfoDialog : $("#simInfo_dialog"),
		heartbeatWindow : $("#heartbeat_window"),
		heartbeatDialog : $("#heartbeat_dialog"),
		sleepWindow : $("#sleep_window"),
		sleepDialog : $("#sleep_dialog"),
		driverWindow : $("#driver_window"),
		driverDialog : $("#driver_dialog"),
		overSpeedWindow : $("#overSpeed_window"),
		overSpeedDialog : $("#overSpeed_dialog"),
		idlingWindow : $("#idling_window"),
		idlingDialog : $("#idling_dialog"),
		economicWindow : $("#economic_window"),
		economicDialog : $("#economic_dialog"),
		securityWindow : $("#security_window"),
		securityDialog : $("#security_dialog"),
		eventLogWindow : $("#eventLog_window"),
		eventLogDialog : $("#eventLog_dialog")
   };
   
   helper = {
         /**
		  数据窗口
		 **/
		 openWindow : function(window,dialog,process,title){
		     dialog.show(); 
			  var undo = window.bind("click",function(){
			      dialog.data("kendoWindow").open();
				 //undo.hide();
			 });
			 var onClose = function(e){
			     //清空dialog数据
			      process.reload(); 
			    //undo.show();
			 };
			 if (!dialog.data("kendoWindow")) {
					dialog.kendoWindow({
						width : "870px",
						title : title,
						actions : [
							"Pin",
							"Minimize",
							"Maximize",
							"Close"
						],
						close : onClose
					});
			};
            //绑定数据 			
			process.bindGridData(); 
		 }
   };
   
   process = {
   
         init: function(){ 
		     event.listener();
			 obdData.init();
			 gpsData.init();
			 alertData.init();
			 driverData.init();
			 behavior.init();
			 trouble.init();
			 brake.init();
			 terminal.init();
			 simInfo.init();
			 beartbeat.init();
			 terminalSleep.init();
			 driver.init();
			 overSpeed.init();
			 idling.init();
			 economic.init();
			 security.init();
			 eventLog.init();
		 },  
		 /**
		   事件日志数据窗口
		   **/
		 openEventLogWindow : function(){ 
		    helper.openWindow(g.node.eventLogWindow,g.node.eventLogDialog,eventLog,'事件日志数据查询'); 
		 },
		/**
		 安防信息数据窗口
		   **/
		 openSecurityWindow : function(){ 
		    helper.openWindow(g.node.securityWindow,g.node.securityDialog,security,'安防信息数据查询'); 
		 },
		 /**
		 经济转速数据窗口
		   **/
		 openEconomicWindow : function(){ 
		    helper.openWindow(g.node.economicWindow,g.node.economicDialog,economic,'经济转速数据查询'); 
		 },
		 /**
		 怠速数据窗口
		   **/
		 openIdlingWindow : function(){ 
		    helper.openWindow(g.node.idlingWindow,g.node.idlingDialog,idling,'怠速数据查询'); 
		 },
		  /**
		 超速数据窗口
		   **/
		 openOverSpeedWindow : function(){ 
		    helper.openWindow(g.node.overSpeedWindow,g.node.overSpeedDialog,overSpeed,'超速数据查询'); 
		 },
		 /**
		  驾驶员信息数据窗口
		 **/
		 openDriverWindow : function(){ 
		    helper.openWindow(g.node.driverWindow,g.node.driverDialog,driver,'驾驶员数据查询'); 
		 }, 
		    /**
		  终端休眠信息数据窗口
		 **/
		 openTerminalSleepWindow : function(){ 
		    helper.openWindow(g.node.sleepWindow,g.node.sleepDialog,terminalSleep,'终端休眠数据查询'); 
		 }, 
		   /**
		  心跳信息数据窗口
		 **/
		 openBeartbeatWindow : function(){ 
		    helper.openWindow(g.node.heartbeatWindow,g.node.heartbeatDialog,beartbeat,'心跳信息数据查询'); 
		 }, 
		  /**
		  Sim卡信息数据窗口
		 **/
		 openSimInfoWindow : function(){ 
		    helper.openWindow(g.node.simInfoWindow,g.node.simInfoDialog,simInfo,'Sim卡信息数据查询'); 
		 }, 
		 /**
		  驾驶行为事件数据窗口
		 **/
		 openDriverEventWindow : function(){ 
		    helper.openWindow(g.node.driverEventWindow,g.node.driverEventDialog,driverData,'驾驶行为事件数据查询'); 
		 }, 
		  /**
		  终端信息数据窗口
		 **/
		 openTerminalWindow : function(){ 
		    helper.openWindow(g.node.terminalWindow,g.node.terminalDialog,terminal,'终端信息查询');
		 },
		 /**
		  刹车事件数据窗口
		 **/
		 openBrakeWindow : function(){
		    helper.openWindow(g.node.brakeWindow,g.node.brakeDialog,brake,'刹车事件数据查询');
		 },
		 /**
		  故障码数据窗口
		 **/
		 openTrubleWindow : function(){
		   helper.openWindow(g.node.troubleWindow,g.node.troubleDialog,trouble,'故障码数据查询');
		 },
		 /**
		  驾驶行为数据窗口
		 **/
		 openBehaviorWindow : function(){
		  helper.openWindow(g.node.behaviorWindow,g.node.behaviorDialog,behavior,'驾驶行为数据查询'); 
		 },
		 /**
		  告警数据窗口
		 **/
		 openAlertWindow : function(){
		   helper.openWindow(g.node.alertWindow,g.node.alertDialog,alertData,'Alert数据查询'); 
		 },
		 /**
		    OBD窗口
		 **/
		 openOBDWindow : function(){
		  helper.openWindow(g.node.obdWindow,g.node.obdDialog,obdData,'OBD数据查询'); 
		 },
		 /**
		    gps窗口
		 **/
		 openGpsWindow : function(){
		    helper.openWindow(g.node.gpsWindow,g.node.gpsDialog,gpsData,'GPS数据查询'); 
			
		 },
         format : function(date, fmt) {
			var o = {
				"M+" : date.getMonth() + 1, // 月份
				"d+" : date.getDate(), // 日
				"h+" : date.getHours(), // 小时
				"m+" : date.getMinutes(), // 分
				"s+" : date.getSeconds(), // 秒
				"q+" : Math.floor((date.getMonth() + 3) / 3), // 季度
				"S" : date.getMilliseconds()
			// 毫秒
			};
			if (/(y+)/.test(fmt))
				fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "")
						.substr(4 - RegExp.$1.length));
			for ( var k in o)
				if (new RegExp("(" + k + ")").test(fmt))
					fmt = fmt.replace(RegExp.$1,
							(RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k])
									.substr(("" + o[k]).length)));
			return fmt;
		}
   
   };
   
   event = {
        //绑定事件
        listener: function(){
              g.node.gpsWindow.on("click",process.openGpsWindow);
			  g.node.obdWindow.on("click",process.openOBDWindow);
			  g.node.alertWindow.on("click",process.openAlertWindow);
			  g.node.driverEventWindow.on("click",process.openDriverEventWindow);
			  g.node.behaviorWindow.on("click", process.openBehaviorWindow);
			  g.node.troubleWindow.on("click", process.openTrubleWindow);
			  g.node.brakeWindow.on("click", process.openBrakeWindow);
			  g.node.terminalWindow.on("click", process.openTerminalWindow);
			  g.node.simInfoWindow.on("click", process.openSimInfoWindow);
			  g.node.heartbeatWindow.on("click", process.openBeartbeatWindow);
			  g.node.sleepWindow.on("click", process.openTerminalSleepWindow);
			  g.node.driverWindow.on("click", process.openDriverWindow);
			  g.node.overSpeedWindow.on("click", process.openOverSpeedWindow);
			  g.node.idlingWindow.on("click", process.openIdlingWindow);
			  g.node.economicWindow.on("click", process.openEconomicWindow);
			  g.node.securityWindow.on("click", process.openSecurityWindow);
			  g.node.eventLogWindow.on("click", process.openEventLogWindow);
		}
   };

   window.$ = $;
   module.exports = {
   
        init : function(){
		    process.init();
		}
   };
});