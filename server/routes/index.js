const {log} = require('../utils/utils')
const express = require('express')
const index = express.Router()
const User = require('../models/user')

// 首页
index.get('/', async(req, res) => {
	let u = await User.currentUser(req)
	const args = {
		user: u,
	}
	res.render('index.html', args)
})

// 注册
index.post('/register', async(req, res) => {
	let form = req.body
	const u = await  User.register(form) || {
		code: 0,
		status: '注册失败',
	}
	log('u', u)
	res.send(u)
})

// 登录
index.post('/login', async(req, res) => {
	let form = req.body
	const u = await User.validateAuth(form)
	if (u != false) {
		req.session.uid = u.id
		// res.send(req.session)
		res.redirect('/')
	} else {
		res.send('登录失败')
	}
})

// 注销
index.post('/logOut', async(req, res) => {
	// 将session 清空 「失败」
	req.session = null
	res.redirect('/')
})
// 用户信息补全
// 更改密码

module.exports = index