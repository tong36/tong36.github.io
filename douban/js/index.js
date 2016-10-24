var list = $('.nav-tabs')[0];
var lis = $('a',list);
var inner = $('.inner');
var tip = $('#tip');
var submitBtn = $('#submit');
var searchForm = $('.search');
var timer = null;
timer = setInterval(function(){
	shake(tip[0],'left',10);
},4000)
tip.on('click',function(){
	document.body.scrollTop = 0;
})
lis.on('click',function(){
	for (var i = 0; i < lis.length; i++) {
		lis.get(i).parentNode.className = '';
	}
	this.parentNode.className = 'active';
	getData(this.innerHTML);
})
$(window).scroll(function(){
	if(document.body.scrollTop >= '800'){
		tip.css('opacity',1);
	}else{
		tip.css('opacity',0);
	}
})
submitBtn.on('click',function(){
	var txt = searchForm.find('.text')[0];
	if(txt.value == '') return;
	window.open('list.html');
	window.targetTxt =  txt.value;
	return false;
})
getData('流行');
function getData(tag){
	 $.getJSON('https://api.douban.com/v2/book/search?tag=' + tag +　'&count=21&callback=?', function(data){
	 	inner.html('');
	 	var rows = Math.ceil(data.count/3);
	 	for (var i = 0; i < rows; i++) {
	 		var row = document.createElement('div');
	 		row.className = 'row';
	 		for (var j = 1; j <= 3; j++) {
	 			var num = (i+j)+(2*i)-1;
	 			var col = document.createElement('div');
	 			col.className = 'col-md-4';
	 			
	 			var thumbnail = document.createElement('div');
	 			thumbnail.className = 'thumbnail';
	 			
	 			var img = document.createElement('img');
	 			img.src = data.books[num].images.large;
	 			img.alt = data.books[num].alt;
	 			img.index = num;
	 			thumbnail.appendChild(img);
	 			
	 			var caption = document.createElement('div');
	 			caption.className = 'caption';
	 			
	 			var h3 = document.createElement('h3');
	 			h3.className = 'title';
	 			h3.innerHTML = data.books[num].title;
	 			caption.appendChild(h3);
	 			
	 			var info = document.createElement('p');
	 			info.className = 'info';
	 			info.innerHTML = data.books[num].summary.slice(0,100) + '...';
	 			caption.appendChild(info);
	 			
	 			var btn = document.createElement('p');
	 			btn.className = 'clearfix';
	 			var a = document.createElement('a');
	 			a.className = "btn btn-primary fr";
	 			a.setAttribute('role','button');
	 			a.innerHTML = '查看详情';
	 			a.target = '_blank';
	 			a.href = 'https://book.douban.com/subject/'+data.books[num].id;
	 			btn.appendChild(a);
	 			caption.appendChild(btn);
	 			thumbnail.appendChild(caption);
	 			col.appendChild(thumbnail);
	 			row.appendChild(col);
	 			
	 			col.onmouseenter = function(){
	 				addClass(this,'hover');
	 				$('img',this)[0].style.cssText = 'width: 98px;height: 150px;';
	 			}
	 			col.onmouseleave = function(){
	 				removeClass(this,'hover');
	 				$('img',this)[0].style.cssText = '';
	 			}
	 		}
	 		inner[0].appendChild(row);
	 	}
	 })
}
