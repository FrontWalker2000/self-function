// 获取仓库模板信息
const axios = require('axios')
const ora = require('ora')
const Inquirer = require('inquirer')
const path = require('path')

// 拉取文件
const {promisify} = require('util')
let dowLoadGitRepo = require('download-git-repo')
dowLoadGitRepo = promisify(dowLoadGitRepo)

// 复制文件
let ncp = require('ncp')
ncp = promisify(ncp)

/***复杂start******/

const fs = require('fs')
const MetalSmith = require('metalsmith')
let {render} = require('consolidate').ejs
render = promisify(render)

/****复杂end*****/

const {downloadDirectory} = require('./constance')


const fetchRepoList = async () => {
  const {data} = await axios.get('https://api.github.com/orgs/xx-cli/repos')
  return data
}
//封装loading
const waitLoading = (fn, message) => async (...args) => {
  const spinner = ora(message)
  spinner.start()// 开始加载
  let repos = await fn(...args)
  spinner.succeed()//结束加载
  return repos
}
// 抓取taglist
const fetchTagList = async (repo) => {
  const {data} = await axios.get(`https://api.github.com/repos/xx-cli/${repo}/tags`)
  return data
}

// 下载项目
const download = async (repo, tag) => {
  let api = `xx-cli/${repo}`
  if (tag) {
    api += `#${tag}`
  }
  const dest = `${downloadDirectory}/${repo}`
  await dowLoadGitRepo(api, dest)
  return dest
}


module.exports = async (proname) => {
  let repos = await waitLoading(fetchRepoList, 'fetch template ......')()
  repos = repos.map(item => {
    return item.name
  })
  const {repo} = await Inquirer.prompt({
    name: 'repo',
    type: 'list', //以list形式展现
    message: 'please choices a template to create project',
    choices: repos,
  })
  // console.log(repo)

  // 获取对应的版本号
  let tags = await waitLoading(fetchTagList, 'fetch tags...')(repo)
  tags = tags.map(item => item.name)
  const {tag} = await Inquirer.prompt({
    name: 'tag',
    type: 'list',
    message: 'please choices tags to crate project',
    choices: tags
  })
  // console.log(repo, tag)
  //下载项目, 返回临时存放目录
  const result = await waitLoading(download, 'dowload template ...')(repo, tag);

  if (!fs.existsSync(path.join(result, 'ask.js'))) {
    // 简单模板
    await ncp(result, path.resolve(proname))
  } else {
    // 复杂模板 需要用户选择，选择后编译模板
    await new Promise((resolve, reject) => {
      // 如果传入路径，就会遍历当前下的src文件
      MetalSmith(__dirname)
        .source(result)
        .destination(path.resolve(proname))
        .use(async (files, metal, done) => {
          // files 所有文件
          // 拿到提前配置好的信息，传下去 渲染
          const args = require(path.join(result, 'ask.js'))
          const obj = await Inquirer.prompt(args)
          const meta = metal.metadata()// 获取信息传入下一个中间件
          Object.assign(meta, obj)
          delete files['ask.js']
          done()
        })
        .use((files, metal, done) => {
          // 根据用户信息渲染模板
          const obj = metal.metadata()
          Reflect.ownKeys(files).forEach(async (file) => {
            if (file.includes('js') || file.includes('json')) {
              // 文件内容
              let content = files[file].contents.toString()
              if (content.includes('<%')) {
                content = await render(content, obj)
                files[file].contents = Buffer.from(content)
              }
            }
          })
          done()
        })
        .build(err => {
          if (err) {
            reject()
          } else {
            resolve()
          }
        })
    })

  }

}



