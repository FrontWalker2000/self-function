class Observer {
  constructor(data) {
    this.observe(data)
  }

  observe(data) {
    // 对属性增加get/set
    if (!data || typeof data !== 'object') return
    // 循环对象 --劫持
    Object.keys(data).forEach(key => {
      this.defineReactive(data, key, data[key])
      this.observe(data[key])
    });
  }

  // 数据劫持
  defineReactive(obj, key, value) {
    let _this = this
    let dep = new Dep()
    Object.defineProperty(obj, key, {
      enumerable: true,
      configurable: true,
      get() {
        Dep.target && dep.addSub(Dep.target)
        return value
      },
      set(v) {
        if (value !== v) {
          _this.observe(v)
          value = v
          // 通知更新
          dep.notify()
        }
      }
    })
  }
}
class Dep {
  constructor() {
    // 订阅的素组
    this.subs = []
  }
  addSub(watcher){
    this.subs.push(watcher)
  }
  notify(){
    this.subs.forEach(watcher=>watcher.update())
  }
}