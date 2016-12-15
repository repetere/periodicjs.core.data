'use strict';
const DEFAULTS = require('./defaults/index');
const mongo = require('./mongo');

module.exports = { 
	mongo_default: DEFAULTS.mongo,
	mongo
};
