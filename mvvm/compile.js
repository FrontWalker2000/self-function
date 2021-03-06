// 编译
class Compile {
  constructor(el, vm) {
    this.el = this.isElementNode(el) ? el : document.querySelector(el)
    this.vm = vm
    if (this.el) {
      let fragment = this.node2Fragment(this.el)
      this.compile(fragment)
      this.el.appendChild(fragment)
    }
  }

  /******************辅助方法*******************/
  isElementNode(node) {
    return node.nodeType === 1;
  }

  isDirective(name) {
    return name.includes('v-')
  }

  /*******************核心方法******************/
  compileElement(node) {
    let attrs = node.attributes
    Array.from(attrs).forEach(attr => {
      // 判断属性名称中是否包含v-
      let attrName = attr.name;
      if (this.isDirective(attrName)) {
        // 取到对应的值放到节点中
        let expr = attr.value;
        let [, type] = attrName.split('-');
        CompileUtil[type](node, this.vm, expr)
      }
    })
  }

  compileText(node) {
    let expr = node.textContent
    let reg = /\{\{([^}]+)\}\}/g
    if (reg.test(expr)) {
      // node  this.vm.$data text
      CompileUtil['text'](node, this.vm, expr)
    }
  }

  compile(fragment) {
    // 递归
    let childNodes = fragment.childNodes
    Array.from(childNodes).forEach(node => {
      if (this.isElementNode(node)) {
        // 元素节点
        this.compileElement(node)
        this.compile(node)
      } else {
        // 文本节点
        this.compileText(node)
      }
    })
  }

  node2Fragment(el) {
    let fragment = document.createDocumentFragment()
    let firstChild;
    while (firstChild = el.firstChild) {
      fragment.appendChild(firstChild)
    }
    return fragment
  }
}

CompileUtil = {
  getVal(vm, expr) {
    expr = expr.split('.');
    return expr.reduce((prev, next) => {
      return prev[next];
    }, vm.$data)
  },
  // 文本处理
  text(node, vm, expr) {
    let updateFn = this.update['textUpdate'];
    // RegExp 分组自动挂载在RegExp  /\{\{([^}]+)\}\}/g
    expr = RegExp.$1
    new Watch(vm, expr, () => {
      // 数据变化， 文本节点需要重新获取依赖属性更新文本中的内容
      updateFn && updateFn(node, this.getVal(vm, expr))
    })
    updateFn && updateFn(node, this.getVal(vm, expr))
  },
  setVal(vm, expr, value){
    expr = expr.split('.')
    return expr.reduce((prev, next, currentIndex)=>{
      if(currentIndex === expr.length -1){
        return prev[next] = value
      }
      return prev[next]
    }, vm.$data)
  },
  // 输入处理
  model(node, vm, expr) {
    let updateFn = this.update['modelUpdate'];
    // 数据变化调用watch cb
    new Watch(vm, expr, (newValue) => {
      // 当值变化的时候，调用cb，将新值传递过来
      updateFn && updateFn(node, this.getVal(vm, expr))
    })
    node.addEventListener('input', (e)=>{
      let newValue = e.target.value
      this.setVal(vm, expr, newValue)
    })
    updateFn && updateFn(node, this.getVal(vm, expr))
  },
  update: {
    // 文本更新
    textUpdate(node, value) {
      node.textContent = value
    },
    // 输入更新
    modelUpdate(node, value) {
      node.value = value
    }
  }
}