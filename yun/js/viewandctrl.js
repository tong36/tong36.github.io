//页面渲染
function Init(){
	//文件区域
	this.fileArea = $('.file-area')[0];
	//文件内容区域
	this.contentEle = $('#content');
	//主体的右边部分
	this.mainRight = $('.main-right')[0];
	//右边区域的主体部分
	this.rightMain = $('.right-main')[0];
	//目录树
	this.cotatree = $('.cotatree',this.rightMain)[0];
	//右边区域的头部
	this.rightHead = $('.right-head')[0];
	//导航菜单
	this.nav = $('#nav');
	//拖拽盒子
	this.dragBox = $('.drag_box')[0];
	//图标层
	this.dragIco = $('.ico',this.dragBox)[0];
	//计数层
	this.dragNum = $('.darg_num',this.dragBox)[0];
}
//设置元素的宽高
Init.prototype.setWidthAndHeight = function(){
	//设置右边主体的高度
	this.rightMain.style.height = (this.mainRight.offsetHeight - this.rightHead.offsetHeight) + 'px';
	//根据目录树的显示状态设置文件区域的宽度
	if(this.cotatree.style.display == 'block'){
		this.fileArea.style.width = (this.fileArea.parentNode.offsetWidth - this.cotatree.offsetWidth) + 'px';
	}else{
		this.fileArea.style.width = this.fileArea.parentNode.offsetWidth + 'px';
	}
	this.contentEle.style.height = (this.rightMain.offsetHeight - this.nav.offsetHeight) + 'px';
}
//创建一个页面渲染的实例化对象
var init = new Init;
//调用设置宽高方法初始化宽高
init.setWidthAndHeight();
//监听浏览器窗口的变化,相应设置宽高
window.onresize = function(){
	init.setWidthAndHeight();
}

//提示框
function Tip(){
	//提示框
	this.tipEle = $('#tip');
	//显示内容层
	this.textEle = $('.text',this.tipEle)[0];
	//图片
	this.icoEle = $('.ico',this.tipEle)[0];
}
//显示方法
Tip.prototype.show = function(inner){
	//将对象this存入变量
	var _this = this
	//使用函数改变提示框的高度和透明度,使提示框慢慢显示出来
	move(40,500,30,_this.tipEle,'height','linear');
	move(1,500,30,_this.tipEle,'opacity','linear',function(){
		//提示框显示完成后,设置图片显示,同时设置内容为传入的参数
		move(1,100,30,_this.icoEle,'opacity','linear');
		_this.textEle.innerHTML = inner;
	});
	//开延时定时器,设置一定时间后隐藏提示框
	setTimeout(function(){
		move(0,600,30,_this.tipEle,'height','linear');
		move(0,500,30,_this.icoEle,'opacity','linear')
		move(0,100,30,_this.tipEle,'opacity','linear',function(){
			_this.textEle.innerHTML = '';
		})
	},5000)
}
//创建一个提示层对象
var tip = new Tip;

//创建一个容器对象,因为之后有要 用到该对象的地方,这里将他的申明提前到此处
var content = new Container;

//菜单项函数
function Nav(){
	//将对象this存入变量
	var _this = this;
	//把元素存为属性
	this.nav = $('#nav');
	this.list = $('#list');
	//第一个a--根--微云
	this.top = $('#weiyun');
	//设置微云的fileId为0
	this.top.fileId = 0;
	//获取选择框
	this.checkBox = $('.checkbox',this.nav)[0];
	//全选按钮
	this.checkAll = $('#check-all');
	//设置全选按钮的选中状态	true为选中	false为未选中
	this.checkAll.check = false;
	this.nav.onmousedown = function(e){
		e.cancelBubble = true;
	}
	//点击选择框，将点击事件加在选择框上，增大作用范围，提升用户体验
	this.checkBox.onclick = function(e){
		e.cancelBubble = true;
		//判断点击时全选按钮的状态
		if(!_this.checkAll.check){
			//如果为未选中状态
			//改变状态为选中，同时设置全选按钮的classname为check，设置相应样式
			_this.checkAll.className = 'check';
			_this.checkAll.check = true;
		}else{
			//如果为选中状态
			//改变状态为未选中，同时清空classname
			_this.checkAll.className = '';
			_this.checkAll.check = false;
		}
		//调用函数设置所有文件的选中状态--根据全选按钮的状态设定
		//此处注意，之前更改全选按钮的状态为true，表示选中，反之亦然。
		_this.isCheck(_this.checkAll.check)
	}
}
//判断所有文件的选中状态
//state	Blooean	根据此值设置文件状态
Nav.prototype.isCheck = function(state){
	content.checkEle = [];
	//根据传入参数的值设置文件状态
	if(state){
		//如果参数为true，设置所有文件选中，同时设置class
		for (var i = 0; i < content.ele.length; i++) {
			addClass(content.ele[i],'file-' + oderType.type + '-checked');
			content.ele[i].check = true;
			content.checkEle.push(content.ele[i]);
		}
	}else{
		//如果参数为false，设置所有文件未选中，同时设置清除相应class
		for (var i = 0; i < content.ele.length; i++) {
			removeClass(content.ele[i],'file-' + oderType.type + '-checked');
			content.ele[i].check = false;
		}
	}
}
//渲染导航栏
Nav.prototype.render = function(){
	//存this
	var _this = this;
	//每次渲染前清空导航栏内容
	this.list.innerHTML = '';
	//根据当前的content.currentId获取所有父级存入变量
	var datas = getParents(content.currentId);
	//判断数据中有没有id与当前content.currentId相匹配的项，如果有，将其放入datas变量头部
	if(getDataById(content.currentId)) datas.unshift(getDataById(content.currentId));
	//倒转datas变量中数据的顺序，使渲染时按需求顺序渲染
	datas.reverse();
	//遍历所有数据
	for (var i = 0; i < datas.length; i++) {
		//新建a元素
		var a = document.createElement('a');
		//设置a的内容为当前数据的name值
		a.innerHTML = datas[i].name;
		//设置a的fileid为数据的id
		a.fileId = datas[i].id;
		//设置a的层级，层级需要递减，让上一个a位于下一个a上面
		a.style.zIndex = datas.length - i;
		//将a放入list中
		this.list.appendChild(a);
		//判断a为最后一个a
		if(i == datas.length - 1){
			//设置a的class为选中
			a.className = 'check';
		}
		//设置每个a的鼠标移入事件
		a.onmouseover = function(){
			//调用函数
			_this.over(this);
		}
		//设置每个a的鼠标移出事件
		a.onmouseout = function(){
			_this.out(this);
		}
		//设置a的点击事件
		a.onclick = function(){
			//根据当前点击的a设置content的currentId
			content.currentId = this.fileId;
			//重新渲染content
			content.render(content.currentId);
		}
		//设置微云的点击
		this.top.onclick = function(){
			//根据当前点击的a设置content的currentId
			content.currentId = this.fileId;
			//重新渲染content
			content.render(content.currentId);
			//设置当前为选中
			this.className = 'check';
		}
		//设置微云的鼠标移入
		this.top.onmouseover = function(){
			_this.over(this);
		}
		//设置微云的移出
		this.top.onmouseout = function(){
			_this.out(this);
		}
	}
	//判断如果当前的数据中没有找到id与content.currentId相同的项时，说明该项为最顶层微云，设置微云选中
	//否则设置当前项为选中
	if(getDataById(content.currentId)){
		this.top.className = ''
	}else{
		this.top.className = 'check';
	}
}
//over---鼠标移入方法
Nav.prototype.over = function(that){
	//设置传入的参数项的class
	if(that.className != 'check'){
		that.className = 'hover';
	}
}
//out---鼠标移出方法
Nav.prototype.out = function(that){
	//设置传入的参数项的class
	if(that.className != 'check'){
		that.className = '';
	}
}

