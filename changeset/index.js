'use strict';
const DEFAULTS = require('./defaults/index');
const mongo = require('./mongo');
const sql = require('./sql');
const loki = require('./loki');

module.exports = { 
	mongo_default: DEFAULTS.mongo,
	mongo,
	sql,
  loki,
  loki_default: DEFAULTS.loki
};
