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
			$("#id").text(json.ID);
			$("#containers").text(json.Containers); 
			$("#images").text(json.Images); 
			$("#status").text(json.DriverStatus); 
			$("#filesystem").text(json.Filesystem); 
			$("#dir").text(json.DockerRootDir); 
			$("#driver").text(json.Driver); 
			$("#memoryLimit").text(json.MemoryLimit); 
			$("#swapLimit").text(json.SwapLimit); 
			$("#cpuCfsPeriod ").text(json.CpuCfsPeriod ); 
			$("#cpuCfsQuota").text(json.CpuCfsQuota  ); 
			$("#IPv4Forwarding").text(json.IPv4Forwarding  ); 
			$("#debug").text(json.debug); 
			$("#nFd").text(json.NFd); 
			$("#oomKillDisable").text(json.OomKillDisable); 
			$("#goroutines").text(json.NGoroutines); 
			$("#systemTime").text(json.SystemTime);
			$("#executionDriver").text(json.ExecutionDriver);
			$("#LoggingDriver").text(json.LoggingDriver);
			$("#NEventsListener").text(json.NEventsListener);
			$("#kernelVersion").text(json.KernelVersion);
			$("#operatingSystem").text(json.OperatingSystem);
			$("#indexServerAddress").text(json.IndexServerAddress);
			$("#registryConfig").text(json.RegistryConfig);
			$("#indexConfigs").text(json.indexConfigs);
			$("#initSha1").text(json.InitSha1);
			$("#initPath").text(json.InitPath);
			$("#memTotal").text(json.MemTotal);
			$("#httpProxy").text(json.HttpProxy);
			$("#noProxy").text(json.NoProxy);
			$("#name").text(json.Name);
			$("#labels").text(json.Labels);
			$("#experimentalBuild").text(json.ExperimentalBuild);
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