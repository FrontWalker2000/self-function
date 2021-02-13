// promise 的特点

// 承诺  
// 三个状态 pending resolve reject

let Promise = require('./plugin/promise')

let promise  = new Promise((resolve, reject)=>{
	console.log('promise')
	setTimeout(()=>{
		resolve(888)
	})
}).then(data=>{
	console.log(data)
},err=>{
	console.log(err, 9999)
})
console.log('2')



