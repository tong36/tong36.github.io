function Getmusic($fm) {
	this.$fm = $fm;
	this.init();
	this.bind();
}
Getmusic.prototype.init = function() {
	this.$change_list = this.$fm.find('.change_list');
	this.$song = this.$fm.find('.song');
	this.$singer = this.$fm.find('.singer');
	this.$song_img = this.$fm.find('.song_img');
	this.$audio = this.$fm.find('audio');
	this.Audio = this.$audio[0];
	this.$play = this.$fm.find('.play');
	this.channelId = 'public_tuijian_spring';
	this.$point = this.$fm.find('#point');
	this.$prev = this.$fm.find('.prev');
	this.$next = this.$fm.find('.next');
	this.$panel = this.$fm.find('.panel');
	this.$lyrics = this.$fm.find('.lyrics');
	this.$lyric_btn = this.$fm.find('#lyric_btn');
	this.$rotor = this.$fm.find('.rotor');
	this.$lyric_p = this.$fm.find('.lyric_p');
	this.$sm_box = $('.sm_box')
	this.isLyric = false;
	this.isplay = false;
	this.songLyricId = '';
	this.SongArray = [];
	this.lyricTimeArray = [];
	this.currentTime = 0;
}
Getmusic.prototype.bind = function() {
	this.ready();
	this.getsong(this.channelId);
	this.styleChance();
	this.play();
	this.prev();
	this.next();
	this.lyric();
	this.rotor();
	this.timeUpdate();
	this.end();
}
Getmusic.prototype.ready = function() {
	var _this = this;
	this.$fm.ready(function() {
		$.get('http://api.jirengu.com/fm/getChannels.php')
			.done(function(result) {
				var resultArr = JSON.parse(result).channels;
				for(var i = 0; i < resultArr.length; i++) {
					var channel_id = resultArr[i].channel_id;
					var channel_name = resultArr[i].name;
					var html = '<li class="list_li" channel-id=\"' + channel_id + '\" >' + channel_name + '</li>';
					_this.$change_list.append(html);
				}
			})
	})
}
Getmusic.prototype.getsong = function(str) {
	var _this = this;
	$.get('http://api.jirengu.com/fm/getSong.php', {
		channel: str
	})
	.done(function(song) {
		_this.song = JSON.parse(song).song[0];
		_this.panelreset(_this.song);
		_this.songLyricId = _this.song.sid;
		_this.SongArray.push(_this.song);
		_this.getLyric();
	})
}
Getmusic.prototype.getLyric = function() {
	var _this = this;
	$.post('http://api.jirengu.com/fm/getLyric.php', {
		sid: this.songLyricId
	})
	.done(function(lyric) {
		_this.lyric = JSON.parse(lyric).lyric;
		$('.lyric_p>p').remove();
		_this.lyricTimeArray = [];
		_this.lyricFormat(_this.lyric);
	})
}
Getmusic.prototype.lyricFormat = function(str) {
	var html = '';
	var lyricArray = str.split('\n');
	for(var i = 0; i < lyricArray.length; i++) {
		var lyric = lyricArray[i].slice(10,48);
		if(!lyric) lyric = '-';
		html += '<p class=' + '\"lyric' + i + '\">' + lyric + '</p>';
		this.lyricTimeFormat(lyricArray[i]);
	}
	this.$lyric_p.append(html);
}
Getmusic.prototype.lyricTimeFormat = function(str) {
	var min = parseFloat(str.slice(1,3));
	var sec = Math.round(min * 60 + parseFloat(str.slice(4,9)));
	this.lyricTimeArray.push(sec);
}
Getmusic.prototype.timeUpdate = function() {
	var _this = this;
	this.$audio.on('timeupdate', function() {
		if(_this.currentTime != Math.round(_this.Audio.currentTime)) {
			_this.currentTime = Math.round(_this.Audio.currentTime);
			_this.lyric_p(_this.currentTime);
		}
	})
}
Getmusic.prototype.lyric_p = function(num) {
	for(var i  = 1; i < this.lyricTimeArray.length; i++) {
		if(num === this.lyricTimeArray[i]) {
			var top = 80 - i * 40 + 'px';
			var pClass = '.lyric' + i;
			$(pClass).siblings().removeClass('p_lyric');
			$(pClass).addClass('p_lyric');
			this.$lyric_p.animate({
				top: top
			},500);
		}
	}
}
Getmusic.prototype.panelreset = function(song) {
	this.$song.html(song.title);
	this.$singer.html(song.artist);
	this.$song_img.attr('src',song.picture);
	this.Audio.src = song.url;
}
Getmusic.prototype.styleChance = function() {
	var _this = this;
	this.$change_list.on('click','li',function(e) {
		_this.$change_list.children().removeClass('li_selected');
		$(this).addClass('li_selected');
		_this.channelId = $(this).attr('channel-id');
		_this.Audio.pause();
		_this.canplay();
		_this.rotor();
		_this.point();
		_this.SongArray = [];
		_this.getsong(_this.channelId);
	})
}
Getmusic.prototype.play = function() {
	var _this = this;
	this.$play.on('click', function() {
		if(_this.Audio.paused) {
			_this.Audio.play();
//			_this.$play.removeClass('fa-play').addClass('fa-pause')
			_this.point()
		}else{
			_this.Audio.pause();
//			_this.$play.removeClass('fa-pause').addClass('fa-play')
			_this.point()
		}
	})
}
Getmusic.prototype.point = function() {
	if(this.Audio.paused) {
		this.$point.addClass('point_pause');
		this.$play.removeClass('fa-pause').addClass('fa-play');
	}else{
		this.$point.removeClass('point_pause');
		this.$play.removeClass('fa-play').addClass('fa-pause');
	}
}
//上一曲
Getmusic.prototype.prev = function() {
	var _this = this;
	this.$prev.on('click', function() {
		_this.getsong(_this.channelId);
		_this.canplay();
	})
	this.$prev.on('mousedown', function() {
		_this.Audio.pause();
		_this.point();
	})
}
//下一曲
Getmusic.prototype.next = function() {
	var _this = this;
	this.$next.on('click', function() {
		_this.getsong(_this.channelId);
		_this.canplay();
	})
	this.$next.on('mousedown', function() {
		_this.Audio.pause();
		_this.point();
	})
}
Getmusic.prototype.canplay = function() {
	var _this = this;
	this.$audio.on('canplay', function() {
		_this.Audio.play();
		_this.point();
	})
}
Getmusic.prototype.lyric = function() {
	var _this = this;
	this.$lyric_btn.on('click', function() {
		if(!_this.isLyric) {
			$(this).removeClass('fa-toggle-off').addClass('fa-toggle-on');
			_this.$panel.addClass('dn');
			_this.$lyrics.removeClass('dn');
			_this.isLyric = !_this.isLyric;
		}else{
			_this.$panel.removeClass('dn');
			_this.$lyrics.addClass('dn');
			_this.isLyric = !_this.isLyric;
			$(this).removeClass('fa-toggle-on').addClass('fa-toggle-off');
		}
	})
}
//黑胶唱片大转盘
Getmusic.prototype.rotor = function() {
	var _this = this;
	_this.$audio.on('play', function() {
		_this.$rotor[0].style.animationPlayState = 'running';
		_this.$sm_box[0].style.animationPlayState = 'running';
		_this.$point.removeClass('point_pause');
		_this.$play.removeClass('fa-play').addClass('fa-pause');
	})
	_this.$audio.on('pause', function() {
		_this.$rotor[0].style.animationPlayState = 'paused';
		_this.$sm_box[0].style.animationPlayState = 'paused';
		_this.$point.addClass('point_pause');
		_this.$play.removeClass('fa-pause').addClass('fa-play');
	})
}
Getmusic.prototype.end = function() {
	var _this = this;
	this.$audio.on('ended', function() {
		_this.point();
		_this.getsong(_this.channelId);
		_this.canplay();
	})
}
