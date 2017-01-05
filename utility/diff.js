'use strict';
const jsondiff = require('jsondiffpatch').create({});
const compare = jsondiff.diff.bind(jsondiff);
const str2json = require('string-to-json');
const depopulate = require('./depopulate');
const moment = require('moment');

/**
 * Removes reserved fields from objects and then does a comparison of values
 * @param  {Object} original       The original unmodified object
 * @param  {Object} revised        The updated object
 * @param  {Boolean} skipDepopulate If true objects will not be depopulated before doing the object comparison
 * @return {Object}                Returns the result of the object comparison
 */
module.exports = function objectdiff (original, revised, skipDepopulate) {
	let reservedKeys = ['__v','_id','changes','random','createdat','id'];
	let clones = {
		original: Object.assign({}, original),
		revised: Object.assign({}, revised)
	};
	for (let i = 0; i < reservedKeys.length; i++) {
		delete clones.original[reservedKeys[i]];
		delete clones.revised[reservedKeys[i]];
	}
	if (!skipDepopulate) {
		clones.original = depopulate(clones.original);
		clones.revised = depopulate(clones.revised);
	}
	let delta = compare(clones.original, clones.revised);
	return (delta) ? str2json.convert(delta) : {};
};