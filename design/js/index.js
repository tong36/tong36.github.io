ready(function(){

	var winW=document.documentElement.clientWidth;	//可视区的宽度
	var winH=document.documentElement.clientHeight;	//可视区的高度
	var cenWinW=winW/2;		//可视区一半的宽度
	var cenWinH=winH/2;		//可视区一半的高度
	var slide=document.getElementsByClassName('slide');	//获取所有的slide
	var personFixed=document.getElementsByClassName('personFixed')[0];	//获取第二部分的伞
	
	//获取所有的相对位置并存入数组
	var aPos=[];	
	for(var i=0;i<slide.length;i++){
		aPos.push(getPos(slide[i]));
	}
	//第一屏
	move(slide[0]);
	
	//第二屏
	var list=slide[1].getElementsByClassName('list')[0];
	
	var ol=document.createElement('ol');
	var html='';
	listData.forEach(function(elem,i){
		html+='<li>\
					<span>'+ elem.time +'</span>\
					<div class="txt">\
						<p>'+ elem.content1 +'</p>\
						<p>'+ elem.content2 +'</p>\
					</div>\
				</li>';
	});
	ol.innerHTML=html;
	list.appendChild(ol);

	var lis=list.querySelectorAll('li');
	var slideTop2=aPos[1].t;
	

	//第三屏
	var seesaw = slide[2].getElementsByClassName('seesaw')[0];
	var infos = slide[2].querySelectorAll('div[class^="infor"]');
	var seesawImg = slide[2].querySelector('.seesawImg');
	var clicks = seesawImg.querySelectorAll('span[class^="click"]');
	console.log(clicks);
	var onOff=true;
	//给中间的跷跷板添加点击事件
	seesawImg.addEventListener('click',function(){
		onOff?addClass('toggle',seesaw):removeClass('toggle',seesaw);
	
		if(onOff){
			addClass('fadeInUp',infos[1]);
			removeClass('fadeInUp',infos[0]);
			addClass('click',seesawImg);
			removeClass('click2',seesawImg);
		}else{
			addClass('fadeInUp',infos[0]);
			removeClass('fadeInUp',infos[1]);
			addClass('click2',seesawImg);
			removeClass('click',seesawImg);
		}
		onOff=!onOff;
	},false);
	
	move(slide[2]);
	
	//第四屏
	//获取第四屏元素
	var skillLis=slide[3].querySelectorAll('.skill li');
	var slideTop4=aPos[3].t;
	var worksListBtns=slide[3].querySelectorAll('.worksList a');
	var worksBox=slide[3].querySelector('.worksBox');
	var worksBoxUl=slide[3].querySelector('.worksBox ul');
	var worksLis=worksBoxUl.getElementsByTagName('li');
	var scroll=worksBox.getElementsByClassName('scroll')[0];
	var scrollSpan=scroll.getElementsByTagName('span')[0];
	var lastBtn=worksListBtns[0];
	
	//添加数据
	var html='';
	for(var i=0;i<worksData.length;i++){
		html+='<li>\
				<a href="'+ worksData[i].link +'" target="_blank"></a>\
				<img src="'+ worksData[i].img +'" alt="" draggable="false" />\
				<div class="txt">\
					<p>'+ worksData[i].text +'</p>\
					<a href="'+ worksData[i].link +'" target="_blank"></a>\
				</div>\
			</li>';
	}
	worksBoxUl.innerHTML=html;

	var liW=worksLis[0].offsetWidth;	//一个li的宽度
	var worksBoxW=worksBox.offsetWidth;
	var iMarginR=parseInt(css(worksLis[0],'marginRight'));	//margin-right
	var len=worksLis.length;
	
	//设置ul的宽度和滑块的宽度
	worksBoxUl.style.width=(iMarginR+liW)*len+'px';
	var ulW=worksBoxUl.offsetWidth;
	
	//滑块的宽度
	scrollSpan.style.width= (worksBoxW*worksBoxW)/ulW +'px';

	//滑动的最大距离
	var spanMax=worksBoxW-scrollSpan.offsetWidth;

	//滑动的距离
	var liMax=ulW-worksBoxW;
	var leftNum=0;
	
	//自定义滑动
	scrollSpan.onmousedown=function(ev){
		var ev=ev||event;
		var disX=ev.clientX-this.offsetLeft;
		
		document.addEventListener('mousemove',downHandle);
		function downHandle(ev){
			var ev=ev||event;
			leftNum=ev.clientX-disX;			
			slideTo();	
		}
		document.addEventListener('mouseup',function(){
			document.removeEventListener('mousemove',downHandle);
		});
		return false;
	}
	//滚轮控制
	mScroll(worksBox,function(){
		//往上滚动
		leftNum-=10;
		slideTo();
	},function(){
		//往下滚动
		leftNum+=10;
		slideTo();
	});
	//当ulW的宽度小于worksBoxW的时候，滑块隐藏和鼠标滚轮事件取消
	if(ulW<worksBoxW){
		scroll.style.display="none";
		mScroll(worksBox);
	}
	
	function slideTo(){
		if(leftNum<=0){
			leftNum=0;
		}else if(leftNum>=spanMax){
			leftNum=spanMax;
		}
		var scale=leftNum/spanMax;
		scrollSpan.style.left=leftNum+'px';
		worksBoxUl.style.left= -scale*liMax +'px';
	}
	
		
	//第五屏
	move(slide[4]);
	
	
	//右侧点击
	//获取元素
	var menu=document.querySelector('.menu');
	var menuStr='';
	for(var i=0;i<slide.length;i++){
		menuStr+='<a class="'+ (i?'':'active') +'" href="javascript:;" data-index="'+ i +'"></a>';
	}
	//生成点击并且获取
	menu.innerHTML=menuStr;
	var as=menu.getElementsByTagName('a');
	
	//给menu添加点击事件
	menu.addEventListener('click',function(ev){
		var ev=ev||event;
		var target=ev.target || ev.srcElement;
		
		if(target.nodeName.toLowerCase() === 'a'){
			//如果点击的是当前的则跳出
			if(target.className) return;
			//清除所有的class
			for(var i=0;i<as.length;i++){
				as[i].className='';
			}
			//给当前的目标点添加class
			target.className='active';
			//获取滚动条的距离
			var scrollPos=document.documentElement.scrollTop || document.body.scrollTop;
			//点击当前按钮的高度
			var t=aPos[target.dataset.index].t;

			//添加定时器，设置滚动条的高度
			var timer=setInterval(function(){
				//当scrollPos>t的时候，说明滚动条要往上移动
				if(t<scrollPos){
					scrollPos-=30;
					window.scrollTo(0,scrollPos);
					if(scrollPos<=t){
						window.scrollTo(0,t);
						clearInterval(timer);
					}
				}else{
					//否则往下移动
					scrollPos+=30;
					window.scrollTo(0,scrollPos);
					if(scrollPos>=t){
						window.scrollTo(0,t);
						clearInterval(timer);
					}
				}

			},16);

		}
	},false);
	
	//滚轮滑动
	window.addEventListener('scroll',function(){
		//滚轮距离
		var scrollTop=(window.pageYOffset || document.documentElement.scrollTop)+cenWinH;
		//console.log(scrollTop);
		//设置personFixed的高度
		personFixed.style.top=scrollTop-cenWinH/2+'px';
		
		//处理第二屏
		if(scrollTop>=slideTop2-cenWinH){
			for(var i=0;i<lis.length;i++){
				//给每一个li添加class
				setTimeout(function(i){
					addClass('on',lis[i]);
				},800*i,i);
			}
		}
		//处理第四屏
		var num=0;
		if(scrollTop>=slideTop4-cenWinH){
			var timer2=setInterval(function(){
				addClass('fadeIn',skillLis[num]);
				num++;
				if(num>=skillLis.length){
					clearInterval(timer2);
				}
			},500);
		}

		//当滚动条变化的时候，给menu中的a添加class
		for(var i=0,len=aPos.length;i<len;i++){
			as[i].className='';
			
			if(scrollTop>=aPos[i].t&& aPos[i+1] &&scrollTop<aPos[i+1].t){
				as[i].className='active';
			}else if(scrollTop>=aPos[i].t){
				as[len-1].className='active';
			}
		}
	
	},false);
	

	//跟随鼠标的运动
	function move(obj){
		var moves=getByClass('move',obj);
		obj.addEventListener('mousemove',function(ev){
			var ev=ev||event
			for(var i=0;i<moves.length;i++){
				var offset=moves[i].dataset.offset/100;
				css(moves[i],'transform','translate('+ (cenWinW-ev.clientX)*offset +'px,'+ (cenWinH-ev.clientY)*offset +'px)');	
			}		
		},false);
	}
	
	
});




