const {log} = require('./utils/utils')
const {secretKey} = require('./utils/config')
const express = require('express')
const bodyParser = require('body-parser')
const session = require('cookie-session')
const nunjucks = require('nunjucks')
const app = express()
// 设置 bodyParser
app.use(bodyParser.urlencoded({
	extended: true,
}))
// 设置 session, 这里的 secretKey 是从 config.js 文件中拿到的
app.use(session({
	secret: secretKey,
}))

// 配置静态资源
const asset = __dirname + '/static'
app.use('/static', express.static(asset))

// 配置nunjucks模板， 第一个参数是模板文件的路径
nunjucks.configure('templates', {
	autoescape: true,
	express: app,
	noCache: true,
})
// 引入路由
const indexRouter = require('./routes/index')
// 配置路由
app.use('/', indexRouter)

// 启动服务器
const run = (port=3000, host='') => {
	// app.listen 方法返回一个 http.Server 对象, 这样使用更方便
	// 实际上这个东西的底层是我们以前写的 net.Server 对象
	const server = app.listen(port, host, () => {
		// 非常熟悉的方法
		const address = server.address()
		host = address.address
		port = address.port
		log(`listening server at http://${host}:${port}`)
	})
}

if (require.main === module) {
	const port = 4000
	// host 参数指定为 '0.0.0.0' 可以让别的机器访问你的代码
	const host = '0.0.0.0'
	run(port, host)
}