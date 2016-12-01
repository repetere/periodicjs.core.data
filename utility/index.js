'use strict';
const depopulate = require('./depopulate');
const diff = require('./diff');
const isObjectId = require('./mongoid');
const enforceXSSRules = require('./xss_character_escape');

module.exports = { depopulate, diff, isObjectId, enforceXSSRules };