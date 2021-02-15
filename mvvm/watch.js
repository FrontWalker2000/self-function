class Watch {
  // 观察者， 目的是给需要变化的元素增加一个观察者，当数据发生变化的时候执行对应的方法
  constructor(vm, expr, cb) {
    this.vm = vm
    this.expr = expr
    this.cb = cb
    // 获取老值
    this.value = this.get()
  }
  get(){
    Dep.target = this
    let value = this.getVal(this.vm, this.expr)
    Dep.target = null
    return value
  }
  getVal(vm, expr) {
    expr = expr.split('.');
    return expr.reduce((prev, next) => {
      return prev[next];
    }, vm.$data)
  }
  // 向外暴露的方法
  update(){
    let newValue = this.getVal(this.vm, this.expr)
    let oldValue = this.value
    if(newValue !== oldValue) {
      this.cb(newValue)
    }
  }

}