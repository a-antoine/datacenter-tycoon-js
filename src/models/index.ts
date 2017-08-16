let Sequelize = require('sequelize');

let sequelize = new Sequelize(
	process.env.DATABASE_NAME,
	process.env.DATABASE_USERNAME,
	process.env.DATABASE_PASSWORD,
	{
		host: process.env.DATABASE_HOST,
		dialect: 'mysql',
		logging: false
	}
);

let models = [
	'Player'
];
models.forEach(function(model) {
	module.exports[model] = sequelize.import(__dirname + '/' + model);
});

(function(m) {


})(module.exports);

module.exports.sequelize = sequelize;
