/*
* t : time 已过时间
* b : begin 起始值
* c : count 总的运动值
* d : duration 持续时间
*
* 曲线方程
*
* http://www.cnblogs.com/bluedream2009/archive/2010/06/19/1760909.html
* */

//获取元素
function $(selector,contact){
	//判断参数contact是否传入，有传入就用传入值，没有就用默认的document
	contact = contact || document;
	if(selector.charAt() === '#'){
		//判断传入的为id名即为#开头
		return document.getElementById(selector.substring(1));
	}else if(selector.charAt() === '.'){
		//判断传入的为class名即为.开头
		return contact.getElementsByClassName(selector.substring(1));
	}else{
		//判断传入的为tagName
		return contact.getElementsByTagName(selector);
	}
}

function move(count,duration,interval,obj,attr,tween,fn){
	//每次调用之前清掉定时器
	clearInterval(obj[attr]);
	//设置初始时间
	var startTime = new Date().getTime();
	//设置初始位置
	var b = parseFloat(getComputedStyle(obj)[attr]);
	//设置总移动距离，注意count的值为需要移动到的终点位置，不是需要移动多远,移动距离为终点位置距离初始位置的差值。
	var c = count - b;
	//设置总移动时间
	var d = duration;
	//设置名字为obj的属性为time的定时器
	obj[attr] = setInterval(function(){
		//设置时间间隔为当前时间减去初始时间
		var t = new Date().getTime() - startTime;
		//判断当时间间隔等于总时间时让时间间隔等于总时间（为了消除误差）；并关掉定时器，到达终点不用再移动
		if( t > d){
			t = d;
			clearInterval(obj[attr]);
		}
		//算出每隔interval时间段需要移动的距离，使用Tween直接计算
		value = Tween[tween](t, b, c, d);
		//判断如果需要变化的属性为opacity则让value等于他本身，否则让value等于value + 'px'。因为opacity没有单位
		if(attr == 'opacity'){
			value = value;
		}else{
			value = value + 'px';
		}
		//将算出的value传给需要改变的对象
		obj.style[attr] = value;
		//判断当时间间隔等于总时间即该定时器执行完毕时
		if(t == d){
			//清除定时器
			clearInterval(obj[attr]);
			//判断传入的fn为函数时，立即执行该函数
			if(typeof fn == 'function'){
				fn();
			}
		}
	},interval)
	
}

//抖动函数
function shake(obj,attr,target,fn){
	//先关闭定时器
	clearInterval(obj.time);
	//如果有传入target就使用传入值，未传入就使用默认值
	target = target || 30;
	//声明一个数组存数字
	var arr = [];
	//获取对象的最初属性值存入变量
	var begin = parseFloat(getComputedStyle(obj)[attr]);
	//生成一些正负对应的数并存入数组
	for (var i = target; i > 0; i -= 2) {
		arr.push(i,-i);
	}
	//将0加入到数组的最后一项
	arr.push(0);
	//定义变量 通过变量的自增达到遍历数组的目的
	var m = 0;
	//开启定时器，使每隔一段时间改变对象的属性值
	obj.time = setInterval(function(){
		//设置对象的属性值为初始值加数组中的数
		obj.style[attr] = (arr[m] + begin) + 'px';
		//使m每次自增
		m++;
		//判断m超出数组长度时
		if(m >= arr.length){
			//重置m为0
			m = 0;
			//清除定时器
			clearInterval(obj.time);
		}
		//判断当m==0,即震动结束时
		if(m == 0){
			//如果fn为函数，则立即执行。
			if(typeof fn == 'function'){
				fn();
			}
		}
	},30)
}
//添加class
function addClass(obj,className){
	var classes = obj.getAttribute('class');
	if(!classes){
		obj.className = className;
	}else{
		var arrClass = classes.split(' ');
		var on = false;
		for (var i = 0; i < arrClass.length; i++) {
			if(arrClass[i] === className){
				on = true;
			}
		}
		if(!on) arrClass.push(className);
		obj.className = arrClass.join(' ');
	}
}
//移除class
function removeClass(obj,className){
	var classes = obj.getAttribute('class');
	if(!classes) return;
	var arrClass = classes.split(' ');
	for (var i = 0; i < arrClass.length; i++) {
		if(arrClass[i] === className){
			arrClass.splice(i,1);
		}
	}
	obj.className = arrClass.join(' ');
}
//Tween.linear();

