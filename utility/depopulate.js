'use strict';
const mongoose = require('mongoose');

/**
 * Depopulates a populated mongoose document
 * @param  {Object} data The mongoose document that should be depopulated
 * @return {Object}      Returns a fully depopulated mongoose document
 */
module.exports = function depopulate (data) {
	let depopulated = {};
	for (let key in data) {
		if (data[key] && typeof data[key] === 'object') {
			if (data[key]._id && mongoose.Types.ObjectId.isValid(data[key]._id.toString())) depopulated[key] = data[key]._id.toString();
			else depopulated[key] = depopulate(data[key]);
		}
		else depopulated[key] = data[key];
	}
	return depopulated;
};