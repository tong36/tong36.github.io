function Volume($fm) {
	this.$fm = $fm;
	this.init();
	this.bind();
}
Volume.prototype.init = function() {
	this.$audio = this.$fm.find('audio');
	this.Audio = this.$audio[0];
	this.$range = this.$fm.find('.range');
	this.$vol_t = this.$fm.find('.vol_t');
	this.$vol_f = this.$fm.find('.vol_f');
	this.$vol_point = this.$fm.find('.vol_point');
	this.$lable = this.$fm.find('.lable');
	this.volume = false;
	this.audioVolume;
	this.vol_point = this.$vol_point.draggabilly({
		axis: 'x',
		containment: true
	})
}
Volume.prototype.bind = function() {
	this.volumechange();
	this.clickmute();
	this.drag();
	this.clickVolume();
}
//音量改变事件
Volume.prototype.volumechange = function() {
	var _this = this;
	this.$audio.on('volumechange', function() {
		var volume = _this.Audio.volume * 100;
		var width = volume + 'px';
		_this.$vol_f.css('width',width);
		if(_this.Audio.volume === 0) {
			_this.$lable.addClass('fa-volume-off').removeClass('fa-volume-up');
		}else{
			if(_this.$lable.hasClass('fa-volume-off')) {
				_this.$lable.addClass('fa-volume-up').removeClass('fa-volume-off');
			}
		}
	})
}
//点击静音|取消静音
Volume.prototype.clickmute = function() {
	var _this = this
	this.$lable.on('click',function() {
		if(!_this.volume){
			_this.audioVolume = _this.Audio.volume;
			_this.Audio.volume = 0;
			_this.$vol_f.css('width','0px');
			_this.$vol_point.css('left',0);
			_this.$lable.addClass('fa-volume-off').removeClass('fa-volume-up');
			_this.volume = !_this.volume;
		}else{
			_this.Audio.volume = _this.audioVolume;
			var left = _this.Audio.volume * 100 + 'px';
			_this.$vol_point.css('left',left);
			_this.$lable.addClass('fa-volume-up').removeClass('fa-volume-off');
			_this.volume = !_this.volume;
		}
	})
}
//拖动改变音量
Volume.prototype.drag = function() {
	var _this = this;
	this.vol_point.on('dragMove', function() {
		var width = $(this).data('draggabilly').position.x;
		if(width > 0){
			_this.Audio.volume = width / 100;
		}else{
			_this.Audio.volume = width / 100;
		}
	})
}
//点击改变音量
Volume.prototype.clickVolume = function() {
	var _this = this;
	this.$range.on('click', function(e) {
		var left = e.clientX - _this.$vol_t.offset().left - 5;
		var vol_num = left/100;
		if(vol_num>1){
			vol_num = 1
		}else{
			vol_num = vol_num;
		}
		_this.Audio.volume = vol_num;
		var width = _this.Audio.volume * 100 + 'px';
		_this.$vol_f.css('width',width)
		_this.$vol_point.css('left',width)
	})
}
