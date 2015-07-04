define(function(require, exports,module){
    var $ = require('jqueryMin');  
	require('kendoWeb');
	var dateUtility = require('../js/DateUtility');
    var g ={ }, helper, process, event;
   
   g.node = {  
   };
   
   helper = { 
   };
   
   process = {
   
         init: function(){ 
			//调用查询初始化数据
            process.login();
			// 绑定事件
			event.listener();
		 },    
		/**
		 * 查询
		 */
		login : function() {  
		}
   
   };
   
   event = {
        //绑定事件
        listener: function(){ 	
		}
   }; 
   module.exports = {
   
        init : function(){
		    process.init();
		}
   };
});