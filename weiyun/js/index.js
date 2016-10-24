(function(){
	var header = tools.$('.header')[0];
	var contentWrap = tools.$('.weiyun-content')[0];

	var headerH = header.offsetHeight;

	// 动态设置高度
	changeHeight()
	function changeHeight(){
		var viewHeight = document.documentElement.clientHeight;	
		contentWrap.style.height = viewHeight - headerH + "px";;
	}

	// 当window窗口改变的时候 
	window.onresize = changeHeight;

	// 存储的数据
	var datas = data.files;

	// 存储的pid
	var renderId = 0;

	// 文件夹区域
	var fileLlist = tools.$('.file-list')[0]
	var getPidInput = tools.$("#getPidInput");


	// 设置鼠标划入效果
	var fileList = tools.$('.file-list')[0]
	var fileItem = tools.$('.file-item',fileList)

	// 复选框
	var checkBox = tools.$('.checkbox',fileList)

	// 全选按钮
	var checkedAll = tools.$(".checked-all")[0];

	// 根据当前renderId 渲染页面
	fileLlist.innerHTML = createFilesHtml(datas,renderId)

	// 给文件夹添加点击事件、
	tools.addEvent(fileLlist,'click',function(ev){
		var target = ev.target
		// console.log(target.nodeType,target.nodeName,target)
		if( tools.parents(target,'.item') ){ // 确定点击事件 是 文件夹
			
			// 拿到点击事件的父级文件夹
			target = tools.parents(target,".item");
			var fileId = target.getAttribute('data-file-id')
			renderNavFilesTree(fileId)
			renderId = fileId

		}
	})


	// 全选按钮添加事件
	tools.addEvent(checkedAll,'click',function(){
		var isAddClass = tools.toggleClass(this,"checked"); 

		if( isAddClass ) {
			tools.each(fileItem,function(item,index){
				tools.addClass(item,"file-checked");
				//找到每个文件下对应checkbox
				tools.addClass(checkBox[index],"checked");
			})
		}else{
			tools.each(fileItem,function(item,index){
				tools.removeClass(item,"file-checked");
				tools.removeClass(checkBox[index],"checked");
			})
		}
	})

	// 回调函数 给每个文件夹添加事件
	tools.each(fileItem,function(item,index){
		fileHandle(item)
	})
   
	// 给文件单独添加事件
	function fileHandle(item){

		// 单选按钮
		var checkbox = tools.$(".checkbox",item)[0];

		//数鼠划过 
		tools.addEvent(item,'mouseenter',function(){
			tools.addClass(item,'file-checked')
		})

		tools.addEvent(item,'mouseleave',function(){
			if(tools.hasClass(checkbox,'checked')){
				tools.removeClass(this,"file-checked")
			}
		})

		tools.addEvent(checkbox,'click',function(ev){
			var isaddClass = tools.toggleClass(this,'checked');

			if(isaddClass){
				var cLeng = whoSelect().length
				if(  cLeng == checkBox.length ){
					tools.addClass(checkedAll,"checked");
				}
			}else{
				tools.removeClass(checkedAll,'checked')
			}
			ev.stopPropagation();
		})
	}

	// 渲染树状菜单
	var treeMenu = tools.$(".tree-menu")[0];
	treeMenu.innerHTML = treeHtml(datas,-1);

	// 树状菜单添加选中class默认在微云
	posotionTreeById(0)

	// 树状菜单添加点击事件 
	tools.addEvent(treeMenu,'click',function(ev){
		var target =  ev.target
		if( tools.parents(target,'.tree-title') ){
			target = tools.parents(target,'.tree-title');
			var fileId = target.getAttribute('data-file-id')
			renderNavFilesTree(fileId)
			renderId = fileId
		}
	})

	// 渲染面包屑导航
	var pathNav = tools.$('.path-nav')[0]
	pathNav.innerHTML = createPathNavHtml(datas,0)

	// 面包屑导航 添加点击事件
	tools.addEvent(pathNav,'click',function(ev){
		var target = ev.target
		if( tools.parents(target,'a') ){
			var fileId = target.getAttribute('data-file-id')
			renderNavFilesTree(fileId)
			renderId = fileId
		}
	})

	// 没有文件进行提醒
	var empty = tools.$(".g-empty")[0];

	// 找到所有checkbox勾选的文件
	function whoSelect(){
		var arr = []
		tools.each(checkBox,function(checkbox,index){
			if(!tools.hasClass(checkbox,'checked') ){
				arr.push( fileItem[index] )
			}
		})
		return arr
	}

	function renderNavFilesTree(fileId){
		console.log(fileId)
		// 面包屑导航 进行从新渲染
		pathNav.innerHTML = createPathNavHtml(datas,fileId)

		// 获取数据，空 false 有数据 true
		var hasChild = dataControl.hasChild(datas,fileId)

		// 判断是否让 让文件夹 隐藏  没有文件的时候进行提示
		if( hasChild ){
			empty.style.display = 'none'
			fileLlist.innerHTML = createFilesHtml(datas,fileId)
		}else{
			empty.style.display = 'block'
			fileList.innerHTML = "";
		}

		// treeMenu.innerHTML = treeHtml(datas,-1);
		
		var treeNav = tools.$(".tree-nav",treeMenu)[0];
		// console.log( treeNav )
		tools.removeClass(treeNav,'tree-nav')

		posotionTreeById(fileId)

		getPidInput.value = fileId;	

		tools.each(fileItem,function(item,index){
			fileHandle(item);
		})

		tools.removeClass(checkedAll,"checked");
	}

	// 删除按钮
	var delectBtn = tools.$('.delect')[0]

	// 删除按钮添加事件
	tools.addEvent(delectBtn,'click',removeFn)

	// 删除事件
	function removeFn(){
		var checkeds = whoSelect()
		
		if(checkeds.length !==0 ){ 
			var draggable = tools.$( '.draggable' )[0]
			var title = tools.$( '.title',draggable)[0]
			var draggableWrap = tools.$( '.draggable-wrap' )[0]

			draggableWrap.style.display = 'block'

			var affirm = tools.$('.affirm')[0]
			var abolish = tools.$('.abolish')[0]

			
			draggable.style.left = (window.innerWidth - draggable.offsetWidth) / 2 +'px'
			draggable.style.top = (window.innerHeight - draggable.offsetHeight) / 2 +'px'

			tools.moveBox(title,draggable)
			

			// 点击确定按钮 删除文件夹
			tools.addEvent(affirm,'click',delectDate)

			tools.addEvent(abolish,'click',function(){
				draggableWrap.style.display = 'none'
				tools.removeEvent( affirm,'click',delectDate )
			})
			
		}else{
			tipsFn('err','请选择需要删除,的文件夹')
		}
	}


	function delectDate(obj,arr){
		var checkeds = whoSelect()
		var arr = dataControl.firstElementFildId(checkeds,'data-file-id')
		var draggableWrap = tools.$( '.draggable-wrap' )[0]
		// 根据当前id 删除下面的所有子数据 返回一个新的data
		for (var i = 0; i < arr.length; i++) {
			var childs = dataControl.getChilds(datas,arr[i],true) 
			var newData = dataControl.delectDateByDate(datas,childs)
			datas = newData
		};
		
		draggableWrap.style.display = 'none'

		treeMenu.innerHTML = treeHtml(datas,-1);
		posotionTreeById(renderId)
		renderNavFilesTree(renderId)

		tipsFn('ok','文件删除成功')
	}

	// 重命名
	var renameBtn = tools.$('.rename')[0]
	// 重命名添加事件
	tools.addEvent(renameBtn,'click',renameFn)

	function renameFn(){
		var checked = whoSelect()
		var element = checked[0]
		console.log( typeof checked )
		if( checked.length == 1){
			// 给按钮添加一个自定义属性
			renameBtn.onOff = true

			var title = tools.$('.file-title',element)[0]
			var fileEdtor = tools.$('.file-edtor',element)[0]
			var edtor = tools.$('.edtor',element)[0]
			
			title.style.display = 'none'
			fileEdtor.style.display = 'block'
			edtor.value = ''
			edtor.select()
			
			// dataControl.currentFiled('')

			// dataControl.isNameExsit(datas,renderId,)data,id,names,currentId
		}else{
			tipsFn('err','请选择一个需要重名的文件夹')
		}
	}

	// 新建文件夹按钮
	var createBtn = tools.$('.create')[0] 

	// 新建文件夹添加点击事件
	tools.addEvent(createBtn,'mouseup',function(){
		// 把没有文件提示的东西给隐藏起来
		empty.style.display = 'none'

		var newElement = createFilesElement({
			title:'',
			id:(dataControl.getMaxId(datas)) + 1
		})

		// console.log( fileList.firstElementChild )
		fileList.insertBefore(newElement,fileList.firstElementChild)
		// console.log( newElement )
		// 获取新建文件下 输入框
		var textOld = tools.$('.file-title',newElement)[0]
		var textNew = tools.$('.file-edtor',newElement)[0]
		var edtor = tools.$('.edtor',newElement)[0]
	
		textOld.style.display = 'none'
		textNew.style.display = 'block'

		// 让input获取焦点
		edtor.select()

		// 给按钮添加一个状态
		createBtn.onOff = true

	})

	// 移动到
	var moveBtn = tools.$('.movebtn')[0]

	// 移动到 添加事件
	tools.addEvent(moveBtn,'click',moveFileFn)
		
	function moveFileFn(){
	
		var weiyun = tools.$('.weiyun')[0]
		var checkeds = whoSelect() 
		var len = checkeds.length
		
		
		if(len > 0 ){
			
			var getFirstId = checkeds[0].firstElementChild.getAttribute('data-file-id') 
			var dataContent = dataControl.getIdTitle(datas,getFirstId)
			var html = createStorage(datas,-1,dataContent,len)
			var draggableWrap = tools.$('.draggable-wrap')[0]
			document.body.insertBefore(html,draggableWrap)
			var fullPop = tools.$('.full-pop')[0]
			var move = tools.$('.move',fullPop)[0]

			var treeTitle = tools.$('.tree-title',fullPop)
			tools.between(fullPop)
			tools.moveBox(move,fullPop)
			
			// posotionTreeById(renderId)

			tools.each(treeTitle,function(item,index){
				moveClick(item)
			})


			var cancel = tools.$('.cancel')[0]
			var storage = tools.$('.storage')[0]
		// 取消按钮
			tools.addEvent(cancel,'click',function(){
				storage.style.display = 'none'
				document.body.removeChild(storage)
			})

		}else{
			tipsFn('err','请选择需要移动的文件夹')
		}
			
	}

	function moveClick(item){
		tools.addEvent(item,'click',function(){
			var id = item.getAttribute('data-file-id')
			var fileMovePathTo = tools.$('.fileMovePathTo')[0]
			var dataContent = dataControl.getIdTitle(datas,id)

			var checkeds = whoSelect() 
			var checkArr = dataControl.firstElementFildId(checkeds,'data-file-id')
			
			// var getFirstId = checkeds.firstElementChild.getAttribute('data-file-id')
			var onOff = dataControl.judgeId(id,checkeds)

			var backtrack = dataControl.getByIdchilds(datas,id,checkArr)

			fileMovePathTo.innerHTML = dataContent
			var error = tools.$('.error')[0]

			var confirm = tools.$('.confirm')[0]
			
			confirm.onOff = false


			if( backtrack  && onOff ){ // 真 没有重复
				error.innerHTML = ''
				for (var i = 0; i < checkeds.length; i++) {
					info = dataControl.getInfo( datas,checkeds[i].firstElementChild.getAttribute('data-file-id') );
					info.pid = id
				}
				confirm.style.opacity = 1;

				confirm.onclick = function(){
					treeMenu.innerHTML = treeHtml(datas,-1);

					posotionTreeById(renderId)

					renderNavFilesTree(renderId)

					tipsFn('ok','文件夹移动成功')

					var fullPop = tools.$('.full-pop')[0]
					fullPop.style.display = 'none'

					var storage = tools.$('.storage')[0]
					document.body.removeChild(storage)
				}

			}else{
				error.innerHTML = '不能移动到当前文件夹下'
				confirm.style.opacity = 0.6;
			}



			// if(1){
			// 	// alert(2)
			// 	error.innerHTML = ''
			// 	var info = []
			// 	for (var i = 0; i < checkeds.length; i++) {
			// 		info = dataControl.getInfo( datas,checkeds[i].firstElementChild.getAttribute('data-file-id') );
			// 		info.pid = id
			// 	};

			// 	// 返回真假
				
			// 	// var fullPop1 = 
				
			// 	// treeMenu.innerHTML = treeHtml(datas,-1);

			// 	// posotionTreeById(id)

			// 	// console.log( datas )
			// 	// 渲染数据

			
			// }
		})
	}

	var confirm = tools.$('.confirm')[0]



	// document添加down事件
	tools.addEvent(document,'mousedown',function(e){
		// 新建文件夹
		if( createBtn.onOff ){
			var firstElement = fileList.firstElementChild
			var edtor = tools.$('.edtor',firstElement)[0]
			var value = edtor.value.trim()

			var onOff = dataControl.repetition(value,datas,renderId)

			if( value !== '' &&  onOff ){
				var textOld = tools.$('.file-title',firstElement)[0]
				var textNew = tools.$('.file-edtor',firstElement)[0]

				textOld.style.display = 'block'
				textNew.style.display = 'none'

				textOld.innerHTML = value

				// 添加事件
				fileHandle(firstElement)

				var pid = getPidInput.value;

				var fileId = tools.$('.item',firstElement)[0].getAttribute('data-file-id')
				
				var newData = {
					id:fileId,
					pid:pid,
					title:value,
					type:'file'
				}

				datas.unshift(newData)

				// 树状菜单
				var element = document.querySelector(".tree-title[data-file-id='"+pid+"']");
				var nextElementUl = element.nextElementSibling;

				var level = dataControl.getLeveById(datas,fileId) // 13 返回俩个值 新文件夹 和 微云

				nextElementUl.appendChild(createTreeHtml({
					title:value,
					id:fileId,
					level:level
				}))

				if(nextElementUl.innerHTML !=='' ){
					tools.addClass(element,'tree-contro')
					tools.removeClass(element,'tree-contro-none')
				}
				console.log(datas)
				tipsFn('ok','新建文件夹成功')
				
			}else{
				fileList.removeChild(firstElement)
				if(value !== ''){
					tipsFn('err','存在重复,请从新输入')	
				}

				if(value == ''){
					tipsFn('err','请输入文件夹名')	
				}

				if(fileList.innerHTML === ''){
					empty.style.display = 'block'
				}
			}

			createBtn.onOff = false

		}

		// 重命名
		if( renameBtn.onOff == true ){

			var checked = whoSelect()
			var element = checked[0]
			var elementId = element.firstElementChild.getAttribute('data-file-id')
		
			var title = tools.$('.file-title',element)[0]
			var fileEdtor = tools.$('.file-edtor',element)[0]
			var edtor = tools.$('.edtor',element)[0]

			var judgeFileName = dataControl.currentFiled(datas,renderId,edtor.value)

			if(judgeFileName){
				title.style.display = 'block'
				fileEdtor.style.display = 'none'
				title.innerHTML = edtor.value

				dataControl.changeDateName(datas,elementId,edtor.value)

				treeMenu.innerHTML = treeHtml(datas,-1);
				posotionTreeById(renderId)
				renderNavFilesTree(renderId)

				tipsFn('ok','文件夹命名成功')
			}else{
				tipsFn('err','命名存在重复')
				title.style.display = 'block'
				fileEdtor.style.display = 'none'
			}

			renameBtn.onOff = false
		}

		// 取消复选勾选
		var checkLen = whoSelect().length
		if( checkLen > 0 && e.target.className == 'file-list clearFix' ){

			tools.each(fileItem,function(item,index){
				tools.removeClass(item,"file-checked");
				tools.removeClass(checkBox[index],"checked");
			})

			if( whoSelect().length === checkBox.length ){
				tools.addClass(checkedAll,"checked");
			}else{
				tools.removeClass(checkedAll,"checked");
			}
		}

	})
	
	// 提示窗口 待完善
	var fullTipBox = tools.$(".full-tip-box")[0];
	var tipText = tools.$(".text",fullTipBox)[0];

	function tipsFn(cls,title){

		//每次调用的时候，都要从-32px开始向0的位置运动

		fullTipBox.style.top = "-32px";
		fullTipBox.style.transition = "none";
		tipText.innerHTML = title
		setTimeout(function (){
			fullTipBox.className = "full-tip-box";
			fullTipBox.style.top = 0;
			fullTipBox.style.transition = ".3s";
			tools.addClass(fullTipBox,cls);
		},0)

		clearInterval(fullTipBox.timer);

		fullTipBox.timer = setTimeout(function (){
			fullTipBox.style.top = "-32px";
		},2300)
	}

	// 创建拖拽box
	var newDiv = null;
	var disX = 0,disY = 0;
	tools.addEvent(document,"mousedown",function (ev){

		//如果事件元素是在.nav-a这些元素身上，就没有框选效果
		var target = ev.target;
		if( tools.parents(target,".nav-a") || tools.parents(target,".file-item")  ){
			return;
		}


		disX = ev.clientX;
		disY = ev.clientY;

		//鼠标移动过程中
		tools.addEvent(document,"mousemove",moveFn);

		tools.addEvent(document,"mouseup",upFn);

		//去掉默认行为
		ev.preventDefault();

	})
	//移动的时候触发的函数
	function moveFn(ev){

		//在移动的过程中的位置-鼠标点击的位置 > 5 

		if( Math.abs(ev.clientX - disX) > 10 || Math.abs(ev.clientY - disY) > 10 ){

			if( !newDiv ){
				newDiv = document.createElement("div");
				newDiv.className = "box";
				document.body.appendChild(newDiv);
			}
			newDiv.style.width = 0;
			newDiv.style.height = 0;
			newDiv.style.display = "block";
			newDiv.style.left = disX + "px";
			newDiv.style.top = disY + "px";

			var w = ev.clientX - disX;
			var h = ev.clientY - disY;

			newDiv.style.width = Math.abs(w) + "px";
			newDiv.style.height = Math.abs(h) + "px";

			//鼠标移动的过程中的clientX和在鼠标摁下的disX，哪一个小就把这个值赋给newDiv

			newDiv.style.left = Math.min(ev.clientX,disX) + "px";
			newDiv.style.top = Math.min(ev.clientY,disY) + "px";

			tools.each(fileItem,function (item,index){
				if( tools.collisionRect(newDiv,item) )	{ 
					tools.addClass(item,"file-checked");
					tools.addClass(checkBox[index],"checked");
				}else{
					tools.removeClass(item,"file-checked");
					tools.removeClass(checkBox[index],"checked");
				}
			});

			if( whoSelect().length === checkBox.length ){
				tools.addClass(checkedAll,"checked");
			}else{
				tools.removeClass(checkedAll,"checked");
			}

		}

	}
	// document抬起函数
	function upFn(){
		tools.removeEvent(document,"mousemove",moveFn);	
		tools.removeEvent(document,"mouseup",upFn);	
		if(newDiv) newDiv.style.display = "none";
	}
	
})()