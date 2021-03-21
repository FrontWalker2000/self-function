//高阶函数 伪代码
// 1. 如果函数的参数是一个函数，
// 2. 如果一个函数返回了一个函数（返回函数就是高阶函数）


// 常见的高阶函数应用
// 有一个核心的功能


// AOP 面向切片编程-------------------------------------------------------
function say(per) {
	console.log(per + '说话')
}
//基本
Function.prototype.before = function(cb) {
	console.log(this === say) // true
	return (...args)=>{ 
		cb()
		this(...args) // this = say  这里的this指代say
	}
};

let newFun = say.before(function(){
	console.log('说话前')
})
newFun('我')




// 函数劫持---------------------------------------------------------------
let oldPush = Array.prototype.push

function push(...args){
	// this指代arr数组   call和apply 1. 改变执行函数内部的this指向， 2. 函数立即执行，3. 想执行的函数中传入参数
	oldPush.call(this, ...args)
}
let arr = [1,2,3]
push.call(arr, 4,5,6,7)
console.log(arr)



// 事务--------------------------------------------------------------------
function perform(any, waps){
	return () =>{
		waps.forEach(wap=> wap.init())
		any()
		waps.forEach(wap=> wap.close())
	}
}

let wap = perform(function(){
	console.log('say')
}, [{
	init(){
		console.log('wap1 before')
	},
	close(){
		console.log('wap1 end')
	}	
},{
	init(){
		console.log('wap2 before')
	},
	close(){
		console.log('wap2 end')
	}
}])
wap()


// 闭包----------------------------------------------------------------
function after(times, cb){
	// AO对象中存储times
	return function(){
		if(--times===0){
			cb()
		}
	}
}
let fn = after(3, function(){
	console.log('start')
})
fn()
fn()
fn()



// 文件读取 --------------------------------------------------------------
// let fs = require('fs')
// function handler(times, cb){
// 	let obj = {}
// 	return function(key, value){
// 		obj[key] = value
// 		if(--times === 0) {
// 			cb(obj)
// 		}
// 	}
// }

// let out = handler(2, function(res){
// 	console.log(res)
// })                        
// fs.readFile('../promis e.js', 'utf8', function(err, data){
// 	out('name', 'yjl')
// })

// fs.readFile('../promise.js', 'utf8', function(err, data){
// 	out('age', 29)
// })



//发布emit，订阅on 两者之间没有非必要的联系------------------------------------------------------------------
let fs = require('fs')

let event = {
	cbs:[],
	on(cb){
		this.cbs.push(cb)
	}, 
	emit(){
		this.cbs.forEach(cb=>cb())
	}
}
let obj1 = {}
event.on(function(){
	console.log('++')
})
event.on(function(){
	if(Object.keys(obj1).length === 2){
		console.log(obj1)
	}
})

fs.readFile('../promis e.js', 'utf8', function(err, data){
	obj1.name = 'yjl'
	event.emit()
})

fs.readFile('../promise.js', 'utf8', function(err, data){
	obj1.age = 29
	event.emit()
})


// 观察者模式, 基于发布订阅 ----------------------------------------------------------
class Subject{
	constructor(){
		this.arr = []
		console.log(88)
		this.state = ''
	}
	attach(p){
		this.arr.push(p)
	}
	setState(state){
		this.state = state
		this.arr.forEach(p=>p.update(state))
	}
}

class Observer{
	constructor(name){
		this.name = name
	}
	update(state){
		console.log(this.name + state)
	}
}

let s = new Subject('child')
let o1 = new Observer('parent1')
let o2 = new Observer('parent2')

s.attach(o1)
s.attach(o2)
s.setState('no')