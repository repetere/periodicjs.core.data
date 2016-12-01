'use strict';
const xss = require('xss');
const TAG_LIST = ['img','audio','video'];

/**
 * Sets default xss whitelist configuration
 * @return {Object}     Returns a default set of whitelist configuration data for xss module
 */
module.exports = function retrieveXSSDefaults () {
	return Object.assign(xss.whiteList, {
		onIgnoreTagAttr: function (tag, name, value, isWhitelisted) {
			if (name.substring(0, 5) === 'data-') return `${ name }="${ xss.escapeAttrValue(value) }"`;
		}
	}, {
		onTagAttr: function (tag, name, value, isWhitelisted) {
			if (TAG_LIST.indexOf(tag) !== -1 && name.toLowerCase() === 'src') return `${ name }="${ value }"`;
		}
	});
};