//目录树构造函数
//定义弹窗内的目录树
//因为大目录树执行时需要判断该目录树存不存在，所以这里提前声明
var cotaSmall = null;

function CotaTree(who){
	//将元素存入ele属性中
	this.ele = {};
	//根据参数确定生成目录树的存放父级
	this.ele.cotaEle = who;
	//定义属性变量str记录树形结构
	this.str = '';
	//定义变量记录目录树中的所有div
	this.divs = [];
	//定义变量记录状态，根据状态判断是否重新渲染content
	//因为鼠标抬起时和点击时要做不同的事情，在鼠标抬起时记录状态，根据状态判断是否重新渲染
	this.refresh = true;
	//通过call方式，使目录树继承自定义事件函数的属性，同时设置目录树的自定义事件名
	Emmiter.call(this,{
		more:[],
		click:[],
	})
	//设置cotaEle的onmousedown事件阻止冒泡
	this.ele.cotaEle.onmousedown = function(e){
		e.cancelBubble = true;
	}
}
//设置目录树函数继承Emmiter函数的方法
Extends(CotaTree,Emmiter);
//new一个CotaTree对象，存入变量cotaTree，存放入目录树块儿中
var cotaTree = new CotaTree($('.cotatree')[0]);
//设置cotaTree的div的点击事件
cotaTree.reclick = function(){
	//判断如果点击时refresh状态为false时，说明拖拽盒子显示，应该执行移动到命令
	//所有直接return，不执行后续代码
	if(!this.refresh) return;
	//遍历所有cotaTree的所有div
	for (var i = 0; i < cotaTree.divs.length; i++) {
		cotaTree.divs[i].onclick = function(){
			//获取当前div的i
			var more = $('i',this)[0];
			//调用函数设置当前i的选中
			cotaTree.check(this,more);
			//设置content.currentId
			content.currentId = this.fileId;
			//根据content.currentId刷新content
			content.render(content.currentId);
		}
	}
}
//设置cotaTree的鼠标抬起函数
cotaTree.reUp = function(){
	//将this存入变量
	var _this = this;
	//变量所有div
	for (var i = 0; i < cotaTree.divs.length; i++) {
		cotaTree.divs[i].onmouseup = function(){
			//鼠标抬起时，判断拖拽盒子是否为显示状态，如果显示，则调用prompt.moveto函数
			if(init.dragBox.style.display == 'block'){
				prompt.moveto(this.fileId);
				_this.refresh = false;
			}else{
				//否则设置refresh的值为true，根据当前的contentID重新渲染content
				_this.refresh = true;
			}
		}
	}
}
//为cotaTree绑定自定义事件click
cotaTree.addEventListener('click',cotaTree.reclick);
//渲染方法
CotaTree.prototype.render = function(obj){
	//记录this
	var _this = this;
	//拼结构字符串---目录树头
	this.str = `<ul>
					<li>
						<div>
							<i class="more"></i>
							<span class="pic"></span>
							<span class="info">微云</span>
						</div>
					</li>
				</ul>`;
	//设置存放父级的innerHTML
	this.ele.cotaEle.innerHTML = this.str;
	//获取li
	this.ele.li = this.ele.cotaEle.getElementsByTagName('li')[0];
	//调用方法,将目录树后续结构写入li
	this.inner(0,this.ele.li);
	//获取i
	var more = $('.more',this.ele.cotaEle)[0];
	//获取div
	var div = $('div',this.ele.cotaEle)[0];
	//将当前的微云div存入div集合
	this.divs.push(div);
	//设置当前微云div的fileId为0
	div.fileId = 0;
	//设置当前div的show状态为true
	div.show = true;
	//设置当前div的等级level为0
	div.level = 0;
	//给当前i添加class为show
	addClass(more,'show');
	//设置i的点击事件
	more.onclick = function(){
		//判断点击时该div的show状态,如果为true则调用hide方法隐藏div后面的ul
		//否则调用show方法显示div后面的ul
		if(div.show){
			_this.hide(this);
		}else{
			_this.show(this);
		}
		//如果点击时cotaSmall有内容
		if(cotaSmall && cotaSmall.events.more.length > 0){
			cotaSmall.trigger('more');
		}
	}
	div.onmouseenter = function(e){
		addClass(this,'hover');
		
	}
	div.onmouseleave = function(e){
		removeClass(this,'hover');
		
	}
}
//根据数据生成ul,需传入id和将放入的父级元素
CotaTree.prototype.inner = function(id,obj){
	getAllChildren(0,1);
	var _this = this;
	//调用函数找到pid的数据
	var childs = findChildrenByPid(id);
	//遍历所有数据
	var ul = document.createElement('ul');
	for (var i = 0; i < childs.length; i++) {
		//根据该项数据有没有子集来设置不同的class
		var more = findChildrenByPid(childs[i].id).length > 0 ? 'more':'none';
		var li = document.createElement('li');
		
		var div = document.createElement('div');
		div.fileId = childs[i].id;
		div.show = false
		this.divs.push(div);
		div.level = childs[i].level;
		
		var iEle = document.createElement('i');
		iEle.className = more;
		iEle.style.marginLeft = (childs[i].level)*13 + 'px';
		div.appendChild(iEle);
		
		var pic = document.createElement('span');
		pic.className = 'pic';
		div.appendChild(pic);
		
		var info = document.createElement('span');
		info.className = 'info';
		info.innerHTML = childs[i].name;
		div.appendChild(info);
		
		li.appendChild(div);
		ul.appendChild(li);
		obj.appendChild(ul);
		
		iEle.onclick = function(e){
			var div = this.parentNode;
			if(div.show){
				_this.hide(this);
			}else{
				_this.show(this);
			}
			e.cancelBubble = true;
			if(cotaSmall && cotaSmall.events.more.length > 0){
				cotaSmall.trigger('more');
			}
		}
		div.onmouseenter = function(e){
			addClass(this,'hover');
		}
		div.onmouseleave = function(e){
			removeClass(this,'hover');
		}
	}
	if(cotaTree){
		cotaTree.trigger('click');
		cotaTree.reUp();
	}
	if(cotaSmall){
		cotaSmall.trigger('click');
	}
	if(childs.length == 0){
		return false;
	}else{
		return true;
	}
}
CotaTree.prototype.check = function(target,more){
	for (var i = 0; i < this.divs.length; i++) {
		if(this.divs[i].className.indexOf('check') != -1){
			removeClass(this.divs[i],'check');
		}
	}
	addClass(target,'check');
	this.show(more);
}
//显示下拉列表,需传入需要显示的元素obj
CotaTree.prototype.show = function(obj){
	var div = obj.parentNode;
	var li = div.parentNode;
	div.show = true;
	if(!li.children[1]){
		this.inner(div.fileId,li);
	}
	var ul = div.nextElementSibling;
	if(ul) ul.style.display = 'block';
	addClass(obj,'show');
}
CotaTree.prototype.hide = function(obj){
	var div = obj.parentNode;
	var li = div.nextElementSibling;
	var ul = div.nextElementSibling;
	div.show = false;
	ul.style.display = 'none';
	removeClass(obj,'show');
}
CotaTree.prototype.findDivRender = function(id){
	var children = $('i',this.findDiv(id))[0];
	this.check(this.findDiv(id),children);
}
CotaTree.prototype.reRender = function(id){
	var targetDiv = this.findDiv(id);
	var more = $('i',targetDiv)[0];
	var parent = targetDiv.parentNode;
	var ul = targetDiv.nextElementSibling;
	if(ul){
		parent.removeChild(ul);
	}
	var state = this.inner(id,parent);
	if(state){
		more.className = 'more';
	}else{
		more.className = 'none';
	}
}
//根据传入id在目录树中寻找id符合的div
CotaTree.prototype.findDiv = function(id){
	var trees = this.divs;
	for (var i = 0; i < trees.length; i++) {
		if(trees[i].fileId === id){
			return trees[i];
		}
	}
}
CotaTree.prototype.moveto = function(targetId){
	var pid = targetId ? targetId : cotaSmall.pid;
	//要移入的li中的div
	var targetDiv = this.findDiv(pid);
	//当前显示的列表中的div
	var currentDiv = this.findDiv(content.currentId);
	var target = null;
	var checks = fun.fil ? [fun.fil] : content.checkEle;
	//获取目标列表
	if(targetDiv){
		target = targetDiv.nextElementSibling;
	}
	
	//判断目标元素是否存在,不存在直接rreturn不执行后续代码
	if(!targetDiv || !target){
		//遍历目录树中的所有div在其中寻找到id与选中的文件夹id相同的div
		//并且在其父级中将其移除
		for (var i = 0; i < this.divs.length; i++) {
			for (var j = 0; j < checks.length; j++) {
				if(this.divs[i].fileId == checks[j].fileId){
					this.divs[i].parentNode.parentNode.removeChild(this.divs[i].parentNode);
				}
			}
		}
	}else{
		//如果目标列表存在
		if(target){
			//在所有div中寻找id与选中元素id相同的项
			//并将其添加到目标列表中,同时根据目标的等级,设置缩进
			for (var i = 0; i < this.divs.length; i++) {
				for (var j = 0; j < checks.length; j++) {
					if(this.divs[i].fileId == checks[j].fileId){
						this.divs[i] && target.appendChild(this.divs[i].parentNode);
						var more = $('i',this.divs[i])[0];
						more.style.marginLeft = ((targetDiv.level + 1) * 13) + 'px';
					}
				}
			}
		}
	}
	$('i',targetDiv)[0].className = 'more';
}
cotaTree.render();

