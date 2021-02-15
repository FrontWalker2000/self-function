class MVVM {
  constructor(options) {
    this.$el = options.el;
    this.$data = options.data;
    // 编译
    if (this.$el) {
      // 数据劫持，把所有的属性加上get/set
      new Observer(this.$data)
      this.proxyDate(this.$data)
      // 数据到元素编译
      new Compile(this.$el, this)
    }
  }

  proxyDate(data) {
    Object.keys(data).forEach((key) => {
      Object.defineProperty(this, key, {
        get() {
          return data[key]
        },
        set(v) {
          data[key] = v
        }
      })
    })
  }
}