// DOM加载完成
function ready(fn){
	document.addEventListener('DOMContentLoaded',function(){
		if(fn && Object.prototype.toString.call(fn) === '[object Function]'){
			fn();
		}
	},false)	
}

// 获取可视区域高度
function view(){
	return{
		W:document.documentElement.clientWidth,
		H:document.documentElement.clientHeight
	}
}

function offsetL(obj){
	var left = 0
	while( obj ){
		left += obj.offsetLeft  
		obj = obj.offsetParent
	}
	return left
}

// (function() {
//     var lastTime = 0;
//     var vendors = ['webkit', 'moz'];
//     for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
//         window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
//         window.cancelAnimationFrame =
//           window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
//     }

//     if (!window.requestAnimationFrame)
//         window.requestAnimationFrame = function(callback, element) {
//             var currTime = new Date().getTime();
//             var timeToCall = Math.max(0, 16 - (currTime - lastTime));
//             var id = window.setTimeout(function() { callback(currTime + timeToCall); },
//               timeToCall);
//             lastTime = currTime + timeToCall;
//             return id;
//         };

//     if (!window.cancelAnimationFrame)
//         window.cancelAnimationFrame = function(id) {
//             clearTimeout(id);
//         };
// }());