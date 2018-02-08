const Sequelize = require('sequelize')
const config = require('./dbConfig')
const sequelize = new Sequelize(config.database, config.user, config.password, {
	host: config.host,
	dialect: 'mysql',
	pool: {
		max: 5,
		min: 0,
		idle: 3000,
	},
	operatorsAliases: false,
})

module.exports = {
	Sequelize,
	sequelize
}