var nav = new Nav;
nav.render();

//弹窗提示层
function Promt(){
	var _this = this;
	this.ele = {};
	this.ele.promt = $('#promt');
	this.ele.bg = $('#bg');
	this.ele.top = $('.top',this.ele.promt)[0];
	this.ele.title = $('h3',this.ele.top)[0];
	this.ele.close = $('span',this.ele.top)[0];
	this.ele.content = $('.content',this.ele.promt)[0];
	this.ele.info = $('.info',this.ele.content)[0];
	this.ele.move = $('.content-move',this.ele.promt)[0];
	this.ele.fileName = $('.info',this.ele.promt)[1];
	this.ele.fileType = $('.ico',this.ele.promt)[1];
	this.ele.moveTop = $('.move-content-top',this.ele.promt)[0];
	this.ele.moveSrc = $('span',this.ele.moveTop)[1];
	this.ele.moveCon = $('.move-content-main',this.ele.promt)[0];
	this.ele.moveInner = $('p',this.ele.moveCon)[0];
	this.ele.moveScroll= $('i',this.ele.moveCon)[0];
	this.ele.yes = $('input',this.ele.promt)[0];
	this.ele.no = $('input',this.ele.promt)[1];
	
	this.ele.yes.onclick = function(){
		if(_this.events.del.length > 0){
			_this.trigger('del');
			_this.removeEventListener('del',_this.del);
		}else if(_this.events.moveto.length > 0){
			_this.trigger('moveto');
			_this.removeEventListener('moveto',_this.moveto);
		}else if(_this.events.thumbDel.length > 0){
			_this.trigger('thumbDel');
			_this.removeEventListener('thumbDel',_this.thumbDel);
		}
		_this.hide();
	}
	this.ele.no.onclick = function(){
		_this.hide();
	}
	this.ele.close.onclick = function(){
		_this.hide();
	}
	this.ele.bg.onmousedown = function(e){
		e.cancelBubble = true;
	}
	this.ele.promt.onmousedown = function(e){
		e.cancelBubble = true;
	}
	Emmiter.call(this,{
		del:[],
		moveto:[],
		thumbDel:[]
	})
}
Extends(Promt,Emmiter);
//拖拽
Promt.prototype.drag = function(obj,obj2,maxL,minL,maxT,minT){
	obj.onmousedown = function(e){
		var offsetLeft = obj2 ? obj2.offsetLeft : obj.offsetLeft;
		var offsetTop = obj2 ? obj2.offsetTop : obj.offsetTop;
		var disX = e.clientX - offsetLeft;
		var disY = e.clientY - offsetTop;
		document.onmousemove = function(e){
			var L = e.clientX - disX;
			var T = e.clientY - disY;
			if(L < minL){
				L = minL;
			}else if(L > maxL){
				L = maxL;
			}
			if(T < minT){
				T = minT;
			}else if(T > maxT){
				T = maxT;
			}
			if(obj2){
				obj2.style.left = L + 'px';
				obj2.style.top = T + 'px';
			}else{
				obj.style.left = L + 'px';
				obj.style.top = T + 'px';
			}
		}
		document.onmouseup = function(){
			document.onmousemove = null;
			document.onmouseup = null;
		}
		return false;
	}
}
Promt.prototype.scroll = function(scrollEle,scrollParent,targetEle,targetParent){
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
		targetEle.style.top = T/scrollParent.clientHeight * (targetParent.clientHeight - targetEle.offsetHeight) + 'px';
		
		e.preventDefault();
        return false;
	}
}
//显示弹窗
Promt.prototype.show = function(){
	this.ele.promt.style.display = 'block';
	this.ele.bg.style.display = 'block';
}
Promt.prototype.hide = function(){
	this.ele.promt.style.display = '';
	this.ele.bg.style.display = '';
	this.events.del = [];
	this.events.moveto = [];
	this.events.thumbDel = [];
}
Promt.prototype.center = function(){
	//居中提示层promt
	var L = (window.innerWidth - this.ele.promt.offsetWidth) / 2;
	var T = (window.innerHeight - this.ele.promt.offsetHeight) / 2;
	this.ele.promt.style.left = L + 'px';
	this.ele.promt.style.top = T + 'px';
	//设置bg遮罩层的宽高
	this.ele.bg.style.width = window.innerWidth + 'px';
	this.ele.bg.style.height = window.innerHeight + 'px';
}
Promt.prototype.contentShow = function(title,inner){
	this.ele.content.style.display = 'block';
	this.ele.move.style.display = 'none';
	this.ele.title.innerHTML = title;
	this.ele.info.innerHTML = inner;
	this.center();
	
	var minL = 0;
	var maxL = window.innerWidth - this.ele.promt.offsetWidth;
	var minT = 0;
	var maxT = window.innerHeight - this.ele.promt.offsetHeight;
	this.drag(this.ele.top,this.ele.promt,maxL,minL,maxT,minT)
}
Promt.prototype.moveShow = function(title){
	var _this = this;
	this.ele.move.style.display = 'block';
	this.ele.content.style.display = 'none';
	this.center();
	this.ele.moveScroll.style.height = 0;
	
	var minL = 0;
	var maxL = window.innerWidth - this.ele.promt.offsetWidth;
	var minT = 0;
	var maxT = window.innerHeight - this.ele.promt.offsetHeight;
	this.drag(this.ele.top,this.ele.promt,maxL,minL,maxT,minT)
	
	this.ele.title.innerHTML = title;
	cotaSmall = new CotaTree(this.ele.moveInner);
	cotaSmall.that = null;
	//根据选中文件数设置头部显示内容
	if(content.checkEle.length == 1){
		this.ele.fileName.innerHTML = content.checkEle[0].children[2].innerHTML;
	}else if(content.checkEle.length > 1){
		this.ele.fileName.innerHTML = content.checkEle[0].children[2].innerHTML + '等'+ content.checkEle.length +'个文件';
	}else{
		this.ele.fileName.innerHTML = fun.fil.children[2].innerHTML;
	}
	cotaSmall.moreEvent = function(){
		_this.setScrollHeight();
	}
	cotaSmall.addEventListener('more',cotaSmall.moreEvent);
	
	cotaSmall.reclick = function(){
		for (var i = 0; i < cotaSmall.divs.length; i++) {
			cotaSmall.divs[i].onclick = function(){
				var more = $('i',this)[0];
				cotaSmall.check(this,more);
				var name = null;
				//定义变量记录文件父级的name
				cotaSmall.pid = this.fileId;
				name = this.children[2].innerHTML;
				//定义变量记录moveTo的显示内容
				//判断点的是微云项,设置str值为空,否则设置str值为微云/;
				var str = cotaSmall.pid == 0 ? '':'微云/';
				//遍历通过pid值找到的所有父级数据
				for (var i = getParents(cotaSmall.pid).length - 1; i >= 0 ; i--) {
					//设置str的值为数据的name值拼接内容
					str += getParents(cotaSmall.pid)[i].name + '/';
				}
				//最后将当前点击项的name加入str
				str += name;
				//设置moveTo的显示内容为str
				_this.ele.moveSrc.innerHTML = str;
				_this.setScrollHeight();
			}
		}
		
	}
	cotaSmall.addEventListener('click',cotaSmall.reclick);
	cotaSmall.render();
	
}
//设置模拟滚动条的高度
Promt.prototype.setScrollHeight = function(){
	var parentH = this.ele.moveInner.clientHeight;
	var innerH = this.ele.moveInner.children[0].clientHeight;
	if(parentH > innerH){
		this.ele.moveScroll.style.height = 0;
	}else{
		var p = parentH/innerH;
		if( p < 0.2){
			p = 0.2;
		}
		this.ele.moveScroll.style.height = parentH/innerH * this.ele.moveCon.clientHeight + 'px';
	}
	this.scroll(this.ele.moveScroll,this.ele.moveCon,this.ele.moveInner.children[0],this.ele.moveInner);
}
Promt.prototype.del = function(){
	for (var i = 0; i < content.checkEle.length; i++) {
		//将当前元素的fileId存入变量
		var id = content.checkEle[i].fileId;
		this.delData(id);
	}
	this.doCotaTree();
}
Promt.prototype.delData = function(id){
	//将当前元素的所有子集数据存入变量
	var children = getAllChildren(id);
	//遍历所有的子集
	for (var j = 0; j < children.length; j++) {
		//在所有数据中找，如果数据中的id与某子集的id相同
		for (var k = 0; k < datas.length; k++) {
			if(children[j].id == datas[k].id){
				//在data中删除当前元素
				datas.splice(k,1);
				k--;
			}
		}
	}
	//找到数据中id与当前点击文件的id相同的数据并删除该数据
	for (var j = 0; j < datas.length; j++) {
		if(datas[j].id == id){
			datas.splice(j,1);
		}
	}
}
Promt.prototype.doCotaTree = function(){
	content.render(content.currentId);
	cotaTree.reRender(content.currentId);
	var cotaDiv = cotaTree.findDiv(content.currentId);
	var more = $('i',cotaDiv)[0];
	if(!cotaDiv.nextElementSibling){
		addClass(more,'none');
		removeClass(more,'more');
	}
}
Promt.prototype.moveto = function(targetId){
	var result = this.moveToData(targetId);
	if( result == 'child'){
		tip.show('移动失败,不能将文件移动到自身或其子文件夹下');
	}else if(result == 'rename'){
		tip.show('移动失败,文件夹名有冲突');
	}else if(result == 'OK'){
		//重新渲染content和目录树 并返回ok
		cotaTree.moveto(targetId);
		content.render(content.currentId);
	}
}
Promt.prototype.moveToData = function(targetId){
	var pid = targetId ? targetId : cotaSmall.pid;
	//找到所有选中的元素
	var checks = fun.fil ? [fun.fil] : content.checkEle;
	//遍历所有选中的元素
	for (var i = 0; i < checks.length; i++) {
		//找到某个选中元素的所有子集数据
		childs = getAllChildren(checks[i].fileId);
		//判断如果选中元素的id与将要移入的id相同时,return child
		if(checks[i].fileId == pid) return 'child';
		//遍历子集数据
		for (var j = 0; j < childs.length; j++) {
			//判断移入的targetId选中元素的子数据id相同 则返回child根据返回值做相应提示
			if(childs[j].id == pid) return 'child';
		}
		//遍历所有数据
		for (var j = 0; j < datas.length; j++) {
			//找到数据中id与选中数据的id相同的数据
			if(datas[j].id == checks[i].fileId){
				//判断该数据的name值与要移入的元素中的子元素的id有无相同的name 有则返回rename
				if(rename(pid,datas[j].name)) return 'rename';
				//没有重名,更改该数据的pid值为当前移入元素的fileId，
				//将选中元素对应的数据纳入移入元素的子集
				datas[j].pid = pid;
				
			}
		}
	}
	return 'OK';
}
var prompt = new Promt;
//显示目录树构造函数
function CotaShow(){
	var _this = this;
	this.ele = {};
	this.ele.cota = $('#cota');
	this.ele.cota.onOff = false;
	this.ele.cota.onclick = function(){
		if(!_this.ele.cota.onOff){
			_this.ele.cota.onOff = true;
			cotaTree.ele.cotaEle.style.display = '';
			this.style.backgroundColor = '#fff';
		}else{
			cotaTree.ele.cotaEle.style.display = 'block';
			_this.ele.cota.onOff = false;
			this.style.backgroundColor = '#e0e4ed';
		}
		init.setWidthAndHeight();
	}
	this.ele.cota.onmousedown = function(e){
		e.cancelBubble = true;
	}
}
var cotaShow = new CotaShow;
//排序构造函数
function Order(){
	var _this = this;
	this.order = $('#order-ico');
	this.orderList = $('.oder-box')[0];
	this.items = $('li',this.orderList);
	this.span = $('span',this.order)[0];
	this.type = 'thumb';
	this.timer = null;
	this.order.onmouseover = function(){
		clearTimeout(_this.timer);
		_this.show();
	}
	this.order.onmouseleave = function(){
		_this.hide();
	}
	this.orderList.onmouseenter = function(){
		clearTimeout(_this.timer);
	}
	this.orderList.onmouseleave = function(){
		_this.hide();
	}
	this.orderList.onmouseover = function(e){
		if(e.target.tagName.toLocaleLowerCase() == 'li' && e.target.className != 'check'){
			_this.hover(e.target);
		}
	}
	for (var i = 0; i < this.items.length; i++) {
		(function(i){
			_this.items[i].onclick = function(e){
				_this.click(this);
				if(i == 0){
					_this.span.className = 'time';
				}
				if(i == 1){
					_this.span.className = 'word';
				}
				if(i == 2){
					_this.span.className = 'thumb';
					fun.fil = null;
				}
			}
		})(i)
	}
}
Order.prototype.show = function(){
	this.orderList.style.display = 'block';
	addClass(this.order,'hover');
}
Order.prototype.hide = function(){
	var _this = this;
	this.timer = setTimeout(function(){
		console.log(1);
		_this.orderList.style.display = 'none';
		removeClass(_this.order,'hover');
	},200)
}
Order.prototype.hover = function(that){
	for (var i = 0; i < this.items.length; i++) {
		if(this.items[i].className != 'check'){
			this.items[i].className = '';
		}
	}
	that.className = 'hover';
}
Order.prototype.click = function(that){
	for (var i = 0; i < this.items.length; i++) {
		this.items[i].className = '';
	}
	that.className = 'check';
	this.type = that.getAttribute('type');
	content.render(content.currentId);
}
var oderType = new Order;

