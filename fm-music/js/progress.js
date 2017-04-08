function Progress($fm) {
	this.$fm = $fm;
	this.init();
	this.bind();
}
Progress.prototype.init = function() {
	this.$audio = this.$fm.find('audio');
	this.Audio = this.$audio[0];
	this.$rate_begin = this.$fm.find('.rate_begin');
	this.$rate_end = this.$fm.find('.rate_end');
	this.$rate_line = this.$fm.find('.rate_line');
	this.$rate_line_begin = this.$fm.find('.rate_line_begin');
	this.$rate_line_end = this.$fm.find('.rate_line_end');
	this.$progressPoint = this.$fm.find('.rate_line_point');
	this.progressPoint = this.$progressPoint.draggabilly({
		axis: 'x',
		containment: true
	})
}
Progress.prototype.bind = function() {
	this.drag();
	this.play();
	this.timeFormat();
	this.initTime();
	this.click();
}
//拖拽进度
Progress.prototype.drag = function() {
	var _this = this;
	this.progressPoint.on('dragMove', function() {
		var width = $(this).data('draggabilly').position.x + 'px';
		_this.$rate_line_end.css('width',width);
	})
	this.progressPoint.on('dragStart', function() {
		_this.Audio.pause();
	})
	this.progressPoint.on('dragEnd', function() {
		_this.Audio.play();
		_this.Audio.currentTime = $(this).data('draggabilly').position.x / 164 * _this.Audio.duration;
	})
}
//自动播放
Progress.prototype.play = function() {
	var _this = this;
	this.$audio.on('play', function() {
		var fullTime = parseInt(_this.Audio.duration);
		_this.time = setInterval(function() {
			var width = parseInt(_this.Audio.currentTime / fullTime * 164) + 'px';
			_this.$rate_line_end.css('width',width);
			_this.$progressPoint.css('left',width);
			_this.$rate_begin.text(_this.timeFormat(_this.Audio.currentTime));
		},1000)
	})
	this.$audio.on('pause',function() {
		clearInterval(_this.time);
	})
}
//初始化时间
Progress.prototype.initTime = function() {
	var _this = this;
	this.$audio.on('canplay', function() {
		_this.$rate_end.text(_this.timeFormat(_this.Audio.duration));
	})
}
//格式化时间
Progress.prototype.timeFormat = function(num) {
	var fullTime = parseInt(num);
	var min = parseInt(fullTime / 60);
	var sec= parseInt(fullTime % 60);
	if(sec < 10) {
		sec = '0' + sec;
	}
	var str = min + ':' + sec;
	return str;
}
//点击进度
Progress.prototype.click = function() {
	var _this = this;
	this.$rate_line.on('click', function(e) {
		var ratio = (e.clientX - _this.$rate_line.offset().left - 6) / 164;
		_this.Audio.currentTime = _this.Audio.duration * ratio; 
		var width = ratio * 164;
		_this.$rate_line_end.css('width',width);
		_this.$progressPoint.css('left',width);
	})
}