'use strict';
const path = require('path');
const mongo = require(path.join(__dirname, './mongo'));
const sql = require(path.join(__dirname, './sql'));

module.exports = { mongo, sql };