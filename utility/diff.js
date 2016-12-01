'use strict';
const compare = require('objectcompare');
const str2json = require('string-to-json');
const depopulate = require('./depopulate');
const moment = require('moment');

/**
 * Ensures that differences found in objects are not false positives
 * @param  {*}  original Any value to be compared against revised
 * @param  {*}  revised  Any value to be compared againt original
 * @return {Boolean}          Returns true if values are confirmed to be different
 */
var hasDifferentValues = function (original, revised) {
	let originalIsDate = (new Date(original).toString() === 'Invalid Date') ? false : true;
	let revisedIsDate = (new Date(revised).toString() === 'Invalid Date') ? false : true;
	if (original !== null && typeof original !== 'undefined' && revised !== null && typeof revised !== 'undefined' && original.toString() === revised.toString()) return false;
	else if (originalIsDate && revisedIsDate && moment(original).isValid() && moment(revisedIsDate).isValid() && moment(revised).isSame(original)) return false;
	else if (original === null && (revision === '' || revision === null || typeof revision === 'undefined')) return false;
	else if (revision === null && (original === '' || original === null || typeof original === 'undefined')) return false;
	return true;
};

/**
 * Removes reserved fields from objects and then does a comparison of values
 * @param  {Object} original       The original unmodified object
 * @param  {Object} revised        The updated object
 * @param  {Boolean} skipDepopulate If true objects will not be depopulated before doing the object comparison
 * @return {Object}                Returns the result of the object comparison
 */
module.exports = function objectdiff (original, revised, skipDepopulate) {
	let reservedKeys = ['__v','_id','changes','random','createdat'];
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
	let { equal, differences } = compare(clones.original, clones.revised);
	let diff = {};
	if (!equal) {
		for (let key in differences) {
			let { firstValue, secondValue } = differences[key];
			if (hasDifferentValues(firstValue, secondValue)) diff[key] = firstValue;
		}
	}
	return str2json.convert(diff);
};