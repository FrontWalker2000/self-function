// map基于for循环 生成新数组
function map(arr, cb) {
	let res = []
	for (let i = arr.length - 1; i >= 0; i--) {
		res.push(cb(arr[i], i))
	}
	return res
}

// reduce方法， 基于for循环类处理
function reduce(arr, cb, initValue){
	let res = initValue

	for(let i=0; i<arr.length;i++) {
		res = cb(res, arr[i])
	}
	return res;
}


// filter过滤, 返回真假处理
function filter(arr, cb) {
	let res = []
	for(let i=0; i<arr.length;i++) {
		let bool = cb(arr[i], i)
		if(bool) {
			res.push(arr[i])
		}
	}
	return res;
}

// find
function find(arr, cb) {
	let res = null
	for(let i=0; i<arr.length;i++) {
		let bool = cb(arr[i], i)
		if(bool) {
			return arr[i]
		}
	}
	return res;
}


// 数组去重
function unique(arr) {
	let res = []
	arr.forEach(item =>{
		if(!res.includes(item)){
			res.push(item)
		}
	})
	return res
}


// concat 数组合并， 最多支持一维数组
function concat(arr, ...args){
	let res = [...arr]
	args.forEach(item=>{
		// 是否是数组
		if(Array.isArray(item)) {
			res.push(...item)
		} else {
			res.push(item)
		}
	})
	return res
}


// slice数组切片
function slice(arr, start, end) {
	start = start || 0
	end = end || arr.length
	let res = []

	if(arr.length === 0 || start >=arr.length) return res
	for(let i=0; i<arr.length;i++){
		if(i >= start && i< end){
			res.push(arr[i])
		}
	}
	return res
}


// 数组扁平化递归
function flatten(arr){
	let res = []
	arr.forEach(item=>{
		if (Array.isArray(item)) {
			// 递归执行加入res， 递归每次新建上下文
			res = res.concat(flatten(item))
		} else{
			res.push(item)
		}
	})
	return res 
}

// 数组扁平化some(返回布尔)
function flatten2(arr){
	let res = [...arr]
	// 基于some唯一判断, 有一个满足就为真
	while(res.some(item=>Array.isArray(item))){
		res = [].concat(...res)
	}
	return res
}


// 数组切片机分组
function chunk(arr, size = 1){
	let res = []
	let temp = [] // 临时
	arr.forEach(item=>{
		// 存入临时数组
		if(temp.length ===0){
			res.push(temp)
		}
		temp.push(item)
		// 满足长度清空
		if(temp.length === size){
			temp = []
		}
	})
	return res
}


// 数组差集
function different(arr1, arr2=[]) {
	if (arr1.length === 0) {
		return []
	}
	if(arr2.length === 0) {
		return arr1.slice()// 返回新数组
	}
	let res = arr1.filter(item=> !arr2.includes(item))
	return res
}

// 删除相同的元素
function pull(arr, ...args){
	let res = []
	for (var i = 0; i < arr.length; i++) {
		if(args.includes(arr[i])) {
			res.push(arr[i]) // 保存
			arr.splice(i, 1) // 删除元素
			i--// 下标自减
		}
	}
	return res
}

// 删除相同的元素
function pullArray(arr, arr2){
	let res = pull(arr, ...arr2)
	return res
}

