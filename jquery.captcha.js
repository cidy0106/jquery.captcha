/**
jquery.captcha.js v0.0.1
Jquery Captcha - released under MIT License
Author:XiDiGe <cidy0106@gmail.com>

Copyright © 2018 xidige.com

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.


*/
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
