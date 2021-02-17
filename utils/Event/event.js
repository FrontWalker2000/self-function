// 事件代理
function addEventListener(el, type, fn, sel) {
	// 类型
	if (typeof el === 'string') {
		el = document.querySelector(el)
	}
	if(!sel) {
		el.addEventListener(type, fn)
	} else {
		el.addEventListener(type, function(e){
			// 点击事件源
			const target = e.target
			// 是否相符
			if(target.matches(sel)) {
				fn.call(target, e)
			}
		})
	}
}


// 事件总线
const eventBus = {
	cbs: []
}
// 绑定事件
eventBus.on = function(type, fn){
	if(this.cbs[type]) {
		this.cbs[type].push(fn)
	} else {
		this.cbs[type] = [fn]
	}


}
// 触发事件
eventBus.emit = function(type, data){
	if(this.cbs[type] && this.cbs[type].length > 0) {
		this.cbs[type].forEach(cb=>{
			cb(data)
		})
	}
}

// 解绑事件
eventBus.off = function(evtName) {
	if (evtName) {
		delete this.cbs[evtName]
	} else {
		this.cbs = []
	}
}


// 发布订阅
const PubSub = {
	id: 1,
	cbs: {}
}

// 订阅
PubSub.subscribe = function(channel, cb){
	// 唯一id
	let token = 'token' + this.id ++
	if(this.cbs[channel]){
		this.cbs[channel][token] = cb
	} else {
		this.cbs[channel] = {
			[token]: cb
		}
	}
	return token
}

// 发布
PubSub.publish = function(channel, data){
	if(this.cbs[channel]) {
		Object.values(this.cbs[channel]).forEach(cb=> cb(data))
	}
}

// 取消订阅
PubSub.unSubscribe = function(flag) {
	if (!flag) {
		this.cbs = {}
	}
	if (typeof flag === 'string') {
		if(flag.includes('token')) {
			let cbObj = Object.values(this.cbs).find(obj=>obj.hasOwnProperty(flag))
			if (cbObj) {
				delete cbObj[flag]
			}
		} else {
			// 如果是渠道
			delete this.cbs[flag]
		}
	}
}
