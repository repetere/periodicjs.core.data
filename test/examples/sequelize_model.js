'use strict';
const Sequelize = require('sequelize');

/**
 * Default changeset schema for sql databases
 */
const EXAMPLE = {
	createdat: {
		type: Sequelize.DATE
	},
	first_name: {
		type: Sequelize.STRING
	},
	last_name: {
		type: Sequelize.STRING
	},
	email: {
		type: Sequelize.STRING
	}
};

const MODEL_OPTIONS = {
	underscored: true,
	timestamps: true,
	indexes: [{
		fields: ['createdat']
	}]
};

module.exports = ['Example', EXAMPLE, MODEL_OPTIONS];