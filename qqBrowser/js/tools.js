// 加载函数
function ready(fn){
	document.addEventListener('DOMContentLoaded',function(){
		if(fn && Object.prototype.toString.call(fn) === '[object Function]'){
			fn()
		}
	},false)
}

// 滚轮事件 解决Firefox
function wheelFn(obj,fn){
	var agent = window.navigator.userAgent;
	if( agent.indexOf('Firefox') != -1){
		obj.addEventListener( 'DOMMouseScroll', evFn)
	}else{
		obj.addEventListener( 'mousewheel', evFn )
	}

	function evFn(ev){
		var e = ev || event
		var flag = true
		if( e.wheelDelta ){
			flag = e.wheelDelta > 0? true : false;
		}else{
			flag = e.detail < 0? true : false;
		}
		fn( flag )
		ev.preventDefault();
	}
}

// 添加class
function addClass( sClass,parent ){
	var parent = parent || document
	if( parent.className =='' ){
		parent.className = sClass
	}else{
		var arrClass = parent.className.split(' ')
		var _index = arrIndexof( arrClass,sClass )
		if( _index == -1 ){
            parent.className += ' ' + sClass 
		}
	}
}

// 移出class名称
function removeClass(sClass,parent){
	var parent = parent || document
	if( parent.className !='' ){
		var arrClass = parent.className.split(' ')
		var _index = arrIndexof( arrClass,sClass )
		if(_index ==-1 ){
			return
		}
		if( _index != -1 ){
			arrClass.splice(_index,1)
			parent.className = arrClass.join(' ') 
		}
	}
}

// 返回位置 i 值
function arrIndexof(arr,v){
	for (var i = 0; i < arr.length; i++) {
		if( arr[i] == v ){
			return i
		}
	}
	return -1
}

// 简化一下获取元素
function $(selector,context){
	var firstChar = selector.charAt()
	var context = context || document
	if( firstChar === '#' ){
		return document.getElementById( selector.slice(1) )
	}else if( firstChar === '.' ){
		return context.getElementsByClassName(selector.slice(1));
	}else{
		return context.getElementsByTagName(selector)
	}
}

