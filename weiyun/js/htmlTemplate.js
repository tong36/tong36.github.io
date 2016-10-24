//单个文件的结构
function fileConstruct(fileData){
    var str = `
            <div class="item" data-file-id="${fileData.id}">
                <lable class="checkbox"></lable>
                <div class="file-img">
                    <i></i>
                </div>
                <p class="file-title-box">
                    <span class="file-title">${fileData.title}</span>
                    <span class="file-edtor">
                        <input class="edtor" value="${fileData.title}" type="text"/>
                    </span>
                </p>
            </div>
    `;  

    return str;
}

//准备文件区域的html结构
function filesHtml(fileData){
    var fileHtml = `
        <div class="file-item">
            ${fileConstruct(fileData)}
        </div>
        `;
    return fileHtml;
}


// 根据当pid值渲染文件夹区域的页面
function createFilesHtml(datas,renderId){
	var childs = dataControl.getChildId(datas,renderId)
	var html=''
	childs.forEach(function(item){
		html+=filesHtml(item)
	})
	return html
}
// 创建文件夹
function createFilesElement(fileData){
    var newDiv = document.createElement('div')
    newDiv.className = 'file-item'
    newDiv.innerHTML = fileConstruct(fileData)
    return newDiv
}
// 树形菜单html结构
function treeHtml(data,treeId){

    var childs = dataControl.getChildId(data,treeId);
    var html = "<ul>";

    childs.forEach(function (item){
        //获取到当前数据的层级 通过id获取
        var level = dataControl.getLeveById(data,item.id);
        /*tree-nav tree-contro*/

        //判断当前这个数据有没有子数据 通过id判断
        var hasChild = dataControl.hasChild(data,item.id);
        var classNames = hasChild ? "tree-contro" : "tree-contro-none";

        html += `
            <li>
                <div class="tree-title ${classNames}" data-file-id="${item.id}" style="padding-left:${level*14}px">
                    <span>
                        <strong class="ellipsis">${item.title}</strong>
                        <i class="ico"></i>
                    </span>
                </div>
                ${treeHtml(data,item.id)}
            </li>
        `   
    })

        
    html += "</ul>";

    return html;
}

// 树状菜单添加class 选中样式
function posotionTreeById( pId,parent ){
    var parent = parent || document
    var ele = parent.querySelector(".tree-title[data-file-id='"+pId+"']")
    console.log(ele)
    tools.addClass(ele,'tree-nav')
}

// 面包屑导航
function createPathNavHtml(datas,fileId){
    var parents = dataControl.getParents(datas,fileId).reverse()
    // console.log( parents )
    var html = ''
    var len = parents.length
    parents.forEach(function(item,index){
        // 保证数据在当前页的时候 不可以点击 可以点击上一页
        if(index === parents.length - 1)return
        html +=`
            <a href="javascript:;" style="z-index:${len--}" data-file-id="${item.id}">
                    ${item.title}
            </a> 
            `
    })
    html += `
            <span class="current-path" style="z-index:${len--}">
                ${parents[parents.length-1].title}
            </span>
        `;
    return html
}

// 新建文件夹的时候创建的菜单 
function createTreeHtml(options){
    var newLi = document.createElement("li");
    newLi.innerHTML = `
                <div class="tree-title tree-contro-none" data-file-id="${options.id}" style="padding-left:${options.level*14}px">
                    <span>
                        <strong class="ellipsis">${options.title}</strong>
                        <i class="ico"></i>
                    </span>
                </div>
                <ul></ul>
    `;
    return  newLi;
}

// 创建移动到窗口
function createStorage(datas,num,dataContent,len){

    var newDiv = document.createElement('div')
    newDiv.className = 'storage'
    // 遮罩层
    var mask = this.mask = document.createElement('div');

    mask.className = 'mask'
    mask.style.cssTest = 'z-index:2001;position:absolute;left:0px;top:0px;visibility:hidden';

    var fullPop = this.fullPop = document.createElement('div');
    fullPop.className = 'full-pop';
    // fullPop.style.cssText = 'z-index:2001;position:absolute;left:0px;top:0px;';

    fullPop.innerHTML =`
        <h3 class = "move">
            <p class="title">选择存储位置</p>
            <a href="javascript:void(0);" class="close" title="关闭">×</a>
        </h3>
        <div class="dialog">
            <p class="dir-file">
                <span class="file-img"></span>
                <span class="file-name">${dataContent}</span>
                <span class="total" style="color:#868686;margin:left:12;">${len}个文件</span>
            </p>
            <div class="dir-box">
                <div class="cur-dir">
                    <span>移动到：</span><span class="fileMovePathTo">微云</span>
                </div>
                <div class="dirTree">
                     ${treeHtml(datas,num)}
                </div>
            </div>
        </div>
        <div class="pop-btns">
            <span class="error"> </span>
            <a href="javascript:void(0)" class="confirm">确定</a>
            <a href="javascript:void(0)" class="cancel">取消</a>
        </div>
        `;
    newDiv.appendChild(mask)
    newDiv.appendChild(fullPop)

    return newDiv
}

