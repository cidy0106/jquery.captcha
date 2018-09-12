# jquery.captcha

## Image captcha
```javascript
$('#img_captcha').captcha();

/**want to change image?**/
$('#img_captcha').click();
```



## button captcha
``` javascript
  $('#btn_send_captcha').captcha({
    beforeHandler:function(ele){
  			return $('form.form-signup').validate().element($("#email"));
  		},
  		handler:function(ele){
  			/*do something you want */       
       /*if error occur,reset the tick*/
       ele.reset();
  		}
  	});
    
 ```
