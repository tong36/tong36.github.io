var tools = (function(){
	var toolsObj = {
		$:function(selector,context){
			/*

			 * #id
			 * .class
			 * 标签
			 * "#id li"
			 * ".class a"
			 * */
			context = context || document;
			if(selector.indexOf(" ") !== -1){
				return context.querySelectorAll(selector);
			}else if( selector.charAt(0) === "#" ){
				return document.getElementById(selector.slice(1))
			}else if( selector.charAt(0) === "." ){
				return context.getElementsByClassName(selector.slice(1));
			}else{
				return context.getElementsByTagName(selector);
			}
		},
		addEvent:function(ele,eventName,eventFn){
			ele.addEventListener(eventName,eventFn,false);
		},

		removeEvent:function(ele,eventName,eventFn){
			ele.removeEventListener(eventName,eventFn,false)
		},

		each:function(obj,callBack){
			for (var i = 0; i < obj.length; i++) {
				callBack(obj[i],i)
			}
		},
		addClass:function(element,clasName){
			var s = Object.prototype.toString;
			if(s.call(clasName) === '[object String]'){
				if(tools.hasClass(element,clasName)){
					element.className += ' ' + clasName
				}else{
					return element.className
				}
			}
		},
		removeClass:function(element,clsNames){
			var classNameArr = element.className.split(" ");
			for( var i = 0; i < classNameArr.length; i++ ){
				if( classNameArr[i] === clsNames ){
					classNameArr.splice(i,1);
					i--;
				}
			}
			element.className = classNameArr.join(" ");
		},
		
		hasClass:function(element,clasName){
			var classLeng = element.className.split(' ')
			for (var i = 0; i < classLeng.length; i++) {
				if(classLeng[i]==clasName){
					return false
				}
			}
			return true
		},
		toggleClass:function(ele,className){
			if(tools.hasClass(ele,className)){
				tools.addClass(ele,'checked')
				return true
			}else{
				tools.removeClass(ele,'checked')
				return false
			}
		},
		parents:function(obj,selector){
			if(selector.charAt(0) ==='#' ){
				while(obj.id !==  selector.slice(1)){
					obj = obj.parentNode
				} 
			}else if(selector.charAt(0) ==='.' ){
				while((obj && obj.nodeType !== 9) && tools.hasClass( obj,selector.slice(1))){
					obj = obj.parentNode
				}
			}else{
				while(obj && obj.nodeType !== 9 && obj.nodeName.toLowerCase() !== selector){
					obj = obj.parentNode
				}	
			}
			return obj && obj.nodeType === 9 ? null : obj;
		},
		getEleRect:function(obj){
			return obj.getBoundingClientRect();
		},
		collisionRect:function(obj1,obj2){
			var obj1Rect = tools.getEleRect(obj1);
			var obj2Rect = tools.getEleRect(obj2);

			var obj1W = obj1Rect.width;
			var obj1H = obj1Rect.height;
			var obj1L = obj1Rect.left;
			var obj1T = obj1Rect.top;

			var obj2W = obj2Rect.width;
			var obj2H = obj2Rect.height;
			var obj2L = obj2Rect.left;
			var obj2T = obj2Rect.top;
			//碰上返回true 否则返回false
			if( obj1W+obj1L>obj2L && obj1T+obj1H > obj2T && obj1L < obj2L+obj2W && obj1T<obj2T+obj2H ){
				return true
			}else{
				false;
			}
		},
		moveBox:function(obj,otherElement){
			var par = otherElement || obj
			obj.onmousedown = function(e){
			var disX = e.clientX - par.offsetLeft;
			var disY = e.clientY - par.offsetTop
			document.onmousemove = function(e){
				var l = e.clientX - disX
				var t = e.clientY - disY
				if( l < 0){
					l = 0
				}else if( l > window.innerWidth - par.offsetWidth ){
					l = window.innerWidth - par.offsetWidth
				}
				if( t < 0){
					t = 0
				}else if( t > window.innerHeight - par.offsetHeight ){
					t = window.innerHeight - par.offsetHeight
				}
	
				par.style.left = l + 'px'
				par.style.top = t + 'px'
			}
			document.onmouseup = function(){
				document.onmousemove = null
			}
			e.cancelBubble = true
			return false
			}
		},
		between:function(obj){
			obj.style.left = (window.innerWidth - obj.offsetWidth) / 2 +'px'
			obj.style.top = (window.innerHeight - obj.offsetHeight) / 2 +'px'
		}
	}

	return toolsObj;

}())
