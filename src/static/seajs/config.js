define(function() {
	'use strict';
	// 全局变量
	window.el = {
		log : true
	// 开启日志
	};

	var development = true, // 是否是开发模型
	debug = development ? 2 : false, // 开发模式默认启动Debug模式
	map = [], app = [], lib = [], v_Product = '0.0.1', // 产品版本
	v_SeaJS = '2.1.0'; // SeaJS版本

	if (debug) { 
	}
 
	seajs.config({
		alias : {
		    'bootstrap' : '../aec/assets/js/bootstrap.min.js', 
			'jquery'  : '/GDCP-QT/static/seajs/jquery-1.11.1.js',
			'jqueryMin'  : '../js/jquery.min.js',
			'kendoWeb': '../js/kendo.web.min.js',
			'kendoCulture': '../js/kendo.culture.zh-CN.min.js',
			'aceElements' : '../aec/assets/js/ace-elements.min.js',
			'jqueryUI' : '../aec/assets/js/jquery-ui-1.10.3.custom.min.js',
			'jqueryUiTouch' : '../aec/assets/js/jquery.ui.touch-punch.min.js',
			'bootbox' : '../aec/assets/js/bootbox.min.js',
			'jqueryEasy' : '../aec/assets/js/jquery.easy-pie-chart.min.js',
			'jqueryGritter' : '../aec/assets/js/jquery.gritter.min.js',
			'typeaheadBS' : '../aec/assets/js/typeahead-bs2.min.js',
			'ace' : '../aec/assets/js/ace.min.js',
			'jqueryTable': '../aec/assets/js/jquery.dataTables.min.js',
		},
		version : v_Product,
		preload : [ 'plugin-nocache' ],
		debug : debug,
		map : map,
		charset : 'utf-8'
	});
}());