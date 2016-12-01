'use strict';

/**
 * Determines if value is a valid mongo id
 * @param  {*} value Any value to test
 * @return {Boolean}       Returns true if value is a valid mongo id
 */
module.exports = function isObjectId (value) {
	if (!value) return false;
	value = (typeof value === 'string') ? value : value.toString();
	if (value.length > 24) return false;
	return /^[0-9a-fA-F]{24}$/.test(value);
};