Container.prototype.appendChild = function(who){
	this.containerEle.appendChild(who);
}
//右键菜单
function Menu(){
	var _this = this;
	this.ele = {};
	this.ele.list = $('#menu');
	this.ele.items = $('li',this.ele.list);
	this.ele.list.onclick = function(){
		_this.hide();
	}
	this.ele.list.onmousedown = function(e){
		e.cancelBubble = true;
	}
	//删除
	this.ele.items[1].onclick = function(){
		prompt.show();
		prompt.contentShow('删除文件','确定要删除选定的'+content.checkEle.length+'个文件吗?');
		prompt.addEventListener('del',prompt.del);
	}
	//移动到
	this.ele.items[2].onclick = function(){
		prompt.show();
		prompt.moveShow('选择存储位置');
		prompt.addEventListener('moveto',prompt.moveto);
	}
	//重命名
	this.ele.items[3].onclick = function(){
		fun.renameClick();
	}
}
Menu.prototype.show = function(){
	this.ele.list.style.display = 'block';
}
Menu.prototype.hide = function(){
	this.ele.list.style.display = '';
}
var menu = new Menu;
//头部功能按钮组
function Fun(){
	var _this = this;
	this.btnClass = $('.btn_class',init.rightHead)[0];
	this.divs = $('div',init.rightHead);
	this.movetoEle = $('.moveto',this.btnClass)[0];
	this.renameEle = $('.rename',this.btnClass)[0];
	this.deleteEle = $('.delete',this.btnClass)[0];
	this.createEle = $('.createFolder',this.btnClass)[0];
	this.refreshEle = $('.refresh',this.btnClass)[0];
	this.fil = null;
	for (var i = 0; i < this.divs.length; i++) {
		this.divs[i].onmouseenter = function(e){
			_this.over(this);
		}
		this.divs[i].onmouseleave = function(e){
			_this.out(this);
		}
	}
	this.btnClass.onmousedown = function(e){
		e.cancelBubble = true;
	}
	this.movetoEle.onclick = function(){
		if(content.checkEle.length == 0){
			tip.show('请选择文件！');
		}else{
			prompt.show();
			prompt.moveShow('选择存储位置');
			prompt.addEventListener('moveto',prompt.moveto);
		}
	}
	this.renameEle.onclick = function(){
		_this.renameClick();
	}
	this.deleteEle.onclick = function(){
		if(content.checkEle.length == 0){
			tip.show('请选择文件！');
		}else{
			prompt.show();
			prompt.contentShow('删除文件','确定要删除选定的'+content.checkEle.length+'个文件吗?');
			prompt.addEventListener('del',prompt.del);
		}
	}
	this.createEle.onclick = function(){
		content.createFolder.style.display = 'block';
		content.createFolder.className = 'file-' + oderType.type;
		content.files.appendChild(content.createFolder);
		content.txt.focus();
		content.txt.onkeyup = function(e){
			//判断按的是回车键同时txt中的内容不为空
			if(e.which == 13 && txt.value != ''){
				//判断如果没有重复命名，则新建文件夹
				_this.isCreat();
			}
		}
	}
	this.refreshEle.onclick = function(){
		content.currentId = 0;
		content.render(content.currentId);
	}
}
Fun.prototype.over = function(obj){
	addClass(obj,'hover');
}
Fun.prototype.out = function(obj){
	removeClass(obj,'hover');
}
Fun.prototype.isCreat = function(hide){
	if(!rename(content.currentId,content.txt.value) && txt.value != ''){
		//将新建的数据写入datas
		var now = new Date();
		datas.push(
			{
				id: getMaxId() + 1,
		        pid: content.currentId,
		        name: content.txt.value,
		        type: 'folder',
		        time:[now.getFullYear(),addZero(now.getMonth()),addZero(now.getDate()),
		        addZero(now.getHours()),addZero(now.getMinutes())
		        ]
			}
		)
		//清空txt的value
		content.txt.value = '';
		//隐藏createFolder
		content.createFolder.style.display = '';
		//重新渲染content
		content.render(content.currentId);
		cotaTree.reRender(content.currentId);
		var cotaDiv = cotaTree.findDiv(content.currentId);
		var more = $('i',cotaDiv)[0];
		if(more.className.indexOf('more') == -1){
			addClass(more,'more');
			removeClass(more,'none');
		}
	}else{
		if(txt.value != ''){
			tip.show('文件夹名有冲突，请重新命名');
		}
		if(hide){
			content.txt.value = '';
			content.createFolder.style.display = '';
		}
	}
}
Fun.prototype.renameClick = function(){
	if(content.checkEle.length == 0){
		tip.show('请选择文件！');
	}else if(content.checkEle.length > 1){
		tip.show('只能对单个文件重命名！');
	}else{
		this.rename(content.checkEle[0]);
	}
}
Fun.prototype.rename = function(fil){
	var _this = this;
	//设置该选中元素的第2个子集即名字层隐藏
	fil.children[2].style.display = 'none';
	//将 content.renameEle添加到选中元素中
	fil.appendChild(content.renameEle);
	//同时设置 content.renameEle显示
	content.renameEle.style.display = 'block';
	//设置 content.renameEle获得焦点
	content.renameEle.focus();
	content.renameEle.value = fil.children[2].innerHTML;
	//点击 content.renameEle时阻止冒泡
	content.renameEle.onclick = function(e){
		e.cancelBubble = true;
	}
	//设置 content.renameEle的键盘抬起事件
	content.renameEle.onkeyup = function(e){
		//判断按的是回车键
		if(e.which == 13 && content.renameEle.value != ''){
			_this.isRename(false,fil);
		}
	}
}
//判断如果没有重名
Fun.prototype.isRename = function(hide,fil){
	if(!rename(content.currentId,content.renameEle.value)){
		//将数据中id与该元素的fileId相同项的name为 content.renameEle.value
		changeDataName(fil.fileId,content.renameEle.value)
		//若没有重复将content中的 content.renameEle移除
		fil.removeChild( content.renameEle);
		//让名字层显示，并设置名字层的显示内容为 content.renameEle.value
		fil.children[2].style.display = 'block';
		fil.children[2].innerHTML =  content.renameEle.value;
		//清空 content.renameEle.value
		content.renameEle.value = '';
		content.renameEle.style.display = '';
		cotaTree.reRender(content.currentId);
		
	}else{
		if(content.renameEle.value == fil.children[2].innerHTML){
			content.renameEle.value = '';
			content.renameEle.style.display = '';
			fil.children[2].style.display = 'block';
		}else{
			if(hide){
				content.renameEle.value = '';
				content.renameEle.style.display = '';
				fil.children[2].style.display = 'block';
			}
			//否则提示
			tip.show('文件夹名有冲突，请重新命名');
		}
		
	}
}
var fun = new Fun;

