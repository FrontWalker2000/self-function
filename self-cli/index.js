#!/usr/bin/env node
const {version} = require('./src/constance')
const program = require('commander');
const path = require('path')
const mapAction = {
  create: {
    alias: 'c',
    description: 'create a project',
    examples: [
      'YJL-cli create <project-name>'
    ]
  },
  config: {
    alias: 'conf',
    description: 'config project variable',
    examples: [
      'YJL-cli config set <k><v>',
      'YJL-cli config get <v>'
    ]
  },
  '*': {
    alias: '',
    description: 'command not found',
    examples: []
  }
}

Reflect.ownKeys(mapAction).forEach(action => {
  program.command(action)// 配置命令
    .alias(mapAction[action].alias)//别名
    .description(mapAction[action].description)//描述
    .action(() => {
      if (action === '*') {
        // 访问命令不存在
        console.log(mapAction[action].description)
      } else { //
        // console.log(action)
        // 截取命令 YJL create paname
        require(path.resolve(__dirname, 'src', action))(process.argv[3])

      }
    })
})
// 监听用户的help事件
program.on('--help', () => {
  console.log('\nExamples:')
  Reflect.ownKeys(mapAction).forEach(action => {
    mapAction[action].examples.forEach(example => {
      console.log(example)
    })
  })
})
program
  .version(version, '-v, --version')
  .parse(process.argv);
