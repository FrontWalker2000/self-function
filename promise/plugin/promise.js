/**
 * promise构造器
 *
 **/

const PENDING = 'PENDING'
const RESOLVE = 'RESOLVE'
const REJECT = 'REJECT' // 公用的3种状态
class Promise{
	constructor(excutor){
		this.state = PENDING
		this.value = '' // 成功参数
		this.reason = '' // 失败参数

		this.onResolveCB = [] //成功
		this.onRejectCB = [] // 失败

		let resolve = (value) => {
			if(this.state === PENDING) {
				this.value = value // 成功传参
				this.state = RESOLVE // 失败传参
				this.onResolveCB.forEach(cb=>cb()) // 循环调用
			}
		}
		let reject = (err) => {
			if(this.state === PENDING) {
				this.reason = err
				this.state = REJECT
				this.onRejectCB.forEach(cb=>cb())
			}
		}
		try{
			excutor(resolve, reject)// 默认立即执行函数
		} catch(e){
			reject(e)
		}
	}
	// 异步执行
	then(onFul, onReject){
		// 同步
		if(this.state === RESOLVE){
			onFul(this.value)
		}
		if(this.state === REJECT){
			onReject(this.reason)
		}

		// 异步收集发布订阅 在pending时收集，状态确定时再依次执行
		if(this.state === PENDING){
			this.onResolveCB.push(()=>{
				onFul(this.value)
			})
			this.onRejectCB.push(()=>{
				onReject(this.reason)
			})
		}
	}
	// promise函数上的方法  resolve
	resolve(){

	}
  	// promise函数上的方法  reject
	reject(){

	}
	/**
	 * promise函数上的方法  all
	 * 返回一个promise， 只有当所有的promise都成功才成功，否则只要一个失败就失败
	 */
	all(){

	}
	/**
   	 * promise函数上的方法  race
   	 * 返回一个promise，只要一个成功就成功
   	 */
	race(){

	}
	// 错误统一处理
	catch(){

	}
}
module.exports = Promise