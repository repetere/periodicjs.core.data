'use strict';

/**
 * Determines if value is a valid mongo id
 * @param  {*} value Any value to test
 * @return {Boolean}       Returns true if value is a valid mongo id
 */
module.exports = function isObjectId (value) {
	if (!value) return false;
	value = (typeof value === 'string') ? value : value.toString();
	return /^[0-9a-fA-F]{24,32}$/.test(value);
};