//框选
function BoxCheck(){
	this.box = $('#box-check');
	this.show();
}
BoxCheck.prototype.show = function(){
	var _this = this;
	console.log(init.contentEle);
	init.contentEle.onmousedown = function(e){
		console.log(1)
		if(e.which == 3) return;
		var oldX = e.clientX;
		var oldY = e.clientY;
		document.onmousemove = function(e){
			//鼠标移动时,设置框选盒子显示并设置显示位置
			_this.box.style.display = 'block';
			//left值和top值取当前鼠标位置与按下时鼠标位置中的最小值
			var L = e.clientX > oldX ? oldX : e.clientX;
			var T = e.clientY > oldY ? oldY : e.clientY;
			_this.box.style.left = L + 'px';
			_this.box.style.top = T + 'px';
			//设置框选盒子的宽高为鼠标移动的距离(数值取绝对值)
			_this.box.style.width = Math.abs(e.clientX - oldX) + 'px';
			_this.box.style.height =  Math.abs(e.clientY - oldY) + 'px';
			//对文件进行碰撞检测
			for (var i = 0; i < content.ele.length; i++) {
				var eleB = content.ele[i].getBoundingClientRect();
				if(eleB.top < _this.box.offsetTop + _this.box.offsetHeight &&
				eleB.top + eleB.height > _this.box.offsetTop &&
				eleB.left < _this.box.offsetLeft + _this.box.offsetWidth&&
				eleB.left + eleB.width > _this.box.offsetLeft
				){
					//判断框选盒子碰上文件,设置文件的状态为选中
					content.ele[i].check = true;
					addClass(content.ele[i],'file-'+oderType.type+'-checked');
					content.addCheckEle(content.ele[i]);
				}else{
					//否则设置状态为未选中
					content.ele[i].check = false;
					content.ele[i].className = 'file-' + oderType.type;
					content.removeCheckEle(content.ele[i]);
				}
			}
			//检测全选
			nav.checkAll.className = content.checkEle.length ==  content.ele.length ? 'check':'';
			nav.checkAll.check = content.checkEle.length ==  content.ele.length ? true:false;
		}
		document.onmouseup = function(){
			//鼠标抬起时清除move事件的值
			document.onmousemove = null;
			document.onmouseup = null;
			//隐藏框选盒子
			_this.box.style.display = 'none';
		}
		//取消默认行为
		return false;
	}
}
var boxCheck = new BoxCheck;

