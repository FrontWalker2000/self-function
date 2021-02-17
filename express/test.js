let express =  require('./express')

let app= express()

// 中间件 
app.use('/', function(req, res, next){
	res.setHeader('Content-Type', 'text/html;charset=utf-8')
	console.log('middle')
	next('error')

})

// 常用请求 get  posy  put  delete 。。。
app.get('/age', function(req, res){
	res.end('age,页面')
})

// postman/  cmd
app.post('/name', function(req, res){
	res.end('name')
})

app.all('*', function(req, res){
	res.end('all')
})

// 错误中间件, 可连续调用
app.use(function(err, req, res, next) {
	console.log(err, '错误了')
})

app.listen(3000, function() {
	console.log('server 3000')
})

