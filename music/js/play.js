'use strict'
//监听关闭窗口操作，关闭时，清除localstorage中的open数据
window.onbeforeunload = function(){
	localStorage.removeItem('open');
}
//因为刷新操作会触发onbeforeunload事件，但关闭窗口不会触发onload事件
//在onload时判断localstorage open数据的状态设置该数据
window.onload = function(){
	if(!localStorage.getItem('open')){
		localStorage.setItem('open','open');
	}
	//监听localstorege的改变
	window.addEventListener('storage',storageChange)
	function storageChange(ev){
		if(ev.key == 'src'){
			init.data = JSON.parse(localStorage.getItem('src'));
			init.render();
		}
		if(ev.key == 'play'){
			player.num = parseFloat(localStorage.getItem('play'));
			console.log(player.num)
			player.autoPlay();
		}
	}
}

//初始化
function Init(){
	this.ele = {};
	this.ele.list = $('.song-info .song-list');
	this.ele.checkAll = $('#check-all');
	this.ele.del = $('#dele');
	//滚动条
	this.ele.bar = $('#bar');
	this.ele.box = $('.list-box');
	this.boxH = parseFloat(this.ele.box.css('height'));
}

var init = new Init;
var player = new Play;
var promt = new Promt;
//渲染列表
Init.prototype.render = function(){
	var _html = '';
	var _this = this;
	this.ele.list.html('');
	if(!localStorage.getItem('src')) return;
	this.data = JSON.parse(localStorage.getItem('src'));
	for (var i = 0; i < this.data.length; i++) {
		_html += `<li class="song-item list" data-mid="${i}">
					<button class="check-box"></button>
					<div class="song-name">
						<span class="num">${i + 1}</span>
						<span class="name">${this.data[i].songname}</span>
					</div>
					<div class="singer-name">${this.data[i].singername}</div>
					<div class="duration">${this.data[i].duration}</div>
					<div class="fun-class">
						<span class="play item fl" data-mid="${i}">
							<span class="ico bg"></span>
						</span>
						<span class="del item fr" data-mid="${i}">
							<span class="ico bg"></span>
						</span>
					</div>
				</li>`
	}
	this.ele.list.html(_html);
	//设置当前播放项的样式
	var nums = init.ele.list.find('.num');
	nums.removeClass('run');
	nums.eq(player.num).addClass('run');
	//设置滚动条的高度
	this.listH = parseFloat(this.ele.list.css('height'));
	if(this.listH > this.boxH){
		var h = this.boxH/this.listH * this.boxH + 'px';
		this.ele.bar.css('height',h);
	}else{
		this.ele.bar.css('height',0);
	}
	this.scroll(this.ele.bar[0],this.ele.box[0],this.ele.list[0],this.ele.box[0]);
	//播放按钮组
	var playBtns = this.ele.list.find('.play');
	playBtns.click(function(){
		player.num = parseFloat(this.dataset.mid);
		player.autoPlay();
	})
	//全选
	var checkBoxes = this.ele.list.find('.check-box');
	this.ele.checkAll.click(function(){
		var checkBoxes = _this.ele.list.find('.check-box');
		$(this).toggleClass('check');
		console.log(this);
		if($(this).hasClass('check')){
			checkBoxes.addClass('check');
		}else{
			checkBoxes.removeClass('check');
		}
	})
	checkBoxes.click(function(){
		$(this).toggleClass('check');
		var checkNum =_this.ele.list.find('.check').length;
		if(checkNum == _this.data.length){
			_this.ele.checkAll.addClass('check');
		}else{
			_this.ele.checkAll.removeClass('check');
		}
	})
	//点击删除
	this.ele.delBtns = this.ele.list.find('.del')
	this.ele.del.click(function(){
		var checks = _this.ele.list.find('.check');
		if(checks.length == 0){
			promt.tip();
		}else{
			promt.more = true;
			promt.show();
		}
	})
	this.ele.delBtns.click(function(){
		promt.single = true;
		promt.show(this);
	})
}
Init.prototype.scroll = function(scrollEle,scrollParent,targetEle,targetParent){
	var minT = 0;
	var maxT = scrollParent.offsetHeight - scrollEle.offsetHeight;
	scrollEle.onmousedown = function(e){
		var disX = e.clientX - scrollEle.offsetLeft;
		var disY = e.clientY - scrollEle.offsetTop;
		document.onmousemove = function(e){
			var T = e.clientY - disY;
			if(T < minT){
				T = minT;
			}else if(T > maxT){
				T = maxT;
			}
			scrollEle.style.top = T + 'px';
			targetEle.style.top = T/scrollParent.clientHeight * (targetParent.clientHeight - targetEle.offsetHeight) + 'px';
		}
		document.onmouseup = function(){
			document.onmousemove = null;
			document.onmouseup = null;
		}
		return false;
	}
	document.onmousewheel = mouseScroll;
	document.addEventListener('DOMMouseScroll',mouseScroll);
	if(scrollEle.offsetHeight == 0){
		document.onmousewheel = null;
		document.removeEventListener('DOMMouseScroll',mouseScroll);
		T = minT;
		scrollEle.style.top = T + 'px';
		targetEle.style.top = T/scrollParent.clientHeight * (targetParent.clientHeight - targetEle.offsetHeight) + 'px';
	}
	function mouseScroll(e){
		var flag = true;
		if(e.wheelDelta){
			flag = e.wheelDelta > 0 ? true : false;
		}else{
			flag = e.detail < 0 ? true : false;
		}
		var T = 10;
		if(flag){
			T = scrollEle.offsetTop - 10;
		}else{
			T = scrollEle.offsetTop + 10;
		}
		if(T < minT){
			T = minT;
		}else if( T > maxT ){
			T = maxT;
		}
		scrollEle.style.top = T + 'px';
		targetEle.style.top = T/(scrollParent.clientHeight - scrollEle.clientHeight) * (targetParent.clientHeight - targetEle.offsetHeight) + 'px';
		e.preventDefault();
        return false;
	}
}
Init.prototype.delMore = function(){
	var checks = this.ele.list.find('.check');
	//记录删除数据中id比当前播放曲目index小的数量,因为会影响播放顺序
	var m = 0;
	//记录当前播放曲目是否在删除行列中
	var onOff = false;
	for (var i = checks.length - 1; i >= 0 ; i--) {
		this.data.splice(parseFloat(this.ele.delBtns[i].dataset.mid),1);
		if(this.ele.delBtns[i].dataset.mid < player.num){
			m++;
		}
		if(this.ele.delBtns[i].dataset.mid == player.num){
			onOff = true;
		}
	}
	localStorage.setItem('src',JSON.stringify(this.data));
	player.num -= m;
	this.render();
	//如果当前播放曲目被删除,则重置播放
	if(onOff) player.autoPlay();
}
Init.prototype.delSingle = function(obj){
	var id = obj.dataset.mid;
	//记录删除项是否为当前播放项
	var onOff = id == player.num ? true : false;
	this.data.splice(id,1);
	localStorage.setItem('src',JSON.stringify(this.data));
	if(id < player.num) player.num--;
	this.render();
	if(onOff) player.autoPlay();
}

