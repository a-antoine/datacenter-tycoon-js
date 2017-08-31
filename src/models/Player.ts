let bcrypt = require('bcrypt');

module.exports = function(queryInterface: any, Sequelize: any) {
	const Player = queryInterface.define('Player', {
		id: {
			field: 'id',
			type: Sequelize.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		role: {
			field: 'role',
			type: Sequelize.ENUM('PLAYER', 'ADMIN')
		},
		username: {
			field: 'username',
			type: Sequelize.STRING(45)
		},
		password: {
			field: 'password',
			type: Sequelize.STRING
		},
		email: {
			email: 'email',
			type: Sequelize.STRING
		},
		companyName: {
			field: 'company_name',
			type: Sequelize.STRING(45)
		},
		balance: {
			field: 'balance',
			type: Sequelize.DECIMAL(18, 2)
		},
		createdAt: {
			field: 'created_at',
			type: Sequelize.DATE
		},
		updatedAt: {
			field: 'updated_at',
			type: Sequelize.DATE
		}
	}, {
		tableName: 'player'
	});

	Player.prototype.generateHash = function (password: string) {
		return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
	};

	Player.prototype.validPassword = function (password: string) {
		return bcrypt.compareSync(password, this.password);
	};

	return Player;
};