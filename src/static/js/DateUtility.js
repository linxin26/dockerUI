define(function(require ,exports ,module){ 
	var g ={ }, helper, process, event;


   g.node = {	   
   };
	 process = {
   
         init: function(){
		     event.listener();
		 },
		dateFormat : function(date, fmt) {
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
		},
				/**
		 * 转化时间格式
		 * @param date 传入的时间
		 * @param fmt 格式
		 * @param hh 几小时前的数据，hh为0时为当前时间
		 * @returns
		 */
		dateOldFormat : function(date, fmt, hh) {
			var h = date.getHours() - hh;
			var o = {
				"M+" : date.getMonth() + 1, // 月份
				"d+" : date.getDate(), // 日
				"h+" : h, // 小时
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
        listener: function(){ 
		}
    }; 
   module.exports = { 
        dateFormat : function(date, fmt){
		    process.dateFormat(date, fmt);
		},
		dateOldFormat : function(date ,fmt, hh){
		   return process.dateOldFormat(date, fmt, hh);
		}
   };
})