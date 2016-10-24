
var container = $('.content');
var navs = $('.pageNav');
var tip = $('#tip');
var topInfo = $('.bg-success');
var submitBtn = $('#submit');
var searchForm = $('.navbar-form');
var page = 1;
var pages = 1;
var prePage = 20;
var timer = null;
var keyWord = window.opener.targetTxt;
//初始化
getData();

//设置回到顶部提示震动
timer = setInterval(function(){
	shake(tip[0],'left',10);
},4000)
//点击回到顶部按钮，设置滚动条高度为0
tip.on('click',function(){
	document.body.scrollTop = 0;
})
//监听滚动条变化
$(window).scroll(function(){
	if(document.body.scrollTop >= '800'){
		tip.css('opacity',1);
	}else{
		tip.css('opacity',0);
	}
})

submitBtn.on('click',function(){
	var txt = searchForm[0].text;
	console.log(txt)
	if(txt.value == '') return;
	keyWord =  txt.value;
	getData();
	return false;
})

function getData(){
	$.getJSON('https://api.douban.com/v2/book/search?q='+keyWord+'&callback=?&count='+prePage+'&start='+prePage *(page - 1),function(data){
		//渲染主体
		var str = '';
		pages = Math.ceil(data.total/data.count);
		for (var i = 0; i < data.books.length; i++) {
			str += `<div class="media">
					  <div class="media-left media-middle">
					    <a target="_blank" href="https://book.douban.com/subject/${data.books[i].id}">
					      <img class="media-object" src="${data.books[i].image}" alt="${data.books[i].alt_title}">
					    </a>
					  </div>
					  <div class="media-body">
					    <h4 class="media-heading">${data.books[i].title}</h4>
					    <p>
						    <strong>作者:</strong>`
							for (var j = 0; j < data.books[i].author.length; j++) {
								str += '<i>'+data.books[i].author[j]+'</i>'
							}
					    str +=`</p>
					    <p>
						    <strong>价格:</strong>
							<i>${data.books[i].price}</i>
					    </p>
					    <p>
						    <strong>出版社:</strong>
							<i>${data.books[i].publisher}</i>
					    </p>
					    <p>
						    <strong>标签:</strong>`;
							for (var j = 0; j < data.books[i].tags.length; j++) {
								str += '<i class="tag">'+data.books[i].tags[j].name+'</i>'
							}
					   str +=` </p>
					   <p>
						    <strong>简介:</strong>
							<i>${data.books[i].summary.slice(0,100)}...</i>
					    </p>
					  </div>
					</div>`
		}
		container.html(str);
		
		
		//渲染分页
		var pageNum = getPageLimit(pages, 9, page)	//object
		var pageHtml = `<ul class="pagination pagination-lg">
			    <li class="prev">
			      <a href="javascript:;" aria-label="Previous">
			        <span aria-hidden="true">&laquo;</span>
			      </a>
			    </li>`
		
				for (var i = pageNum.start; i <= pageNum.end; i++) {
					if(i == page){
						pageHtml +='<li class="active pageTo"><a href="javascript:;">'+i+'</a></li>'
					}else{
						pageHtml +='<li class="pageTo"><a href="javascript:;">'+i+'</a></li>';
					}
				}
			   pageHtml += `<li class="next">
			      <a href="javascript:;" aria-label="Next">
			        <span aria-hidden="true">&raquo;</span>
			      </a>
			    </li>
			  </ul>`;
		navs.html(pageHtml);
		
		//渲染头信息
		topInfo.html('搜索结果：一共<i>'+data.total+'</i>条数据，<i>'+prePage+'</i>条/页，共<i>'+pages+'</i>页，当前第<i>'+page+'</i>页')
		
		//设置页码的点击事件
		var pageAs = $('.pageTo');
		pageAs.on('click',function(){
			page = parseInt($('a',this).eq(0).html());
			getData();
			$("body")[0].scrollTop = 0;
		})
		//点击上一页
		$('.prev').on('click',function(){
			page--;
			getData();
			$("body")[0].scrollTop = 0;
		})
		//点击下一页
		$('.next').on('click',function(){
			page++;
			getData();
			$("body")[0].scrollTop = 0;
		})
		
		
		//设置每个消息盒子的鼠标移入移出事件
		var boxs = $('.media');
		boxs.on('mouseenter',function(){
			$(this).css(
				{
					marginTop:24,
					boxShadow:'0 0 10px blue'
				}
				);
		})
		boxs.on('mouseleave',function(){
			$(this).css(
				{
					marginTop:'',
					boxShadow:''
				}
				);
		})
	})
}
//根据参数确定当前显示的页码的起始数和结束数
function getPageLimit(pages, showpages, page) {
    //计算当前页左偏移量
    var offsetLeft = Math.floor( showpages / 2 );
    //根据偏移量计算start
    var start = Math.max(1, page - offsetLeft);
    //根据start和showpages计算出end
    var end = Math.min(pages, start + showpages - 1);
    //根据end和showpages计算start：避免显示的页码数小于要显示的showpages
    start = Math.max(1, end - showpages + 1);
    return {
        start: start,
        end: end
    }
}

