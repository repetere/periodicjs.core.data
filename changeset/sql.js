'use strict';
const path = require('path');
const SQL_Adapter = require(path.join(__dirname, '../adapters/sql'));
const Sequelize = require('sequelize');

/**
 * Default changeset schema for sql databases
 */
const CHANGESET = {
	createdat: {
		type: Sequelize.DATE
	},
	editor: {
		type: Sequelize.STRING
	},
	editor_username: {
		type: Sequelize.STRING
	},
	field_name: {
		type: Sequelize.STRING
	},
	original: {
		type: Sequelize.STRING
	},
	update: {
		type: Sequelize.STRING
	},
	parent_document_id: {
		type: Sequelize.STRING
	},
	parent_document_type: {
		type: Sequelize.STRING
	}
};

const MODEL_OPTIONS = {
	underscored: true,
	timestamps: true,
	indexes: [{
		fields: ['createdat']
	}, {
		fields: ['parent_document_id']
	}]
};

/**
 * Registers a changeset schema to a sequelize instance
 * @param  {Object} db_connection A sequelize connection where the changeset collection should be registered
 * @return {Object}               Returns an instance of a SQL_Adapter that has been configured for the changeset collection
 */
module.exports = function register_changeset (db_connection) {
  let ChangeSet;
  try {
    ChangeSet = db_connection.define('Changeset', CHANGESET, MODEL_OPTIONS);
  }
  catch (e) {
    ChangeSet = db_connection.models.Changeset;
  }
  return new SQL_Adapter({
    model: ChangeSet,
    track_changes: false
  });
};
