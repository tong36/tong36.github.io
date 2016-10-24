var dataControl={
	getChildId:function(data,pid){
		var arr = []
		for (var i = 0; i < data.length; i++) {
			if(data[i].pid==pid){
				arr.push(data[i])
			}
		}
		return arr
	},

	getLeveById:function(data,id){
		return dataControl.getParents(data,id).length
	},

	getParents:function(data,currentId){
		var arr = []
		// console.log(currentId)
		for (var i = 0; i < data.length; i++) {
			if(data[i].id == currentId){
				arr.push(data[i])
				arr = arr.concat(dataControl.getParents(data,data[i].pid))
				break
			}
		};
		return arr
	},

	hasChild:function(data,id){
		return dataControl.getChildId(data,id).length !==0;
	},

	getMaxId:function(data){
		var id = data[0].id
		for (var i = 0; i < data.length; i++) {
			if( data[i].id > id){
				id = data[i].id
			}
		}
		return id
	},

	repetition:function(value,data,id){
		// 当前层级的Id
		var currentFilesData = dataControl.getChildId(data,id)

		for (var i = 0; i < currentFilesData.length; i++) {
			if(value == currentFilesData[i].title ){
				return false
			}
		}
		return true
	},

	firstElementFildId:function(obj,dataFileId){
		var arr = []
		for (var i = 0; i < obj.length; i++) {
			arr.push( obj[i].firstElementChild.getAttribute(dataFileId) )
		}
		return arr
	},
	// 返回当前Id下的所有子数据
	getChilds:function(data,currentId,arr,bl){
		if( arr.constructor === Boolean ){
			bl = arr;
			arr = null;
		}
		var arr = arr || [];

		var childs = dataControl.getChildId(data,currentId);
		if( bl ){
			for( var j = 0; j < data.length; j++ ){
				if( data[j].id == currentId ){
					arr.push(data[j]);
				}
			}
		}
		for( var i = 0; i < childs.length; i++ ){
			arr.push(childs[i]);
			dataControl.getChilds(data,childs[i].id,arr)
		}
		return arr;
	},

	// 删除数据
	delectDateByDate:function(data,childs){
		return data.filter(function(item){
			return !dataControl.contanins(childs,item)
		})
	},

	// return 返回值
	contanins:function(arr,item){
		for (var i = 0; i < arr.length; i++) {
			if( arr[i] == item) return true
		}
		return false
	},

	// 修改数据中的id.title名字
	changeDateName:function(datas,id,nanme){
		for (var i = 0; i < datas.length; i++) {
			if( datas[i].id == id ){
				datas[i].title = nanme
				return datas
				// return true
			}
		}
		// return false
	},
	// 判断数据中是否存在这个名字
	isNameExsit:function(data,id,names,currentId){
		var childs = dataControl.getChildId(data,id)
		for (var i = 0; i < childs.length; i++) {
			if( childs[i].title == names && childs[i].id != currentId ){
				return true
				break
			}
		};
		return false
	},

	// 判断当前层级 是否名称重复
	currentFiled:function( data,id,name ){
		var currentChilds = dataControl.getChildId(data,id) 
		for (var i = 0; i < currentChilds.length; i++) {
			if( currentChilds[i].title == name){
				return false
				break
			}
		}
		return true
	},

	// 返回id对应data.title的数据
	getIdTitle:function(datas,id){
		for (var i = 0; i < datas.length; i++) {
			if( datas[i].id == id ){
				return datas[i].title
				break
			}
		};
	},

	// 判断id 是否重复 
	judgeId:function(id,arr){
		for (var i = 0; i < arr.length; i++) {
			if( arr[i].firstElementChild.getAttribute('data-file-id') == id ){
				return false
				break
			}
		}
		return true
	},

	// 修改数据Id 层级
	changeDateId:function(datas,id){
		for (var i = 0; i < datas.length; i++) {
			if(datas[i].id == id ){
				datas[i].pid = id
			}
		}
	},

	getInfo:function(datas,id){
		for (var i = 0; i < datas.length; i++) {
			if(datas[i].id == id ){
				return datas[i]
			}
		}
	},

	getByIdchilds:function(data,currentId,checkeds){ //【2,3,4】
		// 判断我移动文件夹的 id 是不是 我顶层id 的子数据
		var arr = dataControl.getParents(data,currentId)
		console.log( arr )
		for (var i = 0; i < checkeds.length; i++) {
			for (var j = 0; j < arr.length; j++) {
				console.log( arr[j].id )
				if( checkeds[i] == arr[j].id ){
					return false
					break
				}
			};
		};
		return true
	}

}