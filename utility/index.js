'use strict';
const depopulate = require('./depopulate');
const diff = require('./diff');
const filterqueries = require('./filterqueries');
const isObjectId = require('./mongoid');
const enforceXSSRules = require('./xss_character_escape');
const Cursor = require('./cursor');

module.exports = { depopulate, diff, isObjectId, enforceXSSRules, Cursor, filterqueries, };