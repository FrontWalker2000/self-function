let http = require('http')
let url = require('url')
// 创建引用函数
function createApplication() {
	// app监听函数common
	let app = (req, res)=>{
		// 取出每一个layer 
		// 取出请求方法,路径
		let m = req.method.toLowerCase()
		let { pathname, query } = url.parse(req.url, true)

		// 通过next迭代
		let index = 0
		function next(err){
			if(index === app.routes.length) {
				return res.end('cannot')
			}
			let {method, path, handler} = app.routes[index ++]

			if (err) {
				if(handler.length === 4) {
					handler(err, req, res, next)
				} else {
					next(err)
				}

			} else {
				if(method === 'middle') {
					if(path === '/' || path === pathname || pathname.startWith(path + '/')) {
						handler(req, res, next)
					} else {
						next() // 没有匹配到走下一个路由
					}
				} else {
					if((method === m || method === 'all') && (path === pathname || path === '*')){
						return handler(req, res)
					} else {
						next()
					}
				}
			}
		}
		next()
	}

	// 创建请求路径信息收集
	app.routes = []

	// 中间件
	app.use = function(path, handler) {
		if(typeof handler !== 'function') {
			handler = path
			path = '/'
		}
		let layer = {
			method: 'middle',
			path,
			handler
		}
		app.routes.push(layer)
	}

	app.use(function(req, res, next){
		let {pathname, query} = url.parse(req.url, true)
		let hostname = req.headers['host'].split(':')[0]
		req.path = pathname
		req.query = query
		req.hostname = hostname
		next()
	})
	// 获取所有方法
	http.METHODS.forEach(method => {
		method = method.toLowerCase()
		app[method] = function(path, handler) {
			let layer = {
				method,
				path,
				handler
			}
			app.routes.push(layer)
		}
	})
	app.all = function(path, handler) {
		let layer = {
			method: 'all',
			path,
			handler
		}
		app.routes.push(layer)
	}
	app.listen = function(){
		let server = http.createServer(app)
		server.listen(...arguments)
	}
	return app

}
module.exports = createApplication
