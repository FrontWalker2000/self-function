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


