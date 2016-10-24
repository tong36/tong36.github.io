ready(function(){
	var contentWrap = document.querySelector('.content-wrap')
	var headerWrap = document.querySelector('.header-wrap')
	var oulWrap = document.querySelector('.ul-wrap')
	var phoneColor = document.getElementById('oUl')
	var phoneLi = phoneColor.getElementsByTagName('li') 
	var phoneImg = phoneColor.getElementsByTagName('img') 
	var bannerText = document.querySelector('.banner-text')

	// set首屏height
	changeHeight();
	function changeHeight(){
		var headerH = headerWrap.offsetHeight
		contentWrap.style.height = view().H  - headerH + "px";
	}

	window.onresize = changeHeight;

	for (var i = 0; i < phoneLi.length; i++) {
		phoneImg[i].index = i
		phoneLi[i].style.width = (view().W / 7 / view().W) * 100 + '%'
	}

	var l = phoneColor.offsetWidth / 7 * 5

	var timer = null
	var clientX = 0		

	function moveFn(ev){
		var middle,distance,t
		var ev = ev || event
		clientX = ev.clientX;
		cancelAnimationFrame(timer);
		timer = requestAnimationFrame(function (){
			for (var i = 0; i < phoneImg.length; i++) {
				middle = phoneLi[i].offsetLeft + phoneLi[i].offsetWidth/2; 
				distance = Math.abs( middle - clientX )
				if( distance > l ){ distance = l}  
				var scale = Math.abs( distance/l )
				t = 0;
				t = Math.abs(scale)*60; 
				phoneImg[i].style.cssText = '-webkit-transform: translate3d(0, '+t+'%, 0); transform: translate3d(0,'+t+'%, 0);';
			}
		})
	}

	function outFn(){
		cancelAnimationFrame(timer);
		for( var i = 0; i < phoneImg.length; i++ ){
			phoneImg[i].removeAttribute( "style" )	
		}
	}

	phoneColor.onmousemove = moveFn
	phoneColor.onmouseout = outFn

	var onOff = true

	phoneColor.onclick = function (ev){
		var e = ev || event;
		
		if( onOff ){
			var target = e.target;
			if( target.nodeName === "LI" && (  target = e.target.children[0] ), target.nodeName === "IMG"  ){

				oulWrap.id = "abc";
				var o = target.parentNode.offsetLeft + target.parentNode.offsetWidth / 2;
				o = view().W / 2 - o, 
				
				phoneColor.style.cssText = "-webkit-transform : translate3d(" + 2.6 * o + "px, 0, 0) scale(2);transform : translate3d(" + 2.6 * o + "px, 0, 0) scale(2.6)";

				for( var i = 0; i < phoneImg.length; i++ ){
					    phoneImg[i].style.cssText = '-webkit-transition: -webkit-transform .4s cubic-bezier(0.445, 0.05, 0.55, 0.95); transition:transform .4s cubic-bezier(0.445, 0.05, 0.55, 0.95)';
					    if( i < target.index ){
					    	phoneImg[i].parentNode.className = "prev";
					    }else if( i > target.index ){
					    	phoneImg[i].parentNode.className = "next";
					    }
				}
				console.log( target.index )
				target.parentNode.className = "lager";
				
				bannerText.style.transform =  'scale(0)'
				phoneColor.onmousemove = phoneColor.onmouseout = null;
			};
			onOff = false;
			console.log(onOff)
		}else{

			phoneColor.removeAttribute("style");
			oulWrap.id = "";

			for( var i = 0; i < phoneImg.length; i++ ){
				phoneImg[i].parentNode.className = "";
			}

			setTimeout(function (){
				phoneColor.onmousemove = moveFn;
				phoneColor.onmouseout = outFn;
				onOff = true;
			},300)
			bannerText.style.transform =  'scale(1)'
		}		
	}

	var headerMain = document.querySelector('.header-main')
	var breadcrumb = document.querySelector('.breadcrumb')
	var container = document.querySelector('.container')

})