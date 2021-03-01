'use strict'
const fs = require('fs-extra')

let productionParams = []
let testParams = []

module.exports = {
  meta: {
    docs: {
      description: '手机银行页面环境地址配置参数一致性检查',
      category: 'Fill me in',
      recommended: false
    },
    fixable: null,  // or "code" or "whitespace"
    schema: [
      // fill in your schema
    ]
  },

  create: function (context) {
    // 获取指定配置文件内容
    let testContent = fs.readFileSync('./src/config/environment/test.js').toString()
    let productionContent = fs.readFileSync('./src/config/environment/production.js').toString()

    //获取test配置参数//
    function getTestParams () {
      testParams = testContent.split('\n')
      for (let i = 0; i < testParams.length; i++) {
        if (!testParams[i].includes(':')) {
          testParams.splice(i, 1)
        }
      }
      return testParams
    }

    //获取Production配置参数
    function getProductionParams () {
      productionParams = productionContent.split('\n')
      for (let i = 0; i < productionParams.length; i++) {
        if (!(productionParams[i].includes(':'))) {
          productionParams.splice(i, 1)
        }
      }
      return productionParams
    }

    //错误提示
    function errorReport (node, msg) {
      context.report({
        node,
        message: msg
      })
    }

    // 配置页面校验
    function pageParamsCheck (node) {
      if (!context.getFilename().includes('environment')) {
        return false
      }

      // 判断生产和测试的key个数是否相等
      if (getTestParams().length !== getProductionParams().length) {
        let msg = `生产production和测试test文件的环境地址配置参数key个数请保持一致！`
        errorReport(node, msg)
        return false
      }
      //校验key是否相等
      for (let i = 0; i < getTestParams().length; i++) {
        if (getTestParams()[i].includes(':') || getTestParams()[i].includes(':')) {
          if (getTestParams()[i].split(':')[0] !== getProductionParams()[i].split(':')[0]) {
            let msg = `环境地址配置参数key：生产production文件的"${getProductionParams()[i].split(':')[0].trim()}"和测试test文件的"${getTestParams()[i].split(':')[0].trim()}"请保持一致性！`
            errorReport(node, msg)
          }
        }
      }
    }

    return {
      ExportDefaultDeclaration (node) {
        pageParamsCheck(node)
      }
    }
  }
}
