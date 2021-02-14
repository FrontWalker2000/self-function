// 实现call方法 立即执行
function call(fn, obj, ...args) {
	console.log(99)
	if(obj === undefined || obj === null) {
		obj = globalThis // 判断
	}
	// 赋值临时方法
	obj.temp = fn
	let res = obj.temp(...args)
	delete obj.temp //删除临时方法
	return res
}

// 实现apply方法 立即执行
function apply(fn, obj, args){

	if(obj === undefined || obj === null) {
		obj = globalThis // 判断
	}
	// 赋值临时方法
	obj.temp = fn
	let res = obj.temp(...args)
	delete obj.temp //删除临时方法
	return res
}

// bind方法 返回新函数
function bind(fn, obj, ...args){
	return function(...args2){
		// 执行call函数
		return call(fn, obj, ...args, ...args2)
	}
}


// 节流出发频繁 控制函数执行的间隔,每隔指定时间执行一次，  滚动-点击-窗口等等
function throttle(cb, times) {
	let start = 0 //开始时间
	return function(e){
		// 当前时间
		let now = Date.now()
		if(now-start >=times){
			cb.call(this, e)
			start = now
		}
	}
}

// 防抖 控制当事件触发后，在等待过程中不执行事件，如果没有再次触发，会执行最后一次事件
function debounce(cb, times){
	let timer = null
	return function(e){
		if(timer !==null) {
			clearTimeout(timer)
		}
		// 间隔时间
		timer = setTimeout(()=>{
			cb.call(this, e)
			timer = null
		}, times)
	}
}

