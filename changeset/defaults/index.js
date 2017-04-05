'use strict';
const path = require('path');
const mongo = require(path.join(__dirname, './mongo'));
const loki = require(path.join(__dirname, './loki'));

module.exports = {
	mongo: mongo.Changes,
  loki: loki.Changes
};