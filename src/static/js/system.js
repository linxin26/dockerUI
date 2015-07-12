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
		   var url="systemJson"
		   
		  $.ajax({url,dataType:"jsonp",success:function(json){
		     console.log(json.ID);
			$("#containers").text(json.Containers); 
			$("#images").text(json.Images); 
			$("#status").text(json.DriverStatus); 
			$("#filesystem").text(json.Filesystem); 
			$("#dir").text(json.DockerRootDir); 
		  }}); 
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