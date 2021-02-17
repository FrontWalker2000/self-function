// new创建
function newInstance(fn, ...args) {
	// 创建一个新对象
	const obj = {}
	// 修改this  call  apply
	const res = fn.call(obj, ...args)
	obj.__proto__ = fn.prototype // 修改原型
	// 返回新对象
	return res instanceof Object ? res : obj
}

// 原型检测
function myInstance(obj, fn){
	let prototype = fn.prototype// 显示原型
	let proto = obj.__proto__ //隐式原型
	// 遍历原型链
	while(proto){
		if(prototype === proto) {
			return true
		}
		proto = proto.__proto__
	}
	return false
}

// object全部合并
function mergeObj(...args) {
	let res = {}
	args.forEach(item=>{
		Object.keys(item).forEach(key=>{
			if(res.hasOwnProperty(key)){
				res[key] = [].concat(res[key], item[key])
			} else {
				res[key] = item[key]
			}
		})
	})
	return res
}


// 深拷贝递归（每次创建新的上下文）
function deepClone(target){
	// 类型
	if(typeof target ==='object' && target !== null){
		const res = Array.isArray(target) ? [] : {} // 每次新的上下文
		for(let key in target){
			// 检测该属性是否时对象本身属性(不能时原型上的)
			if(target.hasOwnProperty(key)){
				res[key] = deepClone(target[key])
			}
		}
		return res
	} else {
		return target 
	}
}

// 深拷贝 解决循环引用
function deepClone2(target, map = new Map()){
	// 类型
	if(typeof target ==='object' && target !== null){
		const res = Array.isArray(target) ? [] : {} // 每次新的上下文
		// 获取之前是否存入过结果递归
		let cache = map.get(target)
		if(cache){
			return cache
		}
		// 将新的结果存入容器中
		map.set(target, res)

		for(let key in target){
			// 检测该属性是否时对象本身属性(不能时原型上的)
			if(target.hasOwnProperty(key)){
				res[key] = deepClone2(target[key], map)
			}
		}
		return res
	} else {
		return target 
	}
}

