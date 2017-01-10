var main = $('.main');
var box = $('.box');
var next = $('#next');
var mask = $('#mask');
var head = $('#head');
var canvas = $('.twinkle canvas');
var h = window.innerHeight;
var w = window.innerWidth;


var screens = $('.box .screen');
var boxH = screens.length * h;
	
//初始化宽高设置
init()
window.onresize = init;
function init(){
	main.css('height',h);
	canvas.css({
		width:w,
		height:h
	})
	canvas.attr('width',w);
	canvas.attr('height',h);
	box.css('height',boxH);
	screens.css('height',h);
}
//图片预加载
var arr = 'img/1.jpg|img/2.jpg|img/3.jpg|img/3_1.png|img/3_2.png|img/3_logo.png|img/4.jpg|img/4_1.png|img/4_2.png|img/5.jpg|img/5_2.png|img/5_4.png|img/5_pointer.png|img/b1.png|img/code.jpg|img/header_pointer.png|img/i1.png|img/i1_2.png|img/i2.png|img/i2_2.png|img/i3.png|img/i3_2.png|img/i4.png|img/left-nav.png|img/loading.gif|img/logo-quan.png|img/logo-shadow.png|img/logo.png|img/logocenter.png|img/nav-quan2.png|img/pointer.png|img/quan.png|img/right-nav.png'.split('|');
var picLoad = new Image();
var loadNum = 0;
imgGo();
picLoad.src = arr[loadNum];
function imgGo(){
	picLoad.onload = function(){
		loadNum++;
		picLoad.src = arr[loadNum];
		if(loadNum == arr.length - 1){
			mask.addClass('hide');
			head.addClass('show');
			main.addClass('show');
			firstMove();
			return;
		};
		imgGo();
	}
}

//定义全局变量记录当前为第几屏
var num = 0;
//定义全局变量记录运动状态
var onOff = true;

//设置nextico的点击事件
next.click(function(){
	num++;
	screenTo();
})

//点击ico导航
var icos = $('.ico-nav li');
icos.click(function(){
	//记录num值为当前点击的索引值
	num = icos.index(this);
	//条用函数显示第num个屏
	screenTo();
})

//滚动滚动条时
document.addEventListener('DOMMouseScroll',scroll);
document.onmousewheel = scroll;
//鼠标滚轮滚动函数
function scroll(ev){
	if(onOff) return;
	onOff = true;
	var e = ev || event;
	//定义变量记录滚动状态，向上滚为true
	var flag = null;
	//设置向上滚为true，向下为false
	if(e.wheelDelta){
		flag = e.wheelDelta > 0 ? true:false;
	}else{
		flag = e.detail < 0 ? true:false;
	}
	//根据flag的状态即上滚还是下滚确定num自增还是自减
	if(flag){
		num--;
	}else{
		num++;
	}
	//限制num的范围
	num = num < 0 ? 0 : num;
	num = num >= icos.length ? (icos.length-1) : num;
	//调用函数，根据num值显示不同的屏幕
	screenTo();
	//清除默认样式
	e.preventDefault();
	return false;
}

//显示第几屏
function screenTo(){
	//清空所有ico的class
	icos.removeClass('check');
	//设置当前ico的class为check
	icos.eq(num).addClass('check');
	//根据num值设置屏幕盒子的top值，box运动完后再根据num值来调用不同的函数来运动不同屏的动画
	box.animate({
		top:-num * h
	},500,'easeInOutCubic',function(){
		switch (num){
			case 0:
				firstMove()
				break;
			case 1:
				secondMove()
				break;
			case 2:
				thirdMove();
				break;
		}
	})
	//当num为最大值即显示最后一屏时，将下一张按钮隐藏，否则显示
	if(num == icos.length - 1){
		next.css('display','none');
	}else{
		next.css('display','block');
	}
	
}

