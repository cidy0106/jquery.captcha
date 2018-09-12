;(function($){
	/**
	 * 绑定到按钮上，用于发送验证码，在特定的时间内不可再发送
	 * 绑定到img上，点击图片，会刷新图片
	 * 
	 * 需要URI.js插件存在，会优先使用该插件处理url
	 * 
	 * 图片验证码：{url:地址,可不用，默认用图片的src}
	 * 动态验证码：{waitForTime：时间，秒,beforeHandler:function(ele){return true},handler:function(ele){}}
	 * 
	 */
	var pluginName='captcha';
	var defaults={waitForTime:60,beforeHandler:function(ele){return true;},handler:function(ele){}};
	
	function Captcha(element,options){
		this.eleObj=$(element);
		
		this.settings=$.extend({},defaults,options);
		
		this.endTime=0;//毫秒，方便后面计算
		this.timeoutTicket=false;//倒计时事件
		
		
		this.init();
	}
	Captcha.prototype={
			init:function(){
				if(this.eleObj.is('img')){  //图片
					if(!this.settings.url){
						this.settings.url=this.eleObj.data('src');
						this.settings.keyname=this.eleObj.data('keyname');//存放key的input的name
					}
					var _this=this;
					this.eleObj.click(function(e){
						e.preventDefault();
						
						$.ajax({url:_this.settings.url,
							dataType:'json',
							cache:false,
							success:function(response){
								if(response && !response.error && response.data ){
									$('input[name='+_this.settings.keyname+']').val(response.data.key);
									_this.eleObj.attr('src',response.data.img);
								}
							}});
					});
				}else{
					this.settings.text=this.eleObj.text();
					var _this=this;
					this.eleObj.click(function(e){
						e.preventDefault();
						
						if(_this.settings.beforeHandler(_this.eleObj)){  //外部可以处理一下，返回true就会提交
							if(!_this.timeoutTicket){
								_this.eleObj.attr('disabled','disabled');
								_this.endTime=new Date().getTime()+(_this.settings.waitForTime*1000);
								_this.timeoutTicket=setInterval(function(){_this._checkForCaptchaSend();},500);
								_this.settings.handler(_this);
							}
						}						
					});
				}
				return this.eleObj;
			},
			reset:function(){
				if(this.timeoutTicket){
					clearInterval(this.timeoutTicket);
					this.timeoutTicket=false;
					this.endTime=0;
				}
				if(!this.eleObj.is('img')){ //不是图片
					this.eleObj.removeAttr('disabled');
					this.eleObj.text(this.settings.text);
				}
				return this.eleObj;
			},
			_checkForCaptchaSend:function(){
				var _time=(this.endTime-new Date().getTime())/1000;
				if(_time>0){ //还有时间
					this.eleObj.text(parseInt(_time)+' s');
				}else{  //没有时间了
					this.reset();
				}
				return this.eleObj;
			}
	};
	$.fn[pluginName]=function(options){
		return this.each(function(){
			//如果还没有初始化的，才会初始化
			if(!$.data(this,'_plugin_'+pluginName)){
				$.data(this,'_plugin_'+pluginName,new Captcha(this,options));
			}
			
		});
	}
})(jQuery);
