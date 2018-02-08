const Model = require('./model')
const {sequelize} = require('../db/main')
const {log, now} = require('../utils/utils')
const _ = require('lodash')
const userDB = require('../db/userdb')
const crypto = require('crypto')

class User extends Model {
	constructor(form) {
		super()
		// 用户名 密码 手机号 邮箱 qq号 微信 openid
		this.username = form.username || ''
		this.password = form.password || ''
		this.phone = form.phone || ''
		this.email = form.email || ''
		this.qq = form.qq || ''
		this.wechat = form.wechat || ''
		this.openid = form.openid || ''
		this.ct = now
		this.ut = now
	}

	// 根据用户名查找是否存在
	static async findByUsername(form) {
		const {username} = form
		const user = await userDB.find({
			where: {
				username: username,
			},
			raw: true,
		})
		return user
	}

	// 通过 id 查找用户
	static async findByUid(uid) {
		let u = await userDB.find({
			where: {
				id: uid,
			},
			raw: true,
		})
		return u
	}

	//	当前用户
	static async currentUser(request) {
		// 通过 session 获取 uid, 如果没有的话就设置成空字符串
		const fakeId = -1
		const uid = request.session.uid || fakeId
		const u = await User.findByUid(uid)
		if (u === null) {
			// 如果当前没有用户登录, 造一个占位的用户
			// 这样我们处理会非常方便,
			// 比如显示用户名就直接用 u.username
			// 而不需要 u !== null && u.username
			const fakeUser = {
				id: fakeId,
				username: '游客',
			}
			return fakeUser
		} else {
			return u
		}
	}

	// 加密
	static saltedPassword(password, salt = 'node8') {
		function _sha1(s) {
			const algorithm = 'sha1'
			const hash = crypto.createHash(algorithm)
			hash.update(s)
			const h = hash.digest('hex')
			return h
		}

		const hash1 = _sha1(password)
		const hash2 = _sha1(hash1 + salt)
		return hash2
	}

	// 创建
	static create(form) {
		const {username, password} = form
		form.password = this.saltedPassword(password)
		return new this(form)
	}

	// 注册
	static async register(form) {
		let r = true
		for (let f in form) {
			if (form[f] == '') {
				r = false
			}
		}
		if (r == false || form.username.length < 2 || form.password.length < 2) {
			log('请输入完整帐号密码')
			return false
		} else {
			// 查找是否存在相同用户名
			let result = await this.findByUsername(form)
			// 加密 存入数据
			if (result == null) {
				let cls = this.create(form)
				await userDB.create(cls)
				return true
			} else {
				return false
			}

		}
	}

	// 登录
	static async validateAuth(form) {
		let cls = this.create(form)
		// 查找用户是否存在
		let user = await this.findByUsername(form) || false
		if (user != false) {
			let valiUsername = user.username == cls.username
			let valiPassword = user.password == cls.password
			let vali = valiUsername && valiPassword
			if (vali == true) {
				return await this.findByUsername(form)
			} else {
				return false
			}
		} else {
			log('密码错误')
			return false
		}
	}
}


// 测试
const test = async() => {
	const form = {
		username: 'feng1',
		password: '1233',
	}
	// const u = User.create(form)
	// const u = await User.register(form)
	const u = await User.validateAuth(form)
	log('u', u)
}
if (require.main === module) {
	test()
}

module.exports = User