//头部
var items = $('.nav .item');
var navBg = $('.nav .bg-nav')
//获取第一个item的宽度
var originW = items.eq(0).css('width');
//初始化navbg的宽度为第一个item的宽度
navBg.css('width',originW)
//鼠标移入item
items.mouseover(function(ev){
	//记录当前移入item的宽度
	var w = $(this).css('width');
	//记录当前移入item的offsetleft
	var l = this.offsetLeft;
	//设置bg的left和width
	navBg.css({
		left:l,
		width:w
	});
})
//鼠标移出nav时，bg回到最初位置
$('.nav').mouseleave(function(){
	navBg.css({
		left:0,
		width:originW
	});
})
//第一屏动画
function firstMove(){
	var center = $('.first-screen .center')
	var bg = $('.first-screen .bg');
	var shadow = $('.first-screen .shadow');
	//动画开始时取消center的transition，同时设置opacity为0隐藏center
	center.css({
		transition:'0s',
		opacity:0
	});
	//设置bg的top值，隐藏bg
	bg.css('top','-999px');
	//隐藏shadow通过opacity
	shadow.css('opacity',0);
	//设置背景的显示动画，运动完后，显示center和bg，同时设置全局变量onOff的值为false
	bg.animate({
		top:0
	},1000,'easeOutBack',function(){
		center.css({
			transition:'1s',
			opacity:1
		});
		shadow.css('opacity',1);
		onOff = false;
	})
}
//第二屏动画
function secondMove(){
	var screenS = $('.second-screen');
	var item = $('.second-screen li');
	var timer1 = null;
	var timer2 = null;
	item.css({
		transition:'0s',
		opacity:0,
		top:-70
	});
	
	item.eq(0).animate({
		top:0,
		transition:'1s',
	},200,'easeOutBack',function(){
		item.eq(0).css({
			opacity:1,
		});
	})
	
	item.eq(1).animate({
		top:0,
		transition:'1s',
	},600,'easeOutBack',function(){
		item.eq(1).css({
			opacity:1,
		});
		
	})
	
	item.eq(2).animate({
		top:0,
		transition:'1s',
	},800,'easeOutBack',function(){
		item.eq(2).css({
			opacity:1,
		});
		
	})
	
	item.eq(3).animate({
		top:0,
		transition:'1s',
	},1000,'easeOutBack',function(){
		item.eq(3).css({
			opacity:1,
		});
		onOff = false;
	})
	var cons = $('.second-screen .container');
	cons.mouseenter(function(){
		var num = cons.index(this);
		var infos = $('.second-screen .info');
		if(item[num].className.indexOf('check') !== -1) return;
		item.removeClass('check');
		item.eq(num).addClass('check');
		infos.css({
			visibility: 'hidden',
			opacity:0,
			bottom:-100
		})
		infos.eq(num).css('visibility','visible');
		infos.eq(num).animate({
			opacity:1,
			bottom:-70
		},800)
		switch (num){
			case 0:
				firstBg();
				break;
			case 1:
				secondBg();
				break;
			case 2:
				thirdBg();
				break;
			case 3:
				forthBg();
				break;
		}
	})
	var bgs = $('.second-screen .bg-box');
	function firstBg(){
		screenS.css('background-image','url(img/1.jpg)');
		bgs.css('display','none');
	}
	function secondBg(){
		screenS.css('background-image','url(img/2.jpg)');
		bgs.css('display','none');
		bgs.eq(0).css('display','block');
		bgs.eq(1).css('display','block');
		var oldX = 0;
		document.onmousemove = function(ev){
			var e = ev || event;
			var nowX = e.clientX;
			var oldOneL = bgs[0].offsetLeft;
			var oldTwoL = bgs[1].offsetLeft;
			bgs.eq(0).css({
				left:oldOneL + (nowX - oldX)
			})
			bgs.eq(1).css({
				left:oldTwoL - (nowX - oldX)
			})
			oldX = e.clientX;
		}
	}
	function thirdBg(){
		screenS.css('background-image','url(img/3.jpg)');
		bgs.css('display','none');
		bgs.eq(2).css('display','block');
	}
	function forthBg(){
		screenS.css('background-image','url(img/4.jpg)');
		bgs.css('display','none');
		bgs.eq(3).css('display','block');
		bgs.eq(4).css('display','block');
		var oldX = item[3].offsetLeft;
		document.onmousemove = function(ev){
			var e = ev || event;
			var nowX = e.clientX;
			var oldOneL = bgs[3].offsetLeft;
			if(nowX - oldX > 0){
				bgs.eq(3).css({
					left:oldOneL - 1
				})
			}else{
				bgs.eq(3).css({
					left:oldOneL + 1
				})
			}
			oldX = nowX;
		}
	}
}
var timer3 = null;
//第三屏动画
function thirdMove(){
	var poins = $('.third-screen .point');
	var contentItems = $('.third-screen .content-item');
	var infoItems = $('.third-screen .fo-item');
	poins.addClass('show');
	setTimeout(function(){
		onOff = false;
	},1200)
	clearInterval(timer3);
	timer3 = setInterval(function(){
		changeClass(contentItems.eq(0));
		changeClass(contentItems.eq(1));
		changeClass(infoItems.eq(0));
		changeClass(infoItems.eq(1));
	},5000)
//	canMove();
}
function canMove(){
	jc.start('star');
	var imageData = jc.imageData(w,h);
	for (var i = 0; i < w; i++) {
		for (var j = 0; j < h.length; j++) {
			var l = Math.floor(Math.random()*w);
			imageData.setPixel()
		}
	}
	jc.start('star');
}
function changeClass(obj){
	if(obj[0].className.indexOf('in') !== -1){
		obj.removeClass('in');
		obj.addClass('state');
	}else if(obj[0].className.indexOf('state') !== -1){
		obj.removeClass('state');
		obj.addClass('out');
		setTimeout(function(){
			obj.removeClass('out');
			obj.addClass('in');
		},1500)
	}
}

