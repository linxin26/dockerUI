define(function(require, exports,module){
    var $ = require('jqueryMin');  
	require('kendoWeb');  
	require('bootstrap');
	
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
		   var url="containersJson" 
		var dataSource = new kendo.data.DataSource({
  transport: {
    read: {
      url: url,
      dataType: "jsonp"
    }
  },
  pageSize: 10
});
$("#grid").kendoGrid({
  dataSource: dataSource,
  pageable: true
});

		   /**$("#containers").dataTable({
				"processing": true,
                 "serverSide": true,
				"ajax":{
					"url":"http://127.0.0.1:18080/containersJson",
					"dataSrc" : ""
				},
				"columns": [
		            { "data": "ID" },
		            { "data": "Names" },
		            { "data": "Image" },
		            { "data": "Command" },
		            { "data": "Create" },
		            { "data": "Ports" },
					{ "data": "Leabels" },
					{ "data": "Status" }	
        	         ]
			});**/
		
          }
   
   };
   
   event = {
        //绑定事件
        listener: function(){  
		    $("button[data-target='submit']").on("click",function(e){
				console.log(e);
			});
		    $("#myModal").on("hide",function(e){
				console.log(e);
				console.log("hidden");
			});
		}
   }; 
   module.exports = {
   
        init : function(){
		    process.init(); 
		}
   };
});