//文件夹构造函数，每new一次新建一个文件夹
function Folder(data){
	this.className = 'file-' + oderType.type;
	this.fileId = data.id;
	this.type = data.type;
	this.name = data.name;
	this.time = data.time;
	this.create(data);
}
Folder.prototype.create = function(data){
	var _this = this;
	this.file = document.createElement('div');
	this.file.className = this.className;
	this.file.fileId = this.fileId;
	this.file.check = null;
	this.file.fresh = true;
	
	this.checkBoxEle = document.createElement('span');
	this.checkBoxEle.className = 'checkbox';
	this.file.appendChild(this.checkBoxEle);
	
	this.imgEle = document.createElement('div');
	this.imgEle.className = 'image image-'+ this.type;
	this.file.appendChild(this.imgEle);
	
	this.nameEle = document.createElement('div');
	this.nameEle.className = 'name';
	this.nameEle.innerHTML = this.name;
	this.file.appendChild(this.nameEle);
	
	if(oderType.type == 'list'){
		this.timeEle = document.createElement('span');
		this.timeEle.innerHTML = regTime(this.time, 1);
		this.timeEle.className = 'time';
		this.file.appendChild(this.timeEle);
		
		this.funBtn = document.createElement('div');
		this.funBtn.className = 'function-btn';
		this.funBtn.innerHTML = '<span></span><span></span><span></span><span></span><span></span>';
		this.file.appendChild(this.funBtn);
		
		var spans = this.funBtn.children;
		this.funBtn.onclick = function(e){
			e.cancelBubble = true;
		}
		//移动到
		spans[2].onclick = function(){
			fun.fil = _this.file;
			prompt.show();
			prompt.moveShow('选择存储位置');
			prompt.addEventListener('moveto',prompt.moveto);
		}
		//重命名
		spans[3].onclick = function(){
			fun.fil = _this.file;
			fun.rename(fun.fil);
		}
		//删除
		spans[4].onclick = function(){
			fun.fil = _this.file;
			prompt.show();
			prompt.contentShow('删除文件','确定要删除该文件吗?');
			prompt.thumbDel = function(){
				prompt.delData(fun.fil.fileId);
				prompt.doCotaTree();
			}
			prompt.addEventListener('thumbDel',prompt.thumbDel);
		}
	}
	content.files.appendChild(this.file);
	content.ele.push(this.file);
	this.checkBoxEle.onclick = function(e){
		e.cancelBubble = true;
		if(_this.file.check){
			_this.file.check = false;
			removeClass(_this.file,'file-'+ oderType.type +'-checked');
			var num = content.checkEle.indexOf(_this.file);
			content.checkEle.splice(num,1);
		}else{
			_this.file.check = true;
			addClass(_this.file,'file-'+ oderType.type +'-checked');
			content.checkEle.push(_this.file);
		}
		nav.checkAll.check = content.ele.length == content.checkEle.length;
		nav.checkAll.className = nav.checkAll.check ? 'check' : '';
		if(e.which != 3){
			menu.hide();
		}
	}
	this.checkBoxEle.onmouseup = function(e){
		e.cancelBubble = true;
	}
	this.imgEle.onmousedown = function(e){
		//判断点的是右键，直接return
		if(e.which == 3) return;
		//判断如果当前移动的文件为未选中状态
		if(!_this.file.check){
			for (var i = 0; i < content.checkEle.length; i++) {
				content.checkEle[i].check = false;
				removeClass(content.checkEle[i],'file-'+ oderType.type +'-checked');
			}
			content.checkEle = [];
			_this.file.check = true;
			content.checkEle.push(_this.file);
		}
		//设置拖拽盒子中数字显示为目前选中元素的数量
		init.dragNum.innerHTML = content.checkEle.length;
		//设置数字元素的层级
		init.dragNum.style.zIndex = 201;
		init.dragBox.style.display = '';
		init.dragIco.innerHTML = '';
		//遍历所有选中的元素
		for (var i = 0; i < content.checkEle.length; i++) {
			//生成span
			var span = document.createElement('span');
			//根据当前循环的选中元素对应数据的type设置span的class
			span.className = 'darg_img img-type-' + data.type;
			//设置span的left和top
			span.style.left = (i+1) * 8 + 'px';
			span.style.top = (i+1) * 8 + 'px';
			//设置span的层级
			span.style.zIndex = 201 - (i+1);
			//将新生成的span放入拖拽盒子
			init.dragIco.appendChild(span);
		}
		document.onmousemove = function(e){
			//移动时设置拖拽盒子显示
			init.dragBox.style.display = 'block';
			//根据鼠标的位置设置盒子的位置
			init.dragBox.style.left = e.clientX + 20 + 'px';
			init.dragBox.style.top = e.clientY + 20 + 'px';
			//设置当前元素的class
			addClass(_this.file,'file-'+ oderType.type +'-checked');
		}
		document.onmouseup = function(){
			//鼠标抬起设置盒子隐藏，清空document.onmousemove
			init.dragBox.style.display = '';
			init.dragBox.style.left = '-9999px';
			init.dragBox.style.top = '-9999px';
			document.onmousemove = null;
			document.onmouseup = null;
		}
		//设置隐藏右键菜单
		menu.hide();
		return false;
	}
	this.file.onmousedown = function(e){
		e.cancelBubble = true;
	}
	this.file.onmouseenter = function(){
		_this.divOver(this);
	}
	this.file.onmouseleave = function(){
		_this.divOut();
	}
	this.file.onclick = function(){
		if(this.fresh){
			_this.divClick();
		}
	}
	this.file.onmouseup = function(){
		if(this.check) return;
		if(init.dragBox.style.display == 'block'){
			prompt.moveto(this.fileId);
			this.fresh = false;
		}else{
			this.fresh = true;
		}
	}
	this.file.oncontextmenu = function(e){
		if(!_this.file.check){
			for (var i = 0; i < content.checkEle.length; i++) {
				content.checkEle[i].check = false;
				removeClass(content.checkEle[i],'file-'+ oderType.type +'-checked');
			}
			content.checkEle = [];
			_this.file.check = true;
			addClass(_this.file,'file-'+ oderType.type +'-checked');
			content.checkEle.push(_this.file);
		}
		menu.show();
		menu.ele.list.style.left = e.clientX + 'px';
		menu.ele.list.style.top = e.clientY + 'px';
		return false;
	}
}
Folder.prototype.divOver = function(that){
	if(init.dragBox.style.display == 'block'){
		if(!this.file.check){
			addClass(this.file,'file-drag');
		}
	}else{
		addClass(this.file,'file-'+ oderType.type +'-hover');
	}
}
Folder.prototype.divOut = function(){
	removeClass(this.file,'file-'+ oderType.type +'-hover');
	removeClass(this.file,'file-drag');
}
Folder.prototype.divClick = function(){
	content.currentId = this.fileId;
	content.render(content.currentId);
}
//右侧文件夹区域的相关方法
function Container(){
	var _this = this;
	this.containerEle = document.getElementById('content');
	this.currentId = 0;
	this.ele = [];
	this.checkEle = [];
	this.files = $('#files');
	this.renameEle = $('#rename');
	this.createFolder = $('#createFolder');
	this.txt = $('#txt');
	this.empty = $('#empty');
	this.createFolder.onmousedown = function(e){
		e.cancelBubble = true;
	}
}
Container.prototype.addCheckEle = function(obj){
	if(this.checkEle.indexOf(obj) == -1){
		this.checkEle.push(obj);
	}
}
Container.prototype.removeCheckEle = function(obj){
	if(this.checkEle.indexOf(obj) !== -1){
		this.checkEle.splice(this.checkEle.indexOf(obj),1);
	}
}
Container.prototype.render = function(id){
	this.files.innerHTML = '';
	this.ele = [];
	this.checkEle = [];
	this.childData = findChildrenByPid(id);
	if(this.childData.length == 0){
		this.empty.style.display = 'block';
	}else{
		if(oderType.span.className == 'time'){
			this.childData = sortDataByTime(this.childData);
		}else{
			this.childData = sortDataByWord(this.childData);
		}
		this.empty.style.display = '';
	}
	for (var i = 0; i < this.childData.length; i++) {
		new Folder(this.childData[i]);
	}
	nav.render();
	for (var i = 0; i < this.ele.length; i++) {
		this.ele[i].index = i;
	}
	cotaTree.findDivRender(content.currentId);
}
content.render(content.currentId);
document.onmousedown = function(e){
	if(content.renameEle.style.display == 'block'){
		if(fun.fil){
			fun.isRename(true,fun.fil);
		}else{
			fun.isRename(true,content.checkEle[0]);
		}
		
	}
	if(content.createFolder.style.display == 'block'){
		fun.isCreat(true);
	}
	for (var i = 0; i < content.checkEle.length; i++) {
		content.checkEle[i].check = false;
		removeClass(content.checkEle[i],'file-'+oderType.type+'-checked');
	}
	nav.checkAll.check = false;
	nav.checkAll.className = '';
	content.checkEle = [];
	menu.hide();
}
document.oncontextmenu = function(){
	return false;
}
