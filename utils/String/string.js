// 字符串反转
function reverse(str) {
	let arr = [...str]
	return arr.reverse().join('')
}

//回文
function palindrom(str){
	return reverse(str) === str
}

// 字符串截断
function truncate(str, size){
	str.slice(0, size) + '...'
}