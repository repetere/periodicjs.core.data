'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports = new Schema({
	contact: {
		first_name: String,
		last_name: String,
		dob: Date
	},
	createdat: {
		type: Date,
		default: Date.now
	},
	updatedat: {
		type: Date,
		default: Date.now
	}
});