define(function(require, exports,module){
    var $ = require('jqueryMin');    
    var g ={ }, helper, process, event;
   
   g.node = {  
   };
   
   helper = { 
   };
   
   process = {
   
         init: function(){ 
			//调用查询初始化数据
            process.load();
			// 绑定事件
			event.listener();
		 },    
		/**
		 * 载入
		 */
		load : function() {  
		  //var url="http://192.168.140.151:4243/containers/json"; 
		  //var url="http://192.168.140.151:4243/info"; 
		   var url="http://127.0.0.1:18080/containersJson"
		  /** $.getJSON(url+"?callback=?",    
           function(json){
			   console.log("getJSON");
           });			**/  
          $.ajax({
			  url:url,
			   success:function(data){
				   console.log(data);
			   }, 
			   dataType:"jsonp",
			   jsonp: 'callback', 
			   jsonpCallback : 'handler',
			   error:function(err){
				   console.log(err);
			   }
		   });		   
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