var Tween = {
	linear: function (t, b, c, d){  //匀速
		return c*t/d + b;
	},
	easeIn: function(t, b, c, d){  //加速曲线
		return c*(t/=d)*t + b;
	},
	easeOut: function(t, b, c, d){  //减速曲线
		return -c *(t/=d)*(t-2) + b;
	},
	easeBoth: function(t, b, c, d){  //加速减速曲线
		if ((t/=d/2) < 1) {
			return c/2*t*t + b;
		}
		return -c/2 * ((--t)*(t-2) - 1) + b;
	},
	easeInStrong: function(t, b, c, d){  //加加速曲线
		return c*(t/=d)*t*t*t + b;
	},
	easeOutStrong: function(t, b, c, d){  //减减速曲线
		return -c * ((t=t/d-1)*t*t*t - 1) + b;
	},
	easeBothStrong: function(t, b, c, d){  //加加速减减速曲线
		if ((t/=d/2) < 1) {
			return c/2*t*t*t*t + b;
		}
		return -c/2 * ((t-=2)*t*t*t - 2) + b;
	},
	elasticIn: function(t, b, c, d, a, p){  //正弦衰减曲线（弹动渐入）
		if (t === 0) { 
			return b; 
		}
		if ( (t /= d) == 1 ) {
			return b+c; 
		}
		if (!p) {
			p=d*0.3; 
		}
		if (!a || a < Math.abs(c)) {
			a = c; 
			var s = p/4;
		} else {
			var s = p/(2*Math.PI) * Math.asin (c/a);
		}
		return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
	},
	elasticOut: function(t, b, c, d, a, p){    //*正弦增强曲线（弹动渐出）
		if (t === 0) {
			return b;
		}
		if ( (t /= d) == 1 ) {
			return b+c;
		}
		if (!p) {
			p=d*0.3;
		}
		if (!a || a < Math.abs(c)) {
			a = c;
			var s = p / 4;
		} else {
			var s = p/(2*Math.PI) * Math.asin (c/a);
		}
		return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
	},    
	elasticBoth: function(t, b, c, d, a, p){
		if (t === 0) {
			return b;
		}
		if ( (t /= d/2) == 2 ) {
			return b+c;
		}
		if (!p) {
			p = d*(0.3*1.5);
		}
		if ( !a || a < Math.abs(c) ) {
			a = c; 
			var s = p/4;
		}
		else {
			var s = p/(2*Math.PI) * Math.asin (c/a);
		}
		if (t < 1) {
			return - 0.5*(a*Math.pow(2,10*(t-=1)) * 
					Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
		}
		return a*Math.pow(2,-10*(t-=1)) * 
				Math.sin( (t*d-s)*(2*Math.PI)/p )*0.5 + c + b;
	},
	backIn: function(t, b, c, d, s){     //回退加速（回退渐入）
		if (typeof s == 'undefined') {
		   s = 1.70158;
		}
		return c*(t/=d)*t*((s+1)*t - s) + b;
	},
	backOut: function(t, b, c, d, s){
		if (typeof s == 'undefined') {
			s = 3.70158;  //回缩的距离
		}
		return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
	}, 
	backBoth: function(t, b, c, d, s){
		if (typeof s == 'undefined') {
			s = 1.70158; 
		}
		if ((t /= d/2 ) < 1) {
			return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
		}
		return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
	},
	bounceIn: function(t, b, c, d){    //弹球减振（弹球渐出）
		return c - Tween['bounceOut'](d-t, 0, c, d) + b;
	},       
	bounceOut: function(t, b, c, d){//*
		if ((t/=d) < (1/2.75)) {
			return c*(7.5625*t*t) + b;
		} else if (t < (2/2.75)) {
			return c*(7.5625*(t-=(1.5/2.75))*t + 0.75) + b;
		} else if (t < (2.5/2.75)) {
			return c*(7.5625*(t-=(2.25/2.75))*t + 0.9375) + b;
		}
		return c*(7.5625*(t-=(2.625/2.75))*t + 0.984375) + b;
	},      
	bounceBoth: function(t, b, c, d){
		if (t < d/2) {
			return Tween['bounceIn'](t*2, 0, c, d) * 0.5 + b;
		}
		return Tween['bounceOut'](t*2-d, 0, c, d) * 0.5 + c*0.5 + b;
	}
}