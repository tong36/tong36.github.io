function Panel_control($fm) {
	this.$fm = $fm;
	this.init();
	this.bind();
}
Panel_control.prototype.init = function() {
	this.$back = this.$fm.find($('#back'));
	this.$fm_icon = this.$fm.parent().find($('#fm_icon'));
	this.$func = this.$fm.find($('#func'));
	this.$change_list = this.$fm.find($('.change_list'));
	this.is_list = false;
	this.li_on = false;
}
Panel_control.prototype.bind = function() {
	this.close();
}
Panel_control.prototype.close = function() {
	var _this = this;
	this.$back.on('click',function() {
		_this.$fm.addClass('dn').removeClass('db');
		_this.$fm_icon.addClass('db').removeClass('dn');
	})
	this.$fm_icon.on('click',function() {
		_this.$fm.addClass('db').removeClass('dn');
		_this.$fm_icon.addClass('dn').removeClass('db');
	})
	this.$func.on('click',function() {
		if(!_this.li_on) {
			_this.$change_list.children().first().addClass('li_selected');
			_this.li_on = !_this.li_on;
		}
		if(!_this.is_list) {
			_this.$change_list.removeClass('dn');
			_this.$func.attr('color','red');
			_this.is_list = !_this.is_list;
		}else{
			_this.$change_list.addClass('dn');
			_this.is_list = !_this.is_list;
		}
	})
}