init.render();
//弹窗
function Promt(){
	var _this = this;
	this.timer = null;
	//记录删除单个
	this.single = false;
	//记录删除多个
	this.more = false;
	this.ele = {};
	this.ele.promt = $('#promt');
	this.ele.bg = $('#bg');
	this.ele.close = $('#promt .close');
	this.ele.yes = $('#yes');
	this.ele.no = $('#no');
	this.ele.tip = $('#tip');
	this.ele.yes.click(function(){
		if(_this.single){
			if(_this.which) init.delSingle(_this.which);
		}
		if(_this.more){
			init.delMore();
		}
		_this.hide();
	})
	this.ele.no.click(function(){
		_this.hide();
	})
	this.ele.close.click(function(){
		_this.hide();
	})
}
Promt.prototype.tip = function(){
	var _this = this;
	this.ele.tip.addClass('show');
	clearTimeout(this.timer);
	this.timer = setTimeout(function(){
		_this.ele.tip.removeClass('show');
	},2000)
}
Promt.prototype.show = function(obj){
	this.which = obj;
	this.ele.promt.css('display','block');
	this.ele.bg.css('display','block');
}
Promt.prototype.hide = function(){
	this.ele.promt.css('display','none');
	this.ele.bg.css('display','none');
	this.single = false;
	this.more = false;
}
//播放组
function Play(){
	var _this = this;
	//记录当前播放第几首歌
	this.num = 0;
	//记录当前播放歌曲信息
	this.total = 0;
	//记录定时器
	this.timer = null;
	this.ele = {};
	//播放按钮组
	this.ele.prev = $('.playbox .prev');
	this.ele.pause = $('.playbox .pause');
	this.ele.next = $('.playbox .next');
	//歌曲信息
	this.ele.songName = $('.playbox .progress-song-info');
	this.ele.singerName = $('.playbox .progress-singer-info');
	//当前播放时间与总时间
	this.ele.durationTime = $('#duration-time');
	this.ele.totalTime = $('#total-time');
	//播放进程
	this.ele.pro = $('.progress .pro');
	this.ele.lineDuration = $('#line-duration');
	this.ele.lineIco = $('#line-ico');
	//记录pro的宽度
	this.proW = parseFloat(this.ele.pro.css('width'));
	//声音组
	this.ele.volBox = $('#vol-box');
	this.ele.vol = $('#vol');
	this.ele.volDuration = $('#vol-duration');
	this.ele.volIco = $('#vol-ico');
	//记录声音条的宽度
	this.volW = parseFloat(this.ele.volBox.css('width'));
	//记录当前音量
	this.volume = 0;
	//audio
	this.ele.aud = $('#audio');
	//点击暂定按钮,根据class状态判断是播放还是暂停
	this.ele.pause.click(function(){
		$(this).toggleClass('play');
		if($(this).hasClass('play')){
			_this.ele.aud[0].pause();
		}else{
			_this.ele.aud[0].play();
		}
	})
	//点击上一曲
	this.ele.prev.click(function(){
		_this.num--;
		if(_this.num < 0) _this.num = init.data.length - 1;
		player.autoPlay();
	})
	//点击下一曲
	this.ele.next.click(function(){
		_this.next();
	})
	//播放完毕自动播放下一首
	this.ele.aud[0].onended = function(){
		_this.next();
	}
	//点击播放进程条
	this.ele.pro.click(function(ev){
		_this.clickSetProgress(ev);
	})
	//点击开关声音
	this.ele.vol.click(function(){
		$(this).toggleClass('mute');
		if($(this).hasClass('mute')){
			_this.ele.aud[0].volume = 0;
			_this.setVol(0);
		}else{
			_this.setVol(_this.volume);
		}
	})
	//点击设置声音
	this.ele.volBox.click(function(ev){
		_this.clickSetVol(ev);
	})
}
//下一首播放
Play.prototype.next = function(){
	this.num++;
	if(this.num >= init.data.length) this.num = 0;
	player.autoPlay();
}
//播放进程管理
Play.prototype.progress = function(){
	clearInterval(this.timer);
	var _this = this;
	this.timer = setInterval(function(){
		_this.setProInfo();
	},1000)
}
//具体进程内容设置
Play.prototype.setProInfo = function(){
	var currentTime = this.ele.aud[0].currentTime
		w = currentTime/this.total * this.proW,
		duration = this.timeStr(currentTime);
	this.ele.durationTime.html(duration);
	this.ele.lineDuration.css('width',w);
	this.ele.lineIco.css('left',w);
}
//点击设置播放进程
Play.prototype.clickSetProgress = function(ev){
	var x = this.ele.pro[0].getBoundingClientRect().left;
	var w = ev.clientX - x;
	this.ele.aud[0].currentTime = w/this.proW * this.total;
	this.setProInfo();
}
//拖拽改变播放进程
Play.prototype.drag = function(){
	var _this = this;
	var w = 0;
	var duration = 0;
	this.ele.lineIco.on('mousedown',function(){
		document.onmousemove = function(ev){
			var x = _this.ele.pro[0].getBoundingClientRect().left;
			w = ev.clientX - x;
			if(w <= 0) w = 0;
			if(w >= _this.proW) w = _this.proW;
			duration = _this.timeStr(w/_this.proW * _this.total);
			_this.ele.durationTime.html(duration);
			_this.ele.lineDuration.css('width',w);
			_this.ele.lineIco.css('left',w);
		}
		document.onmouseup = function(ev){
			_this.ele.aud[0].currentTime = w/_this.proW * _this.total;
			document.onmousemove = null;
			document.onmouseup = null;
		}
		return false;
	})
}
//设置播放组中的歌曲信息
Play.prototype.songInfo = function(){
	var totalTime = this.timeStr(this.total);
	this.ele.songName.html(init.data[this.num].songname);
	this.ele.singerName.html(init.data[this.num].singername);
	this.ele.totalTime.html(totalTime);
}
//设置播放组中的声音信息
Play.prototype.volInfo = function(num){
	this.volume = num;
	this.setVol(num);
}
//声音状态设置
Play.prototype.setVol = function(num){
	this.ele.aud[0].volume = num;
	var w = this.volW * num;
	this.ele.volDuration.css('width',w);
	this.ele.volIco.css('left',w);
}
//点击设置声音
Play.prototype.clickSetVol = function(ev){
	var x = this.ele.volBox[0].getBoundingClientRect().left;
	var w = ev.clientX - x;
	this.ele.aud[0].volume = w/this.volW;
	this.volInfo(w/this.volW);
}
//拖拽改变声音
Play.prototype.dragVol = function(ev){
	var _this = this;
	this.ele.volIco.on('mousedown',function(){
		document.onmousemove = function(ev){
			var x = _this.ele.volBox[0].getBoundingClientRect().left;
			var w = ev.clientX - x;
			if(w <= 0) w = 0;
			if(w >= _this.volW) w = _this.volW;
			var num = w/_this.volW;
			_this.volInfo(num);
		}
		document.onmouseup = function(){
			document.onmousemove = null;
			document.onmouseup = null;
		}
		return false;
	})
}
//时间处理
Play.prototype.timeStr = function(time){
    var m = 0,
    s = 0,
    _m = '00',
    _s = '00';
    time = Math.floor(time % 3600);
    m = Math.floor(time / 60);
    s = Math.floor(time % 60);
    _s = s < 10 ? '0' + s : s + '';
    _m = m < 10 ? '0' + m : m + '';
    return _m + ":" + _s
}
//更新当前播放的src等歌曲信息
Play.prototype.autoPlay = function(){
	var _this = this;
	console.log(init.data[this.num])
	this.ele.aud[0].src = init.data[this.num].src;
	//更新歌曲列表当前播放项
	var nums = init.ele.list.find('.num');
	nums.removeClass('run');
	nums.eq(this.num).addClass('run');
	this.ele.aud[0].onloadeddata = function(){
		_this.songInfo();
		_this.progress();
		_this.total = _this.ele.aud[0].duration;
	}
}
//初始化播放
player.autoPlay();
player.volInfo(0.5);
player.drag();
player.dragVol();
