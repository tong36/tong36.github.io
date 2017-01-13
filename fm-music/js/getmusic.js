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
	this.channelId = 'public_tuijian_spring';
}
Getmusic.prototype.bind = function() {
	this.ready();
	this.getsong(this.channelId);
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
					var html = '<li channel-id=\"' + channel_id + '\" >' + channel_name + '</li>';
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
	})
	
}
Getmusic.prototype.panelreset = function(song) {
	this.$song.html(song.title);
	this.$singer.html(song.artist);
	this.$song_img.attr('src',song.picture);
	this.$audio[0].src = song.url;
	console.log(this.$audio[0]);
}
