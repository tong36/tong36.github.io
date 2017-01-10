//根据pid值找data中内容
//返回具有与参数相同pid的数据集合
function findChildrenByPid(pid){
	var arr = [];
	for (var i = 0; i < datas.length; i++) {
		if(datas[i].pid == pid){
			arr.push(datas[i]);
		}
	}
	return arr;
}
//根据id找数据
//返回与该id相同的数据
function getDataById(id){
	for (var i = 0; i < datas.length; i++) {
		if(datas[i].id == id){
			return datas[i];
		}
	}
}
//根据传入的id找他的父级数据
//返回找到的父级元素
function getParent(id){
	var tada = getDataById(id);
	if(tada){
		return getDataById(tada.pid);
	}
}
//根据传入的id找他的所有父级元素
//返回他的所有父级元素集合
function getParents(id){
	var arr = [];
	var parent = getParent(id);
	if(parent){
		arr = arr.concat(parent,getParents(parent.id));
	}
	return arr;
}
//找到最大id
function getMaxId(){
	var max = 0;
	for (var i = 0; i < datas.length; i++) {
		if(datas[i].id > max){
			max = datas[i].id;
		}
	}
	return max;
}
//找到所有子集数据
//返回所有子集元素集合
function getAllChildren(pid, level) {
    var arr = [];
    var level = level || 0;
    var children = findChildrenByPid(pid);
    for (var i=0; i<children.length; i++) {
        children[i].level = level;
        arr.push( children[i] );
        arr = arr.concat( getAllChildren(children[i].id, level+1) );
    }
    return arr;
}
//将数据按时间排序
//返回排序后的数组
function sortDataByTime(data){
	for (var i = 0; i < data.length; i++) {
		for (var j = 0; j < data.length - i - 1; j++) {
			var a = data[j];
			var b = data[j + 1];
			if(a.time.join('') < b.time.join('')){
				data[j] = b;
				data[j + 1] = a;
			}
		}
	}
	return data;
}

//将数据按名称排序
//返回排序后的数组
function sortDataByWord(data){
	for (var i = 0; i < data.length; i++) {
		for (var j = 0; j < data.length - i - 1; j++) {
			var a = data[j];
			var b = data[j + 1];
			if(a.name > b.name){
				data[j] = b;
				data[j + 1] = a;
			}
		}
	}
	return data;
}

//改变数据的时间为当前时间
function changeTime(data){
	var now = new Date;
	data.time = [now.getFullYear(),now.getMonth(),
	now.getDate(),now.getMinutes(),now.getSeconds()];
}
//时间处理
//@param time Number 时间
function addZero(time){
	if(time < 10){
		return '0' + time;
	}else{
		return time;
	}
}

//格式化时间
//arr 时间数据数组	n 格式化格式共3项，默认第0项
function regTime(arr, n) { //格式化时间。

	var s = '';

	var n = n || 0;
	var aStr = ['年月日时分秒', '-- ::', '// ::'];

	if (n > aStr.length - 1) n = aStr.length - 1;

	for (var i = 0; i < arr.length; i++) {
		s += arr[i] + aStr[n].charAt(i);
		if (i == 2 && n == 0) s += ' ';
	}

	if (s.charAt(s.length - 1) == '-' || s.charAt(s.length - 1) == '/' || s.charAt(s.length - 1) == ':') {
		s = s.substring(0, s.length - 1);
	}

	return s;

}

//检验是否命名重复，通过传入pid值检测
//返回布尔值true表示有重复命名
function rename(pid,name){
	var children = findChildrenByPid(pid);
	for (var i = 0; i < children.length; i++) {
		if(children[i].name === name){
			return true;
		}
	}
}

//在数据中找寻id与传入id相同的数据并修改他的name为目标值
function changeDataName(id,name){
	for (var i = 0; i < datas.length; i++) {
		if(datas[i].id == id){
			datas[i].name = name;
			changeTime(datas[i]);
		}
	}
}


//在数据中找寻id与传入id相同的数据并修改他的pid为目标值
function changeDataPid(id,pid){
	for (var i = 0; i < datas.length; i++) {
		if(datas[i].id == id){
			datas[i].pid = pid;
		}
	}
}
//在数据中找寻id与传入id相同的数据并修改他的time为目标值
function changeDataTime(id,time){
	for (var i = 0; i < datas.length; i++) {
		if(datas[i].id == id){
			datas[i].time = time;
		}
	}
}
//自定义事件
function Emmiter(evnames) {
    this.events = evnames;
}
Emmiter.prototype.addEventListener = function(evname, callback) {
    if (this.events[evname].indexOf(callback) == -1) {
        this.events[evname].push(callback);
    }
}
Emmiter.prototype.trigger = function(evname, ev) {
    for (var i=0; i<this.events[evname].length; i++) {
        if (typeof this.events[evname][i] == 'function') {
            this.events[evname][i].call(this, ev);
        }
    }
}
Emmiter.prototype.removeEventListener = function(evname, callback) {
    for (var i=0; i<this.events[evname].length; i++) {
        if (this.events[evname][i] == callback) {
            this.events[evname].splice(i, 1);
        }
    }
}
//方法继承
function Extends(child, parent) {
    for (var property in parent.prototype) {
        if ( parent.prototype.hasOwnProperty(property) ) {
            child.prototype[property] = parent.prototype[property];
        }
    }
}