'use strict';
const mongoose = require('mongoose');
const path = require('path');

/**
 * Default changeset schema for mongo databases
 * @type {mongoose.Schema}
 */
const CHANGESET = new mongoose.Schema({
	createdat: {
		index: true,
    type: Date,
    default: Date.now
  },
  editor: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  editor_username: String,
  changeset: mongoose.Schema.Types.Mixed,
  parent_document: {
  	id: {
  		index: true,
  		type: mongoose.Schema.ObjectId
  	},
  	document_type: {
  		index: true,
  		type: String
  	}
  }
});

/**
 * Exports the changeset model as a singleton
 * @return {Object}                       Returns a mongo adapter with changeset as its model property
 */
module.exports = (function (Mongo_Adapter) {
  let ChangeSet = mongoose.model('Changeset', CHANGESET);
	let Changes = new Mongo_Adapter({
		model: ChangeSet,
    track_changes: false
	});
	return { Changes };
})(require(path.join(__dirname, '../adapters/mongo')));