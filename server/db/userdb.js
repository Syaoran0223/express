const {Sequelize,sequelize } = require('./main')
var User = sequelize.define('user', {
	// id: {
	// 	type: Sequelize.STRING(50),
	// 	primaryKey: true
	// },
	username: Sequelize.STRING(100),
	password: Sequelize.STRING(100),
	phone: Sequelize.BIGINT(100),
	email: Sequelize.STRING(100),
	openid: Sequelize.STRING(100),
	wechat: Sequelize.STRING(100),
	qq: Sequelize.STRING(100),
	ct: Sequelize.BIGINT,
	ut: Sequelize.BIGINT,
}, {
	timestamps: false
});

module.exports = User
