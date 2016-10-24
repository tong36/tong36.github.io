//'use strict';
function Init(){
	//每页显示的专辑数量
	this.n = 3;
	//当前显示第几页
	this.num = 0;
	//记录共几页
	this.page = 0;
	//记录当前语种的专辑信息
	this.data = null;
	//记录当前专辑的详细信息
	this.specialNow = null;
	this.ele = {};
	//分类nav
	this.ele.nav = $('.main .nav');
	this.ele.list = $('.main .special-list');
	this.ele.prev = $('.prev');
	this.ele.next = $('.next');
	//bottom nav
	this.ele.icoList = $('.main-bottom .ico-list');
	var _this = this;
	document.body.onmouseenter = function(){
		_this.ele.prev.addClass('show');
		_this.ele.next.addClass('show');
	}
	document.body.onmouseleave = function(){
		_this.ele.prev.removeClass('show');
		_this.ele.next.removeClass('show');
	}
	this.ele.prev.hover(function(){
		$(this).addClass('check');
	},function(){
		$(this).removeClass('check');
	})
	this.ele.next.hover(function(){
		$(this).addClass('check');
	},function(){
		$(this).removeClass('check');
	})
	this.ele.prev.click(function(){
		_this.num--;
		if(_this.num <= 0) _this.num = 0;
		_this.pagRender();
	})
	this.ele.next.click(function(){
		_this.num++;
		if(_this.num >= _this.page) _this.num = _this.page - 1;
		_this.pagRender();
	})
	this.ele.nav.click(function(ev){
		var items = $(this).find('.item');
		items.removeClass('check');
		$(ev.target).addClass('check');
		_this.num = 0;
		_this.ele.list.css('left',0);
		_this.render(ev.target.dataset.lon);
	})
}
var init = new Init;
//弹出层
var promt = new Promt;
Init.prototype.render = function(which){
	var URL = "./data/"+ which +".json",
	eleThis = this.ele.list,
	_this = this
	$.ajax({
		type:"get",
		url:URL,
		dataType:"json",
		context:eleThis,
		success:function(data){
			_this.data = data;
			var _html = '',
			_pagInner = ''
			eleThis.html('');
			_this.page = Math.ceil(data.length/_this.n)
			_this.ele.icoList.html('');
			$.each(data, function(key,value) {
				_html += `<li class="item">
					<div class="pic-box">
						<div class="mask"></div>
						<span class="ico bg"></span>
						<img class="img" src="${value.thumb}" alt="${value.name}" />
					</div>
					<dl class="info">
						<dt class="info-name">${value.name}</dt>
						<dd class="info-singer">${value.singer}</dd>
					</dl>
				</li>`;
			});
			eleThis.html(_html);
			var item = eleThis.find('.item');
			var w = parseFloat(item.css('width')) + 100;
			eleThis.css('width',w*data.length);
			item.click(function(){
				var index = item.index(this);
				_this.specialNow = _this.data[index];
				promt.show();
			})
			for (var i = 0; i < _this.page; i++) {
				if(i == _this.num){
					_pagInner += `<li class="item check">
						<span class="line"></span>
					</li>/n`
				}else{
					_pagInner += `<li class="item">
						<span class="line"></span>
					</li>/n`
				}
			}
			_this.ele.icoList.html(_pagInner);
			_this.ele.icoItems = _this.ele.icoList.find('.item');
			_this.ele.icoItems.click(function(){
				var index = _this.ele.icoItems.index(this);
				_this.num = index;
				_this.pagRender();
			})
		}
	});
}
Init.prototype.pagRender = function(){
	var _this = this;
	var L = _this.num * -1200;
	this.ele.list.animate({
		left:L
	},1000,'easeOutQuint')
	this.ele.icoItems.removeClass('check');
	this.ele.icoItems.eq(this.num).addClass('check');
}
init.render('cn');
//弹出层列表
function Promt(){
	var _this = this;
	this.timer = null;
	this.ele = {};
	//弹出层
	this.ele.promt = $('.special');
	//头部信息
	this.ele.thumb = $('#thumb');
	this.ele.specialName = $('#special-name');
	this.ele.singer = $('#singer');
	this.ele.genre = $('#genre');
	this.ele.language = $('#language');
	this.ele.publishTime = $('#publishTime');
	this.ele.company = $('#company');
	this.ele.type = $('#type');
	//歌曲列表
	this.ele.songList = $('.bottom-list .song-list');
	//隐藏按钮
	this.ele.hide = $('#hide');
	//提示框
	this.ele.tip = $('#tip');
	//播放全部按钮
	this.ele.playAll = $('#playAll');
	this.ele.hide.click(function(){
		_this.ele.promt.animate({
		height:'0'
	},500,'easeInCirc')
	})
}
Promt.prototype.render = function(){
	var data = init.specialNow,
	_this = this
	this.ele.thumb[0].src = data.thumb;
	this.ele.specialName.html(data.name);
	this.ele.singer.html(data.singer);
	this.ele.genre.html(data.info.genre);
	this.ele.language.html(data.info.language);
	this.ele.publishTime.html(data.info.publishTime);
	this.ele.company.html(data.info.company);
	this.ele.type.html(data.info.type);
	var _html = '';
	this.ele.songList.html('');
	for (var i = 0; i < data.list.length; i++) {
		_html += `<li class="song">
					<span class="num fl">${i+1}</span>
					<span class="song-name fl">
						<a href="#">${data.list[i].songname}</a>
					</span>
					<span class="singer-name fl">
						<a href="#">${data.list[i].singername}</a>
					</span>
					<span class="duration fl">${data.list[i].duration}</span>
					<span class="fun">
						<i class="play fl" title="播放">
							<span class="bg ico"></span>
						</i>
						<i class="add fr" title="添加到歌单">
							<span class="bg ico"></span>
						</i>
					</span>
				</li>`
	}
	this.ele.songList.html(_html);
	var plays = this.ele.songList.find('.play'),
	adds = this.ele.songList.find('.add')
	plays.click(function(){
		var index = plays.index(this);
		_this.addToPlayList(data.list[index],'play','item');
		
	})
	adds.click(function(){
		var index = adds.index(this);
		_this.addToPlayList(data.list[index],'add');
	})
	this.ele.playAll.click(function(){
		localStorage.removeItem('src');
		localStorage.setItem('play',0);
		for (var i = 0; i < data.list.length; i++) {
			_this.addToPlayList(data.list[i],'all');
		}
	})
}
Promt.prototype.show = function(){
	this.ele.promt.css('overflow','auto');
	this.ele.promt.animate({
		height:'100%'
	},500,'easeInCirc');
	this.render();
}
Promt.prototype.showTip = function(){
	var _this = this;
	this.ele.tip.addClass('show');
	clearTimeout(this.timer);
	this.timer = setTimeout(function(){
		_this.ele.tip.removeClass('show');
	},1000)
}
//检测是否已经开启过播放页面
Promt.prototype.isOpen = function(){
	var isOpen = localStorage.getItem('open');
	if(!isOpen){
		isOpen = 'open';
		window.open('play.html');
	}
}
//向llocalStorage中添加播放数据
Promt.prototype.addToPlayList = function(data,btn,info){
	this.showTip();
	var localSrc = localStorage.getItem('src');
	var arrSrc = [];
	if(localSrc){
		var localData = JSON.parse(localSrc);
		if(localSrc.indexOf(data.src) != -1){
			if(info == 'item' && btn == 'play'){
				for (var i = 0; i < localData.length; i++) {
					if(localData[i].src == data.src){
						localStorage.setItem('play',i);
					}
				}
			}
			return;
		}else{
			arrSrc = localData;
			arrSrc.push({
				songname:data.songname,
				singername:data.singername,
				duration:data.duration,
				src:data.src
			})
			localStorage.setItem('src',JSON.stringify(arrSrc));
			if(btn == 'play'){
				localStorage.setItem('play',arrSrc.length - 1);
			}
		}
	}else{
		arrSrc.push({
			songname:data.songname,
			singername:data.singername,
			duration:data.duration,
			src:data.src
		})
	localStorage.setItem('src',JSON.stringify(arrSrc));
	}
	if(info == 'all') localStorage.setItem('play',0);
	console.log(localStorage.getItem('play'))
	this.isOpen();
}
