'use strict';
const DEFAULTS = require('./defaults/index');
const mongo = require('./mongo');
const sql = require('./sql');

module.exports = { 
	mongo_default: DEFAULTS.mongo,
	mongo,
	sql
};
